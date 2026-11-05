# resources/css/app.css

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/css/app.css` · 1271 سطر.

**وظيفة الملف:** ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../resources/css/app.css). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```css
/* resources/css/app.css */

.wtc-demo-mode { padding-bottom: 92px; }
.wtc-demo-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 4000; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem 1.2rem; background: #191919; color: #ddd; border-top: 2px solid #e32626; box-shadow: 0 -8px 30px rgba(0,0,0,.3); font-size: .8rem; }
.wtc-demo-bar>div { display: flex; align-items: center; gap: .7rem; }
.wtc-demo-bar strong { color: #ff7373; }
.wtc-demo-bar nav { display: flex; flex-shrink: 0; gap: .8rem; }
.wtc-demo-bar a,.wtc-demo-bar button { color: #fff; border: 0; background: transparent; padding: .4rem; text-decoration: underline; }
.wtc-demo-bar a:focus-visible,.wtc-demo-bar button:focus-visible { outline: 2px solid #ff7373; }
.wtc-demo-mode .wtc-payment-tabs button:last-child { display: none; }
.wtc-demo-mode .wtc-payment-tabs { grid-template-columns: 1fr; }
@media(max-width:650px) { .wtc-demo-mode{padding-bottom:140px}.wtc-demo-bar{align-items:start;flex-direction:column;gap:.25rem}.wtc-demo-bar>div{align-items:start}.wtc-demo-bar nav{flex-wrap:wrap} }
@media print { .wtc-demo-bar{display:none!important} }

.wtc-delivery-modal {
    background: #191919;
    color: #f5f5f5;
    border: 1px solid #383838;
    border-radius: 8px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, .5);
}
.wtc-delivery-modal .modal-header,
.wtc-delivery-modal .modal-footer { border-color: #333; padding: 1.25rem; }
.wtc-delivery-modal .modal-title { font-size: 1.35rem; font-weight: 850; }
.wtc-delivery-fields { display: grid; gap: .65rem; padding: 1.25rem; }
.wtc-delivery-fields .form-label { margin: 0; }
.wtc-delivery-input {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 46px;
    padding: .75rem;
    margin-bottom: .5rem;
    border: 1px solid #454545;
    border-radius: 6px;
    background: #101010;
    color: #fff;
    font-size: 1rem;
    color-scheme: dark;
}
textarea.wtc-delivery-input { resize: vertical; }
.wtc-delivery-input::placeholder { color: #999; }
.wtc-delivery-input:focus-visible {
    outline: 3px solid rgba(227, 38, 38, .3);
    outline-offset: 2px;
    border-color: #ff5555;
}
.wtc-delivery-fee { display: flex; justify-content: space-between; gap: 1rem; color: #bdbdbd; }
.wtc-delivery-fee strong { color: #fff; }
.wtc-order-toggle button[aria-pressed="true"],
.wtc-mobile-order-mode button.active {
    background: #e32626 !important;
    color: #fff !important;
    box-shadow: 0 3px 12px rgba(227, 38, 38, .22);
}
.wtc-order-toggle button:focus-visible,
.wtc-mobile-order-mode button:focus-visible { outline: 3px solid #ff7777; outline-offset: 2px; }
.wtc-option-card.is-selected { background: #e32626 !important; border-color: #ff5555 !important; color: #fff; }
.wtc-option-card.is-selected small { color: #fff !important; }
@media (max-width: 575px) {
    .wtc-delivery-modal .modal-footer { display: grid; grid-template-columns: 1fr; }
    .wtc-delivery-modal .modal-footer .btn { width: 100%; margin: 0; }
}

:root {
  --bg-primary: #121212;
  --bg-secondary: #1A1A1A;
  --accent-red: #E32626;
  --accent-gold: #F1A83A;
  --text-main: #F5F5F5;
}

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scrollbar-color: var(--accent-red) #0d0d0d;
    scrollbar-width: thin;
}

body {
    margin: 0;
    background: var(--bg-primary);
    color: var(--text-main);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    overflow-x: hidden;
}

::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

::-webkit-scrollbar-track {
    background: #0d0d0d;
}

::-webkit-scrollbar-thumb {
    border: 3px solid #0d0d0d;
    border-radius: 999px;
    background:
        linear-gradient(180deg, #ff3b3b 0%, var(--accent-red) 48%, #a91515 100%);
}

::-webkit-scrollbar-thumb:hover {
    background:
        linear-gradient(180deg, #ff5656 0%, #ef2f2f 48%, var(--accent-red) 100%);
}

a {
    color: inherit;
    text-decoration: none;
}

button,
a {
    -webkit-tap-highlight-color: transparent;
}

.app-ready {
    background:
        radial-gradient(circle at 18% 10%, rgba(227, 38, 38, 0.11), transparent 28rem),
        radial-gradient(circle at 80% 30%, rgba(241, 168, 58, 0.09), transparent 32rem),
        var(--bg-primary);
}

.section-padding {
    padding: 6.5rem 0;
}

.site-header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 1000;
    background: rgba(18, 18, 18, 0.84);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(18px);
}

.nav-grid {
    min-height: 92px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
}

.nav-left,
.nav-right {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.nav-left a {
    position: relative;
    color: rgba(245, 245, 245, 0.76);
    font-size: 0.92rem;
    font-weight: 800;
}

.nav-left a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -0.42rem;
    width: 0;
    height: 2px;
    border-radius: 999px;
    background: var(--accent-red);
    transition: 0.25s ease;
}

.nav-left a:hover,
.nav-left a.active {
    color: var(--text-main);
}

.nav-left a:hover::after,
.nav-left a.active::after {
    width: 100%;
}

.nav-center {
    display: flex;
    justify-content: center;
}

.nav-right {
    justify-content: flex-end;
}

.brand-logo-img-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.brand-logo-img {
    width: clamp(140px, 15vw, 210px);
    height: auto;
    display: block;
    filter:
        drop-shadow(0 0 18px rgba(227, 38, 38, 0.14))
        brightness(1.15);
}

.mode-toggle {
    display: inline-flex;
    padding: 0.28rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    background: rgba(26, 26, 26, 0.92);
}

.mode-toggle button {
    border: 0;
    border-radius: 999px;
    padding: 0.7rem 0.95rem;
    background: transparent;
    color: rgba(245, 245, 245, 0.68);
    font-size: 0.76rem;
    font-weight: 900;
    transition: 0.25s ease;
}

.mode-toggle button.active {
    background: var(--accent-red);
    color: #fff;
    box-shadow: 0 12px 30px rgba(227, 38, 38, 0.34);
}

.login-link {
    color: rgba(245, 245, 245, 0.74);
    font-weight: 900;
}

.login-link:hover {
    color: var(--accent-gold);
}

.mobile-menu {
    display: none;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.85rem;
    background: rgba(255, 255, 255, 0.04);
}

.mobile-menu span {
    display: block;
    width: 19px;
    height: 2px;
    margin: 4px auto;
    border-radius: 999px;
    background: var(--text-main);
}

.hero-canvas {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background:
        linear-gradient(90deg, rgba(18, 18, 18, 1) 0%, rgba(18, 18, 18, 0.98) 42%, rgba(18, 18, 18, 0.72) 62%, rgba(18, 18, 18, 1) 100%),
        var(--bg-primary);
}

.hero-texture {
    position: absolute;
    inset: 0;
    opacity: 0.22;
    pointer-events: none;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px),
        radial-gradient(circle at 75% 45%, rgba(241, 168, 58, 0.08) 0 1px, transparent 1px);
    background-size: 56px 56px, 74px 74px;
}

.hero-smoke {
    position: absolute;
    z-index: 2;
    pointer-events: none;
    filter: blur(36px);
    opacity: 0.48;
}

.hero-smoke-one {
    top: 16%;
    left: 38%;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: rgba(227, 38, 38, 0.16);
}

.hero-smoke-two {
    top: 28%;
    right: 13%;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: rgba(241, 168, 58, 0.12);
}

.hero-organic-grid {
    position: relative;
    z-index: 3;
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(320px, 45%) 1fr;
    align-items: center;
    padding: 8rem 0 3rem;
}

.hero-copy {
    padding-left: clamp(1.2rem, 6vw, 6rem);
    max-width: 700px;
}

.eyebrow {
    margin-bottom: 1rem;
    color: var(--accent-gold);
    font-size: 0.76rem;
    font-weight: 950;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.hero-copy h1 {
    margin: 0 0 1.4rem;
    font-size: clamp(3.2rem, 7vw, 7.6rem);
    line-height: 0.88;
    font-weight: 1000;
    letter-spacing: 0;
}

.hero-copy h1 span {
    display: block;
    color: var(--accent-red);
}

.hero-description,
.section-copy {
    max-width: 620px;
    color: rgba(245, 245, 245, 0.68);
    font-size: 1rem;
    line-height: 1.8;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 2rem 0;
}

.btn {
    border-radius: 999px;
    font-weight: 950;
}

.btn-red {
    border: 1px solid var(--accent-red) !important;
    background: var(--accent-red) !important;
    color: #fff !important;
    box-shadow: 0 18px 44px rgba(227, 38, 38, 0.28);
}

.btn-red:hover {
    transform: translateY(-2px);
    background: #ff3838 !important;
}

.btn-outline-glow {
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-main);
}

.btn-outline-glow:hover {
    border-color: rgba(241, 168, 58, 0.5);
    background: rgba(241, 168, 58, 0.1);
    color: var(--text-main);
}

.hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
}

.hero-stats div {
    max-width: 170px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.55rem;
    align-items: start;
}

.hero-stats span {
    grid-row: span 2;
    font-size: 1.35rem;
}

.hero-stats strong {
    font-size: 0.78rem;
    text-transform: uppercase;
}

.hero-stats small {
    color: rgba(245, 245, 245, 0.55);
    line-height: 1.45;
}

.hero-pizza-zone {
    position: relative;
    min-height: 720px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: clamp(1rem, 5vw, 5rem);
}

.pizza-blend-mask {
    position: absolute;
    left: -22%;
    top: 0;
    bottom: 0;
    width: 62%;
    z-index: 8;
    pointer-events: none;
    background:
        linear-gradient(90deg, var(--bg-primary) 0%, rgba(18, 18, 18, 0.9) 30%, rgba(18, 18, 18, 0.5) 62%, transparent 100%);
    filter: blur(2px);
}

.pizza-hero-disk {
    position: relative;
    width: min(58vw, 760px);
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    box-shadow:
        inset 0 0 70px rgba(0, 0, 0, 0.34),
        0 56px 100px rgba(0, 0, 0, 0.68);
}

.pizza-hero-disk::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
        radial-gradient(circle at 50% 45%, transparent 48%, rgba(18, 18, 18, 0.14) 70%, rgba(18, 18, 18, 0.36) 100%),
        linear-gradient(90deg, rgba(18, 18, 18, 0.38) 0%, transparent 40%);
}

.hero-pizza-img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1.12);
}

.falling-topping {
    position: absolute;
    z-index: 9;
    pointer-events: none;
    filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.35));
}

.salami {
    width: 58px;
    height: 22px;
    border-radius: 999px;
    background:
        radial-gradient(circle at 24% 45%, rgba(255, 255, 255, 0.2) 0 6%, transparent 7%),
        linear-gradient(135deg, #8f1020, #d1373f 52%, #75111c);
    transform: rotate(-14deg);
}

.salami-one {
    top: 33%;
    right: 37%;
}

.salami-two {
    top: 43%;
    right: 24%;
}

.salami-three {
    top: 61%;
    right: 42%;
}

.meat {
    width: 48px;
    height: 38px;
    border-radius: 42% 58% 47% 53%;
    background:
        radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.16) 0 8%, transparent 9%),
        linear-gradient(135deg, #6d3f22, #a56835 56%, #4a2817);
}

.meat-one {
    top: 31%;
    right: 23%;
}

.meat-two {
    top: 52%;
    right: 33%;
}

.meat-three {
    top: 68%;
    right: 20%;
}

.section-heading {
    max-width: 780px;
    margin: 0 auto 3.3rem;
}

.section-title {
    margin: 0 0 1rem;
    font-size: clamp(2.5rem, 5vw, 5rem);
    line-height: 0.95;
    font-weight: 1000;
    letter-spacing: 0;
}

.specials-section,
.menu-hero {
    background:
        radial-gradient(circle at 80% 0%, rgba(227, 38, 38, 0.08), transparent 28rem),
        var(--bg-primary);
}

.dark-card {
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
        rgba(26, 26, 26, 0.88);
    color: var(--text-main);
    transition: 0.28s ease;
}

.dark-card:hover {
    transform: translateY(-8px);
    border-color: rgba(227, 38, 38, 0.35);
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
}

.dark-card .card-body {
    padding: 1.35rem;
}

.dark-card .card-title {
    font-weight: 950;
    letter-spacing: 0;
}

.dark-card .card-text {
    color: rgba(245, 245, 245, 0.62);
    line-height: 1.65;
}

.special-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    border-radius: 8px;
    background: rgba(227, 38, 38, 0.12);
    font-size: 2rem;
}

.price-pill {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 1rem;
    padding: 0.38rem 0.7rem;
    border-radius: 999px;
    background: rgba(241, 168, 58, 0.12);
    color: var(--accent-gold);
    font-size: 0.82rem;
    font-weight: 950;
}

.item-tag {
    display: inline-flex;
    padding: 0.38rem 0.66rem;
    border-radius: 999px;
    background: rgba(227, 38, 38, 0.12);
    color: #ff7676;
    font-size: 0.72rem;
    font-weight: 950;
}

.btn-card {
    margin-top: 1rem;
    border: 1px solid rgba(241, 168, 58, 0.32);
    background: rgba(241, 168, 58, 0.1);
    color: var(--accent-gold);
}

.btn-card:hover {
    border-color: var(--accent-gold);
    background: var(--accent-gold);
    color: #181008;
}

.about-section {
    background:
        radial-gradient(circle at 16% 18%, rgba(241, 168, 58, 0.06), transparent 28rem),
        linear-gradient(180deg, #111 0%, var(--bg-primary) 100%);
}

.contact-section {
    background:
        radial-gradient(circle at 80% 20%, rgba(227, 38, 38, 0.06), transparent 26rem),
        linear-gradient(180deg, var(--bg-primary) 0%, #101010 100%);
}

.branch-selection-panel,
.selected-branch-bar,
.category-subnav {
    border: 1px solid rgba(255, 255, 255, 0.065);
    border-radius: 8px;
    background:
        linear-gradient(135deg, rgba(227, 38, 38, 0.055), transparent),
        rgba(26, 26, 26, 0.82);
    box-shadow: 0 20px 58px rgba(0, 0, 0, 0.24);
}

.contact-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 0;
}

.contact-actions,
.selected-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.site-footer {
    position: relative;
    overflow: hidden;
    padding: 5.8rem 0 2rem;
    background:
        radial-gradient(circle at 50% 0%, rgba(241, 168, 58, 0.08), transparent 24rem),
        linear-gradient(180deg, #101010 0%, #0d0d0d 100%);
    color: var(--text-main);
}

.site-footer::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
        radial-gradient(circle at 10% 38%, rgba(227, 38, 38, 0.08), transparent 26rem),
        radial-gradient(circle at 90% 44%, rgba(241, 168, 58, 0.055), transparent 30rem);
}

.site-footer .container {
    position: relative;
    z-index: 2;
}

.site-footer-heading {
    margin-bottom: 4.2rem;
    text-align: center;
}

.site-footer-heading h2 {
    margin: 0;
    color: #fff;
    font-size: clamp(2rem, 3vw, 3.2rem);
    line-height: 1;
    font-weight: 1000;
    letter-spacing: 0;
    text-transform: uppercase;
}

.site-footer-heading h2 span {
    display: inline-block;
    margin-left: 0.28rem;
    color: var(--accent-red);
    font-size: 1.6em;
    line-height: 0.7;
    vertical-align: -0.08em;
}

.site-footer-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(2rem, 4vw, 4rem);
}

.site-footer-column {
    min-width: 0;
}

.site-footer-column h3 {
    display: inline-flex;
    align-items: center;
    gap: 0.34rem;
    margin: 0 0 0.72rem;
    color: #ff4343;
    font-size: 0.86rem;
    font-weight: 950;
    letter-spacing: 0;
    text-transform: uppercase;
}

.site-footer-column p {
    margin: 0 0 0.72rem;
    color: rgba(255, 255, 255, 0.88);
    line-height: 1.55;
}

.site-footer-column a {
    display: inline-flex;
    max-width: 100%;
    margin-top: 0.18rem;
    padding-bottom: 0.62rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.22);
    color: #ff4343;
    font-weight: 950;
    overflow-wrap: anywhere;
}

