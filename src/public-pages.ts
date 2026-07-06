export function renderLandingPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reverbin — Programmable email for autonomous agents</title>
  <meta name="description" content="Reverbin gives autonomous agents programmable inboxes, thread APIs, signed webhooks, and delivery logs on real email infrastructure." />
  <style>
    :root { color-scheme: dark; --bg:#07070a; --panel:#111114; --muted:#a1a1aa; --line:#27272a; --text:#fafafa; --blue:#60a5fa; --green:#34d399; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top left, #172554 0, transparent 32rem), var(--bg); color:var(--text); }
    main { max-width:1120px; margin:0 auto; padding:36px 22px 56px; }
    nav { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:72px; }
    .brand { font-weight:800; letter-spacing:-0.04em; font-size:22px; }
    .navlinks { display:flex; gap:12px; flex-wrap:wrap; }
    a { color:inherit; text-decoration:none; }
    .button { display:inline-flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:999px; padding:10px 15px; background:rgba(17,17,20,.74); }
    .primary { border-color:#2563eb; background:#2563eb; }
    .hero { display:grid; grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr); gap:28px; align-items:center; }
    h1 { font-size: clamp(42px, 8vw, 86px); line-height:.92; letter-spacing:-0.075em; margin:0 0 22px; }
    .lede { color:#d4d4d8; font-size:20px; line-height:1.65; max-width:720px; }
    .pill { display:inline-flex; color:#bfdbfe; border:1px solid #1d4ed8; background:rgba(37,99,235,.18); border-radius:999px; padding:8px 12px; font-size:14px; margin-bottom:18px; }
    .card { border:1px solid var(--line); background:rgba(17,17,20,.82); border-radius:24px; padding:22px; box-shadow:0 20px 70px rgba(0,0,0,.28); }
    .terminal { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:14px; line-height:1.7; color:#d4d4d8; }
    .terminal strong { color:var(--green); font-weight:600; }
    .grid { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:16px; margin-top:36px; }
    .grid .card h2 { margin:0 0 8px; font-size:18px; }
    .grid .card p { color:var(--muted); line-height:1.55; margin:0; }
    .events { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
    code { border:1px solid var(--line); background:#18181b; border-radius:8px; padding:3px 7px; color:#bfdbfe; }
    footer { color:#71717a; margin-top:42px; font-size:14px; }
    @media (max-width: 820px) { .hero,.grid { grid-template-columns: 1fr; } nav { align-items:flex-start; flex-direction:column; } }
  </style>
</head>
<body>
  <main>
    <nav>
      <a class="brand" href="/">Reverbin</a>
      <div class="navlinks">
        <a class="button" href="/docs">API docs</a>
        <a class="button" href="/dashboard/login">Dashboard</a>
        <a class="button primary" href="https://api.reverbin.com/health">API health</a>
      </div>
    </nav>

    <section class="hero">
      <div>
        <span class="pill">agents.reverbin.com inboxes are live</span>
        <h1>Programmable email for autonomous agents.</h1>
        <p class="lede">Reverbin gives each agent a real email identity, thread-aware API, signed webhooks, audit logs, and policy controls without making humans approve every normal reply.</p>
        <div class="events">
          <code>email.received</code><code>email.sent</code><code>threads</code><code>webhooks</code><code>audit logs</code>
        </div>
      </div>
      <div class="card terminal" aria-label="Reverbin quickstart">
        <div><strong>POST</strong> /v1/inboxes</div>
        <div>{ "email_address": "agent@agents.reverbin.com" }</div>
        <br />
        <div><strong>POST</strong> /v1/webhooks</div>
        <div>{ "events": ["email.received", "email.sent"] }</div>
        <br />
        <div><strong>GET</strong> /v1/inboxes/:id/threads</div>
      </div>
    </section>

    <section class="grid" aria-label="Reverbin capabilities">
      <article class="card"><h2>Real inboxes for agents</h2><p>Create addresses under <code>agents.reverbin.com</code>, ingest inbound mail, and keep conversations organized by thread.</p></article>
      <article class="card"><h2>Webhook-first automation</h2><p>Deliver signed events to agent runtimes and retry through a queued worker when endpoints are unavailable.</p></article>
      <article class="card"><h2>Guardrails without friction</h2><p>Default flows send immediately while risk flags, blocks, audit logs, and optional approvals remain available for stricter policies.</p></article>
    </section>

    <footer>Built by Echo. Powered by an agent-native control plane with Resend-backed deliverability.</footer>
  </main>
</body>
</html>`;
}

export function renderDocsRedirectPage() {
  return `<!doctype html><html><head><title>Reverbin API docs</title><meta http-equiv="refresh" content="0; url=https://github.com/BuiltByEcho/agent-email-layer/blob/main/docs/API.md"></head><body><p>Reverbin API docs live at <a href="https://github.com/BuiltByEcho/agent-email-layer/blob/main/docs/API.md">docs/API.md</a>.</p></body></html>`;
}
