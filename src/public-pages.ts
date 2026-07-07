const REQUEST_ACCESS_HREF = 'mailto:hello@builtbyecho.com?subject=Reverbin%20access&body=Tell%20us%20your%20agent%20use%20case%2C%20preferred%20inbox%20name%2C%20and%20webhook%20URL.%20We%27ll%20reply%20with%20beta%20API%20access.';
const ACCESS_REQUEST_NOTE = 'Opens a prefilled email. We reply with beta API key access and the verified receiving-domain details.';

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="72" fill="#050606"/><path d="M148 383V129H292C364 129 410 169 410 231C410 292 365 330 292 330H148" fill="none" stroke="#F4F4F2" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/><path d="M286 330L394 432" fill="none" stroke="#F4F4F2" stroke-width="52" stroke-linecap="round"/><path d="M190 228H289C327 228 351 245 351 271C351 297 327 313 289 313H190" fill="none" stroke="#B9FF2D" stroke-width="32" stroke-linecap="round"/><circle cx="394" cy="432" r="16" fill="#B9FF2D"/></svg>`;
const faviconHref = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

export function renderFaviconSvg() {
  return faviconSvg;
}

function reverbinMarkSvg(className = 'brand-mark') {
  return `<svg class="${className}" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
    <rect width="512" height="512" rx="72" fill="#050606"/>
    <path d="M106 263C106 180 174 112 258 112C340 112 405 174 413 253" fill="none" stroke="#B9FF2D" stroke-opacity=".82" stroke-width="12" stroke-linecap="round"/>
    <path d="M410 280C396 354 334 403 258 403C177 403 112 344 106 267" fill="none" stroke="#B9FF2D" stroke-opacity=".42" stroke-width="12" stroke-linecap="round"/>
    <path d="M82 206C67 226 59 251 59 278C59 305 68 331 84 351" fill="none" stroke="#F4F4F2" stroke-opacity=".24" stroke-width="14" stroke-linecap="round"/>
    <path d="M113 222C102 239 96 258 96 278C96 299 102 319 114 336" fill="none" stroke="#BDE6D3" stroke-opacity=".46" stroke-width="13" stroke-linecap="round"/>
    <path d="M148 383V129H292C364 129 410 169 410 231C410 292 365 330 292 330H148" fill="none" stroke="#F4F4F2" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M286 330L394 432" fill="none" stroke="#F4F4F2" stroke-width="42" stroke-linecap="round"/>
    <path d="M190 228H289C327 228 351 245 351 271C351 297 327 313 289 313H190" fill="none" stroke="#B9FF2D" stroke-width="26" stroke-linecap="round"/>
    <circle cx="383" cy="264" r="16" fill="#B9FF2D" stroke="#050606" stroke-width="5"/>
    <circle cx="394" cy="432" r="16" fill="#B9FF2D" stroke="#050606" stroke-width="5"/>
  </svg>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const baseHead = `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="${faviconHref}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
`;