.site-footer-column a:hover {
    color: var(--accent-gold);
    border-color: rgba(241, 168, 58, 0.48);
}

.site-footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 4.4rem;
    padding-top: 1.2rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    color: rgba(245, 245, 245, 0.56);
}

.site-footer-bottom nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.site-footer-bottom a:hover {
    color: var(--accent-red);
}

.menu-page {
    min-height: 100vh;
    padding-top: 92px;
    background: var(--bg-primary);
}

.branch-selection-panel {
    padding: 1.5rem;
}

.branch-selection-panel h2 {
    margin: 0.8rem 0 0.5rem;
    font-weight: 950;
    letter-spacing: 0;
}

.branch-selection-panel p {
    color: rgba(245, 245, 245, 0.64);
}

.step-pill {
    display: inline-flex;
    width: fit-content;
    padding: 0.38rem 0.7rem;
    border-radius: 999px;
    background: rgba(241, 168, 58, 0.12);
    color: var(--accent-gold);
    font-size: 0.72rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.branch-card {
    width: 100%;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 0.45rem;
    padding: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background:
        radial-gradient(circle at 78% 18%, rgba(241, 168, 58, 0.14), transparent 8rem),
        rgba(255, 255, 255, 0.035);
    color: var(--text-main);
    text-align: left;
    transition: 0.25s ease;
}

.branch-card:hover {
    border-color: rgba(227, 38, 38, 0.4);
    transform: translateY(-6px);
}

.branch-card span {
    color: var(--accent-gold);
    font-size: 0.76rem;
    font-weight: 950;
}

.branch-card strong {
    font-size: 1.55rem;
    font-weight: 1000;
    letter-spacing: 0;
}

.branch-card small {
    color: rgba(245, 245, 245, 0.6);
}

.selected-branch-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
}

.selected-branch-bar div:first-child {
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
}

.selected-branch-bar strong {
    font-size: 1.3rem;
}

.selected-branch-bar small {
    color: rgba(245, 245, 245, 0.62);
}

.category-subnav {
    position: sticky;
    top: 105px;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.4rem;
    padding: 0.8rem;
}

.category-scroll {
    display: flex;
    gap: 0.6rem;
    overflow-x: auto;
    scrollbar-width: none;
}

.category-scroll::-webkit-scrollbar {
    display: none;
}

.category-scroll button {
    flex: 0 0 auto;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 0.68rem 1rem;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(245, 245, 245, 0.76);
    font-weight: 950;
}

.category-scroll button.active {
    border-color: var(--accent-red);
    background: var(--accent-red);
    color: #fff;
}

.menu-grid {
    min-height: 360px;
}

.menu-image {
    height: 190px;
    overflow: hidden;
    background:
        radial-gradient(circle at 50% 45%, rgba(241, 168, 58, 0.18), transparent 7rem),
        #111;
}

.menu-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.menu-image-placeholder {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-size: 4rem;
}

.empty-menu-state {
    padding: 4rem 1rem;
    text-align: center;
    color: rgba(245, 245, 245, 0.66);
}

.cart-drawer {
    background: var(--bg-secondary);
    color: var(--text-main);
}

.cart-drawer .offcanvas-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-drawer .btn-close {
    filter: invert(1);
}

.cart-branch,
.checkout-panel {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.035);
}

.cart-branch {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 1rem;
}

.cart-branch span,
.cart-line span {
    color: rgba(245, 245, 245, 0.58);
    font-size: 0.86rem;
}

.cart-empty {
    padding: 2rem 0;
    color: rgba(245, 245, 245, 0.68);
}

.cart-lines {
    display: grid;
    gap: 0.8rem;
    margin-bottom: 1rem;
}

.cart-line {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.7rem;
    padding: 0.9rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
}

.cart-line div:first-child {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.cart-controls {
    display: flex;
    align-items: center;
    gap: 0.45rem;
}

.cart-controls button {
    width: 30px;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
}

.remove-line {
    grid-column: span 2;
    width: fit-content;
    border: 0;
    background: transparent;
    color: #ff7676;
    font-weight: 900;
}

.checkout-radio {
    margin-bottom: 0.6rem;
}

.cart-total {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-total strong {
    color: var(--accent-gold);
}

.cart-message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 0.85rem;
    background: rgba(241, 168, 58, 0.11);
    color: var(--accent-gold);
    font-weight: 800;
}

.auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 8rem 1rem 3rem;
    background:
        radial-gradient(circle at 20% 20%, rgba(227, 38, 38, 0.12), transparent 26rem),
        var(--bg-primary);
}

.auth-card {
    width: min(100%, 470px);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 8px;
    background: rgba(26, 26, 26, 0.88);
    color: var(--text-main);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
}

.auth-card .card-body {
    padding: 2rem;
}

.auth-card h1 {
    font-size: 2.8rem;
    font-weight: 1000;
    letter-spacing: 0;
}

.auth-card .form-label {
    color: rgba(245, 245, 245, 0.78);
    font-weight: 800;
}

.auth-card .form-control {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.055);
    color: var(--text-main);
    border-radius: 0.9rem;
    padding: 0.8rem 0.9rem;
}

.auth-card .form-control:focus {
    border-color: rgba(241, 168, 58, 0.55);
    box-shadow: 0 0 0 0.2rem rgba(241, 168, 58, 0.12);
    background: rgba(255, 255, 255, 0.07);
    color: var(--text-main);
}

.auth-switch {
    margin: 1.2rem 0 0;
    color: rgba(245, 245, 245, 0.62);
    text-align: center;
}

.auth-switch a {
    color: var(--accent-gold);
    font-weight: 950;
}

@media (max-width: 1199px) {
    .mobile-menu {
        display: block;
    }

    .nav-grid {
        grid-template-columns: auto 1fr auto;
    }

    .nav-left {
        position: absolute;
        top: 92px;
        left: 1rem;
        right: 1rem;
        display: none;
        flex-direction: column;
        align-items: stretch;
        padding: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        background: rgba(18, 18, 18, 0.98);
    }

    .nav-left.show {
        display: flex;
    }

    .nav-left a {
        padding: 0.65rem 0;
    }

    .mode-toggle button {
        padding: 0.6rem 0.75rem;
        font-size: 0.68rem;
    }
}

@media (max-width: 991px) {
    .hero-organic-grid {
        grid-template-columns: 1fr;
        padding-top: 8rem;
    }

    .hero-copy {
        padding: 0 1rem;
    }

    .hero-pizza-zone {
        min-height: 520px;
        justify-content: center;
        padding: 1rem;
    }

    .pizza-blend-mask {
        left: 0;
        top: -20%;
        width: 100%;
        height: 50%;
        background: linear-gradient(180deg, var(--bg-primary), rgba(18, 18, 18, 0.55), transparent);
    }

    .pizza-hero-disk {
        width: min(88vw, 620px);
    }

    .contact-strip,
    .selected-branch-bar,
    .category-subnav {
        flex-direction: column;
        align-items: flex-start;
    }

    .site-footer-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .falling-topping {
        transform: scale(0.82);
    }
}

