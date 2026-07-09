import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderDashboardLoginPage, renderDashboardPage, renderDashboardUnavailablePage, renderDocsPage, renderFaviconSvg, renderLandingPage, renderLegalPage, renderSignupPage } from '../src/public-pages.js';

test('landing page presents Reverbin as agent communication infrastructure', () => {
  const html = renderLandingPage();

  assert.match(html, /Reverbin/);
  assert.match(html, /Email for AI agents/);
  assert.match(html, /Reverbin is an email service for AI agents/);
  assert.match(html, /Give every agent a real email address/);
  assert.equal(html.includes('Communication infrastructure for autonomous agents'), false);
  assert.match(html, /user@reverbin\.com/);
  assert.match(html, /support@reverbin\.com/);
  assert.equal(html.includes('agents.reverbin.com'), false);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/dashboard\/login"/);
  assert.match(html, /Sign up/);
  assert.equal(html.includes('Request access'), false);
  assert.match(html, /email\.received/);
  assert.match(html, /email\.sent/);
  assert.match(html, /thread\.created/);
  assert.match(html, /How a message moves through Reverbin/);
  assert.match(html, /Provider receives email/);
  assert.match(html, /Reverbin stores context/);
  assert.match(html, /Runtime gets the event/);
  assert.match(html, /Agent answers in thread/);
  assert.match(html, /Live inbox/);
  assert.match(html, /API-owned inboxes/);
  assert.match(html, /Explore Reverbin/);
  assert.match(html, /Use cases/);
  assert.match(html, /npm install @builtbyecho\/reverbin/);
  assert.match(html, /#B9FF2D/);
  assert.match(html, /rel="canonical" href="https:\/\/reverbin\.com\/"/);
  assert.match(html, /property="og:title" content="Reverbin - Email for AI agents"/);
  assert.match(html, /<title>Reverbin - Email for AI agents<\/title>/);
  assert.equal(html.includes('Reverbin - Communication infrastructure for autonomous agents'), false);
  assert.equal(Array.from(html.matchAll(/<svg[^>]*aria-hidden="true"[^>]*>/g)).every((match) => match[0].includes('focusable="false"')), true);
  assert.equal(html.includes('proces...KEY'), false);
  assert.equal(html.includes('class="network"'), false);
  assert.equal(html.includes('hero-mark'), false);
  assert.equal(html.includes('#B8734A'), false);
  assert.equal(html.includes('copper'), false);
  assert.equal(html.includes('MVP'), false);
  assert.equal(html.includes('approvals dashboard'), false);
  assert.equal(html.includes('internal planning'), false);
  assert.equal(html.includes('Email Inboxes for AI Agents'), false);
  assert.equal(html.includes('Start for free'), false);
  assert.equal(html.includes('No credit card required'), false);
});

test('landing page pricing explains the upgrade value beyond raw mailbox counts', () => {
  const html = renderLandingPage();

  assert.match(html, /Start with a real agent inbox/);
  assert.match(html, /Best for testing one agent workflow/);
  assert.match(html, /Build production agent email flows/);
  assert.match(html, /For solo builders shipping real agents/);
  assert.match(html, /Scale a team or beta product/);
  assert.match(html, /For startups running multiple agents/);
  assert.match(html, /10 mailboxes/);
  assert.match(html, /100 mailboxes/);
  assert.match(html, /3 webhook endpoints/);
  assert.match(html, /10 webhook endpoints/);
  assert.match(html, /Start free\. Upgrade when your agent needs more room\./);
  assert.match(html, /Create a free agent first, then move to Developer or Startup from Billing/);
  assert.match(html, /<a class="button primary" href="\/mail\/billing">Upgrade in Billing<\/a>/);
  assert.equal((html.match(/href="\/mail\/billing">Upgrade in Billing<\/a>/g) ?? []).length, 2);
  assert.equal(html.includes('hosted Stripe Checkout upgrade flow'), false);
  assert.equal(html.includes('Upgrade with Checkout'), false);
  assert.equal(html.includes('View billing API'), false);
  assert.equal(html.includes('href="/docs/api#billing-and-plan-upgrades"'), false);
});

test('landing page consolidates secondary information into accessible tabs', () => {
  const html = renderLandingPage();

  assert.match(html, /data-section-id="landing-tabs"/);
  assert.match(html, /role="tablist"/);
  assert.equal((html.match(/<button[^>]+role="tab"/g) ?? []).length, 5);
  assert.equal((html.match(/<article[^>]+role="tabpanel"/g) ?? []).length, 5);
  for (const tabId of ['overview', 'flow', 'developers', 'operations', 'use-cases']) {
    assert.match(html, new RegExp(`data-tab-id="${tabId}"`));
    assert.match(html, new RegExp(`id="reverbin-tab-${tabId}"`));
    assert.match(html, new RegExp(`id="reverbin-panel-${tabId}"`));
    assert.match(html, new RegExp(`aria-controls="reverbin-panel-${tabId}"`));
    assert.match(html, new RegExp(`aria-labelledby="reverbin-tab-${tabId}"`));
  }
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /hidden aria-hidden="true"/);
  assert.match(html, /selectReverbinTab/);
  assert.match(html, /addEventListener\('click'/);
  assert.match(html, /addEventListener\('keydown'/);
  assert.equal(html.includes('<section class="section" id="flow"'), false);
  assert.equal(html.includes('<section class="section" id="developers"'), false);
  assert.equal(html.includes('<section class="section" id="operations"'), false);
  assert.equal(html.includes('<section class="section" id="trust"'), false);
  assert.equal(html.includes('<section class="section" id="faq"'), false);
});

test('docs pages render a branded first-party documentation surface', () => {
  const overview = renderDocsPage('overview');
  const quickstart = renderDocsPage('quickstart');
  const api = renderDocsPage('api');
  const agents = renderDocsPage('agents');

  for (const html of [overview, quickstart, api, agents]) {
    assert.match(html, /Reverbin docs/);
    assert.match(html, /class="docs-shell"/);
    assert.match(html, /href="\/docs\/quickstart"/);
    assert.match(html, /href="\/docs\/api"/);
    assert.match(html, /href="\/docs\/agents"/);
    assert.match(html, /href="\/llms\.txt"/);
    assert.match(html, /Sign up/);
    assert.equal(html.includes('github.com/BuiltByEcho/reverbin/blob/main/docs/API.md'), false);
    assert.equal(html.includes('http-equiv="refresh"'), false);
    assert.equal(html.includes('Request access'), false);
    assert.equal(html.includes('agents.reverbin.com'), false);
  }

  assert.match(overview, /Docs built for humans and agents/);
  assert.match(overview, /Quickstart/);
  assert.match(quickstart, /Create an inbox/);
  assert.match(api, /POST \/v1\/inboxes/);
  assert.match(api, /x-echo-email-signature/);
  assert.match(agents, /Treat email content as untrusted user input/);
});

test('Stripe public detail pages expose support, privacy, and terms URLs', () => {
  const support = renderLegalPage('support');
  const privacy = renderLegalPage('privacy');
  const terms = renderLegalPage('terms');

  assert.match(support, /Customer support/);
  assert.match(support, /support@reverbin\.com/);
  assert.match(support, /href="mailto:support@reverbin\.com"/);
  assert.match(support, /rel="canonical" href="https:\/\/reverbin\.com\/support"/);
  assert.match(privacy, /Privacy Policy/);
  assert.match(privacy, /information Reverbin collects/);
  assert.match(privacy, /security practices/);
  assert.match(privacy, /rel="canonical" href="https:\/\/reverbin\.com\/privacy"/);
  assert.match(terms, /Terms of Service/);
  assert.match(terms, /subscriptions/);
  assert.match(terms, /hosted Stripe Checkout/);
  assert.match(terms, /rel="canonical" href="https:\/\/reverbin\.com\/terms"/);
  for (const html of [support, privacy, terms]) {
    assert.match(html, /Reverbin/);
    assert.match(html, /href="\/"/);
    assert.match(html, /href="\/docs"/);
    assert.equal(html.includes('Lorem ipsum'), false);
  }
});

test('docs renderer turns markdown tables into readable HTML tables', () => {
  const html = renderDocsPage('quickstart', `# Quickstart

| Symptom | What to check |
| --- | --- |
| \`401\` from \`/v1/*\` | Missing or wrong bearer token. |
`);

  assert.match(html, /<div class="docs-table-wrap"><table>/);
  assert.match(html, /<th>Symptom<\/th>/);
  assert.match(html, /<td><code>401<\/code> from <code>\/v1\/\*<\/code><\/td>/);
  assert.equal(html.includes('docs-table-line'), false);
  assert.equal(html.includes('| Symptom | What to check |'), false);
});

test('docs pages include desktop and mobile overflow guards for long API content', () => {
  const api = renderDocsPage('api');

  assert.match(api, /\.docs-shell \{[\s\S]*?overflow-x: hidden;/);
  assert.match(api, /\.docs-layout,[\s\S]*?\.docs-nav \{[\s\S]*?min-width: 0;[\s\S]*?max-width: 100%;/);
  assert.match(api, /\.docs-article pre \{[^}]*max-width:\s*100%;[^}]*overflow-x:\s*auto;[^}]*white-space:\s*pre-wrap;[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(api, /\.docs-article code \{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*break-word;/);
  assert.match(api, /\.docs-article pre code \{[^}]*white-space:\s*pre-wrap;[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*break-word;/);
  assert.match(api, /@media \(max-width: 760px\)/);
  assert.match(api, /\.docs-shell \{ padding: 18px; overflow-x: hidden; \}/);
});

test('favicon renderer exposes the branded lime Reverbin mark', () => {
  const svg = renderFaviconSvg();

  assert.match(svg, /^<svg /);
  assert.match(svg, /viewBox="0 0 512 512"/);
  assert.match(svg, /#B9FF2D/);
  assert.equal(svg.includes('#B8734A'), false);
});

test('dashboard page renders branded operational tables with escaped data', () => {
  const html = renderDashboardPage({
    inboxes: [
      { id: 'inb_1', email_address: 'support@reverbin.com', display_name: 'Support <Agent>', status: 'active', created_at: new Date('2026-07-06T17:42:00Z') },
    ],
    messages: [
      { id: 'msg_1', inbox_id: 'inb_1', thread_id: 'thr_1', direction: 'inbound', from_email: 'sender@example.com', subject: '<hello>', created_at: new Date('2026-07-06T17:43:00Z') },
    ],
    deliveries: [
      { id: 'whd_1', endpoint_id: 'wh_1', event_type: 'email.received', status: 'delivered', attempts: 1, created_at: new Date('2026-07-06T17:44:00Z'), delivered_at: new Date('2026-07-06T17:44:01Z') },
    ],
    audits: [
      { action: 'email.received', target_type: 'message', target_id: 'msg_1', created_at: new Date('2026-07-06T17:45:00Z') },
    ],
    signupRequests: [
      {
        id: 'sgr_1',
        requester_email: 'founder@example.com',
        preferred_inbox_name: 'founder',
        status: 'pending',
        verification_json: [
          { key: 'use_case_review', label: 'Use case review', required: true, status: 'pending' },
          { key: 'requester_contact_verified', label: 'Requester contact verified', required: true, status: 'passed' },
        ],
        verification_summary: { required: 2, passed: 1, failed: 0, pending: 1, ready_to_provision: false },
        created_at: new Date('2026-07-06T17:46:00Z'),
      },
    ],
  });

  assert.match(html, /Reverbin operations/);
  assert.match(html, /support@reverbin\.com/);
  assert.equal(html.includes('support@agents.reverbin.com'), false);
  assert.match(html, /email\.received/);
  assert.match(html, /Webhook deliveries/);
  assert.match(html, /Audit trail/);
  assert.match(html, /founder@example\.com/);
  assert.match(html, /action="\/dashboard\/signup-requests\/sgr_1\/checks"/);
  assert.match(html, /name="check_key" value="use_case_review"/);
  assert.match(html, /name="check_status" value="passed"/);
  assert.match(html, /name="status" value="approved"/);
  assert.match(html, /Use case review/);
  assert.match(html, /1\/2 passed/);
  assert.match(html, /Support &lt;Agent&gt;/);
  assert.match(html, /&lt;hello&gt;/);
  assert.equal(html.includes('<hello>'), false);
});

test('dashboard page gives operators useful empty states', () => {
  const html = renderDashboardPage({
    inboxes: [],
    messages: [],
    deliveries: [],
    audits: [],
  });

  assert.match(html, /No inboxes yet/);
  assert.match(html, /No messages stored yet/);
  assert.match(html, /No webhook deliveries yet/);
  assert.match(html, /No audit activity yet/);
});

test('dashboard unavailable page explains database readiness without leaking internals', () => {
  const html = renderDashboardUnavailablePage('connect ECONNREFUSED 127.0.0.1:5432');

  assert.match(html, /Operations temporarily unavailable/);
  assert.match(html, /Postgres readiness/);
  assert.match(html, /\/readyz/);
  assert.equal(html.includes('ECONNREFUSED'), false);
  assert.equal(html.includes('127.0.0.1'), false);
});

test('dashboard login page starts with one email field and keeps code entry separate', () => {
  const html = renderDashboardLoginPage();

  assert.match(html, /Email me a sign-in code/);
  assert.match(html, /Use the email you signed up with/);
  assert.match(html, /action="\/dashboard\/login\/request-code"/);
  assert.match(html, /name="email"/);
  assert.match(html, /autocomplete="email"/);
  assert.doesNotMatch(html, /action="\/dashboard\/login\/verify"/);
  assert.doesNotMatch(html, /autocomplete="one-time-code"/);
  assert.equal((html.match(/name="email"/g) ?? []).length, 1);
  assert.match(html, /Advanced: API key or operator token/);
  assert.match(html, /<details class="advanced-login" open>/);
  assert.match(html, /Have an API key from signup\? Paste it here/);
  assert.match(html, /API key or operator token/);
  assert.match(html, /autocomplete="username"/);
  assert.match(html, /autocomplete="current-password"/);
  assert.doesNotMatch(html, /Operational dashboard access/);
  assert.doesNotMatch(html, /Enter the dashboard token configured for this deployment/);
  assert.doesNotMatch(html, /app token/);
});

test('signup and dashboard login keep primary mobile tap targets at least 44px tall', () => {
  const signup = renderSignupPage();
  const login = renderDashboardLoginPage();

  assert.match(signup, /\.brand \{[^}]*min-height:\s*44px;/);
  assert.match(login, /\.brand \{[^}]*min-height:\s*44px;/);
  assert.match(login, /\.advanced-login summary \{[^}]*min-height:\s*44px;/);
  assert.match(login, /\.advanced-login summary \{[^}]*display:\s*flex;/);
  assert.match(login, /\.advanced-login summary \{[^}]*align-items:\s*center;/);
});

test('dashboard login code page reuses the submitted email so users only type numbers', () => {
  const html = renderDashboardLoginPage('', 'We sent a sign-in code.', 'Builder+Smoke@Example.com');

  assert.match(html, /Check your email/);
  assert.match(html, /Builder\+Smoke@Example\.com/);
  assert.match(html, /action="\/dashboard\/login\/verify"/);
  assert.match(html, /type="hidden" name="email" value="Builder\+Smoke@Example\.com"/);
  assert.match(html, /name="code"/);
  assert.match(html, /autocomplete="one-time-code"/);
  assert.match(html, /autofocus required/);
  assert.doesNotMatch(html, /id="code-email"/);
  assert.doesNotMatch(html, /type="email" name="email"/);
  assert.equal((html.match(/name="email"/g) ?? []).length, 1);
});
