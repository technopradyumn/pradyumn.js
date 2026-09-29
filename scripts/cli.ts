#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextAppFiles: Record<string, string> = {
  "src/app/layout.tsx": `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pradyumn | Build with clarity",
  description: "A thoughtful starter app built with Next.js, TypeScript, and Pradyumn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  "src/app/page.tsx": `"use client";

import { useState } from "react";
import { all, not, Rule } from "pradyumn";

type Role = "viewer" | "editor" | "admin";

const roleDescriptions: Record<Role, string> = {
  viewer: "Can explore the workspace",
  editor: "Can update shared content",
  admin: "Has full workspace access",
};

export default function Home() {
  const [role, setRole] = useState<Role>("admin");
  const [suspended, setSuspended] = useState(false);
  const canManage = all(() => role === "admin", not(() => suspended));

  return (
    <main className="page-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#" aria-label="Pradyumn home">
          <span className="brand-mark">p</span>
          <span>pradyumn</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#playground">Playground</a>
        </div>
        <a className="github-link" href="https://github.com/technopradyumn/pradyumn.js">
          <span className="github-star" aria-hidden="true">✳</span>
          <span>View on GitHub</span>
          <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT APP STARTS HERE</div>
          <h1>Build interfaces<br />with <span>more clarity.</span></h1>
          <p className="hero-description">
            Less wiring. More making. Create thoughtful React experiences with
            one delightful, type-safe toolkit.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#playground">Explore the playground <span aria-hidden="true">→</span></a>
            <a className="button button-secondary" href="https://www.npmjs.com/package/pradyumn">npm package <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true"><span>P</span><span>R</span><span>+</span></div>
            <span>Made for the details that make a difference</span>
          </div>
        </div>

        <div className="preview-wrap" aria-label="Live access rules preview">
          <div className="preview-glow" />
          <div className="preview-card">
            <div className="preview-topline">
              <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
              <span className="preview-label">LIVE PREVIEW</span>
              <span className="preview-menu" aria-hidden="true">···</span>
            </div>
            <div className="workspace-heading">
              <div className="workspace-icon">✦</div>
              <div><strong>Design workspace</strong><span>Team permissions</span></div>
              <span className="online-pill"><i /> Online</span>
            </div>
            <div className="preview-divider" />
            <div className="preview-section-title"><span>ACCESS CONTROL</span><span>01 / 03</span></div>
            <div className="permission-row">
              <div className="permission-icon">⌘</div>
              <div className="permission-copy"><strong>Workspace role</strong><span>Choose a role to preview access</span></div>
              <span className="role-chip">{role}</span>
            </div>
            <div className="permission-row">
              <div className="permission-icon status-icon">◎</div>
              <div className="permission-copy"><strong>Account status</strong><span>{suspended ? "Access is paused" : "Account is in good standing"}</span></div>
              <span className={\`status-chip \${suspended ? "status-paused" : ""}\`}><i />{suspended ? "Paused" : "Active"}</span>
            </div>
            <div className="access-result">
              <Rule
                when={canManage}
                fallback={<><span className="result-icon result-locked">⌑</span><span><strong>Limited access</strong><small>An active admin role is needed to manage this workspace.</small></span><span className="result-arrow">↗</span></>}
              >
                <><span className="result-icon">✓</span><span><strong>You’re all set</strong><small>Admin access is ready. You can manage this workspace.</small></span><span className="result-arrow">↗</span></>
              </Rule>
            </div>
            <div className="preview-footnote"><span className="sparkle">✦</span> Powered by composable, type-safe rules</div>
          </div>
          <div className="floating-note"><span className="note-check">✓</span><span><strong>Rule evaluated</strong><small>In less than a blink</small></span></div>
        </div>
      </section>

      <section className="metrics" aria-label="Toolkit highlights">
        <div><strong>50<span>+</span></strong><span>thoughtful building blocks</span></div>
        <div><strong>100<span>%</span></strong><span>strict TypeScript</span></div>
        <div><strong>0</strong><span>extra runtime dependencies</span></div>
        <div className="metrics-note"><span className="metrics-icon">✳</span><span>One toolkit.<br /><strong>A lot less glue.</strong></span></div>
      </section>

      <section className="playground" id="playground">
        <div className="section-heading">
          <div><span className="section-kicker">TRY IT YOURSELF</span><h2>See the rules in action.</h2></div>
          <p>Change a setting. Watch the interface respond.<br />That’s declarative UI doing its thing.</p>
        </div>
        <div className="playground-card">
          <div className="playground-intro">
            <span className="playground-icon">⌘</span>
            <div><strong>Workspace permissions</strong><span>A tiny taste of what you can build.</span></div>
          </div>
          <div className="playground-controls">
            <label className="control-label" htmlFor="role">YOUR ROLE</label>
            <select id="role" value={role} onChange={(event) => {
              const selectedRole = event.currentTarget.value;
              if (selectedRole === "viewer" || selectedRole === "editor" || selectedRole === "admin") {
                setRole(selectedRole);
              }
            }}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <span className="role-description">{roleDescriptions[role]}</span>
          </div>
          <div className="playground-toggle">
            <div><strong>Account status</strong><span>Pause access without changing the role.</span></div>
            <button
              className={\`toggle \${suspended ? "toggle-on" : ""}\`}
              type="button"
              role="switch"
              aria-checked={suspended}
              aria-label="Suspend account"
              onClick={() => setSuspended((current) => !current)}
            ><span /></button>
          </div>
          <div className={\`playground-outcome \${role === "admin" && !suspended ? "outcome-granted" : "outcome-limited"}\`}>
            <span className="outcome-icon">{role === "admin" && !suspended ? "✓" : "⌑"}</span>
            <div><strong>{role === "admin" && !suspended ? "You have full access" : "This action is restricted"}</strong><span>{role === "admin" && !suspended ? "Your role and account status meet the access rules." : "Switch to an active admin role to manage this workspace."}</span></div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-heading">
          <div><span className="section-kicker">A LITTLE MORE FLOW</span><h2>The good stuff, built in.</h2></div>
          <p>All the small pieces that help your next idea<br />feel like a real product.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-icon feature-violet">⌘</span><h3>Clearer control flow</h3><p>Render with intention using expressive rules, conditions, and pattern matching.</p><span className="feature-link">Explore rules <b>→</b></span></article>
          <article className="feature-card"><span className="feature-icon feature-coral">↗</span><h3>State that stays simple</h3><p>Reactive signals and tiny hooks that keep your UI in sync without the ceremony.</p><span className="feature-link">Explore signals <b>→</b></span></article>
          <article className="feature-card"><span className="feature-icon feature-green">✳</span><h3>Polished, by default</h3><p>Accessible forms, useful feedback, and flexible UI primitives, ready to compose.</p><span className="feature-link">Explore components <b>→</b></span></article>
        </div>
      </section>

      <footer className="footer"><a className="brand" href="#"><span className="brand-mark">p</span><span>pradyumn</span></a><span>Made with care for people who make things.</span><a href="https://github.com/technopradyumn/pradyumn.js">Open source, always <span aria-hidden="true">↗</span></a></footer>
    </main>
  );
}
`,
  "src/app/globals.css": `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  color-scheme: light;
  --ink: #20243a;
  --muted: #7e8296;
  --purple: #6856e8;
  --line: #eeedf4;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #fff; color: var(--ink); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
button, select { font: inherit; }
.page-shell { width: min(1120px, calc(100% - 64px)); margin: 0 auto; }
.topbar { height: 86px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f2f1f6; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: #282b41; font-family: Manrope, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -1px; }
.brand-mark { display: grid; width: 31px; height: 31px; place-items: center; border-radius: 10px; background: linear-gradient(145deg, #7c6af2, #5746d5); color: white; font: 800 19px Manrope, sans-serif; box-shadow: 0 4px 12px #6856e844; }
.nav-links { display: flex; gap: 37px; margin-left: 40px; color: #777b8f; font-size: 13px; font-weight: 600; }
.nav-links a:hover, .footer>a:last-child:hover { color: var(--purple); }
.github-link { display: flex; align-items: center; gap: 9px; border: 1px solid #ecebf2; border-radius: 9px; padding: 10px 13px; font-size: 12px; font-weight: 700; transition: .2s; }
.github-link:hover { border-color: #d8d2ff; background: #faf9ff; }
.github-star { color: #f5a94a; font-size: 15px; }
.hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 36px; min-height: 545px; padding: 57px 0 60px; }
.hero-copy { padding: 4px 0 0 4px; }
.eyebrow, .section-kicker { color: #85839a; font-size: 10px; font-weight: 700; letter-spacing: 1.6px; }
.eyebrow { display: flex; align-items: center; gap: 9px; }
.eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #8b7af7; box-shadow: 0 0 0 4px #8b7af71c; }
h1, h2, h3, p { margin-top: 0; }
h1 { margin: 25px 0 17px; color: #252941; font: 800 clamp(43px, 5vw, 62px)/1.09 Manrope, sans-serif; letter-spacing: -3.5px; }
h1 span { color: #7060e8; }
.hero-description { max-width: 425px; margin-bottom: 25px; color: #777c90; font-size: 15px; line-height: 1.8; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 11px; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 12px; border-radius: 9px; padding: 13px 16px; font-size: 12px; font-weight: 700; transition: transform .2s, box-shadow .2s; }
.button:hover { transform: translateY(-2px); }
.button-primary { background: #6856e8; color: #fff; box-shadow: 0 7px 16px #6856e832; }
.button-primary:hover { box-shadow: 0 10px 22px #6856e84a; }
.button-secondary { border: 1px solid #eeedf4; color: #52566c; }
.hero-proof { display: flex; align-items: center; gap: 11px; margin-top: 31px; color: #999bad; font-size: 10px; }
.avatar-stack { display: flex; padding-left: 3px; }
.avatar-stack span { display: grid; width: 23px; height: 23px; place-items: center; margin-left: -4px; border: 2px solid #fff; border-radius: 50%; background: #e9e4ff; color: #6a58db; font-size: 8px; font-weight: 700; }
.avatar-stack span:nth-child(2) { background: #ffeadf; color: #d7825e; }.avatar-stack span:nth-child(3) { background: #e5f5ed; color: #579271; }
.preview-wrap { position: relative; display: grid; min-height: 420px; place-items: center; }
.preview-glow { position: absolute; width: 83%; height: 75%; border-radius: 50%; background: #9182ff; filter: blur(90px); opacity: .16; }
.preview-card { position: relative; width: min(100%, 438px); padding: 19px 21px 15px; border: 1px solid #e9e8f1; border-radius: 16px; background: #fff; box-shadow: 0 24px 75px #48407817, 0 3px 12px #26234209; }
.preview-topline { display: flex; align-items: center; justify-content: space-between; padding-bottom: 17px; }
.window-dots { display: flex; gap: 4px; }.window-dots i { width: 6px; height: 6px; border-radius: 50%; background: #e8e7ee; }.window-dots i:first-child { background: #f5b3ac; }.window-dots i:nth-child(2) { background: #f5d18a; }.window-dots i:nth-child(3) { background: #9bd5b1; }
.preview-label { color: #a5a4b2; font-size: 8px; font-weight: 700; letter-spacing: 1.2px; }.preview-menu { color: #b3b1c0; font-size: 19px; line-height: 10px; }
.workspace-heading { display: flex; align-items: center; gap: 11px; }.workspace-icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 10px; background: #f0edff; color: #715fea; font-size: 17px; }
.workspace-heading strong, .permission-copy strong { display: block; color: #35384d; font-size: 11px; font-weight: 700; }.workspace-heading span:not(.online-pill), .permission-copy span { display: block; margin-top: 4px; color: #a2a3b2; font-size: 9px; }
.online-pill { display: inline-flex; align-items: center; gap: 5px; margin-left: auto; border: 1px solid #e8f2ec; border-radius: 20px; padding: 5px 8px; color: #559673; font-size: 8px; font-weight: 600; }.online-pill i, .status-chip i { width: 5px; height: 5px; border-radius: 50%; background: #64bd88; }
.preview-divider { height: 1px; margin: 17px 0 16px; background: #f1f0f5; }
.preview-section-title { display: flex; justify-content: space-between; margin-bottom: 9px; color: #a7a6b4; font-size: 8px; font-weight: 700; letter-spacing: 1px; }
.permission-row { display: flex; align-items: center; gap: 9px; padding: 10px 0; }
.permission-icon { display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid #efedf6; border-radius: 8px; color: #8375dc; font-size: 12px; }.status-icon { color: #78a98b; }
.role-chip, .status-chip { margin-left: auto; border-radius: 6px; padding: 5px 8px; background: #f2efff; color: #7161d7; font-size: 8px; font-weight: 700; text-transform: capitalize; }
.status-chip { display: inline-flex; align-items: center; gap: 5px; background: #edf8f1; color: #589571; text-transform: none; }.status-chip.status-paused { background: #fff1ef; color: #cc7167; }.status-paused i { background: #dc8075; }
.access-result { display: flex; align-items: center; gap: 10px; margin-top: 11px; border: 1px solid #e5f2e9; border-radius: 10px; padding: 11px; background: linear-gradient(105deg, #f6fcf7, #f9fdf9); }
.result-icon { display: grid; width: 24px; height: 24px; flex: 0 0 24px; place-items: center; border-radius: 50%; background: #e2f4e8; color: #56a477; font-size: 12px; font-weight: 700; }.result-locked { background: #fff0ed; color: #cd796c; }
.access-result strong, .floating-note strong { display: block; color: #426550; font-size: 9px; }.access-result small, .floating-note small { display: block; max-width: 265px; margin-top: 3px; color: #8ba293; font-size: 8px; line-height: 1.4; }.access-result:has(.result-locked) { border-color: #f5e9e6; background: #fffaf9; }.access-result:has(.result-locked) strong { color: #986c66; }.access-result:has(.result-locked) small { color: #aa928e; }
.result-arrow { margin-left: auto; color: #a8c8b0; font-size: 13px; }
.preview-footnote { margin-top: 13px; color: #aeafbd; text-align: center; font-size: 8px; }.sparkle { margin-right: 4px; color: #8b7af0; }
.floating-note { position: absolute; right: -13px; bottom: 18px; display: flex; align-items: center; gap: 9px; border: 1px solid #eeedf3; border-radius: 10px; padding: 10px 13px; background: #fff; box-shadow: 0 9px 28px #38345214; }.note-check { display: grid; width: 24px; height: 24px; place-items: center; border-radius: 7px; background: #f0edff; color: #725fe7; font-size: 11px; }.floating-note strong { color: #46495d; }.floating-note small { color: #a4a5b2; }
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; gap: 16px; margin: 5px 0 84px; border: 1px solid #eeedf4; border-radius: 13px; padding: 19px 24px; background: linear-gradient(100deg, #fff, #fcfbff); }
.metrics>div { display: flex; flex-direction: column; gap: 4px; }.metrics>div>strong { color: #3a3d52; font: 800 23px Manrope, sans-serif; letter-spacing: -1px; }.metrics>div>strong span { color: #7767e9; }.metrics>div>span { color: #9698a8; font-size: 9px; }.metrics .metrics-note { flex-direction: row; align-items: center; gap: 10px; border-left: 1px solid #eeedf4; padding-left: 23px; color: #77798d; font-size: 9px; line-height: 1.6; }.metrics-note strong { color: #575a6f; }.metrics-icon { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 9px; background: #f1efff; color: #7767e9; font-size: 17px; }
.playground, .features { padding-bottom: 83px; }.section-heading { display: flex; align-items: end; justify-content: space-between; margin-bottom: 24px; }.section-kicker { color: #8d7fe3; font-size: 9px; }.section-heading h2 { margin: 9px 0 0; color: #2c3045; font: 800 27px Manrope, sans-serif; letter-spacing: -1.2px; }.section-heading>p { margin: 0 0 2px; color: #9597a7; font-size: 10px; line-height: 1.7; }
.playground-card { display: grid; grid-template-columns: 1.15fr 1fr 1fr; align-items: center; gap: 22px; border: 1px solid #eeedf4; border-radius: 13px; padding: 20px; box-shadow: 0 8px 26px #3b355208; }
.playground-intro { display: flex; align-items: center; gap: 11px; }.playground-icon { display: grid; width: 37px; height: 37px; place-items: center; border-radius: 10px; background: #f0edff; color: #7766e5; font-size: 16px; }.playground-intro strong, .playground-toggle strong { display: block; color: #474a5e; font-size: 10px; }.playground-intro span:not(.playground-icon), .playground-toggle div>span { display: block; margin-top: 5px; color: #9a9cab; font-size: 9px; }
.playground-controls { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }.control-label { color: #999aaa; font-size: 8px; font-weight: 700; letter-spacing: 1px; }.playground-controls select { min-width: 135px; border: 1px solid #ecebf2; border-radius: 7px; padding: 7px 25px 7px 9px; background: #fff; color: #585b70; font-size: 10px; outline-color: #a99df5; }.role-description { color: #9a9cab; font-size: 8px; }
.playground-toggle { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-left: 1px solid #f0eff4; padding-left: 21px; }.toggle { display: flex; width: 33px; height: 19px; align-items: center; border: 0; border-radius: 20px; padding: 2px; background: #dedde6; cursor: pointer; transition: background .2s; }.toggle span { width: 15px; height: 15px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px #0002; transition: transform .2s; }.toggle-on { background: #7666e8; }.toggle-on span { transform: translateX(14px); }
.playground-outcome { grid-column: 1 / -1; display: flex; align-items: center; gap: 10px; border: 1px solid #f4e9e6; border-radius: 9px; padding: 11px 13px; background: #fffaf9; }.outcome-icon { display: grid; width: 24px; height: 24px; flex: 0 0 24px; place-items: center; border-radius: 50%; background: #fff0ed; color: #cb786c; font-size: 12px; }.outcome-granted { border-color: #e5f2e9; background: #f7fcf8; }.outcome-granted .outcome-icon { background: #e5f4e9; color: #57a477; }.playground-outcome strong { display: block; color: #956d67; font-size: 9px; }.outcome-granted strong { color: #4e805f; }.playground-outcome div>span { display: block; margin-top: 3px; color: #a79491; font-size: 8px; }.outcome-granted div>span { color: #8da495; }
.features { padding-bottom: 69px; }.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }.feature-card { border: 1px solid #eeedf4; border-radius: 12px; padding: 19px; transition: transform .2s, box-shadow .2s; }.feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px #3834520e; }.feature-icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 10px; font-size: 15px; }.feature-violet { background: #f0edff; color: #7564e6; }.feature-coral { background: #fff0e9; color: #df916d; }.feature-green { background: #eaf7ef; color: #63a67b; }.feature-card h3 { margin: 14px 0 7px; color: #42455a; font: 700 13px Manrope, sans-serif; }.feature-card p { min-height: 38px; margin-bottom: 13px; color: #9294a4; font-size: 9px; line-height: 1.7; }.feature-link { color: #7666dd; font-size: 9px; font-weight: 700; }.feature-link b { margin-left: 5px; }
.footer { display: flex; min-height: 72px; align-items: center; justify-content: space-between; border-top: 1px solid #f0eff4; color: #a0a1af; font-size: 9px; }.footer .brand { font-size: 15px; }.footer .brand-mark { width: 26px; height: 26px; border-radius: 8px; font-size: 15px; }.footer>a:last-child { color: #77798d; font-weight: 600; }

@media (max-width: 760px) {
  .page-shell { width: min(100% - 36px, 560px); }.topbar { height: 70px; }.nav-links { gap: 17px; margin-left: 0; font-size: 11px; }.github-link { padding: 8px; }.github-link span:nth-child(2) { display: none; }
  .hero { grid-template-columns: 1fr; gap: 8px; padding: 56px 0 48px; }.hero-copy { padding: 0; }.hero-description { max-width: 480px; }.preview-wrap { min-height: 390px; }.floating-note { right: -4px; bottom: 10px; }
  .metrics { grid-template-columns: repeat(2, 1fr); gap: 19px; margin-bottom: 66px; padding: 20px; }.metrics .metrics-note { border-left: 0; padding-left: 0; }
  .playground-card { grid-template-columns: 1fr 1fr; }.playground-intro { grid-column: 1 / -1; }.playground-toggle { padding-left: 15px; }.section-heading { align-items: flex-start; gap: 12px; }.section-heading>p { max-width: 190px; }
}
@media (max-width: 520px) {
  .page-shell { width: calc(100% - 32px); }.nav-links { display: none; }.topbar { height: 65px; }h1 { font-size: 45px; letter-spacing: -2.6px; }.hero { padding-top: 46px; }.preview-card { padding: 16px; }.preview-wrap { min-height: 370px; }.floating-note { right: -5px; }.metrics { margin-bottom: 58px; }.section-heading { display: block; }.section-heading>p { margin-top: 9px; }.section-heading h2 { font-size: 24px; }
  .playground-card { grid-template-columns: 1fr; gap: 18px; }.playground-intro { grid-column: auto; }.playground-toggle { border-left: 0; border-top: 1px solid #f0eff4; padding: 15px 0 0; }.playground-outcome { grid-column: auto; }.feature-grid { grid-template-columns: 1fr; }.feature-card p { min-height: 0; }.features, .playground { padding-bottom: 58px; }.footer { flex-wrap: wrap; gap: 12px; padding: 17px 0; }.footer>span { order: 3; width: 100%; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
`,
  "src/app/icon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8674f2"/><stop offset="1" stop-color="#5746d5"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#p)"/><path d="M22 47V17h12a10 10 0 0 1 0 20h-3" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
`,
};

type CrossPlatformTarget = "web" | "android" | "ios" | "desktop" | "all";

const socialAppFiles: Record<string, string> = {
  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f5f4f1" />
    <title>Commonplace — your little corner</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  "src/main.tsx": `import React from "react";
import ReactDOM from "react-dom/client";
import SocialApp from "./SocialApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SocialApp />
  </React.StrictMode>,
);
`,
  "src/platform.ts": `export type RuntimePlatform = "web" | "android" | "ios" | "desktop";

export async function getRuntimePlatform(): Promise<RuntimePlatform> {
  if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) {
    return "web";
  }

  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<RuntimePlatform>("platform_name");
}
`,
  "src/SocialApp.tsx": `import { useEffect, useState } from "react";
import { Avatar, For, persistentSignal, useSignal } from "pradyumn";
import { getRuntimePlatform, type RuntimePlatform } from "./platform";

interface Post {
  id: string;
  author: string;
  handle: string;
  time: string;
  body: string;
  likes: number;
  liked: boolean;
}

const starterPosts: Post[] = [
  {
    id: "welcome",
    author: "Maya Chen",
    handle: "@mayamakes",
    time: "Just now",
    body: "A little corner of the internet, just for us. Say hello and share something you made today ✨",
    likes: 12,
    liked: false,
  },
  {
    id: "garden",
    author: "Oliver Grant",
    handle: "@olivergrows",
    time: "2 hours ago",
    body: "First tomatoes from the balcony garden. They taste like summer.",
    likes: 8,
    liked: false,
  },
  {
    id: "sketch",
    author: "Ari Rivera",
    handle: "@aridraws",
    time: "Yesterday",
    body: "Ten minutes of sketching before the day gets loud. That was enough.",
    likes: 21,
    liked: true,
  },
];

const postsSignal = persistentSignal<Post[]>("pradyumn.social.posts.v1", starterPosts);

export default function SocialApp() {
  const posts = useSignal(postsSignal);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | "liked">("all");
  const [platform, setPlatform] = useState<RuntimePlatform>("web");
  const [platformError, setPlatformError] = useState("");

  useEffect(() => {
    getRuntimePlatform()
      .then(setPlatform)
      .catch((error: unknown) => {
        setPlatformError(error instanceof Error ? error.message : String(error));
      });
  }, []);

  const visiblePosts = filter === "liked" ? posts.filter((post) => post.liked) : posts;

  function publishPost() {
    const body = draft.trim();
    if (!body) return;

    postsSignal.update((current) => [
      {
        id: \`\${Date.now()}-\${Math.random().toString(36).slice(2)}\`,
        author: "You",
        handle: "@you",
        time: "Just now",
        body,
        likes: 0,
        liked: false,
      },
      ...current,
    ]);
    setDraft("");
    setFilter("all");
  }

  function toggleLike(id: string) {
    postsSignal.update((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
          : post,
      ),
    );
  }

  function removePost(id: string) {
    postsSignal.update((current) => current.filter((post) => post.id !== id));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="wordmark" href="#" aria-label="Commonplace home">
          <span className="brand-mark">c</span>
          <span>commonplace</span>
        </a>
        <p className="sidebar-caption">A little more human.</p>
        <nav className="side-nav" aria-label="Feed filters">
          <button className={filter === "all" ? "nav-item active" : "nav-item"} onClick={() => setFilter("all")}>
            <span>⌂</span> Home
          </button>
          <button className={filter === "liked" ? "nav-item active" : "nav-item"} onClick={() => setFilter("liked")}>
            <span>♡</span> Your likes
          </button>
        </nav>
        <div className="sidebar-note">
          <span className="note-spark">✳</span>
          <strong>Your space, your pace.</strong>
          <p>Posts stay on this device. No account, no algorithm, just you.</p>
        </div>
        <div className="profile-mini">
          <Avatar name="You" size="sm" />
          <div><strong>You</strong><span>@you</span></div>
          <span className="profile-menu">···</span>
        </div>
      </aside>

      <section className="feed-column" aria-label="Social feed">
        <header className="feed-header">
          <div>
            <span className="eyebrow">YOUR COMMUNITY</span>
            <h1>{filter === "liked" ? "Your likes" : "The good stuff"}</h1>
          </div>
          <span className="platform-pill"><i /> {platform}</span>
        </header>

        {platformError && <p className="platform-error" role="status">Platform detection failed: {platformError}</p>}

        <form className="composer" onSubmit={(event) => { event.preventDefault(); publishPost(); }}>
          <Avatar name="You" size="md" />
          <div className="composer-content">
            <label htmlFor="new-post">What’s on your mind?</label>
            <textarea
              id="new-post"
              value={draft}
              onChange={(event) => setDraft(event.currentTarget.value)}
              placeholder="Share a small moment, a thought, or something you made..."
              maxLength={280}
              rows={3}
            />
            <div className="composer-footer">
              <span className={draft.length > 250 ? "character-count near-limit" : "character-count"}>{draft.length}/280</span>
              <button className="post-button" type="submit" disabled={!draft.trim()}>Share a thought <span>↗</span></button>
            </div>
          </div>
        </form>

        <div className="feed-label">
          <span>{filter === "liked" ? "SAVED FOR A SMILE" : "A FEED THAT FEELS LIKE YOU"}</span>
          <span>{visiblePosts.length} {visiblePosts.length === 1 ? "post" : "posts"}</span>
        </div>

        <div className="post-list">
          <For each={visiblePosts} fallback={<div className="empty-state"><span>♡</span><strong>Nothing here just yet.</strong><p>Head home and share the first thought.</p></div>}>
            {(post) => (
              <article className="post-card" key={post.id}>
                <Avatar name={post.author} size="md" />
                <div className="post-content">
                  <div className="post-meta">
                    <strong>{post.author}</strong><span>{post.handle}</span><i>·</i><time>{post.time}</time>
                    {post.author === "You" && <button className="delete-button" type="button" onClick={() => removePost(post.id)}>Remove</button>}
                  </div>
                  <p className="post-body">{post.body}</p>
                  <div className="post-actions">
                    <button className={post.liked ? "like-button liked" : "like-button"} type="button" aria-pressed={post.liked} onClick={() => toggleLike(post.id)}>
                      <span>{post.liked ? "♥" : "♡"}</span> {post.likes}
                    </button>
                    <span className="local-badge"><i /> saved on this device</span>
                  </div>
                </div>
              </article>
            )}
          </For>
        </div>
        <footer className="feed-footer">Made for the little things worth sharing <span>✳</span></footer>
      </section>

      <aside className="right-rail">
        <div className="welcome-card">
          <span className="welcome-icon">✿</span>
          <span className="eyebrow">A GENTLER SOCIAL APP</span>
          <h2>Good things grow when shared.</h2>
          <p>This starter works offline. Your posts and likes are saved in local storage on this device.</p>
        </div>
        <div className="rail-card">
          <span className="eyebrow">A FEW KIND REMINDERS</span>
          <p>🌱 Small is still worth sharing.</p>
          <p>☀️ Take what you need. Leave the rest.</p>
          <p>💛 Be the reason someone smiles.</p>
        </div>
        <div className="rail-legal">A local-first demo · Your data stays yours</div>
      </aside>
    </main>
  );
}
`,
  "src/styles.css": `:root { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #33372f; background: #f5f4f1; font-synthesis: none; text-rendering: optimizeLegibility; }
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; min-height: 100vh; }
button, textarea { font: inherit; }
button { -webkit-tap-highlight-color: transparent; }
.app-shell { display: grid; grid-template-columns: 238px minmax(420px, 640px) minmax(220px, 275px); gap: 38px; width: min(1280px, 100%); min-height: 100vh; margin: 0 auto; padding: 32px 30px; }
.sidebar { position: sticky; top: 0; display: flex; height: calc(100vh - 64px); min-height: 540px; flex-direction: column; padding: 9px 0; }
.wordmark { display: flex; align-items: center; gap: 10px; color: #34382f; font: 800 19px Manrope, sans-serif; letter-spacing: -1px; text-decoration: none; }
.brand-mark { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 13px; background: linear-gradient(145deg, #e9a788, #c87258); color: #fff; font: 800 21px Manrope, sans-serif; }
.sidebar-caption { margin: 6px 0 38px 47px; color: #99998f; font-size: 11px; }
.side-nav { display: grid; gap: 7px; }
.nav-item { display: flex; align-items: center; gap: 13px; border: 0; border-radius: 12px; padding: 12px 13px; background: transparent; color: #78796f; text-align: left; cursor: pointer; font-size: 13px; }
.nav-item span { width: 20px; color: #9d806c; font-size: 19px; text-align: center; }
.nav-item.active { background: #ece8e0; color: #4a4c40; font-weight: 700; }
.sidebar-note { margin-top: auto; border: 1px solid #ebe7df; border-radius: 16px; padding: 16px; background: #fbfaf7; }
.note-spark { display: block; margin-bottom: 12px; color: #cb8d6b; font-size: 22px; }
.sidebar-note strong { font-size: 12px; }
.sidebar-note p { margin: 7px 0 0; color: #919188; font-size: 11px; line-height: 1.6; }
.profile-mini { display: flex; align-items: center; gap: 10px; margin-top: 18px; border-top: 1px solid #e9e6de; padding: 16px 5px 0; }
.profile-mini strong, .profile-mini span:not(.profile-menu) { display: block; font-size: 11px; }.profile-mini span:not(.profile-menu) { margin-top: 3px; color: #9b9b91; }
.profile-menu { margin-left: auto; color: #8c8d82; }
.feed-column { min-width: 0; border: 1px solid #e9e6de; border-radius: 20px; padding: 24px 24px 16px; background: #fbfaf7; box-shadow: 0 10px 45px #453d2910; }
.feed-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.eyebrow { color: #a18b72; font-size: 9px; font-weight: 700; letter-spacing: 1.35px; }
.feed-header h1 { margin: 5px 0 0; font: 800 23px Manrope, sans-serif; letter-spacing: -1px; }
.platform-pill { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #ebe7df; border-radius: 30px; padding: 6px 10px; color: #85867c; font-size: 10px; text-transform: capitalize; }
.platform-pill i, .local-badge i { width: 6px; height: 6px; border-radius: 50%; background: #85a98b; }
.platform-error { border-radius: 9px; padding: 10px; background: #fff0ed; color: #a1463c; font-size: 11px; }
.composer { display: flex; gap: 12px; border: 1px solid #eae7df; border-radius: 15px; padding: 16px; background: #fff; }
.composer-content { flex: 1; min-width: 0; }.composer-content label { color: #7e7f74; font-size: 11px; font-weight: 600; }
.composer textarea { display: block; width: 100%; min-height: 78px; resize: vertical; margin-top: 9px; border: 0; outline: 0; color: #484a40; font-size: 13px; line-height: 1.55; }
.composer textarea::placeholder { color: #b4b2a9; }
.composer-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f0eee8; padding-top: 12px; }
.character-count { color: #aaa99f; font-size: 10px; }.near-limit { color: #ba765a; }
.post-button { border: 0; border-radius: 9px; padding: 9px 12px; background: #526653; color: #fff; cursor: pointer; font-size: 11px; font-weight: 700; }
.post-button:disabled { opacity: .45; cursor: not-allowed; }.post-button span { margin-left: 7px; }
.feed-label { display: flex; justify-content: space-between; margin: 25px 1px 10px; color: #a3a095; font-size: 9px; font-weight: 700; letter-spacing: 1px; }
.feed-label span + span { font-weight: 500; letter-spacing: 0; text-transform: none; }
.post-list { display: grid; gap: 10px; }
.post-card { display: flex; gap: 12px; border: 1px solid #eeece5; border-radius: 14px; padding: 15px; background: #fff; }
.post-content { flex: 1; min-width: 0; }.post-meta { display: flex; align-items: center; gap: 6px; min-height: 28px; color: #9a9a90; font-size: 10px; }
.post-meta strong { color: #45473e; font-size: 11px; }.post-meta i { font-style: normal; }.post-meta time { white-space: nowrap; }
.delete-button { margin-left: auto; border: 0; padding: 3px 0; background: transparent; color: #a57d6a; cursor: pointer; font-size: 9px; }
.post-body { margin: 12px 0 15px; color: #62645a; font-size: 12px; line-height: 1.7; white-space: pre-wrap; overflow-wrap: anywhere; }
.post-actions { display: flex; align-items: center; gap: 15px; }.like-button { display: inline-flex; align-items: center; gap: 5px; border: 0; padding: 0; background: transparent; color: #96968c; cursor: pointer; font-size: 10px; }.like-button span { font-size: 16px; }.like-button.liked { color: #c97767; }
.local-badge { display: inline-flex; align-items: center; gap: 5px; color: #a7a69c; font-size: 9px; }
.empty-state { display: grid; justify-items: center; border: 1px dashed #e2ded5; border-radius: 14px; padding: 38px 15px; color: #87877d; text-align: center; }.empty-state>span { color: #c08a72; font-size: 25px; }.empty-state strong { margin-top: 10px; font-size: 12px; }.empty-state p { margin: 6px 0 0; font-size: 11px; }
.feed-footer { padding-top: 19px; color: #aaa99e; text-align: center; font-size: 9px; }.feed-footer span { color: #c78668; }
.right-rail { display: flex; flex-direction: column; gap: 14px; padding-top: 98px; }
.welcome-card, .rail-card { border: 1px solid #e9e6de; border-radius: 16px; padding: 17px; background: #fbfaf7; }
.welcome-icon { display: grid; width: 35px; height: 35px; place-items: center; margin-bottom: 14px; border-radius: 12px; background: #f2e8dc; color: #b47c5d; font-size: 18px; }
.welcome-card h2 { margin: 8px 0; font: 700 17px Manrope, sans-serif; letter-spacing: -.5px; line-height: 1.35; }.welcome-card p { margin: 0; color: #8b8b81; font-size: 11px; line-height: 1.65; }
.rail-card { padding: 16px; }.rail-card p { margin: 15px 0 0; color: #76776d; font-size: 10px; line-height: 1.5; }
.rail-legal { margin-top: auto; padding: 0 4px; color: #aaa99e; font-size: 9px; line-height: 1.6; }
@media (max-width: 1040px) { .app-shell { grid-template-columns: 190px minmax(400px, 640px); justify-content: center; gap: 24px; }.right-rail { display: none; } }
@media (max-width: 700px) { .app-shell { display: block; padding: 0; }.sidebar { position: static; display: flex; height: auto; min-height: 0; flex-direction: row; align-items: center; padding: 13px 17px; border-bottom: 1px solid #e9e6de; background: #fbfaf7; }.wordmark { font-size: 16px; }.brand-mark { width: 32px; height: 32px; }.sidebar-caption, .sidebar-note, .profile-mini { display: none; }.side-nav { display: flex; gap: 4px; margin-left: auto; }.nav-item { gap: 5px; padding: 8px; font-size: 10px; }.nav-item span { width: auto; font-size: 15px; }.feed-column { min-height: calc(100vh - 58px); border: 0; border-radius: 0; padding: 21px 15px 13px; box-shadow: none; }.feed-header h1 { font-size: 21px; }.composer { gap: 9px; padding: 12px; }.post-card { gap: 9px; padding: 12px; }.post-meta { gap: 4px; font-size: 9px; }.post-meta strong { font-size: 10px; }.platform-pill { padding: 5px 8px; font-size: 9px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; } }
`,
  "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  clearScreen: false,
  server: { strictPort: true },
});
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "vite.config.ts"]
}
`,
  "src-tauri/Cargo.toml": `[package]
name = "pradyumn_social_app"
version = "0.1.0"
description = "A local-first Pradyumn social app"
authors = ["Pradyumn"]
edition = "2021"

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }

[features]
custom-protocol = ["tauri/custom-protocol"]
`,
  "src-tauri/build.rs": `fn main() {
    tauri_build::build()
}
`,
  "src-tauri/src/main.rs": `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "android")]
