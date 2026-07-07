import { ReverbinClient } from '../src/client.js';

async function main() {
  const reverbin = new ReverbinClient({
    baseUrl: process.env.REVERBIN_BASE_URL ?? 'https://api.reverbin.com',
    apiKey: process.env.REVERBIN_API_KEY,
  });

  const inbox = await reverbin.inboxes.create({
    email_address: process.env.REVERBIN_INBOX_EMAIL ?? 'dustin@reverbin.com',
    display_name: 'Hermes Agent',
  });

  await reverbin.webhooks.create({
    url: process.env.REVERBIN_WEBHOOK_URL ?? 'https://example.com/reverbin/webhook',
    events: ['email.received', 'email.sent'],
    secret: process.env.REVERBIN_WEBHOOK_SECRET,
  });

  const threads = await reverbin.inboxes.threads(inbox.id);
  const latest = threads.data[0];

  if (latest) {
    await reverbin.threads.reply(latest.id, {
      text: 'Received — I am handling this from an autonomous agent workflow.',
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