export function renderLandingPage() {
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin - Communication infrastructure for autonomous agents</title>
  <meta name="description" content="Reverbin gives autonomous agents real inboxes, signed webhooks, threaded conversations, delivery logs, policy guardrails, and operator auditability." />
  <link rel="canonical" href="https://reverbin.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://reverbin.com/" />
  <meta property="og:title" content="Reverbin - Communication infrastructure for autonomous agents" />
  <meta property="og:description" content="Real inboxes, signed webhooks, threaded conversations, delivery logs, and operator auditability for agent runtimes." />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Reverbin - Communication infrastructure for autonomous agents" />
  <meta name="twitter:description" content="Real inboxes, signed webhooks, threaded conversations, delivery logs, and operator auditability for agent runtimes." />
  <style>
    :root {
      color-scheme: dark;
      --black: #0A0A0A;
      --ink: #060707;
      --charcoal: #121416;
      --graphite: #1A1D20;
      --surface: rgba(244,244,242,.045);
      --surface-strong: rgba(244,244,242,.075);
      --ivory: #F4F4F2;
      --muted: rgba(244,244,242,.72);
      --soft: rgba(244,244,242,.48);
      --faint: rgba(244,244,242,.24);
      --line: rgba(244,244,242,.14);
      --line-strong: rgba(244,244,242,.28);
      --mint: #BDE6D3;
      --signal: #B9FF2D;
      --warning: #FFD166;
      --radius: 8px;
      --shadow: 0 26px 80px rgba(0,0,0,.46);
      --page-gutter: clamp(32px, 4.4vw, 84px);
      --display-font: 'IBM Plex Sans Condensed', 'Space Grotesk', 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; background: var(--black); }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--ivory);
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        linear-gradient(180deg, #070808 0%, #0A0A0A 42%, #050606 100%),
        linear-gradient(90deg, rgba(189,230,211,.05), transparent 38%, rgba(185,255,45,.04));
      overflow-x: hidden;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(244,244,242,.026) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,244,242,.026) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: .78;
      mask-image: linear-gradient(to bottom, black 0%, transparent 78%);
    }
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(0deg, rgba(255,255,255,.018), rgba(255,255,255,.018) 1px, transparent 1px, transparent 4px);
      opacity: .18;
    }
    a { color: inherit; text-decoration: none; }
    button, input { font: inherit; }
    .page-shell {
      position: relative;
      width: 100%;
      max-width: none;
      margin: 0;
      padding: 24px var(--page-gutter) 72px;
    }
    .site-header {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      min-height: 72px;
      margin: -24px calc(-1 * var(--page-gutter)) 0;
      padding: 18px var(--page-gutter);
      background: rgba(10,10,10,.76);
      border-bottom: 1px solid rgba(244,244,242,.08);
      backdrop-filter: blur(18px);
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      min-width: max-content;
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: .015em;
      line-height: 1;
    }
    .brand-mark {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      filter: drop-shadow(0 0 22px rgba(185,255,45,.2));
    }
    .navlinks {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .navlinks a:not(.button) {
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
      padding: 10px 8px;
    }
    .navlinks a:not(.button):hover { color: var(--ivory); }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 44px;
      min-width: 44px;
      padding: 0 15px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: rgba(255,255,255,.025);
      color: var(--ivory);
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
      transition: background .18s ease, border-color .18s ease, transform .18s ease;
    }
    .button:hover {
      border-color: var(--line-strong);
      background: rgba(255,255,255,.065);
      transform: translateY(-1px);
    }
    .button.primary {
      background: var(--ivory);
      color: #050606;
      border-color: var(--ivory);
      box-shadow: 0 18px 46px rgba(244,244,242,.08);
    }
    .button.secondary {
      color: var(--signal);
      border-color: rgba(185,255,45,.32);
      background: rgba(185,255,45,.055);
    }
    .button svg { width: 16px; height: 16px; }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, .9fr) minmax(440px, 1.1fr);
      align-items: center;
      gap: clamp(58px, 6vw, 124px);
      min-height: calc(100vh - 72px);
      padding: clamp(76px, 8vh, 118px) 0 68px;
      border-bottom: 1px solid rgba(244,244,242,.1);
    }
    .hero-copy { max-width: 880px; }
    .hero-copy,
    .relay-board {
      min-width: 0;
    }
    h1 {
      margin: 0;
      font-family: var(--display-font);
      font-size: clamp(66px, 4.9vw, 98px);
      line-height: .88;
      font-weight: 700;
      letter-spacing: 0;
      max-width: 920px;
      text-wrap: balance;
      overflow-wrap: normal;
      word-break: normal;
    }
    h1 .line {
      display: block;
      white-space: nowrap;
    }
    .lede {
      max-width: 720px;
      margin: 30px 0 0;
      color: rgba(244,244,242,.78);
      font-size: clamp(18px, 1.15vw, 22px);
      line-height: 1.58;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin: 34px 0 0;
    }
    .access-note {
      margin: 12px 0 0;
      color: var(--soft);
      font-size: 13px;
      line-height: 1.45;
      max-width: 620px;
    }
    .access-note code {
      color: var(--ivory);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: .94em;
    }
    .hero-proof {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 38px;
      max-width: 820px;
    }
    .proof-item {
      min-height: 98px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(244,244,242,.052), rgba(244,244,242,.018));
      padding: 14px;
    }
    .proof-item b {
      display: block;
      margin-bottom: 7px;
      font-size: 16px;
    }
    .proof-item span {
      display: block;
      color: var(--soft);
      font-size: 13px;
      line-height: 1.45;
    }
    .relay-board {
      position: relative;
      min-height: clamp(560px, 58vh, 760px);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background:
        linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.02)),
        linear-gradient(135deg, rgba(189,230,211,.045), transparent 44%, rgba(185,255,45,.055));
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .relay-board::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(185,255,45,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(185,255,45,.1) 1px, transparent 1px);
      background-size: 36px 36px;
      opacity: .12;
    }
    .relay-topline {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 18px;
      border-bottom: 1px solid rgba(244,244,242,.1);
      color: var(--soft);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      text-transform: uppercase;
    }
    .relay-status {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: var(--mint);
    }
    .relay-status::before,
    .signal-dot {
      content: "";
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--signal);
      box-shadow: 0 0 14px rgba(185,255,45,.8);
    }
    .relay-core {
      position: relative;
      z-index: 1;
      display: grid;
      align-content: center;
      min-height: clamp(360px, 40vh, 500px);
      margin: 20px;
      padding: clamp(18px, 2.7vw, 34px);
      border: 1px solid rgba(244,244,242,.12);
      border-radius: var(--radius);
      background: linear-gradient(155deg, #171A1D, #070808 58%, #101314);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 24px 58px rgba(0,0,0,.38);
      overflow: hidden;
    }
    .relay-core::before {
      content: "";
      position: absolute;
      inset: 24px 22px;
      border: 1px solid rgba(244,244,242,.08);
      border-radius: var(--radius);
      background: radial-gradient(circle at 26% 28%, rgba(185,255,45,.14), transparent 28%), radial-gradient(circle at 78% 64%, rgba(189,230,211,.11), transparent 30%);
      pointer-events: none;
    }
    .message-flow {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      align-items: stretch;
    }
    .message-flow::before {
      content: "";
      position: absolute;
      left: 10%;
      right: 10%;
      top: 50%;
      height: 1px;
      background: linear-gradient(90deg, rgba(189,230,211,.16), rgba(185,255,45,.82), rgba(189,230,211,.16));
      box-shadow: 0 0 26px rgba(185,255,45,.22);
    }
    .flow-node {
      position: relative;
      display: grid;
      align-content: start;
      gap: 10px;
      min-height: 178px;
      padding: 16px;
      border: 1px solid rgba(244,244,242,.13);
      border-radius: var(--radius);
      background: rgba(7,8,8,.74);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.07);
    }
    .flow-node::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -8px;
      width: 14px;
      height: 14px;
      border-top: 1px solid rgba(185,255,45,.78);
      border-right: 1px solid rgba(185,255,45,.78);
      transform: translateY(-50%) rotate(45deg);
      background: #080909;
      box-shadow: 0 0 16px rgba(185,255,45,.2);
    }
    .flow-node:last-child::after { display: none; }
    .flow-node b {
      color: var(--ivory);
      font-size: 14px;
      line-height: 1.25;
    }
    .flow-node span {
      color: var(--soft);
      font-size: 12px;
      line-height: 1.45;
    }
    .flow-node code {
      justify-self: start;
      color: var(--signal);
      background: rgba(185,255,45,.08);
      border-color: rgba(185,255,45,.2);
      font-size: 11px;
    }
    .node-icon {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border: 1px solid rgba(244,244,242,.14);
      border-radius: var(--radius);
      color: var(--signal);
      background: rgba(10,10,10,.65);
    }
    .node-icon svg {
      width: 18px;
      height: 18px;
    }
    .event-stream {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 8px;
      margin: 0 20px 20px;
    }
    .event-row {
      display: grid;
      grid-template-columns: 126px minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      min-height: 42px;
      padding: 0 12px;
      border: 1px solid rgba(244,244,242,.1);
      border-radius: var(--radius);
      background: rgba(10,10,10,.42);
      color: rgba(244,244,242,.76);
      font-size: 13px;
    }
    .event-row code {
      color: var(--mint);
      font-size: 12px;
      background: transparent;
      border: 0;
      padding: 0;
    }
    .event-row span:nth-child(2) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .live-inbox-card {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 44px;
      gap: 16px;
      align-items: center;
      margin: 0 20px 20px;
      padding: 16px;
      border: 1px solid rgba(185,255,45,.22);
      border-radius: var(--radius);
      background: linear-gradient(135deg, rgba(185,255,45,.08), rgba(7,8,8,.82) 58%, rgba(189,230,211,.055));
      box-shadow: inset 0 1px 0 rgba(255,255,255,.07);
    }
    .live-inbox-card div {
      display: grid;
      gap: 6px;
      min-width: 0;
    }
    .live-inbox-card span:first-child {
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .live-inbox-card code {
      color: var(--ivory);
      font-size: 14px;
      background: transparent;
      border: 0;
      padding: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .live-inbox-card span:last-child {
      color: var(--soft);
      font-size: 13px;
      line-height: 1.4;
    }
    .live-inbox-card svg {
      width: 44px;
      height: 44px;
      padding: 10px;
      border: 1px solid rgba(244,244,242,.14);
      border-radius: var(--radius);
      color: var(--signal);
      background: rgba(10,10,10,.56);
    }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 24px;
      padding: 0 8px;
      border: 1px solid rgba(185,255,45,.25);
      border-radius: var(--radius);
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    .section {
      padding: clamp(80px, 8vw, 132px) 0;
      border-bottom: 1px solid rgba(244,244,242,.1);
    }
    .section-head {
      display: grid;
      grid-template-columns: minmax(0, .9fr) minmax(280px, .68fr);
      gap: 38px;
      align-items: end;
      margin-bottom: 28px;
    }
    .section-label {
      display: block;
      margin: 0 0 14px;
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    h2 {
      margin: 0;
      font-family: var(--display-font);
      font-size: clamp(48px, 4vw, 78px);
      line-height: .94;
      font-weight: 700;
      letter-spacing: 0;
      text-wrap: balance;
    }
    .section-head p,
    .section-intro {
      color: var(--muted);
      font-size: 17px;
      line-height: 1.65;
      margin: 0;
    }
    .audience-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .audience-panel,
    .flow-step,
    .resource-panel,
    .guardrail,
    .dashboard-preview {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(244,244,242,.05), rgba(244,244,242,.018));
    }
    .audience-panel {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 316px;
      padding: 22px;
    }
    .audience-panel h3,
    .resource-panel h3,
    .guardrail h3 {
      margin: 0 0 12px;
      font-size: 22px;
      line-height: 1.15;
    }
    .audience-panel p,
    .resource-panel p,
    .guardrail p {
      margin: 0;
      color: var(--muted);
      line-height: 1.6;
    }
    .feature-list {
      display: grid;
      gap: 10px;
      align-self: end;
      margin-top: 24px;
      padding: 0;
      list-style: none;
    }
    .feature-list li {
      display: grid;
      grid-template-columns: 12px minmax(0, 1fr);
      gap: 10px;
      color: rgba(244,244,242,.78);
      line-height: 1.45;
      font-size: 14px;
    }
    .feature-list li::before {
      content: "";
      width: 7px;
      height: 7px;
      margin-top: 8px;
      border-radius: 50%;
      background: var(--signal);
      box-shadow: 0 0 12px rgba(185,255,45,.64);
    }
    .capability-matrix {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
      margin-top: 14px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
      background: rgba(244,244,242,.018);
    }
    .capability-cell {
      min-height: 184px;
      padding: 18px;
      border-right: 1px solid rgba(244,244,242,.1);
      background: linear-gradient(180deg, rgba(244,244,242,.038), rgba(244,244,242,.012));
    }
    .capability-cell:last-child { border-right: 0; }
    .capability-cell span,
    .use-case span,
    .faq-item span {
      display: block;
      margin-bottom: 28px;
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .capability-cell h3,
    .use-case h3,
    .faq-item h3 {
      margin: 0 0 10px;
      font-size: 22px;
      line-height: 1.15;
    }
    .capability-cell p,
    .use-case p,
    .faq-item p {
      margin: 0;
      color: var(--muted);
      line-height: 1.58;
    }
    .flow-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
    }
    .flow-step {
      min-height: 198px;
      padding: 16px;
    }
    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-bottom: 18px;
      border: 1px solid rgba(185,255,45,.32);
      border-radius: var(--radius);
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      font-weight: 700;
    }
    .flow-step h3 {
      margin: 0 0 8px;
      font-size: 17px;
      line-height: 1.2;
    }
    .flow-step p {
      margin: 0;
      color: var(--soft);
      font-size: 13px;
      line-height: 1.5;
    }
    .code-stack {
      display: grid;
      grid-template-columns: minmax(0, .84fr) minmax(0, 1fr);
      gap: 12px;
      margin-top: 18px;
    }
    .terminal {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: #070808;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    .terminal-bar {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      min-height: 38px;
      padding: 0 12px;
      border-bottom: 1px solid rgba(244,244,242,.09);
      color: var(--soft);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      text-transform: uppercase;
    }
    .snippet-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      align-items: center;
    }
    .snippet-tabs span {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 0 8px;
      border: 1px solid rgba(244,244,242,.1);
      border-radius: var(--radius);
      color: var(--soft);
      background: rgba(244,244,242,.02);
    }
    .snippet-tabs span:first-child {
      color: var(--signal);
      border-color: rgba(185,255,45,.28);
      background: rgba(185,255,45,.045);
    }
    pre {
      margin: 0;
      padding: 16px;
      overflow: auto;
      color: rgba(244,244,242,.84);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      line-height: 1.65;
      tab-size: 2;
    }
    pre .key { color: var(--signal); }
    pre .muted { color: var(--soft); }
    .production-strip {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
      margin-top: 18px;
      border: 1px solid rgba(189,230,211,.16);
      border-radius: var(--radius);
      overflow: hidden;
      background: linear-gradient(90deg, rgba(189,230,211,.055), rgba(244,244,242,.018));
    }
    .production-stat {
      min-height: 178px;
      padding: 18px;
      border-right: 1px solid rgba(244,244,242,.1);
    }
    .production-stat:last-child { border-right: 0; }
    .production-stat span {
      display: block;
      margin-bottom: 18px;
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 800;
    }
    .production-stat b {
      display: block;
      margin-bottom: 10px;
      font-size: 18px;
      line-height: 1.2;
    }
    .production-stat p {
      margin: 0;
      color: var(--soft);
      font-size: 13px;
      line-height: 1.5;
    }
    .resource-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .resource-panel {
      min-height: 210px;
      padding: 20px;
    }
    .resource-panel code,
    .mini-code {
      display: inline-flex;
      max-width: 100%;
      margin-bottom: 18px;
      padding: 7px 8px;
      border: 1px solid rgba(189,230,211,.18);
      border-radius: var(--radius);
      color: var(--mint);
      background: rgba(189,230,211,.045);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ops-grid {
      display: grid;
      grid-template-columns: minmax(0, .84fr) minmax(0, 1fr);
      gap: 12px;
      align-items: stretch;
    }
    .dashboard-preview {
      min-height: 418px;
      overflow: hidden;
    }
    .dash-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      min-height: 58px;
      padding: 0 16px;
      border-bottom: 1px solid rgba(244,244,242,.1);
    }
    .dash-header b { font-size: 15px; }
    .dash-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .dash-tabs span {
      padding: 7px 9px;
      border: 1px solid rgba(244,244,242,.1);
      border-radius: var(--radius);
      color: var(--soft);
      font-size: 12px;
      font-weight: 700;
    }
    .dash-tabs span:first-child {
      color: var(--signal);
      border-color: rgba(185,255,45,.28);
      background: rgba(185,255,45,.045);
    }
    .dash-table {
      display: grid;
      padding: 8px 16px 16px;
    }
    .dash-row {
      display: grid;
      grid-template-columns: 1.2fr .82fr .72fr;
      gap: 12px;
      min-height: 48px;
      align-items: center;
      border-bottom: 1px solid rgba(244,244,242,.08);
      color: rgba(244,244,242,.76);
      font-size: 13px;
    }
    .dash-row.header {
      min-height: 38px;
      color: var(--soft);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      text-transform: uppercase;
    }
    .status-live {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: var(--mint);
      font-size: 12px;
      font-weight: 700;
    }
    .status-live::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--signal);
      box-shadow: 0 0 10px rgba(185,255,45,.8);
    }
    .ops-copy {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(189,230,211,.055), rgba(244,244,242,.018));
      padding: 24px;
    }
    .ops-copy h3 {
      margin: 0 0 14px;
      font-family: var(--display-font);
      font-size: 34px;
      line-height: 1;
      font-weight: 700;
    }
    .ops-copy p {
      margin: 0 0 18px;
      color: var(--muted);
      line-height: 1.65;
    }
    .ops-list {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .ops-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 42px;
      padding: 0 12px;
      border: 1px solid rgba(244,244,242,.1);
      border-radius: var(--radius);
      color: rgba(244,244,242,.76);
      font-size: 13px;
    }
    .guardrail-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }
    .guardrail {
      min-height: 210px;
      padding: 20px;
    }
    .guardrail-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      margin-bottom: 18px;
      border: 1px solid rgba(185,255,45,.26);
      border-radius: var(--radius);
      color: var(--signal);
      background: rgba(185,255,45,.04);
    }
    .guardrail-icon svg {
      width: 20px;
      height: 20px;
      stroke-width: 1.8;
    }
    .use-case-grid,
    .faq-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }
    .use-case,
    .faq-item {
      min-height: 236px;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(244,244,242,.05), rgba(244,244,242,.018));
    }
    .faq-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .faq-item {
      min-height: 192px;
    }
    .final-cta {
      display: grid;
      grid-template-columns: minmax(0, .75fr) minmax(360px, .72fr);
      align-items: center;
      gap: 28px;
      margin-top: 72px;
      padding: 30px;
      border: 1px solid rgba(185,255,45,.18);
      border-radius: var(--radius);
      background:
        linear-gradient(90deg, rgba(185,255,45,.095), rgba(189,230,211,.035) 42%, rgba(244,244,242,.025)),
        #0B0C0C;
    }
    .final-cta h2 {
      font-size: 38px;
    }
    .final-cta p {
      margin: 10px 0 0;
      color: var(--muted);
      line-height: 1.6;
    }
    .final-cta .hero-actions {
      margin: 22px 0 0;
    }
    .install-card {
      border: 1px solid rgba(244,244,242,.14);
      border-radius: var(--radius);
      background: #070808;
      overflow: hidden;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 24px 68px rgba(0,0,0,.38);
    }
    .install-card pre {
      min-height: 176px;
      color: rgba(244,244,242,.86);
    }
    .footer {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 34px;
      color: rgba(244,244,242,.38);
      font-size: 13px;
    }
    [hidden] { display: none !important; }
    .tabbed-section {
      padding-top: 84px;
      padding-bottom: 84px;
      border-bottom: 1px solid rgba(244,244,242,.1);
    }
    .compact-head { margin-bottom: 24px; }
    .landing-tabs {
      border: 1px solid var(--line);
      border-radius: calc(var(--radius) + 8px);
      background: linear-gradient(180deg, rgba(244,244,242,.058), rgba(244,244,242,.022));
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .tab-rail {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-bottom: 1px solid var(--line);
      background: rgba(5,6,6,.62);
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .tab-button {
      appearance: none;
      border: 1px solid transparent;
      border-radius: var(--radius);
      background: transparent;
      color: var(--muted);
      padding: 12px 14px;
      min-width: max-content;
      font-weight: 800;
      cursor: pointer;
      transition: color .16s ease, background .16s ease, border-color .16s ease;
    }
    .tab-button:hover,
    .tab-button:focus-visible {
      color: var(--ivory);
      border-color: var(--line-strong);
      outline: none;
    }
    .tab-button.active,
    .tab-button[aria-selected="true"] {
      color: #050606;
      background: var(--signal);
      border-color: var(--signal);
    }
    .tab-panel {
      grid-template-columns: minmax(0, 1fr) minmax(320px, .74fr);
      gap: clamp(24px, 4vw, 58px);
      align-items: stretch;
      min-height: 470px;
      padding: clamp(22px, 4vw, 46px);
    }
    .tab-panel.active { display: grid; }
    .tab-copy h3 {
      margin: 10px 0 16px;
      font-family: var(--display-font);
      font-size: clamp(34px, 3vw, 56px);
      line-height: .96;
      letter-spacing: 0;
      max-width: 900px;
    }
    .tab-copy p {
      margin: 0 0 24px;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.6;
      max-width: 790px;
    }
    .mini-grid,
    .step-strip {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .mini-grid div,
    .step-strip div,
    .tab-card {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: rgba(244,244,242,.036);
      padding: 16px;
    }
    .mini-grid b,
    .step-strip b,
    .mini-grid span,
    .step-strip small { display: block; }
    .mini-grid b,
    .step-strip b { margin-bottom: 7px; font-size: 16px; }
    .mini-grid span,
    .step-strip small { color: var(--soft); line-height: 1.45; }
    .step-strip span {
      display: inline-flex;
      width: 34px;
      height: 34px;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      border-radius: 50%;
      background: rgba(185,255,45,.12);
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, monospace;
      font-weight: 800;
    }
    .tab-card h4,
    .resource-panel h4,
    .use-case h4 { margin: 0 0 12px; font-size: 20px; }
    .slim-terminal { min-width: 0; height: 100%; }
    .slim-terminal pre { min-height: auto; font-size: 12px; }
    .tight-grid { grid-template-columns: 1fr; gap: 10px; }
    .compact-list { max-width: 620px; margin-top: 0; }
    .compact-dashboard { min-height: auto; }
    .compact-cases { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .mobile-only { display: none; }
    @media (max-width: 1080px) {
      .hero {
        grid-template-columns: 1fr;
        min-height: auto;
        padding-top: 70px;
      }
      .relay-board { min-height: 500px; }
      .flow-grid,
      .capability-matrix,
      .production-strip,
      .use-case-grid,
      .guardrail-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .capability-cell:nth-child(2n),
      .production-stat:nth-child(2n) {
        border-right: 0;
      }
      .capability-cell:nth-child(-n + 2),
      .production-stat:nth-child(-n + 2) {
        border-bottom: 1px solid rgba(244,244,242,.1);
      }
      .resource-grid { grid-template-columns: 1fr; }
      .ops-grid,
      .code-stack,
      .faq-grid,
      .section-head {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 760px) {
      .page-shell { padding: 18px 18px 56px; }
      .site-header {
        position: relative;
        align-items: flex-start;
        flex-direction: column;
        margin: -18px 0 0;
        padding: 18px 0;
      }
      .navlinks {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        justify-content: stretch;
        width: 100%;
      }
      .navlinks a:not(.button) { display: none; }
      .navlinks .button {
        width: 100%;
        flex: none;
        min-width: 0;
        padding: 0 12px;
      }
      .hero {
        gap: 34px;
        padding: 52px 0 50px;
      }
      h1 {
        font-size: clamp(32px, 9vw, 38px);
        line-height: 1.02;
      }
      h1 .line {
        white-space: normal;
      }
      .lede {
        font-size: 17px;
        line-height: 1.58;
      }
      .hero-proof,
      .audience-grid,
      .flow-grid,
      .capability-matrix,
      .production-strip,
      .use-case-grid,
      .guardrail-grid {
        grid-template-columns: 1fr;
      }
      .capability-cell,
      .production-stat {
        border-right: 0;
        border-bottom: 1px solid rgba(244,244,242,.1);
      }
      .capability-cell:last-child,
      .production-stat:last-child {
        border-bottom: 0;
      }
      .relay-board {
        min-height: 456px;
      }
      .relay-core {
        min-height: auto;
        margin: 12px;
        padding: 14px;
      }
      .message-flow {
        grid-template-columns: 1fr;
      }
      .message-flow::before,
      .flow-node::after {
        display: none;
      }
      .flow-node {
        min-height: 0;
      }
      .relay-topline {
        align-items: flex-start;
        flex-direction: column;
      }
      .event-stream {
        margin: 0 12px 12px;
      }
      .live-inbox-card {
        grid-template-columns: 1fr;
        margin: 0 12px 12px;
      }
      .event-row {
        grid-template-columns: 1fr auto;
      }
      .event-row span:nth-child(2) {
        grid-column: 1 / -1;
        grid-row: 2;
        padding-bottom: 8px;
      }
      .section {
        padding: 54px 0;
      }
      pre {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      h2 {
        font-size: 34px;
      }
      .dash-row {
        grid-template-columns: 1fr;
        gap: 3px;
        padding: 10px 0;
      }
      .dash-row.header { display: none; }
      .final-cta {
        grid-template-columns: 1fr;
        padding: 22px;
      }
      .final-cta h2 {
        font-size: 32px;
      }
      .mobile-only { display: inline; }
    }
    @media (max-width: 420px) {
      h1 { font-size: clamp(30px, 8.7vw, 34px); }
      .brand-mark { width: 36px; height: 36px; }
      .button { font-size: 13px; }
      .hero-actions .button { width: 100%; }
    }
    @media (max-width: 760px) {
      .tab-rail { padding: 10px; }
      .tab-panel,
      .tab-panel.active { grid-template-columns: 1fr; min-height: auto; padding: 20px; }
      .mini-grid,
      .step-strip,
      .compact-cases { grid-template-columns: 1fr; }
      .tab-copy h3 { font-size: 32px; }
    }
  </style>
</head>
<body>
  <main class="page-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg()}<span>reverbin</span></a>
      <nav class="navlinks" aria-label="Primary navigation">
        <a href="#explore">Explore</a>
        <a href="/docs">Docs</a>
        <a class="button secondary" href="/dashboard/login">Dashboard</a>
        <a class="button primary" href="${REQUEST_ACCESS_HREF}">Sign up</a>
      </nav>
    </header>

    <section class="hero" aria-labelledby="hero-heading">
      <div class="hero-copy">
        <span class="section-label">Email for AI agents</span>
        <h1 id="hero-heading"><span class="line">Email</span><span class="line">for AI</span><span class="line">agents.</span></h1>
        <p class="lede"><strong>Reverbin is an email service for AI agents.</strong> Give every agent a real email address like <code>user@reverbin.com</code>, then route incoming messages to your agent runtime with signed webhooks, thread history, sending policy, and operator audit logs.</p>
        <div class="hero-actions">
          <a class="button primary" href="${REQUEST_ACCESS_HREF}">
            Sign up
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a class="button" href="/docs">Read API docs</a>
        </div>
        <p class="access-note">${ACCESS_REQUEST_NOTE}</p>
        <div class="hero-proof" aria-label="Reverbin platform primitives">
          <div class="proof-item"><b>Real inboxes</b><span>Addressable mailboxes for agents, not aliases glued to a chat demo.</span></div>
          <div class="proof-item"><b>Signed events</b><span>Webhook payloads include event names, delivery IDs, and HMAC signatures.</span></div>
          <div class="proof-item"><b>Thread memory</b><span>Inbound and outbound messages stay attached to durable conversation state.</span></div>
        </div>
      </div>

      <aside class="relay-board" aria-label="Reverbin relay visual">
        <div class="relay-topline">
          <span>reverbin.com / issued inboxes</span>
          <span class="relay-status">online</span>
        </div>
        <div class="relay-core">
          <div class="message-flow" aria-label="How a message moves through Reverbin">
            <article class="flow-node">
              <span class="node-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4 6h16v12H4z" stroke="currentColor" stroke-linejoin="round"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
              <code>inbound mail</code>
              <b>Provider receives email</b>
              <span>Mail lands on a verified agent address.</span>
            </article>
            <article class="flow-node">
              <span class="node-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M7 7h10v10H7z" stroke="currentColor"/><path d="M4 10h3m10 0h3M4 14h3m10 0h3M10 4v3m4-3v3m-4 10v3m4-3v3" stroke="currentColor" stroke-linecap="round"/></svg></span>
              <code>thread store</code>
              <b>Reverbin stores context</b>
              <span>Inbound and outbound messages stay attached to durable threads.</span>
            </article>
            <article class="flow-node">
              <span class="node-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h10" stroke="currentColor" stroke-linecap="round"/><path d="m12 8 4 4-4 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 5v14" stroke="currentColor" stroke-linecap="round"/></svg></span>
              <code>signed webhook</code>
              <b>Runtime gets the event</b>
              <span>Delivery IDs and HMAC signatures make events verifiable.</span>
            </article>
            <article class="flow-node">
              <span class="node-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M6 7h9a4 4 0 0 1 0 8H9" stroke="currentColor" stroke-linecap="round"/><path d="m9 11-4 4 4 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
              <code>agent reply</code>
              <b>Agent answers in thread</b>
              <span>Policy, delivery, and audit records travel with the reply.</span>
            </article>
          </div>
        </div>
        <div class="event-stream" aria-label="Example event stream">
          <div class="event-row"><code>email.received</code><span>support@reverbin.com received a provider message</span><span class="pill">signed</span></div>
          <div class="event-row"><code>thread.created</code><span>thr_01H0AZ routed to the agent runtime</span><span class="pill">stored</span></div>
          <div class="event-row"><code>email.sent</code><span>reply delivered with risk flags retained for audit</span><span class="pill">logged</span></div>
        </div>
        <div class="live-inbox-card" aria-label="Live inbox proof">
          <div>
            <span>Live inbox</span>
            <code>user@reverbin.com</code>
            <span>Inbound mail lands as a stored thread and signed webhook event.</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M4 6h16v12H4z" stroke="currentColor" stroke-linejoin="round"/>
            <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </aside>
    </section>

    <section class="section tabbed-section" id="explore" data-section-id="landing-tabs" aria-labelledby="explore-heading">
      <div class="section-head compact-head">
        <div>
          <span class="section-label">Explore Reverbin</span>
          <h2 id="explore-heading">Everything important, without the long scroll.</h2>
        </div>
        <p>Use the tabs to see what Reverbin is, how agent email flows, how developers integrate, what operators can inspect, and where it fits.</p>
      </div>
      <div class="landing-tabs">
        <div class="tab-rail" role="tablist" aria-label="Explore Reverbin">
          <button class="tab-button active" type="button" role="tab" id="reverbin-tab-overview" data-tab-id="overview" aria-selected="true" aria-controls="reverbin-panel-overview">Overview</button>
          <button class="tab-button" type="button" role="tab" id="reverbin-tab-flow" data-tab-id="flow" aria-selected="false" aria-controls="reverbin-panel-flow">Agent flow</button>
          <button class="tab-button" type="button" role="tab" id="reverbin-tab-developers" data-tab-id="developers" aria-selected="false" aria-controls="reverbin-panel-developers">Developers</button>
          <button class="tab-button" type="button" role="tab" id="reverbin-tab-operations" data-tab-id="operations" aria-selected="false" aria-controls="reverbin-panel-operations">Operations</button>
          <button class="tab-button" type="button" role="tab" id="reverbin-tab-use-cases" data-tab-id="use-cases" aria-selected="false" aria-controls="reverbin-panel-use-cases">Use cases</button>
        </div>

        <article class="tab-panel active" role="tabpanel" id="reverbin-panel-overview" aria-labelledby="reverbin-tab-overview" data-tab-panel="overview">
          <div class="tab-copy">
            <span class="section-label">Product surface</span>
            <h3>Give every agent a real email address, inbox, and reply path.</h3>
            <p>Reverbin is email infrastructure packaged for AI agents: real addresses, inbound message storage, signed runtime events, reply APIs, and human-visible audit trails.</p>
            <div class="mini-grid" aria-label="Reverbin capability matrix">
              <div><b>API-owned inboxes</b><span>Create agent-specific addresses on verified email infrastructure.</span></div>
              <div><b>Durable conversations</b><span>Messages stay attached to stored threads instead of prompt transcripts.</span></div>
              <div><b>Signed runtime events</b><span>Webhook payloads carry event names, delivery IDs, and HMAC signatures.</span></div>
              <div><b>Operator guardrails</b><span>Risk flags, optional approvals, and audit rows sit next to message records.</span></div>
            </div>
          </div>
          <aside class="tab-card" aria-label="What Reverbin replaces">
            <h4>What you stop rebuilding</h4>
            <ul class="feature-list">
              <li>Mailbox provisioning and provider glue.</li>
              <li>Thread storage for inbound and outbound mail.</li>
              <li>Webhook signatures, retries, and delivery logs.</li>
              <li>A dashboard for humans responsible for agent behavior.</li>
            </ul>
          </aside>
        </article>

        <article class="tab-panel" role="tabpanel" id="reverbin-panel-flow" aria-labelledby="reverbin-tab-flow" data-tab-panel="flow" hidden aria-hidden="true">
          <div class="tab-copy">
            <span class="section-label">Five-minute agent flow</span>
            <h3>Wire an inbox, subscribe the runtime, and let the agent answer in thread.</h3>
            <p>The API shape is intentionally small: create the address, receive the event, fetch context, respond, and audit every step.</p>
            <div class="step-strip" aria-label="Agent email flow">
              <div><span>01</span><b>Create inbox</b><small>Provision a mailbox for the agent identity.</small></div>
              <div><span>02</span><b>Subscribe webhook</b><small>Listen for <code>email.received</code> and <code>email.sent</code>.</small></div>
              <div><span>03</span><b>Receive mail</b><small>Provider payloads normalize into stored threads.</small></div>
              <div><span>04</span><b>Reply safely</b><small>Policy, delivery, and audit records travel with the reply.</small></div>
            </div>
          </div>
          <div class="terminal slim-terminal" aria-label="Create inbox API example">
            <div class="terminal-bar"><span>Create inbox</span><span>curl</span></div>
            <pre><span class="muted">curl -X POST https://api.reverbin.com/v1/inboxes \</span>
  -H "Authorization: Bearer ***" \
  -H "content-type: application/json" \
  -d '{
    <span class="key">"email_address"</span>: "user@reverbin.com",
    <span class="key">"display_name"</span>: "Support Agent"
  }'</pre>
          </div>
        </article>

        <article class="tab-panel" role="tabpanel" id="reverbin-panel-developers" aria-labelledby="reverbin-tab-developers" data-tab-panel="developers" hidden aria-hidden="true">
          <div class="tab-copy">
            <span class="section-label">Developer resources</span>
            <h3>Small API, typed client, first-party docs.</h3>
            <p>Use the API directly or import the TypeScript client. The docs cover endpoints, webhook signatures, delivery inspection, audit logs, and worker mode.</p>
            <div class="resource-grid tight-grid">
              <article class="resource-panel"><code>POST /v1/inboxes</code><h4>Programmable inboxes</h4><p>Create and list agent inboxes with default send policies.</p></article>
              <article class="resource-panel"><code>POST /v1/webhooks</code><h4>Signed delivery</h4><p>Deliver normalized events to your runtime with retryable delivery records.</p></article>
              <article class="resource-panel"><code>ReverbinClient</code><h4>TypeScript SDK</h4><p>Use typed helpers for inbox creation, thread retrieval, and replies.</p></article>
            </div>
          </div>
          <div class="terminal slim-terminal" aria-label="TypeScript SDK example">
            <div class="terminal-bar"><span>TypeScript</span><span>agent.ts</span></div>
            <pre>import { ReverbinClient } from '@builtbyecho/reverbin';

const reverbin = new ReverbinClient({
  baseUrl: process.env.REVERBIN_BASE_URL,
  apiKey: process.env.REVERBIN_API_KEY,
});

await reverbin.inboxes.create({
  email_address: 'support@reverbin.com',
  display_name: 'Support Agent',
});</pre>
          </div>
        </article>

        <article class="tab-panel" role="tabpanel" id="reverbin-panel-operations" aria-labelledby="reverbin-tab-operations" data-tab-panel="operations" hidden aria-hidden="true">
          <div class="tab-copy">
            <span class="section-label">Operator view</span>
            <h3>Humans can see what the agent did.</h3>
            <p>The dashboard is app-token protected and focused on operational state: inboxes, messages, webhook deliveries, approvals, and audit logs.</p>
            <ul class="ops-list compact-list">
              <li><span>Dashboard login</span><span class="pill">app token</span></li>
              <li><span>Webhook delivery rows</span><span class="pill">retryable</span></li>
              <li><span>Audit actions</span><span class="pill">recorded</span></li>
              <li><span>Policy knobs</span><span class="pill">per inbox</span></li>
            </ul>
          </div>
          <div class="dashboard-preview compact-dashboard" aria-label="Reverbin dashboard preview">
            <div class="dash-header"><b>Reverbin operations</b><div class="dash-tabs" aria-label="Dashboard preview tabs"><span>Inboxes</span><span>Messages</span><span>Webhooks</span><span>Audit</span></div></div>
            <div class="dash-table">
              <div class="dash-row header"><span>Inbox</span><span>Status</span><span>Last event</span></div>
              <div class="dash-row"><span><code class="mini-code">support@reverbin.com</code></span><span class="status-live">active</span><span>email.received</span></div>
              <div class="dash-row"><span><code class="mini-code">ops@reverbin.com</code></span><span class="status-live">active</span><span>webhook.delivered</span></div>
            </div>
          </div>
        </article>

        <article class="tab-panel" role="tabpanel" id="reverbin-panel-use-cases" aria-labelledby="reverbin-tab-use-cases" data-tab-panel="use-cases" hidden aria-hidden="true">
          <div class="tab-copy">
            <span class="section-label">Use cases</span>
            <h3>Agent email gets useful when it touches real workflows.</h3>
            <p>Use Reverbin anywhere an agent needs to receive, understand, and answer email while leaving a record a human can trust.</p>
          </div>
          <div class="use-case-grid compact-cases">
            <article class="use-case"><span>Support</span><h4>Customer-service agents</h4><p>Give support agents a durable inbox, signed inbound events, and auditable replies.</p></article>
            <article class="use-case"><span>Browser agents</span><h4>Account setup and verification</h4><p>Route onboarding mail without handing agents a human mailbox.</p></article>
            <article class="use-case"><span>Operations</span><h4>Vendor and billing workflows</h4><p>Keep receipts, invoices, and follow-ups attached to inspectable threads.</p></article>
            <article class="use-case"><span>Internal tools</span><h4>Escalation handoff</h4><p>Let agents draft or send routine email while audit rows stay visible.</p></article>
          </div>
        </article>
      </div>
    </section>

    <section class="final-cta" aria-labelledby="cta-heading">
      <div>
        <h2 id="cta-heading">Give your agent a real email address.</h2>
        <p>Use Reverbin as the email layer between the outside world and autonomous agent workflows.</p>
        <div class="hero-actions">
          <a class="button primary" href="${REQUEST_ACCESS_HREF}">Sign up</a>
          <a class="button" href="/docs">View API docs</a>
        </div>
        <p class="access-note">${ACCESS_REQUEST_NOTE}</p>
      </div>
      <div class="install-card" aria-label="Install Reverbin SDK">
        <div class="terminal-bar"><span>Install SDK</span><span>npm</span></div>
        <pre>npm install @builtbyecho/reverbin

REVERBIN_API_KEY=...
REVERBIN_BASE_URL=https://api.reverbin.com</pre>
      </div>
    </section>

    <footer class="footer">
      <span>Built by Echo.</span>
      <span>Real inboxes · signed webhooks · threaded conversations · delivery logs</span>
    </footer>
  </main>
<script>
  (() => {
    const root = document.querySelector('[data-section-id="landing-tabs"]');
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    function selectReverbinTab(nextTab) {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        const selected = panel.id === nextTab.getAttribute('aria-controls');
        panel.classList.toggle('active', selected);
        panel.hidden = !selected;
        panel.setAttribute('aria-hidden', selected ? 'false' : 'true');
      });
    }
    tabs.forEach((tab, index) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => selectReverbinTab(tab));
      tab.addEventListener('keydown', (event) => {
        const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        selectReverbinTab(next);
        next.focus();
      });
    });
  })();
</script>
</body>
</html>`;
}

export type DashboardInboxView = {
  id: string;
  email_address: string;
  display_name?: string | null;
  status: string;
  created_at: Date | string;
};

export type DashboardMessageView = {
  id: string;
  inbox_id: string;
  thread_id: string;
  direction: string;
  from_email: string | null;
  subject: string | null;
  created_at: Date | string;
};

export type DashboardDeliveryView = {
  id: string;
  endpoint_id: string;
  event_type: string;
  status: string;
  attempts: number | string;
  created_at: Date | string;
  delivered_at: Date | string | null;
};

export type DashboardAuditView = {
  action: string;
  target_type: string;
  target_id: string;
  created_at: Date | string;
};

export type DashboardPageData = {
  inboxes: DashboardInboxView[];
  messages: DashboardMessageView[];
  deliveries: DashboardDeliveryView[];
  audits: DashboardAuditView[];
};

function formatDate(value: Date | string | null | undefined) {
  if (!value) return 'pending';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(String(value));
  return date.toISOString().replace('T', ' ').replace('.000Z', 'Z');
}

function emptyRow(message: string, columns = 4) {
  return `<tr class="empty-row"><td colspan="${columns}">${escapeHtml(message)}</td></tr>`;
}

function statusPill(status: string) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes('fail') || normalized.includes('error') ? 'danger' : normalized.includes('pending') ? 'pending' : 'live';
  return `<span class="status-pill ${tone}">${escapeHtml(status)}</span>`;
}

function renderDashboardRows(data: DashboardPageData) {
  const inboxRows = data.inboxes.length
    ? data.inboxes.map((row) => `<tr>
        <td><strong>${escapeHtml(row.email_address)}</strong><span>${escapeHtml(row.display_name || row.id)}</span></td>
        <td>${statusPill(row.status)}</td>
        <td><code>${escapeHtml(row.id)}</code></td>
        <td>${formatDate(row.created_at)}</td>
      </tr>`).join('')
    : emptyRow('No inboxes yet. Create one through POST /v1/inboxes.', 4);

  const messageRows = data.messages.length
    ? data.messages.map((row) => `<tr>
        <td><span class="mono">${escapeHtml(row.direction)}</span></td>
        <td><strong>${escapeHtml(row.subject || '(no subject)')}</strong><span>${escapeHtml(row.from_email || 'unknown sender')}</span></td>
        <td><code>${escapeHtml(row.thread_id)}</code></td>
        <td>${formatDate(row.created_at)}</td>
      </tr>`).join('')
    : emptyRow('No messages stored yet. Inbound provider events will appear here.', 4);

  const deliveryRows = data.deliveries.length
    ? data.deliveries.map((row) => `<tr>
        <td><strong>${escapeHtml(row.event_type)}</strong><span>${escapeHtml(row.endpoint_id)}</span></td>
        <td>${statusPill(row.status)}</td>
        <td>${escapeHtml(String(row.attempts))}</td>
        <td>${formatDate(row.delivered_at ?? row.created_at)}</td>
      </tr>`).join('')
    : emptyRow('No webhook deliveries yet. Signed delivery attempts will appear here.', 4);

  const auditRows = data.audits.length
    ? data.audits.map((row) => `<tr>
        <td><strong>${escapeHtml(row.action)}</strong></td>
        <td>${escapeHtml(row.target_type)}</td>
        <td><code>${escapeHtml(row.target_id)}</code></td>
        <td>${formatDate(row.created_at)}</td>
      </tr>`).join('')
    : emptyRow('No audit activity yet. Inbound, send, policy, and approval events will appear here.', 4);

  return { inboxRows, messageRows, deliveryRows, auditRows };
}

export function renderDashboardPage(data: DashboardPageData) {
  const rows = renderDashboardRows(data);
  const totals = {
    inboxes: data.inboxes.length,
    messages: data.messages.length,
    deliveries: data.deliveries.length,
    audits: data.audits.length,
  };

  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin operations</title>
  <meta name="description" content="Reverbin operational dashboard for inboxes, messages, webhook deliveries, and audit logs." />
  <style>
    :root {
      color-scheme: dark;
      --black: #0A0A0A;
      --ivory: #F4F4F2;
      --muted: rgba(244,244,242,.72);
      --soft: rgba(244,244,242,.48);
      --line: rgba(244,244,242,.14);
      --line-strong: rgba(244,244,242,.28);
      --signal: #B9FF2D;
      --mint: #BDE6D3;
      --danger: #FCA5A5;
      --pending: #FFD166;
      --radius: 8px;
    }
    * { box-sizing: border-box; }
    html { background: var(--black); }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--ivory);
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        linear-gradient(180deg, #070808 0%, #0A0A0A 54%, #050606 100%),
        linear-gradient(90deg, rgba(189,230,211,.05), transparent 48%, rgba(185,255,45,.035));
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(244,244,242,.026) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,244,242,.026) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: .54;
      mask-image: linear-gradient(to bottom, black 0%, transparent 76%);
    }
    a { color: inherit; text-decoration: none; }
    .shell {
      position: relative;
      width: min(1248px, calc(100% - 36px));
      margin: 0 auto;
      padding: 22px 0 64px;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      min-height: 64px;
      border-bottom: 1px solid rgba(244,244,242,.1);
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: .015em;
    }
    .brand-mark { width: 40px; height: 40px; }
    .top-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 0 14px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: rgba(255,255,255,.025);
      color: var(--ivory);
      font-size: 13px;
      font-weight: 800;
    }
    .button.primary {
      border-color: var(--ivory);
      background: var(--ivory);
      color: #050606;
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, .9fr) minmax(0, 1fr);
      gap: 34px;
      align-items: end;
      padding: 58px 0 26px;
    }
    h1 {
      margin: 0;
      font-family: 'Space Grotesk', 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 58px;
      line-height: 1.02;
      font-weight: 400;
      letter-spacing: 0;
    }
    .hero p {
      margin: 0;
      color: var(--muted);
      font-size: 17px;
      line-height: 1.65;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin: 18px 0 28px;
    }
    .metric,
    .panel {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(244,244,242,.052), rgba(244,244,242,.018));
    }
    .metric {
      padding: 16px;
      min-height: 94px;
    }
    .metric span {
      display: block;
      color: var(--soft);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .metric b {
      display: block;
      margin-top: 10px;
      font-size: 30px;
      line-height: 1;
    }
    .dashboard-grid {
      display: grid;
      gap: 12px;
    }
    .panel {
      overflow: hidden;
    }
    .panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 56px;
      padding: 0 16px;
      border-bottom: 1px solid rgba(244,244,242,.1);
    }
    .panel-head h2 {
      margin: 0;
      font-size: 17px;
      line-height: 1.2;
    }
    .panel-head span {
      color: var(--soft);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .table-wrap {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
    }
    th,
    td {
      padding: 13px 16px;
      border-bottom: 1px solid rgba(244,244,242,.08);
      text-align: left;
      vertical-align: middle;
      color: rgba(244,244,242,.78);
      font-size: 13px;
    }
    th {
      color: var(--soft);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    td strong {
      display: block;
      color: var(--ivory);
      font-size: 14px;
      line-height: 1.35;
    }
    td span {
      display: block;
      margin-top: 4px;
      color: var(--soft);
      line-height: 1.35;
    }
    code,
    .mono {
      color: var(--mint);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 0 8px;
      border: 1px solid rgba(185,255,45,.28);
      border-radius: var(--radius);
      color: var(--signal);
      background: rgba(185,255,45,.045);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      font-weight: 800;
    }
    .status-pill.danger {
      border-color: rgba(252,165,165,.32);
      color: var(--danger);
      background: rgba(252,165,165,.045);
    }
    .status-pill.pending {
      border-color: rgba(255,209,102,.34);
      color: var(--pending);
      background: rgba(255,209,102,.045);
    }
    .empty-row td {
      color: var(--soft);
      font-style: italic;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 28px;
      color: rgba(244,244,242,.38);
      font-size: 13px;
    }
    @media (max-width: 840px) {
      .topbar,
      .hero {
        align-items: flex-start;
        flex-direction: column;
        display: flex;
      }
      h1 { font-size: 40px; }
      .metric-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .button { flex: 1 1 auto; }
      .top-actions { width: 100%; }
    }
    @media (max-width: 760px) {
      .tab-rail { padding: 10px; }
      .tab-panel,
      .tab-panel.active { grid-template-columns: 1fr; min-height: auto; padding: 20px; }
      .mini-grid,
      .step-strip,
      .compact-cases { grid-template-columns: 1fr; }
      .tab-copy h3 { font-size: 32px; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg()}<span>reverbin</span></a>
      <nav class="top-actions" aria-label="Dashboard navigation">
        <a class="button" href="/docs">API docs</a>
        <a class="button" href="/dashboard/logout">Log out</a>
        <a class="button primary" href="/">Public site</a>
      </nav>
    </header>

    <section class="hero">
      <h1>Reverbin operations</h1>
      <p>Inspect production communication state across agent inboxes, recent messages, signed webhook deliveries, and audit activity.</p>
    </section>

    <section class="metric-grid" aria-label="Dashboard totals">
      <div class="metric"><span>Inboxes</span><b>${totals.inboxes}</b></div>
      <div class="metric"><span>Messages</span><b>${totals.messages}</b></div>
      <div class="metric"><span>Deliveries</span><b>${totals.deliveries}</b></div>
      <div class="metric"><span>Audit rows</span><b>${totals.audits}</b></div>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-head"><h2>Inboxes</h2><span>Latest 20</span></div>
        <div class="table-wrap"><table><thead><tr><th>Email</th><th>Status</th><th>ID</th><th>Created</th></tr></thead><tbody>${rows.inboxRows}</tbody></table></div>
      </article>
      <article class="panel">
        <div class="panel-head"><h2>Recent messages</h2><span>Latest 20</span></div>
        <div class="table-wrap"><table><thead><tr><th>Direction</th><th>Subject</th><th>Thread</th><th>Created</th></tr></thead><tbody>${rows.messageRows}</tbody></table></div>
      </article>
      <article class="panel">
        <div class="panel-head"><h2>Webhook deliveries</h2><span>Latest 20</span></div>
        <div class="table-wrap"><table><thead><tr><th>Event</th><th>Status</th><th>Attempts</th><th>Delivered</th></tr></thead><tbody>${rows.deliveryRows}</tbody></table></div>
      </article>
      <article class="panel">
        <div class="panel-head"><h2>Audit trail</h2><span>Latest 30</span></div>
        <div class="table-wrap"><table><thead><tr><th>Action</th><th>Target type</th><th>Target ID</th><th>Created</th></tr></thead><tbody>${rows.auditRows}</tbody></table></div>
      </article>
    </section>

    <footer class="footer">
      <span>Built by Echo.</span>
      <span>App-token protected operational dashboard</span>
    </footer>
  </main>
<script>
  (() => {
    const root = document.querySelector('[data-section-id="landing-tabs"]');
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    function selectReverbinTab(nextTab) {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        const selected = panel.id === nextTab.getAttribute('aria-controls');
        panel.classList.toggle('active', selected);
        panel.hidden = !selected;
        panel.setAttribute('aria-hidden', selected ? 'false' : 'true');
      });
    }
    tabs.forEach((tab, index) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => selectReverbinTab(tab));
      tab.addEventListener('keydown', (event) => {
        const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        selectReverbinTab(next);
        next.focus();
      });
    });
  })();
</script>
</body>
</html>`;
}

