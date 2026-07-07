#!/usr/bin/env bash
set -euo pipefail
umask 077

ENV_FILE=${ENV_FILE:-/etc/agent-email-layer/env}
BACKUP_DIR=${BACKUP_DIR:-/var/backups/agent-email-layer/postgres}
RETENTION_DAYS=${AGENT_EMAIL_BACKUP_RETENTION_DAYS:-14}

if [[ ! -r "$ENV_FILE" ]]; then
  echo "missing env file: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 0700 "$BACKUP_DIR"

stamp=$(date -u +%Y%m%dT%H%M%SZ)
tmp="$BACKUP_DIR/agent_email_layer_${stamp}.dump.tmp"
out="$BACKUP_DIR/agent_email_layer_${stamp}.dump"

pg_dump --dbname="$DATABASE_URL" --format=custom --compress=9 --file="$tmp"
mv "$tmp" "$out"
chmod 0600 "$out"
sha256sum "$out" > "$out.sha256"
chmod 0600 "$out.sha256"

find "$BACKUP_DIR" -type f \( -name "agent_email_layer_*.dump" -o -name "agent_email_layer_*.dump.sha256" \) -mtime +"$RETENTION_DAYS" -delete
printf "%s\n" "$out"