@media (max-width: 767px) {
    .section-padding {
        padding: 4.5rem 0;
    }

    .nav-grid {
        min-height: 78px;
    }

    .nav-left {
        top: 78px;
    }

    .nav-right {
        display: none;
    }

    .brand-logo-img {
        width: 135px;
    }

    .hero-copy h1 {
        font-size: clamp(3rem, 16vw, 4.6rem);
    }

    .hero-actions,
    .contact-actions,
    .selected-actions {
        width: 100%;
        flex-direction: column;
    }

    .hero-actions .btn,
    .contact-actions .btn,
    .selected-actions .btn {
        width: 100%;
    }

    .hero-stats {
        flex-direction: column;
    }

    .hero-pizza-zone {
        min-height: 430px;
    }

    .salami-three,
    .meat-three {
        display: none;
    }

    .category-subnav {
        top: 88px;
    }

    .site-footer {
        padding-top: 4.5rem;
    }

    .site-footer-heading {
        margin-bottom: 3rem;
    }

    .site-footer-grid {
        grid-template-columns: 1fr;
        gap: 2.4rem;
    }

    .site-footer-bottom {
        flex-direction: column;
        align-items: flex-start;
        margin-top: 3rem;
    }

    .auth-card .card-body {
        padding: 1.35rem;
    }
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```css
/* resources/css/app.css */

.wtc-demo-mode { padding-bottom: 92px; }
.wtc-demo-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 4000; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem 1.2rem; background: #191919; color: #ddd; border-top: 2px solid #e32626; box-shadow: 0 -8px 30px rgba(0,0,0,.3); font-size: .8rem; }
.wtc-demo-bar>div { display: flex; align-items: center; gap: .7rem; }
.wtc-demo-bar strong { color: #ff7373; }
.wtc-demo-bar nav { display: flex; flex-shrink: 0; gap: .8rem; }
.wtc-demo-bar a,.wtc-demo-bar button { color: #fff; border: 0; background: transparent; padding: .4rem; text-decoration: underline; }
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `92px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 4:** `position`: نوع تموضع العنصر بالقيمة `fixed`؛ `bottom`: المسافة من أسفل بالقيمة `0`؛ `left`: المسافة من الشمال بالقيمة `0`؛ `right`: المسافة من اليمين بالقيمة `0`؛ `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `4000`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `1rem`؛ `padding`: مسافة داخلية بالقيمة `.8rem 1.2rem`؛ `background`: خلفية العنصر بالقيمة `#191919`؛ `color`: لون النص بالقيمة `#ddd`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `2px solid #e32626`؛ `box-shadow`: ظل العنصر بالقيمة `0 -8px 30px rgba(0,0,0,.3)`؛ `font-size`: حجم الخط بالقيمة `.8rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 5:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `.7rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 6:** `color`: لون النص بالقيمة `#ff7373`. القيم هنا تنسيق، مش function JavaScript.

**السطر 7:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `flex-shrink`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`؛ `gap`: مسافة بين عناصر layout بالقيمة `.8rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 8:** `color`: لون النص بالقيمة `#fff`؛ `border`: حدود العنصر بالقيمة `0`؛ `background`: خلفية العنصر بالقيمة `transparent`؛ `padding`: مسافة داخلية بالقيمة `.4rem`؛ `text-decoration`: ضبط الخاصية المسماة كما في CSS بالقيمة `underline`. القيم هنا تنسيق، مش function JavaScript.

### السطور 9–16

```css
.wtc-demo-bar a:focus-visible,.wtc-demo-bar button:focus-visible { outline: 2px solid #ff7373; }
.wtc-demo-mode .wtc-payment-tabs button:last-child { display: none; }
.wtc-demo-mode .wtc-payment-tabs { grid-template-columns: 1fr; }
@media(max-width:650px) { .wtc-demo-mode{padding-bottom:140px}.wtc-demo-bar{align-items:start;flex-direction:column;gap:.25rem}.wtc-demo-bar>div{align-items:start}.wtc-demo-bar nav{flex-wrap:wrap} }
@media print { .wtc-demo-bar{display:none!important} }

.wtc-delivery-modal {
    background: #191919;
```

**السطر 9:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible,.wtc-demo-bar button:focus-visible`؛ `outline`: ضبط الخاصية المسماة كما في CSS بالقيمة `2px solid #ff7373`. القيم هنا تنسيق، مش function JavaScript.

**السطر 10:** `button`: ضبط الخاصية المسماة كما في CSS بالقيمة `last-child`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 11:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 12:** `max-width`: أقصى عرض بالقيمة `650px)`؛ `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `140px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `start`؛ `flex-direction`: اتجاه ترتيب flex بالقيمة `column`؛ `gap`: مسافة بين عناصر layout بالقيمة `.25rem`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `start`؛ `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`. القيم هنا تنسيق، مش function JavaScript.

**السطر 13:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none!important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 15:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 16:** `background`: خلفية العنصر بالقيمة `#191919`. القيم هنا تنسيق، مش function JavaScript.

### السطور 17–24

```css
    color: #f5f5f5;
    border: 1px solid #383838;
    border-radius: 8px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, .5);
}
.wtc-delivery-modal .modal-header,
.wtc-delivery-modal .modal-footer { border-color: #333; padding: 1.25rem; }
.wtc-delivery-modal .modal-title { font-size: 1.35rem; font-weight: 850; }
```

**السطر 17:** `color`: لون النص بالقيمة `#f5f5f5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 18:** `border`: حدود العنصر بالقيمة `1px solid #383838`. القيم هنا تنسيق، مش function JavaScript.

**السطر 19:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 20:** `box-shadow`: ظل العنصر بالقيمة `0 24px 80px rgba(0, 0, 0, .5)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 23:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#333`؛ `padding`: مسافة داخلية بالقيمة `1.25rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 24:** `font-size`: حجم الخط بالقيمة `1.35rem`؛ `font-weight`: وزن الخط بالقيمة `850`. القيم هنا تنسيق، مش function JavaScript.

### السطور 25–32

```css
.wtc-delivery-fields { display: grid; gap: .65rem; padding: 1.25rem; }
.wtc-delivery-fields .form-label { margin: 0; }
.wtc-delivery-input {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 46px;
    padding: .75rem;
```

**السطر 25:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `.65rem`؛ `padding`: مسافة داخلية بالقيمة `1.25rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 26:** `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 27:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 28:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 29:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 30:** `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 31:** `min-height`: أقل ارتفاع بالقيمة `46px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 32:** `padding`: مسافة داخلية بالقيمة `.75rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 33–40

```css
    margin-bottom: .5rem;
    border: 1px solid #454545;
    border-radius: 6px;
    background: #101010;
    color: #fff;
    font-size: 1rem;
    color-scheme: dark;
}
```

**السطر 33:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `.5rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 34:** `border`: حدود العنصر بالقيمة `1px solid #454545`. القيم هنا تنسيق، مش function JavaScript.

**السطر 35:** `border-radius`: تدوير الحواف بالقيمة `6px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 36:** `background`: خلفية العنصر بالقيمة `#101010`. القيم هنا تنسيق، مش function JavaScript.

**السطر 37:** `color`: لون النص بالقيمة `#fff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 38:** `font-size`: حجم الخط بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 39:** `color-scheme`: ضبط الخاصية المسماة كما في CSS بالقيمة `dark`. القيم هنا تنسيق، مش function JavaScript.

**السطر 40:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```css
textarea.wtc-delivery-input { resize: vertical; }
.wtc-delivery-input::placeholder { color: #999; }
.wtc-delivery-input:focus-visible {
    outline: 3px solid rgba(227, 38, 38, .3);
    outline-offset: 2px;
    border-color: #ff5555;
}
.wtc-delivery-fee { display: flex; justify-content: space-between; gap: 1rem; color: #bdbdbd; }
```

**السطر 41:** `resize`: ضبط الخاصية المسماة كما في CSS بالقيمة `vertical`. القيم هنا تنسيق، مش function JavaScript.

**السطر 42:** `wtc-delivery-input`: ضبط الخاصية المسماة كما في CSS بالقيمة `:placeholder`؛ `color`: لون النص بالقيمة `#999`. القيم هنا تنسيق، مش function JavaScript.

**السطر 43:** `wtc-delivery-input`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible`. القيم هنا تنسيق، مش function JavaScript.

**السطر 44:** `outline`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px solid rgba(227, 38, 38, .3)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 45:** `outline-offset`: ضبط الخاصية المسماة كما في CSS بالقيمة `2px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 46:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#ff5555`. القيم هنا تنسيق، مش function JavaScript.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 48:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `1rem`؛ `color`: لون النص بالقيمة `#bdbdbd`. القيم هنا تنسيق، مش function JavaScript.

### السطور 49–56

```css
.wtc-delivery-fee strong { color: #fff; }
.wtc-order-toggle button[aria-pressed="true"],
.wtc-mobile-order-mode button.active {
    background: #e32626 !important;
    color: #fff !important;
    box-shadow: 0 3px 12px rgba(227, 38, 38, .22);
}
.wtc-order-toggle button:focus-visible,
```

**السطر 49:** `color`: لون النص بالقيمة `#fff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 50:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 51:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 52:** `background`: خلفية العنصر بالقيمة `#e32626 !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 53:** `color`: لون النص بالقيمة `#fff !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 54:** `box-shadow`: ظل العنصر بالقيمة `0 3px 12px rgba(227, 38, 38, .22)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** `button`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible,`. القيم هنا تنسيق، مش function JavaScript.

### السطور 57–64

```css
.wtc-mobile-order-mode button:focus-visible { outline: 3px solid #ff7777; outline-offset: 2px; }
.wtc-option-card.is-selected { background: #e32626 !important; border-color: #ff5555 !important; color: #fff; }
.wtc-option-card.is-selected small { color: #fff !important; }
@media (max-width: 575px) {
    .wtc-delivery-modal .modal-footer { display: grid; grid-template-columns: 1fr; }
    .wtc-delivery-modal .modal-footer .btn { width: 100%; margin: 0; }
}

```

**السطر 57:** `button`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus-visible`؛ `outline`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px solid #ff7777`؛ `outline-offset`: ضبط الخاصية المسماة كما في CSS بالقيمة `2px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 58:** `background`: خلفية العنصر بالقيمة `#e32626 !important`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#ff5555 !important`؛ `color`: لون النص بالقيمة `#fff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 59:** `color`: لون النص بالقيمة `#fff !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 60:** `max-width`: أقصى عرض بالقيمة `575px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 61:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 62:** `width`: العرض بالقيمة `100%`؛ `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 63:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```css
:root {
  --bg-primary: #121212;
  --bg-secondary: #1A1A1A;
  --accent-red: #E32626;
  --accent-gold: #F1A83A;
  --text-main: #F5F5F5;
}

```

**السطر 65:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 66:** `--bg-primary`: ضبط الخاصية المسماة كما في CSS بالقيمة `#121212`. القيم هنا تنسيق، مش function JavaScript.

**السطر 67:** `--bg-secondary`: ضبط الخاصية المسماة كما في CSS بالقيمة `#1A1A1A`. القيم هنا تنسيق، مش function JavaScript.

**السطر 68:** `--accent-red`: ضبط الخاصية المسماة كما في CSS بالقيمة `#E32626`. القيم هنا تنسيق، مش function JavaScript.

**السطر 69:** `--accent-gold`: ضبط الخاصية المسماة كما في CSS بالقيمة `#F1A83A`. القيم هنا تنسيق، مش function JavaScript.

**السطر 70:** `--text-main`: ضبط الخاصية المسماة كما في CSS بالقيمة `#F5F5F5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 71:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–80

```css
* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scrollbar-color: var(--accent-red) #0d0d0d;
    scrollbar-width: thin;
```

**السطر 73:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 74:** `box-sizing`: ضبط الخاصية المسماة كما في CSS بالقيمة `border-box`. القيم هنا تنسيق، مش function JavaScript.

**السطر 75:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 78:** `scroll-behavior`: ضبط الخاصية المسماة كما في CSS بالقيمة `smooth`. القيم هنا تنسيق، مش function JavaScript.

**السطر 79:** `scrollbar-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `var(--accent-red) #0d0d0d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 80:** `scrollbar-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `thin`. القيم هنا تنسيق، مش function JavaScript.

### السطور 81–88

```css
}

body {
    margin: 0;
    background: var(--bg-primary);
    color: var(--text-main);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    overflow-x: hidden;
```

**السطر 81:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 83:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 84:** `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 85:** `background`: خلفية العنصر بالقيمة `var(--bg-primary)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 86:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 87:** `font-family`: ضبط الخاصية المسماة كما في CSS بالقيمة `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. القيم هنا تنسيق، مش function JavaScript.

**السطر 88:** `overflow-x`: ضبط الخاصية المسماة كما في CSS بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

### السطور 89–96

```css
}

::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

::-webkit-scrollbar-track {
```

**السطر 89:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 91:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 92:** `width`: العرض بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 93:** `height`: الارتفاع بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 96:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 97–104

```css
    background: #0d0d0d;
}

::-webkit-scrollbar-thumb {
    border: 3px solid #0d0d0d;
    border-radius: 999px;
    background:
        linear-gradient(180deg, #ff3b3b 0%, var(--accent-red) 48%, #a91515 100%);
```

**السطر 97:** `background`: خلفية العنصر بالقيمة `#0d0d0d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 98:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 100:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 101:** `border`: حدود العنصر بالقيمة `3px solid #0d0d0d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 102:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 103:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 104:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 105–112

```css
}

::-webkit-scrollbar-thumb:hover {
    background:
        linear-gradient(180deg, #ff5656 0%, #ef2f2f 48%, var(--accent-red) 100%);
}

a {
```

**السطر 105:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 107:** `-webkit-scrollbar-thumb`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 108:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 109:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 110:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 112:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 113–120

```css
    color: inherit;
    text-decoration: none;
}

button,
a {
    -webkit-tap-highlight-color: transparent;
}
```

**السطر 113:** `color`: لون النص بالقيمة `inherit`. القيم هنا تنسيق، مش function JavaScript.

**السطر 114:** `text-decoration`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 115:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 117:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 118:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 119:** `-webkit-tap-highlight-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `transparent`. القيم هنا تنسيق، مش function JavaScript.

**السطر 120:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 121–128

```css

.app-ready {
    background:
        radial-gradient(circle at 18% 10%, rgba(227, 38, 38, 0.11), transparent 28rem),
        radial-gradient(circle at 80% 30%, rgba(241, 168, 58, 0.09), transparent 32rem),
        var(--bg-primary);
}

```

**السطر 122:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 123:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 124:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 125:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 126:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 127:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 129–136

```css
.section-padding {
    padding: 6.5rem 0;
}

.site-header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 1000;
```

**السطر 129:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 130:** `padding`: مسافة داخلية بالقيمة `6.5rem 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 131:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 133:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 134:** `position`: نوع تموضع العنصر بالقيمة `fixed`. القيم هنا تنسيق، مش function JavaScript.

**السطر 135:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 0 auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 136:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `1000`. القيم هنا تنسيق، مش function JavaScript.

### السطور 137–144

```css
    background: rgba(18, 18, 18, 0.84);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(18px);
}

.nav-grid {
    min-height: 92px;
    display: grid;
```

**السطر 137:** `background`: خلفية العنصر بالقيمة `rgba(18, 18, 18, 0.84)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 138:** `border-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid rgba(255, 255, 255, 0.08)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 139:** `backdrop-filter`: تأثير على المشهد خلف العنصر بالقيمة `blur(18px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 140:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 142:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 143:** `min-height`: أقل ارتفاع بالقيمة `92px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 144:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

### السطور 145–152

```css
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
}

.nav-left,
.nav-right {
    display: flex;
```

**السطر 145:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr auto 1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 146:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 147:** `gap`: مسافة بين عناصر layout بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 148:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 150:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 151:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 152:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

### السطور 153–160

```css
    align-items: center;
    gap: 1.25rem;
}

.nav-left a {
    position: relative;
    color: rgba(245, 245, 245, 0.76);
    font-size: 0.92rem;
```

**السطر 153:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 154:** `gap`: مسافة بين عناصر layout بالقيمة `1.25rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 155:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 157:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 158:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 159:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.76)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 160:** `font-size`: حجم الخط بالقيمة `0.92rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 161–168

```css
    font-weight: 800;
}

.nav-left a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -0.42rem;
```

**السطر 161:** `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 162:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 164:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `:after`. القيم هنا تنسيق، مش function JavaScript.

**السطر 165:** `content`: ضبط الخاصية المسماة كما في CSS بالقيمة `""`. القيم هنا تنسيق، مش function JavaScript.

**السطر 166:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 167:** `left`: المسافة من الشمال بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 168:** `bottom`: المسافة من أسفل بالقيمة `-0.42rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 169–176

```css
    width: 0;
    height: 2px;
    border-radius: 999px;
    background: var(--accent-red);
    transition: 0.25s ease;
}

.nav-left a:hover,
```

**السطر 169:** `width`: العرض بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 170:** `height`: الارتفاع بالقيمة `2px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 171:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 172:** `background`: خلفية العنصر بالقيمة `var(--accent-red)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 173:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `0.25s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 174:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 176:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover,`. القيم هنا تنسيق، مش function JavaScript.

### السطور 177–184

```css
.nav-left a.active {
    color: var(--text-main);
}

.nav-left a:hover::after,
.nav-left a.active::after {
    width: 100%;
}
```

**السطر 177:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 178:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 179:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 181:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover::after,`. القيم هنا تنسيق، مش function JavaScript.

**السطر 182:** `active`: ضبط الخاصية المسماة كما في CSS بالقيمة `:after`. القيم هنا تنسيق، مش function JavaScript.

**السطر 183:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 184:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 185–192

```css

.nav-center {
    display: flex;
    justify-content: center;
}

.nav-right {
    justify-content: flex-end;
```

**السطر 186:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 187:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 188:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 189:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 191:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 192:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `flex-end`. القيم هنا تنسيق، مش function JavaScript.

### السطور 193–200

```css
}

.brand-logo-img-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

```

**السطر 193:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 195:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 196:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 197:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 198:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 199:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 201–208

```css
.brand-logo-img {
    width: clamp(140px, 15vw, 210px);
    height: auto;
    display: block;
    filter:
        drop-shadow(0 0 18px rgba(227, 38, 38, 0.14))
        brightness(1.15);
}
```

**السطر 201:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 202:** `width`: العرض بالقيمة `clamp(140px, 15vw, 210px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 203:** `height`: الارتفاع بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 204:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 205:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 206:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 207:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 208:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 209–216

```css

.mode-toggle {
    display: inline-flex;
    padding: 0.28rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    background: rgba(26, 26, 26, 0.92);
}
```

**السطر 210:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 211:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 212:** `padding`: مسافة داخلية بالقيمة `0.28rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 213:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 214:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 215:** `background`: خلفية العنصر بالقيمة `rgba(26, 26, 26, 0.92)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 216:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 217–224

```css

.mode-toggle button {
    border: 0;
    border-radius: 999px;
    padding: 0.7rem 0.95rem;
    background: transparent;
    color: rgba(245, 245, 245, 0.68);
    font-size: 0.76rem;
```

**السطر 218:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 219:** `border`: حدود العنصر بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 220:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 221:** `padding`: مسافة داخلية بالقيمة `0.7rem 0.95rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 222:** `background`: خلفية العنصر بالقيمة `transparent`. القيم هنا تنسيق، مش function JavaScript.

**السطر 223:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.68)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 224:** `font-size`: حجم الخط بالقيمة `0.76rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 225–232

```css
    font-weight: 900;
    transition: 0.25s ease;
}

.mode-toggle button.active {
    background: var(--accent-red);
    color: #fff;
    box-shadow: 0 12px 30px rgba(227, 38, 38, 0.34);
```

**السطر 225:** `font-weight`: وزن الخط بالقيمة `900`. القيم هنا تنسيق، مش function JavaScript.

**السطر 226:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `0.25s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 227:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 229:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 230:** `background`: خلفية العنصر بالقيمة `var(--accent-red)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 231:** `color`: لون النص بالقيمة `#fff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 232:** `box-shadow`: ظل العنصر بالقيمة `0 12px 30px rgba(227, 38, 38, 0.34)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 233–240

```css
}

.login-link {
    color: rgba(245, 245, 245, 0.74);
    font-weight: 900;
}

.login-link:hover {
```

**السطر 233:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 235:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 236:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.74)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 237:** `font-weight`: وزن الخط بالقيمة `900`. القيم هنا تنسيق، مش function JavaScript.

**السطر 238:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 240:** `login-link`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

### السطور 241–248

```css
    color: var(--accent-gold);
}

.mobile-menu {
    display: none;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(255, 255, 255, 0.12);
```

**السطر 241:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 242:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 244:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 245:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 246:** `width`: العرض بالقيمة `44px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 247:** `height`: الارتفاع بالقيمة `44px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 248:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 249–256

```css
    border-radius: 0.85rem;
    background: rgba(255, 255, 255, 0.04);
}

.mobile-menu span {
    display: block;
    width: 19px;
    height: 2px;
```

**السطر 249:** `border-radius`: تدوير الحواف بالقيمة `0.85rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 250:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.04)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 251:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 253:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 254:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 255:** `width`: العرض بالقيمة `19px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 256:** `height`: الارتفاع بالقيمة `2px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 257–264

```css
    margin: 4px auto;
    border-radius: 999px;
    background: var(--text-main);
}

.hero-canvas {
    position: relative;
    min-height: 100vh;
```

**السطر 257:** `margin`: مسافة خارجية بالقيمة `4px auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 258:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 259:** `background`: خلفية العنصر بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 260:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 262:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 263:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 264:** `min-height`: أقل ارتفاع بالقيمة `100vh`. القيم هنا تنسيق، مش function JavaScript.

### السطور 265–272

```css
    overflow: hidden;
    background:
        linear-gradient(90deg, rgba(18, 18, 18, 1) 0%, rgba(18, 18, 18, 0.98) 42%, rgba(18, 18, 18, 0.72) 62%, rgba(18, 18, 18, 1) 100%),
        var(--bg-primary);
}

.hero-texture {
    position: absolute;
```

**السطر 265:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 266:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 267:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 268:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 269:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 271:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 272:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

### السطور 273–280

```css
    inset: 0;
    opacity: 0.22;
    pointer-events: none;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px),
        radial-gradient(circle at 75% 45%, rgba(241, 168, 58, 0.08) 0 1px, transparent 1px);
    background-size: 56px 56px, 74px 74px;
}
```

**السطر 273:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 274:** `opacity`: شفافية العنصر بالقيمة `0.22`. القيم هنا تنسيق، مش function JavaScript.

**السطر 275:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 276:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 277:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 278:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 279:** `background-size`: ضبط الخاصية المسماة كما في CSS بالقيمة `56px 56px, 74px 74px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 280:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 281–288

```css

.hero-smoke {
    position: absolute;
    z-index: 2;
    pointer-events: none;
    filter: blur(36px);
    opacity: 0.48;
}
```

**السطر 282:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 283:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 284:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 285:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 286:** `filter`: تأثير على العنصر ومحتواه بالقيمة `blur(36px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 287:** `opacity`: شفافية العنصر بالقيمة `0.48`. القيم هنا تنسيق، مش function JavaScript.

**السطر 288:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 289–296

```css

.hero-smoke-one {
    top: 16%;
    left: 38%;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: rgba(227, 38, 38, 0.16);
```

**السطر 290:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 291:** `top`: المسافة من أعلى بالقيمة `16%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 292:** `left`: المسافة من الشمال بالقيمة `38%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 293:** `width`: العرض بالقيمة `380px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 294:** `height`: الارتفاع بالقيمة `380px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 295:** `border-radius`: تدوير الحواف بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 296:** `background`: خلفية العنصر بالقيمة `rgba(227, 38, 38, 0.16)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 297–304

```css
}

.hero-smoke-two {
    top: 28%;
    right: 13%;
    width: 420px;
    height: 420px;
    border-radius: 50%;
```

**السطر 297:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 299:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 300:** `top`: المسافة من أعلى بالقيمة `28%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 301:** `right`: المسافة من اليمين بالقيمة `13%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 302:** `width`: العرض بالقيمة `420px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 303:** `height`: الارتفاع بالقيمة `420px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 304:** `border-radius`: تدوير الحواف بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 305–312

```css
    background: rgba(241, 168, 58, 0.12);
}

.hero-organic-grid {
    position: relative;
    z-index: 3;
    min-height: 100vh;
    display: grid;
```

**السطر 305:** `background`: خلفية العنصر بالقيمة `rgba(241, 168, 58, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 306:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 308:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 309:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 310:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `3`. القيم هنا تنسيق، مش function JavaScript.

**السطر 311:** `min-height`: أقل ارتفاع بالقيمة `100vh`. القيم هنا تنسيق، مش function JavaScript.

**السطر 312:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

### السطور 313–320

```css
    grid-template-columns: minmax(320px, 45%) 1fr;
    align-items: center;
    padding: 8rem 0 3rem;
}

.hero-copy {
    padding-left: clamp(1.2rem, 6vw, 6rem);
    max-width: 700px;
```

**السطر 313:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `minmax(320px, 45%) 1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 314:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 315:** `padding`: مسافة داخلية بالقيمة `8rem 0 3rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 316:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 318:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 319:** `padding-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `clamp(1.2rem, 6vw, 6rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 320:** `max-width`: أقصى عرض بالقيمة `700px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 321–328

```css
}

.eyebrow {
    margin-bottom: 1rem;
    color: var(--accent-gold);
    font-size: 0.76rem;
    font-weight: 950;
    letter-spacing: 0.16em;
```

**السطر 321:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 323:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 324:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 325:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 326:** `font-size`: حجم الخط بالقيمة `0.76rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 327:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 328:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.16em`. القيم هنا تنسيق، مش function JavaScript.

### السطور 329–336

```css
    text-transform: uppercase;
}

.hero-copy h1 {
    margin: 0 0 1.4rem;
    font-size: clamp(3.2rem, 7vw, 7.6rem);
    line-height: 0.88;
    font-weight: 1000;
```

**السطر 329:** `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 330:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 332:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 333:** `margin`: مسافة خارجية بالقيمة `0 0 1.4rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 334:** `font-size`: حجم الخط بالقيمة `clamp(3.2rem, 7vw, 7.6rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 335:** `line-height`: ارتفاع سطر النص بالقيمة `0.88`. القيم هنا تنسيق، مش function JavaScript.

**السطر 336:** `font-weight`: وزن الخط بالقيمة `1000`. القيم هنا تنسيق، مش function JavaScript.

### السطور 337–344

```css
    letter-spacing: 0;
}

.hero-copy h1 span {
    display: block;
    color: var(--accent-red);
}

```

**السطر 337:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 338:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 340:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 341:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 342:** `color`: لون النص بالقيمة `var(--accent-red)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 343:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 345–352

```css
.hero-description,
.section-copy {
    max-width: 620px;
    color: rgba(245, 245, 245, 0.68);
    font-size: 1rem;
    line-height: 1.8;
}

```

**السطر 345:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 346:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 347:** `max-width`: أقصى عرض بالقيمة `620px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 348:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.68)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 349:** `font-size`: حجم الخط بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 350:** `line-height`: ارتفاع سطر النص بالقيمة `1.8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 351:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 353–360

```css
.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 2rem 0;
}

.btn {
```

**السطر 353:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 354:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 355:** `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`. القيم هنا تنسيق، مش function JavaScript.

**السطر 356:** `gap`: مسافة بين عناصر layout بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 357:** `margin`: مسافة خارجية بالقيمة `2rem 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 358:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 360:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 361–368

```css
    border-radius: 999px;
    font-weight: 950;
}

.btn-red {
    border: 1px solid var(--accent-red) !important;
    background: var(--accent-red) !important;
    color: #fff !important;
```

**السطر 361:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 362:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 363:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 365:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 366:** `border`: حدود العنصر بالقيمة `1px solid var(--accent-red) !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 367:** `background`: خلفية العنصر بالقيمة `var(--accent-red) !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 368:** `color`: لون النص بالقيمة `#fff !important`. القيم هنا تنسيق، مش function JavaScript.

### السطور 369–376

```css
    box-shadow: 0 18px 44px rgba(227, 38, 38, 0.28);
}

.btn-red:hover {
    transform: translateY(-2px);
    background: #ff3838 !important;
}

```

**السطر 369:** `box-shadow`: ظل العنصر بالقيمة `0 18px 44px rgba(227, 38, 38, 0.28)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 370:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 372:** `btn-red`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 373:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateY(-2px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 374:** `background`: خلفية العنصر بالقيمة `#ff3838 !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 375:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 377–384

```css
.btn-outline-glow {
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-main);
}

.btn-outline-glow:hover {
    border-color: rgba(241, 168, 58, 0.5);
```

**السطر 377:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 378:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.17)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 379:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.04)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 380:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 381:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 383:** `btn-outline-glow`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 384:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(241, 168, 58, 0.5)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 385–392

```css
    background: rgba(241, 168, 58, 0.1);
    color: var(--text-main);
}

.hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
```

**السطر 385:** `background`: خلفية العنصر بالقيمة `rgba(241, 168, 58, 0.1)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 386:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 387:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 389:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 390:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 391:** `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`. القيم هنا تنسيق، مش function JavaScript.

**السطر 392:** `gap`: مسافة بين عناصر layout بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 393–400

```css
    margin-top: 2rem;
}

.hero-stats div {
    max-width: 170px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.55rem;
```

**السطر 393:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 394:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 396:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 397:** `max-width`: أقصى عرض بالقيمة `170px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 398:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 399:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `auto 1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 400:** `gap`: مسافة بين عناصر layout بالقيمة `0.15rem 0.55rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 401–408

```css
    align-items: start;
}

.hero-stats span {
    grid-row: span 2;
    font-size: 1.35rem;
}

```

**السطر 401:** `align-items`: محاذاة على المحور العرضي بالقيمة `start`. القيم هنا تنسيق، مش function JavaScript.

**السطر 402:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 404:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 405:** `grid-row`: ضبط الخاصية المسماة كما في CSS بالقيمة `span 2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 406:** `font-size`: حجم الخط بالقيمة `1.35rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 407:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 409–416

```css
.hero-stats strong {
    font-size: 0.78rem;
    text-transform: uppercase;
}

.hero-stats small {
    color: rgba(245, 245, 245, 0.55);
    line-height: 1.45;
```

**السطر 409:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 410:** `font-size`: حجم الخط بالقيمة `0.78rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 411:** `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 412:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 414:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 415:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.55)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 416:** `line-height`: ارتفاع سطر النص بالقيمة `1.45`. القيم هنا تنسيق، مش function JavaScript.

### السطور 417–424

```css
}

.hero-pizza-zone {
    position: relative;
    min-height: 720px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
```

**السطر 417:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 419:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 420:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 421:** `min-height`: أقل ارتفاع بالقيمة `720px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 422:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 423:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 424:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `flex-end`. القيم هنا تنسيق، مش function JavaScript.

### السطور 425–432

```css
    padding-right: clamp(1rem, 5vw, 5rem);
}

.pizza-blend-mask {
    position: absolute;
    left: -22%;
    top: 0;
    bottom: 0;
```

**السطر 425:** `padding-right`: ضبط الخاصية المسماة كما في CSS بالقيمة `clamp(1rem, 5vw, 5rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 426:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 428:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 429:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 430:** `left`: المسافة من الشمال بالقيمة `-22%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 431:** `top`: المسافة من أعلى بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 432:** `bottom`: المسافة من أسفل بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 433–440

```css
    width: 62%;
    z-index: 8;
    pointer-events: none;
    background:
        linear-gradient(90deg, var(--bg-primary) 0%, rgba(18, 18, 18, 0.9) 30%, rgba(18, 18, 18, 0.5) 62%, transparent 100%);
    filter: blur(2px);
}

```

**السطر 433:** `width`: العرض بالقيمة `62%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 434:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 435:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 436:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 437:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 438:** `filter`: تأثير على العنصر ومحتواه بالقيمة `blur(2px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 439:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 441–448

```css
.pizza-hero-disk {
    position: relative;
    width: min(58vw, 760px);
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    box-shadow:
        inset 0 0 70px rgba(0, 0, 0, 0.34),
```

**السطر 441:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 442:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 443:** `width`: العرض بالقيمة `min(58vw, 760px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 444:** `aspect-ratio`: ضبط الخاصية المسماة كما في CSS بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 445:** `border-radius`: تدوير الحواف بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 446:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 447:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 448:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 449–456

```css
        0 56px 100px rgba(0, 0, 0, 0.68);
}

.pizza-hero-disk::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
```

**السطر 449:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 450:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 452:** `pizza-hero-disk`: ضبط الخاصية المسماة كما في CSS بالقيمة `:after`. القيم هنا تنسيق، مش function JavaScript.

**السطر 453:** `content`: ضبط الخاصية المسماة كما في CSS بالقيمة `""`. القيم هنا تنسيق، مش function JavaScript.

**السطر 454:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 455:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 456:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

### السطور 457–464

```css
    background:
        radial-gradient(circle at 50% 45%, transparent 48%, rgba(18, 18, 18, 0.14) 70%, rgba(18, 18, 18, 0.36) 100%),
        linear-gradient(90deg, rgba(18, 18, 18, 0.38) 0%, transparent 40%);
}

.hero-pizza-img {
    width: 100%;
    height: 100%;
```

**السطر 457:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 458:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 459:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 460:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 462:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 463:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 464:** `height`: الارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 465–472

```css
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1.12);
}

.falling-topping {
    position: absolute;
```

**السطر 465:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 466:** `object-fit`: توزيع الصورة داخل أبعادها بالقيمة `cover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 467:** `object-position`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 468:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `scale(1.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 469:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 471:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 472:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

### السطور 473–480

```css
    z-index: 9;
    pointer-events: none;
    filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.35));
}

.salami {
    width: 58px;
    height: 22px;
```

**السطر 473:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `9`. القيم هنا تنسيق، مش function JavaScript.

**السطر 474:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 475:** `filter`: تأثير على العنصر ومحتواه بالقيمة `drop-shadow(0 12px 20px rgba(0, 0, 0, 0.35))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 476:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 478:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 479:** `width`: العرض بالقيمة `58px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 480:** `height`: الارتفاع بالقيمة `22px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 481–488

```css
    border-radius: 999px;
    background:
        radial-gradient(circle at 24% 45%, rgba(255, 255, 255, 0.2) 0 6%, transparent 7%),
        linear-gradient(135deg, #8f1020, #d1373f 52%, #75111c);
    transform: rotate(-14deg);
}

.salami-one {
```

**السطر 481:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 482:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 483:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 484:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 485:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `rotate(-14deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 486:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 488:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 489–496

```css
    top: 33%;
    right: 37%;
}

.salami-two {
    top: 43%;
    right: 24%;
}
```

**السطر 489:** `top`: المسافة من أعلى بالقيمة `33%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 490:** `right`: المسافة من اليمين بالقيمة `37%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 491:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 493:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 494:** `top`: المسافة من أعلى بالقيمة `43%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 495:** `right`: المسافة من اليمين بالقيمة `24%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 496:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 497–504

```css

.salami-three {
    top: 61%;
    right: 42%;
}

.meat {
    width: 48px;
```

**السطر 498:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 499:** `top`: المسافة من أعلى بالقيمة `61%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 500:** `right`: المسافة من اليمين بالقيمة `42%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 501:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 503:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 504:** `width`: العرض بالقيمة `48px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 505–512

```css
    height: 38px;
    border-radius: 42% 58% 47% 53%;
    background:
        radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.16) 0 8%, transparent 9%),
        linear-gradient(135deg, #6d3f22, #a56835 56%, #4a2817);
}

.meat-one {
```

**السطر 505:** `height`: الارتفاع بالقيمة `38px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 506:** `border-radius`: تدوير الحواف بالقيمة `42% 58% 47% 53%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 507:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 508:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 509:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 510:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 512:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 513–520

```css
    top: 31%;
    right: 23%;
}

.meat-two {
    top: 52%;
    right: 33%;
}
```

**السطر 513:** `top`: المسافة من أعلى بالقيمة `31%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 514:** `right`: المسافة من اليمين بالقيمة `23%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 515:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 517:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 518:** `top`: المسافة من أعلى بالقيمة `52%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 519:** `right`: المسافة من اليمين بالقيمة `33%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 520:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 521–528

```css

.meat-three {
    top: 68%;
    right: 20%;
}

.section-heading {
    max-width: 780px;
```

**السطر 522:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 523:** `top`: المسافة من أعلى بالقيمة `68%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 524:** `right`: المسافة من اليمين بالقيمة `20%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 525:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 527:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 528:** `max-width`: أقصى عرض بالقيمة `780px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 529–536

```css
    margin: 0 auto 3.3rem;
}

.section-title {
    margin: 0 0 1rem;
    font-size: clamp(2.5rem, 5vw, 5rem);
    line-height: 0.95;
    font-weight: 1000;
```

**السطر 529:** `margin`: مسافة خارجية بالقيمة `0 auto 3.3rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 530:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 532:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 533:** `margin`: مسافة خارجية بالقيمة `0 0 1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 534:** `font-size`: حجم الخط بالقيمة `clamp(2.5rem, 5vw, 5rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 535:** `line-height`: ارتفاع سطر النص بالقيمة `0.95`. القيم هنا تنسيق، مش function JavaScript.

**السطر 536:** `font-weight`: وزن الخط بالقيمة `1000`. القيم هنا تنسيق، مش function JavaScript.

### السطور 537–544

```css
    letter-spacing: 0;
}

.specials-section,
.menu-hero {
    background:
        radial-gradient(circle at 80% 0%, rgba(227, 38, 38, 0.08), transparent 28rem),
        var(--bg-primary);
```

**السطر 537:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 538:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 540:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 541:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 542:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 543:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 544:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 545–552

```css
}

.dark-card {
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
```

**السطر 545:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 547:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 548:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 549:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.08)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 550:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 551:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 552:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 553–560

```css
        rgba(26, 26, 26, 0.88);
    color: var(--text-main);
    transition: 0.28s ease;
}

.dark-card:hover {
    transform: translateY(-8px);
    border-color: rgba(227, 38, 38, 0.35);
```

**السطر 553:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 554:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 555:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `0.28s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 556:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 558:** `dark-card`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 559:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateY(-8px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 560:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(227, 38, 38, 0.35)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 561–568

```css
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
}

.dark-card .card-body {
    padding: 1.35rem;
}

.dark-card .card-title {
```

**السطر 561:** `box-shadow`: ظل العنصر بالقيمة `0 28px 70px rgba(0, 0, 0, 0.35)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 562:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 564:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 565:** `padding`: مسافة داخلية بالقيمة `1.35rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 566:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 568:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 569–576

```css
    font-weight: 950;
    letter-spacing: 0;
}

.dark-card .card-text {
    color: rgba(245, 245, 245, 0.62);
    line-height: 1.65;
}
```

**السطر 569:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 570:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 571:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 573:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 574:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.62)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 575:** `line-height`: ارتفاع سطر النص بالقيمة `1.65`. القيم هنا تنسيق، مش function JavaScript.

**السطر 576:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 577–584

```css

.special-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    border-radius: 8px;
```

**السطر 578:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 579:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 580:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 581:** `width`: العرض بالقيمة `64px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 582:** `height`: الارتفاع بالقيمة `64px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 583:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 584:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 585–592

```css
    background: rgba(227, 38, 38, 0.12);
    font-size: 2rem;
}

.price-pill {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 1rem;
```

**السطر 585:** `background`: خلفية العنصر بالقيمة `rgba(227, 38, 38, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 586:** `font-size`: حجم الخط بالقيمة `2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 587:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 589:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 590:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 591:** `width`: العرض بالقيمة `fit-content`. القيم هنا تنسيق، مش function JavaScript.

**السطر 592:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 593–600

```css
    padding: 0.38rem 0.7rem;
    border-radius: 999px;
    background: rgba(241, 168, 58, 0.12);
    color: var(--accent-gold);
    font-size: 0.82rem;
    font-weight: 950;
}

```

**السطر 593:** `padding`: مسافة داخلية بالقيمة `0.38rem 0.7rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 594:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 595:** `background`: خلفية العنصر بالقيمة `rgba(241, 168, 58, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 596:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 597:** `font-size`: حجم الخط بالقيمة `0.82rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 598:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 599:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 601–608

```css
.item-tag {
    display: inline-flex;
    padding: 0.38rem 0.66rem;
    border-radius: 999px;
    background: rgba(227, 38, 38, 0.12);
    color: #ff7676;
    font-size: 0.72rem;
    font-weight: 950;
```

**السطر 601:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 602:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 603:** `padding`: مسافة داخلية بالقيمة `0.38rem 0.66rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 604:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 605:** `background`: خلفية العنصر بالقيمة `rgba(227, 38, 38, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 606:** `color`: لون النص بالقيمة `#ff7676`. القيم هنا تنسيق، مش function JavaScript.

**السطر 607:** `font-size`: حجم الخط بالقيمة `0.72rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 608:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

### السطور 609–616

```css
}

.btn-card {
    margin-top: 1rem;
    border: 1px solid rgba(241, 168, 58, 0.32);
    background: rgba(241, 168, 58, 0.1);
    color: var(--accent-gold);
}
```

**السطر 609:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 611:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 612:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 613:** `border`: حدود العنصر بالقيمة `1px solid rgba(241, 168, 58, 0.32)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 614:** `background`: خلفية العنصر بالقيمة `rgba(241, 168, 58, 0.1)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 615:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 616:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 617–624

```css

.btn-card:hover {
    border-color: var(--accent-gold);
    background: var(--accent-gold);
    color: #181008;
}

.about-section {
```

**السطر 618:** `btn-card`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 619:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 620:** `background`: خلفية العنصر بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 621:** `color`: لون النص بالقيمة `#181008`. القيم هنا تنسيق، مش function JavaScript.

**السطر 622:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 624:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 625–632

```css
    background:
        radial-gradient(circle at 16% 18%, rgba(241, 168, 58, 0.06), transparent 28rem),
        linear-gradient(180deg, #111 0%, var(--bg-primary) 100%);
}

.contact-section {
    background:
        radial-gradient(circle at 80% 20%, rgba(227, 38, 38, 0.06), transparent 26rem),
```

**السطر 625:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 626:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 627:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 628:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 630:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 631:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 632:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 633–640

```css
        linear-gradient(180deg, var(--bg-primary) 0%, #101010 100%);
}

.branch-selection-panel,
.selected-branch-bar,
.category-subnav {
    border: 1px solid rgba(255, 255, 255, 0.065);
    border-radius: 8px;
```

**السطر 633:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 634:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 636:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 637:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 638:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 639:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.065)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 640:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 641–648

```css
    background:
        linear-gradient(135deg, rgba(227, 38, 38, 0.055), transparent),
        rgba(26, 26, 26, 0.82);
    box-shadow: 0 20px 58px rgba(0, 0, 0, 0.24);
}

.contact-strip {
    display: flex;
```

**السطر 641:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 642:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 643:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 644:** `box-shadow`: ظل العنصر بالقيمة `0 20px 58px rgba(0, 0, 0, 0.24)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 645:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 647:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 648:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

### السطور 649–656

```css
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 0;
}

.contact-actions,
.selected-actions {
```

**السطر 649:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`. القيم هنا تنسيق، مش function JavaScript.

**السطر 650:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 651:** `gap`: مسافة بين عناصر layout بالقيمة `2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 652:** `padding`: مسافة داخلية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 653:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 655:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 656:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 657–664

```css
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.site-footer {
    position: relative;
    overflow: hidden;
```

**السطر 657:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 658:** `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`. القيم هنا تنسيق، مش function JavaScript.

**السطر 659:** `gap`: مسافة بين عناصر layout بالقيمة `0.8rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 660:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 662:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 663:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 664:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

### السطور 665–672

```css
    padding: 5.8rem 0 2rem;
    background:
        radial-gradient(circle at 50% 0%, rgba(241, 168, 58, 0.08), transparent 24rem),
        linear-gradient(180deg, #101010 0%, #0d0d0d 100%);
    color: var(--text-main);
}

.site-footer::before {
```

**السطر 665:** `padding`: مسافة داخلية بالقيمة `5.8rem 0 2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 666:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 667:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 668:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 669:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 670:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 672:** `site-footer`: ضبط الخاصية المسماة كما في CSS بالقيمة `:before`. القيم هنا تنسيق، مش function JavaScript.

### السطور 673–680

```css
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
        radial-gradient(circle at 10% 38%, rgba(227, 38, 38, 0.08), transparent 26rem),
        radial-gradient(circle at 90% 44%, rgba(241, 168, 58, 0.055), transparent 30rem);
}
```

**السطر 673:** `content`: ضبط الخاصية المسماة كما في CSS بالقيمة `""`. القيم هنا تنسيق، مش function JavaScript.

**السطر 674:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 675:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 676:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 677:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 678:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 679:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 680:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 681–688

```css

.site-footer .container {
    position: relative;
    z-index: 2;
}

.site-footer-heading {
    margin-bottom: 4.2rem;
```

**السطر 682:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 683:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 684:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 685:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 687:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 688:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `4.2rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 689–696

```css
    text-align: center;
}

.site-footer-heading h2 {
    margin: 0;
    color: #fff;
    font-size: clamp(2rem, 3vw, 3.2rem);
    line-height: 1;
```

**السطر 689:** `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 690:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 692:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 693:** `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 694:** `color`: لون النص بالقيمة `#fff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 695:** `font-size`: حجم الخط بالقيمة `clamp(2rem, 3vw, 3.2rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 696:** `line-height`: ارتفاع سطر النص بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

### السطور 697–704

```css
    font-weight: 1000;
    letter-spacing: 0;
    text-transform: uppercase;
}

.site-footer-heading h2 span {
    display: inline-block;
    margin-left: 0.28rem;
```

**السطر 697:** `font-weight`: وزن الخط بالقيمة `1000`. القيم هنا تنسيق، مش function JavaScript.

**السطر 698:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 699:** `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 700:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 702:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 703:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 704:** `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.28rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 705–712

```css
    color: var(--accent-red);
    font-size: 1.6em;
    line-height: 0.7;
    vertical-align: -0.08em;
}

.site-footer-grid {
    display: grid;
```

**السطر 705:** `color`: لون النص بالقيمة `var(--accent-red)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 706:** `font-size`: حجم الخط بالقيمة `1.6em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 707:** `line-height`: ارتفاع سطر النص بالقيمة `0.7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 708:** `vertical-align`: ضبط الخاصية المسماة كما في CSS بالقيمة `-0.08em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 709:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 711:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 712:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

### السطور 713–720

```css
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(2rem, 4vw, 4rem);
}

.site-footer-column {
    min-width: 0;
}

```

**السطر 713:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(4, minmax(0, 1fr))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 714:** `gap`: مسافة بين عناصر layout بالقيمة `clamp(2rem, 4vw, 4rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 715:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 717:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 718:** `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 719:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 721–728

```css
.site-footer-column h3 {
    display: inline-flex;
    align-items: center;
    gap: 0.34rem;
    margin: 0 0 0.72rem;
    color: #ff4343;
    font-size: 0.86rem;
    font-weight: 950;
```

**السطر 721:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 722:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 723:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 724:** `gap`: مسافة بين عناصر layout بالقيمة `0.34rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 725:** `margin`: مسافة خارجية بالقيمة `0 0 0.72rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 726:** `color`: لون النص بالقيمة `#ff4343`. القيم هنا تنسيق، مش function JavaScript.

**السطر 727:** `font-size`: حجم الخط بالقيمة `0.86rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 728:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

### السطور 729–736

```css
    letter-spacing: 0;
    text-transform: uppercase;
}

.site-footer-column p {
    margin: 0 0 0.72rem;
    color: rgba(255, 255, 255, 0.88);
    line-height: 1.55;
```

**السطر 729:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 730:** `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 731:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 733:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 734:** `margin`: مسافة خارجية بالقيمة `0 0 0.72rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 735:** `color`: لون النص بالقيمة `rgba(255, 255, 255, 0.88)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 736:** `line-height`: ارتفاع سطر النص بالقيمة `1.55`. القيم هنا تنسيق، مش function JavaScript.

### السطور 737–744

```css
}

.site-footer-column a {
    display: inline-flex;
    max-width: 100%;
    margin-top: 0.18rem;
    padding-bottom: 0.62rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.22);
```

**السطر 737:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 739:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 740:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 741:** `max-width`: أقصى عرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 742:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.18rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 743:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.62rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 744:** `border-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid rgba(255, 255, 255, 0.22)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 745–752

```css
    color: #ff4343;
    font-weight: 950;
    overflow-wrap: anywhere;
}

.site-footer-column a:hover {
    color: var(--accent-gold);
    border-color: rgba(241, 168, 58, 0.48);
```

**السطر 745:** `color`: لون النص بالقيمة `#ff4343`. القيم هنا تنسيق، مش function JavaScript.

**السطر 746:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 747:** `overflow-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `anywhere`. القيم هنا تنسيق، مش function JavaScript.

**السطر 748:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 750:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 751:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 752:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(241, 168, 58, 0.48)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 753–760

```css
}

.site-footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 4.4rem;
```

**السطر 753:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 755:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 756:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 757:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 758:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`. القيم هنا تنسيق، مش function JavaScript.

**السطر 759:** `gap`: مسافة بين عناصر layout بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 760:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `4.4rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 761–768

```css
    padding-top: 1.2rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    color: rgba(245, 245, 245, 0.56);
}

.site-footer-bottom nav {
    display: flex;
    flex-wrap: wrap;
```

**السطر 761:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1.2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 762:** `box-shadow`: ظل العنصر بالقيمة `inset 0 1px 0 rgba(255, 255, 255, 0.08)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 763:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.56)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 764:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 766:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 767:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 768:** `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`. القيم هنا تنسيق، مش function JavaScript.

### السطور 769–776

```css
    gap: 1rem;
}

.site-footer-bottom a:hover {
    color: var(--accent-red);
}

.menu-page {
```

**السطر 769:** `gap`: مسافة بين عناصر layout بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 770:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 772:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 773:** `color`: لون النص بالقيمة `var(--accent-red)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 774:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 776:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 777–784

```css
    min-height: 100vh;
    padding-top: 92px;
    background: var(--bg-primary);
}

.branch-selection-panel {
    padding: 1.5rem;
}
```

**السطر 777:** `min-height`: أقل ارتفاع بالقيمة `100vh`. القيم هنا تنسيق، مش function JavaScript.

**السطر 778:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `92px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 779:** `background`: خلفية العنصر بالقيمة `var(--bg-primary)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 780:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 782:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 783:** `padding`: مسافة داخلية بالقيمة `1.5rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 784:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 785–792

```css

.branch-selection-panel h2 {
    margin: 0.8rem 0 0.5rem;
    font-weight: 950;
    letter-spacing: 0;
}

.branch-selection-panel p {
```

**السطر 786:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 787:** `margin`: مسافة خارجية بالقيمة `0.8rem 0 0.5rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 788:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 789:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 790:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 792:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 793–800

```css
    color: rgba(245, 245, 245, 0.64);
}

.step-pill {
    display: inline-flex;
    width: fit-content;
    padding: 0.38rem 0.7rem;
    border-radius: 999px;
```

**السطر 793:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.64)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 794:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 796:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 797:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 798:** `width`: العرض بالقيمة `fit-content`. القيم هنا تنسيق، مش function JavaScript.

**السطر 799:** `padding`: مسافة داخلية بالقيمة `0.38rem 0.7rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 800:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 801–808

```css
    background: rgba(241, 168, 58, 0.12);
    color: var(--accent-gold);
    font-size: 0.72rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

```

**السطر 801:** `background`: خلفية العنصر بالقيمة `rgba(241, 168, 58, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 802:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 803:** `font-size`: حجم الخط بالقيمة `0.72rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 804:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 805:** `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 806:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.08em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 807:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 809–816

```css
.branch-card {
    width: 100%;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 0.45rem;
```

**السطر 809:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 810:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 811:** `min-height`: أقل ارتفاع بالقيمة `180px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 812:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 813:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 814:** `align-items`: محاذاة على المحور العرضي بالقيمة `flex-start`. القيم هنا تنسيق، مش function JavaScript.

**السطر 815:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `flex-end`. القيم هنا تنسيق، مش function JavaScript.

**السطر 816:** `gap`: مسافة بين عناصر layout بالقيمة `0.45rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 817–824

```css
    padding: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background:
        radial-gradient(circle at 78% 18%, rgba(241, 168, 58, 0.14), transparent 8rem),
        rgba(255, 255, 255, 0.035);
    color: var(--text-main);
    text-align: left;
```

**السطر 817:** `padding`: مسافة داخلية بالقيمة `1.25rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 818:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.1)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 819:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 820:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 821:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 822:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 823:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 824:** `text-align`: محاذاة النص بالقيمة `left`. القيم هنا تنسيق، مش function JavaScript.

### السطور 825–832

```css
    transition: 0.25s ease;
}

.branch-card:hover {
    border-color: rgba(227, 38, 38, 0.4);
    transform: translateY(-6px);
}

```

**السطر 825:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `0.25s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 826:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 828:** `branch-card`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 829:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(227, 38, 38, 0.4)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 830:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateY(-6px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 831:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 833–840

```css
.branch-card span {
    color: var(--accent-gold);
    font-size: 0.76rem;
    font-weight: 950;
}

.branch-card strong {
    font-size: 1.55rem;
```

**السطر 833:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 834:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 835:** `font-size`: حجم الخط بالقيمة `0.76rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 836:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 837:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 839:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 840:** `font-size`: حجم الخط بالقيمة `1.55rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 841–848

```css
    font-weight: 1000;
    letter-spacing: 0;
}

.branch-card small {
    color: rgba(245, 245, 245, 0.6);
}

```

**السطر 841:** `font-weight`: وزن الخط بالقيمة `1000`. القيم هنا تنسيق، مش function JavaScript.

**السطر 842:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 843:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 845:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 846:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.6)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 847:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 849–856

```css
.selected-branch-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
}
```

**السطر 849:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 850:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 851:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`. القيم هنا تنسيق، مش function JavaScript.

**السطر 852:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 853:** `gap`: مسافة بين عناصر layout بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 854:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 855:** `padding`: مسافة داخلية بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 856:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 857–864

```css

.selected-branch-bar div:first-child {
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
}

.selected-branch-bar strong {
```

**السطر 858:** `div`: ضبط الخاصية المسماة كما في CSS بالقيمة `first-child`. القيم هنا تنسيق، مش function JavaScript.

**السطر 859:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 860:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 861:** `gap`: مسافة بين عناصر layout بالقيمة `0.28rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 862:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 864:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 865–872

```css
    font-size: 1.3rem;
}

.selected-branch-bar small {
    color: rgba(245, 245, 245, 0.62);
}

.category-subnav {
```

**السطر 865:** `font-size`: حجم الخط بالقيمة `1.3rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 866:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 868:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 869:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.62)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 870:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 872:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 873–880

```css
    position: sticky;
    top: 105px;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.4rem;
```

**السطر 873:** `position`: نوع تموضع العنصر بالقيمة `sticky`. القيم هنا تنسيق، مش function JavaScript.

**السطر 874:** `top`: المسافة من أعلى بالقيمة `105px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 875:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `50`. القيم هنا تنسيق، مش function JavaScript.

**السطر 876:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 877:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 878:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`. القيم هنا تنسيق، مش function JavaScript.

**السطر 879:** `gap`: مسافة بين عناصر layout بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 880:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1.4rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 881–888

```css
    padding: 0.8rem;
}

.category-scroll {
    display: flex;
    gap: 0.6rem;
    overflow-x: auto;
    scrollbar-width: none;
```

**السطر 881:** `padding`: مسافة داخلية بالقيمة `0.8rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 882:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 884:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 885:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 886:** `gap`: مسافة بين عناصر layout بالقيمة `0.6rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 887:** `overflow-x`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 888:** `scrollbar-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

### السطور 889–896

```css
}

.category-scroll::-webkit-scrollbar {
    display: none;
}

.category-scroll button {
    flex: 0 0 auto;
```

**السطر 889:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 891:** `category-scroll`: ضبط الخاصية المسماة كما في CSS بالقيمة `:-webkit-scrollbar`. القيم هنا تنسيق، مش function JavaScript.

**السطر 892:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 893:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 895:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 896:** `flex`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 0 auto`. القيم هنا تنسيق، مش function JavaScript.

### السطور 897–904

```css
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 0.68rem 1rem;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(245, 245, 245, 0.76);
    font-weight: 950;
}

```

**السطر 897:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 898:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 899:** `padding`: مسافة داخلية بالقيمة `0.68rem 1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 900:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.04)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 901:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.76)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 902:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 903:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 905–912

```css
.category-scroll button.active {
    border-color: var(--accent-red);
    background: var(--accent-red);
    color: #fff;
}

.menu-grid {
    min-height: 360px;
```

**السطر 905:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 906:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `var(--accent-red)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 907:** `background`: خلفية العنصر بالقيمة `var(--accent-red)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 908:** `color`: لون النص بالقيمة `#fff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 909:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 911:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 912:** `min-height`: أقل ارتفاع بالقيمة `360px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 913–920

```css
}

.menu-image {
    height: 190px;
    overflow: hidden;
    background:
        radial-gradient(circle at 50% 45%, rgba(241, 168, 58, 0.18), transparent 7rem),
        #111;
```

**السطر 913:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 915:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 916:** `height`: الارتفاع بالقيمة `190px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 917:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 918:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 919:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 920:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 921–928

```css
}

.menu-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

```

**السطر 921:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 923:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 924:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 925:** `height`: الارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 926:** `object-fit`: توزيع الصورة داخل أبعادها بالقيمة `cover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 927:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 929–936

```css
.menu-image-placeholder {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-size: 4rem;
}

```

**السطر 929:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 930:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 931:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 932:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 933:** `height`: الارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 934:** `font-size`: حجم الخط بالقيمة `4rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 935:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 937–944

```css
.empty-menu-state {
    padding: 4rem 1rem;
    text-align: center;
    color: rgba(245, 245, 245, 0.66);
}

.cart-drawer {
    background: var(--bg-secondary);
```

**السطر 937:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 938:** `padding`: مسافة داخلية بالقيمة `4rem 1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 939:** `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 940:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.66)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 941:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 943:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 944:** `background`: خلفية العنصر بالقيمة `var(--bg-secondary)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 945–952

```css
    color: var(--text-main);
}

.cart-drawer .offcanvas-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-drawer .btn-close {
```

**السطر 945:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 946:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 948:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 949:** `border-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid rgba(255, 255, 255, 0.08)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 950:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 952:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 953–960

```css
    filter: invert(1);
}

.cart-branch,
.checkout-panel {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 1rem;
```

**السطر 953:** `filter`: تأثير على العنصر ومحتواه بالقيمة `invert(1)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 954:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 956:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 957:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 958:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.08)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 959:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 960:** `padding`: مسافة داخلية بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 961–968

```css
    background: rgba(255, 255, 255, 0.035);
}

.cart-branch {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 1rem;
```

**السطر 961:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.035)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 962:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 964:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 965:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 966:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 967:** `gap`: مسافة بين عناصر layout بالقيمة `0.2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 968:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 969–976

```css
}

.cart-branch span,
.cart-line span {
    color: rgba(245, 245, 245, 0.58);
    font-size: 0.86rem;
}

```

**السطر 969:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 971:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 972:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 973:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.58)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 974:** `font-size`: حجم الخط بالقيمة `0.86rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 975:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 977–984

```css
.cart-empty {
    padding: 2rem 0;
    color: rgba(245, 245, 245, 0.68);
}

.cart-lines {
    display: grid;
    gap: 0.8rem;
```

**السطر 977:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 978:** `padding`: مسافة داخلية بالقيمة `2rem 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 979:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.68)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 980:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 982:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 983:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 984:** `gap`: مسافة بين عناصر layout بالقيمة `0.8rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 985–992

```css
    margin-bottom: 1rem;
}

.cart-line {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.7rem;
    padding: 0.9rem;
```

**السطر 985:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 986:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 988:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 989:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 990:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 991:** `gap`: مسافة بين عناصر layout بالقيمة `0.7rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 992:** `padding`: مسافة داخلية بالقيمة `0.9rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 993–1000

```css
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
}

.cart-line div:first-child {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
```

**السطر 993:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 994:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.04)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 995:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 997:** `div`: ضبط الخاصية المسماة كما في CSS بالقيمة `first-child`. القيم هنا تنسيق، مش function JavaScript.

**السطر 998:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 999:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1000:** `gap`: مسافة بين عناصر layout بالقيمة `0.25rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1001–1008

```css
}

.cart-controls {
    display: flex;
    align-items: center;
    gap: 0.45rem;
}

```

**السطر 1001:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1003:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1004:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1005:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1006:** `gap`: مسافة بين عناصر layout بالقيمة `0.45rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1007:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1009–1016

```css
.cart-controls button {
    width: 30px;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
}
```

**السطر 1009:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1010:** `width`: العرض بالقيمة `30px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1011:** `height`: الارتفاع بالقيمة `30px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1012:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1013:** `border-radius`: تدوير الحواف بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1014:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.05)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1015:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1016:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1017–1024

```css

.remove-line {
    grid-column: span 2;
    width: fit-content;
    border: 0;
    background: transparent;
    color: #ff7676;
    font-weight: 900;
```

**السطر 1018:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1019:** `grid-column`: ضبط الخاصية المسماة كما في CSS بالقيمة `span 2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1020:** `width`: العرض بالقيمة `fit-content`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1021:** `border`: حدود العنصر بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1022:** `background`: خلفية العنصر بالقيمة `transparent`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1023:** `color`: لون النص بالقيمة `#ff7676`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1024:** `font-weight`: وزن الخط بالقيمة `900`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1025–1032

```css
}

.checkout-radio {
    margin-bottom: 0.6rem;
}

.cart-total {
    display: flex;
```

**السطر 1025:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1027:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1028:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.6rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1029:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1031:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1032:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1033–1040

```css
    justify-content: space-between;
    margin: 1rem 0;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-total strong {
    color: var(--accent-gold);
```

**السطر 1033:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1034:** `margin`: مسافة خارجية بالقيمة `1rem 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1035:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1036:** `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid rgba(255, 255, 255, 0.08)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1037:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1039:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1040:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1041–1048

```css
}

.cart-message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 0.85rem;
    background: rgba(241, 168, 58, 0.11);
    color: var(--accent-gold);
```

**السطر 1041:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1043:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1044:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1045:** `padding`: مسافة داخلية بالقيمة `0.75rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1046:** `border-radius`: تدوير الحواف بالقيمة `0.85rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1047:** `background`: خلفية العنصر بالقيمة `rgba(241, 168, 58, 0.11)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1048:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1049–1056

```css
    font-weight: 800;
}

.auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 8rem 1rem 3rem;
```

**السطر 1049:** `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1050:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1052:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1053:** `min-height`: أقل ارتفاع بالقيمة `100vh`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1054:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1055:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1056:** `padding`: مسافة داخلية بالقيمة `8rem 1rem 3rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1057–1064

```css
    background:
        radial-gradient(circle at 20% 20%, rgba(227, 38, 38, 0.12), transparent 26rem),
        var(--bg-primary);
}

