import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultPolicy, evaluatePolicy } from '../src/policy.js';

test('default policy allows first-time recipients with links while surfacing risk flags', () => {
  const result = evaluatePolicy(defaultPolicy, {
    to: ['person@example.com'],
    bodyText: 'Please review https://builtbyecho.xyz',
    isNewThread: false,
    knownRecipientEmails: [],
    sentLastHour: 0,
    sentLastDay: 0,
  });

  assert.equal(result.decision, 'allow');
  assert.deepEqual(result.reasons, []);
  assert.ok(result.risk_flags.includes('first_time_recipient'));
  assert.ok(result.risk_flags.includes('contains_link'));
});

test('approval remains opt-in for first-time recipients', () => {
  const result = evaluatePolicy({ ...defaultPolicy, require_approval_for_new_recipients: true }, {
    to: ['person@example.com'],
    bodyText: 'Quick follow-up',
    isNewThread: false,
    knownRecipientEmails: [],
    sentLastHour: 0,
    sentLastDay: 0,
  });

  assert.equal(result.decision, 'require_approval');
  assert.ok(result.reasons.includes('first_time_recipient'));
  assert.ok(result.risk_flags.includes('first_time_recipient'));
});

test('reply-only blocks new thread', () => {
  const result = evaluatePolicy({ ...defaultPolicy, reply_only: true }, {
    to: ['known@example.com'],
    bodyText: 'Hello',
    isNewThread: true,
    knownRecipientEmails: ['known@example.com'],
    sentLastHour: 0,
    sentLastDay: 0,
  });

  assert.equal(result.decision, 'block');
  assert.ok(result.reasons.includes('reply_only'));
});

test('known recipient without risky content is allowed', () => {
  const result = evaluatePolicy(defaultPolicy, {
    to: ['known@example.com'],
    bodyText: 'Thanks, we received this.',
    isNewThread: false,
    knownRecipientEmails: ['known@example.com'],
    sentLastHour: 0,
    sentLastDay: 0,
  });

  assert.equal(result.decision, 'allow');
});

test('blocked recipient is still a hard block', () => {
  const result = evaluatePolicy({ ...defaultPolicy, blocked_recipients: ['blocked@example.com'] }, {
    to: ['blocked@example.com'],
    bodyText: 'Hello',
    isNewThread: false,
    knownRecipientEmails: [],
    sentLastHour: 0,
    sentLastDay: 0,
  });

  assert.equal(result.decision, 'block');
  assert.ok(result.reasons.includes('blocked_recipient'));
});