export function renderDashboardUnavailablePage(_reason = '') {
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin operations unavailable</title>
  <meta name="description" content="The Reverbin operational dashboard is temporarily unavailable." />
  <style>
    :root {
      color-scheme: dark;
      --black: #0A0A0A;
      --ivory: #F4F4F2;
      --muted: rgba(244,244,242,.72);
      --line: rgba(244,244,242,.14);
      --line-strong: rgba(244,244,242,.28);
      --signal: #B9FF2D;
      --mint: #BDE6D3;
      --radius: 8px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      color: var(--ivory);
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        linear-gradient(180deg, #070808 0%, #0A0A0A 100%),
        linear-gradient(90deg, rgba(189,230,211,.05), transparent 48%, rgba(185,255,45,.035));
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(244,244,242,.026) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,244,242,.026) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: .52;
    }
    a { color: inherit; text-decoration: none; }
    .card {
      position: relative;
      width: min(720px, 100%);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(244,244,242,.052), rgba(244,244,242,.018));
      padding: 26px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 42px;
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: .015em;
    }
    .brand-mark { width: 40px; height: 40px; }
    h1 {
      margin: 0;
      font-family: 'Space Grotesk', 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 48px;
      line-height: 1.04;
      font-weight: 400;
      letter-spacing: 0;
    }
    p {
      color: var(--muted);
      line-height: 1.65;
      margin: 16px 0 0;
      font-size: 16px;
    }
    .checks {
      display: grid;
      gap: 10px;
      margin-top: 24px;
    }
    .check {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      min-height: 44px;
      align-items: center;
      border: 1px solid rgba(244,244,242,.1);
      border-radius: var(--radius);
      padding: 0 12px;
      color: rgba(244,244,242,.78);
    }
    .check span:last-child {
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      font-weight: 800;
    }
    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid var(--line-strong);
      border-radius: var(--radius);
      color: var(--ivory);
      font-size: 14px;
      font-weight: 800;
    }
    .button.primary {
      background: var(--ivory);
      border-color: var(--ivory);
      color: #050606;
    }
    @media (max-width: 560px) {
      .card { padding: 20px; }
      h1 { font-size: 36px; }
    }
    @media (max-width: 760px) {
      .tab-rail { padding: 10px; }
      .tab-panel,
      .tab-panel.active { grid-template-columns: 1fr; min-height: auto; padding: 20px; }
      .mini-grid,
      .step-strip,
      .compact-cases { grid-template-columns: 1fr; }
      .tab-copy h3 { font-size: 32px; }
    }
  </style>
