const SIGNUP_HREF = '/signup';
const CONTACT_HREF = 'mailto:hello@builtbyecho.com?subject=Reverbin%20enterprise&body=Tell%20us%20about%20your%20agent%20email%20volume%2C%20custom%20domain%20needs%2C%20and%20deployment%20requirements.';
const ACCESS_REQUEST_NOTE = 'Create a free agent in the browser. Reverbin generates your inbox and tenant-scoped API key instantly.';

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
  <title>Reverbin - Email for AI agents</title>
  <meta name="description" content="Reverbin is an email service for AI agents: real inboxes, signed webhooks, threaded conversations, delivery logs, policy guardrails, and operator auditability." />
  <link rel="canonical" href="https://reverbin.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://reverbin.com/" />
  <meta property="og:title" content="Reverbin - Email for AI agents" />
  <meta property="og:description" content="Real inboxes, signed webhooks, threaded conversations, delivery logs, and operator auditability for AI agent runtimes." />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Reverbin - Email for AI agents" />
  <meta name="twitter:description" content="Real inboxes, signed webhooks, threaded conversations, delivery logs, and operator auditability for AI agent runtimes." />
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
    .feature-list,
    .plan-value-list {
      display: grid;
      gap: 10px;
      align-self: end;
      margin-top: 24px;
      padding: 0;
      list-style: none;
    }
    .plan-value-list { margin: 16px 0 0; }
    .plan-kicker {
      color: var(--signal) !important;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .1em;
      text-transform: uppercase;
    }
    .feature-list li,
    .plan-value-list li {
      display: grid;
      grid-template-columns: 12px minmax(0, 1fr);
      gap: 10px;
      color: rgba(244,244,242,.78);
      line-height: 1.45;
      font-size: 14px;
    }
    .feature-list li::before,
    .plan-value-list li::before {
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
        <a href="#pricing">Pricing</a>
        <a href="/docs">Docs</a>
        <a class="button secondary" href="/dashboard/login">Dashboard</a>
        <a class="button primary" href="${SIGNUP_HREF}">Sign up</a>
      </nav>
    </header>

    <section class="hero" aria-labelledby="hero-heading">
      <div class="hero-copy">
        <span class="section-label">Email for AI agents</span>
        <h1 id="hero-heading"><span class="line">Email</span><span class="line">for AI</span><span class="line">agents.</span></h1>
        <p class="lede"><strong>Reverbin is an email service for AI agents.</strong> Give every agent a real email address like <code>user@reverbin.com</code>, then route incoming messages to your agent runtime with signed webhooks, thread history, sending policy, and operator audit logs.</p>
        <div class="hero-actions">
          <a class="button primary" href="${SIGNUP_HREF}">
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

    <section class="section pricing-section" id="pricing" aria-labelledby="pricing-heading">
      <div class="section-head compact-head">
        <div>
          <span class="section-label">Pricing</span>
          <h2 id="pricing-heading">Start free. Upgrade when your agent needs more room.</h2>
        </div>
        <p>Create a free agent first, then move to Developer or Startup from Billing when you need more mailboxes, volume, webhooks, and support.</p>
      </div>
      <div class="resource-grid pricing-grid" aria-label="Reverbin pricing plans">
        <article class="resource-panel pricing-card">
          <code>Free</code>
          <h4>$0/mo</h4>
          ${renderPlanValueList('free')}
          <a class="button" href="${SIGNUP_HREF}">Create free agent</a>
        </article>
        <article class="resource-panel pricing-card featured">
          <code>Developer</code>
          <h4>$19/mo</h4>
          ${renderPlanValueList('developer')}
          <a class="button primary" href="/mail/billing">Upgrade in Billing</a>
        </article>
        <article class="resource-panel pricing-card">
          <code>Startup Beta</code>
          <h4>$149/mo</h4>
          ${renderPlanValueList('startup')}
          <a class="button" href="/mail/billing">Upgrade in Billing</a>
        </article>
        <article class="resource-panel pricing-card">
          <code>Enterprise</code>
          <h4>Custom</h4>
          ${renderPlanValueList('enterprise')}
          <a class="button" href="${CONTACT_HREF}">Contact us</a>
        </article>
      </div>
      <p class="access-note">Reverbin does not collect payment details directly; Stripe handles hosted payment and Link.</p>
    </section>

    <section class="final-cta" aria-labelledby="cta-heading">
      <div>
        <h2 id="cta-heading">Give your agent a real email address.</h2>
        <p>Use Reverbin as the email layer between the outside world and autonomous agent workflows.</p>
        <div class="hero-actions">
          <a class="button primary" href="${SIGNUP_HREF}">Sign up</a>
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

export type DashboardSignupVerificationCheckView = {
  key: string;
  label: string;
  required?: boolean;
  status: string;
  notes?: string | null;
};

export type DashboardSignupRequestView = {
  id: string;
  requester_email: string;
  preferred_inbox_name: string | null;
  status: string;
  verification_json?: DashboardSignupVerificationCheckView[];
  verification_summary?: {
    required: number;
    passed: number;
    failed: number;
    pending: number;
    ready_to_provision: boolean;
  };
  created_at: Date | string;
};

export type DashboardPageData = {
  inboxes: DashboardInboxView[];
  messages: DashboardMessageView[];
  deliveries: DashboardDeliveryView[];
  audits: DashboardAuditView[];
  signupRequests?: DashboardSignupRequestView[];
};

export type MailInboxView = {
  id: string;
  email_address: string;
  display_name?: string | null;
  status?: string | null;
  thread_count?: number | string | null;
};

export type MailThreadView = {
  id: string;
  inbox_id: string;
  subject: string | null;
  last_message_at: Date | string | null;
  last_from_email?: string | null;
  last_direction?: string | null;
  last_preview?: string | null;
  message_count?: number | string | null;
};

export type MailAttachmentView = {
  id: string;
  filename: string;
  content_type: string;
  content_disposition?: string | null;
  content_id?: string | null;
  size_bytes?: number | string | null;
  href?: string | null;
};

export type MailMessageView = {
  id: string;
  thread_id: string;
  direction: string;
  from_email: string | null;
  from_name?: string | null;
  to_json?: unknown;
  subject: string | null;
  text_body?: string | null;
  html_body?: string | null;
  attachments?: MailAttachmentView[];
  created_at: Date | string;
};

export type MailPageData = {
  inboxes: MailInboxView[];
  selectedInboxId?: string | null;
  threads: MailThreadView[];
  selectedThreadId?: string | null;
  selectedThread?: MailThreadView | null;
  messages: MailMessageView[];
  notice?: string | null;
};

export type MailPolicyView = {
  reply_only: boolean;
  require_approval_for_new_recipients: boolean;
  require_approval_for_external_domains: boolean;
  max_outbound_per_hour: number;
  max_outbound_per_day: number;
  allowed_domains: string[];
  blocked_domains: string[];
  allowed_recipients: string[];
  blocked_recipients: string[];
  allow_attachments: boolean;
  allow_links: boolean;
  risk_threshold: 'low' | 'medium' | 'high';
};

export type MailSettingsPageData = {
  inboxes: MailInboxView[];
  selectedInboxId?: string | null;
  policy: MailPolicyView;
  notice?: string | null;
};

export type MailCreateMailboxPageData = {
  inboxes: MailInboxView[];
  notice?: string | null;
};

export type MailBillingPlanView = {
  key: 'free' | 'developer' | 'startup' | 'enterprise';
  label: string;
  price_monthly_usd: number | null;
  max_inboxes: number;
  emails_per_month: number | null;
  max_webhooks: number;
};

export type MailBillingTenantView = {
  plan: string;
  billing_status: string;
  stripe_customer_id?: string | null;
};

export type MailBillingPageData = {
  inboxes: MailInboxView[];
  tenant: MailBillingTenantView;
  plans: MailBillingPlanView[];
  notice?: string | null;
};

type PlanValueCopy = {
  kicker: string;
  headline: string;
  description: string;
  bullets: string[];
};

const planValueCopy: Partial<Record<MailBillingPlanView['key'], PlanValueCopy>> = {
  free: {
    kicker: 'Best for testing one agent workflow',
    headline: 'Start with a real agent inbox.',
    description: 'Try Reverbin with root-domain addresses, a small monthly email allowance, and one webhook endpoint before committing to paid volume.',
    bullets: ['2 mailboxes', '2,000 emails/month', '1 webhook endpoint'],
  },
  developer: {
    kicker: 'For solo builders shipping real agents',
    headline: 'Build production agent email flows.',
    description: 'Move beyond testing with enough addresses, email volume, webhooks, API keys, and audit logs for a serious agent project.',
    bullets: ['10 mailboxes', '10,000 emails/month', '3 webhook endpoints', 'API keys and audit logs'],
  },
  startup: {
    kicker: 'For startups running multiple agents',
    headline: 'Scale a team or beta product.',
    description: 'Run multi-agent products with far more mailboxes, higher monthly volume, more webhook destinations, and priority support during beta.',
    bullets: ['100 mailboxes', '100,000 emails/month', '10 webhook endpoints', 'Priority support'],
  },
  enterprise: {
    kicker: 'For larger agent fleets',
    headline: 'Custom scale, domains, and support.',
    description: 'Bring custom domains, deployment needs, compliance requirements, and higher-volume agent email workflows.',
    bullets: ['Custom mailboxes', 'Custom volume', 'Custom support'],
  },
};

function renderPlanValueList(planKey: MailBillingPlanView['key']) {
  const copy = planValueCopy[planKey];
  if (!copy) return '';
  return `<p class="plan-kicker">${escapeHtml(copy.kicker)}</p><h3>${escapeHtml(copy.headline)}</h3><p>${escapeHtml(copy.description)}</p><ul class="plan-value-list">${copy.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export type MailWebhookView = {
  id: string;
  url: string;
  events_json: unknown;
  status: string;
  created_at: Date | string;
};

export type MailWebhooksPageData = {
  inboxes: MailInboxView[];
  webhooks: MailWebhookView[];
  notice?: string | null;
};

export type MailComposePageData = {
  inboxes: MailInboxView[];
  selectedInboxId?: string | null;
  notice?: string | null;
};

export type MailForwardPageData = {
  inboxes: MailInboxView[];
  selectedInboxId?: string | null;
  thread: MailThreadView;
  messages: MailMessageView[];
  notice?: string | null;
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

function renderMailRecipients(value: unknown) {
  const items = Array.isArray(value) ? value : [];
  return items.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && 'email' in item) return String((item as { email?: unknown }).email ?? '');
    return String(item ?? '');
  }).filter(Boolean).join(', ') || 'recipient hidden';
}

function renderMailNotice(notice?: string | null) {
  if (!notice) return '';
  const label = notice === 'reply_sent' ? 'Reply sent'
    : notice === 'approval_pending' ? 'Reply queued for approval'
      : notice === 'thread_deleted' ? 'Thread deleted'
        : notice === 'threads_deleted' ? 'Selected messages deleted'
          : notice === 'mailbox_created' ? 'Mailbox created'
            : notice === 'no_threads_selected' ? 'Select at least one message to delete'
              : notice;
  return `<div class="mail-notice" role="status">${escapeHtml(label)}</div>`;
}

function formatBytes(value: number | string | null | undefined) {
  const bytes = Number(value ?? 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function renderMailAttachments(attachments?: MailAttachmentView[]) {
  if (!attachments?.length) return '';
  const items = attachments.map((attachment) => {
    const href = attachment.href || `/mail/attachments/${encodeURIComponent(attachment.id)}`;
    const isImage = attachment.content_type.toLowerCase().startsWith('image/');
    const preview = isImage
      ? `<a class="mail-attachment-thumb" href="${escapeHtml(href)}"><img src="${escapeHtml(href)}" alt="${escapeHtml(attachment.filename)}" loading="lazy" /></a>`
      : `<a class="mail-attachment-icon" href="${escapeHtml(href)}" aria-label="Download ${escapeHtml(attachment.filename)}">↧</a>`;
    return `<li class="mail-attachment ${isImage ? 'image' : 'file'}">
      ${preview}
      <a class="mail-attachment-details" href="${escapeHtml(href)}">
        <strong>${escapeHtml(attachment.filename)}</strong>
        <span>${escapeHtml(attachment.content_type)} · ${escapeHtml(formatBytes(attachment.size_bytes))}</span>
      </a>
    </li>`;
  }).join('');
  return `<ul class="mail-attachments" aria-label="Message attachments">${items}</ul>`;
}

function renderMailThreads(data: MailPageData) {
  if (!data.threads.length) {
    return `<div class="mail-empty">No threads yet. New inbound messages will appear here.</div>`;
  }
  const selectedThreadId = data.selectedThreadId ?? data.threads[0]?.id;
  const selectedInboxId = data.selectedInboxId ?? data.threads[0]?.inbox_id ?? '';
  const rows = data.threads.map((thread) => {
    const selected = thread.id === selectedThreadId;
    const subject = thread.subject || '(no subject)';
    const href = `/mail?inbox_id=${encodeURIComponent(thread.inbox_id)}&thread_id=${encodeURIComponent(thread.id)}`;
    return `<div class="mail-thread-row ${selected ? 'selected' : ''}">
      <label class="mail-thread-select">
        <input type="checkbox" name="thread_ids" value="${escapeHtml(thread.id)}" aria-label="Select thread ${escapeHtml(subject)}" />
      </label>
      <a class="mail-thread ${selected ? 'selected' : ''}" href="${href}" aria-current="${selected ? 'true' : 'false'}">
        <span class="mail-thread-top"><strong>${escapeHtml(thread.last_from_email || 'unknown sender')}</strong><time>${formatDate(thread.last_message_at)}</time></span>
        <span class="mail-thread-subject">${escapeHtml(subject)}</span>
        <span class="mail-thread-preview">${escapeHtml(thread.last_preview || 'No preview available')}</span>
        <span class="mail-thread-meta">${escapeHtml(thread.last_direction || 'message')} · ${escapeHtml(String(thread.message_count ?? 0))} messages · <span class="thread-open-label">Open thread</span></span>
      </a>
    </div>`;
  }).join('');
  return `<form class="mail-bulk-actions" method="post" action="/mail/threads/delete">
    <input type="hidden" name="inbox_id" value="${escapeHtml(selectedInboxId)}" />
    <div class="bulk-action-bar" aria-label="Bulk message actions">
      <span>Select messages to manage them together.</span>
      <button class="mail-action danger" type="submit">Delete selected</button>
    </div>
    ${rows}
  </form>`;
}

function renderMailMessages(data: MailPageData) {
  const selectedThread = data.selectedThread;
  if (!selectedThread) {
    return `<div class="mail-empty reader-empty">Choose an email thread to read and reply.</div>`;
  }
  const messages = data.messages.length
    ? data.messages.map((message) => {
        const fromLabel = [message.from_name, message.from_email].filter(Boolean).join(' <') + (message.from_name && message.from_email ? '>' : '') || 'unknown sender';
        const recipients = renderMailRecipients(message.to_json);
        return `<article class="email-message-card" data-direction="${escapeHtml(message.direction)}">
          <header class="email-message-header">
            <div class="email-message-sender">
              <strong>${escapeHtml(fromLabel)}</strong>
              <span>${escapeHtml(message.subject || selectedThread.subject || '(no subject)')}</span>
            </div>
            <time>${formatDate(message.created_at)}</time>
          </header>
          <dl class="email-message-meta">
            <div><dt>From</dt><dd>${escapeHtml(fromLabel)}</dd></div>
            <div><dt>To</dt><dd>${escapeHtml(recipients)}</dd></div>
            <div><dt>Date</dt><dd>${formatDate(message.created_at)}</dd></div>
          </dl>
          <div class="email-message-body"><pre>${escapeHtml(message.text_body || message.html_body || '')}</pre></div>
          ${renderMailAttachments(message.attachments)}
        </article>`;
      }).join('')
    : `<div class="mail-empty">This thread has no stored emails yet.</div>`;
  return `<div class="mail-reader-head">
      <p class="eyebrow">Email thread</p>
      <h1>${escapeHtml(selectedThread.subject || '(no subject)')}</h1>
      <p class="mail-thread-summary">${escapeHtml(String(data.messages.length || selectedThread.message_count || 0))} emails in this conversation</p>
      <div class="mail-action-bar" aria-label="Email actions">
        <a class="mail-action" href="/mail/threads/${encodeURIComponent(selectedThread.id)}/forward">Forward</a>
        <form method="post" action="/mail/threads/${escapeHtml(selectedThread.id)}/delete">
          <button class="mail-action danger" type="submit">Delete</button>
        </form>
      </div>
    </div>
    <div class="mail-messages" data-reader-layout="email-thread">${messages}</div>
    <form class="mail-reply" method="post" action="/mail/threads/${escapeHtml(selectedThread.id)}/reply">
      <label for="reply-text">Reply by email</label>
      <textarea id="reply-text" name="text" rows="6" placeholder="Write an email reply…" required></textarea>
      <div class="mail-reply-actions"><span>Sent through Reverbin and saved to this email thread.</span><button type="submit">Send reply</button></div>
    </form>`;
}

export function renderMailPage(data: MailPageData) {
  const selectedInboxId = data.selectedInboxId ?? data.inboxes[0]?.id ?? null;
  const inboxLinks = data.inboxes.length
    ? data.inboxes.map((inbox) => {
        const selected = inbox.id === selectedInboxId;
        return `<a class="mail-inbox-link ${selected ? 'selected' : ''}" href="/mail?inbox_id=${encodeURIComponent(inbox.id)}" aria-current="${selected ? 'page' : 'false'}">
          <span><strong>${escapeHtml(inbox.display_name || inbox.email_address)}</strong><small>${escapeHtml(inbox.email_address)}</small></span>
          <em>${escapeHtml(String(inbox.thread_count ?? 0))}</em>
        </a>`;
      }).join('')
    : `<div class="mail-empty">No inboxes yet. Create one from the operations dashboard.</div>`;

  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Mail - Human inbox console</title>
  <meta name="description" content="A Gmail-style human mail console for managing Reverbin agent inboxes, threads, and replies." />
  <style>
    :root { color-scheme: dark; --bg:#080909; --panel:#101214; --panel-2:#15181b; --line:rgba(244,244,242,.12); --line-strong:rgba(244,244,242,.22); --ivory:#F4F4F2; --muted:rgba(244,244,242,.68); --soft:rgba(244,244,242,.44); --signal:#B9FF2D; --mint:#BDE6D3; --danger:#ff7b7b; }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; background:var(--bg); color:var(--ivory); font-family:'Geist', Inter, ui-sans-serif, system-ui, sans-serif; overflow:hidden; }
    a { color:inherit; text-decoration:none; }
    button, textarea, input { font:inherit; }
    .mail-shell { height:100vh; display:grid; grid-template-rows:64px 1fr; background:linear-gradient(135deg, rgba(185,255,45,.05), transparent 38%), var(--bg); max-width:100%; overflow-x:hidden; }
    .mail-topbar { display:flex; align-items:center; gap:16px; padding:10px 18px; border-bottom:1px solid var(--line); background:rgba(8,9,9,.9); min-width:0; }
    .brand { display:flex; align-items:center; gap:10px; min-width:210px; min-height:44px; font-weight:800; }
    .brand-mark { width:34px; height:34px; flex:0 0 auto; }
    .mail-search { flex:1; min-width:180px; max-width:760px; position:relative; }
    .mail-search input { width:100%; min-height:44px; border:1px solid var(--line); border-radius:999px; padding:0 18px; background:rgba(244,244,242,.06); color:var(--ivory); }
    .top-actions { margin-left:auto; display:flex; gap:10px; align-items:center; color:var(--muted); font-size:13px; }
    .top-actions a { min-height:44px; display:inline-flex; align-items:center; padding:10px 12px; border:1px solid var(--line); border-radius:999px; }
    .mail-layout { min-height:0; display:grid; grid-template-columns:280px minmax(320px, 430px) minmax(0, 1fr); }
    .mail-sidebar, .mail-thread-list, .mail-reader { min-height:0; overflow:auto; border-right:1px solid var(--line); }
    .mail-sidebar { padding:18px 14px; background:rgba(244,244,242,.035); }
    .compose { display:flex; align-items:center; justify-content:center; min-height:48px; margin:0 0 18px; border-radius:18px; background:var(--ivory); color:#050606; font-weight:800; box-shadow:0 18px 40px rgba(0,0,0,.24); }
    .mail-nav { display:grid; gap:6px; margin-bottom:20px; }
    .mail-nav a, .mail-inbox-link, .mailbox-create-link { display:flex; align-items:center; justify-content:space-between; gap:10px; min-height:44px; padding:10px 12px; border-radius:14px; color:var(--muted); }
    .mail-nav a:hover, .mail-inbox-link:hover, .mail-inbox-link.selected, .mailbox-create-link:hover { background:rgba(185,255,45,.09); color:var(--ivory); }
    .mailbox-create-link { margin:8px 0 2px; border:1px dashed var(--line); color:var(--signal); font-weight:850; justify-content:center; }
    .mail-inbox-link span { display:grid; gap:3px; min-width:0; }
    .mail-inbox-link strong, .mail-inbox-link small { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .mail-inbox-link small { color:var(--soft); }
    .mail-inbox-link em { min-width:28px; text-align:center; font-style:normal; color:var(--signal); }
    .section-label { margin:18px 12px 8px; color:var(--soft); text-transform:uppercase; letter-spacing:.14em; font-size:11px; font-weight:800; }
    .mail-thread-list { background:var(--panel); }
    .thread-list-head { position:sticky; top:0; z-index:2; padding:18px; border-bottom:1px solid var(--line); background:rgba(16,18,20,.96); }
    .thread-list-head h2 { margin:0; font-size:20px; }
    .thread-list-head p { margin:5px 0 0; color:var(--soft); font-size:13px; }
    .mail-bulk-actions { margin:0; }
    .bulk-action-bar { position:sticky; top:76px; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 14px; border-bottom:1px solid rgba(244,244,242,.075); background:rgba(16,18,20,.94); color:var(--soft); font-size:12px; }
    .mail-thread-row { display:grid; grid-template-columns:44px minmax(0, 1fr); border-bottom:1px solid rgba(244,244,242,.075); }
    .mail-thread-row.selected { background:rgba(185,255,45,.08); box-shadow:inset 3px 0 0 var(--signal); }
    .mail-thread-select { display:flex; align-items:flex-start; justify-content:center; padding-top:18px; }
    .mail-thread-select input { width:18px; height:18px; accent-color:var(--signal); cursor:pointer; }
    .mail-thread { display:grid; gap:6px; padding:15px 18px 15px 0; }
    .mail-thread.selected { background:transparent; box-shadow:none; }
    .thread-open-label { color:var(--signal); font-weight:800; }
    .mail-thread-top { display:flex; justify-content:space-between; gap:12px; color:var(--ivory); font-size:14px; }
    .mail-thread time, .mail-thread-meta { color:var(--soft); font-size:12px; }
    .mail-thread-subject { font-weight:750; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .mail-thread-preview { color:var(--muted); font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .mail-reader { background:var(--panel-2); padding:0; border-right:0; }
    .mail-reader-head { position:sticky; top:0; z-index:2; padding:24px 28px 18px; border-bottom:1px solid var(--line); background:rgba(21,24,27,.96); }
    .eyebrow { margin:0 0 8px; color:var(--signal); text-transform:uppercase; font-size:11px; font-weight:900; letter-spacing:.16em; }
    .mail-reader h1 { margin:0; font-size:28px; line-height:1.15; }
    .mail-thread-summary { margin:10px 0 0; color:var(--muted); font-size:13px; }
    .mail-action-bar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:16px; }
    .mail-action-bar form { margin:0; }
    .mail-action { display:inline-flex; align-items:center; justify-content:center; min-height:36px; border:1px solid var(--line); border-radius:999px; padding:0 14px; background:rgba(244,244,242,.045); color:var(--ivory); font-weight:850; font-size:13px; cursor:pointer; }
    .mail-action.danger { color:var(--danger); border-color:rgba(255,123,123,.32); background:rgba(255,123,123,.07); }
    .mail-messages { display:grid; gap:14px; padding:22px 28px; }
    .email-message-card { border:1px solid var(--line); border-radius:14px; background:#0f1113; box-shadow:0 16px 35px rgba(0,0,0,.18); overflow:hidden; }
    .email-message-header { display:flex; justify-content:space-between; gap:16px; padding:16px 18px; border-bottom:1px solid var(--line); background:rgba(244,244,242,.035); }
    .email-message-sender { display:grid; gap:5px; min-width:0; }
    .email-message-sender strong { color:var(--ivory); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .email-message-sender span { color:var(--muted); font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .email-message-header time { color:var(--soft); font-size:12px; white-space:nowrap; }
    .email-message-meta { display:grid; gap:6px; margin:0; padding:14px 18px 0; color:var(--muted); font-size:13px; }
    .email-message-meta div { display:grid; grid-template-columns:58px minmax(0, 1fr); gap:10px; }
    .email-message-meta dt { color:var(--soft); font-weight:800; }
    .email-message-meta dd { margin:0; overflow-wrap:anywhere; }
    .email-message-body { padding:16px 18px 18px; }
    .email-message-body pre { margin:0; white-space:pre-wrap; overflow-wrap:anywhere; color:rgba(244,244,242,.86); line-height:1.58; font-family:'Geist', Inter, ui-sans-serif, system-ui, sans-serif; }
    .mail-attachments { display:grid; gap:10px; list-style:none; margin:0; padding:0 18px 18px; }
    .mail-attachment { display:grid; grid-template-columns:72px minmax(0, 1fr); align-items:center; gap:12px; border:1px solid var(--line); border-radius:14px; padding:10px; background:rgba(244,244,242,.035); }
    .mail-attachment-thumb, .mail-attachment-icon { width:72px; min-height:54px; display:flex; align-items:center; justify-content:center; border-radius:10px; overflow:hidden; background:rgba(189,230,211,.08); color:var(--signal); font-weight:900; }
    .mail-attachment-thumb img { width:100%; height:54px; object-fit:cover; display:block; }
    .mail-attachment-details { display:grid; gap:4px; min-width:0; }
    .mail-attachment-details strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .mail-attachment-details span { color:var(--soft); font-size:12px; overflow-wrap:anywhere; }
    .mail-reply { margin:0 28px 28px; padding:16px; border:1px solid var(--line-strong); border-radius:20px; background:#0b0d0e; display:grid; gap:10px; }

    .mail-reply textarea { width:100%; resize:vertical; border:1px solid var(--line); border-radius:14px; padding:12px; background:rgba(244,244,242,.045); color:var(--ivory); }
    .mail-reply-actions { display:flex; justify-content:space-between; gap:14px; align-items:center; color:var(--soft); font-size:12px; }
    .mail-reply button { min-height:42px; border:0; border-radius:999px; padding:0 18px; background:var(--signal); color:#050606; font-weight:900; cursor:pointer; }
    .mail-empty { margin:16px; padding:18px; border:1px dashed var(--line); border-radius:16px; color:var(--soft); }
    .reader-empty { margin:28px; }
    .mail-notice { margin:12px 18px 0; padding:10px 12px; border:1px solid rgba(185,255,45,.28); border-radius:12px; color:var(--signal); background:rgba(185,255,45,.07); font-weight:800; }
    @media (max-width: 980px) { body { overflow:auto; } .mail-shell { height:auto; min-height:100vh; } .mail-topbar { display:grid; grid-template-columns:1fr; height:auto; min-height:64px; } .mail-search { display:none; } .mail-layout { grid-template-columns:1fr; width:100%; max-width:100%; } .mail-sidebar, .mail-thread-list, .mail-reader { width:100%; max-width:100%; border-right:0; border-bottom:1px solid var(--line); } .brand { min-width:0; } .top-actions { display:none; } }
  </style>
</head>
<body>
  <main class="mail-shell" data-surface-id="human-mail-console">
    <header class="mail-topbar">
      <a class="brand" href="/mail">${reverbinMarkSvg()}<span>Reverbin Mail</span></a>
      <div class="mail-search"><input type="search" placeholder="Search mail" aria-label="Search mail" disabled /></div>
      <div class="top-actions"><a href="/mail/billing">Billing</a><a href="/mail/settings">Settings</a><a href="/mail/webhooks">Webhooks</a><a href="/docs">Docs</a><a href="/dashboard/logout">Logout</a></div>
    </header>
    <section class="mail-layout" aria-label="Gmail-style human mail management console">
      <aside class="mail-sidebar" aria-label="Mail navigation">
        <a class="compose" href="/mail/compose${selectedInboxId ? `?inbox_id=${encodeURIComponent(selectedInboxId)}` : ''}">Compose</a>
        <nav class="mail-nav" aria-label="Mail folders">
          <a href="/mail">Inbox</a>
          <a href="/mail?folder=sent">Sent</a>
          <a href="/mail/webhooks">Webhooks</a>
          <a href="/mail/settings">Settings</a>
        </nav>
        <div class="section-label">MAILBOXES</div>
        ${inboxLinks}
        <a class="mailbox-create-link" href="/mail/mailboxes/new">Create mailbox</a>
      </aside>
      <section class="mail-thread-list" aria-label="Thread list">
        <div class="thread-list-head"><h2>Inbox</h2><p>Human-readable threads from agent inboxes.</p></div>
        ${renderMailNotice(data.notice)}
        ${renderMailThreads(data)}
      </section>
      <section class="mail-reader" aria-label="Thread conversation">
        ${renderMailMessages(data)}
      </section>
    </section>
  </main>
</body>
</html>`;
}

function renderSettingsNotice(notice?: string | null) {
  if (!notice) return '';
  const label = notice === 'settings_saved' ? 'Settings saved'
    : notice === 'webhook_created' ? 'Webhook added'
      : notice === 'compose_sent' ? 'Message sent'
        : notice === 'compose_pending' ? 'Message queued for approval'
          : notice === 'mailbox_quota' ? 'You already have the maximum number of mailboxes for this plan'
            : notice === 'billing_not_configured' ? 'Stripe Checkout is not configured yet'
              : notice === 'billing_invalid' ? 'Choose a valid paid plan'
                : notice === 'billing_success' ? 'Checkout complete. Stripe is syncing your plan now.'
                  : notice === 'billing_canceled' ? 'Checkout canceled'
                    : notice === 'billing_portal_unavailable' ? 'Billing portal is unavailable until a paid Stripe customer exists'
                      : notice === 'mailbox_exists' ? 'That mailbox address already exists'
              : notice === 'mailbox_invalid' ? 'Enter a valid mailbox address'
                : notice === 'forward_sent' ? 'Forward sent'
                  : notice === 'forward_pending' ? 'Forward queued for approval'
                    : notice;
  return `<div class="settings-notice" role="status">${escapeHtml(label)}</div>`;
}

function renderMailSettingsSidebar(inboxes: MailInboxView[], active: 'inbox' | 'webhooks' | 'settings' | 'billing', selectedInboxId?: string | null) {
  const selectedId = selectedInboxId ?? inboxes[0]?.id ?? null;
  const inboxLinks = inboxes.length
    ? inboxes.map((inbox) => {
        const selected = inbox.id === selectedId;
        return `<a class="mail-inbox-link ${selected ? 'selected' : ''}" href="/mail/settings?inbox_id=${encodeURIComponent(inbox.id)}" aria-current="${selected ? 'page' : 'false'}">
          <span><strong>${escapeHtml(inbox.display_name || inbox.email_address)}</strong><small>${escapeHtml(inbox.email_address)}</small></span>
          <em>${escapeHtml(inbox.status || 'active')}</em>
        </a>`;
      }).join('')
    : `<div class="mail-empty">No inboxes yet.</div>`;
  const nav = [
    ['inbox', '/mail', 'Inbox'],
    ['webhooks', '/mail/webhooks', 'Webhooks'],
    ['billing', '/mail/billing', 'Billing'],
    ['settings', '/mail/settings', 'Settings'],
  ] as const;
  return `<aside class="mail-sidebar" aria-label="Mailbox settings navigation">
    <a class="compose" href="/mail/compose${selectedId ? `?inbox_id=${encodeURIComponent(selectedId)}` : ''}">Compose</a>
    <nav class="mail-nav" aria-label="Mail folders">
      ${nav.map(([key, href, label]) => `<a class="${active === key ? 'selected' : ''}" href="${href}">${label}</a>`).join('')}
    </nav>
    <div class="section-label">MAILBOXES</div>
    ${inboxLinks}
    <a class="mailbox-create-link" href="/mail/mailboxes/new">Create mailbox</a>
  </aside>`;
}

function mailSettingsCss() {
  return `:root { color-scheme: dark; --bg:#080909; --panel:#101214; --panel-2:#15181b; --line:rgba(244,244,242,.12); --line-strong:rgba(244,244,242,.22); --ivory:#F4F4F2; --muted:rgba(244,244,242,.68); --soft:rgba(244,244,242,.44); --signal:#B9FF2D; --mint:#BDE6D3; --danger:#ff7b7b; }
    * { box-sizing: border-box; } body { margin:0; min-height:100vh; background:var(--bg); color:var(--ivory); font-family:'Geist', Inter, ui-sans-serif, system-ui, sans-serif; } a { color:inherit; text-decoration:none; } button, textarea, input, select { font:inherit; }
    .mail-shell { min-height:100vh; display:grid; grid-template-rows:64px 1fr; background:linear-gradient(135deg, rgba(185,255,45,.05), transparent 38%), var(--bg); max-width:100%; overflow-x:hidden; }
    .mail-topbar { display:flex; align-items:center; gap:16px; padding:10px 18px; border-bottom:1px solid var(--line); background:rgba(8,9,9,.9); min-width:0; } .brand { display:flex; align-items:center; gap:10px; min-width:210px; min-height:44px; font-weight:800; } .brand-mark { width:34px; height:34px; flex:0 0 auto; } .mail-search { flex:1; min-width:0; } .mail-search input { width:100%; max-width:760px; min-height:44px; border:1px solid var(--line); border-radius:999px; padding:0 18px; background:rgba(244,244,242,.06); color:var(--ivory); } .top-actions { margin-left:auto; display:flex; gap:10px; align-items:center; color:var(--muted); font-size:13px; } .top-actions a { min-height:44px; display:inline-flex; align-items:center; padding:10px 12px; border:1px solid var(--line); border-radius:999px; }
    .settings-layout { min-height:0; display:grid; grid-template-columns:280px minmax(0, 1fr); } .mail-sidebar { padding:18px 14px; background:rgba(244,244,242,.035); border-right:1px solid var(--line); } .compose { display:flex; align-items:center; justify-content:center; min-height:48px; margin:0 0 18px; border-radius:18px; background:var(--ivory); color:#050606; font-weight:800; } .mail-nav { display:grid; gap:6px; margin-bottom:20px; } .mail-nav a, .mail-inbox-link, .mailbox-create-link { display:flex; align-items:center; justify-content:space-between; gap:10px; min-height:44px; padding:10px 12px; border-radius:14px; color:var(--muted); } .mail-nav a:hover, .mail-nav a.selected, .mail-inbox-link:hover, .mail-inbox-link.selected, .mailbox-create-link:hover { background:rgba(185,255,45,.09); color:var(--ivory); } .mailbox-create-link { margin:8px 0 2px; border:1px dashed var(--line); color:var(--signal); font-weight:850; justify-content:center; } .mail-inbox-link span { display:grid; gap:3px; min-width:0; } .mail-inbox-link strong, .mail-inbox-link small { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } .mail-inbox-link small, .mail-inbox-link em { color:var(--soft); } .mail-inbox-link em { font-style:normal; font-size:12px; } .section-label { margin:18px 12px 8px; color:var(--soft); text-transform:uppercase; letter-spacing:.14em; font-size:11px; font-weight:800; }
    .settings-main { padding:28px; overflow:auto; } .settings-hero { display:flex; justify-content:space-between; gap:20px; align-items:flex-start; margin-bottom:20px; } .eyebrow { margin:0 0 8px; color:var(--signal); text-transform:uppercase; font-size:11px; font-weight:900; letter-spacing:.16em; } h1 { margin:0; font-size:34px; } .settings-hero p, .form-note { color:var(--muted); line-height:1.55; } .settings-card { max-width:920px; border:1px solid var(--line); border-radius:22px; padding:20px; background:rgba(244,244,242,.045); margin-bottom:18px; } .settings-grid { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:14px; } label { display:grid; gap:7px; color:var(--muted); font-size:13px; font-weight:700; } input, textarea, select { width:100%; min-height:44px; border:1px solid var(--line); border-radius:13px; padding:11px 12px; background:#0b0d0e; color:var(--ivory); } textarea { min-height:96px; resize:vertical; } .advanced-settings { margin-top:16px; border:1px solid var(--line); border-radius:18px; background:rgba(244,244,242,.035); overflow:hidden; } .advanced-settings summary { cursor:pointer; padding:14px 16px; color:var(--ivory); font-weight:900; list-style:none; } .advanced-settings summary::-webkit-details-marker { display:none; } .advanced-settings summary::after { content:'+'; float:right; color:var(--signal); } .advanced-settings[open] summary::after { content:'−'; } .advanced-body { display:grid; gap:14px; padding:0 16px 16px; } .check-row { display:flex; align-items:center; gap:10px; border:1px solid var(--line); border-radius:14px; padding:12px; color:var(--muted); } .check-row input { width:auto; } .settings-actions { display:flex; justify-content:flex-end; margin-top:16px; } button { min-height:42px; border:0; border-radius:999px; padding:0 18px; background:var(--signal); color:#050606; font-weight:900; cursor:pointer; } .settings-notice { max-width:920px; margin:0 0 14px; padding:10px 12px; border:1px solid rgba(185,255,45,.28); border-radius:12px; color:var(--signal); background:rgba(185,255,45,.07); font-weight:800; } .webhook-list { display:grid; gap:10px; } .webhook-row { border:1px solid var(--line); border-radius:16px; padding:14px; background:rgba(244,244,242,.04); } .webhook-row strong { display:block; overflow-wrap:anywhere; } .webhook-row span { color:var(--muted); font-size:13px; } .mail-empty { padding:16px; border:1px dashed var(--line); border-radius:16px; color:var(--soft); }
    .plan-kicker { margin:14px 0 8px; color:var(--signal); text-transform:uppercase; letter-spacing:.12em; font-size:11px; font-weight:900; } .billing-plan h3 { margin:0 0 8px; font-size:20px; } .billing-plan p { color:var(--muted); line-height:1.55; } .plan-value-list { display:grid; gap:8px; margin:14px 0; padding:0; list-style:none; color:var(--ivory); } .plan-value-list li { display:grid; grid-template-columns:10px minmax(0, 1fr); gap:9px; font-size:13px; color:rgba(244,244,242,.82); } .plan-value-list li::before { content:''; width:6px; height:6px; margin-top:7px; border-radius:50%; background:var(--signal); }
    @media (max-width: 900px) { .settings-layout { grid-template-columns:1fr; width:100%; max-width:100%; } .mail-topbar { display:grid; grid-template-columns:1fr; height:auto; min-height:64px; } .mail-search { display:none; } .mail-sidebar { border-right:0; border-bottom:1px solid var(--line); } .settings-grid { grid-template-columns:1fr; } .top-actions { display:none; } .brand { min-width:0; } }`;
}

function textareaValue(items: string[]) {
  return escapeHtml(items.join('\n'));
}

function checked(value: boolean) {
  return value ? ' checked' : '';
}

function renderEventList(value: unknown) {
  if (!Array.isArray(value)) return 'all events';
  const events = value.map((item) => String(item)).filter(Boolean);
  return events.includes('*') ? 'all events' : events.join(', ');
}

function formatPlanValue(value: number | null, suffix: string) {
  if (value === null || value >= Number.MAX_SAFE_INTEGER) return 'Custom';
  return `${value.toLocaleString()} ${suffix}`;
}

export function renderMailBillingPage(data: MailBillingPageData) {
  const currentPlan = data.tenant.plan || 'free';
  const currentPlanLabel = data.plans.find((plan) => plan.key === currentPlan)?.label ?? currentPlan;
  const paidPlans = data.plans.filter((plan) => plan.key === 'developer' || plan.key === 'startup');
  const planCards = paidPlans.map((plan) => {
    const current = plan.key === currentPlan;
    const valueLabel = plan.key === 'developer' ? 'Production agent workflows' : 'Team-scale agent email';
    return `<article class="settings-card billing-plan ${current ? 'current' : ''}">
      <p class="eyebrow">${escapeHtml(plan.label)}</p>
      <h2>$${escapeHtml(String(plan.price_monthly_usd ?? 'Custom'))}/mo</h2>
      <p class="form-note"><strong>${escapeHtml(valueLabel)}</strong></p>
      ${renderPlanValueList(plan.key)}
      <p class="form-note">${escapeHtml(formatPlanValue(plan.max_inboxes, 'mailboxes'))} · ${escapeHtml(formatPlanValue(plan.emails_per_month, 'emails/month'))} · ${escapeHtml(formatPlanValue(plan.max_webhooks, 'webhooks'))}</p>
      <form method="post" action="/mail/billing/checkout">
        <input type="hidden" name="plan" value="${escapeHtml(plan.key)}" />
        <button type="submit">${current ? 'Current plan' : `Upgrade to ${escapeHtml(plan.label)}`}</button>
      </form>
    </article>`;
  }).join('');
  const portalForm = data.tenant.stripe_customer_id
    ? `<form method="post" action="/mail/billing/portal"><button type="submit">Manage subscription</button></form>`
    : `<p class="form-note">After your first checkout, billing management opens here through Stripe Customer Portal.</p>`;
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Billing</title>
  <meta name="description" content="Upgrade Reverbin mailbox quotas through hosted Stripe Checkout." />
  <style>${mailSettingsCss()}</style>
</head>
<body>
  <main class="mail-shell" data-surface-id="mail-billing">
    <header class="mail-topbar">
      <a class="brand" href="/mail">${reverbinMarkSvg()}<span>Reverbin Mail</span></a>
      <div class="mail-search"><input type="search" placeholder="Search mail" aria-label="Search mail" disabled /></div>
      <div class="top-actions"><a href="/mail/billing">Billing</a><a href="/mail/settings">Settings</a><a href="/mail/webhooks">Webhooks</a><a href="/docs">Docs</a><a href="/dashboard/logout">Logout</a></div>
    </header>
    <section class="settings-layout" aria-label="Billing">
      ${renderMailSettingsSidebar(data.inboxes, 'billing')}
      <section class="settings-main">
        <div class="settings-hero">
          <div>
            <p class="eyebrow">Billing</p>
            <h1>Upgrade with hosted Stripe Checkout.</h1>
            <p>Paid upgrades are handled by hosted Stripe Checkout with Link available inside Stripe when enabled on the Stripe account. Reverbin never collects payment details.</p>
          </div>
        </div>
        ${renderSettingsNotice(data.notice)}
        <div class="settings-card billing-current">
          <p class="eyebrow">Current plan</p>
          <h2>${escapeHtml(currentPlanLabel)}</h2>
          <p class="form-note">Billing status: ${escapeHtml(data.tenant.billing_status || 'active')}</p>
          ${portalForm}
        </div>
        <div class="billing-grid">${planCards}</div>
      </section>
    </section>
  </main>
</body>
</html>`;
}

export function renderMailCreateMailboxPage(data: MailCreateMailboxPageData) {
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Create Mailbox</title>
  <meta name="description" content="Create another Reverbin mailbox for this agent from the mail dashboard." />
  <style>${mailSettingsCss()}</style>
</head>
<body>
  <main class="mail-shell" data-surface-id="mail-create-mailbox">
    <header class="mail-topbar">
      <a class="brand" href="/mail">${reverbinMarkSvg()}<span>Reverbin Mail</span></a>
      <div class="mail-search"><input type="search" placeholder="Search mail" aria-label="Search mail" disabled /></div>
      <div class="top-actions"><a href="/mail/billing">Billing</a><a href="/mail/settings">Settings</a><a href="/mail/webhooks">Webhooks</a><a href="/docs">Docs</a><a href="/dashboard/logout">Logout</a></div>
    </header>
    <section class="settings-layout" aria-label="Create mailbox">
      ${renderMailSettingsSidebar(data.inboxes, 'inbox')}
      <section class="settings-main">
        <div class="settings-hero"><div><p class="eyebrow">Mailboxes</p><h1>Create mailbox</h1><p>Add another Reverbin address for this agent. Free beta agents can use 2 mailboxes per agent.</p></div></div>
        ${renderSettingsNotice(data.notice)}
        <form class="settings-card" method="post" action="/mail/mailboxes">
          <div class="settings-grid">
            <label>Email address<input type="email" name="email_address" placeholder="second@reverbin.com" required /></label>
            <label>Display name<input type="text" name="display_name" placeholder="Second Inbox" /></label>
          </div>
          <p class="form-note">Use a root-domain Reverbin address. The new mailbox appears in the Mailboxes list immediately after creation.</p>
          <div class="settings-actions"><button type="submit">Create mailbox</button></div>
        </form>
      </section>
    </section>
  </main>
</body>
</html>`;
}

export function renderMailSettingsPage(data: MailSettingsPageData) {
  const selectedInboxId = data.selectedInboxId ?? data.inboxes[0]?.id ?? '';
  const selectedInbox = data.inboxes.find((inbox) => inbox.id === selectedInboxId) ?? data.inboxes[0] ?? null;
  const policy = data.policy;
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Mail Settings</title>
  <meta name="description" content="Simple Reverbin inbox settings for display names, limits, approvals, links, and recipient policy." />
  <style>${mailSettingsCss()}</style>
</head>
<body>
  <main class="mail-shell" data-surface-id="mail-settings">
    <header class="mail-topbar">
      <a class="brand" href="/mail">${reverbinMarkSvg()}<span>Reverbin Mail</span></a>
      <div class="mail-search"><input type="search" placeholder="Search mail" aria-label="Search mail" disabled /></div>
      <div class="top-actions"><a href="/mail/billing">Billing</a><a href="/mail/settings">Settings</a><a href="/mail/webhooks">Webhooks</a><a href="/docs">Docs</a><a href="/dashboard/logout">Logout</a></div>
    </header>
    <section class="settings-layout" aria-label="Simple inbox settings">
      ${renderMailSettingsSidebar(data.inboxes, 'settings', selectedInboxId)}
      <section class="settings-main">
        <div class="settings-hero"><div><p class="eyebrow">Settings</p><h1>Mailbox settings</h1><p>Make the common changes for this inbox without opening the operations dashboard.</p></div></div>
        ${renderSettingsNotice(data.notice)}
        <form class="settings-card" method="post" action="/mail/settings">
          <input type="hidden" name="inbox_id" value="${escapeHtml(selectedInboxId)}" />
          <div class="settings-grid">
            <label>Inbox address<input type="email" value="${escapeHtml(selectedInbox?.email_address ?? '')}" disabled /></label>
            <label>Display name<input type="text" name="display_name" value="${escapeHtml(selectedInbox?.display_name ?? '')}" placeholder="Support Team" /></label>
          </div>
          <p class="form-note">Keep the everyday settings simple. Policy controls stay tucked away for teams that need stricter routing.</p>
          <details class="advanced-settings">
            <summary>Advanced policy controls</summary>
            <div class="advanced-body">
              <div class="settings-grid">
                <label>Max outbound per hour<input type="number" min="1" max="10000" name="max_outbound_per_hour" value="${escapeHtml(String(policy.max_outbound_per_hour))}" required /></label>
                <label>Max outbound per day<input type="number" min="1" max="100000" name="max_outbound_per_day" value="${escapeHtml(String(policy.max_outbound_per_day))}" required /></label>
                <label>Risk threshold<select name="risk_threshold"><option value="low"${policy.risk_threshold === 'low' ? ' selected' : ''}>Low</option><option value="medium"${policy.risk_threshold === 'medium' ? ' selected' : ''}>Medium</option><option value="high"${policy.risk_threshold === 'high' ? ' selected' : ''}>High</option></select></label>
                <label>Allowed domains<textarea name="allowed_domains" placeholder="example.com">${textareaValue(policy.allowed_domains)}</textarea></label>
                <label>Blocked domains<textarea name="blocked_domains" placeholder="spam.test">${textareaValue(policy.blocked_domains)}</textarea></label>
                <label>Blocked recipients<textarea name="blocked_recipients" placeholder="blocked@example.com">${textareaValue(policy.blocked_recipients)}</textarea></label>
              </div>
              <p class="form-note">Use these only when an agent needs stricter sending limits or recipient/domain guardrails.</p>
              <label class="check-row"><input type="checkbox" name="require_approval_for_new_recipients" value="true"${checked(policy.require_approval_for_new_recipients)} /> Require approval for first-time recipients</label>
              <label class="check-row"><input type="checkbox" name="require_approval_for_external_domains" value="true"${checked(policy.require_approval_for_external_domains)} /> Require approval outside allowed domains</label>
              <label class="check-row"><input type="checkbox" name="reply_only" value="true"${checked(policy.reply_only)} /> Reply-only mode</label>
              <label class="check-row"><input type="checkbox" name="allow_links" value="true"${checked(policy.allow_links)} /> Allow links in outbound mail</label>
              <label class="check-row"><input type="checkbox" name="allow_attachments" value="true"${checked(policy.allow_attachments)} /> Allow attachments</label>
            </div>
          </details>
          <div class="settings-actions"><button type="submit">Save settings</button></div>
        </form>
      </section>
    </section>
  </main>
</body>
</html>`;
}

function defaultForwardSubject(subject?: string | null) {
  const value = subject || '(no subject)';
  return /^fwd?:/i.test(value) ? value : `Fwd: ${value}`;
}

function defaultForwardBody(thread: MailThreadView, messages: MailMessageView[]) {
  const quoted = messages.map((message) => {
    const fromLabel = [message.from_name, message.from_email].filter(Boolean).join(' <') + (message.from_name && message.from_email ? '>' : '') || 'unknown sender';
    const recipients = renderMailRecipients(message.to_json);
    return `From: ${fromLabel}\nTo: ${recipients}\nDate: ${formatDate(message.created_at)}\nSubject: ${message.subject || thread.subject || '(no subject)'}\n\n${message.text_body || message.html_body || ''}`;
  }).join('\n\n---\n\n');
  return `\n\n---------- Forwarded message ---------\nSubject: ${thread.subject || '(no subject)'}\n\n${quoted}`;
}

export function renderMailForwardPage(data: MailForwardPageData) {
  const selectedInboxId = data.selectedInboxId ?? data.thread.inbox_id ?? data.inboxes[0]?.id ?? '';
  const selectedInbox = data.inboxes.find((inbox) => inbox.id === selectedInboxId) ?? data.inboxes[0] ?? null;
  const subject = defaultForwardSubject(data.thread.subject);
  const body = defaultForwardBody(data.thread, data.messages);
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Mail Forward</title>
  <meta name="description" content="Forward a Reverbin email thread from the human mail console." />
  <style>${mailSettingsCss()}</style>
</head>
<body>
  <main class="mail-shell" data-surface-id="mail-forward">
    <header class="mail-topbar">
      <a class="brand" href="/mail">${reverbinMarkSvg()}<span>Reverbin Mail</span></a>
      <div class="mail-search"><input type="search" placeholder="Search mail" aria-label="Search mail" disabled /></div>
      <div class="top-actions"><a href="/mail/billing">Billing</a><a href="/mail/settings">Settings</a><a href="/mail/webhooks">Webhooks</a><a href="/docs">Docs</a><a href="/dashboard/logout">Logout</a></div>
    </header>
    <section class="settings-layout" aria-label="Forward email thread">
      ${renderMailSettingsSidebar(data.inboxes, 'inbox', selectedInboxId)}
      <section class="settings-main">
        <div class="settings-hero"><div><p class="eyebrow">Forward</p><h1>Forward email</h1><p>Forward this email thread from ${escapeHtml(selectedInbox?.email_address ?? 'your Reverbin inbox')} without leaving the mail console.</p></div></div>
        ${renderSettingsNotice(data.notice)}
        <form class="settings-card" method="post" action="/mail/threads/${escapeHtml(data.thread.id)}/forward">
          <label>To<input type="text" name="to" placeholder="recipient@example.com" autocomplete="email" required /></label>
          <label>Subject<input type="text" name="subject" value="${escapeHtml(subject)}" required /></label>
          <label>Message<textarea name="text" rows="16" required>${escapeHtml(body)}</textarea></label>
          <p class="form-note">Forwarded message content is prefilled so you can edit it before sending. Sent forwards are saved to the original email thread.</p>
          <div class="settings-actions"><a class="button" href="/mail?thread_id=${encodeURIComponent(data.thread.id)}">Cancel</a><button type="submit">Send forward</button></div>
        </form>
      </section>
    </section>
  </main>
</body>
</html>`;
}

export function renderMailComposePage(data: MailComposePageData) {
  const selectedInboxId = data.selectedInboxId ?? data.inboxes[0]?.id ?? '';
  const selectedInbox = data.inboxes.find((inbox) => inbox.id === selectedInboxId) ?? data.inboxes[0] ?? null;
  const inboxOptions = data.inboxes.map((inbox) => `<option value="${escapeHtml(inbox.id)}"${inbox.id === selectedInboxId ? ' selected' : ''}>${escapeHtml(inbox.display_name || inbox.email_address)} · ${escapeHtml(inbox.email_address)}</option>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Mail Compose</title>
  <meta name="description" content="Compose a new outbound Reverbin email thread from an agent inbox." />
  <style>${mailSettingsCss()}</style>
</head>
<body>
  <main class="mail-shell" data-surface-id="mail-compose">
    <header class="mail-topbar">
      <a class="brand" href="/mail">${reverbinMarkSvg()}<span>Reverbin Mail</span></a>
      <div class="mail-search"><input type="search" placeholder="Search mail" aria-label="Search mail" disabled /></div>
      <div class="top-actions"><a href="/mail/billing">Billing</a><a href="/mail/settings">Settings</a><a href="/mail/webhooks">Webhooks</a><a href="/docs">Docs</a><a href="/dashboard/logout">Logout</a></div>
    </header>
    <section class="settings-layout" aria-label="Compose outbound mail">
      ${renderMailSettingsSidebar(data.inboxes, 'inbox', selectedInboxId)}
      <section class="settings-main">
        <div class="settings-hero"><div><p class="eyebrow">Compose</p><h1>Compose message</h1><p>Start a new outbound thread from ${escapeHtml(selectedInbox?.email_address ?? 'your Reverbin inbox')} without leaving the mail console.</p></div></div>
        ${renderSettingsNotice(data.notice)}
        <form class="settings-card" method="post" action="/mail/compose">
          <div class="settings-grid">
            <label>From inbox<select name="inbox_id" required>${inboxOptions}</select></label>
            <label>To<input type="text" name="to" placeholder="recipient@example.com" autocomplete="email" required /></label>
          </div>
          <label>Subject<input type="text" name="subject" placeholder="Subject" required /></label>
          <label>Message<textarea name="text" rows="12" placeholder="Write your message…" required></textarea></label>
          <p class="form-note">Sent through Reverbin, logged as a new thread, policy checked, and delivered through the active provider.</p>
          <div class="settings-actions"><button type="submit">Send message</button></div>
        </form>
      </section>
    </section>
  </main>
</body>
</html>`;
}

export function renderMailWebhooksPage(data: MailWebhooksPageData) {
  const webhookRows = data.webhooks.length
    ? data.webhooks.map((webhook) => `<div class="webhook-row"><strong>${escapeHtml(webhook.url)}</strong><span>${escapeHtml(webhook.status)} · ${escapeHtml(renderEventList(webhook.events_json))} · ${formatDate(webhook.created_at)}</span></div>`).join('')
    : `<div class="mail-empty">No webhooks yet. Add your agent endpoint below.</div>`;
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Reverbin Mail Webhooks</title>
  <meta name="description" content="Simple Reverbin webhook setup for tenant email events." />
  <style>${mailSettingsCss()}</style>
</head>
<body>
  <main class="mail-shell" data-surface-id="mail-webhooks">
    <header class="mail-topbar">
      <a class="brand" href="/mail">${reverbinMarkSvg()}<span>Reverbin Mail</span></a>
      <div class="mail-search"><input type="search" placeholder="Search mail" aria-label="Search mail" disabled /></div>
      <div class="top-actions"><a href="/mail/settings">Settings</a><a href="/docs">Docs</a><a href="/dashboard/logout">Logout</a></div>
    </header>
    <section class="settings-layout" aria-label="Simple webhook setup">
      ${renderMailSettingsSidebar(data.inboxes, 'webhooks')}
      <section class="settings-main">
        <div class="settings-hero"><div><p class="eyebrow">Webhooks</p><h1>Webhook endpoints</h1><p>Send email events to your agent endpoint. No operations dashboard required.</p></div></div>
        ${renderSettingsNotice(data.notice)}
        <section class="settings-card"><h2>Active endpoints</h2><div class="webhook-list">${webhookRows}</div></section>
        <form class="settings-card" method="post" action="/mail/webhooks">
          <h2>Add webhook</h2>
          <div class="settings-grid">
            <label>Endpoint URL<input type="url" name="url" placeholder="https://agent.example/hook" required /></label>
            <label>Signing secret<input type="text" name="secret" minlength="8" placeholder="Optional shared secret" /></label>
          </div>
          <p class="form-note">Choose which events this endpoint should receive.</p>
          <label class="check-row"><input type="checkbox" name="events" value="email.received" checked /> email.received</label>
          <label class="check-row"><input type="checkbox" name="events" value="email.sent" checked /> email.sent</label>
          <label class="check-row"><input type="checkbox" name="events" value="approval.required" /> approval.required</label>
          <label class="check-row"><input type="checkbox" name="events" value="approval.rejected" /> approval.rejected</label>
          <div class="settings-actions"><button type="submit">Add webhook</button></div>
        </form>
      </section>
    </section>
  </main>
</body>
</html>`;
}

export function renderSignupPage() {
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>Sign up for Reverbin - Email for AI agents</title>
  <meta name="description" content="Create a free Reverbin agent, provision a root-domain inbox, and receive a tenant-scoped API key instantly." />
  <link rel="canonical" href="https://reverbin.com/signup" />
  <style>
    :root { color-scheme: dark; --black: #0A0A0A; --charcoal: #121417; --ivory: #F4F4F2; --mint: #BDE6D3; --signal: #C6FF6E; --muted: rgba(244,244,242,.72); --line: rgba(244,244,242,.16); --danger: #ff8a8a; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; color: var(--ivory); font-family: 'Geist', Inter, ui-sans-serif, system-ui, sans-serif; background: radial-gradient(circle at 18% 10%, rgba(198,255,110,.12), transparent 30%), linear-gradient(180deg, #050606 0%, var(--black) 100%); }
    a { color: inherit; text-decoration: none; }
    .shell { width: min(1120px, calc(100% - 36px)); margin: 0 auto; padding: 26px 0 64px; }
    .topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: clamp(44px, 7vw, 96px); }
    .brand { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; font-weight: 800; font-size: 20px; }
    .brand svg { width: 38px; height: 38px; flex: 0 0 auto; }
    .nav { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
    .button, button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; border-radius: 8px; border: 1px solid var(--line); padding: 0 16px; background: rgba(244,244,242,.04); color: var(--ivory); font-weight: 750; cursor: pointer; }
    .button.primary, button[type="submit"] { background: var(--ivory); color: #050606; border-color: var(--ivory); }
    .button.secondary { color: var(--signal); border-color: rgba(198,255,110,.34); background: rgba(198,255,110,.07); }
    .layout { display: grid; grid-template-columns: minmax(0, .88fr) minmax(360px, 1.12fr); gap: clamp(28px, 6vw, 76px); align-items: start; }
    .eyebrow { color: var(--signal); font: 700 12px/1 'Geist Mono', ui-monospace, monospace; letter-spacing: .16em; text-transform: uppercase; }
    h1 { margin: 18px 0 0; font-size: clamp(48px, 7vw, 92px); line-height: .9; letter-spacing: -.055em; max-width: 720px; }
    .lede { margin: 26px 0 0; color: var(--muted); font-size: 18px; line-height: 1.65; max-width: 650px; }
    .proof { display: grid; gap: 12px; margin-top: 30px; }
    .proof div, .card { border: 1px solid var(--line); background: rgba(244,244,242,.045); border-radius: 14px; padding: 18px; box-shadow: 0 24px 80px rgba(0,0,0,.28); }
    .proof b { display: block; margin-bottom: 6px; }
    .proof span { color: var(--muted); line-height: 1.5; }
    .card h2 { margin: 0 0 8px; font-size: 28px; }
    .card p { color: var(--muted); line-height: 1.55; }
    form { display: grid; gap: 16px; margin-top: 22px; }
    label { display: grid; gap: 7px; color: rgba(244,244,242,.82); font-size: 14px; font-weight: 700; }
    input, textarea { width: 100%; border: 1px solid var(--line); border-radius: 10px; background: rgba(10,10,10,.72); color: var(--ivory); min-height: 46px; padding: 12px 13px; font: inherit; }
    textarea { min-height: 108px; resize: vertical; }
    .hint { color: rgba(244,244,242,.52); font-size: 13px; line-height: 1.45; }
    .status { min-height: 24px; color: var(--muted); font-size: 14px; }
    .status.error { color: var(--danger); }
    .result { margin-top: 20px; border-color: rgba(198,255,110,.38); background: rgba(198,255,110,.07); }
    .result[hidden] { display: none; }
    pre { overflow-x: auto; white-space: pre-wrap; word-break: break-word; border: 1px solid rgba(244,244,242,.14); border-radius: 10px; padding: 14px; background: rgba(0,0,0,.38); color: var(--ivory); font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; }
    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } h1 { font-size: clamp(42px, 14vw, 68px); } .topbar { align-items: flex-start; } }
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg()}<span>reverbin</span></a>
      <nav class="nav" aria-label="Signup navigation">
        <a class="button" href="/docs">Docs</a>
        <a class="button secondary" href="/dashboard/login">Dashboard</a>
      </nav>
    </header>
    <section class="layout" aria-labelledby="signup-heading">
      <div>
        <div class="eyebrow">Self-serve beta</div>
        <h1 id="signup-heading">Create your agent inbox.</h1>
        <p class="lede">Create a free Reverbin agent, receive a root-domain inbox like <code>agent@reverbin.com</code>, and copy a tenant-scoped API key immediately. Free agents include 2 inboxes; additional setup can happen later from the dashboard.</p>
        <div class="proof" aria-label="What signup provisions">
          <div><b>Instant inbox</b><span>Signup provisions your first <code>@reverbin.com</code> address without waiting for an operator.</span></div>
          <div><b>Scoped API key</b><span>The key only has access to the tenant created for this agent. Your API key is shown once.</span></div>
          <div><b>Setup later</b><span>Keep signup simple now. Add routing, billing, and operational settings after the inbox exists.</span></div>
        </div>
      </div>
      <div class="card">
        <h2>Free agent signup</h2>
        <p>Use a real email address so you can recover account context later. The preferred inbox name becomes <code>name@reverbin.com</code>.</p>
        <form id="agent-signup-form">
          <label>Email
            <input name="requester_email" type="email" autocomplete="email" placeholder="you@example.com" required />
          </label>
          <label>Agent name
            <input name="agent_name" type="text" autocomplete="organization-title" placeholder="Support Agent" required minlength="2" />
          </label>
          <label>Preferred inbox name
            <input name="preferred_inbox_name" type="text" inputmode="latin" autocomplete="off" placeholder="support-agent" required minlength="3" maxlength="48" pattern="[A-Za-z0-9._\\-]+" />
            <span class="hint">Letters, numbers, dots, underscores, and hyphens. Reverbin normalizes this to lowercase.</span>
          </label>
          <label>Agent use case
            <textarea name="agent_use_case" placeholder="What will this agent use email for?" required minlength="10"></textarea>
          </label>
          <button type="submit">Create free agent</button>
          <div id="signup-status" class="status" role="status" aria-live="polite"></div>
        </form>
        <section id="signup-result" class="result card" hidden aria-label="Signup result">
          <h2>Agent created</h2>
          <p>Your API key is shown once. Copy it now before leaving this page.</p>
          <pre id="signup-output"></pre>
          <div class="nav">
            <button type="button" id="copy-signup-output">Copy quickstart</button>
          </div>
        </section>
      </div>
    </section>
  </main>
  <script>
    const form = document.getElementById('agent-signup-form');
    const statusEl = document.getElementById('signup-status');
    const resultEl = document.getElementById('signup-result');
    const outputEl = document.getElementById('signup-output');
    const copyButton = document.getElementById('copy-signup-output');
    function setStatus(message, isError) {
      statusEl.textContent = message;
      statusEl.classList.toggle('error', Boolean(isError));
    }
    function quickstartText(result) {
      const token = String(result.api_key && result.api_key.token || '');
      const inbox = String(result.inbox && result.inbox.email_address || '');
      const tenant = String(result.tenant_id || '');
      return [
        'Inbox: ' + inbox,
        'Tenant: ' + tenant,
        'API key: ' + token,
        '',
        'export REVERBIN_API_KEY=' + token,
        'curl https://api.reverbin.com/v1/inboxes -H "Authorization: Bearer ' + token + '"',
      ].filter(Boolean).join('\\n');
    }
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus('Creating your agent...', false);
      resultEl.hidden = true;
      const data = new FormData(form);
      const payload = {
        requester_email: String(data.get('requester_email') || '').trim(),
        agent_name: String(data.get('agent_name') || '').trim(),
        preferred_inbox_name: String(data.get('preferred_inbox_name') || '').trim(),
        agent_use_case: String(data.get('agent_use_case') || '').trim(),
      };
      try {
        const response = await fetch('/v1/agent-signups', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || 'Signup failed. Please check the form and try again.');
        }
        outputEl.textContent = quickstartText(result);
        resultEl.hidden = false;
        setStatus('Agent created. Copy the one-time API key below.', false);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Signup failed. Please try again.', true);
      }
    });
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(outputEl.textContent || '');
      setStatus('Copied quickstart to clipboard.', false);
    });
  </script>
</body>
</html>`;
}

function renderSignupControls(row: DashboardSignupRequestView) {
  const checks = row.verification_json ?? [];
  const checkForms = checks.map((check) => `<form class="mini-form" method="post" action="/dashboard/signup-requests/${escapeHtml(row.id)}/checks">
    <input type="hidden" name="check_key" value="${escapeHtml(check.key)}" />
    <span>${escapeHtml(check.label)}${check.required ? ' *' : ''}: ${escapeHtml(check.status)}</span>
    <button type="submit" name="check_status" value="passed">Pass</button>
    <button type="submit" name="check_status" value="failed">Fail</button>
    <button type="submit" name="check_status" value="pending">Reset</button>
  </form>`).join('');
  const statusForm = `<form class="mini-form status-form" method="post" action="/dashboard/signup-requests/${escapeHtml(row.id)}/checks">
    <span>Decision</span>
    <button type="submit" name="status" value="approved">Approve</button>
    <button type="submit" name="status" value="rejected">Reject</button>
    <button type="submit" name="status" value="provisioned">Provisioned</button>
  </form>`;
  return `<div class="signup-controls">${checkForms || '<span>No checklist items recorded.</span>'}${statusForm}</div>`;
}

function renderDashboardRows(data: DashboardPageData) {
  const signupRequests = data.signupRequests ?? [];
  const signupRows = signupRequests.length
    ? signupRequests.map((row) => {
        const summary = row.verification_summary;
        const progress = summary ? `${summary.passed}/${summary.required} passed${summary.ready_to_provision ? ' · ready_to_provision' : ''}` : 'verification pending';
        return `<tr>
          <td><strong>${escapeHtml(row.requester_email)}</strong><span>${escapeHtml(row.preferred_inbox_name || 'no inbox requested')}</span></td>
          <td>${statusPill(row.status)}</td>
          <td><span class="mono">${escapeHtml(progress)}</span>${renderSignupControls(row)}</td>
          <td>${formatDate(row.created_at)}</td>
        </tr>`;
      }).join('')
    : emptyRow('No signup requests yet. Capture beta access requests through POST /v1/signup-requests.', 4);

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

  return { signupRows, inboxRows, messageRows, deliveryRows, auditRows };
}

export function renderDashboardPage(data: DashboardPageData) {
  const rows = renderDashboardRows(data);
  const signupRequests = data.signupRequests ?? [];
  const totals = {
    signupRequests: signupRequests.length,
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
      grid-template-columns: repeat(5, minmax(0, 1fr));
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
    .signup-controls {
      display: grid;
      gap: 6px;
      margin-top: 10px;
    }
    .mini-form {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .mini-form span {
      display: inline;
      margin: 0;
      min-width: 180px;
      color: var(--soft);
    }
    .mini-form button {
      min-height: 26px;
      border: 1px solid rgba(244,244,242,.18);
      border-radius: 6px;
      background: rgba(244,244,242,.045);
      color: var(--ivory);
      font: inherit;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }
    .mini-form button:hover,
    .mini-form button:focus-visible {
      border-color: var(--signal);
      color: var(--signal);
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
      <div class="metric"><span>Signup requests</span><b>${totals.signupRequests}</b></div>
      <div class="metric"><span>Inboxes</span><b>${totals.inboxes}</b></div>
      <div class="metric"><span>Messages</span><b>${totals.messages}</b></div>
      <div class="metric"><span>Deliveries</span><b>${totals.deliveries}</b></div>
      <div class="metric"><span>Audit rows</span><b>${totals.audits}</b></div>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-head"><h2>Signup requests</h2><span>Beta access queue</span></div>
        <div class="table-wrap"><table><thead><tr><th>Requester</th><th>Status</th><th>Verification</th><th>Created</th></tr></thead><tbody>${rows.signupRows}</tbody></table></div>
      </article>
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

export function renderDashboardLoginPage(error = '', notice = '', email = '') {
  const errorHtml = error ? `<p class="error">${escapeHtml(error)}</p>` : '';
  const noticeHtml = notice ? `<p class="notice">${escapeHtml(notice)}</p>` : '';
  const stickyEmail = email.trim();
  const escapedEmail = escapeHtml(stickyEmail);
  const cardHeading = stickyEmail ? 'Check your email' : 'Email me a sign-in code';
  const cardCopy = stickyEmail
    ? `We sent a six-digit code to <strong>${escapedEmail}</strong>. Enter only the numbers from that email to open your inbox dashboard.`
    : 'Use the email you signed up with. We will send a six-digit code that opens your inbox dashboard.';
  const emailCodeFormHtml = stickyEmail
    ? `<form method="post" action="/dashboard/login/verify">
          <input type="hidden" name="email" value="${escapedEmail}" />
          <label for="code">Sign-in code</label>
          <input id="code" type="text" name="code" autocomplete="one-time-code" inputmode="numeric" pattern="[0-9]{6}" placeholder="123456" autofocus required />
          <button type="submit">Open dashboard</button>
        </form>`
    : `<form method="post" action="/dashboard/login/request-code">
          <label for="email">Signup email</label>
          <input id="email" type="email" name="email" autocomplete="email" placeholder="you@example.com" autofocus required />
          <button type="submit">Send sign-in code</button>
        </form>`;
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
    .notice {
      color: var(--signal);
      margin: 14px 0 0;
    }
    .advanced-login {
      margin-top: 22px;
      padding-top: 18px;
      border-top: 1px solid rgba(244,244,242,.12);
    }
    .advanced-login summary {
      display: flex;
      align-items: center;
      min-height: 44px;
      cursor: pointer;
      color: var(--mint);
      font-weight: 800;
    }
    .form-note {
      margin-top: 8px;
      font-size: 13px;
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
        <h1>Sign in with your email.</h1>
        <p>Use the email you signed up with. Reverbin sends a short one-time code, so you do not need to save a password or hunt for your API key.</p>
        <ul class="mini-list">
          <li><span>Primary login</span><span>email code</span></li>
          <li><span>Surface</span><span>mail + settings</span></li>
          <li><span>Scope</span><span>your inboxes + activity</span></li>
        </ul>
      </div>
      <div class="card">
        <h2>${cardHeading}</h2>
        <p>${cardCopy}</p>
        ${errorHtml}
        ${noticeHtml}
        ${emailCodeFormHtml}
        <details class="advanced-login" open>
          <summary>Advanced: API key or operator token</summary>
          <p class="form-note">Have an API key from signup? Paste it here. Operator tokens still work for internal access.</p>
          <form method="post" action="/dashboard/login">
            <input type="text" name="username" value="reverbin-dashboard" autocomplete="username" hidden />
            <label for="token">API key or operator token</label>
            <input id="token" type="password" name="token" autocomplete="current-password" placeholder="rvb_live_..." required />
            <button type="submit">Open with token</button>
          </form>
        </details>
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
  const lines = markdown.split(String.fromCharCode(13) + String.fromCharCode(10)).join(String.fromCharCode(10)).split(String.fromCharCode(10));
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
  const parseTableRow = (row: string) => row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
  const isTableSeparator = (row: string) => parseTableRow(row).every((cell) => /^:?-{3,}:?$/.test(cell));
  const renderTable = (rows: string[]) => {
    const [headerRow, separatorRow, ...bodyRows] = rows;
    const headers = parseTableRow(headerRow);
    const body = isTableSeparator(separatorRow) ? bodyRows : rows.slice(1);
    const thead = headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('');
    const tbody = body
      .filter((row) => row.trim().startsWith('|'))
      .map((row) => `<tr>${parseTableRow(row).map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`)
      .join('');
    html.push(`<div class="docs-table-wrap"><table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`);
  };

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
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
    if (line.trim().startsWith('|')) {
      closeParagraph();
      closeList();
      const rows = [line.trim()];
      while (index + 1 < lines.length && lines[index + 1].trim().startsWith('|')) {
        index += 1;
        rows.push(lines[index].trim());
      }
      renderTable(rows);
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
    .docs-shell { position:relative; width:100%; padding:24px clamp(24px,4.4vw,82px) 72px; overflow-x:hidden; }
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
    .docs-layout { display:grid; grid-template-columns:minmax(220px,300px) minmax(0,1fr); gap:clamp(24px,4vw,64px); padding:34px 0 0; align-items:start; min-width:0; max-width:100%; }
    .docs-layout > div, .docs-article, .docs-nav { min-width:0; max-width:100%; }
    .docs-article { max-width:980px; }
    .docs-article h2 { margin:34px 0 12px; font-size:34px; line-height:1.1; }
    .docs-article h3 { margin:28px 0 10px; font-size:24px; }
    .docs-article h4 { margin:24px 0 8px; font-size:18px; color:var(--mint); }
    .docs-article p, .docs-article li { color:var(--muted); line-height:1.72; font-size:16px; }
    .docs-article a { color:var(--signal); }
    .docs-article ul { padding-left:22px; }
    .docs-table-wrap { width:100%; overflow-x:auto; margin:18px 0; border:1px solid var(--line); border-radius:var(--radius); }
    .docs-article table { width:100%; border-collapse:collapse; min-width:620px; }
    .docs-article th,
    .docs-article td { border-bottom:1px solid var(--line); border-right:1px solid var(--line); padding:10px; text-align:left; vertical-align:top; }
    .docs-article th:last-child,
    .docs-article td:last-child { border-right:0; }
    .docs-article tr:last-child td { border-bottom:0; }
    .docs-article th { color:var(--ivory); background:rgba(185,255,45,.055); }
    .docs-article pre { max-width:100%; overflow-x:auto; white-space:pre-wrap; overflow-wrap:anywhere; padding:18px; border:1px solid var(--line); border-radius:var(--radius); background:#050606; color:var(--ivory); line-height:1.55; }
    .docs-article code { color:var(--ivory); background:rgba(244,244,242,.08); border:1px solid rgba(244,244,242,.08); border-radius:5px; padding:.1em .34em; overflow-wrap:anywhere; word-break:break-word; }
    .docs-article pre code { padding:0; border:0; background:transparent; color:inherit; white-space:pre-wrap; overflow-wrap:anywhere; word-break:break-word; }
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
        <a class="button primary" href="${SIGNUP_HREF}">Sign up</a>
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
        <a class="button primary" href="${SIGNUP_HREF}">Sign up</a>
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

type LegalPageKey = 'support' | 'privacy' | 'terms';

const legalPageCopy: Record<LegalPageKey, { title: string; description: string; body: string }> = {
  support: {
    title: 'Customer support',
    description: 'How to reach Reverbin about billing, account access, mail delivery, or agent inbox questions.',
    body: `<article class="docs-article">
      <h2>Contact Reverbin support</h2>
      <p>For billing questions, charge questions, account access, mail delivery, webhook delivery, or agent inbox issues, email <a href="mailto:support@reverbin.com">support@reverbin.com</a>.</p>
      <p>Include the email address on your Reverbin account, the affected inbox address, and any Stripe receipt or invoice ID if the question is about a charge.</p>
      <h2>Billing support</h2>
      <p>Reverbin subscriptions are processed through hosted Stripe Checkout and Stripe Customer Portal. Reverbin does not collect or store payment details.</p>
    </article>`,
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'The information Reverbin collects, how it is used, who it is disclosed to, and the security practices that protect it.',
    body: `<article class="docs-article">
      <h2>Information Reverbin collects</h2>
      <p>Reverbin collects account contact information, issued inbox addresses, API key metadata, webhook endpoint metadata, billing identifiers from Stripe, and the message/thread data needed to provide agent email infrastructure.</p>
      <h2>How Reverbin uses information</h2>
      <p>We use this information to authenticate dashboard/API access, route inbound and outbound email, deliver signed webhook events, enforce send policies and quotas, operate billing, prevent abuse, debug reliability issues, and provide customer support.</p>
      <h2>Disclosure</h2>
      <p>We disclose information to service providers that operate the product, including email delivery, hosting, storage, observability, and payment providers such as Stripe. We may disclose information when required for legal, security, fraud-prevention, or compliance reasons.</p>
      <h2>Security practices</h2>
      <p>Reverbin uses tenant-scoped API keys, signed webhooks, hashed secrets, authenticated dashboard access, audit logs, HTTPS, database access controls, and least-privilege operational practices to safeguard information.</p>
      <h2>Contact</h2>
      <p>Privacy questions can be sent to <a href="mailto:support@reverbin.com">support@reverbin.com</a>.</p>
    </article>`,
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms for using Reverbin inboxes, APIs, webhooks, subscriptions, and hosted Stripe Checkout billing.',
    body: `<article class="docs-article">
      <h2>Using Reverbin</h2>
      <p>Reverbin provides email inboxes, APIs, webhooks, thread storage, and dashboard tools for AI agents and builders. You are responsible for the agents, automations, recipients, webhooks, and content you connect to Reverbin.</p>
      <h2>Subscriptions and billing</h2>
      <p>Paid Reverbin subscriptions are purchased through hosted Stripe Checkout. Stripe processes payment details, invoices, receipts, payment-method updates, cancellations, and related billing operations through Stripe-hosted flows.</p>
      <h2>Acceptable use</h2>
      <p>Do not use Reverbin for spam, phishing, credential theft, harassment, malware, evading platform limits, or unlawful activity. Reverbin may limit, suspend, or terminate access to protect users, recipients, providers, and infrastructure.</p>
      <h2>Reliability</h2>
      <p>Reverbin is operated as production infrastructure, but email delivery, third-party APIs, webhooks, and payment providers can be delayed or unavailable. Build agent runtimes with retries, idempotency, and safe failure behavior.</p>
      <h2>Support</h2>
      <p>Questions about these terms can be sent to <a href="mailto:support@reverbin.com">support@reverbin.com</a>.</p>
    </article>`,
  },
};

export function renderLegalPage(page: LegalPageKey) {
  const meta = legalPageCopy[page];
  return `<!doctype html>
<html lang="en">
<head>
  ${baseHead}
  <title>${escapeHtml(meta.title)} - Reverbin</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <link rel="canonical" href="https://reverbin.com/${page}" />
  <meta property="og:title" content="${escapeHtml(meta.title)} - Reverbin" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  ${docsCss()}
</head>
<body>
  <main class="docs-shell">
    <header class="docs-header">
      <a class="brand" href="/" aria-label="Reverbin home">${reverbinMarkSvg()}<span>reverbin</span></a>
      <nav class="top-actions" aria-label="Public page actions">
        <a class="button" href="/">Product</a>
        <a class="button" href="/docs">Docs</a>
        <a class="button primary" href="${SIGNUP_HREF}">Sign up</a>
      </nav>
    </header>
    <section class="docs-hero" aria-label="${escapeHtml(meta.title)}">
      <div>
        <span class="section-label">Public details</span>
        <h1>${escapeHtml(meta.title)}</h1>
        <p class="lede">${escapeHtml(meta.description)}</p>
      </div>
      <nav class="docs-nav" aria-label="Public details navigation">
        <a href="/support"${page === 'support' ? ' aria-current="page"' : ''}><span>Support</span><b>Customer support</b></a>
        <a href="/privacy"${page === 'privacy' ? ' aria-current="page"' : ''}><span>Privacy</span><b>Privacy Policy</b></a>
        <a href="/terms"${page === 'terms' ? ' aria-current="page"' : ''}><span>Terms</span><b>Terms of Service</b></a>
      </nav>
    </section>
    <section class="docs-layout">
      <nav class="docs-nav" aria-label="Public details navigation secondary">
        <a href="/support"${page === 'support' ? ' aria-current="page"' : ''}><span>Support</span><b>Customer support</b></a>
        <a href="/privacy"${page === 'privacy' ? ' aria-current="page"' : ''}><span>Privacy</span><b>Privacy Policy</b></a>
        <a href="/terms"${page === 'terms' ? ' aria-current="page"' : ''}><span>Terms</span><b>Terms of Service</b></a>
      </nav>
      <div>${meta.body}</div>
    </section>
  </main>
</body>
</html>`;
}

export function renderDocsRedirectPage() {
  return renderDocsPage('api');
}