.auth-card {
    width: min(100%, 470px);
    border: 1px solid rgba(255, 255, 255, 0.09);
```

**السطر 1057:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1058:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1059:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1060:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1062:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1063:** `width`: العرض بالقيمة `min(100%, 470px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1064:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.09)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1065–1072

```css
    border-radius: 8px;
    background: rgba(26, 26, 26, 0.88);
    color: var(--text-main);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
}

.auth-card .card-body {
    padding: 2rem;
```

**السطر 1065:** `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1066:** `background`: خلفية العنصر بالقيمة `rgba(26, 26, 26, 0.88)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1067:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1068:** `box-shadow`: ظل العنصر بالقيمة `0 30px 90px rgba(0, 0, 0, 0.35)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1069:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1071:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1072:** `padding`: مسافة داخلية بالقيمة `2rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1073–1080

```css
}

.auth-card h1 {
    font-size: 2.8rem;
    font-weight: 1000;
    letter-spacing: 0;
}

```

**السطر 1073:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1075:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1076:** `font-size`: حجم الخط بالقيمة `2.8rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1077:** `font-weight`: وزن الخط بالقيمة `1000`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1078:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1079:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1081–1088

```css
.auth-card .form-label {
    color: rgba(245, 245, 245, 0.78);
    font-weight: 800;
}

.auth-card .form-control {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.055);
```

**السطر 1081:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1082:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.78)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1083:** `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1084:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1086:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1087:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.1)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1088:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.055)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1089–1096

