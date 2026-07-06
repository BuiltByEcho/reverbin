const reverbinMarkSvg = `<svg class="brand-mark" viewBox="0 0 96 96" aria-hidden="true">
  <circle cx="48" cy="48" r="42" fill="#070808" stroke="rgba(244,244,242,.34)" stroke-width="1.5"/>
  <path d="M48 10a38 38 0 0 1 34 21" fill="none" stroke="#C6FF6E" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M86 49a38 38 0 0 1-18 32" fill="none" stroke="rgba(189,230,211,.72)" stroke-width="2" stroke-linecap="round"/>
  <path d="M29 83A38 38 0 0 1 13 40" fill="none" stroke="rgba(244,244,242,.48)" stroke-width="2" stroke-linecap="round"/>
  <path d="M26 26h25c13 0 22 8 22 20s-9 20-22 20H26" fill="none" stroke="#F4F4F2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 72V26" stroke="#F4F4F2" stroke-width="7" stroke-linecap="round"/>
  <path d="M48 66l22 21" stroke="#F4F4F2" stroke-width="7" stroke-linecap="round"/>
  <path d="M31 45h19c5 0 8 2 8 6s-3 6-8 6H31" fill="none" stroke="#C6FF6E" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>
  <circle cx="73" cy="31" r="3.2" fill="#C6FF6E"/>
  <circle cx="70" cy="87" r="2.6" fill="#BDE6D3"/>
</svg>`;