</head>
<body>
  <section class="card">
    <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg()}<span>reverbin</span></a>
    <h1>Operations temporarily unavailable.</h1>
    <p>The dashboard could not read the operational database. Public pages and API health may still be available, but inbox, message, webhook, and audit tables need Postgres readiness before they can render.</p>
    <div class="checks" aria-label="Suggested readiness checks">
      <div class="check"><span>Postgres readiness</span><span>/readyz</span></div>
      <div class="check"><span>API process</span><span>/health</span></div>
      <div class="check"><span>Dashboard authentication</span><span>app token</span></div>
    </div>
    <div class="actions">
      <a class="button primary" href="/dashboard">Retry dashboard</a>
      <a class="button" href="/readyz">Check /readyz</a>
      <a class="button" href="/">Public site</a>
    </div>
  </section>
<script>
  (() => {
    const root = document.querySelector('[data-section-id="landing-tabs"]');
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    function selectReverbinTab(nextTab) {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        const selected = panel.id === nextTab.getAttribute('aria-controls');
        panel.classList.toggle('active', selected);
        panel.hidden = !selected;
        panel.setAttribute('aria-hidden', selected ? 'false' : 'true');
      });
    }
    tabs.forEach((tab, index) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => selectReverbinTab(tab));
      tab.addEventListener('keydown', (event) => {
        const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        selectReverbinTab(next);
        next.focus();
      });
    });
  })();