```css
    color: var(--text-main);
    border-radius: 0.9rem;
    padding: 0.8rem 0.9rem;
}

.auth-card .form-control:focus {
    border-color: rgba(241, 168, 58, 0.55);
    box-shadow: 0 0 0 0.2rem rgba(241, 168, 58, 0.12);
```

**السطر 1089:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1090:** `border-radius`: تدوير الحواف بالقيمة `0.9rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1091:** `padding`: مسافة داخلية بالقيمة `0.8rem 0.9rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1092:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1094:** `form-control`: ضبط الخاصية المسماة كما في CSS بالقيمة `focus`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1095:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(241, 168, 58, 0.55)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1096:** `box-shadow`: ظل العنصر بالقيمة `0 0 0 0.2rem rgba(241, 168, 58, 0.12)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1097–1104

```css
    background: rgba(255, 255, 255, 0.07);
    color: var(--text-main);
}

.auth-switch {
    margin: 1.2rem 0 0;
    color: rgba(245, 245, 245, 0.62);
    text-align: center;
```

**السطر 1097:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.07)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1098:** `color`: لون النص بالقيمة `var(--text-main)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1099:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1101:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1102:** `margin`: مسافة خارجية بالقيمة `1.2rem 0 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1103:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.62)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1104:** `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1105–1112

```css
}

.auth-switch a {
    color: var(--accent-gold);
    font-weight: 950;
}

@media (max-width: 1199px) {
```

**السطر 1105:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1107:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1108:** `color`: لون النص بالقيمة `var(--accent-gold)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1109:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1110:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1112:** `max-width`: أقصى عرض بالقيمة `1199px)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1113–1120

