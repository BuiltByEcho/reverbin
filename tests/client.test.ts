import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { ReverbinClient, ReverbinApiError } from '../src/client.js';

type FetchCall = { url: string; init: RequestInit };

function installFetchStub(response: unknown, status = 200) {
  const calls: FetchCall[] = [];
  const previous = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
  return {
    calls,
    restore() {
      globalThis.fetch = previous;
    },
  };
}

test('client creates inboxes with bearer auth and JSON body', async () => {
  const stub = installFetchStub({ id: 'inb_123', email_address: 'agent@agents.reverbin.com' }, 201);
  try {
    const client = new ReverbinClient({ baseUrl: 'https://api.reverbin.com/', apiKey: 'key_test' });
    const inbox = await client.inboxes.create({ email_address: 'agent@agents.reverbin.com', display_name: 'Agent' });

    assert.equal(inbox.id, 'inb_123');
    assert.equal(stub.calls.length, 1);
    assert.equal(stub.calls[0].url, 'https://api.reverbin.com/v1/inboxes');
    assert.equal(stub.calls[0].init.method, 'POST');
    assert.equal((stub.calls[0].init.headers as Record<string, string>).authorization, 'Bearer key_test');
    assert.equal((stub.calls[0].init.headers as Record<string, string>)['content-type'], 'application/json');
    assert.deepEqual(JSON.parse(String(stub.calls[0].init.body)), {
      email_address: 'agent@agents.reverbin.com',
      display_name: 'Agent',
    });
  } finally {
    stub.restore();
  }
});

test('client exposes thread reply and webhook creation helpers', async () => {
  const stub = installFetchStub({ message_id: 'msg_123' });
  try {
    const client = new ReverbinClient({ baseUrl: 'https://api.reverbin.com', apiKey: 'key_test' });

    await client.threads.reply('thr_123', { text: 'hello' });
    await client.webhooks.create({ url: 'https://agent.example/hook', events: ['email.received', 'email.sent'] });

    assert.equal(stub.calls[0].url, 'https://api.reverbin.com/v1/threads/thr_123/reply');
    assert.equal(stub.calls[1].url, 'https://api.reverbin.com/v1/webhooks');
    assert.deepEqual(JSON.parse(String(stub.calls[1].init.body)), {
      url: 'https://agent.example/hook',
      events: ['email.received', 'email.sent'],
    });
  } finally {
    stub.restore();
  }
});

test('client throws typed API errors without leaking bearer tokens', async () => {
  const stub = installFetchStub({ error: 'unauthorized' }, 401);
  try {
    const client = new ReverbinClient({ baseUrl: 'https://api.reverbin.com', apiKey: 'secret_key_should_not_leak' });
    await assert.rejects(
      () => client.inboxes.list(),
      (error) => {
        assert.ok(error instanceof ReverbinApiError);
        assert.equal(error.status, 401);
        assert.equal(error.message.includes('secret_key_should_not_leak'), false);
        assert.equal(JSON.stringify(error.body).includes('secret_key_should_not_leak'), false);
        return true;
      },
    );
  } finally {
    stub.restore();
  }
});