</script>
</body>
</html>`;
}

export function renderDashboardLoginPage(error = '') {
  const errorHtml = error ? `<p class="error">${escapeHtml(error)}</p>` : '';
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Dashboard Login</title>
  <meta name="description" content="Sign in to the Reverbin operational dashboard." />
  <style>
    :root {
      color-scheme: dark;
      --black: #0A0A0A;
      --ivory: #F4F4F2;
      --muted: rgba(244,244,242,.72);
      --line: rgba(244,244,242,.14);
      --line-strong: rgba(244,244,242,.28);
      --signal: #B9FF2D;
      --mint: #BDE6D3;
      --radius: 8px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--ivory);
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        linear-gradient(180deg, #070808 0%, #0A0A0A 100%),
        linear-gradient(90deg, rgba(189,230,211,.05), transparent 48%, rgba(185,255,45,.035));
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(244,244,242,.026) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,244,242,.026) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: .55;
    }
    main {
      position: relative;
      width: min(1040px, calc(100% - 36px));
      margin: 0 auto;
      padding: 34px 0;
    }
    a { color: inherit; text-decoration: none; }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      font-family: 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: .015em;
    }
    .brand-mark {
      width: 40px;
      height: 40px;
    }
    .login-grid {
      display: grid;
      grid-template-columns: minmax(0, .82fr) minmax(320px, .6fr);
      gap: 18px;
      align-items: stretch;
      margin-top: 86px;
    }
    .copy,
    .card {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(244,244,242,.052), rgba(244,244,242,.018));
      padding: 26px;
    }
    h1 {
      margin: 0;
      font-family: 'Space Grotesk', 'Geist', Inter, ui-sans-serif, system-ui, sans-serif;
      font-size: 54px;
      line-height: 1.02;
      font-weight: 400;
      letter-spacing: 0;
    }
    p {
      color: var(--muted);
      line-height: 1.6;
      margin: 16px 0 0;
    }
    form {
      display: grid;
      gap: 12px;
      margin-top: 22px;
    }
    label {
      color: var(--mint);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    input {
      width: 100%;
      min-height: 46px;
      border: 1px solid var(--line-strong);
      border-radius: var(--radius);
      background: #070808;
      color: var(--ivory);
      padding: 0 12px;
      outline: none;
    }
    input:focus {
      border-color: rgba(185,255,45,.72);
      box-shadow: 0 0 0 3px rgba(185,255,45,.1);
    }
    button {
      min-height: 46px;
      border: 1px solid var(--ivory);
      border-radius: var(--radius);
      background: var(--ivory);
      color: #050606;
      font-weight: 800;
      cursor: pointer;
    }
    .error {
      color: #FCA5A5;
      margin: 14px 0 0;
    }
    .mini-list {
      display: grid;
      gap: 10px;
      padding: 0;
      margin: 24px 0 0;
      list-style: none;
    }
    .mini-list li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      min-height: 38px;
      align-items: center;
      border-top: 1px solid rgba(244,244,242,.09);
      color: rgba(244,244,242,.74);
      font-size: 14px;
    }
    .mini-list span:last-child {
      color: var(--signal);
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
    }
    @media (max-width: 780px) {
      main { padding-top: 24px; }
      .login-grid { grid-template-columns: 1fr; margin-top: 52px; }
      h1 { font-size: 40px; }
    }
    @media (max-width: 760px) {
      .tab-rail { padding: 10px; }
      .tab-panel,
      .tab-panel.active { grid-template-columns: 1fr; min-height: auto; padding: 20px; }
      .mini-grid,
      .step-strip,
      .compact-cases { grid-template-columns: 1fr; }
      .tab-copy h3 { font-size: 32px; }
    }
  </style>
</head>
<body>
  <main>
    <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg()}<span>reverbin</span></a>
    <section class="login-grid">
      <div class="copy">
        <h1>Operational dashboard access.</h1>
        <p>Use the app token to inspect inboxes, recent messages, webhook deliveries, and audit activity for the Reverbin control plane.</p>
        <ul class="mini-list">
          <li><span>Authentication</span><span>app token</span></li>
          <li><span>Surface</span><span>ops view</span></li>
          <li><span>Scope</span><span>inboxes + audit</span></li>
        </ul>
      </div>
      <div class="card">
        <h2>Sign in</h2>
        <p>Enter the dashboard token configured for this deployment.</p>
        ${errorHtml}
        <form method="post" action="/dashboard/login">
          <input type="text" name="username" value="reverbin-dashboard" autocomplete="username" hidden />
          <label for="token">Dashboard token</label>
          <input id="token" type="password" name="token" autocomplete="current-password" placeholder="Enter token" autofocus required />
          <button type="submit">Open dashboard</button>
        </form>
      </div>
    </section>
  </main>
<script>
  (() => {
    const root = document.querySelector('[data-section-id="landing-tabs"]');
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    function selectReverbinTab(nextTab) {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        const selected = panel.id === nextTab.getAttribute('aria-controls');
        panel.classList.toggle('active', selected);
        panel.hidden = !selected;
        panel.setAttribute('aria-hidden', selected ? 'false' : 'true');
      });
    }
    tabs.forEach((tab, index) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => selectReverbinTab(tab));
      tab.addEventListener('keydown', (event) => {
        const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        selectReverbinTab(next);
        next.focus();
      });
    });
  })();
</script>
</body>
</html>`;
}

