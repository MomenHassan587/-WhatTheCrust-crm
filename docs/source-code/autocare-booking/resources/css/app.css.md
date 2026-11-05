# resources/css/app.css

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/css/app.css` · 433 سطر.

**وظيفة الملف:** ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../autocare-booking/resources/css/app.css). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```css
:root {
    --primary: #256f63;
    --primary-dark: #0d3f37;
    --primary-deep: #062d27;
    --cream: #f7f2e8;
    --cream-strong: #f1dcc0;
    --surface: #ffffff;
    --text: #171817;
    --muted: #68706b;
    --line: #e5ddd0;
    --success: #1e8f5d;
    --error: #c24343;
    --shadow: 0 24px 70px rgba(7, 38, 33, 0.15);
    --radius-xl: 30px;
    --radius-lg: 22px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html { scroll-behavior: smooth; }

body {
    overflow-x: hidden;
    color: var(--text);
    background: var(--cream);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button { color: inherit; }

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
    outline: 3px solid #f2bd68;
    outline-offset: 3px;
}

.container {
    width: min(1180px, calc(100% - 40px));
    margin-inline: auto;
}

.navbar {
    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    color: #fffdf7;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease;
}

.navbar.is-scrolled {
    background: rgba(8, 47, 40, 0.9);
    border-color: rgba(255, 255, 255, 0.13);
    box-shadow: 0 14px 36px rgba(5, 28, 24, 0.16);
    backdrop-filter: blur(20px) saturate(1.25);
}

.nav-content {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand { display: inline-flex; align-items: center; gap: 12px; }

.brand-icon {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    color: var(--primary-dark);
    background: #f5ead8;
    border-radius: 15px;
    font-weight: 900;
    box-shadow: 0 12px 30px rgba(4, 26, 22, 0.22);
}

.brand strong { display: block; font-size: 20px; letter-spacing: -0.04em; }
.brand small { display: block; margin-top: 2px; color: rgba(255, 253, 247, 0.66); font-size: 12px; }

.nav-links { display: flex; align-items: center; gap: 6px; }
.nav-links a { padding: 11px 16px; color: rgba(255, 253, 247, 0.76); border-radius: 999px; font-size: 14px; font-weight: 800; }
.nav-links a:hover { color: #fffdf7; background: rgba(255, 255, 255, 0.12); }

.menu-btn {
    display: none;
    width: 46px;
    height: 46px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 14px;
    cursor: pointer;
}

.menu-btn span { display: block; width: 19px; height: 2px; margin: 4px auto; background: #fff; border-radius: 99px; }

.story {
    position: relative;
    z-index: 1;
    height: var(--story-height, 800vh);
    color: #fffdf7;
    background: var(--primary-deep);
}

.story-stage {
    position: sticky;
    top: 0;
    z-index: 2;
    height: 100svh;
    min-height: 620px;
    overflow: hidden;
}

.story-canvas-shell {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: var(--primary-deep) center / cover no-repeat;
    transform-origin: center;
    transition: opacity 0.12s linear;
    pointer-events: none;
}

.story-canvas { display: block; width: 100%; height: 100%; }

/* The 2D canvas is intentionally opaque for fast compositing. Hide it when
   the static fallback is active so it cannot cover the poster underneath. */
.story-canvas-shell.is-fallback .story-canvas { display: none; }

.story-canvas-tint {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(90deg, rgba(3, 28, 24, 0.96) 0%, rgba(5, 38, 32, 0.78) 34%, rgba(5, 39, 33, 0.34) 64%, rgba(3, 25, 21, 0.14) 100%),
        linear-gradient(0deg, rgba(3, 28, 24, 0.58), transparent 45%, rgba(3, 28, 24, 0.26));
    transition: opacity 0.3s ease;
}

.story-loader {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 12px;
    color: #fffdf7;
    background: radial-gradient(circle at 50% 45%, #165f53 0%, var(--primary-deep) 58%);
    transition: opacity 0.45s ease;
}

.story-canvas-shell.is-ready .story-loader { opacity: 0; visibility: hidden; }

.story-loader-mark {
    width: 62px;
    height: 62px;
    display: grid;
    place-items: center;
    color: var(--primary-dark);
    background: var(--cream-strong);
    border-radius: 20px;
    font-size: 24px;
    font-weight: 950;
}

.story-loader span { color: rgba(255, 255, 255, 0.7); font-size: 13px; font-weight: 800; letter-spacing: 0.04em; }
.story-loader strong { color: var(--cream-strong); font-variant-numeric: tabular-nums; }
.story-loader-track { width: 220px; height: 4px; overflow: hidden; background: rgba(255, 255, 255, 0.12); border-radius: 99px; }
.story-loader-track i { display: block; height: 100%; background: var(--cream-strong); border-radius: inherit; transition: width 0.2s ease; }

.story-panel {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    align-items: center;
    padding: 100px 0 48px;
    will-change: opacity, transform;
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    padding: 8px 13px;
    color: var(--cream-strong);
    background: rgba(245, 234, 216, 0.1);
    border: 1px solid rgba(245, 234, 216, 0.24);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 850;
    letter-spacing: 0.02em;
}

.hero-story-content { display: grid; justify-items: start; }
.story-warning { margin-bottom: 14px; color: #f3c879; font-size: clamp(16px, 1.4vw, 20px); font-weight: 850; }
.story-eyebrow { margin-bottom: 22px; }

.hero-beat h1 {
    max-width: 800px;
    font-size: clamp(54px, 7vw, 98px);
    line-height: 0.91;
    letter-spacing: -0.07em;
    text-wrap: balance;
    text-shadow: 0 18px 55px rgba(0, 18, 15, 0.32);
}

.hero-beat h1 span { display: block; color: #ead1ae; }
.hero-description { max-width: 590px; margin: 25px 0 30px; color: rgba(255, 253, 247, 0.78); font-size: 18px; line-height: 1.7; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }

.btn {
    min-height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    border: none;
    border-radius: 999px;
    font-weight: 900;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover { transform: translateY(-2px); }
.btn-primary { color: var(--primary-dark); background: var(--cream-strong); box-shadow: 0 18px 42px rgba(4, 27, 23, 0.32); }
.btn-primary:hover { background: #fff0dc; box-shadow: 0 22px 50px rgba(4, 27, 23, 0.4); }
.btn-secondary { color: #fffdf7; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(12px); }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.14); }

.story-scroll-cue {
    position: absolute;
    left: 50%;
    bottom: 26px;
    display: flex;
    align-items: center;
    gap: 9px;
    color: rgba(255, 253, 247, 0.6);
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transform: translateX(-50%);
}

.story-scroll-cue span { position: relative; width: 18px; height: 29px; border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 99px; }
.story-scroll-cue span::after { content: ""; position: absolute; top: 6px; left: 50%; width: 3px; height: 6px; background: var(--cream-strong); border-radius: 99px; animation: scroll-cue 1.8s ease-in-out infinite; }

.whip-beat { place-items: center; text-align: center; }
.whip-beat p { max-width: 900px; padding: 20px; font-size: clamp(44px, 7.5vw, 104px); font-weight: 950; line-height: 0.92; letter-spacing: -0.065em; text-shadow: 0 20px 70px rgba(0, 15, 12, 0.46); }

.beat-surface,
.diagnosis-panel,
.finale-card {
    background: linear-gradient(145deg, rgba(13, 63, 55, 0.84), rgba(5, 37, 32, 0.72));
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 30px 90px rgba(1, 20, 16, 0.42);
    backdrop-filter: blur(22px) saturate(1.12);
}

.beat-surface { padding: clamp(22px, 3vw, 38px); border-radius: var(--radius-xl); }
.beat-heading { max-width: 680px; margin: 0 auto 22px; text-align: center; }
.beat-heading .eyebrow { margin: 0 auto 12px; }
.beat-heading h2 { font-size: clamp(32px, 4vw, 52px); line-height: 0.98; letter-spacing: -0.055em; }
.beat-heading > p:last-child { margin-top: 10px; color: rgba(255, 253, 247, 0.66); line-height: 1.5; }
.beat-heading.align-left { margin: 0; text-align: left; }
.beat-heading.align-left .eyebrow { margin-inline: 0; }

.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.service-card { display: grid; grid-template-columns: auto 1fr; gap: 10px 13px; padding: 15px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px; }
.service-icon { width: 42px; height: 42px; display: grid; place-items: center; background: rgba(247, 242, 232, 0.12); border-radius: 13px; font-size: 20px; }
.service-copy h3 { font-size: 17px; letter-spacing: -0.025em; }
.service-copy p { margin-top: 4px; color: rgba(255, 253, 247, 0.6); font-size: 12px; line-height: 1.4; }
.service-footer { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; }
.service-footer strong { color: #f3c879; }
.service-footer span { color: rgba(255, 253, 247, 0.56); font-weight: 800; }

.process-surface { display: grid; grid-template-columns: 0.78fr 1.22fr; align-items: center; gap: clamp(28px, 5vw, 65px); }
.steps { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.step { display: grid; grid-template-columns: auto 1fr; gap: 13px; padding: 17px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px; transition: opacity 0.15s linear, transform 0.15s linear; }
.step > span { width: 42px; height: 42px; display: grid; place-items: center; color: var(--primary-dark); background: var(--cream-strong); border-radius: 13px; font-size: 12px; font-weight: 950; }
.step h3 { font-size: 16px; }
.step p { margin-top: 5px; color: rgba(255, 253, 247, 0.62); font-size: 12px; line-height: 1.45; }

.diagnosis-layout { display: grid; grid-template-columns: minmax(320px, 440px) 1fr; }
.diagnosis-panel { width: min(440px, 100%); padding: 25px; border-radius: 28px; }
.diagnosis-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.diagnosis-header h2 { margin-top: 7px; font-size: clamp(24px, 2.2vw, 32px); line-height: 1; letter-spacing: -0.045em; }
.diagnosis-kicker { display: inline-flex; align-items: center; gap: 8px; color: rgba(255, 253, 247, 0.65); font-size: 11px; font-weight: 850; letter-spacing: 0.1em; text-transform: uppercase; }
.diagnosis-kicker i, .diagnosis-pulse { width: 8px; height: 8px; background: #65dda1; border-radius: 50%; box-shadow: 0 0 0 6px rgba(101, 221, 161, 0.12); }
.diagnosis-pulse { width: 11px; height: 11px; animation: diagnosis-pulse 1.8s ease-out infinite; }
.diagnosis-list { display: grid; gap: 10px; }
.diagnosis-card { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 9px 16px; padding: 13px 14px; background: rgba(255, 255, 255, 0.075); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
.diagnosis-card-copy { display: flex; align-items: center; gap: 11px; }
.diagnosis-card-copy strong, .diagnosis-card-copy small { display: block; }
.diagnosis-card-copy strong { font-size: 14px; }
.diagnosis-card-copy small { margin-top: 2px; color: rgba(255, 253, 247, 0.56); font-size: 11px; }
.diagnosis-dot { width: 9px; height: 9px; flex: 0 0 auto; background: var(--status-color); border-radius: 50%; box-shadow: 0 0 0 5px color-mix(in srgb, var(--status-color) 18%, transparent); }
.status-green { --status-color: #65dda1; }
.status-amber { --status-color: #f2bd68; }
.status-red { --status-color: #ff7d72; }
.diagnosis-value { color: var(--status-color); font-size: 15px; font-weight: 950; font-variant-numeric: tabular-nums; }
.diagnosis-track { grid-column: 1 / -1; height: 3px; overflow: hidden; background: rgba(255, 255, 255, 0.1); border-radius: 99px; }
.diagnosis-track span { display: block; height: 100%; background: var(--status-color); border-radius: inherit; transition: width 0.12s linear; }
.diagnosis-button { width: 100%; min-height: 48px; margin-top: 16px; color: var(--primary-dark); background: var(--cream-strong); }

.finale-beat { place-items: center; }
.finale-card { width: min(650px, calc(100% - 40px)); padding: 42px; border-radius: var(--radius-xl); text-align: center; }
.finale-card .eyebrow { margin: 0 auto 16px; }
.finale-card h2 { font-size: clamp(40px, 5vw, 68px); line-height: 0.95; letter-spacing: -0.06em; }
.finale-card > p:not(.eyebrow) { margin: 18px auto 25px; color: rgba(255, 253, 247, 0.68); line-height: 1.6; }

.page-content { position: relative; z-index: 4; background: var(--cream); }
.section { padding: 110px 0; }
.booking-section { background: radial-gradient(circle at 12% 15%, rgba(37, 111, 99, 0.11), transparent 34%), var(--cream); }
.booking-grid { display: grid; grid-template-columns: 0.82fr 1.18fr; align-items: start; gap: 50px; }
.booking-info .eyebrow { color: var(--primary); background: rgba(37, 111, 99, 0.08); border-color: rgba(37, 111, 99, 0.15); }
.booking-info h2 { margin: 18px 0 20px; font-size: clamp(38px, 5vw, 58px); line-height: 0.98; letter-spacing: -0.06em; }
.booking-info > p { color: var(--muted); line-height: 1.8; }
.info-box { margin-top: 28px; padding: 24px; color: #fff; background: var(--primary-dark); border-radius: var(--radius-lg); box-shadow: var(--shadow); }
.info-box strong, .info-box span { display: block; }
.info-box span { margin-top: 8px; color: rgba(255, 255, 255, 0.72); line-height: 1.65; }

.booking-form { padding: 28px; background: rgba(255, 255, 255, 0.9); border: 1px solid var(--line); border-radius: var(--radius-xl); box-shadow: var(--shadow); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 900; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 15px 16px; color: var(--text); background: #fbfaf7; border: 1px solid var(--line); border-radius: 15px; outline: none; transition: border 0.2s ease, box-shadow 0.2s ease; }
.form-group textarea { resize: vertical; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { background: #fff; border-color: rgba(37, 111, 99, 0.52); box-shadow: 0 0 0 5px rgba(37, 111, 99, 0.08); }
.alert { margin-bottom: 18px; padding: 14px 16px; border-radius: 15px; font-size: 14px; font-weight: 800; }
.alert-error { color: var(--error); background: rgba(194, 67, 67, 0.1); border: 1px solid rgba(194, 67, 67, 0.18); }
.alert-success { color: var(--success); background: rgba(30, 143, 93, 0.1); border: 1px solid rgba(30, 143, 93, 0.18); }
.form-btn { width: 100%; color: #fff; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }

.footer { position: relative; z-index: 4; padding: 34px 0; background: #fffdfa; border-top: 1px solid var(--line); }
.footer-content { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.footer strong { font-size: 18px; }
.footer p { margin-top: 4px; color: var(--muted); }
.footer-links { display: flex; flex-wrap: wrap; gap: 10px; }
.footer-links a { padding: 10px 12px; color: var(--muted); border-radius: 999px; font-size: 14px; font-weight: 800; }
.footer-links a:hover { color: var(--primary); background: var(--cream); }

.story.is-fallback { height: auto !important; }
.story.is-fallback .story-stage { position: relative; height: auto; min-height: 0; overflow: visible; padding-top: 70px; }
.story.is-fallback .story-panel { position: relative; min-height: 100svh; padding-block: 100px 60px; visibility: visible !important; pointer-events: auto !important; }
.story.is-fallback .whip-beat { display: none; }
.story.is-fallback .story-canvas-shell { position: fixed; }
.story.is-fallback .story-scroll-cue { display: none; }
.story.is-fallback .step { opacity: 1 !important; transform: none !important; }

@keyframes scroll-cue {
    0%, 100% { opacity: 0.3; transform: translate(-50%, 0); }
    50% { opacity: 1; transform: translate(-50%, 7px); }
}

@keyframes diagnosis-pulse {
    0% { box-shadow: 0 0 0 0 rgba(101, 221, 161, 0.4); }
    70% { box-shadow: 0 0 0 12px rgba(101, 221, 161, 0); }
    100% { box-shadow: 0 0 0 0 rgba(101, 221, 161, 0); }
}

@media (max-width: 920px) {
    .menu-btn { display: block; }
    .nav-links { position: absolute; top: 82px; left: 20px; right: 20px; display: none; flex-direction: column; align-items: stretch; padding: 12px; background: rgba(8, 47, 40, 0.97); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 22px; box-shadow: var(--shadow); }
    .nav-links.active { display: flex; }
    .nav-links a { text-align: center; }
    .hero-beat h1 { font-size: clamp(52px, 9vw, 76px); }
    .process-surface { grid-template-columns: 1fr; gap: 24px; }
    .beat-heading.align-left { max-width: 700px; text-align: center; margin-inline: auto; }
    .beat-heading.align-left .eyebrow { margin-inline: auto; }
    .booking-grid { grid-template-columns: 1fr; }
}

@media (max-width: 767px) {
    .container { width: min(100% - 28px, 1180px); }
    .nav-content { height: 74px; }
    .brand-icon { width: 42px; height: 42px; }
    .nav-links { top: 74px; left: 14px; right: 14px; }
    .story-stage { min-height: 680px; }
    .story-panel { padding: 92px 0 40px; }
    .hero-beat { align-items: start; }
    .hero-story-content { padding-top: 6svh; }
    .story-warning { font-size: 15px; }
    .hero-beat h1 { font-size: clamp(44px, 13vw, 64px); }
    .hero-description { font-size: 16px; line-height: 1.6; }
    .hero-actions { width: 100%; flex-direction: column; }
    .hero-actions .btn { width: 100%; }
    .story-scroll-cue { display: none; }
    .whip-beat p { font-size: clamp(46px, 15vw, 72px); }
    .beat-surface { width: calc(100% - 20px); padding: 20px; border-radius: 24px; }
    .beat-heading { margin-bottom: 18px; }
    .beat-heading h2 { font-size: clamp(31px, 9vw, 43px); }
    .beat-heading > p:last-child { font-size: 13px; }
    .services-surface { overflow: hidden; }
    .services-grid { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 8px; }
    .services-grid::-webkit-scrollbar { display: none; }
    .service-card { min-width: min(78vw, 300px); scroll-snap-align: center; }
    .steps { grid-template-columns: 1fr; max-height: 55svh; overflow-y: auto; }
    .step { padding: 13px; }
    .diagnosis-layout { grid-template-columns: 1fr; align-items: end; }
    .diagnosis-panel { width: 100%; padding: 20px; border-radius: 24px; }
    .diagnosis-card-copy small { display: none; }
    .finale-card { padding: 28px 22px; }
    .finale-card h2 { font-size: clamp(40px, 12vw, 56px); }
    .section { padding: 80px 0; }
    .form-row { grid-template-columns: 1fr; gap: 0; }
    .booking-form { padding: 20px; border-radius: 24px; }
    .footer-content { flex-direction: column; text-align: center; }
    .story.is-fallback .story-panel { min-height: auto; padding-block: 90px 50px; }
    .story.is-fallback .hero-beat { min-height: 100svh; }
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```css
:root {
    --primary: #256f63;
    --primary-dark: #0d3f37;
    --primary-deep: #062d27;
    --cream: #f7f2e8;
    --cream-strong: #f1dcc0;
    --surface: #ffffff;
    --text: #171817;
```

**السطر 1:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 2:** `--primary`: ضبط الخاصية المسماة كما في CSS بالقيمة `#256f63`. القيم هنا تنسيق، مش function JavaScript.

**السطر 3:** `--primary-dark`: ضبط الخاصية المسماة كما في CSS بالقيمة `#0d3f37`. القيم هنا تنسيق، مش function JavaScript.

**السطر 4:** `--primary-deep`: ضبط الخاصية المسماة كما في CSS بالقيمة `#062d27`. القيم هنا تنسيق، مش function JavaScript.

**السطر 5:** `--cream`: ضبط الخاصية المسماة كما في CSS بالقيمة `#f7f2e8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 6:** `--cream-strong`: ضبط الخاصية المسماة كما في CSS بالقيمة `#f1dcc0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 7:** `--surface`: ضبط الخاصية المسماة كما في CSS بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 8:** `--text`: ضبط الخاصية المسماة كما في CSS بالقيمة `#171817`. القيم هنا تنسيق، مش function JavaScript.

### السطور 9–16

```css
    --muted: #68706b;
    --line: #e5ddd0;
    --success: #1e8f5d;
    --error: #c24343;
    --shadow: 0 24px 70px rgba(7, 38, 33, 0.15);
    --radius-xl: 30px;
    --radius-lg: 22px;
}
```

**السطر 9:** `--muted`: ضبط الخاصية المسماة كما في CSS بالقيمة `#68706b`. القيم هنا تنسيق، مش function JavaScript.

**السطر 10:** `--line`: ضبط الخاصية المسماة كما في CSS بالقيمة `#e5ddd0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 11:** `--success`: ضبط الخاصية المسماة كما في CSS بالقيمة `#1e8f5d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 12:** `--error`: ضبط الخاصية المسماة كما في CSS بالقيمة `#c24343`. القيم هنا تنسيق، مش function JavaScript.

**السطر 13:** `--shadow`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 24px 70px rgba(7, 38, 33, 0.15)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 14:** `--radius-xl`: ضبط الخاصية المسماة كما في CSS بالقيمة `30px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 15:** `--radius-lg`: ضبط الخاصية المسماة كما في CSS بالقيمة `22px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```css

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html { scroll-behavior: smooth; }
```

**السطر 18:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 19:** `box-sizing`: ضبط الخاصية المسماة كما في CSS بالقيمة `border-box`. القيم هنا تنسيق، مش function JavaScript.

**السطر 20:** `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 21:** `padding`: مسافة داخلية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** `scroll-behavior`: ضبط الخاصية المسماة كما في CSS بالقيمة `smooth`. القيم هنا تنسيق، مش function JavaScript.

### السطور 25–32

```css

body {
    overflow-x: hidden;
    color: var(--text);
    background: var(--cream);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

```

**السطر 26:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 27:** `overflow-x`: ضبط الخاصية المسماة كما في CSS بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 28:** `color`: لون النص بالقيمة `var(--text)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 29:** `background`: خلفية العنصر بالقيمة `var(--cream)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 30:** `font-family`: ضبط الخاصية المسماة كما في CSS بالقيمة `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. القيم هنا تنسيق، مش function JavaScript.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```css
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button { color: inherit; }

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
```

**السطر 33:** `color`: لون النص بالقيمة `inherit`؛ `text-decoration`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 34:** `font`: ضبط الخاصية المسماة كما في CSS بالقيمة `inherit`. القيم هنا تنسيق، مش function JavaScript.

**السطر 35:** `color`: لون النص بالقيمة `inherit`. القيم هنا تنسيق، مش function JavaScript.

**السطر 37:** `button`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible,`. القيم هنا تنسيق، مش function JavaScript.

**السطر 38:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible,`. القيم هنا تنسيق، مش function JavaScript.

**السطر 39:** `input`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible,`. القيم هنا تنسيق، مش function JavaScript.

**السطر 40:** `select`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible,`. القيم هنا تنسيق، مش function JavaScript.

### السطور 41–48

```css
textarea:focus-visible {
    outline: 3px solid #f2bd68;
    outline-offset: 3px;
}

.container {
    width: min(1180px, calc(100% - 40px));
    margin-inline: auto;
```

**السطر 41:** `textarea`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible`. القيم هنا تنسيق، مش function JavaScript.

**السطر 42:** `outline`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px solid #f2bd68`. القيم هنا تنسيق، مش function JavaScript.

**السطر 43:** `outline-offset`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 47:** `width`: العرض بالقيمة `min(1180px, calc(100% - 40px))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 48:** `margin-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

### السطور 49–56

```css
}

.navbar {
    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    color: #fffdf7;
    background: transparent;
```

**السطر 49:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 51:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 52:** `position`: نوع تموضع العنصر بالقيمة `fixed`. القيم هنا تنسيق، مش function JavaScript.

**السطر 53:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 0 auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 54:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `50`. القيم هنا تنسيق، مش function JavaScript.

**السطر 55:** `color`: لون النص بالقيمة `#fffdf7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 56:** `background`: خلفية العنصر بالقيمة `transparent`. القيم هنا تنسيق، مش function JavaScript.

### السطور 57–64

```css
    border-bottom: 1px solid transparent;
    transition: background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease;
}

.navbar.is-scrolled {
    background: rgba(8, 47, 40, 0.9);
    border-color: rgba(255, 255, 255, 0.13);
    box-shadow: 0 14px 36px rgba(5, 28, 24, 0.16);
```

**السطر 57:** `border-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid transparent`. القيم هنا تنسيق، مش function JavaScript.

**السطر 58:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 59:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 61:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 62:** `background`: خلفية العنصر بالقيمة `rgba(8, 47, 40, 0.9)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 63:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(255, 255, 255, 0.13)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 64:** `box-shadow`: ظل العنصر بالقيمة `0 14px 36px rgba(5, 28, 24, 0.16)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 65–72

```css
    backdrop-filter: blur(20px) saturate(1.25);
}

.nav-content {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
```

**السطر 65:** `backdrop-filter`: تأثير على المشهد خلف العنصر بالقيمة `blur(20px) saturate(1.25)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 66:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 69:** `height`: الارتفاع بالقيمة `82px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 70:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 71:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 72:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`. القيم هنا تنسيق، مش function JavaScript.

### السطور 73–80

```css
}

.brand { display: inline-flex; align-items: center; gap: 12px; }

.brand-icon {
    width: 46px;
    height: 46px;
    display: grid;
```

**السطر 73:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 75:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 77:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 78:** `width`: العرض بالقيمة `46px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 79:** `height`: الارتفاع بالقيمة `46px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 80:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

### السطور 81–88

```css
    place-items: center;
    color: var(--primary-dark);
    background: #f5ead8;
    border-radius: 15px;
    font-weight: 900;
    box-shadow: 0 12px 30px rgba(4, 26, 22, 0.22);
}

```

**السطر 81:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 82:** `color`: لون النص بالقيمة `var(--primary-dark)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 83:** `background`: خلفية العنصر بالقيمة `#f5ead8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 84:** `border-radius`: تدوير الحواف بالقيمة `15px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 85:** `font-weight`: وزن الخط بالقيمة `900`. القيم هنا تنسيق، مش function JavaScript.

**السطر 86:** `box-shadow`: ظل العنصر بالقيمة `0 12px 30px rgba(4, 26, 22, 0.22)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 87:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 89–96

```css
.brand strong { display: block; font-size: 20px; letter-spacing: -0.04em; }
.brand small { display: block; margin-top: 2px; color: rgba(255, 253, 247, 0.66); font-size: 12px; }

.nav-links { display: flex; align-items: center; gap: 6px; }
.nav-links a { padding: 11px 16px; color: rgba(255, 253, 247, 0.76); border-radius: 999px; font-size: 14px; font-weight: 800; }
.nav-links a:hover { color: #fffdf7; background: rgba(255, 255, 255, 0.12); }

.menu-btn {
```

**السطر 89:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `20px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.04em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 90:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `2px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.66)`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 92:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `6px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 93:** `padding`: مسافة داخلية بالقيمة `11px 16px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.76)`؛ `border-radius`: تدوير الحواف بالقيمة `999px`؛ `font-size`: حجم الخط بالقيمة `14px`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 94:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `color`: لون النص بالقيمة `#fffdf7`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 96:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 97–104

```css
    display: none;
    width: 46px;
    height: 46px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 14px;
    cursor: pointer;
}
```

**السطر 97:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 98:** `width`: العرض بالقيمة `46px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 99:** `height`: الارتفاع بالقيمة `46px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 100:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 101:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.18)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 102:** `border-radius`: تدوير الحواف بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 103:** `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`. القيم هنا تنسيق، مش function JavaScript.

**السطر 104:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 105–112

```css

.menu-btn span { display: block; width: 19px; height: 2px; margin: 4px auto; background: #fff; border-radius: 99px; }

.story {
    position: relative;
    z-index: 1;
    height: var(--story-height, 800vh);
    color: #fffdf7;
```

**السطر 106:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `width`: العرض بالقيمة `19px`؛ `height`: الارتفاع بالقيمة `2px`؛ `margin`: مسافة خارجية بالقيمة `4px auto`؛ `background`: خلفية العنصر بالقيمة `#fff`؛ `border-radius`: تدوير الحواف بالقيمة `99px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 108:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 109:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 110:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 111:** `height`: الارتفاع بالقيمة `var(--story-height, 800vh)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 112:** `color`: لون النص بالقيمة `#fffdf7`. القيم هنا تنسيق، مش function JavaScript.

### السطور 113–120

```css
    background: var(--primary-deep);
}

.story-stage {
    position: sticky;
    top: 0;
    z-index: 2;
    height: 100svh;
```

**السطر 113:** `background`: خلفية العنصر بالقيمة `var(--primary-deep)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 114:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 116:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 117:** `position`: نوع تموضع العنصر بالقيمة `sticky`. القيم هنا تنسيق، مش function JavaScript.

**السطر 118:** `top`: المسافة من أعلى بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 119:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 120:** `height`: الارتفاع بالقيمة `100svh`. القيم هنا تنسيق، مش function JavaScript.

### السطور 121–128

```css
    min-height: 620px;
    overflow: hidden;
}

.story-canvas-shell {
    position: fixed;
    inset: 0;
    z-index: 0;
```

**السطر 121:** `min-height`: أقل ارتفاع بالقيمة `620px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 122:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 123:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 125:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 126:** `position`: نوع تموضع العنصر بالقيمة `fixed`. القيم هنا تنسيق، مش function JavaScript.

**السطر 127:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 128:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 129–136

```css
    overflow: hidden;
    background: var(--primary-deep) center / cover no-repeat;
    transform-origin: center;
    transition: opacity 0.12s linear;
    pointer-events: none;
}

.story-canvas { display: block; width: 100%; height: 100%; }
```

**السطر 129:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 130:** `background`: خلفية العنصر بالقيمة `var(--primary-deep) center / cover no-repeat`. القيم هنا تنسيق، مش function JavaScript.

**السطر 131:** `transform-origin`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 132:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `opacity 0.12s linear`. القيم هنا تنسيق، مش function JavaScript.

**السطر 133:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 134:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 136:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `width`: العرض بالقيمة `100%`؛ `height`: الارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 137–144

```css

/* The 2D canvas is intentionally opaque for fast compositing. Hide it when
   the static fallback is active so it cannot cover the poster underneath. */
.story-canvas-shell.is-fallback .story-canvas { display: none; }

.story-canvas-tint {
    position: absolute;
    inset: 0;
```

**السطر 138:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 139:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 140:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 142:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 143:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 144:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 145–152

```css
    background:
        linear-gradient(90deg, rgba(3, 28, 24, 0.96) 0%, rgba(5, 38, 32, 0.78) 34%, rgba(5, 39, 33, 0.34) 64%, rgba(3, 25, 21, 0.14) 100%),
        linear-gradient(0deg, rgba(3, 28, 24, 0.58), transparent 45%, rgba(3, 28, 24, 0.26));
    transition: opacity 0.3s ease;
}

.story-loader {
    position: absolute;
```

**السطر 145:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 146:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 147:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 148:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `opacity 0.3s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 149:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 151:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 152:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

### السطور 153–160

```css
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 12px;
    color: #fffdf7;
    background: radial-gradient(circle at 50% 45%, #165f53 0%, var(--primary-deep) 58%);
    transition: opacity 0.45s ease;
```

**السطر 153:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 154:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 155:** `place-content`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 156:** `justify-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 157:** `gap`: مسافة بين عناصر layout بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 158:** `color`: لون النص بالقيمة `#fffdf7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 159:** `background`: خلفية العنصر بالقيمة `radial-gradient(circle at 50% 45%, #165f53 0%, var(--primary-deep) 58%)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 160:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `opacity 0.45s ease`. القيم هنا تنسيق، مش function JavaScript.

### السطور 161–168

```css
}

.story-canvas-shell.is-ready .story-loader { opacity: 0; visibility: hidden; }

.story-loader-mark {
    width: 62px;
    height: 62px;
    display: grid;
```

**السطر 161:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 163:** `opacity`: شفافية العنصر بالقيمة `0`؛ `visibility`: إظهار/إخفاء بصري مع أثر على التركيز بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 165:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 166:** `width`: العرض بالقيمة `62px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 167:** `height`: الارتفاع بالقيمة `62px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 168:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

### السطور 169–176

```css
    place-items: center;
    color: var(--primary-dark);
    background: var(--cream-strong);
    border-radius: 20px;
    font-size: 24px;
    font-weight: 950;
}

```

**السطر 169:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 170:** `color`: لون النص بالقيمة `var(--primary-dark)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 171:** `background`: خلفية العنصر بالقيمة `var(--cream-strong)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 172:** `border-radius`: تدوير الحواف بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 173:** `font-size`: حجم الخط بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 174:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 175:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 177–184

```css
.story-loader span { color: rgba(255, 255, 255, 0.7); font-size: 13px; font-weight: 800; letter-spacing: 0.04em; }
.story-loader strong { color: var(--cream-strong); font-variant-numeric: tabular-nums; }
.story-loader-track { width: 220px; height: 4px; overflow: hidden; background: rgba(255, 255, 255, 0.12); border-radius: 99px; }
.story-loader-track i { display: block; height: 100%; background: var(--cream-strong); border-radius: inherit; transition: width 0.2s ease; }

.story-panel {
    position: absolute;
    inset: 0;
```

**السطر 177:** `color`: لون النص بالقيمة `rgba(255, 255, 255, 0.7)`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `font-weight`: وزن الخط بالقيمة `800`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.04em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 178:** `color`: لون النص بالقيمة `var(--cream-strong)`؛ `font-variant-numeric`: ضبط الخاصية المسماة كما في CSS بالقيمة `tabular-nums`. القيم هنا تنسيق، مش function JavaScript.

**السطر 179:** `width`: العرض بالقيمة `220px`؛ `height`: الارتفاع بالقيمة `4px`؛ `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.12)`؛ `border-radius`: تدوير الحواف بالقيمة `99px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 180:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `height`: الارتفاع بالقيمة `100%`؛ `background`: خلفية العنصر بالقيمة `var(--cream-strong)`؛ `border-radius`: تدوير الحواف بالقيمة `inherit`؛ `transition`: تنعيم تغيّر خصائص CSS بالقيمة `width 0.2s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 182:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 183:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 184:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 185–192

```css
    z-index: 2;
    display: grid;
    align-items: center;
    padding: 100px 0 48px;
    will-change: opacity, transform;
}

.eyebrow {
```

**السطر 185:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 186:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 187:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 188:** `padding`: مسافة داخلية بالقيمة `100px 0 48px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 189:** `will-change`: ضبط الخاصية المسماة كما في CSS بالقيمة `opacity, transform`. القيم هنا تنسيق، مش function JavaScript.

**السطر 190:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 192:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 193–200

```css
    display: inline-flex;
    align-items: center;
    width: fit-content;
    padding: 8px 13px;
    color: var(--cream-strong);
    background: rgba(245, 234, 216, 0.1);
    border: 1px solid rgba(245, 234, 216, 0.24);
    border-radius: 999px;
```

**السطر 193:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 194:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 195:** `width`: العرض بالقيمة `fit-content`. القيم هنا تنسيق، مش function JavaScript.

**السطر 196:** `padding`: مسافة داخلية بالقيمة `8px 13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 197:** `color`: لون النص بالقيمة `var(--cream-strong)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 198:** `background`: خلفية العنصر بالقيمة `rgba(245, 234, 216, 0.1)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 199:** `border`: حدود العنصر بالقيمة `1px solid rgba(245, 234, 216, 0.24)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 200:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 201–208

```css
    font-size: 12px;
    font-weight: 850;
    letter-spacing: 0.02em;
}

.hero-story-content { display: grid; justify-items: start; }
.story-warning { margin-bottom: 14px; color: #f3c879; font-size: clamp(16px, 1.4vw, 20px); font-weight: 850; }
.story-eyebrow { margin-bottom: 22px; }
```

**السطر 201:** `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 202:** `font-weight`: وزن الخط بالقيمة `850`. القيم هنا تنسيق، مش function JavaScript.

**السطر 203:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.02em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 204:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 206:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `justify-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `start`. القيم هنا تنسيق، مش function JavaScript.

**السطر 207:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `14px`؛ `color`: لون النص بالقيمة `#f3c879`؛ `font-size`: حجم الخط بالقيمة `clamp(16px, 1.4vw, 20px)`؛ `font-weight`: وزن الخط بالقيمة `850`. القيم هنا تنسيق، مش function JavaScript.

**السطر 208:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `22px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 209–216

```css

.hero-beat h1 {
    max-width: 800px;
    font-size: clamp(54px, 7vw, 98px);
    line-height: 0.91;
    letter-spacing: -0.07em;
    text-wrap: balance;
    text-shadow: 0 18px 55px rgba(0, 18, 15, 0.32);
```

**السطر 210:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 211:** `max-width`: أقصى عرض بالقيمة `800px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 212:** `font-size`: حجم الخط بالقيمة `clamp(54px, 7vw, 98px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 213:** `line-height`: ارتفاع سطر النص بالقيمة `0.91`. القيم هنا تنسيق، مش function JavaScript.

**السطر 214:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.07em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 215:** `text-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `balance`. القيم هنا تنسيق، مش function JavaScript.

**السطر 216:** `text-shadow`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 18px 55px rgba(0, 18, 15, 0.32)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 217–224

```css
}

.hero-beat h1 span { display: block; color: #ead1ae; }
.hero-description { max-width: 590px; margin: 25px 0 30px; color: rgba(255, 253, 247, 0.78); font-size: 18px; line-height: 1.7; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }

.btn {
    min-height: 52px;
```

**السطر 217:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 219:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `color`: لون النص بالقيمة `#ead1ae`. القيم هنا تنسيق، مش function JavaScript.

**السطر 220:** `max-width`: أقصى عرض بالقيمة `590px`؛ `margin`: مسافة خارجية بالقيمة `25px 0 30px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.78)`؛ `font-size`: حجم الخط بالقيمة `18px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 221:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`؛ `gap`: مسافة بين عناصر layout بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 223:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 224:** `min-height`: أقل ارتفاع بالقيمة `52px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 225–232

```css
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    border: none;
    border-radius: 999px;
    font-weight: 900;
    cursor: pointer;
```

**السطر 225:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 226:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 227:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 228:** `padding`: مسافة داخلية بالقيمة `0 24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 229:** `border`: حدود العنصر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 230:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 231:** `font-weight`: وزن الخط بالقيمة `900`. القيم هنا تنسيق، مش function JavaScript.

**السطر 232:** `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`. القيم هنا تنسيق، مش function JavaScript.

### السطور 233–240

```css
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover { transform: translateY(-2px); }
.btn-primary { color: var(--primary-dark); background: var(--cream-strong); box-shadow: 0 18px 42px rgba(4, 27, 23, 0.32); }
.btn-primary:hover { background: #fff0dc; box-shadow: 0 22px 50px rgba(4, 27, 23, 0.4); }
.btn-secondary { color: #fffdf7; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(12px); }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.14); }
```

**السطر 233:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 234:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 236:** `btn`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateY(-2px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 237:** `color`: لون النص بالقيمة `var(--primary-dark)`؛ `background`: خلفية العنصر بالقيمة `var(--cream-strong)`؛ `box-shadow`: ظل العنصر بالقيمة `0 18px 42px rgba(4, 27, 23, 0.32)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 238:** `btn-primary`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `background`: خلفية العنصر بالقيمة `#fff0dc`؛ `box-shadow`: ظل العنصر بالقيمة `0 22px 50px rgba(4, 27, 23, 0.4)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 239:** `color`: لون النص بالقيمة `#fffdf7`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.08)`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.3)`؛ `backdrop-filter`: تأثير على المشهد خلف العنصر بالقيمة `blur(12px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 240:** `btn-secondary`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.14)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 241–248

```css

.story-scroll-cue {
    position: absolute;
    left: 50%;
    bottom: 26px;
    display: flex;
    align-items: center;
    gap: 9px;
```

**السطر 242:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 243:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 244:** `left`: المسافة من الشمال بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 245:** `bottom`: المسافة من أسفل بالقيمة `26px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 246:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 247:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 248:** `gap`: مسافة بين عناصر layout بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 249–256

```css
    color: rgba(255, 253, 247, 0.6);
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transform: translateX(-50%);
}

```

**السطر 249:** `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.6)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 250:** `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 251:** `font-weight`: وزن الخط بالقيمة `850`. القيم هنا تنسيق، مش function JavaScript.

**السطر 252:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.12em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 253:** `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 254:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateX(-50%)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 255:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 257–264

```css
.story-scroll-cue span { position: relative; width: 18px; height: 29px; border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 99px; }
.story-scroll-cue span::after { content: ""; position: absolute; top: 6px; left: 50%; width: 3px; height: 6px; background: var(--cream-strong); border-radius: 99px; animation: scroll-cue 1.8s ease-in-out infinite; }

.whip-beat { place-items: center; text-align: center; }
.whip-beat p { max-width: 900px; padding: 20px; font-size: clamp(44px, 7.5vw, 104px); font-weight: 950; line-height: 0.92; letter-spacing: -0.065em; text-shadow: 0 20px 70px rgba(0, 15, 12, 0.46); }

.beat-surface,
.diagnosis-panel,
```

**السطر 257:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `width`: العرض بالقيمة `18px`؛ `height`: الارتفاع بالقيمة `29px`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.5)`؛ `border-radius`: تدوير الحواف بالقيمة `99px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 258:** `span`: ضبط الخاصية المسماة كما في CSS بالقيمة `:after`؛ `content`: ضبط الخاصية المسماة كما في CSS بالقيمة `""`؛ `position`: نوع تموضع العنصر بالقيمة `absolute`؛ `top`: المسافة من أعلى بالقيمة `6px`؛ `left`: المسافة من الشمال بالقيمة `50%`؛ `width`: العرض بالقيمة `3px`؛ `height`: الارتفاع بالقيمة `6px`؛ `background`: خلفية العنصر بالقيمة `var(--cream-strong)`؛ `border-radius`: تدوير الحواف بالقيمة `99px`؛ `animation`: ضبط الخاصية المسماة كما في CSS بالقيمة `scroll-cue 1.8s ease-in-out infinite`. القيم هنا تنسيق، مش function JavaScript.

**السطر 260:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 261:** `max-width`: أقصى عرض بالقيمة `900px`؛ `padding`: مسافة داخلية بالقيمة `20px`؛ `font-size`: حجم الخط بالقيمة `clamp(44px, 7.5vw, 104px)`؛ `font-weight`: وزن الخط بالقيمة `950`؛ `line-height`: ارتفاع سطر النص بالقيمة `0.92`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.065em`؛ `text-shadow`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 20px 70px rgba(0, 15, 12, 0.46)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 263:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 264:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 265–272

```css
.finale-card {
    background: linear-gradient(145deg, rgba(13, 63, 55, 0.84), rgba(5, 37, 32, 0.72));
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 30px 90px rgba(1, 20, 16, 0.42);
    backdrop-filter: blur(22px) saturate(1.12);
}

.beat-surface { padding: clamp(22px, 3vw, 38px); border-radius: var(--radius-xl); }
```

**السطر 265:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 266:** `background`: خلفية العنصر بالقيمة `linear-gradient(145deg, rgba(13, 63, 55, 0.84), rgba(5, 37, 32, 0.72))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 267:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.18)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 268:** `box-shadow`: ظل العنصر بالقيمة `0 30px 90px rgba(1, 20, 16, 0.42)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 269:** `backdrop-filter`: تأثير على المشهد خلف العنصر بالقيمة `blur(22px) saturate(1.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 270:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 272:** `padding`: مسافة داخلية بالقيمة `clamp(22px, 3vw, 38px)`؛ `border-radius`: تدوير الحواف بالقيمة `var(--radius-xl)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 273–280

```css
.beat-heading { max-width: 680px; margin: 0 auto 22px; text-align: center; }
.beat-heading .eyebrow { margin: 0 auto 12px; }
.beat-heading h2 { font-size: clamp(32px, 4vw, 52px); line-height: 0.98; letter-spacing: -0.055em; }
.beat-heading > p:last-child { margin-top: 10px; color: rgba(255, 253, 247, 0.66); line-height: 1.5; }
.beat-heading.align-left { margin: 0; text-align: left; }
.beat-heading.align-left .eyebrow { margin-inline: 0; }

.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
```

**السطر 273:** `max-width`: أقصى عرض بالقيمة `680px`؛ `margin`: مسافة خارجية بالقيمة `0 auto 22px`؛ `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 274:** `margin`: مسافة خارجية بالقيمة `0 auto 12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 275:** `font-size`: حجم الخط بالقيمة `clamp(32px, 4vw, 52px)`؛ `line-height`: ارتفاع سطر النص بالقيمة `0.98`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.055em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 276:** `p`: ضبط الخاصية المسماة كما في CSS بالقيمة `last-child`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `10px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.66)`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 277:** `margin`: مسافة خارجية بالقيمة `0`؛ `text-align`: محاذاة النص بالقيمة `left`. القيم هنا تنسيق، مش function JavaScript.

**السطر 278:** `margin-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 280:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(3, 1fr)`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 281–288

```css
.service-card { display: grid; grid-template-columns: auto 1fr; gap: 10px 13px; padding: 15px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px; }
.service-icon { width: 42px; height: 42px; display: grid; place-items: center; background: rgba(247, 242, 232, 0.12); border-radius: 13px; font-size: 20px; }
.service-copy h3 { font-size: 17px; letter-spacing: -0.025em; }
.service-copy p { margin-top: 4px; color: rgba(255, 253, 247, 0.6); font-size: 12px; line-height: 1.4; }
.service-footer { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; }
.service-footer strong { color: #f3c879; }
.service-footer span { color: rgba(255, 253, 247, 0.56); font-weight: 800; }

```

**السطر 281:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `auto 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px 13px`؛ `padding`: مسافة داخلية بالقيمة `15px`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.1)`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.12)`؛ `border-radius`: تدوير الحواف بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 282:** `width`: العرض بالقيمة `42px`؛ `height`: الارتفاع بالقيمة `42px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `background`: خلفية العنصر بالقيمة `rgba(247, 242, 232, 0.12)`؛ `border-radius`: تدوير الحواف بالقيمة `13px`؛ `font-size`: حجم الخط بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 283:** `font-size`: حجم الخط بالقيمة `17px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.025em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 284:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `4px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.6)`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.4`. القيم هنا تنسيق، مش function JavaScript.

**السطر 285:** `grid-column`: ضبط الخاصية المسماة كما في CSS بالقيمة `1 / -1`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `10px`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid rgba(255, 255, 255, 0.1)`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 286:** `color`: لون النص بالقيمة `#f3c879`. القيم هنا تنسيق، مش function JavaScript.

**السطر 287:** `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.56)`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

### السطور 289–296

```css
.process-surface { display: grid; grid-template-columns: 0.78fr 1.22fr; align-items: center; gap: clamp(28px, 5vw, 65px); }
.steps { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.step { display: grid; grid-template-columns: auto 1fr; gap: 13px; padding: 17px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px; transition: opacity 0.15s linear, transform 0.15s linear; }
.step > span { width: 42px; height: 42px; display: grid; place-items: center; color: var(--primary-dark); background: var(--cream-strong); border-radius: 13px; font-size: 12px; font-weight: 950; }
.step h3 { font-size: 16px; }
.step p { margin-top: 5px; color: rgba(255, 253, 247, 0.62); font-size: 12px; line-height: 1.45; }

.diagnosis-layout { display: grid; grid-template-columns: minmax(320px, 440px) 1fr; }
```

**السطر 289:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `0.78fr 1.22fr`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `clamp(28px, 5vw, 65px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 290:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 291:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `auto 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `13px`؛ `padding`: مسافة داخلية بالقيمة `17px`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.1)`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.12)`؛ `border-radius`: تدوير الحواف بالقيمة `18px`؛ `transition`: تنعيم تغيّر خصائص CSS بالقيمة `opacity 0.15s linear, transform 0.15s linear`. القيم هنا تنسيق، مش function JavaScript.

**السطر 292:** `width`: العرض بالقيمة `42px`؛ `height`: الارتفاع بالقيمة `42px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `color`: لون النص بالقيمة `var(--primary-dark)`؛ `background`: خلفية العنصر بالقيمة `var(--cream-strong)`؛ `border-radius`: تدوير الحواف بالقيمة `13px`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 293:** `font-size`: حجم الخط بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 294:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.62)`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.45`. القيم هنا تنسيق، مش function JavaScript.

**السطر 296:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `minmax(320px, 440px) 1fr`. القيم هنا تنسيق، مش function JavaScript.

### السطور 297–304

```css
.diagnosis-panel { width: min(440px, 100%); padding: 25px; border-radius: 28px; }
.diagnosis-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.diagnosis-header h2 { margin-top: 7px; font-size: clamp(24px, 2.2vw, 32px); line-height: 1; letter-spacing: -0.045em; }
.diagnosis-kicker { display: inline-flex; align-items: center; gap: 8px; color: rgba(255, 253, 247, 0.65); font-size: 11px; font-weight: 850; letter-spacing: 0.1em; text-transform: uppercase; }
.diagnosis-kicker i, .diagnosis-pulse { width: 8px; height: 8px; background: #65dda1; border-radius: 50%; box-shadow: 0 0 0 6px rgba(101, 221, 161, 0.12); }
.diagnosis-pulse { width: 11px; height: 11px; animation: diagnosis-pulse 1.8s ease-out infinite; }
.diagnosis-list { display: grid; gap: 10px; }
.diagnosis-card { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 9px 16px; padding: 13px 14px; background: rgba(255, 255, 255, 0.075); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
```

**السطر 297:** `width`: العرض بالقيمة `min(440px, 100%)`؛ `padding`: مسافة داخلية بالقيمة `25px`؛ `border-radius`: تدوير الحواف بالقيمة `28px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 298:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `flex-start`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 299:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `7px`؛ `font-size`: حجم الخط بالقيمة `clamp(24px, 2.2vw, 32px)`؛ `line-height`: ارتفاع سطر النص بالقيمة `1`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.045em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 300:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `8px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.65)`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `font-weight`: وزن الخط بالقيمة `850`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.1em`؛ `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 301:** `width`: العرض بالقيمة `8px`؛ `height`: الارتفاع بالقيمة `8px`؛ `background`: خلفية العنصر بالقيمة `#65dda1`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `box-shadow`: ظل العنصر بالقيمة `0 0 0 6px rgba(101, 221, 161, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 302:** `width`: العرض بالقيمة `11px`؛ `height`: الارتفاع بالقيمة `11px`؛ `animation`: ضبط الخاصية المسماة كما في CSS بالقيمة `diagnosis-pulse 1.8s ease-out infinite`. القيم هنا تنسيق، مش function JavaScript.

**السطر 303:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 304:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr auto`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `9px 16px`؛ `padding`: مسافة داخلية بالقيمة `13px 14px`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.075)`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.1)`؛ `border-radius`: تدوير الحواف بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 305–312

```css
.diagnosis-card-copy { display: flex; align-items: center; gap: 11px; }
.diagnosis-card-copy strong, .diagnosis-card-copy small { display: block; }
.diagnosis-card-copy strong { font-size: 14px; }
.diagnosis-card-copy small { margin-top: 2px; color: rgba(255, 253, 247, 0.56); font-size: 11px; }
.diagnosis-dot { width: 9px; height: 9px; flex: 0 0 auto; background: var(--status-color); border-radius: 50%; box-shadow: 0 0 0 5px color-mix(in srgb, var(--status-color) 18%, transparent); }
.status-green { --status-color: #65dda1; }
.status-amber { --status-color: #f2bd68; }
.status-red { --status-color: #ff7d72; }
```

**السطر 305:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 306:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 307:** `font-size`: حجم الخط بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 308:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `2px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.56)`؛ `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 309:** `width`: العرض بالقيمة `9px`؛ `height`: الارتفاع بالقيمة `9px`؛ `flex`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 0 auto`؛ `background`: خلفية العنصر بالقيمة `var(--status-color)`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `box-shadow`: ظل العنصر بالقيمة `0 0 0 5px color-mix(in srgb, var(--status-color) 18%, transparent)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 310:** `--status-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#65dda1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 311:** `--status-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#f2bd68`. القيم هنا تنسيق، مش function JavaScript.

**السطر 312:** `--status-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#ff7d72`. القيم هنا تنسيق، مش function JavaScript.

### السطور 313–320

```css
.diagnosis-value { color: var(--status-color); font-size: 15px; font-weight: 950; font-variant-numeric: tabular-nums; }
.diagnosis-track { grid-column: 1 / -1; height: 3px; overflow: hidden; background: rgba(255, 255, 255, 0.1); border-radius: 99px; }
.diagnosis-track span { display: block; height: 100%; background: var(--status-color); border-radius: inherit; transition: width 0.12s linear; }
.diagnosis-button { width: 100%; min-height: 48px; margin-top: 16px; color: var(--primary-dark); background: var(--cream-strong); }

.finale-beat { place-items: center; }
.finale-card { width: min(650px, calc(100% - 40px)); padding: 42px; border-radius: var(--radius-xl); text-align: center; }
.finale-card .eyebrow { margin: 0 auto 16px; }
```

**السطر 313:** `color`: لون النص بالقيمة `var(--status-color)`؛ `font-size`: حجم الخط بالقيمة `15px`؛ `font-weight`: وزن الخط بالقيمة `950`؛ `font-variant-numeric`: ضبط الخاصية المسماة كما في CSS بالقيمة `tabular-nums`. القيم هنا تنسيق، مش function JavaScript.

**السطر 314:** `grid-column`: ضبط الخاصية المسماة كما في CSS بالقيمة `1 / -1`؛ `height`: الارتفاع بالقيمة `3px`؛ `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.1)`؛ `border-radius`: تدوير الحواف بالقيمة `99px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 315:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `height`: الارتفاع بالقيمة `100%`؛ `background`: خلفية العنصر بالقيمة `var(--status-color)`؛ `border-radius`: تدوير الحواف بالقيمة `inherit`؛ `transition`: تنعيم تغيّر خصائص CSS بالقيمة `width 0.12s linear`. القيم هنا تنسيق، مش function JavaScript.

**السطر 316:** `width`: العرض بالقيمة `100%`؛ `min-height`: أقل ارتفاع بالقيمة `48px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `16px`؛ `color`: لون النص بالقيمة `var(--primary-dark)`؛ `background`: خلفية العنصر بالقيمة `var(--cream-strong)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 318:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 319:** `width`: العرض بالقيمة `min(650px, calc(100% - 40px))`؛ `padding`: مسافة داخلية بالقيمة `42px`؛ `border-radius`: تدوير الحواف بالقيمة `var(--radius-xl)`؛ `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 320:** `margin`: مسافة خارجية بالقيمة `0 auto 16px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 321–328

```css
.finale-card h2 { font-size: clamp(40px, 5vw, 68px); line-height: 0.95; letter-spacing: -0.06em; }
.finale-card > p:not(.eyebrow) { margin: 18px auto 25px; color: rgba(255, 253, 247, 0.68); line-height: 1.6; }

.page-content { position: relative; z-index: 4; background: var(--cream); }
.section { padding: 110px 0; }
.booking-section { background: radial-gradient(circle at 12% 15%, rgba(37, 111, 99, 0.11), transparent 34%), var(--cream); }
.booking-grid { display: grid; grid-template-columns: 0.82fr 1.18fr; align-items: start; gap: 50px; }
.booking-info .eyebrow { color: var(--primary); background: rgba(37, 111, 99, 0.08); border-color: rgba(37, 111, 99, 0.15); }
```

**السطر 321:** `font-size`: حجم الخط بالقيمة `clamp(40px, 5vw, 68px)`؛ `line-height`: ارتفاع سطر النص بالقيمة `0.95`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.06em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 322:** `p`: ضبط الخاصية المسماة كما في CSS بالقيمة `not(.eyebrow)`؛ `margin`: مسافة خارجية بالقيمة `18px auto 25px`؛ `color`: لون النص بالقيمة `rgba(255, 253, 247, 0.68)`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.6`. القيم هنا تنسيق، مش function JavaScript.

**السطر 324:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `4`؛ `background`: خلفية العنصر بالقيمة `var(--cream)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 325:** `padding`: مسافة داخلية بالقيمة `110px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 326:** `background`: خلفية العنصر بالقيمة `radial-gradient(circle at 12% 15%, rgba(37, 111, 99, 0.11), transparent 34%), var(--cream)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 327:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `0.82fr 1.18fr`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `start`؛ `gap`: مسافة بين عناصر layout بالقيمة `50px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 328:** `color`: لون النص بالقيمة `var(--primary)`؛ `background`: خلفية العنصر بالقيمة `rgba(37, 111, 99, 0.08)`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(37, 111, 99, 0.15)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 329–336

```css
.booking-info h2 { margin: 18px 0 20px; font-size: clamp(38px, 5vw, 58px); line-height: 0.98; letter-spacing: -0.06em; }
.booking-info > p { color: var(--muted); line-height: 1.8; }
.info-box { margin-top: 28px; padding: 24px; color: #fff; background: var(--primary-dark); border-radius: var(--radius-lg); box-shadow: var(--shadow); }
.info-box strong, .info-box span { display: block; }
.info-box span { margin-top: 8px; color: rgba(255, 255, 255, 0.72); line-height: 1.65; }

.booking-form { padding: 28px; background: rgba(255, 255, 255, 0.9); border: 1px solid var(--line); border-radius: var(--radius-xl); box-shadow: var(--shadow); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
```

**السطر 329:** `margin`: مسافة خارجية بالقيمة `18px 0 20px`؛ `font-size`: حجم الخط بالقيمة `clamp(38px, 5vw, 58px)`؛ `line-height`: ارتفاع سطر النص بالقيمة `0.98`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.06em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 330:** `color`: لون النص بالقيمة `var(--muted)`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 331:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `28px`؛ `padding`: مسافة داخلية بالقيمة `24px`؛ `color`: لون النص بالقيمة `#fff`؛ `background`: خلفية العنصر بالقيمة `var(--primary-dark)`؛ `border-radius`: تدوير الحواف بالقيمة `var(--radius-lg)`؛ `box-shadow`: ظل العنصر بالقيمة `var(--shadow)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 332:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 333:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`؛ `color`: لون النص بالقيمة `rgba(255, 255, 255, 0.72)`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.65`. القيم هنا تنسيق، مش function JavaScript.

**السطر 335:** `padding`: مسافة داخلية بالقيمة `28px`؛ `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.9)`؛ `border`: حدود العنصر بالقيمة `1px solid var(--line)`؛ `border-radius`: تدوير الحواف بالقيمة `var(--radius-xl)`؛ `box-shadow`: ظل العنصر بالقيمة `var(--shadow)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 336:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 337–344

```css
.form-group { margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 900; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 15px 16px; color: var(--text); background: #fbfaf7; border: 1px solid var(--line); border-radius: 15px; outline: none; transition: border 0.2s ease, box-shadow 0.2s ease; }
.form-group textarea { resize: vertical; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { background: #fff; border-color: rgba(37, 111, 99, 0.52); box-shadow: 0 0 0 5px rgba(37, 111, 99, 0.08); }
.alert { margin-bottom: 18px; padding: 14px 16px; border-radius: 15px; font-size: 14px; font-weight: 800; }
.alert-error { color: var(--error); background: rgba(194, 67, 67, 0.1); border: 1px solid rgba(194, 67, 67, 0.18); }
.alert-success { color: var(--success); background: rgba(30, 143, 93, 0.1); border: 1px solid rgba(30, 143, 93, 0.18); }
```

**السطر 337:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 338:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `font-weight`: وزن الخط بالقيمة `900`. القيم هنا تنسيق، مش function JavaScript.

**السطر 339:** `width`: العرض بالقيمة `100%`؛ `padding`: مسافة داخلية بالقيمة `15px 16px`؛ `color`: لون النص بالقيمة `var(--text)`؛ `background`: خلفية العنصر بالقيمة `#fbfaf7`؛ `border`: حدود العنصر بالقيمة `1px solid var(--line)`؛ `border-radius`: تدوير الحواف بالقيمة `15px`؛ `outline`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`؛ `transition`: تنعيم تغيّر خصائص CSS بالقيمة `border 0.2s ease, box-shadow 0.2s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 340:** `resize`: ضبط الخاصية المسماة كما في CSS بالقيمة `vertical`. القيم هنا تنسيق، مش function JavaScript.

**السطر 341:** `input`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus, .form-group select:focus, .form-group textarea:focus`؛ `background`: خلفية العنصر بالقيمة `#fff`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(37, 111, 99, 0.52)`؛ `box-shadow`: ظل العنصر بالقيمة `0 0 0 5px rgba(37, 111, 99, 0.08)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 342:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `18px`؛ `padding`: مسافة داخلية بالقيمة `14px 16px`؛ `border-radius`: تدوير الحواف بالقيمة `15px`؛ `font-size`: حجم الخط بالقيمة `14px`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 343:** `color`: لون النص بالقيمة `var(--error)`؛ `background`: خلفية العنصر بالقيمة `rgba(194, 67, 67, 0.1)`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(194, 67, 67, 0.18)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 344:** `color`: لون النص بالقيمة `var(--success)`؛ `background`: خلفية العنصر بالقيمة `rgba(30, 143, 93, 0.1)`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(30, 143, 93, 0.18)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 345–352

```css
.form-btn { width: 100%; color: #fff; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }

.footer { position: relative; z-index: 4; padding: 34px 0; background: #fffdfa; border-top: 1px solid var(--line); }
.footer-content { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.footer strong { font-size: 18px; }
.footer p { margin-top: 4px; color: var(--muted); }
.footer-links { display: flex; flex-wrap: wrap; gap: 10px; }
.footer-links a { padding: 10px 12px; color: var(--muted); border-radius: 999px; font-size: 14px; font-weight: 800; }
```

**السطر 345:** `width`: العرض بالقيمة `100%`؛ `color`: لون النص بالقيمة `#fff`؛ `background`: خلفية العنصر بالقيمة `linear-gradient(135deg, var(--primary), var(--primary-dark))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 347:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `4`؛ `padding`: مسافة داخلية بالقيمة `34px 0`؛ `background`: خلفية العنصر بالقيمة `#fffdfa`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid var(--line)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 348:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 349:** `font-size`: حجم الخط بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 350:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `4px`؛ `color`: لون النص بالقيمة `var(--muted)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 351:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 352:** `padding`: مسافة داخلية بالقيمة `10px 12px`؛ `color`: لون النص بالقيمة `var(--muted)`؛ `border-radius`: تدوير الحواف بالقيمة `999px`؛ `font-size`: حجم الخط بالقيمة `14px`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

### السطور 353–360

```css
.footer-links a:hover { color: var(--primary); background: var(--cream); }

.story.is-fallback { height: auto !important; }
.story.is-fallback .story-stage { position: relative; height: auto; min-height: 0; overflow: visible; padding-top: 70px; }
.story.is-fallback .story-panel { position: relative; min-height: 100svh; padding-block: 100px 60px; visibility: visible !important; pointer-events: auto !important; }
.story.is-fallback .whip-beat { display: none; }
.story.is-fallback .story-canvas-shell { position: fixed; }
.story.is-fallback .story-scroll-cue { display: none; }
```

**السطر 353:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `color`: لون النص بالقيمة `var(--primary)`؛ `background`: خلفية العنصر بالقيمة `var(--cream)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 355:** `height`: الارتفاع بالقيمة `auto !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 356:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `height`: الارتفاع بالقيمة `auto`؛ `min-height`: أقل ارتفاع بالقيمة `0`؛ `overflow`: التعامل مع المحتوى الزائد بالقيمة `visible`؛ `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `70px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 357:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `min-height`: أقل ارتفاع بالقيمة `100svh`؛ `padding-block`: ضبط الخاصية المسماة كما في CSS بالقيمة `100px 60px`؛ `visibility`: إظهار/إخفاء بصري مع أثر على التركيز بالقيمة `visible !important`؛ `pointer-events`: استقبال أحداث المؤشر بالقيمة `auto !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 358:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 359:** `position`: نوع تموضع العنصر بالقيمة `fixed`. القيم هنا تنسيق، مش function JavaScript.

**السطر 360:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

### السطور 361–368

```css
.story.is-fallback .step { opacity: 1 !important; transform: none !important; }

@keyframes scroll-cue {
    0%, 100% { opacity: 0.3; transform: translate(-50%, 0); }
    50% { opacity: 1; transform: translate(-50%, 7px); }
}

@keyframes diagnosis-pulse {
```

**السطر 361:** `opacity`: شفافية العنصر بالقيمة `1 !important`؛ `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `none !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 363:** Animation keyframes: تعريف مراحل حركة CSS؛ التطبيق يتم من خاصية animation.

**السطر 364:** `opacity`: شفافية العنصر بالقيمة `0.3`؛ `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translate(-50%, 0)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 365:** `opacity`: شفافية العنصر بالقيمة `1`؛ `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translate(-50%, 7px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 366:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 368:** Animation keyframes: تعريف مراحل حركة CSS؛ التطبيق يتم من خاصية animation.

### السطور 369–376

```css
    0% { box-shadow: 0 0 0 0 rgba(101, 221, 161, 0.4); }
    70% { box-shadow: 0 0 0 12px rgba(101, 221, 161, 0); }
    100% { box-shadow: 0 0 0 0 rgba(101, 221, 161, 0); }
}

@media (max-width: 920px) {
    .menu-btn { display: block; }
    .nav-links { position: absolute; top: 82px; left: 20px; right: 20px; display: none; flex-direction: column; align-items: stretch; padding: 12px; background: rgba(8, 47, 40, 0.97); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 22px; box-shadow: var(--shadow); }
```

**السطر 369:** `box-shadow`: ظل العنصر بالقيمة `0 0 0 0 rgba(101, 221, 161, 0.4)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 370:** `box-shadow`: ظل العنصر بالقيمة `0 0 0 12px rgba(101, 221, 161, 0)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 371:** `box-shadow`: ظل العنصر بالقيمة `0 0 0 0 rgba(101, 221, 161, 0)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 372:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 374:** `max-width`: أقصى عرض بالقيمة `920px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 375:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 376:** `position`: نوع تموضع العنصر بالقيمة `absolute`؛ `top`: المسافة من أعلى بالقيمة `82px`؛ `left`: المسافة من الشمال بالقيمة `20px`؛ `right`: المسافة من اليمين بالقيمة `20px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`؛ `flex-direction`: اتجاه ترتيب flex بالقيمة `column`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `stretch`؛ `padding`: مسافة داخلية بالقيمة `12px`؛ `background`: خلفية العنصر بالقيمة `rgba(8, 47, 40, 0.97)`؛ `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.14)`؛ `border-radius`: تدوير الحواف بالقيمة `22px`؛ `box-shadow`: ظل العنصر بالقيمة `var(--shadow)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 377–384

```css
    .nav-links.active { display: flex; }
    .nav-links a { text-align: center; }
    .hero-beat h1 { font-size: clamp(52px, 9vw, 76px); }
    .process-surface { grid-template-columns: 1fr; gap: 24px; }
    .beat-heading.align-left { max-width: 700px; text-align: center; margin-inline: auto; }
    .beat-heading.align-left .eyebrow { margin-inline: auto; }
    .booking-grid { grid-template-columns: 1fr; }
}
```

**السطر 377:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 378:** `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 379:** `font-size`: حجم الخط بالقيمة `clamp(52px, 9vw, 76px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 380:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 381:** `max-width`: أقصى عرض بالقيمة `700px`؛ `text-align`: محاذاة النص بالقيمة `center`؛ `margin-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 382:** `margin-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 383:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 384:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 385–392

```css

@media (max-width: 767px) {
    .container { width: min(100% - 28px, 1180px); }
    .nav-content { height: 74px; }
    .brand-icon { width: 42px; height: 42px; }
    .nav-links { top: 74px; left: 14px; right: 14px; }
    .story-stage { min-height: 680px; }
    .story-panel { padding: 92px 0 40px; }
```

**السطر 386:** `max-width`: أقصى عرض بالقيمة `767px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 387:** `width`: العرض بالقيمة `min(100% - 28px, 1180px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 388:** `height`: الارتفاع بالقيمة `74px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 389:** `width`: العرض بالقيمة `42px`؛ `height`: الارتفاع بالقيمة `42px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 390:** `top`: المسافة من أعلى بالقيمة `74px`؛ `left`: المسافة من الشمال بالقيمة `14px`؛ `right`: المسافة من اليمين بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 391:** `min-height`: أقل ارتفاع بالقيمة `680px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 392:** `padding`: مسافة داخلية بالقيمة `92px 0 40px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 393–400

```css
    .hero-beat { align-items: start; }
    .hero-story-content { padding-top: 6svh; }
    .story-warning { font-size: 15px; }
    .hero-beat h1 { font-size: clamp(44px, 13vw, 64px); }
    .hero-description { font-size: 16px; line-height: 1.6; }
    .hero-actions { width: 100%; flex-direction: column; }
    .hero-actions .btn { width: 100%; }
    .story-scroll-cue { display: none; }
```

**السطر 393:** `align-items`: محاذاة على المحور العرضي بالقيمة `start`. القيم هنا تنسيق، مش function JavaScript.

**السطر 394:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `6svh`. القيم هنا تنسيق، مش function JavaScript.

**السطر 395:** `font-size`: حجم الخط بالقيمة `15px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 396:** `font-size`: حجم الخط بالقيمة `clamp(44px, 13vw, 64px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 397:** `font-size`: حجم الخط بالقيمة `16px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.6`. القيم هنا تنسيق، مش function JavaScript.

**السطر 398:** `width`: العرض بالقيمة `100%`؛ `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 399:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 400:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

### السطور 401–408

```css
    .whip-beat p { font-size: clamp(46px, 15vw, 72px); }
    .beat-surface { width: calc(100% - 20px); padding: 20px; border-radius: 24px; }
    .beat-heading { margin-bottom: 18px; }
    .beat-heading h2 { font-size: clamp(31px, 9vw, 43px); }
    .beat-heading > p:last-child { font-size: 13px; }
    .services-surface { overflow: hidden; }
    .services-grid { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 8px; }
    .services-grid::-webkit-scrollbar { display: none; }
```

**السطر 401:** `font-size`: حجم الخط بالقيمة `clamp(46px, 15vw, 72px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 402:** `width`: العرض بالقيمة `calc(100% - 20px)`؛ `padding`: مسافة داخلية بالقيمة `20px`؛ `border-radius`: تدوير الحواف بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 403:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 404:** `font-size`: حجم الخط بالقيمة `clamp(31px, 9vw, 43px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 405:** `p`: ضبط الخاصية المسماة كما في CSS بالقيمة `last-child`؛ `font-size`: حجم الخط بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 406:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 407:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`؛ `overflow-x`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`؛ `scroll-snap-type`: ضبط الخاصية المسماة كما في CSS بالقيمة `x mandatory`؛ `scrollbar-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`؛ `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 408:** `services-grid`: ضبط الخاصية المسماة كما في CSS بالقيمة `:-webkit-scrollbar`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

### السطور 409–416

```css
    .service-card { min-width: min(78vw, 300px); scroll-snap-align: center; }
    .steps { grid-template-columns: 1fr; max-height: 55svh; overflow-y: auto; }
    .step { padding: 13px; }
    .diagnosis-layout { grid-template-columns: 1fr; align-items: end; }
    .diagnosis-panel { width: 100%; padding: 20px; border-radius: 24px; }
    .diagnosis-card-copy small { display: none; }
    .finale-card { padding: 28px 22px; }
    .finale-card h2 { font-size: clamp(40px, 12vw, 56px); }
```

**السطر 409:** `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `min(78vw, 300px)`؛ `scroll-snap-align`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 410:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `max-height`: ضبط الخاصية المسماة كما في CSS بالقيمة `55svh`؛ `overflow-y`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 411:** `padding`: مسافة داخلية بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 412:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `end`. القيم هنا تنسيق، مش function JavaScript.

**السطر 413:** `width`: العرض بالقيمة `100%`؛ `padding`: مسافة داخلية بالقيمة `20px`؛ `border-radius`: تدوير الحواف بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 414:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 415:** `padding`: مسافة داخلية بالقيمة `28px 22px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 416:** `font-size`: حجم الخط بالقيمة `clamp(40px, 12vw, 56px)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 417–424

```css
    .section { padding: 80px 0; }
    .form-row { grid-template-columns: 1fr; gap: 0; }
    .booking-form { padding: 20px; border-radius: 24px; }
    .footer-content { flex-direction: column; text-align: center; }
    .story.is-fallback .story-panel { min-height: auto; padding-block: 90px 50px; }
    .story.is-fallback .hero-beat { min-height: 100svh; }
}

```

**السطر 417:** `padding`: مسافة داخلية بالقيمة `80px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 418:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 419:** `padding`: مسافة داخلية بالقيمة `20px`؛ `border-radius`: تدوير الحواف بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 420:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`؛ `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 421:** `min-height`: أقل ارتفاع بالقيمة `auto`؛ `padding-block`: ضبط الخاصية المسماة كما في CSS بالقيمة `90px 50px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 422:** `min-height`: أقل ارتفاع بالقيمة `100svh`. القيم هنا تنسيق، مش function JavaScript.

**السطر 423:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 425–432

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

**السطر 425:** `prefers-reduced-motion`: ضبط الخاصية المسماة كما في CSS بالقيمة `reduce)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 426:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 427:** `scroll-behavior`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 428:** `animation-duration`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.01ms !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 429:** `animation-iteration-count`: ضبط الخاصية المسماة كما في CSS بالقيمة `1 !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 430:** `transition-duration`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.01ms !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 431:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 432:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
