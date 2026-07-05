export type OutboundEmailInput = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string | null;
  replyToMessageId?: string | null;
};

export type SendResult = {
  provider: string;
  provider_message_id: string;
  status: 'sent' | 'mocked';
};

export interface EmailProvider {
  sendEmail(input: OutboundEmailInput): Promise<SendResult>;
}

class MockProvider implements EmailProvider {
  async sendEmail(input: OutboundEmailInput): Promise<SendResult> {
    return {
      provider: 'mock',
      provider_message_id: `mock_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      status: 'mocked',
    };
  }
}

class ResendProvider implements EmailProvider {
  constructor(private readonly apiKey: string) {}

  async sendEmail(input: OutboundEmailInput): Promise<SendResult> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: input.from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html || undefined,
        headers: input.replyToMessageId ? { 'In-Reply-To': input.replyToMessageId } : undefined,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Resend send failed: ${response.status} ${JSON.stringify(payload)}`);
    }

    return {
      provider: 'resend',
      provider_message_id: String(payload.id ?? `resend_${Date.now()}`),
      status: 'sent',
    };
  }
}

export function getEmailProvider(): EmailProvider {
  const provider = (process.env.EMAIL_PROVIDER ?? 'mock').toLowerCase();
  if (provider === 'resend') {
    if (!process.env.RESEND_API_KEY) throw new Error('EMAIL_PROVIDER=resend requires RESEND_API_KEY');
    return new ResendProvider(process.env.RESEND_API_KEY);
  }
  return new MockProvider();
}
