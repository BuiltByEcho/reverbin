import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderLandingPage } from '../src/public-pages.js';

test('landing page presents Reverbin as agent communication infrastructure', () => {
  const html = renderLandingPage();

  assert.match(html, /Reverbin/);
  assert.match(html, /Communication infrastructure for autonomous agents/);
  assert.match(html, /agents\.reverbin\.com/);
  assert.match(html, /href="\/docs"/);
  assert.match(html, /href="\/dashboard\/login"/);
  assert.match(html, /email\.received/);
  assert.match(html, /email\.sent/);
  assert.match(html, /thread\.created/);
  assert.match(html, /#C6FF6E/);
  assert.equal(html.includes('#B8734A'), false);
  assert.equal(html.includes('copper'), false);
  assert.equal(html.includes('MVP'), false);
  assert.equal(html.includes('approvals dashboard'), false);
  assert.equal(html.includes('internal'), false);
});