```css
    .mobile-menu {
        display: block;
    }

    .nav-grid {
        grid-template-columns: auto 1fr auto;
    }

```

**السطر 1113:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1114:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1115:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1117:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1118:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `auto 1fr auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1119:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1121–1128

```css
    .nav-left {
        position: absolute;
        top: 92px;
        left: 1rem;
        right: 1rem;
        display: none;
        flex-direction: column;
        align-items: stretch;
```

**السطر 1121:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1122:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1123:** `top`: المسافة من أعلى بالقيمة `92px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1124:** `left`: المسافة من الشمال بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1125:** `right`: المسافة من اليمين بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1126:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1127:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1128:** `align-items`: محاذاة على المحور العرضي بالقيمة `stretch`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1129–1136

```css
        padding: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        background: rgba(18, 18, 18, 0.98);
    }

    .nav-left.show {
        display: flex;
```

**السطر 1129:** `padding`: مسافة داخلية بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1130:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.1)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1131:** `border-radius`: تدوير الحواف بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1132:** `background`: خلفية العنصر بالقيمة `rgba(18, 18, 18, 0.98)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1133:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1135:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1136:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1137–1144

```css
    }

    .nav-left a {
        padding: 0.65rem 0;
    }

    .mode-toggle button {
        padding: 0.6rem 0.75rem;
```

**السطر 1137:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1139:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1140:** `padding`: مسافة داخلية بالقيمة `0.65rem 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1141:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1143:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1144:** `padding`: مسافة داخلية بالقيمة `0.6rem 0.75rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1145–1152

```css
        font-size: 0.68rem;
    }
}