export type DocsPageKey = 'overview' | 'quickstart' | 'api' | 'agents';

const docsPageMeta: Record<DocsPageKey, { title: string; eyebrow: string; description: string; href: string }> = {
  overview: {
    title: 'Docs built for humans and agents.',
    eyebrow: 'Documentation',
    description: 'A first-party documentation surface for wiring real inboxes, signed webhooks, durable threads, and safe agent replies through Reverbin.',
    href: '/docs',
  },
  quickstart: {
    title: 'Quickstart',
    eyebrow: 'Five-minute setup',
    description: 'Create an inbox, register a webhook, receive real mail, fetch thread state, and reply safely from an agent runtime.',
    href: '/docs/quickstart',
  },
  api: {
    title: 'API reference',
    eyebrow: 'Endpoints + events',
    description: 'The concrete REST surface for inboxes, threads, replies, webhooks, deliveries, audit logs, and approval decisions.',
    href: '/docs/api',
  },
  agents: {
    title: 'Agent runtime guide',
    eyebrow: 'Integration contract',
    description: 'The mental model, safety rules, webhook contract, and lifecycle autonomous agents should follow when using Reverbin.',
    href: '/docs/agents',
  },
};

const fallbackDocsMarkdown: Record<Exclude<DocsPageKey, 'overview'>, string> = {
  quickstart: `# Quickstart\n\nCreate an inbox, register a signed webhook endpoint, read threads, and reply to a thread using $REVERBIN_API_KEY.\n\n\`\`\`bash\ncurl -X POST https://api.reverbin.com/v1/inboxes \\\n  -H "Authorization: Bearer $REVERBIN_API_KEY" \\\n  -H "content-type: application/json" \\\n  -d '{"email_address":"user@reverbin.com"}'\n\`\`\``,
  api: `# API reference\n\nProgrammable email inboxes for autonomous agents.\n\n## Endpoints\n\n- POST /v1/inboxes\n- GET /v1/inboxes/:id/threads\n- POST /v1/threads/:id/reply\n- POST /v1/webhooks\n- GET /v1/webhook-deliveries\n\n## Webhook signatures\n\nVerify x-echo-email-signature before processing events.`,
  agents: `# Agent runtime guide\n\nTreat email content as untrusted user input. Fetch thread state, verify webhook signatures, and handle 200, 202, and 403 distinctly.`,
};

