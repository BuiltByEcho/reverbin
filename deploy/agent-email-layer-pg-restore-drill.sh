#!/usr/bin/env bash
set -euo pipefail
umask 077

BACKUP_DIR=${BACKUP_DIR:-/var/backups/agent-email-layer/postgres}
latest=$(find "$BACKUP_DIR" -maxdepth 1 -type f -name 'agent_email_layer_*.dump' -printf '%T@ %p\n' | sort -nr | head -1 | cut -d' ' -f2-)

if [[ -z "${latest:-}" || ! -f "$latest" ]]; then
  echo "no backup dump found in $BACKUP_DIR" >&2
  exit 1
fi

sha_file="$latest.sha256"
if [[ ! -f "$sha_file" ]]; then
  echo "missing checksum file: $sha_file" >&2
  exit 1
fi

(cd "$BACKUP_DIR" && sha256sum -c "$(basename "$sha_file")" >/dev/null)

stamp=$(date -u +%Y%m%d%H%M%S)
restore_db="agent_email_layer_restore_drill_${stamp}"
tmp_dump="/tmp/${restore_db}.dump"

cleanup() {
  rm -f "$tmp_dump"
  sudo -u postgres dropdb --if-exists "$restore_db" >/dev/null 2>&1 || true
}
trap cleanup EXIT

install -o postgres -g postgres -m 0600 "$latest" "$tmp_dump"
sudo -u postgres createdb "$restore_db"
sudo -u postgres pg_restore --exit-on-error --dbname="$restore_db" "$tmp_dump"

expected_tables='agents,api_keys,approval_requests,audit_logs,inboxes,messages,provider_events,send_policies,signup_requests,tenants,threads,webhook_deliveries,webhook_endpoints'
table_count=$(sudo -u postgres psql -d "$restore_db" -Atc "select count(*) from information_schema.tables where table_schema='public' and table_name = any(string_to_array('$expected_tables', ','));")
if [[ "$table_count" != "13" ]]; then
  echo "restore drill failed: expected 13 Reverbin tables, found $table_count" >&2
  exit 1
fi

row_summary=$(sudo -u postgres psql -d "$restore_db" -Atc "select 'tenants=' || count(*) from tenants union all select 'inboxes=' || count(*) from inboxes union all select 'messages=' || count(*) from messages union all select 'signup_requests=' || count(*) from signup_requests union all select 'webhook_deliveries=' || count(*) from webhook_deliveries order by 1;")
printf 'restore_drill_ok backup=%s db=%s tables=%s\n%s\n' "$latest" "$restore_db" "$table_count" "$row_summary"