export function renderLandingPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reverbin — Communication infrastructure for autonomous agents</title>
  <meta name="description" content="Reverbin gives autonomous agents real inboxes, signed webhooks, threaded conversations, and delivery logs on production email infrastructure." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --black: #0A0A0A;
      --charcoal: #121416;
      --graphite: #1A1D20;
      --ivory: #F4F4F2;
      --muted: rgba(244,244,242,.68);
      --soft: rgba(244,244,242,.42);
      --line: rgba(244,244,242,.14);
      --line-strong: rgba(244,244,242,.26);
      --mint: #BDE6D3;
      --signal: #C6FF6E;
      --shadow: 0 0 0 1px rgba(244,244,242,.08), 0 34px 140px rgba(0,0,0,.66);
    }
    * { box-sizing: border-box; }
    html { background: var(--black); }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--ivory);
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 72% 12%, rgba(198,255,110,.10), transparent 24rem),
        radial-gradient(circle at 24% -10%, rgba(189,230,211,.09), transparent 30rem),
        linear-gradient(180deg, #060707 0%, #0A0A0A 48%, #050505 100%);
      overflow-x: hidden;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: .74;
      background-image:
        linear-gradient(rgba(244,244,242,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,244,242,.025) 1px, transparent 1px);
      background-size: 52px 52px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,.9), transparent 70%);
    }
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(0deg, rgba(255,255,255,.018), rgba(255,255,255,.018) 1px, transparent 1px, transparent 4px);
      opacity: .22;
      mix-blend-mode: screen;
    }
    a { color: inherit; text-decoration: none; }
    main { position: relative; max-width: 1210px; margin: 0 auto; padding: 34px 24px 64px; }
    nav { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom: 76px; }
    .brand { display:flex; align-items:center; gap:12px; font-size: 20px; font-family: Georgia, 'Times New Roman', serif; letter-spacing: -.045em; }
    .brand-mark { width: 38px; height: 38px; filter: drop-shadow(0 0 28px rgba(198,255,110,.18)); }
    .navlinks { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .button { display:inline-flex; align-items:center; justify-content:center; min-height: 42px; padding: 0 16px; border:1px solid var(--line); border-radius:999px; background: rgba(255,255,255,.025); color: var(--ivory); font-size:14px; font-weight:500; transition: border-color .18s ease, background .18s ease, transform .18s ease; }
    .button:hover { border-color: var(--line-strong); background: rgba(255,255,255,.06); transform: translateY(-1px); }
    .primary { background: var(--ivory); color: #050505; border-color: var(--ivory); box-shadow: 0 16px 48px rgba(244,244,242,.10); }
    .signal-button { border-color: rgba(198,255,110,.34); color: var(--signal); background: rgba(198,255,110,.055); }
    .hero { display:grid; grid-template-columns:minmax(0,1fr) minmax(390px,.95fr); gap:48px; align-items:center; }
    .eyebrow { display:inline-flex; gap:9px; align-items:center; color:var(--mint); border:1px solid rgba(189,230,211,.28); background:rgba(189,230,211,.055); border-radius:999px; padding:8px 12px; font-family:'Geist Mono', ui-monospace, monospace; font-size:12px; letter-spacing:.02em; }
    .dot { width:7px; height:7px; border-radius:999px; background:var(--signal); box-shadow:0 0 18px var(--signal); }
    h1 { margin:24px 0 22px; max-width:760px; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(52px, 7vw, 90px); line-height:.94; letter-spacing:-.075em; font-weight:400; text-wrap: balance; }
    .lede { max-width: 680px; color: rgba(244,244,242,.75); font-size: 19px; line-height:1.65; margin:0 0 28px; }
    .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom: 28px; }
    .proof-row { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:10px; max-width:700px; }
    .proof { border:1px solid var(--line); background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.018)); border-radius:16px; padding:13px 14px; }
    .proof strong { display:block; font-size:17px; letter-spacing:-.03em; margin-bottom:3px; }
    .proof span { color:var(--soft); font-size:12px; }
    .relay { position:relative; min-height: 500px; border:1px solid var(--line); border-radius:32px; background: radial-gradient(circle at 52% 36%, rgba(198,255,110,.12), transparent 18rem), linear-gradient(180deg, rgba(255,255,255,.052), rgba(255,255,255,.018)); box-shadow: var(--shadow); overflow:hidden; }
    .relay::before { content:""; position:absolute; inset:0; background-image: linear-gradient(90deg, rgba(198,255,110,.13) 1px, transparent 1px), linear-gradient(rgba(198,255,110,.11) 1px, transparent 1px); background-size: 44px 44px; opacity:.16; mask-image: radial-gradient(circle at 58% 46%, black, transparent 72%); }
    .relay-box { position:absolute; inset:96px 54px auto; height:250px; border:1px solid rgba(244,244,242,.13); border-radius:28px; background:linear-gradient(145deg, #181B1D, #070808 58%, #111416); box-shadow: 0 40px 110px rgba(0,0,0,.65), inset 0 1px rgba(255,255,255,.08); transform: perspective(900px) rotateX(56deg) rotateZ(-18deg); }
    .relay-box .box-mark { position:absolute; width:130px; height:130px; left:50%; top:50%; transform:translate(-50%,-50%) rotateZ(18deg) rotateX(-56deg); opacity:.95; }
    .port { position:absolute; right:54px; bottom:62px; width:54px; height:54px; border-radius:999px; border:2px solid rgba(244,244,242,.42); box-shadow:0 0 0 8px rgba(189,230,211,.035), 0 0 32px rgba(198,255,110,.16); }
    .port::after { content:""; position:absolute; inset:15px; border-radius:999px; background:var(--mint); box-shadow:0 0 22px var(--mint); }
    .relay-labels { position:absolute; left:42px; bottom:44px; display:grid; gap:9px; font-family:'Geist Mono', monospace; font-size:11px; color:var(--soft); letter-spacing:.16em; text-transform:uppercase; }
    .relay-labels span::after { content:""; display:inline-block; width:6px; height:6px; border-radius:999px; background:var(--signal); margin-left:9px; box-shadow:0 0 13px var(--signal); }
    .trace { position:absolute; height:1px; background:linear-gradient(90deg, transparent, rgba(198,255,110,.65), transparent); opacity:.58; }
    .trace.t1 { width:64%; left:2%; top:32%; } .trace.t2 { width:82%; right:-18%; top:56%; } .trace.t3 { width:54%; left:14%; bottom:22%; }
    .relay-network { position:absolute; inset:28px; width:calc(100% - 56px); height:calc(100% - 56px); opacity:.44; }
    .relay-network path { stroke:rgba(189,230,211,.34); stroke-width:1; }
    .relay-network circle { fill:var(--signal); filter:drop-shadow(0 0 8px rgba(198,255,110,.6)); }
    .status-strip { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); border:1px solid var(--line); border-radius:24px; margin:56px 0 16px; overflow:hidden; background:rgba(255,255,255,.02); }
    .status { padding:18px; border-right:1px solid var(--line); }
    .status:last-child { border-right:0; }
    .status b { display:block; font-size:14px; margin-bottom:5px; } .status span { color:var(--soft); font-size:13px; }
    .section-head { display:flex; align-items:end; justify-content:space-between; gap:24px; margin:54px 0 18px; }
    .section-head h2 { font-family: Georgia, 'Times New Roman', serif; font-size:42px; font-weight:400; line-height:1; letter-spacing:-.055em; margin:0; }
    .section-head p { color:var(--muted); max-width:530px; margin:0; line-height:1.55; }
    .protocol { display:grid; grid-template-columns: 1.1fr 1fr 1fr 1.25fr; gap:10px; margin-top:16px; }
    .panel { min-height:170px; border:1px solid var(--line); border-radius:20px; background:linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.018)); padding:16px; overflow:hidden; }
    .panel h3 { margin:0 0 14px; color:var(--soft); font-family:'Geist Mono', monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; font-weight:500; }
    .row { display:flex; align-items:center; justify-content:space-between; gap:10px; border-top:1px solid rgba(244,244,242,.07); padding:9px 0; color:rgba(244,244,242,.76); font-size:13px; }
    .row:first-of-type { border-top:0; }
    .live { display:inline-flex; align-items:center; gap:5px; color:var(--mint); font-family:'Geist Mono', monospace; font-size:10px; }
    .live::before { content:""; width:5px; height:5px; border-radius:999px; background:var(--signal); box-shadow:0 0 10px var(--signal); }
    .flow { position:relative; min-height:112px; }
    .flow svg { width:100%; height:100%; position:absolute; inset:0; }
    code, .tag { font-family:'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; border:1px solid rgba(244,244,242,.11); background:rgba(255,255,255,.04); border-radius:999px; padding:5px 8px; color:var(--mint); font-size:12px; }
    .band { margin-top:18px; border:1px solid var(--line); border-radius:28px; padding:26px; background:linear-gradient(135deg, rgba(198,255,110,.08), rgba(255,255,255,.022) 44%, rgba(189,230,211,.06)); display:flex; align-items:center; justify-content:space-between; gap:20px; }
    .band h2 { margin:0; font-family:Georgia, 'Times New Roman', serif; font-weight:400; letter-spacing:-.05em; font-size:32px; }
    .band p { margin:7px 0 0; color:var(--muted); }
    footer { display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px; color:#71717a; margin-top:38px; font-size:13px; }
    @media (max-width: 940px) {
      main { padding:24px 18px 48px; }
      nav { margin-bottom:52px; align-items:flex-start; flex-direction:column; }
      .hero, .proof-row, .status-strip, .protocol { grid-template-columns:1fr; }
      .relay { min-height:420px; }
      .relay-box { inset:86px 38px auto; }
      .status { border-right:0; border-bottom:1px solid var(--line); }
      .status:last-child { border-bottom:0; }
      .section-head, .band { align-items:flex-start; flex-direction:column; }
      h1 { font-size: clamp(46px, 15vw, 70px); }
    }
  </style>
</head>
<body>
  <main>
    <nav>
      <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg}<span>Reverbin</span></a>
      <div class="navlinks">
        <a class="button" href="/docs">API docs</a>
        <a class="button" href="/dashboard/login">Dashboard</a>
        <a class="button primary" href="/docs">Start building</a>
      </div>
    </nav>

    <section class="hero">
      <div>
        <span class="eyebrow"><span class="dot"></span>agents.reverbin.com relay online</span>
        <h1>Communication infrastructure for autonomous agents.</h1>
        <p class="lede">Reverbin gives agents real inboxes, signed webhooks, threaded conversations, and delivery logs — a protocol layer for messages that need to be routed, verified, and remembered.</p>
        <div class="hero-actions">
          <a class="button primary" href="/docs">Read the API docs</a>
          <a class="button signal-button" href="/dashboard/login">Open dashboard</a>
        </div>
        <div class="proof-row" aria-label="Live Reverbin proof points">
          <div class="proof"><strong>Real inboxes</strong><span>Inbound routed for agents.reverbin.com</span></div>
          <div class="proof"><strong>Signed events</strong><span>Webhooks with retryable delivery rows</span></div>
          <div class="proof"><strong>Thread memory</strong><span>Conversations tracked across agent workflows</span></div>
        </div>
      </div>

      <aside class="relay" aria-label="Reverbin relay visual">
        <span class="trace t1"></span><span class="trace t2"></span><span class="trace t3"></span>
        <svg class="relay-network" viewBox="0 0 520 430" fill="none" aria-hidden="true">
          <path d="M14 86h126l54 42h92l64-68h156"/>
          <path d="M20 214h144l52-36h94l54 36h142"/>
          <path d="M32 340h134l68-54h86l58 54h110"/>
          <path d="M122 20v72m0 126v82m292-238v96m0 98v104" opacity=".7"/>
          <circle cx="14" cy="86" r="3"/><circle cx="140" cy="86" r="3"/><circle cx="286" cy="128" r="3"/><circle cx="506" cy="60" r="3"/>
          <circle cx="20" cy="214" r="3"/><circle cx="216" cy="178" r="3"/><circle cx="364" cy="214" r="3"/><circle cx="506" cy="214" r="3"/>
          <circle cx="32" cy="340" r="3"/><circle cx="234" cy="286" r="3"/><circle cx="378" cy="340" r="3"/><circle cx="488" cy="340" r="3"/>
        </svg>
        <div class="relay-box"><div class="box-mark">${reverbinMarkSvg}</div></div>
        <div class="port"></div>
        <div class="relay-labels"><span>Relay</span><span>Route</span><span>Record</span></div>
      </aside>
    </section>

    <section class="status-strip" aria-label="Current Reverbin platform status">
      <div class="status"><b>API</b><span>Health + ready checks live</span></div>
      <div class="status"><b>Receiving</b><span>Resend inbound webhook active</span></div>
      <div class="status"><b>Sending</b><span>Direct replies with audit logs</span></div>
      <div class="status"><b>Dashboard</b><span>App-token protected ops view</span></div>
    </section>

    <section class="section-head">
      <h2>Routed messages, not mailbox babysitting.</h2>
      <p>Agents get durable communication primitives: inboxes, policies, thread state, webhook delivery, and audit trails. Providers handle deliverability; Reverbin owns the agent-native control plane.</p>
    </section>

    <section class="protocol" aria-label="Reverbin protocol UI strip">
      <article class="panel"><h3>Inboxes</h3><div class="row"><span>ops@agents.reverbin.com</span><span class="live">live</span></div><div class="row"><span>alerts@agents.reverbin.com</span><span class="live">live</span></div><div class="row"><span>billing@agents.reverbin.com</span><span class="live">live</span></div></article>
      <article class="panel"><h3>Webhooks</h3><div class="row"><span>email.received</span><span class="live">signed</span></div><div class="row"><span>email.sent</span><span class="live">signed</span></div><div class="row"><span>thread.created</span><span class="live">signed</span></div></article>
      <article class="panel"><h3>Threads</h3><div class="row"><span>thread_01H09Z...</span><span>8</span></div><div class="row"><span>thread_01H0A1...</span><span>3</span></div><div class="row"><span>thread_01H0B7...</span><span>2</span></div></article>
      <article class="panel"><h3>Signal flow</h3><div class="flow"><svg viewBox="0 0 280 112" fill="none"><path d="M8 20h76l36 25h42l34-25h76" stroke="rgba(244,244,242,.44)"/><path d="M8 56h88l28 0h32l28 0h88" stroke="rgba(198,255,110,.72)"/><path d="M8 92h76l36-25h42l34 25h76" stroke="rgba(244,244,242,.44)"/><circle cx="140" cy="56" r="24" stroke="rgba(189,230,211,.28)"/><circle cx="140" cy="56" r="12" fill="#C6FF6E" opacity=".92"/><circle cx="8" cy="20" r="3" fill="#BDE6D3"/><circle cx="8" cy="56" r="3" fill="#C6FF6E"/><circle cx="8" cy="92" r="3" fill="#BDE6D3"/><circle cx="272" cy="20" r="3" fill="#BDE6D3"/><circle cx="272" cy="56" r="3" fill="#C6FF6E"/><circle cx="272" cy="92" r="3" fill="#BDE6D3"/></svg></div></article>
    </section>

    <section class="band">
      <div><h2>Email becomes an agent protocol.</h2><p>Start with an inbox, wire signed webhooks, and let the agent handle the conversation.</p></div>
      <a class="button primary" href="/docs">View API reference</a>
    </section>

    <footer><span>Built by Echo.</span><span>Real inboxes · signed webhooks · threaded conversations</span></footer>
  </main>
</body>
</html>`;
}

export function renderDocsRedirectPage() {
  return `<!doctype html><html><head><title>Reverbin API docs</title><meta http-equiv="refresh" content="0; url=https://github.com/BuiltByEcho/agent-email-layer/blob/main/docs/API.md"></head><body><p>Reverbin API docs live at <a href="https://github.com/BuiltByEcho/agent-email-layer/blob/main/docs/API.md">docs/API.md</a>.</p></body></html>`;
}
