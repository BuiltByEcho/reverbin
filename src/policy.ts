export type Policy = {
  reply_only: boolean;
  require_approval_for_new_recipients: boolean;
  require_approval_for_external_domains: boolean;
  max_outbound_per_hour: number;
  max_outbound_per_day: number;
  allowed_domains: string[];
  blocked_domains: string[];
  allowed_recipients: string[];
  blocked_recipients: string[];
  allow_attachments: boolean;
  allow_links: boolean;
  risk_threshold: 'low' | 'medium' | 'high';
};

export type PolicyInput = {
  to: string[];
  bodyText: string;
  bodyHtml?: string | null;
  attachments?: unknown[];
  isNewThread: boolean;
  knownRecipientEmails: string[];
  sentLastHour: number;
  sentLastDay: number;
};

export type PolicyDecision = {
  decision: 'allow' | 'require_approval' | 'block';
  reasons: string[];
  risk_flags: string[];
};

export const defaultPolicy: Policy = {
  reply_only: false,
  require_approval_for_new_recipients: false,
  require_approval_for_external_domains: false,
  max_outbound_per_hour: 10,
  max_outbound_per_day: 50,
  allowed_domains: [],
  blocked_domains: [],
  allowed_recipients: [],
  blocked_recipients: [],
  allow_attachments: false,
  allow_links: true,
  risk_threshold: 'medium',
};

const linkPattern = /https?:\/\/|www\./i;
const paymentPattern = /\b(payment|pay|wire|ach|bank account|routing number|invoice|crypto|wallet|refund)\b/i;
const passwordPattern = /\b(password|passcode|otp|2fa|verification code|seed phrase|private key|secret key)\b/i;
const legalPattern = /\b(contract|lawsuit|subpoena|legal|attorney|settlement)\b/i;
const promptInjectionPattern = /\b(ignore previous|system prompt|developer message|reveal your instructions|bypass policy)\b/i;

function domainOf(email: string) {
  return email.toLowerCase().split('@')[1] ?? '';
}

export function evaluatePolicy(policy: Policy, input: PolicyInput): PolicyDecision {
  const reasons = new Set<string>();
  const risk = new Set<string>();
  const recipients = input.to.map((item) => item.trim().toLowerCase()).filter(Boolean);
  const known = new Set(input.knownRecipientEmails.map((item) => item.trim().toLowerCase()));

  if (policy.reply_only && input.isNewThread) reasons.add('reply_only');
  if (input.sentLastHour >= policy.max_outbound_per_hour) reasons.add('hourly_rate_limit');
  if (input.sentLastDay >= policy.max_outbound_per_day) reasons.add('daily_rate_limit');

  for (const recipient of recipients) {
    const domain = domainOf(recipient);
    if (!known.has(recipient)) risk.add('first_time_recipient');
    if (policy.require_approval_for_new_recipients && !known.has(recipient)) reasons.add('first_time_recipient');
    if (policy.blocked_recipients.includes(recipient)) reasons.add('blocked_recipient');
    if (policy.allowed_recipients.length > 0 && !policy.allowed_recipients.includes(recipient)) reasons.add('recipient_not_allowed');
    if (policy.blocked_domains.includes(domain)) reasons.add('blocked_domain');
    if (policy.allowed_domains.length > 0 && !policy.allowed_domains.includes(domain)) reasons.add('domain_not_allowed');
    if (policy.require_approval_for_external_domains && policy.allowed_domains.length > 0 && !policy.allowed_domains.includes(domain)) risk.add('external_domain');
  }

  const body = `${input.bodyText}\n${input.bodyHtml ?? ''}`;
  if (linkPattern.test(body)) {
    risk.add('contains_link');
    if (!policy.allow_links) reasons.add('contains_link');
  }
  if ((input.attachments?.length ?? 0) > 0) {
    risk.add('contains_attachment');
    if (!policy.allow_attachments) reasons.add('contains_attachment');
  }
  if (paymentPattern.test(body)) risk.add('contains_payment_or_invoice_language');
  if (passwordPattern.test(body)) risk.add('contains_password_or_secret_language');
  if (legalPattern.test(body)) risk.add('contains_legal_language');
  if (promptInjectionPattern.test(body)) risk.add('possible_prompt_injection');

  const hardBlocks = ['reply_only', 'hourly_rate_limit', 'daily_rate_limit', 'blocked_recipient', 'blocked_domain', 'recipient_not_allowed', 'domain_not_allowed'];
  const reasonList = Array.from(reasons);
  const riskList = Array.from(risk);
  const decision = reasonList.some((reason) => hardBlocks.includes(reason))
    ? 'block'
    : reasonList.length > 0
      ? 'require_approval'
      : 'allow';

  return { decision, reasons: reasonList, risk_flags: riskList };
}