function docsNav(active: DocsPageKey) {
  const entries: DocsPageKey[] = ['overview', 'quickstart', 'api', 'agents'];
  return `<nav class="docs-nav" aria-label="Documentation navigation">
    ${entries.map((key) => {
      const meta = docsPageMeta[key];
      const current = key === active ? ' aria-current="page"' : '';
      return `<a href="${meta.href}"${current}><span>${meta.eyebrow}</span><b>${meta.title}</b></a>`;
    }).join('')}
    <a href="/llms.txt"><span>Agent index</span><b>llms.txt</b></a>
  </nav>`;
}

function docsCards() {
  return `<div class="docs-card-grid" aria-label="Documentation sections">
    <a class="docs-card" href="/docs/quickstart">
      <span>01</span>
      <h2>Quickstart</h2>
      <p>Create an inbox, subscribe your runtime, receive an event, fetch thread context, and reply in the same conversation.</p>
    </a>
    <a class="docs-card" href="/docs/api">
      <span>02</span>
      <h2>API reference</h2>
      <p>Endpoint cards for inboxes, threads, replies, webhooks, deliveries, audit logs, and approval decisions.</p>
    </a>
    <a class="docs-card" href="/docs/agents">
      <span>03</span>
      <h2>Agent runtime guide</h2>
      <p>Lifecycle, event handling, signature verification, prompt-injection boundaries, and safe send behavior.</p>
    </a>
  </div>`;
}

