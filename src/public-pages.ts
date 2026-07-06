export function renderLandingPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reverbin — Programmable email for autonomous agents</title>
  <meta name="description" content="Reverbin gives autonomous agents programmable inboxes, thread APIs, signed webhooks, and delivery logs on real email infrastructure." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: #000;
      --panel: rgba(255,255,255,.035);
      --panel-strong: rgba(255,255,255,.065);
      --text: #f4f4f5;
      --muted: rgba(244,244,245,.68);
      --soft: rgba(244,244,245,.44);
      --frost: rgba(214,235,253,.19);
      --frost-strong: rgba(214,235,253,.32);
      --blue: #3b82f6;
      --cyan: #67e8f9;
      --green: #34d399;
      --orange: #fb923c;
      --shadow: 0 0 0 1px rgba(176,199,217,.11), 0 30px 120px rgba(0,0,0,.54);
    }
    * { box-sizing: border-box; }
    html { background: var(--bg); }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 20% -5%, rgba(37,99,235,.34), transparent 32rem),
        radial-gradient(circle at 90% 8%, rgba(20,184,166,.12), transparent 26rem),
        linear-gradient(180deg, #02030a 0%, #000 52%, #030303 100%);
      color: var(--text);
      overflow-x: hidden;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,.72), transparent 62%);
    }
    a { color: inherit; text-decoration: none; }
    main { position: relative; max-width: 1180px; margin: 0 auto; padding: 34px 24px 64px; }
    nav { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom: 82px; }
    .brand { display:flex; align-items:center; gap:10px; font-size: 18px; font-weight: 700; letter-spacing: -.04em; }
    .mark { width: 28px; height: 28px; border-radius: 9px; border: 1px solid var(--frost); background: linear-gradient(135deg, rgba(59,130,246,.9), rgba(103,232,249,.16)); box-shadow: 0 0 36px rgba(59,130,246,.32); }
    .navlinks { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .button { display:inline-flex; align-items:center; justify-content:center; min-height: 42px; padding: 0 16px; border:1px solid var(--frost); border-radius:999px; background: rgba(255,255,255,.035); color: var(--text); font-size:14px; font-weight:500; transition: border-color .18s ease, background .18s ease, transform .18s ease; }
    .button:hover { border-color: var(--frost-strong); background: rgba(255,255,255,.075); transform: translateY(-1px); }
    .primary { background: #f4f4f5; color: #030303; border-color:#fff; box-shadow: 0 16px 48px rgba(255,255,255,.12); }
    .secondary { color: var(--muted); }
    .hero { display:grid; grid-template-columns:minmax(0,1.08fr) minmax(360px,.92fr); gap:48px; align-items:center; }
    .eyebrow { display:inline-flex; gap:8px; align-items:center; color:#bfdbfe; border:1px solid rgba(59,130,246,.46); background:rgba(59,130,246,.12); border-radius:999px; padding:8px 12px; font-size:13px; font-weight:500; box-shadow: inset 0 0 24px rgba(59,130,246,.08); }
    .dot { width:7px; height:7px; border-radius:999px; background:var(--green); box-shadow:0 0 18px var(--green); }
    h1 { margin:24px 0 22px; max-width:760px; font-size: clamp(54px, 7.2vw, 94px); line-height:.92; letter-spacing:-.08em; font-weight:700; }
    .lede { max-width: 690px; color: rgba(244,244,245,.78); font-size: 20px; line-height:1.65; margin:0 0 28px; }
    .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom: 28px; }
    .proof-row { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:10px; max-width:690px; }
    .proof { border:1px solid var(--frost); background:rgba(255,255,255,.028); border-radius:16px; padding:13px 14px; }
    .proof strong { display:block; font-size:18px; letter-spacing:-.03em; margin-bottom:3px; }
    .proof span { color:var(--soft); font-size:12px; }
    .console { border:1px solid var(--frost); border-radius:28px; background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.025)); box-shadow: var(--shadow); overflow:hidden; }
    .console-top { display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--frost); padding:13px 16px; color:var(--soft); font-size:12px; }
    .lights { display:flex; gap:7px; }
    .light { width:9px; height:9px; border-radius:999px; background:#3f3f46; }
    .light:nth-child(1) { background:#fb7185; } .light:nth-child(2) { background:#fbbf24; } .light:nth-child(3) { background:#34d399; }
    .code { padding:22px; font-family:'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:13px; line-height:1.85; color:#e5e7eb; }
    .code .verb { color:var(--green); font-weight:600; } .code .path { color:#f8fafc; } .code .key { color:#93c5fd; } .code .str { color:#fdba74; } .code .muted { color:#71717a; }
    .status-strip { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); border:1px solid var(--frost); border-radius:24px; margin:56px 0 16px; overflow:hidden; background:rgba(255,255,255,.025); }
    .status { padding:18px; border-right:1px solid var(--frost); }
    .status:last-child { border-right:0; }
    .status b { display:block; font-size:14px; margin-bottom:5px; } .status span { color:var(--soft); font-size:13px; }
    .section-head { display:flex; align-items:end; justify-content:space-between; gap:24px; margin:54px 0 18px; }
    .section-head h2 { font-size:38px; line-height:1; letter-spacing:-.055em; margin:0; }
    .section-head p { color:var(--muted); max-width:520px; margin:0; line-height:1.55; }
    .grid { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:16px; }
    .card { position:relative; min-height:190px; border:1px solid var(--frost); background:linear-gradient(180deg, rgba(255,255,255,.052), rgba(255,255,255,.022)); border-radius:24px; padding:24px; overflow:hidden; }
    .card::after { content:""; position:absolute; inset:auto -30% -60% 10%; height:120px; background:radial-gradient(circle, rgba(59,130,246,.16), transparent 68%); }
    .icon { width:34px; height:34px; border-radius:12px; display:grid; place-items:center; border:1px solid var(--frost); background:rgba(255,255,255,.04); margin-bottom:28px; color:var(--cyan); }
    .card h3 { margin:0 0 10px; font-size:20px; letter-spacing:-.035em; }
    .card p { color:rgba(244,244,245,.64); line-height:1.58; margin:0; }
    .events { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
    code, .tag { font-family:'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; border:1px solid rgba(214,235,253,.14); background:rgba(255,255,255,.055); border-radius:999px; padding:5px 8px; color:#dbeafe; font-size:12px; }
    .band { margin-top:18px; border:1px solid var(--frost); border-radius:28px; padding:26px; background:linear-gradient(135deg, rgba(59,130,246,.13), rgba(255,255,255,.025) 44%, rgba(52,211,153,.08)); display:flex; align-items:center; justify-content:space-between; gap:20px; }
    .band h2 { margin:0; letter-spacing:-.05em; font-size:30px; }
    .band p { margin:7px 0 0; color:var(--muted); }
    footer { display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px; color:#71717a; margin-top:38px; font-size:13px; }
    @media (max-width: 880px) {
      main { padding:24px 18px 48px; }
      nav { margin-bottom:52px; align-items:flex-start; flex-direction:column; }
      .hero, .grid, .proof-row, .status-strip { grid-template-columns:1fr; }
      .console { min-width:0; }
      .status { border-right:0; border-bottom:1px solid var(--frost); }
      .status:last-child { border-bottom:0; }
      .section-head, .band { align-items:flex-start; flex-direction:column; }
      h1 { font-size: clamp(46px, 15vw, 70px); }
    }
  </style>
</head>
<body>
  <main>
    <nav>
      <a class="brand" href="/" aria-label="Reverbin home"><span class="mark"></span><span>Reverbin</span></a>
      <div class="navlinks">
        <a class="button secondary" href="/docs">API docs</a>
        <a class="button secondary" href="/dashboard/login">Dashboard</a>
        <a class="button primary" href="/docs">Start building</a>
      </div>
    </nav>

    <section class="hero">
      <div>
        <span class="eyebrow"><span class="dot"></span>agents.reverbin.com inboxes are live</span>
        <h1>Programmable email for autonomous agents.</h1>
        <p class="lede">Give each agent a real email identity, a thread-aware API, signed webhooks, audit trails, and policy controls — without slowing normal replies down with human approval loops.</p>
        <div class="hero-actions">
          <a class="button primary" href="/docs">Read the API docs</a>
          <a class="button" href="/dashboard/login">Open dashboard</a>
        </div>
        <div class="proof-row" aria-label="Live Reverbin proof points">
          <div class="proof"><strong>Live MX</strong><span>Inbound routed for agents.reverbin.com</span></div>
          <div class="proof"><strong>Queued webhooks</strong><span>BullMQ worker with delivery logs</span></div>
          <div class="proof"><strong>Resend-backed</strong><span>Deliverability handled by real email infra</span></div>
        </div>
      </div>

      <aside class="console" aria-label="Reverbin quickstart console">
        <div class="console-top"><div class="lights"><span class="light"></span><span class="light"></span><span class="light"></span></div><span>api.reverbin.com</span></div>
        <div class="code">
          <div><span class="verb">POST</span> <span class="path">/v1/inboxes</span></div>
          <div>{ <span class="key">"email_address"</span>: <span class="str">"agent@agents.reverbin.com"</span> }</div>
          <br />
          <div><span class="verb">POST</span> <span class="path">/v1/webhooks</span></div>
          <div>{ <span class="key">"events"</span>: [<span class="str">"email.received"</span>, <span class="str">"email.sent"</span>] }</div>
          <br />
          <div><span class="verb">GET</span> <span class="path">/v1/inboxes/:id/threads</span></div>
          <div class="muted">// thread-aware inbox automation</div>
        </div>
      </aside>
    </section>

    <section class="status-strip" aria-label="Current Reverbin platform status">
      <div class="status"><b>API</b><span>Health + ready checks live</span></div>
      <div class="status"><b>Receiving</b><span>Resend inbound webhook active</span></div>
      <div class="status"><b>Sending</b><span>Direct replies with audit logs</span></div>
      <div class="status"><b>Dashboard</b><span>App-token protected ops view</span></div>
    </section>

    <section class="section-head">
      <h2>Email that agents can operate.</h2>
      <p>Reverbin owns the agent-native control plane — inboxes, policies, threads, webhooks, and observability — while trusted providers handle the messy deliverability layer.</p>
    </section>

    <section class="grid" aria-label="Reverbin capabilities">
      <article class="card"><div class="icon">@</div><h3>Real inboxes for agents</h3><p>Create addresses under <code>agents.reverbin.com</code>, receive mail, and keep conversations organized by thread.</p></article>
      <article class="card"><div class="icon">↗</div><h3>Webhook-first automation</h3><p>Deliver signed <span class="tag">email.received</span> and <span class="tag">email.sent</span> events to agent runtimes with retryable delivery rows.</p></article>
      <article class="card"><div class="icon">✓</div><h3>Guardrails without friction</h3><p>Default sends go through. Blocks, risk flags, audit logs, and optional approvals remain available for stricter policies.</p></article>
    </section>

    <section class="band">
      <div><h2>Built for autonomous workflows, not manual inbox babysitting.</h2><p>Start with the API, wire a webhook, and let the agent handle the conversation.</p></div>
      <a class="button primary" href="/docs">View API reference</a>
    </section>

    <footer><span>Built by Echo.</span><span>Programmable inboxes · signed webhooks · Resend-backed deliverability</span></footer>
  </main>
</body>
</html>`;
}

export function renderDocsRedirectPage() {
  return `<!doctype html><html><head><title>Reverbin API docs</title><meta http-equiv="refresh" content="0; url=https://github.com/BuiltByEcho/agent-email-layer/blob/main/docs/API.md"></head><body><p>Reverbin API docs live at <a href="https://github.com/BuiltByEcho/agent-email-layer/blob/main/docs/API.md">docs/API.md</a>.</p></body></html>`;
}