mod platform {
    pub fn name() -> &'static str {
        "android"
    }
}

#[cfg(target_os = "ios")]
mod platform {
    pub fn name() -> &'static str {
        "ios"
    }
}

#[cfg(not(any(target_os = "android", target_os = "ios")))]
mod platform {
    pub fn name() -> &'static str {
        "desktop"
    }
}

#[tauri::command]
fn platform_name() -> &'static str {
    platform::name()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![platform_name])
        .run(tauri::generate_context!())
        .expect("error while running the Pradyumn application");
}
`,
  "src-tauri/tauri.conf.json": `{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Commonplace",
  "version": "0.1.0",
  "identifier": "com.pradyumn.commonplace",
  "build": {
    "beforeDevCommand": "npm run dev -- --host 0.0.0.0",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Commonplace",
        "width": 1120,
        "height": 800,
        "minWidth": 360,
        "minHeight": 560
      }
    ],
    "security": {
      "csp": "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' asset: data:; connect-src ipc: http://ipc.localhost http://localhost:5173 ws://localhost:5173"
    }
  },
  "bundle": {
    "active": true
  }
}
`,
  "src-tauri/capabilities/default.json": `{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default permissions for the social starter",
  "windows": ["main"],
  "permissions": ["core:default"]
}
`,
};

function runNpm(args: string[], cwd: string): void {
  const result = spawnSync("npm", args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) {
    throw new Error(`Could not run npm: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(" ")} failed with exit code ${result.status ?? "unknown"}.`);
  }
}

export function writeNextAppTemplate(projectPath: string): void {
  for (const [relativePath, contents] of Object.entries(nextAppFiles)) {
    const destination = path.join(projectPath, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, contents, "utf8");
  }
}

export function writeSocialAppTemplate(projectPath: string): void {
  for (const [relativePath, contents] of Object.entries(socialAppFiles)) {
    const destination = path.join(projectPath, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, contents, "utf8");
  }

  const packageName = path.basename(projectPath)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "pradyumn-social-app";
  const appIdentifier = /^[a-z]/.test(packageName) ? packageName : `app-${packageName}`;
  writeFileSync(
    path.join(projectPath, "package.json"),
    `${JSON.stringify({
      name: packageName,
      private: true,
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
        tauri: "tauri",
        "desktop:dev": "tauri dev",
        "desktop:build": "tauri build",
        "android:init": "tauri android init",
        "android:dev": "tauri android dev",
        "android:build": "tauri android build",
        "ios:init": "tauri ios init",
        "ios:dev": "tauri ios dev",
        "ios:build": "tauri ios build",
      },
      dependencies: {
        "@tauri-apps/api": "^2.0.0",
        pradyumn: "latest",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
      devDependencies: {
        "@tauri-apps/cli": "^2.0.0",
        "@vitejs/plugin-react": "^4.3.0",
        "@types/node": "^22.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        typescript: "~5.5.4",
        vite: "^5.4.0",
      },
    }, null, 2)}\n`,
    "utf8",
  );
  const configPath = path.join(projectPath, "src-tauri/tauri.conf.json");
  const config = readFileSync(configPath, "utf8");
  writeFileSync(configPath, config.replace("com.pradyumn.commonplace", `com.pradyumn.${appIdentifier}`), "utf8");
}

function createApp(projectName: string, platform?: CrossPlatformTarget): void {
  const projectPath = path.resolve(process.cwd(), projectName);
  if (platform) {
    if (existsSync(projectPath) && readdirSync(projectPath).length > 0) {
      throw new Error(`${projectPath} is not empty. Choose another project directory.`);
    }
    mkdirSync(projectPath, { recursive: true });
    writeSocialAppTemplate(projectPath);
    runNpm(["install"], projectPath);
    console.log(`\nYour Pradyumn social app is ready in ${projectPath}.`);
    console.log("\n  npm run dev");
    console.log(`  Selected target: ${platform}`);
    if (platform === "android" || platform === "all") {
      console.log("  Android: npm run android:init, then npm run android:dev");
    }
    if (platform === "ios" || platform === "all") {
      console.log("  iOS: npm run ios:init, then npm run ios:dev (requires macOS and Xcode)");
    }
    if (platform === "desktop" || platform === "all") {
      console.log("  Desktop: npm run desktop:dev");
    }
    if (platform === "web" || platform === "all") {
      console.log("  Web: npm run dev");
    }
    console.log("\nNative builds require Rust and the relevant Android or iOS toolchain.");
    return;
  }

  const parentPath = path.dirname(projectPath);
  const projectDirectoryName = path.basename(projectPath);

  if (existsSync(projectPath)) {
    if (existsSync(path.join(projectPath, "package.json"))) {
      const packageJson = JSON.parse(readFileSync(path.join(projectPath, "package.json"), "utf8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      if (!packageJson.dependencies?.["next"] && !packageJson.devDependencies?.["next"]) {
        throw new Error(`${projectPath} already contains a package.json but is not a Next.js app.`);
      }
    } else if (readdirSync(projectPath).length > 0) {
      throw new Error(`${projectPath} is not empty. Choose another project directory.`);
    } else {
      runNpm(
        [
          "create",
          "next-app@latest",
          ".",
          "--",
          "--typescript",
          "--eslint",
          "--app",
          "--src-dir",
          "--no-tailwind",
          "--use-npm",
          "--import-alias",
          "@/*",
          "--yes",
        ],
        projectPath,
      );
    }
  } else {
    runNpm(
      [
        "create",
        "next-app@latest",
        projectDirectoryName,
        "--",
        "--typescript",
        "--eslint",
        "--app",
        "--src-dir",
        "--no-tailwind",
        "--use-npm",
        "--import-alias",
        "@/*",
        "--yes",
      ],
      parentPath,
    );
  }

  writeNextAppTemplate(projectPath);
  runNpm(["install", "pradyumn"], projectPath);
  console.log(`\nYour Next.js + TypeScript app is ready in ${projectPath}.`);
  console.log(`\n  cd ${projectName}\n  npm run dev\n`);
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);
  if (command === "--help" || command === "-h" || command === "help") {
    console.log("Usage: pradyumn create [project-name] [--platform web|android|ios|desktop|all]");
    console.log("Create a Next.js app, or choose a platform to create a Pradyumn-powered local-first social app.");
    return;
  }
  if (command !== "create") {
    throw new Error('Unknown command. Use "pradyumn create [project-name]".');
  }

  const platformIndex = args.indexOf("--platform");
  let platform: CrossPlatformTarget | undefined;
  if (platformIndex !== -1) {
    const selectedPlatform = args[platformIndex + 1];
    if (
      selectedPlatform !== "web" &&
      selectedPlatform !== "android" &&
      selectedPlatform !== "ios" &&
      selectedPlatform !== "desktop" &&
      selectedPlatform !== "all"
    ) {
      throw new Error('Choose a platform: "web", "android", "ios", "desktop", or "all".');
    }
    platform = selectedPlatform;
    args.splice(platformIndex, 2);
  }

  if (args.length > 1 || args.some((arg) => arg.startsWith("--"))) {
    throw new Error("Provide one project name and an optional --platform target.");
  }
  createApp(args[0] ?? "my-pradyumn-app", platform);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`\nUnable to create the app: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
