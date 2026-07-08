import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../sql/schema.sql');

async function main() {
  const schema = await fs.readFile(schemaPath, 'utf8');
  await pool.query(schema);
  await pool.query(`
    ALTER TABLE tenants
      ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS billing_status text NOT NULL DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS stripe_customer_id text,
      ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
      ADD COLUMN IF NOT EXISTS billing_current_period_end timestamptz;

    ALTER TABLE threads
      ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenants_plan_check'
      ) THEN
        ALTER TABLE tenants ADD CONSTRAINT tenants_plan_check CHECK (plan IN ('free', 'developer', 'startup', 'enterprise'));
      END IF;
    END $$;

    ALTER TABLE send_policies
      ALTER COLUMN require_approval_for_new_recipients SET DEFAULT false,
      ALTER COLUMN require_approval_for_external_domains SET DEFAULT false,
      ALTER COLUMN allow_links SET DEFAULT true;

    UPDATE send_policies
    SET require_approval_for_new_recipients = false,
        require_approval_for_external_domains = false,
        allow_links = true,
        updated_at = now()
    WHERE reply_only = false
      AND require_approval_for_new_recipients = true
      AND require_approval_for_external_domains = true
      AND allow_links = false
      AND allowed_domains_json = '[]'::jsonb
      AND blocked_domains_json = '[]'::jsonb
      AND allowed_recipients_json = '[]'::jsonb
      AND blocked_recipients_json = '[]'::jsonb;
  `);
  await pool.end();
  console.log('agent-email-layer migration complete');
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
