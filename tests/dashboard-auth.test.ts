import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { dashboardCookie, isDashboardRequestAuthorized, parseDashboardCookies } from '../src/dashboard-auth.js';

test('dashboard auth accepts bearer token or dashboard cookie only when a token is configured', () => {
  assert.equal(isDashboardRequestAuthorized({}, undefined), false);
  assert.equal(isDashboardRequestAuthorized({}, ''), false);

  assert.equal(isDashboardRequestAuthorized({}, 'secret-token'), false);
  assert.equal(isDashboardRequestAuthorized({ authorization: 'Bearer secret-token' }, 'secret-token'), true);
  assert.equal(isDashboardRequestAuthorized({ authorization: 'Bearer wrong' }, 'secret-token'), false);
  assert.equal(isDashboardRequestAuthorized({ cookie: 'theme=dark; reverbin_dashboard=secret-token' }, 'secret-token'), true);
  assert.equal(isDashboardRequestAuthorized({ cookie: 'reverbin_dashboard=wrong' }, 'secret-token'), false);
});

test('dashboard cookie is httpOnly and does not expose unrelated values', () => {
  const header = dashboardCookie('secret-token', { secure: true, maxAgeSeconds: 60 });

  assert.match(header, /^reverbin_dashboard=secret-token;/);
  assert.match(header, /HttpOnly/);
  assert.match(header, /SameSite=Lax/);
  assert.match(header, /Secure/);
  assert.match(header, /Max-Age=60/);
  assert.equal(header.includes('wrong'), false);
});

test('dashboard cookie parser handles spacing and encoded values', () => {
  assert.deepEqual(parseDashboardCookies(' a = 1 ; reverbin_dashboard=s3cret%20value ; theme=dark '), {
    a: '1',
    reverbin_dashboard: 's3cret value',
    theme: 'dark',
  });
});
