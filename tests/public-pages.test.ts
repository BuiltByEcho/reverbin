import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderDashboardLoginPage, renderDashboardPage, renderDashboardUnavailablePage, renderDocsPage, renderFaviconSvg, renderLandingPage } from '../src/public-pages.js';

test('landing page presents Reverbin as agent communication infrastructure', () => {
  const html = renderLandingPage();

  assert.match(html, /Reverbin/);
  assert.match(html, /Email for AI agents/);
  assert.match(html, /Reverbin is an email service for AI agents/);
  assert.match(html, /Give every agent a real email address/);
  assert.match(html, /Communication infrastructure for autonomous agents/);
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
  assert.match(html, /Use cases/);
  assert.match(html, /Questions agents and operators/);
  assert.match(html, /npm install @builtbyecho\/reverbin/);
  assert.match(html, /#B9FF2D/);
  assert.match(html, /rel="canonical" href="https:\/\/reverbin\.com\/"/);
  assert.match(html, /property="og:title" content="Reverbin - Communication infrastructure for autonomous agents"/);
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
  });

  assert.match(html, /Reverbin operations/);
  assert.match(html, /support@reverbin\.com/);
  assert.equal(html.includes('support@agents.reverbin.com'), false);
  assert.match(html, /email\.received/);
  assert.match(html, /Webhook deliveries/);
  assert.match(html, /Audit trail/);
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

test('dashboard login page includes password-manager friendly username context', () => {
  const html = renderDashboardLoginPage();

  assert.match(html, /autocomplete="username"/);
  assert.match(html, /autocomplete="current-password"/);
});
