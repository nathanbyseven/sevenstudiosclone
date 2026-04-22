// app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Faithful Next.js conversion of the Seven Studios homepage.
// All CSS is injected via <style> inside the component (preserving every rule
// exactly), and all JS runs via next/script with strategy="afterInteractive"
// so the DOM is ready before the scripts execute — matching the original
// <script> at end-of-body behaviour.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Seven Studios® — Purpose-Led Creative Studio',
  description:
    'Seven Studios helps ambitious purpose-led brands define sharper positioning, build stronger identities, and create creative systems that carry across every touchpoint.',
  icons: { icon: 'https://i.ibb.co/Fb31LWRc/ssfavicon.png' },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  return (
    <>
      {/* ── Google Calendar CSS ───────────────────────────────────── */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://calendar.google.com/calendar/scheduling-button-script.css"
        rel="stylesheet"
      />

      {/* ── All inline styles (verbatim from original) ─────────────── */}
      <style>{`
        /* ─── FONT FACES ─────────────────────────────────────────── */
        @font-face { font-family:'CreatoDisplay'; src:url('/fonts/CreatoDisplay-Thin.otf') format('opentype'); font-weight:100; font-display:swap; }
        @font-face { font-family:'CreatoDisplay'; src:url('/fonts/CreatoDisplay-Light.otf') format('opentype'); font-weight:300; font-display:swap; }
        @font-face { font-family:'CreatoDisplay'; src:url('/fonts/CreatoDisplay-Regular.otf') format('opentype'); font-weight:400; font-display:swap; }
        @font-face { font-family:'CreatoDisplay'; src:url('/fonts/CreatoDisplay-Medium.otf') format('opentype'); font-weight:500; font-display:swap; }
        @font-face { font-family:'CreatoDisplay'; src:url('/fonts/CreatoDisplay-Bold.otf') format('opentype'); font-weight:700; font-display:swap; }
        @font-face { font-family:'CreatoDisplay'; src:url('/fonts/CreatoDisplay-ExtraBold.otf') format('opentype'); font-weight:800; font-display:swap; }
        @font-face { font-family:'CreatoDisplay'; src:url('/fonts/CreatoDisplay-Black.otf') format('opentype'); font-weight:900; font-display:swap; }

        /* ─── TOKENS ─────────────────────────────────────────────── */
        :root {
          --black:#000; --white:#fff; --off-white:#f5f5f5;
          --gray-line:rgba(255,255,255,0.12); --gray-text:rgba(255,255,255,0.45);
          --font:'CreatoDisplay','Helvetica Neue',Arial,sans-serif;
          --ease-out:cubic-bezier(0.23,1,0.32,1);
          --ease-drawer:cubic-bezier(0.32,0.72,0,1);
          --ease-inout:cubic-bezier(0.77,0,0.175,1);
        }

        /* ─── RESET ──────────────────────────────────────────────── */
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}
        body{font-family:var(--font);background:var(--black);color:var(--white);overflow-x:hidden;cursor:none;}
        a{color:inherit;text-decoration:none;}
        img{display:block;max-width:100%;}
        button{font-family:var(--font);cursor:none;border:none;background:none;}

        /* ─── CURSOR ─────────────────────────────────────────────── */
        #cursor{position:fixed;top:0;left:0;z-index:9999;pointer-events:none;mix-blend-mode:difference;}
        #cursor-dot{width:8px;height:8px;border-radius:50%;background:white;position:absolute;transform:translate(-50%,-50%);transition:width 300ms var(--ease-out),height 300ms var(--ease-out);}
        #cursor-ring{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.6);position:absolute;transform:translate(-50%,-50%);transition:width 300ms var(--ease-out),height 300ms var(--ease-out),opacity 300ms;}
        body.cursor-hover #cursor-dot{width:16px;height:16px;}
        body.cursor-hover #cursor-ring{width:60px;height:60px;opacity:0.4;}

        /* ─── NOISE ──────────────────────────────────────────────── */
        #noise{position:fixed;inset:0;z-index:100;pointer-events:none;opacity:0.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:256px 256px;}

        /* ─── LOADER ─────────────────────────────────────────────── */
        #loader{position:fixed;inset:0;z-index:1000;background:var(--black);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 600ms var(--ease-inout),visibility 600ms;}
        #loader.hidden{opacity:0;visibility:hidden;}
        .loader-logo{margin-bottom:48px;display:flex;align-items:center;justify-content:center;}
        .loader-logo img{height:clamp(28px,4vw,42px);width:auto;}
        .loader-bar-track{width:220px;height:1px;background:rgba(255,255,255,0.1);position:relative;overflow:hidden;}
        .loader-bar-fill{position:absolute;top:0;left:0;height:100%;width:0%;background:white;transition:width 1.8s var(--ease-inout);}

        /* ─── NAV ────────────────────────────────────────────────── */
        #nav{position:fixed;top:0;left:0;right:0;z-index:500;display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px;border-bottom:1px solid transparent;transition:border-color 400ms,background 400ms;}
        #nav.scrolled{background:rgba(0,0,0,0.88);backdrop-filter:blur(12px);border-color:var(--gray-line);}
        .nav-logo{display:flex;align-items:center;}
        .nav-logo img{height:28px;width:auto;display:block;}
        .nav-links{display:flex;align-items:center;gap:40px;list-style:none;}
        .nav-links a{font-size:0.72rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--gray-text);transition:color 200ms;}
        .nav-links a:hover{color:white;}
        .nav-cta{font-size:0.68rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:white;border:1px solid var(--gray-line);padding:8px 20px;transition:background 200ms,border-color 200ms,color 200ms;}
        .nav-cta:hover{background:white;border-color:white;color:black;}
        .hamburger{display:none;width:40px;height:40px;align-items:center;justify-content:center;position:relative;}
        .hamburger span{display:block;width:22px;height:1px;background:white;position:absolute;transition:transform 350ms var(--ease-out),opacity 200ms;}
        .hamburger span:nth-child(1){transform:translateY(-4px);}
        .hamburger span:nth-child(2){transform:translateY(4px);}
        .hamburger.active span:nth-child(1){transform:rotate(45deg);}
        .hamburger.active span:nth-child(2){transform:rotate(-45deg);}

        /* ─── MENU OVERLAY ───────────────────────────────────────── */
        #menu-overlay{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,0.96);backdrop-filter:blur(24px);display:grid;grid-template-columns:1fr 1fr;opacity:0;visibility:hidden;transition:opacity 500ms var(--ease-out),visibility 500ms;}
        #menu-overlay.active{opacity:1;visibility:visible;}
        .menu-image-pane{position:relative;overflow:hidden;}
        .menu-image-pane img{width:100%;height:100%;object-fit:cover;opacity:0.22;transform:scale(1.06);transition:transform 800ms var(--ease-out);}
        #menu-overlay.active .menu-image-pane img{transform:scale(1);}
        .menu-content-pane{display:flex;flex-direction:column;padding:100px 64px 64px;justify-content:space-between;}
        .menu-nav-items{list-style:none;}
        .menu-nav-items li{overflow:hidden;}
        .menu-nav-items a{display:block;font-size:clamp(3rem,6vw,5rem);font-weight:800;letter-spacing:-0.04em;line-height:1;padding:10px 0;transform:translateY(100%);transition:transform 600ms var(--ease-out),color 200ms;}
        #menu-overlay.active .menu-nav-items li:nth-child(1) a{transform:translateY(0);transition-delay:60ms;}
        #menu-overlay.active .menu-nav-items li:nth-child(2) a{transform:translateY(0);transition-delay:120ms;}
        #menu-overlay.active .menu-nav-items li:nth-child(3) a{transform:translateY(0);transition-delay:180ms;}
        #menu-overlay.active .menu-nav-items li:nth-child(4) a{transform:translateY(0);transition-delay:240ms;}
        #menu-overlay.active .menu-nav-items li:nth-child(5) a{transform:translateY(0);transition-delay:300ms;}
        .menu-nav-items a:hover{color:rgba(255,255,255,0.35);}
        .menu-footer{display:flex;gap:32px;flex-wrap:wrap;opacity:0;transform:translateY(12px);transition:opacity 500ms var(--ease-out) 380ms,transform 500ms var(--ease-out) 380ms;}
        #menu-overlay.active .menu-footer{opacity:1;transform:translateY(0);}
        .menu-footer a{font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gray-text);transition:color 200ms;}
        .menu-footer a:hover{color:white;}

        /* ─── HERO ───────────────────────────────────────────────── */
        #hero{min-height:100dvh;position:relative;display:flex;flex-direction:column;justify-content:flex-end;}
        .hero-bg{position:absolute;inset:0;overflow:hidden;background-image:url('https://i.postimg.cc/yNmPJz74/Chat-GPT-Image-Jan-2-2026-07-43-53-PM-1.png');background-size:cover;background-position:center top;transform:scale(1.06);transition:transform 1200ms var(--ease-out);}
        .hero-bg.loaded{transform:scale(1);}
        .hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.62) 65%,rgba(0,0,0,1) 100%);}
        .hero-content{position:relative;z-index:2;padding:0 48px 80px;width:100%;}
        .hero-eyebrow{font-size:0.68rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--gray-text);margin-bottom:20px;opacity:0;transform:translateY(16px);transition:opacity 700ms var(--ease-out) 200ms,transform 700ms var(--ease-out) 200ms;}
        .hero-eyebrow.visible{opacity:1;transform:translateY(0);}
        .hero-headline{font-size:clamp(2.8rem,8.5vw,10rem);font-weight:800;letter-spacing:-0.04em;line-height:0.93;margin-bottom:36px;opacity:0;transform:translateY(24px);transition:opacity 800ms var(--ease-out) 350ms,transform 800ms var(--ease-out) 350ms;}
        .hero-headline.visible{opacity:1;transform:translateY(0);}

        .hero-rotating-word{display:inline-block;position:relative;vertical-align:baseline;clip-path:inset(-40% -10px -40% -4px);transition:width 440ms cubic-bezier(0.4,0,0.2,1);}
        .rotating-sizer{display:inline-block;visibility:hidden;white-space:nowrap;pointer-events:none;position:absolute;left:0;top:0;font-size:inherit;font-weight:inherit;letter-spacing:inherit;font-family:inherit;line-height:inherit;}
        .rotating-inner{display:inline-block;white-space:nowrap;line-height:inherit;transition:transform 440ms cubic-bezier(0.4,0,0.2,1),opacity 300ms cubic-bezier(0.4,0,0.2,1);}
        .rotating-inner.exit{transform:translateY(-120%);opacity:0;}
        .rotating-inner.enter{transform:translateY(120%);opacity:0;transition:none;}

        .hero-line1{display:block;}
        .hero-line1-inner{display:block;}
        .hero-line2{display:block;}

        .hero-subline{max-width:520px;font-size:clamp(0.88rem,1.4vw,1.05rem);font-weight:300;line-height:1.75;color:rgba(255,255,255,0.62);margin-bottom:52px;opacity:0;transform:translateY(16px);transition:opacity 700ms var(--ease-out) 500ms,transform 700ms var(--ease-out) 500ms;}
        .hero-subline.visible{opacity:1;transform:translateY(0);}
        .hero-ctas{display:flex;gap:14px;align-items:center;flex-wrap:wrap;opacity:0;transform:translateY(16px);transition:opacity 700ms var(--ease-out) 650ms,transform 700ms var(--ease-out) 650ms;}
        .hero-ctas.visible{opacity:1;transform:translateY(0);}

        .hero-scroll-indicator{position:absolute;bottom:32px;right:48px;display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;transition:opacity 800ms var(--ease-out) 1000ms;}
        .hero-scroll-indicator.visible{opacity:1;}
        .scroll-line{width:1px;height:48px;background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.4));animation:scrollPulse 2s ease-in-out infinite;}
        @keyframes scrollPulse{0%,100%{opacity:0.4;}50%{opacity:1;}}
        .scroll-label{font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gray-text);writing-mode:vertical-rl;}

        /* ─── BUTTONS ────────────────────────────────────────────── */
        .btn-primary{display:inline-flex;align-items:center;gap:10px;background:white;color:black;font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:14px 28px;transition:transform 200ms var(--ease-out),background 200ms;}
        .btn-primary:hover{background:var(--off-white);transform:scale(0.98);}
        .btn-primary:active{transform:scale(0.96);}
        .btn-secondary{display:inline-flex;align-items:center;gap:10px;background:transparent;color:white;font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:14px 28px;border:1px solid var(--gray-line);transition:transform 200ms var(--ease-out),border-color 200ms;}
        .btn-secondary:hover{border-color:rgba(255,255,255,0.4);transform:scale(0.98);}
        .btn-text{display:inline-flex;align-items:center;gap:12px;font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:white;padding-bottom:4px;border-bottom:1px solid var(--gray-line);transition:gap 300ms var(--ease-out),border-color 200ms;}
        .btn-text:hover{gap:20px;border-color:rgba(255,255,255,0.5);}
        .btn-ghost{display:inline-flex;align-items:center;gap:10px;font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:white;border:1px solid var(--gray-line);padding:13px 24px;background:none;transition:border-color 200ms,transform 200ms var(--ease-out);}
        .btn-ghost:hover{border-color:rgba(255,255,255,0.4);transform:scale(0.98);}

        /* ─── TRUST STRIP ────────────────────────────────────────── */
        #trust{border-top:1px solid var(--gray-line);border-bottom:1px solid var(--gray-line);overflow:hidden;padding:26px 0;position:relative;}
        #trust::before,#trust::after{content:'';position:absolute;top:0;bottom:0;width:100px;z-index:2;pointer-events:none;}
        #trust::before{left:0;background:linear-gradient(to right,black,transparent);}
        #trust::after{right:0;background:linear-gradient(to left,black,transparent);}
        #trust-rail{display:flex;align-items:center;width:max-content;will-change:transform;}
        .trust-set{display:flex;align-items:center;gap:72px;padding-right:72px;flex-shrink:0;}
        .trust-set img{height:20px;width:auto;flex-shrink:0;opacity:0.32;filter:brightness(0) invert(1);transition:opacity 300ms;}
        .trust-set img:hover{opacity:0.75;}

        /* ─── ABOUT ──────────────────────────────────────────────── */
        #about{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--gray-line);}
        .about-image-col{position:relative;overflow:hidden;min-height:600px;}
        .about-image-col img{width:100%;height:100%;object-fit:cover;transition:transform 600ms var(--ease-out);}
        .about-image-col:hover img{transform:scale(1.03);}
        .about-image-col::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,0.28);}
        .about-location{position:absolute;bottom:32px;left:32px;z-index:2;font-size:0.62rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:8px;}
        .about-location::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:white;opacity:0.5;}
        .about-content-col{padding:100px 80px;display:flex;flex-direction:column;justify-content:center;border-left:1px solid var(--gray-line);}
        .section-eyebrow{font-size:0.62rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--gray-text);margin-bottom:32px;display:flex;align-items:center;gap:16px;}
        .section-eyebrow::before{content:'';display:block;width:32px;height:1px;background:var(--gray-text);}
        .section-headline{font-size:clamp(1.9rem,3.8vw,3.4rem);font-weight:800;letter-spacing:-0.04em;line-height:1.02;margin-bottom:28px;}
        .section-body{font-size:0.98rem;font-weight:300;line-height:1.78;color:rgba(255,255,255,0.6);margin-bottom:44px;max-width:480px;}
        .about-stats{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--gray-line);margin-top:48px;}
        .stat-item{padding:28px 0;border-right:1px solid var(--gray-line);border-bottom:1px solid var(--gray-line);}
        .stat-item:nth-child(even){border-right:none;padding-left:28px;}
        .stat-item:nth-child(n+3){border-bottom:none;}
        .stat-value{font-size:clamp(1.8rem,3vw,2.5rem);font-weight:800;letter-spacing:-0.04em;line-height:1;}
        .stat-label{font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gray-text);margin-top:4px;}

        /* ─── CASE STUDIES ───────────────────────────────────────── */
        #cases{padding:120px 0;}
        .cases-header{display:flex;align-items:flex-end;justify-content:space-between;padding:0 48px 48px;margin-bottom:80px;border-bottom:1px solid var(--gray-line);}
        .cases-label{font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gray-text);margin-bottom:16px;}
        .cases-headline{font-size:clamp(2.4rem,5vw,5rem);font-weight:800;letter-spacing:-0.04em;line-height:0.95;}
        .cases-grid{display:grid;grid-template-columns:repeat(2,1fr);}
        .case-card{position:relative;overflow:hidden;display:block;cursor:none;border-right:1px solid var(--gray-line);border-bottom:1px solid var(--gray-line);}
        .case-card:nth-child(even){border-right:none;}
        .case-card.wide{grid-column:span 2;border-right:none;}
        .case-card.wide .case-card-img{aspect-ratio:21/9;}
        .case-card-img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;transition:transform 700ms var(--ease-out);}
        .case-card:hover .case-card-img{transform:scale(1.04);}
        .case-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 60%);opacity:0.6;transition:opacity 400ms;}
        .case-card:hover .case-card-overlay{opacity:0.86;}
        .case-card-content{position:absolute;bottom:0;left:0;right:0;padding:36px;transform:translateY(8px);transition:transform 400ms var(--ease-out);}
        .case-card:hover .case-card-content{transform:translateY(0);}
        .case-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
        .case-tag{font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.2);padding:4px 10px;}
        .case-title{font-size:clamp(1.1rem,2.2vw,1.7rem);font-weight:700;letter-spacing:-0.03em;line-height:1.1;margin-bottom:8px;}
        .case-desc{font-size:0.83rem;font-weight:300;color:rgba(255,255,255,0.55);line-height:1.6;max-width:380px;opacity:0;transform:translateY(8px);transition:opacity 350ms var(--ease-out) 50ms,transform 350ms var(--ease-out) 50ms;}
        .case-card:hover .case-desc{opacity:1;transform:translateY(0);}
        .case-arrow{position:absolute;top:28px;right:28px;width:38px;height:38px;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;opacity:0;transform:translate(-8px,8px);transition:opacity 300ms var(--ease-out),transform 300ms var(--ease-out);}
        .case-card:hover .case-arrow{opacity:1;transform:translate(0,0);}

        /* ─── SERVICES ───────────────────────────────────────────── */
        #services{border-top:1px solid var(--gray-line);}
        .services-header{padding:64px 48px 0;}
        .services-label{font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gray-text);}
        .service-row{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--gray-line);align-items:stretch;position:relative;overflow:hidden;cursor:none;}
        .service-row:last-child{border-bottom:none;}
        .service-row::before{content:'';position:absolute;inset:0;background:white;transform:scaleX(0);transform-origin:left;transition:transform 500ms var(--ease-drawer);z-index:0;}
        .service-row:hover::before{transform:scaleX(1);}
        .service-row:hover .service-name,.service-row:hover .service-desc,.service-row:hover .service-num{color:black;}
        .service-name{font-size:clamp(1.9rem,4vw,4.5rem);font-weight:800;letter-spacing:-0.04em;line-height:1;padding:38px 48px;position:relative;z-index:1;transition:color 300ms;}
        .service-desc{padding:38px 48px;font-size:0.88rem;font-weight:300;line-height:1.65;color:var(--gray-text);border-left:1px solid var(--gray-line);display:flex;align-items:center;position:relative;z-index:1;transition:color 300ms,border-color 300ms;}
        .service-row:hover .service-desc{border-color:rgba(0,0,0,0.12);}
        .service-num{position:absolute;top:26px;right:48px;font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gray-text);z-index:1;transition:color 300ms;}

        /* ─── APPROACH ───────────────────────────────────────────── */
        #approach{padding:120px 48px;display:grid;grid-template-columns:1fr 2fr;border-top:1px solid var(--gray-line);border-bottom:1px solid var(--gray-line);}
        .approach-left{padding-right:80px;border-right:1px solid var(--gray-line);}
        .approach-headline{font-size:clamp(1.9rem,3.8vw,3.4rem);font-weight:800;letter-spacing:-0.04em;line-height:1.02;margin-top:28px;}
        .approach-right{padding-left:80px;}
        .approach-steps{display:grid;grid-template-columns:1fr 1fr;}
        .approach-step{padding:48px 48px 48px 0;border-bottom:1px solid var(--gray-line);border-right:1px solid var(--gray-line);}
        .approach-step:nth-child(even){border-right:none;padding-right:0;padding-left:48px;}
        .approach-step:nth-child(n+3){border-bottom:none;}
        .step-num{font-size:3rem;font-weight:800;letter-spacing:-0.04em;line-height:1;color:rgba(255,255,255,0.07);margin-bottom:24px;}
        .step-title{font-size:1.25rem;font-weight:700;letter-spacing:-0.03em;margin-bottom:10px;}
        .step-desc{font-size:0.85rem;font-weight:300;line-height:1.72;color:var(--gray-text);}

        /* ─── CONTACT ────────────────────────────────────────────── */
        #contact{padding:120px 48px;display:grid;grid-template-columns:1fr 1fr;position:relative;background-image:url('https://i.postimg.cc/ygv4H6bV/Section-CONTACT--1-.png');background-size:cover;background-position:center center;background-repeat:no-repeat;}
        #contact::before{content:'';position:absolute;inset:0;background:rgba(0,0,0,0.52);pointer-events:none;z-index:0;}
        #contact > *{position:relative;z-index:1;}
        .contact-left{padding-right:80px;border-right:1px solid var(--gray-line);}
        .contact-headline{font-size:clamp(2.2rem,4.8vw,4.8rem);font-weight:800;letter-spacing:-0.04em;line-height:0.95;margin-bottom:28px;}
        .contact-body{font-size:0.98rem;font-weight:300;line-height:1.78;color:rgba(255,255,255,0.55);margin-bottom:44px;max-width:420px;}
        .contact-email{font-size:0.72rem;letter-spacing:0.08em;color:var(--gray-text);text-transform:uppercase;}
        .contact-email span{color:white;display:block;font-size:0.98rem;letter-spacing:-0.01em;text-transform:none;margin-top:4px;}
        .contact-right{padding-left:80px;}
        .form-field{border-bottom:1px solid var(--gray-line);}
        .form-field label{display:block;font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gray-text);padding:20px 0 0;margin-bottom:8px;}
        .form-field input,.form-field textarea,.form-field select{width:100%;background:none;border:none;outline:none;font-family:var(--font);font-size:1rem;font-weight:300;color:white;padding:0 0 20px;resize:none;appearance:none;}
        .form-field select option{background:#111;}
        .form-field textarea{min-height:96px;}
        .form-submit{margin-top:36px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;}
        #form-success-state{display:none;}
        #form-success-state.show{display:block;}
        .success-icon{width:48px;height:48px;border:1px solid var(--gray-line);display:flex;align-items:center;justify-content:center;margin-bottom:28px;}
        .success-heading{font-size:1.6rem;font-weight:800;letter-spacing:-0.04em;margin-bottom:12px;}
        .success-body{font-size:0.9rem;font-weight:300;line-height:1.72;color:var(--gray-text);margin-bottom:32px;}

        /* ─── FOOTER ─────────────────────────────────────────────── */
        #footer{border-top:1px solid var(--gray-line);padding:80px 48px 48px;}
        .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;margin-bottom:80px;padding-bottom:80px;border-bottom:1px solid var(--gray-line);}
        .footer-brand{padding-right:60px;border-right:1px solid var(--gray-line);}
        .footer-logo{display:block;margin-bottom:20px;}
        .footer-logo img{height:32px;width:auto;}
        .footer-tagline{font-size:0.85rem;font-weight:300;line-height:1.65;color:var(--gray-text);max-width:280px;}
        .footer-col{padding:0 40px;border-right:1px solid var(--gray-line);}
        .footer-col:last-child{border-right:none;}
        .footer-col-title{font-size:0.62rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gray-text);margin-bottom:24px;}
        .footer-col ul{list-style:none;}
        .footer-col li{margin-bottom:12px;}
        .footer-col a{font-size:0.875rem;font-weight:300;color:rgba(255,255,255,0.62);transition:color 200ms;}
        .footer-col a:hover{color:white;}
        .footer-bottom{display:flex;align-items:center;justify-content:space-between;}
        .footer-copyright{font-size:0.68rem;letter-spacing:0.08em;color:var(--gray-text);}
        .footer-wordmark{display:flex;align-items:center;}
        .footer-wordmark img{height:20px;width:auto;opacity:0.45;}

        /* ─── REVEAL ─────────────────────────────────────────────── */
        .reveal{opacity:0;transform:translateY(24px);transition:opacity 700ms var(--ease-out),transform 700ms var(--ease-out);}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-delay-1{transition-delay:80ms;}
        .reveal-delay-2{transition-delay:160ms;}
        .reveal-delay-3{transition-delay:240ms;}

        /* ─── MOBILE ─────────────────────────────────────────────── */
        @media(max-width:900px){
          body{cursor:auto;}
          #cursor{display:none;}
          #nav{padding:0 20px;}
          .nav-links,.nav-cta{display:none;}
          .hamburger{display:flex;}
          #menu-overlay{grid-template-columns:1fr;}
          .menu-image-pane{display:none;}
          .menu-content-pane{padding:88px 28px 56px;}
          .menu-nav-items a{font-size:clamp(2.8rem,11vw,4.5rem);padding:8px 0;}
          .menu-footer{gap:20px;}
          #hero{min-height:100dvh;}
          .hero-content{padding:0 20px 56px;}
          .hero-headline{font-size:clamp(2.4rem,10vw,5rem);line-height:0.95;margin-bottom:24px;}
          .hero-eyebrow{margin-bottom:14px;}
          .hero-subline{font-size:0.9rem;margin-bottom:36px;}
          .hero-ctas{gap:12px;}
          .btn-primary,.btn-secondary{padding:13px 22px;font-size:0.7rem;}
          .hero-scroll-indicator{display:none;}
          #trust{padding:20px 0;}
          #about{grid-template-columns:1fr;}
          .about-image-col{min-height:260px;}
          .about-content-col{padding:48px 20px;border-left:none;border-top:1px solid var(--gray-line);}
          .section-headline{font-size:clamp(1.6rem,6vw,2.5rem);}
          .section-body{font-size:0.92rem;}
          .about-stats{margin-top:32px;}
          .stat-value{font-size:clamp(1.4rem,5vw,2rem);}
          #cases{padding:64px 0;}
          .cases-header{flex-direction:column;align-items:flex-start;gap:20px;padding:0 20px 32px;margin-bottom:0;}
          .cases-headline{font-size:clamp(2rem,8vw,3.5rem);}
          .cases-grid{grid-template-columns:1fr;}
          .case-card,.case-card.wide{grid-column:span 1 !important;border-right:none;}
          .case-card.wide .case-card-img,.case-card-img{aspect-ratio:4/3 !important;}
          .case-card-content{padding:20px;}
          .case-title{font-size:1.15rem;}
          .case-desc{opacity:1;transform:none;}
          .case-arrow{opacity:1;transform:translate(0,0);}
          .services-header{padding:48px 20px 0;}
          .service-row{grid-template-columns:1fr;}
          .service-name{font-size:clamp(1.6rem,7vw,3rem);padding:28px 20px;}
          .service-desc{border-left:none;border-top:1px solid var(--gray-line);padding:18px 20px 28px;font-size:0.85rem;}
          .service-num{right:20px;top:20px;}
          #approach{padding:64px 20px;grid-template-columns:1fr;}
          .approach-left{padding-right:0;border-right:none;border-bottom:1px solid var(--gray-line);padding-bottom:40px;margin-bottom:40px;}
          .approach-right{padding-left:0;}
          .approach-steps{grid-template-columns:1fr;}
          .approach-step{border-right:none;padding:32px 0;border-bottom:1px solid var(--gray-line);}
          .approach-step:nth-child(even){padding-left:0;border-right:none;}
          .approach-step:last-child{border-bottom:none;}
          .step-num{font-size:2.2rem;margin-bottom:16px;}
          #contact{padding:64px 20px;grid-template-columns:1fr;}
          .contact-left{padding-right:0;border-right:none;border-bottom:1px solid var(--gray-line);padding-bottom:48px;margin-bottom:48px;}
          .contact-right{padding-left:0;}
          .contact-headline{font-size:clamp(2rem,8vw,3.5rem);}
          #footer{padding:48px 20px 36px;}
          .footer-top{grid-template-columns:1fr;margin-bottom:40px;padding-bottom:40px;}
          .footer-brand{border-right:none;padding-right:0;padding-bottom:32px;margin-bottom:32px;border-bottom:1px solid var(--gray-line);}
          .footer-col{padding:0;border-right:none;padding-bottom:28px;margin-bottom:28px;border-bottom:1px solid var(--gray-line);}
          .footer-col:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
          .footer-bottom{flex-direction:column;gap:12px;align-items:flex-start;}
        }
        @media(max-width:480px){
          .hero-ctas{flex-direction:column;align-items:stretch;}
          .btn-primary,.btn-secondary{justify-content:center;}
        }
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{transition-duration:0.01ms !important;animation-duration:0.01ms !important;}
        }
      `}</style>

      {/* ── Page body ─────────────────────────────────────────────── */}
      <div id="noise" aria-hidden="true" />
      <div id="cursor" aria-hidden="true">
        <div id="cursor-ring" />
        <div id="cursor-dot" />
      </div>

      {/* LOADER */}
      <div id="loader">
        <div className="loader-logo">
          <img src="https://iili.io/B4naON4.png" alt="Seven Studios" />
        </div>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" id="loader-bar" />
        </div>
      </div>

      {/* NAV */}
      <nav id="nav">
        <a href="#" className="nav-logo">
          <img src="https://iili.io/B4naON4.png" alt="Seven Studios" />
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#cases">Work</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#contact" className="nav-cta">Get in touch</a>
        <button className="hamburger" id="hamburger" aria-label="Open menu">
          <span />
          <span />
        </button>
      </nav>

      {/* MENU OVERLAY */}
      <div id="menu-overlay">
        <div className="menu-image-pane">
          <img
            src="https://i.postimg.cc/yNmPJz74/Chat-GPT-Image-Jan-2-2026-07-43-53-PM-1.png"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="menu-content-pane">
          <ul className="menu-nav-items">
            {/* onclick uses global closeMenu() defined in Script below */}
            <li><a href="#" onClick={() => (window as any).closeMenu?.()}>Home</a></li>
            <li><a href="#about" onClick={() => (window as any).closeMenu?.()}>About</a></li>
            <li><a href="#cases" onClick={() => (window as any).closeMenu?.()}>Work</a></li>
            <li><a href="#services" onClick={() => (window as any).closeMenu?.()}>Services</a></li>
            <li><a href="#contact" onClick={() => (window as any).closeMenu?.()}>Contact</a></li>
          </ul>
          <div className="menu-footer">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://threads.net" target="_blank" rel="noopener noreferrer">Threads</a>
            <a href="#contact" onClick={() => (window as any).closeMenu?.()}>Get in touch</a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg" id="hero-bg" />
        <div className="hero-content">
          <p className="hero-eyebrow" id="hero-eyebrow">Purpose-Led Creative Studio</p>
          <h1 className="hero-headline" id="hero-headline">
            <span className="hero-line1">
              <span className="hero-line1-inner" id="hero-line1-inner">We build brands</span>
            </span>
            <span className="hero-line2">
              {'through\u00a0'}
              <span className="hero-rotating-word" id="rotating-word-wrap">
                <span className="rotating-sizer" id="rotating-sizer">strategy</span>
                <span className="rotating-inner" id="rotating-word">strategy</span>
              </span>
              .
            </span>
          </h1>
          <p className="hero-subline" id="hero-subline">
            Seven Studios helps ambitious purpose-led brands define sharper positioning, build stronger identities, and create creative systems that carry across every touchpoint.
          </p>
          <div className="hero-ctas" id="hero-ctas">
            <a href="#contact" className="btn-primary">
              Start a project{' '}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#cases" className="btn-secondary">View selected work</a>
          </div>
        </div>
        <div className="hero-scroll-indicator" id="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-label">Scroll</span>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section id="trust" aria-label="Clients">
        <div id="trust-rail">
          <div className="trust-set" id="trust-set-original">
            <img src="https://i.ibb.co/mVPt1Vk3/Asset-4-3x-8-1.png" alt="Launchpath" />
            <img src="https://i.ibb.co/kVyFDpqr/Asset-1-4x.png" alt="Unlimited Walk Fest" />
            <img src="https://i.ibb.co/Q7DxP0R6/Mask-group.png" alt="Wisdom & Wellness" />
            <img src="https://i.ibb.co/xqhCP297/Group-396.png" alt="Aneno Beauty" />
            <img src="https://i.ibb.co/9kvYxMC3/Clip-path-group.png" alt="DIT" />
            <img src="https://i.ibb.co/FqXF3jVZ/Group-400.png" alt="Zaio Institute" />
            <img src="https://i.ibb.co/LXhhVjPY/image-19.png" alt="Africa Inspired" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-image-col reveal">
          <img
            src="https://i.postimg.cc/j2hBZvVc/Chat-GPT-Image-Jan-2-2026-08-00-38-PM-1.png"
            alt="Seven Studios studio"
            loading="lazy"
          />
          <div className="about-location">Cape Town, South Africa</div>
        </div>
        <div className="about-content-col">
          <div className="cases-label reveal">About Seven Studios</div>
          <h2 className="section-headline reveal reveal-delay-1">Built for brands that want to grow with intention</h2>
          <p className="section-body reveal reveal-delay-2">
            Seven Studios is a strategy and creative direction-driven studio for brands that need more than surface-level design. Founded in 2025 by Nathan Williams &amp; David Scullard, our mission has been to elevate brands that stand with purpose.
          </p>
          <div className="reveal reveal-delay-3">
            <a href="#" className="btn-text">
              More about Seven{' '}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 6.5H11.5M11.5 6.5L7.5 2.5M11.5 6.5L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="about-stats">
            <div className="stat-item reveal"><div className="stat-value">30<span style={{fontSize:'0.6em'}}>+</span></div><div className="stat-label">Brands built</div></div>
            <div className="stat-item reveal reveal-delay-1"><div className="stat-value">5 yrs</div><div className="stat-label">Studio experience</div></div>
            <div className="stat-item reveal reveal-delay-2"><div className="stat-value">7</div><div className="stat-label">Core disciplines</div></div>
            <div className="stat-item reveal reveal-delay-3"><div className="stat-value">100<span style={{fontSize:'0.6em'}}>%</span></div><div className="stat-label">Strategy-first</div></div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="cases">
        <div className="cases-header">
          <div>
            <div className="cases-label reveal">Case studies</div>
            <h2 className="cases-headline reveal reveal-delay-1">Featured<br />Cases</h2>
          </div>
          <a href="#" className="btn-text reveal">
            View all work{' '}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 6.5H11.5M11.5 6.5L7.5 2.5M11.5 6.5L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div className="cases-grid">
          <a href="/case-study/aneno" className="case-card wide reveal">
            <img src="https://i.postimg.cc/RFwHJvgY/Screen-Recording-2026-04-19-at-20-48-41-04.png" alt="Aneno Beauty" className="case-card-img" loading="lazy" />
            <div className="case-card-overlay" />
            <div className="case-card-content">
              <div className="case-tags"><span className="case-tag">Brand Identity</span><span className="case-tag">Web Design &amp; Development</span></div>
              <h3 className="case-title">Aneno Beauty</h3>
              <p className="case-desc">Building a beauty brand expression that feels premium, poised, and genuinely distinctive in a saturated market.</p>
            </div>
            <div className="case-arrow">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </a>
          <a href="/case-study/zaio" className="case-card reveal">
            <img src="https://i.ibb.co/mrHbD4Cs/Screen-Recording-2026-04-19-at-20-48-41-01.png" alt="Zaio Institute" className="case-card-img" loading="lazy" />
            <div className="case-card-overlay" />
            <div className="case-card-content">
              <div className="case-tags"><span className="case-tag">Brand Identity</span><span className="case-tag">UI/UX Design</span></div>
              <h3 className="case-title">Zaio Institute of Technology</h3>
              <p className="case-desc">Reframing a technology education brand with stronger clarity, sharper presence, and a future-facing digital identity.</p>
            </div>
            <div className="case-arrow">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </a>
          <a href="/case-study/dit" className="case-card reveal reveal-delay-1">
            <img src="https://i.ibb.co/1tkXkcs7/Screen-Recording-2026-04-19-at-20-48-41-02.png" alt="Darkies in Tech" className="case-card-img" loading="lazy" />
            <div className="case-card-overlay" />
            <div className="case-card-content">
              <div className="case-tags"><span className="case-tag">Brand Identity</span><span className="case-tag">UI/UX Design</span><span className="case-tag">Web Development</span></div>
              <h3 className="case-title">Darkies in Tech</h3>
              <p className="case-desc">Creating a visual system with confidence, contrast, and recognition that lasts beyond the first impression.</p>
            </div>
            <div className="case-arrow">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </a>
          <a href="/case-study/unlimited-walk-fest" className="case-card reveal reveal-delay-2" style={{gridColumn:'span 2', borderRight:'none'}}>
            <img src="https://i.postimg.cc/mkRFQKnd/Screen-Recording-2026-04-19-at-20-48-41-03.png" alt="Unlimited Walk Fest" className="case-card-img" style={{aspectRatio:'21/9'}} loading="lazy" />
            <div className="case-card-overlay" />
            <div className="case-card-content">
              <div className="case-tags"><span className="case-tag">Brand Identity</span><span className="case-tag">Campaign Design</span></div>
              <h3 className="case-title">Unlimited Walk Fest</h3>
              <p className="case-desc">Translating movement, energy, and cultural relevance into a bold and cohesive campaign world.</p>
            </div>
            <div className="case-arrow">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="services-header"><div className="services-label reveal">Core Services</div></div>
        <div className="service-row reveal"><div className="service-name">Brand Strategy</div><div className="service-desc">Defining positioning, messaging, and direction that guides every decision and future growth.</div><span className="service-num">01</span></div>
        <div className="service-row reveal"><div className="service-name">Brand Identity</div><div className="service-desc">Building visual systems that scale — designed to build recognition, trust, and long-term equity.</div><span className="service-num">02</span></div>
        <div className="service-row reveal"><div className="service-name">Creative Direction</div><div className="service-desc">Ensuring consistency across every touchpoint — turning big ideas into cohesive creative systems.</div><span className="service-num">03</span></div>
        <div className="service-row reveal"><div className="service-name">UI/UX Design</div><div className="service-desc">Designing digital experiences that convert — fast, modern interfaces focused on usability and performance.</div><span className="service-num">04</span></div>
        <div className="service-row reveal"><div className="service-name">Web Design &amp; Dev</div><div className="service-desc">Creating high-performance digital platforms built to communicate value and drive meaningful results.</div><span className="service-num">05</span></div>
        <div className="service-row reveal"><div className="service-name">Content &amp; Campaigns</div><div className="service-desc">Executing ideas that move brands forward — strategy, content, and management that keeps brands relevant.</div><span className="service-num">06</span></div>
      </section>

      {/* APPROACH */}
      <section id="approach">
        <div className="approach-left">
          <div className="cases-label reveal">Our Process</div>
          <h2 className="approach-headline reveal reveal-delay-1">How we work</h2>
        </div>
        <div className="approach-right">
          <div className="approach-steps">
            <div className="approach-step reveal"><div className="step-num">01</div><h3 className="step-title">Discover</h3><p className="step-desc">Understanding the brand, market, and opportunity — where you are and where you want to go.</p></div>
            <div className="approach-step reveal reveal-delay-1"><div className="step-num">02</div><h3 className="step-title">Define</h3><p className="step-desc">Clarifying positioning, messaging, and direction that anchors every creative decision we make.</p></div>
            <div className="approach-step reveal reveal-delay-2"><div className="step-num">03</div><h3 className="step-title">Design</h3><p className="step-desc">Building identity systems and creative outputs that carry meaning and scale across every medium.</p></div>
            <div className="approach-step reveal reveal-delay-3"><div className="step-num">04</div><h3 className="step-title">Deliver</h3><p className="step-desc">Launching and scaling across touchpoints — ensuring every asset performs in the real world.</p></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-left">
          <h2 className="contact-headline reveal">{"Let's build your brand together"}</h2>
          <p className="contact-body reveal reveal-delay-1">
            {"If you're ready to build a brand with clarity, direction, and long-term impact, get in touch. Every project starts with understanding where you're at and where you want to go."}
          </p>
          <div className="reveal reveal-delay-2">
            <div className="contact-email">Get in touch<span>INFO@THESEVENSTUDIO.CO.ZA</span></div>
          </div>
          <div style={{marginTop:'44px'}} className="reveal reveal-delay-3">
            <div id="gcal-btn-wrapper" />
          </div>
        </div>
        <div className="contact-right">
          <div id="form-active-state" className="reveal">
            <form id="contact-form">
              <div className="form-field"><label htmlFor="name">Name</label><input type="text" id="name" name="name" placeholder="Your full name" required /></div>
              <div className="form-field"><label htmlFor="email">Email</label><input type="email" id="email" name="email" placeholder="your@email.com" required /></div>
              <div className="form-field">
                <label htmlFor="service">Service</label>
                <select id="service" name="service">
                  <option value="">Select a service</option>
                  <option>Brand Strategy</option>
                  <option>Brand Identity</option>
                  <option>Creative Direction</option>
                  <option>UI/UX Design</option>
                  <option>Web Design &amp; Development</option>
                  <option>Content &amp; Campaigns</option>
                </select>
              </div>
              <div className="form-field"><label htmlFor="message">Message</label><textarea id="message" name="message" placeholder="Tell us about your project..." required /></div>
              <div className="form-submit">
                <button type="submit" className="btn-primary" id="submit-btn">
                  Send message{' '}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </form>
          </div>
          <div id="form-success-state">
            <div className="success-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L8 14.5L16 6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="success-heading">Message sent</p>
            <p className="success-body">{"We've received your message and will be in touch shortly. We look forward to learning more about your brand."}</p>
            <button className="btn-ghost" id="back-to-form">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5H1.5M1.5 6.5L5.5 2.5M1.5 6.5L5.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Send another message
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
        <div className="footer-top">
          <div className="footer-brand reveal">
            <span className="footer-logo"><img src="https://iili.io/B4naON4.png" alt="Seven Studios" /></span>
            <p className="footer-tagline">A strategy and creative direction-driven studio for brands that need more than surface-level design.</p>
          </div>
          <div className="footer-col reveal reveal-delay-1">
            <div className="footer-col-title">Studio</div>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#cases">Work</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col reveal reveal-delay-2">
            <div className="footer-col-title">Services</div>
            <ul>
              <li><a href="#services">Brand Strategy</a></li>
              <li><a href="#services">Creative Direction</a></li>
              <li><a href="#services">UI/UX Design</a></li>
              <li><a href="#services">Web Design &amp; Dev</a></li>
              <li><a href="#services">Content &amp; Campaigns</a></li>
            </ul>
          </div>
          <div className="footer-col reveal reveal-delay-3">
            <div className="footer-col-title">Social</div>
            <ul>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://threads.net" target="_blank" rel="noopener noreferrer">Threads</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copyright">© Seven Studios — All rights reserved</span>
          <span className="footer-wordmark"><img src="https://i.postimg.cc/crSwD7Q7/Main-Logo-White-1-4x.png" alt="Seven Studios" /></span>
        </div>
      </footer>

      {/* ── Google Calendar script ──────────────────────────────── */}
      <Script
        src="https://calendar.google.com/calendar/scheduling-button-script.js"
        strategy="afterInteractive"
      />

      {/* ── All site JavaScript (verbatim, runs after DOM ready) ── */}
      <Script id="seven-studios-main" strategy="afterInteractive">{`
        /* ── LOADER ──────────────────────────────────────────── */
        const loader=document.getElementById('loader'),loaderBar=document.getElementById('loader-bar');
        requestAnimationFrame(()=>setTimeout(()=>{loaderBar.style.width='60%'},80));
        window.addEventListener('load',()=>{
          loaderBar.style.width='100%';
          setTimeout(()=>{loader.classList.add('hidden');document.body.style.overflow='';initHeroAnimations();},640);
        });

        /* ── CURSOR ──────────────────────────────────────────── */
        const cursorDot=document.getElementById('cursor-dot'),cursorRing=document.getElementById('cursor-ring');
        let cx=0,cy=0,rx=0,ry=0;
        document.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;cursorDot.style.cssText='left:'+cx+'px;top:'+cy+'px';});
        (function animRing(){rx+=(cx-rx)*0.12;ry+=(cy-ry)*0.12;cursorRing.style.cssText='left:'+rx+'px;top:'+ry+'px';requestAnimationFrame(animRing);})();
        document.querySelectorAll('a,button,.service-row,.case-card').forEach(el=>{
          el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
          el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
        });

        /* ── NAV SCROLL ──────────────────────────────────────── */
        const nav=document.getElementById('nav');
        window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});

        /* ── HAMBURGER ───────────────────────────────────────── */
        const hamburger=document.getElementById('hamburger'),menuOverlay=document.getElementById('menu-overlay');
        hamburger.addEventListener('click',()=>menuOverlay.classList.contains('active')?closeMenu():openMenu());
        function openMenu(){menuOverlay.classList.add('active');hamburger.classList.add('active');document.body.style.overflow='hidden';}
        function closeMenu(){menuOverlay.classList.remove('active');hamburger.classList.remove('active');document.body.style.overflow='';}
        window.closeMenu=closeMenu;

        /* ── HERO INIT ───────────────────────────────────────── */
        function initHeroAnimations(){
          ['hero-eyebrow','hero-headline','hero-subline','hero-ctas','scroll-indicator'].forEach((id,i)=>
            setTimeout(()=>{ const el=document.getElementById(id); if(el) el.classList.add('visible'); },150*i)
          );
          const heroBg=document.getElementById('hero-bg');
          if(heroBg) heroBg.classList.add('loaded');
          startWordRotation();
        }

        /* ── ROTATING WORD ───────────────────────────────────── */
        const words=['strategy','design','branding','creative','direction'];
        let wordIndex=0;
        const rotatingEl=document.getElementById('rotating-word');
        const sizerEl=document.getElementById('rotating-sizer');
        const wrapEl=document.getElementById('rotating-word-wrap');

        function syncWidth(){
          const w=sizerEl.getBoundingClientRect().width;
          if(w>0) wrapEl.style.width=w+'px';
        }

        document.fonts.ready.then(()=>{ requestAnimationFrame(()=>{ syncWidth(); }); });
        window.addEventListener('resize',syncWidth,{passive:true});

        function startWordRotation(){
          requestAnimationFrame(syncWidth);
          setInterval(()=>{
            const nextIndex=(wordIndex+1)%words.length;
            const nextWord=words[nextIndex];
            rotatingEl.classList.add('exit');
            setTimeout(()=>{
              sizerEl.textContent=nextWord;
              const targetW=sizerEl.getBoundingClientRect().width;
              wrapEl.style.width=targetW+'px';
              rotatingEl.textContent=nextWord;
              rotatingEl.classList.remove('exit');
              rotatingEl.classList.add('enter');
              wordIndex=nextIndex;
              requestAnimationFrame(()=>requestAnimationFrame(()=>{ rotatingEl.classList.remove('enter'); }));
            },460);
          },2500);
        }

        /* ── TRUST STRIP ─────────────────────────────────────── */
        (function(){
          const rail=document.getElementById('trust-rail');
          const orig=document.getElementById('trust-set-original');
          const SPEED=0.55;
          function setup(){
            const setW=orig.getBoundingClientRect().width;
            if(!setW){requestAnimationFrame(setup);return;}
            const needed=Math.ceil((window.innerWidth*2)/setW)+2;
            for(let i=0;i<needed;i++){
              const c=orig.cloneNode(true);
              c.removeAttribute('id');
              c.setAttribute('aria-hidden','true');
              rail.appendChild(c);
            }
            const loopAt=orig.getBoundingClientRect().width;
            let offset=0;
            function tick(){
              offset+=SPEED;
              if(offset>=loopAt) offset-=loopAt;
              rail.style.transform='translateX('+(-offset)+'px)';
              requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(setup);
        })();

        /* ── REVEAL ON SCROLL ────────────────────────────────── */
        const obs=new IntersectionObserver(entries=>entries.forEach(e=>{
          if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}
        }),{threshold:0.1,rootMargin:'0px 0px -60px 0px'});
        document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

        /* ── FORMSPREE ───────────────────────────────────────── */
        const form=document.getElementById('contact-form');
        const submitBtn=document.getElementById('submit-btn');
        const formActive=document.getElementById('form-active-state');
        const formSuccess=document.getElementById('form-success-state');
        const backBtn=document.getElementById('back-to-form');

        form.addEventListener('submit',async e=>{
          e.preventDefault();
          submitBtn.disabled=true;
          submitBtn.childNodes[0].nodeValue='Sending… ';
          try{
            const res=await fetch('https://formspree.io/f/mreoyqyk',{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
            if(res.ok){formActive.style.display='none';formSuccess.classList.add('show');}
            else{submitBtn.childNodes[0].nodeValue='Try again ';submitBtn.disabled=false;}
          }catch{submitBtn.childNodes[0].nodeValue='Try again ';submitBtn.disabled=false;}
        });

        backBtn.addEventListener('click',()=>{
          form.reset();
          submitBtn.disabled=false;
          submitBtn.childNodes[0].nodeValue='Send message ';
          formSuccess.classList.remove('show');
          formActive.style.display='';
        });

        /* ── GOOGLE CALENDAR ─────────────────────────────────── */
        window.addEventListener('load',()=>{
          if(window.calendar&&calendar.schedulingButton){
            calendar.schedulingButton.load({
              url:'https://calendar.google.com/calendar/appointments/schedules/AcZssZ073Z53UW6tsOxk6JBQULEQ5VrbtxZu3EsaON0k2fEiTY1_zFsxWPBVbZF1VoZXcN9bdGmm6XKe?gv=true',
              color:'#ffffff',label:'Book a call',
              target:document.getElementById('gcal-btn-wrapper'),
            });
          }
        });
      `}</Script>
    </>
  )
}
