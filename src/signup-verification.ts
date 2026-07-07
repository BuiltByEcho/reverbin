import { isAllowedWebhookUrl } from './webhooks.js';

export const SIGNUP_REQUEST_STATUSES = ['pending', 'approved', 'rejected', 'provisioned'] as const;
export type SignupRequestStatus = typeof SIGNUP_REQUEST_STATUSES[number];

export const SIGNUP_VERIFICATION_STATUSES = ['pending', 'passed', 'failed'] as const;
export type SignupVerificationStatus = typeof SIGNUP_VERIFICATION_STATUSES[number];

export type SignupVerificationCheck = {
  key: string;
  label: string;
  required: boolean;
  status: SignupVerificationStatus;
  evidence?: string;
};

export const DEFAULT_SIGNUP_VERIFICATION_CHECKS = [
  { key: 'use_case_review', label: 'Use case is agent/email related and not spam or cold-outreach abuse', required: true },
  { key: 'inbox_name_review', label: 'Preferred inbox name is available and acceptable', required: true },
  { key: 'webhook_url_review', label: 'Webhook URL is HTTPS/public or intentionally omitted for API-only use', required: true },
  { key: 'dns_domain_review', label: 'Receiving-domain status is clear: beta domain or verified custom/root domain', required: true },
  { key: 'post_provision_smoke', label: 'Post-provision smoke sent inbound, reply, and webhook-delivery checks', required: true },
] as const;

export type SignupRequestInput = {
  requester_email: string;
  requester_name?: string;
  agent_use_case: string;
  preferred_inbox_name?: string;
  webhook_url?: string;
  notes?: string;
};

export type NormalizedSignupRequest = SignupRequestInput & {
  status: SignupRequestStatus;
  verification_json: SignupVerificationCheck[];
};

function optionalTrim(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function buildPendingSignupVerification(): SignupVerificationCheck[] {
  return DEFAULT_SIGNUP_VERIFICATION_CHECKS.map((check) => ({ ...check, status: 'pending' }));
}

export function normalizeSignupRequestInput(input: SignupRequestInput): NormalizedSignupRequest {
  const requesterEmail = input.requester_email.trim().toLowerCase();
  const agentUseCase = input.agent_use_case.trim();
  const webhookUrl = optionalTrim(input.webhook_url);

  if (!requesterEmail.includes('@')) throw new Error('requester_email must be an email address');
  if (!agentUseCase) throw new Error('agent_use_case is required');
  if (webhookUrl && !isAllowedWebhookUrl(webhookUrl)) {
    throw new Error('webhook_url must be a public HTTPS URL or loopback local-test URL');
  }

  return {
    requester_email: requesterEmail,
    requester_name: optionalTrim(input.requester_name),
    agent_use_case: agentUseCase,
    preferred_inbox_name: optionalTrim(input.preferred_inbox_name)?.toLowerCase(),
    webhook_url: webhookUrl,
    notes: optionalTrim(input.notes),
    status: 'pending',
    verification_json: buildPendingSignupVerification(),
  };
}

export function summarizeSignupVerification(checks: SignupVerificationCheck[]) {
  const required = checks.filter((check) => check.required);
  const passed = required.filter((check) => check.status === 'passed').length;
  const failed = required.filter((check) => check.status === 'failed').length;
  const pending = required.filter((check) => check.status === 'pending').length;
  return {
    required: required.length,
    passed,
    failed,
    pending,
    ready_to_provision: required.length > 0 && passed === required.length && failed === 0 && pending === 0,
  };
}
