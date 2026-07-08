export type ReverbinClientOptions = {
  baseUrl?: string;
  apiKey?: string;
  fetch?: typeof globalThis.fetch;
};

export type ReverbinPolicy = {
  reply_only?: boolean;
  require_approval_for_new_recipients?: boolean;
  require_approval_for_external_domains?: boolean;
  max_outbound_per_hour?: number;
  max_outbound_per_day?: number;
  allowed_domains?: string[];
  blocked_domains?: string[];
  allowed_recipients?: string[];
  blocked_recipients?: string[];
  allow_attachments?: boolean;
  allow_links?: boolean;
  risk_threshold?: 'low' | 'medium' | 'high';
};

export type CreateInboxInput = {
  email_address: string;
  display_name?: string;
  agent_id?: string;
  policy?: ReverbinPolicy;
};

export type Inbox = {
  id: string;
  email_address: string;
  display_name?: string | null;
  status?: string;
  policy?: ReverbinPolicy;
  [key: string]: unknown;
};

export type Thread = {
  id: string;
  inbox_id: string;
  subject: string;
  messages?: Message[];
  [key: string]: unknown;
};

export type Message = {
  id: string;
  direction: 'inbound' | 'outbound';
  subject: string;
  text_body?: string;
  html_body?: string | null;
  [key: string]: unknown;
};

export type ReplyInput = {
  to?: string[];
  subject?: string;
  text: string;
  html?: string | null;
  attachments?: unknown[];
};

export type CreateWebhookInput = {
  url: string;
  events?: string[];
  secret?: string;
};

export type AgentSignupInput = {
  requester_email: string;
  agent_name: string;
  agent_use_case: string;
  preferred_inbox_name: string;
  webhook_url?: string;
};

export type AgentSignupResult = {
  status: 'provisioned';
  signup_request_id: string;
  tenant_id: string;
  agent: { id: string; name: string };
  inbox: Inbox;
  api_key: { id: string; token: string; scopes: string[]; returned_once: boolean };
  webhook?: (WebhookEndpoint & { secret?: string; secret_returned_once?: boolean }) | null;
  quickstart: { base_url: string; inbox_email: string; next_steps: string[] };
};

export type WebhookEndpoint = {
  id: string;
  url: string;
  events?: string[];
  events_json?: string[];
  status: string;
  [key: string]: unknown;
};

export type ListResponse<T> = { data: T[] };

export class ReverbinApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Reverbin API request failed with status ${status}`);
    this.name = 'ReverbinApiError';
    this.status = status;
    this.body = body;
  }
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export class ReverbinClient {
  readonly baseUrl: string;
  readonly apiKey?: string;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(options: ReverbinClientOptions = {}) {
    this.baseUrl = stripTrailingSlash(options.baseUrl ?? 'https://api.reverbin.com');
    this.apiKey = options.apiKey;
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (!this.fetchImpl) throw new Error('fetch is not available; pass ReverbinClient({ fetch })');
  }

  readonly signups = {
    create: (input: AgentSignupInput) => this.request<AgentSignupResult>('/v1/agent-signups', { method: 'POST', body: input }),
  };

  readonly inboxes = {
    create: (input: CreateInboxInput) => this.request<Inbox>('/v1/inboxes', { method: 'POST', body: input }),
    list: () => this.request<ListResponse<Inbox>>('/v1/inboxes'),
    get: (id: string) => this.request<Inbox>(`/v1/inboxes/${encodeURIComponent(id)}`),
    threads: (id: string) => this.request<ListResponse<Thread>>(`/v1/inboxes/${encodeURIComponent(id)}/threads`),
  };

  readonly threads = {
    get: (id: string) => this.request<Thread>(`/v1/threads/${encodeURIComponent(id)}`),
    reply: (id: string, input: ReplyInput) => this.request<{ message_id?: string; approval_id?: string; status?: string; provider_result?: unknown }>(`/v1/threads/${encodeURIComponent(id)}/reply`, { method: 'POST', body: input }),
  };

  readonly webhooks = {
    create: (input: CreateWebhookInput) => this.request<WebhookEndpoint>('/v1/webhooks', { method: 'POST', body: input }),
    list: () => this.request<ListResponse<WebhookEndpoint>>('/v1/webhooks'),
    deliveries: () => this.request<ListResponse<Record<string, unknown>>>('/v1/webhook-deliveries'),
  };

  readonly auditLogs = {
    list: () => this.request<ListResponse<Record<string, unknown>>>('/v1/audit-logs'),
  };

  private async request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (this.apiKey) headers.authorization = `Bearer ${this.apiKey}`;
    if (options.body !== undefined) headers['content-type'] = 'application/json';

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    const body = await parseResponseBody(response);
    if (!response.ok) throw new ReverbinApiError(response.status, body);
    return body as T;
  }
}

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return JSON.parse(text);
  return text;
}
