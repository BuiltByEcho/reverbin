CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tenants (
  id text PRIMARY KEY,
  name text NOT NULL,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'developer', 'startup', 'enterprise')),
  billing_status text NOT NULL DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  billing_current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agents (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inboxes (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id text REFERENCES agents(id) ON DELETE SET NULL,
  provider_id text NOT NULL DEFAULT 'mock',
  email_address text NOT NULL UNIQUE,
  display_name text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS threads (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  inbox_id text NOT NULL REFERENCES inboxes(id) ON DELETE CASCADE,
  subject text NOT NULL DEFAULT '(no subject)',
  last_message_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  inbox_id text NOT NULL REFERENCES inboxes(id) ON DELETE CASCADE,
  thread_id text NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  provider_message_id text,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_email text NOT NULL,
  from_name text,
  to_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  cc_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  bcc_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  subject text NOT NULL DEFAULT '(no subject)',
  text_body text NOT NULL DEFAULT '',
  html_body text,
  raw_mime_storage_key text,
  headers_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  risk_flags_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary text,
  received_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread_created ON messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_inbox_created ON messages(inbox_id, created_at DESC);

CREATE TABLE IF NOT EXISTS send_policies (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  inbox_id text NOT NULL UNIQUE REFERENCES inboxes(id) ON DELETE CASCADE,
  reply_only boolean NOT NULL DEFAULT false,
  require_approval_for_new_recipients boolean NOT NULL DEFAULT false,
  require_approval_for_external_domains boolean NOT NULL DEFAULT false,
  max_outbound_per_hour integer NOT NULL DEFAULT 10,
  max_outbound_per_day integer NOT NULL DEFAULT 50,
  allowed_domains_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  blocked_domains_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  allowed_recipients_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  blocked_recipients_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  allow_attachments boolean NOT NULL DEFAULT false,
  allow_links boolean NOT NULL DEFAULT true,
  risk_threshold text NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  inbox_id text NOT NULL REFERENCES inboxes(id) ON DELETE CASCADE,
  agent_id text REFERENCES agents(id) ON DELETE SET NULL,
  thread_id text REFERENCES threads(id) ON DELETE SET NULL,
  proposed_to_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  subject text NOT NULL DEFAULT '(no subject)',
  body_text text NOT NULL DEFAULT '',
  body_html text,
  risk_flags_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  policy_reasons_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sent', 'failed')),
  provider_result_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  actor_type text NOT NULL,
  actor_id text,
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS provider_events (
  id text PRIMARY KEY,
  provider text NOT NULL,
  event_type text NOT NULL,
  payload_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret text,
  events_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  endpoint_id text REFERENCES webhook_endpoints(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  payload_json jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz
);

CREATE TABLE IF NOT EXISTS signup_requests (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  requester_email text NOT NULL,
  requester_name text,
  agent_use_case text NOT NULL,
  preferred_inbox_name text,
  webhook_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'provisioned')),
  verification_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_signup_requests_status_created ON signup_requests(status, created_at DESC);

CREATE TABLE IF NOT EXISTS api_keys (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  scopes_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS dashboard_login_codes (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  requester_email text NOT NULL,
  code_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_dashboard_login_codes_email_created ON dashboard_login_codes(requester_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_login_codes_expires ON dashboard_login_codes(expires_at);

CREATE TABLE IF NOT EXISTS dashboard_sessions (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  session_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_dashboard_sessions_expires ON dashboard_sessions(expires_at);

INSERT INTO tenants (id, name)
VALUES ('ten_default', 'BuiltByEcho')
ON CONFLICT (id) DO NOTHING;

INSERT INTO agents (id, tenant_id, name)
VALUES ('agt_default', 'ten_default', 'Default Agent')
ON CONFLICT (id) DO NOTHING;