function docsEndpointRail() {
  const endpoints = [
    ['POST', '/v1/inboxes', 'Create an API-owned inbox for an agent.'],
    ['GET', '/v1/inboxes/:id/threads', 'List the durable conversations attached to an inbox.'],
    ['GET', '/v1/threads/:id', 'Fetch thread context and message history before replying.'],
    ['POST', '/v1/threads/:id/reply', 'Send a controlled reply through Reverbin policy.'],
    ['POST', '/v1/webhooks', 'Register signed delivery endpoints for runtime events.'],
    ['GET', '/v1/webhook-deliveries', 'Inspect delivery attempts, status, and retry history.'],
  ];
  return `<section class="endpoint-rail" aria-label="Core API endpoints">
    <div><span class="section-label">Core API</span><h2>Small surface, production behavior.</h2></div>
    <div class="endpoint-list">
      ${endpoints.map(([method, path, description]) => `<div class="endpoint-row"><code>${method}</code><strong>${path}</strong><span>${description}</span></div>`).join('')}
    </div>
  </section>`;
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let code: string[] | null = null;
  let listOpen = false;
  let paragraph: string[] = [];

  const closeParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      closeParagraph();
      closeList();
      if (code) {
        html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
        code = null;
      } else {
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(raw);
      continue;
    }
    if (!line.trim()) {
      closeParagraph();
      closeList();
      continue;
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      closeParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      closeParagraph();
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      continue;
    }
    const numbered = /^\d+\.\s+(.+)$/.exec(line);
    if (numbered) {
      closeParagraph();
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(numbered[1])}</li>`);
      continue;
    }
    if (line.startsWith('|')) {
      closeParagraph();
      closeList();
      html.push(`<p class="docs-table-line">${inlineMarkdown(line)}</p>`);
      continue;
    }
    closeList();
    paragraph.push(line.trim());
  }
  closeParagraph();
  closeList();
  if (code) html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
  return html.join('\n');
}

function docsCss() {
  return `<style>
    :root { color-scheme: dark; --black:#0A0A0A; --ink:#060707; --ivory:#F4F4F2; --muted:rgba(244,244,242,.72); --soft:rgba(244,244,242,.52); --line:rgba(244,244,242,.14); --line-strong:rgba(244,244,242,.28); --surface:rgba(244,244,242,.052); --signal:#B9FF2D; --mint:#BDE6D3; --radius:8px; --display-font:'IBM Plex Sans Condensed','Space Grotesk','Geist',Inter,ui-sans-serif,system-ui,sans-serif; }
    * { box-sizing:border-box; }
    html { background:var(--black); scroll-behavior:smooth; }
    body { margin:0; min-height:100vh; color:var(--ivory); font-family:'Geist',Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; background:linear-gradient(180deg,#070808 0%,#0A0A0A 48%,#050606 100%); overflow-x:hidden; }
    body::before { content:""; position:fixed; inset:0; pointer-events:none; background-image:linear-gradient(rgba(244,244,242,.026) 1px,transparent 1px),linear-gradient(90deg,rgba(244,244,242,.026) 1px,transparent 1px); background-size:48px 48px; mask-image:linear-gradient(to bottom,black 0%,transparent 76%); }
    a { color:inherit; text-decoration:none; }
    code, pre { font-family:'Geist Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
    .docs-shell { position:relative; width:100%; padding:24px clamp(24px,4.4vw,82px) 72px; }
    .docs-header { position:sticky; top:0; z-index:20; display:flex; align-items:center; justify-content:space-between; gap:18px; margin:-24px calc(-1 * clamp(24px,4.4vw,82px)) 0; padding:18px clamp(24px,4.4vw,82px); border-bottom:1px solid rgba(244,244,242,.08); background:rgba(10,10,10,.78); backdrop-filter:blur(18px); }
    .brand { display:inline-flex; align-items:center; gap:12px; min-width:max-content; min-height:44px; font-size:20px; font-weight:800; letter-spacing:.015em; }
    .brand-mark { width:40px; height:40px; filter:drop-shadow(0 0 22px rgba(185,255,45,.2)); }
    .top-actions { display:flex; align-items:center; justify-content:flex-end; flex-wrap:wrap; gap:10px; }
    .button { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:0 15px; border:1px solid var(--line); border-radius:var(--radius); background:rgba(255,255,255,.025); color:var(--ivory); font-size:14px; font-weight:700; }
    .button.primary { background:var(--ivory); color:#050606; border-color:var(--ivory); }
    .docs-hero { display:grid; grid-template-columns:minmax(0,.95fr) minmax(300px,.55fr); gap:clamp(28px,5vw,74px); align-items:end; padding:clamp(72px,9vh,118px) 0 44px; border-bottom:1px solid var(--line); }
    .section-label { display:inline-flex; align-items:center; gap:8px; margin-bottom:18px; color:var(--signal); font-size:12px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; }
    h1 { margin:0; max-width:980px; font-family:var(--display-font); font-size:clamp(54px,6.2vw,108px); line-height:.9; font-weight:700; letter-spacing:0; text-wrap:balance; }
    .lede { max-width:780px; margin:26px 0 0; color:var(--muted); font-size:clamp(18px,1.2vw,22px); line-height:1.6; }
    .docs-nav { display:grid; gap:10px; align-content:start; }
    .docs-nav a, .docs-card, .endpoint-row { border:1px solid var(--line); border-radius:var(--radius); background:linear-gradient(180deg,rgba(244,244,242,.06),rgba(244,244,242,.018)); }
    .docs-nav a { display:grid; gap:5px; padding:14px; color:var(--muted); }
    .docs-nav a[aria-current="page"] { border-color:rgba(185,255,45,.42); background:rgba(185,255,45,.06); color:var(--ivory); }
    .docs-nav span, .docs-card span { color:var(--signal); font-size:11px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
    .docs-nav b { color:inherit; font-size:15px; }
    .docs-card-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin:34px 0; }
    .docs-card { display:block; min-height:220px; padding:20px; }
    .docs-card h2 { margin:34px 0 10px; font-size:28px; }
    .docs-card p { color:var(--muted); line-height:1.55; }
    .docs-layout { display:grid; grid-template-columns:minmax(220px,300px) minmax(0,1fr); gap:clamp(24px,4vw,64px); padding:34px 0 0; align-items:start; }
    .docs-article { min-width:0; max-width:980px; }
    .docs-article h2 { margin:34px 0 12px; font-size:34px; line-height:1.1; }
    .docs-article h3 { margin:28px 0 10px; font-size:24px; }
    .docs-article h4 { margin:24px 0 8px; font-size:18px; color:var(--mint); }
    .docs-article p, .docs-article li { color:var(--muted); line-height:1.72; font-size:16px; }
    .docs-article a { color:var(--signal); }
    .docs-article ul { padding-left:22px; }
    .docs-article table { width:100%; border-collapse:collapse; }
    .docs-article th,
    .docs-article td { border:1px solid var(--line); padding:10px; text-align:left; }
    .docs-article pre { overflow:auto; padding:18px; border:1px solid var(--line); border-radius:var(--radius); background:#050606; color:var(--ivory); line-height:1.55; }
    .docs-article code { color:var(--ivory); background:rgba(244,244,242,.08); border:1px solid rgba(244,244,242,.08); border-radius:5px; padding:.1em .34em; }
    .docs-article pre code { padding:0; border:0; background:transparent; color:inherit; }
    .endpoint-rail { display:grid; grid-template-columns:minmax(240px,.6fr) minmax(0,1fr); gap:24px; margin:30px 0 42px; padding:22px; border:1px solid var(--line); border-radius:var(--radius); background:rgba(244,244,242,.032); }
    .endpoint-rail h2 { margin:0; font-size:32px; line-height:1.05; }
    .endpoint-list { display:grid; gap:10px; }
    .endpoint-row { display:grid; grid-template-columns:74px minmax(180px,.52fr) minmax(0,1fr); gap:12px; align-items:center; padding:13px; }
    .endpoint-row code { color:#050606; background:var(--signal); border:0; font-weight:900; text-align:center; }
    .endpoint-row strong { font-family:'Geist Mono',ui-monospace,monospace; font-size:14px; }
    .endpoint-row span { color:var(--muted); line-height:1.45; }
    .footer-cta { margin-top:54px; padding:24px; border:1px solid rgba(185,255,45,.24); border-radius:var(--radius); background:rgba(185,255,45,.045); display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap; }
    .footer-cta h2 { margin:0; font-size:30px; }
    .footer-cta p { margin:6px 0 0; color:var(--muted); }
    @media (max-width: 980px) { .docs-hero, .docs-layout, .endpoint-rail { grid-template-columns:1fr; } .docs-card-grid { grid-template-columns:1fr; } .endpoint-row { grid-template-columns:1fr; } h1 { font-size:52px; } }
    @media (max-width: 760px) {
      .docs-shell { padding: 18px; overflow-x: hidden; }
      .docs-header { position: relative; align-items: flex-start; margin: -18px -18px 0; padding: 18px; }
      .docs-hero { padding: 56px 0 32px; }
      .docs-layout, .docs-layout > div, .docs-article, .docs-nav { min-width: 0; max-width: 100%; }
      .docs-nav a { min-width: 0; }
      .docs-nav span,
      .docs-nav b,
      .docs-article p,
      .docs-article li,
      .endpoint-row strong,
      .endpoint-row span { overflow-wrap: anywhere; }
      .docs-article pre { max-width: 100%; overflow-x: auto; white-space: pre-wrap; }
      .docs-article code { overflow-wrap: anywhere; }
      .docs-article pre code { white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }
      .docs-article table { min-width: 0; display: block; overflow-x: auto; }
      .endpoint-rail { padding: 16px; }
      .footer-cta { padding: 18px; }
      h1 { font-size: 44px; }
    }
  </style>`;
}

function docsOverviewHtml() {
  return `${docsCards()}
    ${docsEndpointRail()}
    <section class="docs-article" aria-label="Documentation philosophy">
      <h2>Source-controlled docs, product-grade reading experience.</h2>
      <p>GitHub remains the versioned source of truth, but builders should not have to leave Reverbin to understand the API. These pages mirror the repo docs into a branded, crawlable, first-party surface.</p>
      <ul>
        <li>Use <code>/docs/quickstart</code> when you want the fastest builder path.</li>
        <li>Use <code>/docs/api</code> when wiring REST routes, webhook signatures, approvals, and delivery logs.</li>
        <li>Use <code>/docs/agents</code> when integrating an autonomous runtime that needs safety and lifecycle guidance.</li>
        <li>Use <code>/llms.txt</code> when an agent needs the compact machine-readable index.</li>
      </ul>
    </section>`;
}

export function renderDocsPage(page: DocsPageKey = 'overview', markdown?: string) {
  const meta = docsPageMeta[page];
  const content = page === 'overview'
    ? docsOverviewHtml()
    : `${page === 'api' ? docsEndpointRail() : ''}<article class="docs-article">${markdownToHtml(markdown ?? fallbackDocsMarkdown[page])}</article>`;
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>${escapeHtml(meta.title)} - Reverbin docs</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <link rel="canonical" href="https://reverbin.com${meta.href}" />
  <meta property="og:title" content="${escapeHtml(meta.title)} - Reverbin docs" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  ${docsCss()}
</head>
<body>
  <main class="docs-shell">
    <header class="docs-header">
      <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg()}<span>reverbin</span></a>
      <nav class="top-actions" aria-label="Docs actions">
        <a class="button" href="/">Product</a>
        <a class="button" href="/dashboard/login">Dashboard</a>
        <a class="button primary" href="${REQUEST_ACCESS_HREF}">Sign up</a>
      </nav>
    </header>
    <section class="docs-hero" aria-label="${escapeHtml(meta.title)}">
      <div>
        <span class="section-label">${escapeHtml(meta.eyebrow)}</span>
        <h1>${escapeHtml(meta.title)}</h1>
        <p class="lede">${escapeHtml(meta.description)}</p>
      </div>
      ${docsNav(page)}
    </section>
    ${page === 'overview' ? content : `<section class="docs-layout">${docsNav(page)}<div>${content}</div></section>`}
    <section class="footer-cta">
      <div>
        <h2>Give your agent a real inbox.</h2>
        <p>Start from the quickstart or wire the REST API directly.</p>
      </div>
      <div class="top-actions">
        <a class="button primary" href="${REQUEST_ACCESS_HREF}">Sign up</a>
        <a class="button" href="/docs/api">API reference</a>
      </div>
      <p class="access-note">${ACCESS_REQUEST_NOTE}</p>
    </section>
  </main>
<script>
  (() => {
    const root = document.querySelector('[data-section-id="landing-tabs"]');
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    function selectReverbinTab(nextTab) {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        const selected = panel.id === nextTab.getAttribute('aria-controls');
        panel.classList.toggle('active', selected);
        panel.hidden = !selected;
        panel.setAttribute('aria-hidden', selected ? 'false' : 'true');
      });
    }
    tabs.forEach((tab, index) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => selectReverbinTab(tab));
      tab.addEventListener('keydown', (event) => {
        const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!direction) return;
        event.preventDefault();
        const next = tabs[(index + direction + tabs.length) % tabs.length];
        selectReverbinTab(next);
        next.focus();
      });
    });
  })();
</script>
</body>
</html>`;
}

export function renderDocsRedirectPage() {
  return renderDocsPage('api');
}