@media (max-width: 991px) {
    .hero-organic-grid {
        grid-template-columns: 1fr;
        padding-top: 8rem;
```

**السطر 1145:** `font-size`: حجم الخط بالقيمة `0.68rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1146:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1147:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1149:** `max-width`: أقصى عرض بالقيمة `991px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1150:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1151:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1152:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `8rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1153–1160

```css
    }

    .hero-copy {
        padding: 0 1rem;
    }

    .hero-pizza-zone {
        min-height: 520px;
```

**السطر 1153:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1155:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1156:** `padding`: مسافة داخلية بالقيمة `0 1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1157:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1159:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1160:** `min-height`: أقل ارتفاع بالقيمة `520px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1161–1168

```css
        justify-content: center;
        padding: 1rem;
    }

    .pizza-blend-mask {
        left: 0;
        top: -20%;
        width: 100%;
```

**السطر 1161:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1162:** `padding`: مسافة داخلية بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1163:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1165:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1166:** `left`: المسافة من الشمال بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1167:** `top`: المسافة من أعلى بالقيمة `-20%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1168:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1169–1176

```css
        height: 50%;
        background: linear-gradient(180deg, var(--bg-primary), rgba(18, 18, 18, 0.55), transparent);
    }

    .pizza-hero-disk {
        width: min(88vw, 620px);
    }

```

**السطر 1169:** `height`: الارتفاع بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1170:** `background`: خلفية العنصر بالقيمة `linear-gradient(180deg, var(--bg-primary), rgba(18, 18, 18, 0.55), transparent)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1171:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1173:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1174:** `width`: العرض بالقيمة `min(88vw, 620px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1175:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1177–1184

```css
    .contact-strip,
    .selected-branch-bar,
    .category-subnav {
        flex-direction: column;
        align-items: flex-start;
    }

    .site-footer-grid {
```

**السطر 1177:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1178:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1179:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1180:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1181:** `align-items`: محاذاة على المحور العرضي بالقيمة `flex-start`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1182:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1184:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 1185–1192

```css
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .falling-topping {
        transform: scale(0.82);
    }
}

```

**السطر 1185:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(2, minmax(0, 1fr))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1186:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1188:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1189:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `scale(0.82)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1190:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1191:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1193–1200

```css
@media (max-width: 767px) {
    .section-padding {
        padding: 4.5rem 0;
    }

    .nav-grid {
        min-height: 78px;
    }
```

**السطر 1193:** `max-width`: أقصى عرض بالقيمة `767px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1194:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1195:** `padding`: مسافة داخلية بالقيمة `4.5rem 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1196:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1198:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1199:** `min-height`: أقل ارتفاع بالقيمة `78px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1200:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1201–1208

```css

    .nav-left {
        top: 78px;
    }

    .nav-right {
        display: none;
    }
```

**السطر 1202:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1203:** `top`: المسافة من أعلى بالقيمة `78px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1204:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1206:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1207:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1208:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1209–1216

```css

    .brand-logo-img {
        width: 135px;
    }

    .hero-copy h1 {
        font-size: clamp(3rem, 16vw, 4.6rem);
    }
```

**السطر 1210:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1211:** `width`: العرض بالقيمة `135px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1212:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1214:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1215:** `font-size`: حجم الخط بالقيمة `clamp(3rem, 16vw, 4.6rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1216:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1217–1224

```css

    .hero-actions,
    .contact-actions,
    .selected-actions {
        width: 100%;
        flex-direction: column;
    }

```

**السطر 1218:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1219:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1220:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1221:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1222:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1223:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1225–1232

```css
    .hero-actions .btn,
    .contact-actions .btn,
    .selected-actions .btn {
        width: 100%;
    }

    .hero-stats {
        flex-direction: column;
```

**السطر 1225:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1226:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1227:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1228:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1229:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1231:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1232:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1233–1240

```css
    }

    .hero-pizza-zone {
        min-height: 430px;
    }

    .salami-three,
    .meat-three {
```

**السطر 1233:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1235:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1236:** `min-height`: أقل ارتفاع بالقيمة `430px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1237:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1239:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 1240:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 1241–1248

```css
        display: none;
    }

    .category-subnav {
        top: 88px;
    }

    .site-footer {
```

**السطر 1241:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1242:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1244:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1245:** `top`: المسافة من أعلى بالقيمة `88px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1246:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1248:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 1249–1256

```css
        padding-top: 4.5rem;
    }

    .site-footer-heading {
        margin-bottom: 3rem;
    }

    .site-footer-grid {
```

**السطر 1249:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `4.5rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1250:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1252:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1253:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `3rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1254:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1256:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 1257–1264

```css
        grid-template-columns: 1fr;
        gap: 2.4rem;
    }

    .site-footer-bottom {
        flex-direction: column;
        align-items: flex-start;
        margin-top: 3rem;
```

**السطر 1257:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1258:** `gap`: مسافة بين عناصر layout بالقيمة `2.4rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1259:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1261:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1262:** `flex-direction`: اتجاه ترتيب flex بالقيمة `column`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1263:** `align-items`: محاذاة على المحور العرضي بالقيمة `flex-start`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1264:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `3rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 1265–1271

```css
    }

    .auth-card .card-body {
        padding: 1.35rem;
    }
}

```

**السطر 1265:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1267:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 1268:** `padding`: مسافة داخلية بالقيمة `1.35rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 1269:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1270:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
