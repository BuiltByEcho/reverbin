import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderLandingPage } from '../src/public-pages.js';

test('landing page presents Reverbin as a programmable email server for agents', () => {
  const html = renderLandingPage();

  assert.match(html, /Reverbin/);
  assert.match(html, /Programmable email for autonomous agents/);
  assert.match(html, /agents\.reverbin\.com/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/dashboard\/login"/);
  assert.match(html, /email\.received/);
  assert.match(html, /email\.sent/);
  assert.equal(html.includes('MVP'), false);
  assert.equal(html.includes('approvals dashboard'), false);
  assert.equal(html.includes('internal'), false);
});
