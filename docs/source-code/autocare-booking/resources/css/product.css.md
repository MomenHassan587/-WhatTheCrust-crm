# resources/css/product.css

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/css/product.css` · 377 سطر.

**وظيفة الملف:** ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../autocare-booking/resources/css/product.css). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```css
/* Shared product surfaces: deep green structure, cream reading, amber attention. */
:root { --cream: #f7f4ed; --paper: #fffdf8; --ink: #153d34; --amber: #b67526; --amber-pale: #fff0d5; }
svg { width: 22px; height: 22px; flex-shrink: 0; vertical-align: middle; }
button, input, select { touch-action: manipulation; }
[id] { scroll-margin-top: 100px; }
.navbar { background: linear-gradient(180deg, rgba(6,45,39,.86), rgba(6,45,39,.28)); }
.navbar.is-scrolled { background: rgba(6,45,39,.96); }
.nav-links .nav-garage { display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-left: 8px; color: var(--primary-deep); background: var(--cream-strong); }
.nav-links .nav-garage:hover { color: var(--primary-deep); background: #fff2df; }
.nav-garage svg { width: 18px; height: 18px; }
.service-icon svg { width: 24px; height: 24px; }
.service-footer strong { color: #fff2db; }
.diagnosis-kicker svg { width: 15px; height: 15px; }
.diagnosis-status-icon { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; color: var(--status-color); }
.diagnosis-status-icon svg { width: 16px; height: 16px; }
.diagnosis-card-copy small { display: block; color: #e8e5dc; font-size: 12px; }
.diagnosis-disclaimer { margin-top: 14px; color: #d0dcd5; font-size: 11px; line-height: 1.5; }
.story-mode-control { position: relative; z-index: 5; width: min(1180px,calc(100% - 28px)); margin: 0 auto; padding-top: 100px; }
.story-mode-message { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border: 1px solid #597968; border-radius: 10px; background: #173f32; color: #f4f1e5; }
.story-mode-message p { flex: 1; font-size: 12px; line-height: 1.7; }
.story-mode-message .btn { min-height: 40px; padding: 0 15px; background: #f1dcc0; color: #163e30; font-size: 12px; white-space: nowrap; }
.story.is-fallback .story-stage { padding-top: 0; }
@media(max-width:767px) {
    .story-mode-control { padding-top: 88px; }
    .story-mode-message { flex-wrap: wrap; padding: 15px; gap: 10px; }
    .story-mode-message > svg { display: none; }
    .story-mode-message p { flex-basis: 100%; }
}
.status-badge { width: fit-content; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid transparent; border-radius: 8px; font-size: 11px; font-weight: 800; line-height: 1.4; }
.status-badge svg { width: 14px; height: 14px; }
.status-badge--neutral { color: #41564b; background: #eceee7; border-color: #dce3da; }
.status-badge--green { color: #1c5c42; background: #e4f1e7; border-color: #c9e1cd; }
.status-badge--amber { color: #75480b; background: #fff0d5; border-color: #efd7af; }
.demo-label { display: inline-flex; padding: 5px 9px; color: #6a572e; background: #f0e7d5; border: 1px solid #e1d4ba; border-radius: 6px; font-size: 10px; line-height: 1.5; font-weight: 750; letter-spacing: .025em; }
.editorial-kicker { color: #627368; font-size: 11px; font-weight: 850; letter-spacing: .12em; text-transform: uppercase; }
.section-overline { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 0; margin-bottom: 36px; color: #69786c; border-top: 1px solid #dcded3; font-size: 10px; letter-spacing: .12em; font-weight: 800; }
.text-link { display: inline-flex; align-items: center; gap: 9px; padding: 0; background: none; border: 0; color: var(--ink); font-size: 13px; font-weight: 800; cursor: pointer; }
.text-link:hover { text-decoration: underline; text-underline-offset: 5px; }
.text-link svg { width: 17px; height: 17px; }
.btn svg { width: 18px; height: 18px; margin-left: 10px; }
.workshop-section { padding-bottom: 80px; background: var(--cream); color: var(--ink); }
.trust-strip { display: grid; grid-template-columns: repeat(4,1fr); margin-bottom: 75px; padding: 28px 0; }
.trust-strip > a { display: flex; gap: 14px; align-items: center; padding: 10px 20px; border-right: 1px solid #dddfd6; }
.trust-strip > a:first-child { padding-left: 0; }
.trust-strip > a:last-child { border: 0; }
.trust-strip svg { width: 25px; height: 25px; color: #356651; }
.trust-strip strong, .trust-strip small { display: block; }
.trust-strip strong { font-size: 13px; }
.trust-strip small { margin-top: 5px; color: #718072; font-size: 11px; }
.workshop-editorial { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 65px; }
.workshop-copy h2, .support-heading h2, .faq-intro h2 { margin: 16px 0 22px; font-size: clamp(34px,3.7vw,52px); line-height: 1.08; font-weight: 600; letter-spacing: -.052em; }
.workshop-copy h2 em, .support-heading h2 em, .faq-intro h2 em { font-family: Georgia, serif; color: #53735c; font-weight: 400; }
.workshop-copy > p:not(.editorial-kicker) { max-width: 460px; color: #6a776c; font-size: 15px; line-height: 1.85; }
.care-promises { display: grid; gap: 20px; margin: 30px 0; list-style: none; }
.care-promises li { display: flex; gap: 14px; }
.care-promises svg { width: 24px; height: 24px; padding: 4px; border-radius: 50%; background: #e3e9dc; color: #476a49; }
.care-promises strong, .care-promises small { display: block; }
.care-promises strong { font-size: 13px; }
.care-promises small { margin-top: 5px; color: #718072; font-size: 12px; line-height: 1.6; }
.workshop-photos { position: relative; height: 510px; padding-bottom: 36px; }
.workshop-photos figure { position: absolute; overflow: hidden; border-radius: 5px; background: #173a2e; }
.workshop-photos img { display: block; width: 100%; height: 100%; object-fit: cover; }
.photo-main { width: 75%; height: 90%; left: 0; top: 0; }
.photo-main img { object-position: 50% 68%; }
.photo-detail { width: 45%; height: 59%; right: 0; bottom: 36px; border: 7px solid var(--cream); }
.workshop-photos figcaption { position: absolute; inset: auto 0 0; padding: 50px 18px 18px; color: white; background: linear-gradient(transparent,rgba(0,24,19,.86)); font-size: 11px; letter-spacing: .04em; }
.photo-disclosure { position: absolute; left: 0; bottom: 8px; color: #788174; font-size: 10px; }
.supported-makes { margin-top: 65px; border-block: 1px solid #dcded3; padding: 25px 0; text-align: center; }
.supported-makes p { color: #7a8378; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }
.supported-makes > div { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px 50px; margin-top: 22px; }
.supported-makes span { color: #47624e; font-size: 18px; font-weight: 700; letter-spacing: -.04em; }
.garage-preview { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; padding: 55px 65px; margin-top: 65px; overflow: hidden; background: #0b392e; color: var(--cream); border-radius: 10px; }
.garage-preview .editorial-kicker { color: #acc1ad; }
.garage-preview h3 { margin: 16px 0; font-size: clamp(34px,3.4vw,47px); font-weight: 500; letter-spacing: -.055em; line-height: 1.08; }
.garage-preview-copy > p { color: #bbcbba; font-size: 13px; line-height: 1.8; max-width: 340px; margin-bottom: 24px; }
.garage-preview .btn { min-height: 45px; font-size: 12px; box-shadow: none; }
.preview-ticket { padding: 25px; border-radius: 12px; color: #1c4034; background: #faf7f0; box-shadow: 0 20px 40px #00180f55; transform: rotate(-3deg); }
.ticket-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.ticket-top > svg { width: 38px; height: 38px; }
.ticket-caption { color: #7b8578; letter-spacing: .11em; font-size: 9px; font-weight: 800; }
.preview-ticket h4 { margin: 8px 0 20px; font-size: 23px; font-weight: 650; letter-spacing: -.04em; }
.preview-ticket h4 small { font-size: 12px; color: #82907e; margin-left: 10px; }
.ticket-appointment { display: flex; gap: 13px; padding: 18px 0; border-top: 1px solid #dedfd4; }
.ticket-appointment strong, .ticket-appointment span { display: block; font-size: 12px; }
.ticket-appointment span { margin-top: 5px; font-size: 11px; color: #7d877b; }
.ticket-footer { display: flex; justify-content: space-between; border-top: 1px dashed #d5dacd; padding-top: 16px; font-size: 10px; color: #718170; }
.ticket-footer svg { width: 16px; height: 16px; }
.booking-section { border-top: 1px solid #dcded3; }
.booking-form { background: var(--paper); border-radius: 10px; box-shadow: 0 12px 40px #163d2b08; }
.booking-info h2 { color: var(--ink); font-weight: 550; }
.info-box { border-radius: 10px; box-shadow: none; }
.info-box > svg { margin-bottom: 12px; }
.booking-demo-note { margin-top: 20px; color: #74806f; font-size: 11px; line-height: 1.8; }
.booking-demo-note .status-badge { margin-right: 6px; }
.form-group input, .form-group select, .form-group textarea { border-radius: 8px; background: #f8f6ef; }
.alert svg { width: 18px; height: 18px; margin-right: 8px; }
.alert-success a { display: block; margin-top: 12px; text-decoration: underline; text-underline-offset: 3px; }
.reviews-section { padding: 50px 0 85px; background: #efeee5; color: var(--ink); }
.support-heading { display: flex; align-items: end; justify-content: space-between; gap: 40px; margin-bottom: 35px; }
.support-heading h2 { margin: 0; }
.support-heading > p { max-width: 350px; font-size: 13px; line-height: 1.8; color: #72806e; }
.review-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.review-card { background: var(--paper); padding: 27px; border: 1px solid #e0e1d6; border-radius: 8px; }
.review-mark { color: #86a17d; font: 50px/.8 Georgia,serif; }
.review-card blockquote { min-height: 100px; margin: 15px 0 25px; font-size: 14px; line-height: 1.8; color: #4d6350; }
.review-person { display: flex; align-items: center; gap: 11px; }
.review-person > span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: #e6eadb; color: #53744e; font-size: 12px; font-weight: 800; }
.review-person strong, .review-person small { display: block; font-size: 12px; }
.review-person small { margin-top: 3px; color: #7c8576; font-size: 10px; }
.faq-section { padding: 90px 0; background: var(--cream); color: var(--ink); }
.faq-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 90px; }
.faq-intro > p:not(.editorial-kicker) { font-size: 13px; line-height: 1.8; color: #7a8475; margin: 15px 0 25px; }
.faq-list details { border-bottom: 1px solid #dbded2; }
.faq-list summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; list-style: none; font-size: 14px; font-weight: 650; cursor: pointer; }
.faq-list summary::-webkit-details-marker { display: none; }
.faq-list summary svg { width: 18px; height: 18px; color: #74886a; transition: transform .2s; }
.faq-list details[open] summary svg { transform: rotate(45deg); }
.faq-list details > p { padding-bottom: 24px; max-width: 580px; color: #6f7d6c; font-size: 13px; line-height: 1.85; }
.contact-section { background: #0b392e; color: #f7f4ed; padding: 25px 0 70px; }
.contact-section .section-overline { border-color: #315448; color: #9eb3a1; }
.contact-section .demo-label { background: #244f3e; color: #c8d4bb; border-color: #476248; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.contact-intro .editorial-kicker { color: #adc0a8; }
.contact-intro h2 { margin: 18px 0; font-size: clamp(40px,4.5vw,62px); letter-spacing: -.06em; font-weight: 500; line-height: 1.05; }
.contact-intro > p:not(.editorial-kicker) { max-width: 330px; margin-bottom: 26px; color: #bacbb7; font-size: 14px; line-height: 1.8; }
.contact-details { display: grid; gap: 26px; }
.contact-details article { display: flex; gap: 17px; }
.contact-details article > svg { color: #bbceb4; width: 20px; height: 20px; margin-top: 3px; }
.contact-details article > div { flex: 1; min-width: 0; }
.contact-details h3 { font-size: 14px; font-weight: 650; margin-bottom: 8px; }
.contact-details p { font-size: 13px; color: #d3dfca; }
.contact-details small { display: block; color: #98b09b; font-size: 11px; line-height: 1.7; margin-top: 7px; }
.contact-details a { display: inline-flex; gap: 12px; margin-top: 12px; border-bottom: 1px solid #869d7b; font-size: 12px; padding-bottom: 4px; }
.contact-details .inline-demo { display: inline; font-size: 9px; margin-left: 8px; font-weight: 400; }
.hours-row { display: flex; justify-content: space-between; gap: 16px; margin-top: 5px; }
.hours-row strong { font-weight: 550; }
.footer { background: #062d27; border-color: #315448; color: var(--cream); }
.footer p, .footer-links a { color: #b1c3af; font-size: 12px; }
.footer-demo { display: block; margin-top: 7px; color: #89a38c; font-size: 10px; }
.footer-links a:hover { background: #264c3e; color: white; }

/* My Garage: a separate customer workspace. */
.garage-app { min-height: 100vh; background: #f5f3ec; color: #254335; }
.garage-sidebar { position: fixed; inset: 0 auto 0 0; z-index: 20; display: flex; flex-direction: column; width: 248px; padding: 32px 22px 24px; background: #0b392e; color: #e6efde; }
.garage-sidebar .brand { padding-left: 8px; }
.garage-sidebar .brand strong { font-size: 21px; }
.garage-sidebar .brand small { letter-spacing: .14em; font-size: 9px; }
.sidebar-caption { margin: 45px 14px 18px; color: #819d84; font-size: 9px; line-height: 1.8; letter-spacing: .13em; }
.garage-sidebar nav { display: grid; gap: 5px; }
.garage-sidebar nav button { display: flex; align-items: center; gap: 12px; padding: 14px; color: #adc3ac; border: 0; border-radius: 7px; background: transparent; cursor: pointer; font-size: 12px; font-weight: 600; text-align: left; }
.garage-sidebar nav button svg { width: 19px; height: 19px; }
.garage-sidebar nav button:hover { background: #1a4939; color: white; }
.garage-sidebar nav button.selected { background: #f2eddc; color: #173f2d; }
.nav-count { margin-left: auto; background: #e4e5d5; padding: 2px 7px; border-radius: 5px; color: #3c5a40; font-size: 10px; }
.sidebar-help { margin: auto 10px 25px; padding: 20px 15px; border: 1px solid #315640; border-radius: 8px; }
.sidebar-help > svg { color: #b8c8a3; width: 23px; height: 23px; margin-bottom: 12px; }
.sidebar-help strong { display: block; font-size: 13px; }
.sidebar-help p { font-size: 11px; color: #91af91; line-height: 1.8; margin: 9px 0 17px; }
.sidebar-help a { display: flex; align-items: center; justify-content: space-between; color: #c0d1b8; font-size: 10px; }
.sidebar-help a svg { width: 14px; height: 14px; }
.back-to-site { display: flex; align-items: center; gap: 10px; padding: 10px; font-size: 11px; color: #a9c1a7; }
.garage-main { margin-left: 248px; min-width: 0; }
.garage-topbar { height: 79px; display: flex; justify-content: space-between; align-items: center; gap: 16px; border-bottom: 1px solid #e1e3d9; padding: 0 40px; background: #fbf9f2; }
.breadcrumb { color: #7a8878; font-size: 11px; }
.breadcrumb > span { margin: 0 12px; color: #b4bca9; }
.garage-profile { display: flex; align-items: center; gap: 18px; }
.profile-avatar { display: grid; place-items: center; width: 33px; height: 33px; background: #dfe6d4; color: #476747; border-radius: 50%; font-size: 10px; font-weight: 800; }
.garage-content { max-width: 1440px; padding: 38px 40px 0; margin: 0 auto; }
.garage-page-heading { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 27px; }
.garage-page-heading h1 { font-size: clamp(28px,3vw,40px); line-height: 1.15; font-weight: 550; letter-spacing: -.055em; margin: 8px 0; }
.garage-page-heading > div > p:last-child { font-size: 12px; color: #899080; }
.garage-primary { min-height: 43px; border-radius: 7px; color: #fbfaee; background: #173f30; font-size: 11px; font-weight: 700; box-shadow: none; white-space: nowrap; gap: 7px; padding: 0 17px; }
.garage-primary:hover { background: #285841; box-shadow: 0 6px 16px #1f4b2d12; }
.garage-primary svg { width: 16px; height: 16px; margin-left: 0; }
.demo-notice { display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #eceee1; border: 1px solid #dde3d0; border-radius: 7px; color: #748068; margin-bottom: 25px; font-size: 10px; line-height: 1.7; }
.demo-notice > svg { width: 17px; height: 17px; color: #6b825b; }
.demo-notice strong { color: #516547; font-weight: 750; }
.dashboard-notice { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding: 14px; background: #e3f0df; border-radius: 6px; font-size: 12px; }
.garage-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-bottom: 22px; }
.garage-stats article { display: flex; align-items: center; gap: 17px; padding: 22px; border: 1px solid #e0e2d5; border-radius: 8px; background: #fbfaf5; }
.stat-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 10px; background: #eaf0e2; color: #607c52; }
.stat-icon svg { width: 21px; height: 21px; }
.garage-stats article > div > span { display: block; font-size: 10px; color: #89927f; }
.garage-stats strong { display: block; font-size: 29px; font-weight: 550; letter-spacing: -.05em; margin-top: 3px; }
.garage-stats .stat-word { font-size: 19px; letter-spacing: -.035em; }
.dashboard-two-col { display: grid; grid-template-columns: 1.1fr 1fr; gap: 22px; }
.dashboard-card { padding: 24px; background: #fffdf7; border: 1px solid #e0e2d5; border-radius: 9px; margin-bottom: 22px; min-width: 0; }
.card-heading { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 20px; }
.card-heading h2 { font-size: 15px; font-weight: 650; letter-spacing: -.025em; }
.card-heading .text-link { font-size: 10px; }
.card-heading .text-link svg { width: 13px; height: 13px; }
.card-kicker { display: block; color: #899581; font-size: 9px; letter-spacing: .07em; font-weight: 700; margin-bottom: 7px; }
.visit-date { display: flex; align-items: center; gap: 13px; margin-bottom: 23px; }
.visit-date > span { display: grid; place-items: center; width: 56px; height: 60px; border-radius: 8px; background: #f0efe5; font-size: 27px; font-weight: 500; }
.visit-date > div { color: #435d41; font-size: 13px; font-weight: 650; }
.visit-date small { display: block; color: #8a9482; font-size: 10px; font-weight: 400; margin-top: 6px; }
.visit-date > .status-badge { width: auto; height: auto; display: inline-flex; margin-left: auto; font-size: 10px; white-space: nowrap; }
.next-visit h3 { font-size: 22px; font-weight: 550; letter-spacing: -.04em; }
.muted { color: #84907d; font-size: 12px; line-height: 1.8; }
.visit-footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 23px; padding-top: 17px; border-top: 1px solid #e8e9dc; }
.visit-footer > span { color: #86947e; font-size: 10px; }
.visit-footer svg { width: 12px; height: 12px; margin-right: 3px; }
.visit-footer .text-link { font-size: 10px; }
.vehicle-feature { background: #eef0e4; }
.vehicle-art { position: relative; display: flex; align-items: center; justify-content: center; height: 115px; overflow: hidden; color: #4b6d4b; }
.vehicle-art > svg { width: 150px; height: 95px; stroke-width: .7; z-index: 1; }
.vehicle-art > span { position: absolute; bottom: -5px; color: #d9dfcc; font-size: 70px; font-weight: 950; letter-spacing: -.07em; line-height: 1; }
.vehicle-feature-info { position: relative; display: flex; justify-content: space-between; gap: 15px; align-items: center; margin-top: 20px; }
.vehicle-feature-info h3 { font-size: 15px; font-weight: 650; }
.vehicle-feature-info p { font-size: 10px; color: #8a9680; margin-top: 6px; }
.vehicle-feature-info > span { font-size: 18px; font-weight: 600; text-align: right; letter-spacing: -.04em; }
.vehicle-feature-info small { display: block; margin-top: 5px; color: #8c997f; font-size: 9px; font-weight: 400; letter-spacing: 0; }
.repair-summary { display: flex; align-items: center; gap: 13px; padding: 4px 0 24px; }
.repair-icon { display: grid; place-items: center; width: 38px; height: 38px; background: #eef0e3; border-radius: 8px; color: #6c805d; }
.repair-summary h3 { font-size: 13px; font-weight: 650; }
.repair-summary p { font-size: 10px; color: #8b947f; margin-top: 5px; }
.sample-update { color: #8e977f; font-size: 10px; margin-left: auto; }
.repair-timeline { display: grid; grid-template-columns: repeat(4,1fr); list-style: none; margin: 10px 0 25px; }
.repair-timeline li { position: relative; display: grid; justify-items: center; text-align: center; gap: 7px; }
.repair-timeline li::before { content: ''; position: absolute; top: 17px; left: -50%; right: 50%; border-top: 1px solid #dce1cf; }
.repair-timeline li:first-child::before { display: none; }
.repair-timeline li > span { z-index: 1; width: 34px; height: 34px; display: grid; place-items: center; background: #f0f0e5; color: #a2ac91; border: 5px solid #fffdf7; border-radius: 50%; box-sizing: content-box; margin-top: -5px; }
.repair-timeline li > span svg { width: 16px; height: 16px; }
.repair-timeline li.done > span { background: #e0ecd6; color: #456b3c; }
.repair-timeline li.current > span { background: #f5e3ba; color: #80561e; }
.repair-timeline strong { font-size: 11px; font-weight: 650; }
.repair-timeline small { font-size: 9px; color: #88967c; }
.repair-note { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #f4f3e9; color: #88917b; font-size: 10px; border-radius: 6px; line-height: 1.7; }
.repair-note svg { width: 14px; height: 14px; }
.history-list { display: grid; }
.history-row { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 15px; width: 100%; padding: 16px 0; background: none; border: 0; border-top: 1px solid #ecece1; text-align: left; cursor: pointer; color: #4f6447; font-size: 10px; }
.history-row:hover { background: #f5f7ed; }
.history-row:first-child { border-top: 0; }
.history-icon { display: grid; place-items: center; width: 34px; height: 34px; background: #ecf0e1; color: #6e885b; border-radius: 8px; }
.history-icon svg { width: 16px; height: 16px; }
.history-row strong { display: block; font-size: 12px; font-weight: 650; }
.history-row small { display: block; margin-top: 6px; color: #8b9780; font-size: 9px; }
.history-row > svg { width: 15px; height: 15px; color: #98a48d; }
.garage-bottom { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 25px 0; color: #96a087; border-top: 1px solid #dfe3d3; margin-top: 15px; font-size: 9px; }
.garage-bottom a { color: #546f46; font-weight: 650; }
.section-toolbar { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin: 25px 0; }
.section-toolbar > p { font-size: 12px; color: #7f8e74; }
.vehicle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items: start; }
.saved-vehicle .vehicle-art { height: 160px; margin: -5px -5px 25px; border-radius: 5px; background: #f0f1e5; }
.saved-vehicle h2 { font-size: 20px; letter-spacing: -.03em; font-weight: 600; }
.saved-vehicle > p { font-size: 11px; color: #839177; margin-top: 7px; }
.saved-vehicle dl { display: grid; gap: 15px; padding-block: 24px; margin-block: 18px; border-block: 1px solid #e8e9dc; font-size: 11px; }
.saved-vehicle dl > div { display: flex; justify-content: space-between; gap: 20px; }
.saved-vehicle dt { color: #869579; }
.saved-vehicle dd { font-weight: 650; }
.vehicle-actions { display: flex; justify-content: space-between; gap: 20px; }
.subtle-button { padding: 0; font-size: 10px; background: none; border: 0; color: #7d8b73; cursor: pointer; }
.subtle-button:hover { color: #8d4233; text-decoration: underline; }
.add-vehicle-tile { display: grid; place-content: center; justify-items: center; min-height: 280px; background: #eeefe2; border: 1px dashed #bfc9ac; border-radius: 8px; color: #6d865c; cursor: pointer; }
.add-vehicle-tile svg { width: 35px; height: 35px; margin-bottom: 20px; }
.add-vehicle-tile strong { font-size: 14px; font-weight: 650; }
.add-vehicle-tile span { font-size: 11px; color: #8b997d; margin-top: 8px; }
.filter-label { display: flex; gap: 10px; align-items: center; font-size: 11px; color: #8c987e; }
.filter-label select { padding: 9px 13px; max-width: 200px; border: 1px solid #d6ddc9; background: #fffdf7; color: #536e45; font-size: 11px; border-radius: 6px; }
.appointment-card { display: flex; align-items: center; gap: 25px; }
.appointment-date-block { min-width: 68px; padding: 14px 10px; background: #eff0e4; border-radius: 8px; text-align: center; }
.appointment-date-block strong { display: block; font-size: 30px; font-weight: 500; }
.appointment-date-block span { display: block; color: #8a997b; font-size: 10px; margin-top: 5px; }
.appointment-copy { flex: 1; min-width: 0; }
.appointment-copy h2 { font-size: 20px; font-weight: 600; letter-spacing: -.03em; }
.appointment-copy p { font-size: 12px; color: #75876a; margin-top: 8px; }
.appointment-copy small { display: block; margin-top: 10px; font-size: 10px; color: #8d9a7e; }
.appointment-actions { display: grid; justify-items: end; gap: 14px; }
.appointment-actions .text-link { font-size: 11px; }
.empty-state { display: grid; place-items: center; text-align: center; gap: 15px; padding: 35px; }
.empty-state > svg { width: 35px; height: 35px; color: #94a282; }
.empty-state h2, .empty-state h3 { font-size: 19px; font-weight: 550; }
.empty-state p { color: #8a987c; font-size: 12px; }
dialog { width: min(550px, calc(100% - 30px)); max-height: 90svh; padding: 0; margin: auto; color: #274834; background: #fcfaf2; border: 1px solid #dbe0ce; border-radius: 13px; box-shadow: 0 30px 100px #001b1855; }
dialog::backdrop { background: #062d27b8; backdrop-filter: blur(4px); }
.garage-dialog-form { padding: 30px; }
.dialog-heading { display: flex; gap: 20px; justify-content: space-between; align-items: start; margin-bottom: 18px; }
.dialog-heading h2 { margin-top: 7px; font-size: 25px; letter-spacing: -.04em; line-height: 1.2; font-weight: 550; }
.icon-button { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; background: #edf0e0; border: 0; color: #58744a; cursor: pointer; flex-shrink: 0; }
.icon-button svg { width: 17px; height: 17px; }
.dialog-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 25px 0; }
.dialog-fields label { display: grid; gap: 8px; font-size: 11px; font-weight: 650; }
.dialog-fields input { width: 100%; min-width: 0; padding: 11px; border: 1px solid #d6dcc8; border-radius: 5px; background: #fffef9; color: #3e5d38; font-size: 13px; }
.full-field { grid-column: 1/-1; }
.record-car { margin: 25px 0 8px; font-size: 19px; }
.record-notes { font-size: 13px; line-height: 1.9; color: #76886a; margin: 25px 0; }
.record-total { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #dce3ce; font-size: 13px; }
.confirm-actions { display: flex; gap: 25px; margin-top: 25px; align-items: center; }

@media(max-width:1100px) {
    .garage-sidebar { width: 210px; padding-inline: 15px; }
    .garage-main { margin-left: 210px; }
    .garage-content { padding: 28px 24px 0; }
    .garage-topbar { padding-inline: 24px; }
    .dashboard-two-col { grid-template-columns: 1fr; gap: 0; }
    .garage-stats article { padding: 16px 12px; gap: 10px; }
    .workshop-editorial { gap: 35px; }
    .garage-preview { padding: 40px; gap: 40px; }
}
@media(max-width:767px) {
    .nav-links .nav-garage { margin-left: 0; }
    .trust-strip { grid-template-columns: 1fr 1fr; margin-bottom: 35px; padding: 15px 0; gap: 10px; }
    .trust-strip > a { padding: 14px 8px; border: 0; gap: 10px; }
    .trust-strip > a:first-child { padding-left: 8px; }
    .trust-strip strong { font-size: 11px; }
    .trust-strip small { font-size: 10px; }
    .trust-strip svg { width: 20px; height: 20px; }
    .section-overline { align-items: start; margin-bottom: 20px; }
    .section-overline .demo-label { max-width: 160px; letter-spacing: 0; }
    .workshop-editorial, .garage-preview, .faq-grid, .contact-grid { grid-template-columns: 1fr; gap: 35px; }
    .workshop-copy h2, .support-heading h2, .faq-intro h2 { font-size: 37px; }
    .workshop-photos { height: 440px; margin-top: 10px; }
    .supported-makes { margin-top: 30px; }
    .supported-makes > div { gap: 20px 28px; }
    .supported-makes span { font-size: 16px; }
    .garage-preview { padding: 30px 25px 40px; margin-top: 35px; }
    .garage-preview h3 { font-size: 36px; }
    .preview-ticket { transform: rotate(-2deg); }
    .workshop-section { padding-bottom: 45px; }
    .reviews-section { padding-bottom: 45px; }
    .support-heading { display: grid; gap: 18px; margin-bottom: 25px; }
    .review-grid { grid-template-columns: 1fr; }
    .review-card blockquote { min-height: 0; }
    .faq-section { padding: 50px 0; }
    .contact-section { padding-bottom: 45px; }
    .contact-intro h2 { font-size: 44px; }
    .contact-details .hours-row { font-size: 11px; }
    .garage-sidebar { position: relative; width: 100%; padding: 16px 14px 0; }
    .garage-sidebar .brand { padding-left: 0; }
    .sidebar-caption, .sidebar-help, .back-to-site { display: none; }
    .garage-sidebar nav { display: grid; grid-template-columns: repeat(4,1fr); gap: 3px; margin-top: 22px; padding-bottom: 12px; }
    .garage-sidebar nav button { padding: 12px 4px; display: grid; justify-items: center; gap: 7px; font-size: 9px; text-align: center; }
    .garage-sidebar nav .nav-count { display: none; }
    .garage-main { margin-left: 0; }
    .garage-topbar { height: 58px; padding: 0 16px; }
    .breadcrumb { font-size: 10px; }
    .profile-avatar { display: none; }
    .garage-content { padding: 25px 14px 0; }
    .garage-page-heading { display: grid; gap: 18px; }
    .garage-page-heading h1 { font-size: 30px; }
    .garage-page-heading .garage-primary { width: fit-content; }
    .garage-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .garage-stats article:last-child { grid-column: 1/-1; }
    .garage-stats article { padding: 15px 12px; }
    .garage-stats strong { font-size: 25px; }
    .stat-icon { width: 32px; height: 32px; }
    .stat-icon svg { width: 17px; height: 17px; }
    .garage-stats article > div > span { font-size: 9px; }
    .dashboard-card { padding: 20px; }
    .visit-date { gap: 10px; }
    .visit-date > .status-badge { font-size: 8px; padding: 5px 7px; }
    .visit-date > div { font-size: 11px; }
    .visit-date small { font-size: 9px; }
    .sample-update { display: none; }
    .repair-timeline { grid-template-columns: 1fr; gap: 18px; }
    .repair-timeline li { grid-template-columns: auto 1fr auto; justify-items: start; align-items: center; text-align: left; gap: 10px; }
    .repair-timeline li::before { left: 17px; top: -20px; right: auto; height: 30px; border-left: 1px solid #dce1cf; border-top: 0; }
    .repair-timeline li > span { width: 25px; height: 25px; }
    .repair-timeline li::before { left: 17px; }
    .repair-timeline small { justify-self: end; }
    .history-row { grid-template-columns: auto 1fr auto; gap: 10px; }
    .history-row > span:nth-child(3) { grid-column: 2; }
    .history-row > svg { grid-column: 3; grid-row: 1/3; }
    .history-icon { grid-row: 1/3; }
    .vehicle-grid { grid-template-columns: 1fr; gap: 0; }
    .add-vehicle-tile { margin-bottom: 20px; min-height: 180px; }
    .section-toolbar { align-items: start; flex-wrap: wrap; gap: 15px; }
    .appointment-card { align-items: start; gap: 15px; flex-wrap: wrap; }
    .appointment-actions { flex: 1 0 100%; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e3e7d5; padding-top: 20px; gap: 10px; }
    .appointment-actions .text-link { font-size: 10px; }
    .appointment-copy h2 { font-size: 18px; }
    .appointment-date-block { min-width: 58px; }
    .garage-dialog-form { padding: 23px; }
    .dialog-fields { gap: 14px; }
    .garage-bottom { font-size: 8px; }
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```css
/* Shared product surfaces: deep green structure, cream reading, amber attention. */
:root { --cream: #f7f4ed; --paper: #fffdf8; --ink: #153d34; --amber: #b67526; --amber-pale: #fff0d5; }
svg { width: 22px; height: 22px; flex-shrink: 0; vertical-align: middle; }
button, input, select { touch-action: manipulation; }
[id] { scroll-margin-top: 100px; }
.navbar { background: linear-gradient(180deg, rgba(6,45,39,.86), rgba(6,45,39,.28)); }
.navbar.is-scrolled { background: rgba(6,45,39,.96); }
.nav-links .nav-garage { display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-left: 8px; color: var(--primary-deep); background: var(--cream-strong); }
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 2:** `--cream`: ضبط الخاصية المسماة كما في CSS بالقيمة `#f7f4ed`؛ `--paper`: ضبط الخاصية المسماة كما في CSS بالقيمة `#fffdf8`؛ `--ink`: ضبط الخاصية المسماة كما في CSS بالقيمة `#153d34`؛ `--amber`: ضبط الخاصية المسماة كما في CSS بالقيمة `#b67526`؛ `--amber-pale`: ضبط الخاصية المسماة كما في CSS بالقيمة `#fff0d5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 3:** `width`: العرض بالقيمة `22px`؛ `height`: الارتفاع بالقيمة `22px`؛ `flex-shrink`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`؛ `vertical-align`: ضبط الخاصية المسماة كما في CSS بالقيمة `middle`. القيم هنا تنسيق، مش function JavaScript.

**السطر 4:** `touch-action`: ضبط الخاصية المسماة كما في CSS بالقيمة `manipulation`. القيم هنا تنسيق، مش function JavaScript.

**السطر 5:** `scroll-margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `100px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 6:** `background`: خلفية العنصر بالقيمة `linear-gradient(180deg, rgba(6,45,39,.86), rgba(6,45,39,.28))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 7:** `background`: خلفية العنصر بالقيمة `rgba(6,45,39,.96)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 8:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `8px`؛ `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`؛ `color`: لون النص بالقيمة `var(--primary-deep)`؛ `background`: خلفية العنصر بالقيمة `var(--cream-strong)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 9–16

```css
.nav-links .nav-garage:hover { color: var(--primary-deep); background: #fff2df; }
.nav-garage svg { width: 18px; height: 18px; }
.service-icon svg { width: 24px; height: 24px; }
.service-footer strong { color: #fff2db; }
.diagnosis-kicker svg { width: 15px; height: 15px; }
.diagnosis-status-icon { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; color: var(--status-color); }
.diagnosis-status-icon svg { width: 16px; height: 16px; }
.diagnosis-card-copy small { display: block; color: #e8e5dc; font-size: 12px; }
```

**السطر 9:** `nav-garage`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `color`: لون النص بالقيمة `var(--primary-deep)`؛ `background`: خلفية العنصر بالقيمة `#fff2df`. القيم هنا تنسيق، مش function JavaScript.

**السطر 10:** `width`: العرض بالقيمة `18px`؛ `height`: الارتفاع بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 11:** `width`: العرض بالقيمة `24px`؛ `height`: الارتفاع بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 12:** `color`: لون النص بالقيمة `#fff2db`. القيم هنا تنسيق، مش function JavaScript.

**السطر 13:** `width`: العرض بالقيمة `15px`؛ `height`: الارتفاع بالقيمة `15px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 14:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `width`: العرض بالقيمة `28px`؛ `height`: الارتفاع بالقيمة `28px`؛ `border`: حدود العنصر بالقيمة `1px solid currentColor`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `color`: لون النص بالقيمة `var(--status-color)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 15:** `width`: العرض بالقيمة `16px`؛ `height`: الارتفاع بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 16:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `color`: لون النص بالقيمة `#e8e5dc`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 17–24

```css
.diagnosis-disclaimer { margin-top: 14px; color: #d0dcd5; font-size: 11px; line-height: 1.5; }
.story-mode-control { position: relative; z-index: 5; width: min(1180px,calc(100% - 28px)); margin: 0 auto; padding-top: 100px; }
.story-mode-message { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border: 1px solid #597968; border-radius: 10px; background: #173f32; color: #f4f1e5; }
.story-mode-message p { flex: 1; font-size: 12px; line-height: 1.7; }
.story-mode-message .btn { min-height: 40px; padding: 0 15px; background: #f1dcc0; color: #163e30; font-size: 12px; white-space: nowrap; }
.story.is-fallback .story-stage { padding-top: 0; }
@media(max-width:767px) {
    .story-mode-control { padding-top: 88px; }
```

**السطر 17:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `14px`؛ `color`: لون النص بالقيمة `#d0dcd5`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 18:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `5`؛ `width`: العرض بالقيمة `min(1180px,calc(100% - 28px))`؛ `margin`: مسافة خارجية بالقيمة `0 auto`؛ `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `100px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 19:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `14px`؛ `padding`: مسافة داخلية بالقيمة `16px 20px`؛ `border`: حدود العنصر بالقيمة `1px solid #597968`؛ `border-radius`: تدوير الحواف بالقيمة `10px`؛ `background`: خلفية العنصر بالقيمة `#173f32`؛ `color`: لون النص بالقيمة `#f4f1e5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 20:** `flex`: ضبط الخاصية المسماة كما في CSS بالقيمة `1`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 21:** `min-height`: أقل ارتفاع بالقيمة `40px`؛ `padding`: مسافة داخلية بالقيمة `0 15px`؛ `background`: خلفية العنصر بالقيمة `#f1dcc0`؛ `color`: لون النص بالقيمة `#163e30`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `white-space`: ضبط الخاصية المسماة كما في CSS بالقيمة `nowrap`. القيم هنا تنسيق، مش function JavaScript.

**السطر 22:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 23:** `max-width`: أقصى عرض بالقيمة `767px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 24:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `88px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 25–32

```css
    .story-mode-message { flex-wrap: wrap; padding: 15px; gap: 10px; }
    .story-mode-message > svg { display: none; }
    .story-mode-message p { flex-basis: 100%; }
}
.status-badge { width: fit-content; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid transparent; border-radius: 8px; font-size: 11px; font-weight: 800; line-height: 1.4; }
.status-badge svg { width: 14px; height: 14px; }
.status-badge--neutral { color: #41564b; background: #eceee7; border-color: #dce3da; }
.status-badge--green { color: #1c5c42; background: #e4f1e7; border-color: #c9e1cd; }
```

**السطر 25:** `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`؛ `padding`: مسافة داخلية بالقيمة `15px`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 26:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 27:** `flex-basis`: ضبط الخاصية المسماة كما في CSS بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 29:** `width`: العرض بالقيمة `fit-content`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `6px`؛ `padding`: مسافة داخلية بالقيمة `6px 10px`؛ `border`: حدود العنصر بالقيمة `1px solid transparent`؛ `border-radius`: تدوير الحواف بالقيمة `8px`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `font-weight`: وزن الخط بالقيمة `800`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.4`. القيم هنا تنسيق، مش function JavaScript.

**السطر 30:** `width`: العرض بالقيمة `14px`؛ `height`: الارتفاع بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 31:** `color`: لون النص بالقيمة `#41564b`؛ `background`: خلفية العنصر بالقيمة `#eceee7`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#dce3da`. القيم هنا تنسيق، مش function JavaScript.

**السطر 32:** `color`: لون النص بالقيمة `#1c5c42`؛ `background`: خلفية العنصر بالقيمة `#e4f1e7`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#c9e1cd`. القيم هنا تنسيق، مش function JavaScript.

### السطور 33–40

```css
.status-badge--amber { color: #75480b; background: #fff0d5; border-color: #efd7af; }
.demo-label { display: inline-flex; padding: 5px 9px; color: #6a572e; background: #f0e7d5; border: 1px solid #e1d4ba; border-radius: 6px; font-size: 10px; line-height: 1.5; font-weight: 750; letter-spacing: .025em; }
.editorial-kicker { color: #627368; font-size: 11px; font-weight: 850; letter-spacing: .12em; text-transform: uppercase; }
.section-overline { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 0; margin-bottom: 36px; color: #69786c; border-top: 1px solid #dcded3; font-size: 10px; letter-spacing: .12em; font-weight: 800; }
.text-link { display: inline-flex; align-items: center; gap: 9px; padding: 0; background: none; border: 0; color: var(--ink); font-size: 13px; font-weight: 800; cursor: pointer; }
.text-link:hover { text-decoration: underline; text-underline-offset: 5px; }
.text-link svg { width: 17px; height: 17px; }
.btn svg { width: 18px; height: 18px; margin-left: 10px; }
```

**السطر 33:** `color`: لون النص بالقيمة `#75480b`؛ `background`: خلفية العنصر بالقيمة `#fff0d5`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#efd7af`. القيم هنا تنسيق، مش function JavaScript.

**السطر 34:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `padding`: مسافة داخلية بالقيمة `5px 9px`؛ `color`: لون النص بالقيمة `#6a572e`؛ `background`: خلفية العنصر بالقيمة `#f0e7d5`؛ `border`: حدود العنصر بالقيمة `1px solid #e1d4ba`؛ `border-radius`: تدوير الحواف بالقيمة `6px`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.5`؛ `font-weight`: وزن الخط بالقيمة `750`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.025em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 35:** `color`: لون النص بالقيمة `#627368`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `font-weight`: وزن الخط بالقيمة `850`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.12em`؛ `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 36:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `padding`: مسافة داخلية بالقيمة `22px 0`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `36px`؛ `color`: لون النص بالقيمة `#69786c`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dcded3`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.12em`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 37:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `9px`؛ `padding`: مسافة داخلية بالقيمة `0`؛ `background`: خلفية العنصر بالقيمة `none`؛ `border`: حدود العنصر بالقيمة `0`؛ `color`: لون النص بالقيمة `var(--ink)`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `font-weight`: وزن الخط بالقيمة `800`؛ `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`. القيم هنا تنسيق، مش function JavaScript.

**السطر 38:** `text-link`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `text-decoration`: ضبط الخاصية المسماة كما في CSS بالقيمة `underline`؛ `text-underline-offset`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 39:** `width`: العرض بالقيمة `17px`؛ `height`: الارتفاع بالقيمة `17px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 40:** `width`: العرض بالقيمة `18px`؛ `height`: الارتفاع بالقيمة `18px`؛ `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 41–48

```css
.workshop-section { padding-bottom: 80px; background: var(--cream); color: var(--ink); }
.trust-strip { display: grid; grid-template-columns: repeat(4,1fr); margin-bottom: 75px; padding: 28px 0; }
.trust-strip > a { display: flex; gap: 14px; align-items: center; padding: 10px 20px; border-right: 1px solid #dddfd6; }
.trust-strip > a:first-child { padding-left: 0; }
.trust-strip > a:last-child { border: 0; }
.trust-strip svg { width: 25px; height: 25px; color: #356651; }
.trust-strip strong, .trust-strip small { display: block; }
.trust-strip strong { font-size: 13px; }
```

**السطر 41:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `80px`؛ `background`: خلفية العنصر بالقيمة `var(--cream)`؛ `color`: لون النص بالقيمة `var(--ink)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 42:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(4,1fr)`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `75px`؛ `padding`: مسافة داخلية بالقيمة `28px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 43:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `14px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `padding`: مسافة داخلية بالقيمة `10px 20px`؛ `border-right`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dddfd6`. القيم هنا تنسيق، مش function JavaScript.

**السطر 44:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `first-child`؛ `padding-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 45:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `last-child`؛ `border`: حدود العنصر بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 46:** `width`: العرض بالقيمة `25px`؛ `height`: الارتفاع بالقيمة `25px`؛ `color`: لون النص بالقيمة `#356651`. القيم هنا تنسيق، مش function JavaScript.

**السطر 47:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 48:** `font-size`: حجم الخط بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 49–56

```css
.trust-strip small { margin-top: 5px; color: #718072; font-size: 11px; }
.workshop-editorial { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 65px; }
.workshop-copy h2, .support-heading h2, .faq-intro h2 { margin: 16px 0 22px; font-size: clamp(34px,3.7vw,52px); line-height: 1.08; font-weight: 600; letter-spacing: -.052em; }
.workshop-copy h2 em, .support-heading h2 em, .faq-intro h2 em { font-family: Georgia, serif; color: #53735c; font-weight: 400; }
.workshop-copy > p:not(.editorial-kicker) { max-width: 460px; color: #6a776c; font-size: 15px; line-height: 1.85; }
.care-promises { display: grid; gap: 20px; margin: 30px 0; list-style: none; }
.care-promises li { display: flex; gap: 14px; }
.care-promises svg { width: 24px; height: 24px; padding: 4px; border-radius: 50%; background: #e3e9dc; color: #476a49; }
```

**السطر 49:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`؛ `color`: لون النص بالقيمة `#718072`؛ `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 50:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `65px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 51:** `margin`: مسافة خارجية بالقيمة `16px 0 22px`؛ `font-size`: حجم الخط بالقيمة `clamp(34px,3.7vw,52px)`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.08`؛ `font-weight`: وزن الخط بالقيمة `600`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.052em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 52:** `font-family`: ضبط الخاصية المسماة كما في CSS بالقيمة `Georgia, serif`؛ `color`: لون النص بالقيمة `#53735c`؛ `font-weight`: وزن الخط بالقيمة `400`. القيم هنا تنسيق، مش function JavaScript.

**السطر 53:** `p`: ضبط الخاصية المسماة كما في CSS بالقيمة `not(.editorial-kicker)`؛ `max-width`: أقصى عرض بالقيمة `460px`؛ `color`: لون النص بالقيمة `#6a776c`؛ `font-size`: حجم الخط بالقيمة `15px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.85`. القيم هنا تنسيق، مش function JavaScript.

**السطر 54:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `margin`: مسافة خارجية بالقيمة `30px 0`؛ `list-style`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 55:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 56:** `width`: العرض بالقيمة `24px`؛ `height`: الارتفاع بالقيمة `24px`؛ `padding`: مسافة داخلية بالقيمة `4px`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `background`: خلفية العنصر بالقيمة `#e3e9dc`؛ `color`: لون النص بالقيمة `#476a49`. القيم هنا تنسيق، مش function JavaScript.

### السطور 57–64

```css
.care-promises strong, .care-promises small { display: block; }
.care-promises strong { font-size: 13px; }
.care-promises small { margin-top: 5px; color: #718072; font-size: 12px; line-height: 1.6; }
.workshop-photos { position: relative; height: 510px; padding-bottom: 36px; }
.workshop-photos figure { position: absolute; overflow: hidden; border-radius: 5px; background: #173a2e; }
.workshop-photos img { display: block; width: 100%; height: 100%; object-fit: cover; }
.photo-main { width: 75%; height: 90%; left: 0; top: 0; }
.photo-main img { object-position: 50% 68%; }
```

**السطر 57:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 58:** `font-size`: حجم الخط بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 59:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`؛ `color`: لون النص بالقيمة `#718072`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.6`. القيم هنا تنسيق، مش function JavaScript.

**السطر 60:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `height`: الارتفاع بالقيمة `510px`؛ `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `36px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 61:** `position`: نوع تموضع العنصر بالقيمة `absolute`؛ `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`؛ `border-radius`: تدوير الحواف بالقيمة `5px`؛ `background`: خلفية العنصر بالقيمة `#173a2e`. القيم هنا تنسيق، مش function JavaScript.

**السطر 62:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `width`: العرض بالقيمة `100%`؛ `height`: الارتفاع بالقيمة `100%`؛ `object-fit`: توزيع الصورة داخل أبعادها بالقيمة `cover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 63:** `width`: العرض بالقيمة `75%`؛ `height`: الارتفاع بالقيمة `90%`؛ `left`: المسافة من الشمال بالقيمة `0`؛ `top`: المسافة من أعلى بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 64:** `object-position`: ضبط الخاصية المسماة كما في CSS بالقيمة `50% 68%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 65–72

```css
.photo-detail { width: 45%; height: 59%; right: 0; bottom: 36px; border: 7px solid var(--cream); }
.workshop-photos figcaption { position: absolute; inset: auto 0 0; padding: 50px 18px 18px; color: white; background: linear-gradient(transparent,rgba(0,24,19,.86)); font-size: 11px; letter-spacing: .04em; }
.photo-disclosure { position: absolute; left: 0; bottom: 8px; color: #788174; font-size: 10px; }
.supported-makes { margin-top: 65px; border-block: 1px solid #dcded3; padding: 25px 0; text-align: center; }
.supported-makes p { color: #7a8378; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }
.supported-makes > div { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px 50px; margin-top: 22px; }
.supported-makes span { color: #47624e; font-size: 18px; font-weight: 700; letter-spacing: -.04em; }
.garage-preview { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; padding: 55px 65px; margin-top: 65px; overflow: hidden; background: #0b392e; color: var(--cream); border-radius: 10px; }
```

**السطر 65:** `width`: العرض بالقيمة `45%`؛ `height`: الارتفاع بالقيمة `59%`؛ `right`: المسافة من اليمين بالقيمة `0`؛ `bottom`: المسافة من أسفل بالقيمة `36px`؛ `border`: حدود العنصر بالقيمة `7px solid var(--cream)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 66:** `position`: نوع تموضع العنصر بالقيمة `absolute`؛ `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto 0 0`؛ `padding`: مسافة داخلية بالقيمة `50px 18px 18px`؛ `color`: لون النص بالقيمة `white`؛ `background`: خلفية العنصر بالقيمة `linear-gradient(transparent,rgba(0,24,19,.86))`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.04em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 67:** `position`: نوع تموضع العنصر بالقيمة `absolute`؛ `left`: المسافة من الشمال بالقيمة `0`؛ `bottom`: المسافة من أسفل بالقيمة `8px`؛ `color`: لون النص بالقيمة `#788174`؛ `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 68:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `65px`؛ `border-block`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dcded3`؛ `padding`: مسافة داخلية بالقيمة `25px 0`؛ `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 69:** `color`: لون النص بالقيمة `#7a8378`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.12em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 70:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `24px 50px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `22px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 71:** `color`: لون النص بالقيمة `#47624e`؛ `font-size`: حجم الخط بالقيمة `18px`؛ `font-weight`: وزن الخط بالقيمة `700`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.04em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 72:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `60px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `padding`: مسافة داخلية بالقيمة `55px 65px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `65px`؛ `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`؛ `background`: خلفية العنصر بالقيمة `#0b392e`؛ `color`: لون النص بالقيمة `var(--cream)`؛ `border-radius`: تدوير الحواف بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 73–80

```css
.garage-preview .editorial-kicker { color: #acc1ad; }
.garage-preview h3 { margin: 16px 0; font-size: clamp(34px,3.4vw,47px); font-weight: 500; letter-spacing: -.055em; line-height: 1.08; }
.garage-preview-copy > p { color: #bbcbba; font-size: 13px; line-height: 1.8; max-width: 340px; margin-bottom: 24px; }
.garage-preview .btn { min-height: 45px; font-size: 12px; box-shadow: none; }
.preview-ticket { padding: 25px; border-radius: 12px; color: #1c4034; background: #faf7f0; box-shadow: 0 20px 40px #00180f55; transform: rotate(-3deg); }
.ticket-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.ticket-top > svg { width: 38px; height: 38px; }
.ticket-caption { color: #7b8578; letter-spacing: .11em; font-size: 9px; font-weight: 800; }
```

**السطر 73:** `color`: لون النص بالقيمة `#acc1ad`. القيم هنا تنسيق، مش function JavaScript.

**السطر 74:** `margin`: مسافة خارجية بالقيمة `16px 0`؛ `font-size`: حجم الخط بالقيمة `clamp(34px,3.4vw,47px)`؛ `font-weight`: وزن الخط بالقيمة `500`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.055em`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.08`. القيم هنا تنسيق، مش function JavaScript.

**السطر 75:** `color`: لون النص بالقيمة `#bbcbba`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`؛ `max-width`: أقصى عرض بالقيمة `340px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 76:** `min-height`: أقل ارتفاع بالقيمة `45px`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `box-shadow`: ظل العنصر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 77:** `padding`: مسافة داخلية بالقيمة `25px`؛ `border-radius`: تدوير الحواف بالقيمة `12px`؛ `color`: لون النص بالقيمة `#1c4034`؛ `background`: خلفية العنصر بالقيمة `#faf7f0`؛ `box-shadow`: ظل العنصر بالقيمة `0 20px 40px #00180f55`؛ `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `rotate(-3deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 78:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `28px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 79:** `width`: العرض بالقيمة `38px`؛ `height`: الارتفاع بالقيمة `38px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 80:** `color`: لون النص بالقيمة `#7b8578`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.11em`؛ `font-size`: حجم الخط بالقيمة `9px`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

### السطور 81–88

```css
.preview-ticket h4 { margin: 8px 0 20px; font-size: 23px; font-weight: 650; letter-spacing: -.04em; }
.preview-ticket h4 small { font-size: 12px; color: #82907e; margin-left: 10px; }
.ticket-appointment { display: flex; gap: 13px; padding: 18px 0; border-top: 1px solid #dedfd4; }
.ticket-appointment strong, .ticket-appointment span { display: block; font-size: 12px; }
.ticket-appointment span { margin-top: 5px; font-size: 11px; color: #7d877b; }
.ticket-footer { display: flex; justify-content: space-between; border-top: 1px dashed #d5dacd; padding-top: 16px; font-size: 10px; color: #718170; }
.ticket-footer svg { width: 16px; height: 16px; }
.booking-section { border-top: 1px solid #dcded3; }
```

**السطر 81:** `margin`: مسافة خارجية بالقيمة `8px 0 20px`؛ `font-size`: حجم الخط بالقيمة `23px`؛ `font-weight`: وزن الخط بالقيمة `650`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.04em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 82:** `font-size`: حجم الخط بالقيمة `12px`؛ `color`: لون النص بالقيمة `#82907e`؛ `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 83:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `13px`؛ `padding`: مسافة داخلية بالقيمة `18px 0`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dedfd4`. القيم هنا تنسيق، مش function JavaScript.

**السطر 84:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 85:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `color`: لون النص بالقيمة `#7d877b`. القيم هنا تنسيق، مش function JavaScript.

**السطر 86:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px dashed #d5dacd`؛ `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `16px`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `color`: لون النص بالقيمة `#718170`. القيم هنا تنسيق، مش function JavaScript.

**السطر 87:** `width`: العرض بالقيمة `16px`؛ `height`: الارتفاع بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 88:** `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dcded3`. القيم هنا تنسيق، مش function JavaScript.

### السطور 89–96

```css
.booking-form { background: var(--paper); border-radius: 10px; box-shadow: 0 12px 40px #163d2b08; }
.booking-info h2 { color: var(--ink); font-weight: 550; }
.info-box { border-radius: 10px; box-shadow: none; }
.info-box > svg { margin-bottom: 12px; }
.booking-demo-note { margin-top: 20px; color: #74806f; font-size: 11px; line-height: 1.8; }
.booking-demo-note .status-badge { margin-right: 6px; }
.form-group input, .form-group select, .form-group textarea { border-radius: 8px; background: #f8f6ef; }
.alert svg { width: 18px; height: 18px; margin-right: 8px; }
```

**السطر 89:** `background`: خلفية العنصر بالقيمة `var(--paper)`؛ `border-radius`: تدوير الحواف بالقيمة `10px`؛ `box-shadow`: ظل العنصر بالقيمة `0 12px 40px #163d2b08`. القيم هنا تنسيق، مش function JavaScript.

**السطر 90:** `color`: لون النص بالقيمة `var(--ink)`؛ `font-weight`: وزن الخط بالقيمة `550`. القيم هنا تنسيق، مش function JavaScript.

**السطر 91:** `border-radius`: تدوير الحواف بالقيمة `10px`؛ `box-shadow`: ظل العنصر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 92:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 93:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`؛ `color`: لون النص بالقيمة `#74806f`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 94:** `margin-right`: ضبط الخاصية المسماة كما في CSS بالقيمة `6px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 95:** `border-radius`: تدوير الحواف بالقيمة `8px`؛ `background`: خلفية العنصر بالقيمة `#f8f6ef`. القيم هنا تنسيق، مش function JavaScript.

**السطر 96:** `width`: العرض بالقيمة `18px`؛ `height`: الارتفاع بالقيمة `18px`؛ `margin-right`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 97–104

```css
.alert-success a { display: block; margin-top: 12px; text-decoration: underline; text-underline-offset: 3px; }
.reviews-section { padding: 50px 0 85px; background: #efeee5; color: var(--ink); }
.support-heading { display: flex; align-items: end; justify-content: space-between; gap: 40px; margin-bottom: 35px; }
.support-heading h2 { margin: 0; }
.support-heading > p { max-width: 350px; font-size: 13px; line-height: 1.8; color: #72806e; }
.review-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.review-card { background: var(--paper); padding: 27px; border: 1px solid #e0e1d6; border-radius: 8px; }
.review-mark { color: #86a17d; font: 50px/.8 Georgia,serif; }
```

**السطر 97:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `12px`؛ `text-decoration`: ضبط الخاصية المسماة كما في CSS بالقيمة `underline`؛ `text-underline-offset`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 98:** `padding`: مسافة داخلية بالقيمة `50px 0 85px`؛ `background`: خلفية العنصر بالقيمة `#efeee5`؛ `color`: لون النص بالقيمة `var(--ink)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 99:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `end`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `40px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `35px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 100:** `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 101:** `max-width`: أقصى عرض بالقيمة `350px`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`؛ `color`: لون النص بالقيمة `#72806e`. القيم هنا تنسيق، مش function JavaScript.

**السطر 102:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(3,1fr)`؛ `gap`: مسافة بين عناصر layout بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 103:** `background`: خلفية العنصر بالقيمة `var(--paper)`؛ `padding`: مسافة داخلية بالقيمة `27px`؛ `border`: حدود العنصر بالقيمة `1px solid #e0e1d6`؛ `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 104:** `color`: لون النص بالقيمة `#86a17d`؛ `font`: ضبط الخاصية المسماة كما في CSS بالقيمة `50px/.8 Georgia,serif`. القيم هنا تنسيق، مش function JavaScript.

### السطور 105–112

```css
.review-card blockquote { min-height: 100px; margin: 15px 0 25px; font-size: 14px; line-height: 1.8; color: #4d6350; }
.review-person { display: flex; align-items: center; gap: 11px; }
.review-person > span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: #e6eadb; color: #53744e; font-size: 12px; font-weight: 800; }
.review-person strong, .review-person small { display: block; font-size: 12px; }
.review-person small { margin-top: 3px; color: #7c8576; font-size: 10px; }
.faq-section { padding: 90px 0; background: var(--cream); color: var(--ink); }
.faq-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 90px; }
.faq-intro > p:not(.editorial-kicker) { font-size: 13px; line-height: 1.8; color: #7a8475; margin: 15px 0 25px; }
```

**السطر 105:** `min-height`: أقل ارتفاع بالقيمة `100px`؛ `margin`: مسافة خارجية بالقيمة `15px 0 25px`؛ `font-size`: حجم الخط بالقيمة `14px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`؛ `color`: لون النص بالقيمة `#4d6350`. القيم هنا تنسيق، مش function JavaScript.

**السطر 106:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 107:** `width`: العرض بالقيمة `34px`؛ `height`: الارتفاع بالقيمة `34px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `background`: خلفية العنصر بالقيمة `#e6eadb`؛ `color`: لون النص بالقيمة `#53744e`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 108:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 109:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px`؛ `color`: لون النص بالقيمة `#7c8576`؛ `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 110:** `padding`: مسافة داخلية بالقيمة `90px 0`؛ `background`: خلفية العنصر بالقيمة `var(--cream)`؛ `color`: لون النص بالقيمة `var(--ink)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 111:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `.8fr 1.2fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `90px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 112:** `p`: ضبط الخاصية المسماة كما في CSS بالقيمة `not(.editorial-kicker)`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`؛ `color`: لون النص بالقيمة `#7a8475`؛ `margin`: مسافة خارجية بالقيمة `15px 0 25px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 113–120

```css
.faq-list details { border-bottom: 1px solid #dbded2; }
.faq-list summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; list-style: none; font-size: 14px; font-weight: 650; cursor: pointer; }
.faq-list summary::-webkit-details-marker { display: none; }
.faq-list summary svg { width: 18px; height: 18px; color: #74886a; transition: transform .2s; }
.faq-list details[open] summary svg { transform: rotate(45deg); }
.faq-list details > p { padding-bottom: 24px; max-width: 580px; color: #6f7d6c; font-size: 13px; line-height: 1.85; }
.contact-section { background: #0b392e; color: #f7f4ed; padding: 25px 0 70px; }
.contact-section .section-overline { border-color: #315448; color: #9eb3a1; }
```

**السطر 113:** `border-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dbded2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 114:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `padding`: مسافة داخلية بالقيمة `22px 0`؛ `list-style`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`؛ `font-size`: حجم الخط بالقيمة `14px`؛ `font-weight`: وزن الخط بالقيمة `650`؛ `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`. القيم هنا تنسيق، مش function JavaScript.

**السطر 115:** `summary`: ضبط الخاصية المسماة كما في CSS بالقيمة `:-webkit-details-marker`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 116:** `width`: العرض بالقيمة `18px`؛ `height`: الارتفاع بالقيمة `18px`؛ `color`: لون النص بالقيمة `#74886a`؛ `transition`: تنعيم تغيّر خصائص CSS بالقيمة `transform .2s`. القيم هنا تنسيق، مش function JavaScript.

**السطر 117:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `rotate(45deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 118:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `24px`؛ `max-width`: أقصى عرض بالقيمة `580px`؛ `color`: لون النص بالقيمة `#6f7d6c`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.85`. القيم هنا تنسيق، مش function JavaScript.

**السطر 119:** `background`: خلفية العنصر بالقيمة `#0b392e`؛ `color`: لون النص بالقيمة `#f7f4ed`؛ `padding`: مسافة داخلية بالقيمة `25px 0 70px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 120:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#315448`؛ `color`: لون النص بالقيمة `#9eb3a1`. القيم هنا تنسيق، مش function JavaScript.

### السطور 121–128

```css
.contact-section .demo-label { background: #244f3e; color: #c8d4bb; border-color: #476248; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
.contact-intro .editorial-kicker { color: #adc0a8; }
.contact-intro h2 { margin: 18px 0; font-size: clamp(40px,4.5vw,62px); letter-spacing: -.06em; font-weight: 500; line-height: 1.05; }
.contact-intro > p:not(.editorial-kicker) { max-width: 330px; margin-bottom: 26px; color: #bacbb7; font-size: 14px; line-height: 1.8; }
.contact-details { display: grid; gap: 26px; }
.contact-details article { display: flex; gap: 17px; }
.contact-details article > svg { color: #bbceb4; width: 20px; height: 20px; margin-top: 3px; }
```

**السطر 121:** `background`: خلفية العنصر بالقيمة `#244f3e`؛ `color`: لون النص بالقيمة `#c8d4bb`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#476248`. القيم هنا تنسيق، مش function JavaScript.

**السطر 122:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `80px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 123:** `color`: لون النص بالقيمة `#adc0a8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 124:** `margin`: مسافة خارجية بالقيمة `18px 0`؛ `font-size`: حجم الخط بالقيمة `clamp(40px,4.5vw,62px)`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.06em`؛ `font-weight`: وزن الخط بالقيمة `500`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.05`. القيم هنا تنسيق، مش function JavaScript.

**السطر 125:** `p`: ضبط الخاصية المسماة كما في CSS بالقيمة `not(.editorial-kicker)`؛ `max-width`: أقصى عرض بالقيمة `330px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `26px`؛ `color`: لون النص بالقيمة `#bacbb7`؛ `font-size`: حجم الخط بالقيمة `14px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 126:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `26px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 127:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `17px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 128:** `color`: لون النص بالقيمة `#bbceb4`؛ `width`: العرض بالقيمة `20px`؛ `height`: الارتفاع بالقيمة `20px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 129–136

```css
.contact-details article > div { flex: 1; min-width: 0; }
.contact-details h3 { font-size: 14px; font-weight: 650; margin-bottom: 8px; }
.contact-details p { font-size: 13px; color: #d3dfca; }
.contact-details small { display: block; color: #98b09b; font-size: 11px; line-height: 1.7; margin-top: 7px; }
.contact-details a { display: inline-flex; gap: 12px; margin-top: 12px; border-bottom: 1px solid #869d7b; font-size: 12px; padding-bottom: 4px; }
.contact-details .inline-demo { display: inline; font-size: 9px; margin-left: 8px; font-weight: 400; }
.hours-row { display: flex; justify-content: space-between; gap: 16px; margin-top: 5px; }
.hours-row strong { font-weight: 550; }
```

**السطر 129:** `flex`: ضبط الخاصية المسماة كما في CSS بالقيمة `1`؛ `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 130:** `font-size`: حجم الخط بالقيمة `14px`؛ `font-weight`: وزن الخط بالقيمة `650`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 131:** `font-size`: حجم الخط بالقيمة `13px`؛ `color`: لون النص بالقيمة `#d3dfca`. القيم هنا تنسيق، مش function JavaScript.

**السطر 132:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `color`: لون النص بالقيمة `#98b09b`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.7`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `7px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 133:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `12px`؛ `border-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #869d7b`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `4px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 134:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline`؛ `font-size`: حجم الخط بالقيمة `9px`؛ `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`؛ `font-weight`: وزن الخط بالقيمة `400`. القيم هنا تنسيق، مش function JavaScript.

**السطر 135:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `16px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 136:** `font-weight`: وزن الخط بالقيمة `550`. القيم هنا تنسيق، مش function JavaScript.

### السطور 137–144

```css
.footer { background: #062d27; border-color: #315448; color: var(--cream); }
.footer p, .footer-links a { color: #b1c3af; font-size: 12px; }
.footer-demo { display: block; margin-top: 7px; color: #89a38c; font-size: 10px; }
.footer-links a:hover { background: #264c3e; color: white; }

/* My Garage: a separate customer workspace. */
.garage-app { min-height: 100vh; background: #f5f3ec; color: #254335; }
.garage-sidebar { position: fixed; inset: 0 auto 0 0; z-index: 20; display: flex; flex-direction: column; width: 248px; padding: 32px 22px 24px; background: #0b392e; color: #e6efde; }
```

**السطر 137:** `background`: خلفية العنصر بالقيمة `#062d27`؛ `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#315448`؛ `color`: لون النص بالقيمة `var(--cream)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 138:** `color`: لون النص بالقيمة `#b1c3af`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 139:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `7px`؛ `color`: لون النص بالقيمة `#89a38c`؛ `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 140:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `background`: خلفية العنصر بالقيمة `#264c3e`؛ `color`: لون النص بالقيمة `white`. القيم هنا تنسيق، مش function JavaScript.

**السطر 142:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 143:** `min-height`: أقل ارتفاع بالقيمة `100vh`؛ `background`: خلفية العنصر بالقيمة `#f5f3ec`؛ `color`: لون النص بالقيمة `#254335`. القيم هنا تنسيق، مش function JavaScript.

**السطر 144:** `position`: نوع تموضع العنصر بالقيمة `fixed`؛ `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 auto 0 0`؛ `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `20`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `flex-direction`: اتجاه ترتيب flex بالقيمة `column`؛ `width`: العرض بالقيمة `248px`؛ `padding`: مسافة داخلية بالقيمة `32px 22px 24px`؛ `background`: خلفية العنصر بالقيمة `#0b392e`؛ `color`: لون النص بالقيمة `#e6efde`. القيم هنا تنسيق، مش function JavaScript.

### السطور 145–152

```css
.garage-sidebar .brand { padding-left: 8px; }
.garage-sidebar .brand strong { font-size: 21px; }
.garage-sidebar .brand small { letter-spacing: .14em; font-size: 9px; }
.sidebar-caption { margin: 45px 14px 18px; color: #819d84; font-size: 9px; line-height: 1.8; letter-spacing: .13em; }
.garage-sidebar nav { display: grid; gap: 5px; }
.garage-sidebar nav button { display: flex; align-items: center; gap: 12px; padding: 14px; color: #adc3ac; border: 0; border-radius: 7px; background: transparent; cursor: pointer; font-size: 12px; font-weight: 600; text-align: left; }
.garage-sidebar nav button svg { width: 19px; height: 19px; }
.garage-sidebar nav button:hover { background: #1a4939; color: white; }
```

**السطر 145:** `padding-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 146:** `font-size`: حجم الخط بالقيمة `21px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 147:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.14em`؛ `font-size`: حجم الخط بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 148:** `margin`: مسافة خارجية بالقيمة `45px 14px 18px`؛ `color`: لون النص بالقيمة `#819d84`؛ `font-size`: حجم الخط بالقيمة `9px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.13em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 149:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `5px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 150:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`؛ `padding`: مسافة داخلية بالقيمة `14px`؛ `color`: لون النص بالقيمة `#adc3ac`؛ `border`: حدود العنصر بالقيمة `0`؛ `border-radius`: تدوير الحواف بالقيمة `7px`؛ `background`: خلفية العنصر بالقيمة `transparent`؛ `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `font-weight`: وزن الخط بالقيمة `600`؛ `text-align`: محاذاة النص بالقيمة `left`. القيم هنا تنسيق، مش function JavaScript.

**السطر 151:** `width`: العرض بالقيمة `19px`؛ `height`: الارتفاع بالقيمة `19px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 152:** `button`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `background`: خلفية العنصر بالقيمة `#1a4939`؛ `color`: لون النص بالقيمة `white`. القيم هنا تنسيق، مش function JavaScript.

### السطور 153–160

```css
.garage-sidebar nav button.selected { background: #f2eddc; color: #173f2d; }
.nav-count { margin-left: auto; background: #e4e5d5; padding: 2px 7px; border-radius: 5px; color: #3c5a40; font-size: 10px; }
.sidebar-help { margin: auto 10px 25px; padding: 20px 15px; border: 1px solid #315640; border-radius: 8px; }
.sidebar-help > svg { color: #b8c8a3; width: 23px; height: 23px; margin-bottom: 12px; }
.sidebar-help strong { display: block; font-size: 13px; }
.sidebar-help p { font-size: 11px; color: #91af91; line-height: 1.8; margin: 9px 0 17px; }
.sidebar-help a { display: flex; align-items: center; justify-content: space-between; color: #c0d1b8; font-size: 10px; }
.sidebar-help a svg { width: 14px; height: 14px; }
```

**السطر 153:** `background`: خلفية العنصر بالقيمة `#f2eddc`؛ `color`: لون النص بالقيمة `#173f2d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 154:** `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`؛ `background`: خلفية العنصر بالقيمة `#e4e5d5`؛ `padding`: مسافة داخلية بالقيمة `2px 7px`؛ `border-radius`: تدوير الحواف بالقيمة `5px`؛ `color`: لون النص بالقيمة `#3c5a40`؛ `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 155:** `margin`: مسافة خارجية بالقيمة `auto 10px 25px`؛ `padding`: مسافة داخلية بالقيمة `20px 15px`؛ `border`: حدود العنصر بالقيمة `1px solid #315640`؛ `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 156:** `color`: لون النص بالقيمة `#b8c8a3`؛ `width`: العرض بالقيمة `23px`؛ `height`: الارتفاع بالقيمة `23px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 157:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 158:** `font-size`: حجم الخط بالقيمة `11px`؛ `color`: لون النص بالقيمة `#91af91`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`؛ `margin`: مسافة خارجية بالقيمة `9px 0 17px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 159:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `color`: لون النص بالقيمة `#c0d1b8`؛ `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 160:** `width`: العرض بالقيمة `14px`؛ `height`: الارتفاع بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 161–168

```css
.back-to-site { display: flex; align-items: center; gap: 10px; padding: 10px; font-size: 11px; color: #a9c1a7; }
.garage-main { margin-left: 248px; min-width: 0; }
.garage-topbar { height: 79px; display: flex; justify-content: space-between; align-items: center; gap: 16px; border-bottom: 1px solid #e1e3d9; padding: 0 40px; background: #fbf9f2; }
.breadcrumb { color: #7a8878; font-size: 11px; }
.breadcrumb > span { margin: 0 12px; color: #b4bca9; }
.garage-profile { display: flex; align-items: center; gap: 18px; }
.profile-avatar { display: grid; place-items: center; width: 33px; height: 33px; background: #dfe6d4; color: #476747; border-radius: 50%; font-size: 10px; font-weight: 800; }
.garage-content { max-width: 1440px; padding: 38px 40px 0; margin: 0 auto; }
```

**السطر 161:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`؛ `padding`: مسافة داخلية بالقيمة `10px`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `color`: لون النص بالقيمة `#a9c1a7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 162:** `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `248px`؛ `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 163:** `height`: الارتفاع بالقيمة `79px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `16px`؛ `border-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #e1e3d9`؛ `padding`: مسافة داخلية بالقيمة `0 40px`؛ `background`: خلفية العنصر بالقيمة `#fbf9f2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 164:** `color`: لون النص بالقيمة `#7a8878`؛ `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 165:** `margin`: مسافة خارجية بالقيمة `0 12px`؛ `color`: لون النص بالقيمة `#b4bca9`. القيم هنا تنسيق، مش function JavaScript.

**السطر 166:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 167:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `width`: العرض بالقيمة `33px`؛ `height`: الارتفاع بالقيمة `33px`؛ `background`: خلفية العنصر بالقيمة `#dfe6d4`؛ `color`: لون النص بالقيمة `#476747`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `font-weight`: وزن الخط بالقيمة `800`. القيم هنا تنسيق، مش function JavaScript.

**السطر 168:** `max-width`: أقصى عرض بالقيمة `1440px`؛ `padding`: مسافة داخلية بالقيمة `38px 40px 0`؛ `margin`: مسافة خارجية بالقيمة `0 auto`. القيم هنا تنسيق، مش function JavaScript.

### السطور 169–176

```css
.garage-page-heading { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 27px; }
.garage-page-heading h1 { font-size: clamp(28px,3vw,40px); line-height: 1.15; font-weight: 550; letter-spacing: -.055em; margin: 8px 0; }
.garage-page-heading > div > p:last-child { font-size: 12px; color: #899080; }
.garage-primary { min-height: 43px; border-radius: 7px; color: #fbfaee; background: #173f30; font-size: 11px; font-weight: 700; box-shadow: none; white-space: nowrap; gap: 7px; padding: 0 17px; }
.garage-primary:hover { background: #285841; box-shadow: 0 6px 16px #1f4b2d12; }
.garage-primary svg { width: 16px; height: 16px; margin-left: 0; }
.demo-notice { display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #eceee1; border: 1px solid #dde3d0; border-radius: 7px; color: #748068; margin-bottom: 25px; font-size: 10px; line-height: 1.7; }
.demo-notice > svg { width: 17px; height: 17px; color: #6b825b; }
```

**السطر 169:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `27px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 170:** `font-size`: حجم الخط بالقيمة `clamp(28px,3vw,40px)`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.15`؛ `font-weight`: وزن الخط بالقيمة `550`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.055em`؛ `margin`: مسافة خارجية بالقيمة `8px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 171:** `p`: ضبط الخاصية المسماة كما في CSS بالقيمة `last-child`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `color`: لون النص بالقيمة `#899080`. القيم هنا تنسيق، مش function JavaScript.

**السطر 172:** `min-height`: أقل ارتفاع بالقيمة `43px`؛ `border-radius`: تدوير الحواف بالقيمة `7px`؛ `color`: لون النص بالقيمة `#fbfaee`؛ `background`: خلفية العنصر بالقيمة `#173f30`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `font-weight`: وزن الخط بالقيمة `700`؛ `box-shadow`: ظل العنصر بالقيمة `none`؛ `white-space`: ضبط الخاصية المسماة كما في CSS بالقيمة `nowrap`؛ `gap`: مسافة بين عناصر layout بالقيمة `7px`؛ `padding`: مسافة داخلية بالقيمة `0 17px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 173:** `garage-primary`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `background`: خلفية العنصر بالقيمة `#285841`؛ `box-shadow`: ظل العنصر بالقيمة `0 6px 16px #1f4b2d12`. القيم هنا تنسيق، مش function JavaScript.

**السطر 174:** `width`: العرض بالقيمة `16px`؛ `height`: الارتفاع بالقيمة `16px`؛ `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 175:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`؛ `padding`: مسافة داخلية بالقيمة `14px 18px`؛ `background`: خلفية العنصر بالقيمة `#eceee1`؛ `border`: حدود العنصر بالقيمة `1px solid #dde3d0`؛ `border-radius`: تدوير الحواف بالقيمة `7px`؛ `color`: لون النص بالقيمة `#748068`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `25px`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 176:** `width`: العرض بالقيمة `17px`؛ `height`: الارتفاع بالقيمة `17px`؛ `color`: لون النص بالقيمة `#6b825b`. القيم هنا تنسيق، مش function JavaScript.

### السطور 177–184

```css
.demo-notice strong { color: #516547; font-weight: 750; }
.dashboard-notice { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding: 14px; background: #e3f0df; border-radius: 6px; font-size: 12px; }
.garage-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-bottom: 22px; }
.garage-stats article { display: flex; align-items: center; gap: 17px; padding: 22px; border: 1px solid #e0e2d5; border-radius: 8px; background: #fbfaf5; }
.stat-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 10px; background: #eaf0e2; color: #607c52; }
.stat-icon svg { width: 21px; height: 21px; }
.garage-stats article > div > span { display: block; font-size: 10px; color: #89927f; }
.garage-stats strong { display: block; font-size: 29px; font-weight: 550; letter-spacing: -.05em; margin-top: 3px; }
```

**السطر 177:** `color`: لون النص بالقيمة `#516547`؛ `font-weight`: وزن الخط بالقيمة `750`. القيم هنا تنسيق، مش function JavaScript.

**السطر 178:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`؛ `padding`: مسافة داخلية بالقيمة `14px`؛ `background`: خلفية العنصر بالقيمة `#e3f0df`؛ `border-radius`: تدوير الحواف بالقيمة `6px`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 179:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(3,1fr)`؛ `gap`: مسافة بين عناصر layout بالقيمة `18px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `22px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 180:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `17px`؛ `padding`: مسافة داخلية بالقيمة `22px`؛ `border`: حدود العنصر بالقيمة `1px solid #e0e2d5`؛ `border-radius`: تدوير الحواف بالقيمة `8px`؛ `background`: خلفية العنصر بالقيمة `#fbfaf5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 181:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `width`: العرض بالقيمة `42px`؛ `height`: الارتفاع بالقيمة `42px`؛ `border-radius`: تدوير الحواف بالقيمة `10px`؛ `background`: خلفية العنصر بالقيمة `#eaf0e2`؛ `color`: لون النص بالقيمة `#607c52`. القيم هنا تنسيق، مش function JavaScript.

**السطر 182:** `width`: العرض بالقيمة `21px`؛ `height`: الارتفاع بالقيمة `21px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 183:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `color`: لون النص بالقيمة `#89927f`. القيم هنا تنسيق، مش function JavaScript.

**السطر 184:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `29px`؛ `font-weight`: وزن الخط بالقيمة `550`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.05em`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 185–192

```css
.garage-stats .stat-word { font-size: 19px; letter-spacing: -.035em; }
.dashboard-two-col { display: grid; grid-template-columns: 1.1fr 1fr; gap: 22px; }
.dashboard-card { padding: 24px; background: #fffdf7; border: 1px solid #e0e2d5; border-radius: 9px; margin-bottom: 22px; min-width: 0; }
.card-heading { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 20px; }
.card-heading h2 { font-size: 15px; font-weight: 650; letter-spacing: -.025em; }
.card-heading .text-link { font-size: 10px; }
.card-heading .text-link svg { width: 13px; height: 13px; }
.card-kicker { display: block; color: #899581; font-size: 9px; letter-spacing: .07em; font-weight: 700; margin-bottom: 7px; }
```

**السطر 185:** `font-size`: حجم الخط بالقيمة `19px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.035em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 186:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1.1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `22px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 187:** `padding`: مسافة داخلية بالقيمة `24px`؛ `background`: خلفية العنصر بالقيمة `#fffdf7`؛ `border`: حدود العنصر بالقيمة `1px solid #e0e2d5`؛ `border-radius`: تدوير الحواف بالقيمة `9px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `22px`؛ `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 188:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `15px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 189:** `font-size`: حجم الخط بالقيمة `15px`؛ `font-weight`: وزن الخط بالقيمة `650`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.025em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 190:** `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 191:** `width`: العرض بالقيمة `13px`؛ `height`: الارتفاع بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 192:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `color`: لون النص بالقيمة `#899581`؛ `font-size`: حجم الخط بالقيمة `9px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `.07em`؛ `font-weight`: وزن الخط بالقيمة `700`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `7px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 193–200

```css
.visit-date { display: flex; align-items: center; gap: 13px; margin-bottom: 23px; }
.visit-date > span { display: grid; place-items: center; width: 56px; height: 60px; border-radius: 8px; background: #f0efe5; font-size: 27px; font-weight: 500; }
.visit-date > div { color: #435d41; font-size: 13px; font-weight: 650; }
.visit-date small { display: block; color: #8a9482; font-size: 10px; font-weight: 400; margin-top: 6px; }
.visit-date > .status-badge { width: auto; height: auto; display: inline-flex; margin-left: auto; font-size: 10px; white-space: nowrap; }
.next-visit h3 { font-size: 22px; font-weight: 550; letter-spacing: -.04em; }
.muted { color: #84907d; font-size: 12px; line-height: 1.8; }
.visit-footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 23px; padding-top: 17px; border-top: 1px solid #e8e9dc; }
```

**السطر 193:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `13px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `23px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 194:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `width`: العرض بالقيمة `56px`؛ `height`: الارتفاع بالقيمة `60px`؛ `border-radius`: تدوير الحواف بالقيمة `8px`؛ `background`: خلفية العنصر بالقيمة `#f0efe5`؛ `font-size`: حجم الخط بالقيمة `27px`؛ `font-weight`: وزن الخط بالقيمة `500`. القيم هنا تنسيق، مش function JavaScript.

**السطر 195:** `color`: لون النص بالقيمة `#435d41`؛ `font-size`: حجم الخط بالقيمة `13px`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

**السطر 196:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `color`: لون النص بالقيمة `#8a9482`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `font-weight`: وزن الخط بالقيمة `400`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `6px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 197:** `width`: العرض بالقيمة `auto`؛ `height`: الارتفاع بالقيمة `auto`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`؛ `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `white-space`: ضبط الخاصية المسماة كما في CSS بالقيمة `nowrap`. القيم هنا تنسيق، مش function JavaScript.

**السطر 198:** `font-size`: حجم الخط بالقيمة `22px`؛ `font-weight`: وزن الخط بالقيمة `550`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.04em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 199:** `color`: لون النص بالقيمة `#84907d`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 200:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `12px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `23px`؛ `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `17px`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #e8e9dc`. القيم هنا تنسيق، مش function JavaScript.

### السطور 201–208

```css
.visit-footer > span { color: #86947e; font-size: 10px; }
.visit-footer svg { width: 12px; height: 12px; margin-right: 3px; }
.visit-footer .text-link { font-size: 10px; }
.vehicle-feature { background: #eef0e4; }
.vehicle-art { position: relative; display: flex; align-items: center; justify-content: center; height: 115px; overflow: hidden; color: #4b6d4b; }
.vehicle-art > svg { width: 150px; height: 95px; stroke-width: .7; z-index: 1; }
.vehicle-art > span { position: absolute; bottom: -5px; color: #d9dfcc; font-size: 70px; font-weight: 950; letter-spacing: -.07em; line-height: 1; }
.vehicle-feature-info { position: relative; display: flex; justify-content: space-between; gap: 15px; align-items: center; margin-top: 20px; }
```

**السطر 201:** `color`: لون النص بالقيمة `#86947e`؛ `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 202:** `width`: العرض بالقيمة `12px`؛ `height`: الارتفاع بالقيمة `12px`؛ `margin-right`: ضبط الخاصية المسماة كما في CSS بالقيمة `3px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 203:** `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 204:** `background`: خلفية العنصر بالقيمة `#eef0e4`. القيم هنا تنسيق، مش function JavaScript.

**السطر 205:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`؛ `height`: الارتفاع بالقيمة `115px`؛ `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`؛ `color`: لون النص بالقيمة `#4b6d4b`. القيم هنا تنسيق، مش function JavaScript.

**السطر 206:** `width`: العرض بالقيمة `150px`؛ `height`: الارتفاع بالقيمة `95px`؛ `stroke-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `.7`؛ `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 207:** `position`: نوع تموضع العنصر بالقيمة `absolute`؛ `bottom`: المسافة من أسفل بالقيمة `-5px`؛ `color`: لون النص بالقيمة `#d9dfcc`؛ `font-size`: حجم الخط بالقيمة `70px`؛ `font-weight`: وزن الخط بالقيمة `950`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.07em`؛ `line-height`: ارتفاع سطر النص بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 208:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `15px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 209–216

```css
.vehicle-feature-info h3 { font-size: 15px; font-weight: 650; }
.vehicle-feature-info p { font-size: 10px; color: #8a9680; margin-top: 6px; }
.vehicle-feature-info > span { font-size: 18px; font-weight: 600; text-align: right; letter-spacing: -.04em; }
.vehicle-feature-info small { display: block; margin-top: 5px; color: #8c997f; font-size: 9px; font-weight: 400; letter-spacing: 0; }
.repair-summary { display: flex; align-items: center; gap: 13px; padding: 4px 0 24px; }
.repair-icon { display: grid; place-items: center; width: 38px; height: 38px; background: #eef0e3; border-radius: 8px; color: #6c805d; }
.repair-summary h3 { font-size: 13px; font-weight: 650; }
.repair-summary p { font-size: 10px; color: #8b947f; margin-top: 5px; }
```

**السطر 209:** `font-size`: حجم الخط بالقيمة `15px`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

**السطر 210:** `font-size`: حجم الخط بالقيمة `10px`؛ `color`: لون النص بالقيمة `#8a9680`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `6px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 211:** `font-size`: حجم الخط بالقيمة `18px`؛ `font-weight`: وزن الخط بالقيمة `600`؛ `text-align`: محاذاة النص بالقيمة `right`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.04em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 212:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`؛ `color`: لون النص بالقيمة `#8c997f`؛ `font-size`: حجم الخط بالقيمة `9px`؛ `font-weight`: وزن الخط بالقيمة `400`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 213:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `13px`؛ `padding`: مسافة داخلية بالقيمة `4px 0 24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 214:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `width`: العرض بالقيمة `38px`؛ `height`: الارتفاع بالقيمة `38px`؛ `background`: خلفية العنصر بالقيمة `#eef0e3`؛ `border-radius`: تدوير الحواف بالقيمة `8px`؛ `color`: لون النص بالقيمة `#6c805d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 215:** `font-size`: حجم الخط بالقيمة `13px`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

**السطر 216:** `font-size`: حجم الخط بالقيمة `10px`؛ `color`: لون النص بالقيمة `#8b947f`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 217–224

```css
.sample-update { color: #8e977f; font-size: 10px; margin-left: auto; }
.repair-timeline { display: grid; grid-template-columns: repeat(4,1fr); list-style: none; margin: 10px 0 25px; }
.repair-timeline li { position: relative; display: grid; justify-items: center; text-align: center; gap: 7px; }
.repair-timeline li::before { content: ''; position: absolute; top: 17px; left: -50%; right: 50%; border-top: 1px solid #dce1cf; }
.repair-timeline li:first-child::before { display: none; }
.repair-timeline li > span { z-index: 1; width: 34px; height: 34px; display: grid; place-items: center; background: #f0f0e5; color: #a2ac91; border: 5px solid #fffdf7; border-radius: 50%; box-sizing: content-box; margin-top: -5px; }
.repair-timeline li > span svg { width: 16px; height: 16px; }
.repair-timeline li.done > span { background: #e0ecd6; color: #456b3c; }
```

**السطر 217:** `color`: لون النص بالقيمة `#8e977f`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 218:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(4,1fr)`؛ `list-style`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`؛ `margin`: مسافة خارجية بالقيمة `10px 0 25px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 219:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `justify-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `text-align`: محاذاة النص بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `7px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 220:** `li`: ضبط الخاصية المسماة كما في CSS بالقيمة `:before`؛ `content`: ضبط الخاصية المسماة كما في CSS بالقيمة `''`؛ `position`: نوع تموضع العنصر بالقيمة `absolute`؛ `top`: المسافة من أعلى بالقيمة `17px`؛ `left`: المسافة من الشمال بالقيمة `-50%`؛ `right`: المسافة من اليمين بالقيمة `50%`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dce1cf`. القيم هنا تنسيق، مش function JavaScript.

**السطر 221:** `li`: ضبط الخاصية المسماة كما في CSS بالقيمة `first-child::before`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 222:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `1`؛ `width`: العرض بالقيمة `34px`؛ `height`: الارتفاع بالقيمة `34px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `background`: خلفية العنصر بالقيمة `#f0f0e5`؛ `color`: لون النص بالقيمة `#a2ac91`؛ `border`: حدود العنصر بالقيمة `5px solid #fffdf7`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `box-sizing`: ضبط الخاصية المسماة كما في CSS بالقيمة `content-box`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `-5px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 223:** `width`: العرض بالقيمة `16px`؛ `height`: الارتفاع بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 224:** `background`: خلفية العنصر بالقيمة `#e0ecd6`؛ `color`: لون النص بالقيمة `#456b3c`. القيم هنا تنسيق، مش function JavaScript.

### السطور 225–232

```css
.repair-timeline li.current > span { background: #f5e3ba; color: #80561e; }
.repair-timeline strong { font-size: 11px; font-weight: 650; }
.repair-timeline small { font-size: 9px; color: #88967c; }
.repair-note { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #f4f3e9; color: #88917b; font-size: 10px; border-radius: 6px; line-height: 1.7; }
.repair-note svg { width: 14px; height: 14px; }
.history-list { display: grid; }
.history-row { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 15px; width: 100%; padding: 16px 0; background: none; border: 0; border-top: 1px solid #ecece1; text-align: left; cursor: pointer; color: #4f6447; font-size: 10px; }
.history-row:hover { background: #f5f7ed; }
```

**السطر 225:** `background`: خلفية العنصر بالقيمة `#f5e3ba`؛ `color`: لون النص بالقيمة `#80561e`. القيم هنا تنسيق، مش function JavaScript.

**السطر 226:** `font-size`: حجم الخط بالقيمة `11px`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

**السطر 227:** `font-size`: حجم الخط بالقيمة `9px`؛ `color`: لون النص بالقيمة `#88967c`. القيم هنا تنسيق، مش function JavaScript.

**السطر 228:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`؛ `padding`: مسافة داخلية بالقيمة `12px 14px`؛ `background`: خلفية العنصر بالقيمة `#f4f3e9`؛ `color`: لون النص بالقيمة `#88917b`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `border-radius`: تدوير الحواف بالقيمة `6px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.7`. القيم هنا تنسيق، مش function JavaScript.

**السطر 229:** `width`: العرض بالقيمة `14px`؛ `height`: الارتفاع بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 230:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 231:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `auto 1fr auto auto`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `15px`؛ `width`: العرض بالقيمة `100%`؛ `padding`: مسافة داخلية بالقيمة `16px 0`؛ `background`: خلفية العنصر بالقيمة `none`؛ `border`: حدود العنصر بالقيمة `0`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #ecece1`؛ `text-align`: محاذاة النص بالقيمة `left`؛ `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`؛ `color`: لون النص بالقيمة `#4f6447`؛ `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 232:** `history-row`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `background`: خلفية العنصر بالقيمة `#f5f7ed`. القيم هنا تنسيق، مش function JavaScript.

### السطور 233–240

```css
.history-row:first-child { border-top: 0; }
.history-icon { display: grid; place-items: center; width: 34px; height: 34px; background: #ecf0e1; color: #6e885b; border-radius: 8px; }
.history-icon svg { width: 16px; height: 16px; }
.history-row strong { display: block; font-size: 12px; font-weight: 650; }
.history-row small { display: block; margin-top: 6px; color: #8b9780; font-size: 9px; }
.history-row > svg { width: 15px; height: 15px; color: #98a48d; }
.garage-bottom { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 25px 0; color: #96a087; border-top: 1px solid #dfe3d3; margin-top: 15px; font-size: 9px; }
.garage-bottom a { color: #546f46; font-weight: 650; }
```

**السطر 233:** `history-row`: ضبط الخاصية المسماة كما في CSS بالقيمة `first-child`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 234:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `width`: العرض بالقيمة `34px`؛ `height`: الارتفاع بالقيمة `34px`؛ `background`: خلفية العنصر بالقيمة `#ecf0e1`؛ `color`: لون النص بالقيمة `#6e885b`؛ `border-radius`: تدوير الحواف بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 235:** `width`: العرض بالقيمة `16px`؛ `height`: الارتفاع بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 236:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `12px`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

**السطر 237:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `6px`؛ `color`: لون النص بالقيمة `#8b9780`؛ `font-size`: حجم الخط بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 238:** `width`: العرض بالقيمة `15px`؛ `height`: الارتفاع بالقيمة `15px`؛ `color`: لون النص بالقيمة `#98a48d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 239:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `padding`: مسافة داخلية بالقيمة `25px 0`؛ `color`: لون النص بالقيمة `#96a087`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dfe3d3`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `15px`؛ `font-size`: حجم الخط بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 240:** `color`: لون النص بالقيمة `#546f46`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

### السطور 241–248

```css
.section-toolbar { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin: 25px 0; }
.section-toolbar > p { font-size: 12px; color: #7f8e74; }
.vehicle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items: start; }
.saved-vehicle .vehicle-art { height: 160px; margin: -5px -5px 25px; border-radius: 5px; background: #f0f1e5; }
.saved-vehicle h2 { font-size: 20px; letter-spacing: -.03em; font-weight: 600; }
.saved-vehicle > p { font-size: 11px; color: #839177; margin-top: 7px; }
.saved-vehicle dl { display: grid; gap: 15px; padding-block: 24px; margin-block: 18px; border-block: 1px solid #e8e9dc; font-size: 11px; }
.saved-vehicle dl > div { display: flex; justify-content: space-between; gap: 20px; }
```

**السطر 241:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `margin`: مسافة خارجية بالقيمة `25px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 242:** `font-size`: حجم الخط بالقيمة `12px`؛ `color`: لون النص بالقيمة `#7f8e74`. القيم هنا تنسيق، مش function JavaScript.

**السطر 243:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `22px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `start`. القيم هنا تنسيق، مش function JavaScript.

**السطر 244:** `height`: الارتفاع بالقيمة `160px`؛ `margin`: مسافة خارجية بالقيمة `-5px -5px 25px`؛ `border-radius`: تدوير الحواف بالقيمة `5px`؛ `background`: خلفية العنصر بالقيمة `#f0f1e5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 245:** `font-size`: حجم الخط بالقيمة `20px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.03em`؛ `font-weight`: وزن الخط بالقيمة `600`. القيم هنا تنسيق، مش function JavaScript.

**السطر 246:** `font-size`: حجم الخط بالقيمة `11px`؛ `color`: لون النص بالقيمة `#839177`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `7px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 247:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `15px`؛ `padding-block`: ضبط الخاصية المسماة كما في CSS بالقيمة `24px`؛ `margin-block`: ضبط الخاصية المسماة كما في CSS بالقيمة `18px`؛ `border-block`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #e8e9dc`؛ `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 248:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 249–256

```css
.saved-vehicle dt { color: #869579; }
.saved-vehicle dd { font-weight: 650; }
.vehicle-actions { display: flex; justify-content: space-between; gap: 20px; }
.subtle-button { padding: 0; font-size: 10px; background: none; border: 0; color: #7d8b73; cursor: pointer; }
.subtle-button:hover { color: #8d4233; text-decoration: underline; }
.add-vehicle-tile { display: grid; place-content: center; justify-items: center; min-height: 280px; background: #eeefe2; border: 1px dashed #bfc9ac; border-radius: 8px; color: #6d865c; cursor: pointer; }
.add-vehicle-tile svg { width: 35px; height: 35px; margin-bottom: 20px; }
.add-vehicle-tile strong { font-size: 14px; font-weight: 650; }
```

**السطر 249:** `color`: لون النص بالقيمة `#869579`. القيم هنا تنسيق، مش function JavaScript.

**السطر 250:** `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

**السطر 251:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 252:** `padding`: مسافة داخلية بالقيمة `0`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `background`: خلفية العنصر بالقيمة `none`؛ `border`: حدود العنصر بالقيمة `0`؛ `color`: لون النص بالقيمة `#7d8b73`؛ `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`. القيم هنا تنسيق، مش function JavaScript.

**السطر 253:** `subtle-button`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`؛ `color`: لون النص بالقيمة `#8d4233`؛ `text-decoration`: ضبط الخاصية المسماة كما في CSS بالقيمة `underline`. القيم هنا تنسيق، مش function JavaScript.

**السطر 254:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-content`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `justify-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `min-height`: أقل ارتفاع بالقيمة `280px`؛ `background`: خلفية العنصر بالقيمة `#eeefe2`؛ `border`: حدود العنصر بالقيمة `1px dashed #bfc9ac`؛ `border-radius`: تدوير الحواف بالقيمة `8px`؛ `color`: لون النص بالقيمة `#6d865c`؛ `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`. القيم هنا تنسيق، مش function JavaScript.

**السطر 255:** `width`: العرض بالقيمة `35px`؛ `height`: الارتفاع بالقيمة `35px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 256:** `font-size`: حجم الخط بالقيمة `14px`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

### السطور 257–264

```css
.add-vehicle-tile span { font-size: 11px; color: #8b997d; margin-top: 8px; }
.filter-label { display: flex; gap: 10px; align-items: center; font-size: 11px; color: #8c987e; }
.filter-label select { padding: 9px 13px; max-width: 200px; border: 1px solid #d6ddc9; background: #fffdf7; color: #536e45; font-size: 11px; border-radius: 6px; }
.appointment-card { display: flex; align-items: center; gap: 25px; }
.appointment-date-block { min-width: 68px; padding: 14px 10px; background: #eff0e4; border-radius: 8px; text-align: center; }
.appointment-date-block strong { display: block; font-size: 30px; font-weight: 500; }
.appointment-date-block span { display: block; color: #8a997b; font-size: 10px; margin-top: 5px; }
.appointment-copy { flex: 1; min-width: 0; }
```

**السطر 257:** `font-size`: حجم الخط بالقيمة `11px`؛ `color`: لون النص بالقيمة `#8b997d`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 258:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `color`: لون النص بالقيمة `#8c987e`. القيم هنا تنسيق، مش function JavaScript.

**السطر 259:** `padding`: مسافة داخلية بالقيمة `9px 13px`؛ `max-width`: أقصى عرض بالقيمة `200px`؛ `border`: حدود العنصر بالقيمة `1px solid #d6ddc9`؛ `background`: خلفية العنصر بالقيمة `#fffdf7`؛ `color`: لون النص بالقيمة `#536e45`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `border-radius`: تدوير الحواف بالقيمة `6px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 260:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `25px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 261:** `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `68px`؛ `padding`: مسافة داخلية بالقيمة `14px 10px`؛ `background`: خلفية العنصر بالقيمة `#eff0e4`؛ `border-radius`: تدوير الحواف بالقيمة `8px`؛ `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 262:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `font-size`: حجم الخط بالقيمة `30px`؛ `font-weight`: وزن الخط بالقيمة `500`. القيم هنا تنسيق، مش function JavaScript.

**السطر 263:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `color`: لون النص بالقيمة `#8a997b`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `5px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 264:** `flex`: ضبط الخاصية المسماة كما في CSS بالقيمة `1`؛ `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 265–272

```css
.appointment-copy h2 { font-size: 20px; font-weight: 600; letter-spacing: -.03em; }
.appointment-copy p { font-size: 12px; color: #75876a; margin-top: 8px; }
.appointment-copy small { display: block; margin-top: 10px; font-size: 10px; color: #8d9a7e; }
.appointment-actions { display: grid; justify-items: end; gap: 14px; }
.appointment-actions .text-link { font-size: 11px; }
.empty-state { display: grid; place-items: center; text-align: center; gap: 15px; padding: 35px; }
.empty-state > svg { width: 35px; height: 35px; color: #94a282; }
.empty-state h2, .empty-state h3 { font-size: 19px; font-weight: 550; }
```

**السطر 265:** `font-size`: حجم الخط بالقيمة `20px`؛ `font-weight`: وزن الخط بالقيمة `600`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.03em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 266:** `font-size`: حجم الخط بالقيمة `12px`؛ `color`: لون النص بالقيمة `#75876a`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 267:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `10px`؛ `font-size`: حجم الخط بالقيمة `10px`؛ `color`: لون النص بالقيمة `#8d9a7e`. القيم هنا تنسيق، مش function JavaScript.

**السطر 268:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `justify-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `end`؛ `gap`: مسافة بين عناصر layout بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 269:** `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 270:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `text-align`: محاذاة النص بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `15px`؛ `padding`: مسافة داخلية بالقيمة `35px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 271:** `width`: العرض بالقيمة `35px`؛ `height`: الارتفاع بالقيمة `35px`؛ `color`: لون النص بالقيمة `#94a282`. القيم هنا تنسيق، مش function JavaScript.

**السطر 272:** `font-size`: حجم الخط بالقيمة `19px`؛ `font-weight`: وزن الخط بالقيمة `550`. القيم هنا تنسيق، مش function JavaScript.

### السطور 273–280

```css
.empty-state p { color: #8a987c; font-size: 12px; }
dialog { width: min(550px, calc(100% - 30px)); max-height: 90svh; padding: 0; margin: auto; color: #274834; background: #fcfaf2; border: 1px solid #dbe0ce; border-radius: 13px; box-shadow: 0 30px 100px #001b1855; }
dialog::backdrop { background: #062d27b8; backdrop-filter: blur(4px); }
.garage-dialog-form { padding: 30px; }
.dialog-heading { display: flex; gap: 20px; justify-content: space-between; align-items: start; margin-bottom: 18px; }
.dialog-heading h2 { margin-top: 7px; font-size: 25px; letter-spacing: -.04em; line-height: 1.2; font-weight: 550; }
.icon-button { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; background: #edf0e0; border: 0; color: #58744a; cursor: pointer; flex-shrink: 0; }
.icon-button svg { width: 17px; height: 17px; }
```

**السطر 273:** `color`: لون النص بالقيمة `#8a987c`؛ `font-size`: حجم الخط بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 274:** `width`: العرض بالقيمة `min(550px, calc(100% - 30px))`؛ `max-height`: ضبط الخاصية المسماة كما في CSS بالقيمة `90svh`؛ `padding`: مسافة داخلية بالقيمة `0`؛ `margin`: مسافة خارجية بالقيمة `auto`؛ `color`: لون النص بالقيمة `#274834`؛ `background`: خلفية العنصر بالقيمة `#fcfaf2`؛ `border`: حدود العنصر بالقيمة `1px solid #dbe0ce`؛ `border-radius`: تدوير الحواف بالقيمة `13px`؛ `box-shadow`: ظل العنصر بالقيمة `0 30px 100px #001b1855`. القيم هنا تنسيق، مش function JavaScript.

**السطر 275:** `dialog`: ضبط الخاصية المسماة كما في CSS بالقيمة `:backdrop`؛ `background`: خلفية العنصر بالقيمة `#062d27b8`؛ `backdrop-filter`: تأثير على المشهد خلف العنصر بالقيمة `blur(4px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 276:** `padding`: مسافة داخلية بالقيمة `30px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 277:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `20px`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `start`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 278:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `7px`؛ `font-size`: حجم الخط بالقيمة `25px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `-.04em`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.2`؛ `font-weight`: وزن الخط بالقيمة `550`. القيم هنا تنسيق، مش function JavaScript.

**السطر 279:** `width`: العرض بالقيمة `30px`؛ `height`: الارتفاع بالقيمة `30px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `border-radius`: تدوير الحواف بالقيمة `50%`؛ `background`: خلفية العنصر بالقيمة `#edf0e0`؛ `border`: حدود العنصر بالقيمة `0`؛ `color`: لون النص بالقيمة `#58744a`؛ `cursor`: شكل مؤشر الفأرة بالقيمة `pointer`؛ `flex-shrink`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 280:** `width`: العرض بالقيمة `17px`؛ `height`: الارتفاع بالقيمة `17px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 281–288

```css
.dialog-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 25px 0; }
.dialog-fields label { display: grid; gap: 8px; font-size: 11px; font-weight: 650; }
.dialog-fields input { width: 100%; min-width: 0; padding: 11px; border: 1px solid #d6dcc8; border-radius: 5px; background: #fffef9; color: #3e5d38; font-size: 13px; }
.full-field { grid-column: 1/-1; }
.record-car { margin: 25px 0 8px; font-size: 19px; }
.record-notes { font-size: 13px; line-height: 1.9; color: #76886a; margin: 25px 0; }
.record-total { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #dce3ce; font-size: 13px; }
.confirm-actions { display: flex; gap: 25px; margin-top: 25px; align-items: center; }
```

**السطر 281:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `18px`؛ `margin`: مسافة خارجية بالقيمة `25px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 282:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `8px`؛ `font-size`: حجم الخط بالقيمة `11px`؛ `font-weight`: وزن الخط بالقيمة `650`. القيم هنا تنسيق، مش function JavaScript.

**السطر 283:** `width`: العرض بالقيمة `100%`؛ `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`؛ `padding`: مسافة داخلية بالقيمة `11px`؛ `border`: حدود العنصر بالقيمة `1px solid #d6dcc8`؛ `border-radius`: تدوير الحواف بالقيمة `5px`؛ `background`: خلفية العنصر بالقيمة `#fffef9`؛ `color`: لون النص بالقيمة `#3e5d38`؛ `font-size`: حجم الخط بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 284:** `grid-column`: ضبط الخاصية المسماة كما في CSS بالقيمة `1/-1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 285:** `margin`: مسافة خارجية بالقيمة `25px 0 8px`؛ `font-size`: حجم الخط بالقيمة `19px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 286:** `font-size`: حجم الخط بالقيمة `13px`؛ `line-height`: ارتفاع سطر النص بالقيمة `1.9`؛ `color`: لون النص بالقيمة `#76886a`؛ `margin`: مسافة خارجية بالقيمة `25px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 287:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dce3ce`؛ `font-size`: حجم الخط بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 288:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `gap`: مسافة بين عناصر layout بالقيمة `25px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `25px`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

### السطور 289–296

```css

@media(max-width:1100px) {
    .garage-sidebar { width: 210px; padding-inline: 15px; }
    .garage-main { margin-left: 210px; }
    .garage-content { padding: 28px 24px 0; }
    .garage-topbar { padding-inline: 24px; }
    .dashboard-two-col { grid-template-columns: 1fr; gap: 0; }
    .garage-stats article { padding: 16px 12px; gap: 10px; }
```

**السطر 290:** `max-width`: أقصى عرض بالقيمة `1100px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 291:** `width`: العرض بالقيمة `210px`؛ `padding-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `15px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 292:** `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `210px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 293:** `padding`: مسافة داخلية بالقيمة `28px 24px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 294:** `padding-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `24px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 295:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 296:** `padding`: مسافة داخلية بالقيمة `16px 12px`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 297–304

```css
    .workshop-editorial { gap: 35px; }
    .garage-preview { padding: 40px; gap: 40px; }
}
@media(max-width:767px) {
    .nav-links .nav-garage { margin-left: 0; }
    .trust-strip { grid-template-columns: 1fr 1fr; margin-bottom: 35px; padding: 15px 0; gap: 10px; }
    .trust-strip > a { padding: 14px 8px; border: 0; gap: 10px; }
    .trust-strip > a:first-child { padding-left: 8px; }
```

**السطر 297:** `gap`: مسافة بين عناصر layout بالقيمة `35px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 298:** `padding`: مسافة داخلية بالقيمة `40px`؛ `gap`: مسافة بين عناصر layout بالقيمة `40px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 299:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 300:** `max-width`: أقصى عرض بالقيمة `767px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 301:** `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 302:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `35px`؛ `padding`: مسافة داخلية بالقيمة `15px 0`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 303:** `padding`: مسافة داخلية بالقيمة `14px 8px`؛ `border`: حدود العنصر بالقيمة `0`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 304:** `a`: ضبط الخاصية المسماة كما في CSS بالقيمة `first-child`؛ `padding-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 305–312

```css
    .trust-strip strong { font-size: 11px; }
    .trust-strip small { font-size: 10px; }
    .trust-strip svg { width: 20px; height: 20px; }
    .section-overline { align-items: start; margin-bottom: 20px; }
    .section-overline .demo-label { max-width: 160px; letter-spacing: 0; }
    .workshop-editorial, .garage-preview, .faq-grid, .contact-grid { grid-template-columns: 1fr; gap: 35px; }
    .workshop-copy h2, .support-heading h2, .faq-intro h2 { font-size: 37px; }
    .workshop-photos { height: 440px; margin-top: 10px; }
```

**السطر 305:** `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 306:** `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 307:** `width`: العرض بالقيمة `20px`؛ `height`: الارتفاع بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 308:** `align-items`: محاذاة على المحور العرضي بالقيمة `start`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 309:** `max-width`: أقصى عرض بالقيمة `160px`؛ `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 310:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `35px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 311:** `font-size`: حجم الخط بالقيمة `37px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 312:** `height`: الارتفاع بالقيمة `440px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 313–320

```css
    .supported-makes { margin-top: 30px; }
    .supported-makes > div { gap: 20px 28px; }
    .supported-makes span { font-size: 16px; }
    .garage-preview { padding: 30px 25px 40px; margin-top: 35px; }
    .garage-preview h3 { font-size: 36px; }
    .preview-ticket { transform: rotate(-2deg); }
    .workshop-section { padding-bottom: 45px; }
    .reviews-section { padding-bottom: 45px; }
```

**السطر 313:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `30px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 314:** `gap`: مسافة بين عناصر layout بالقيمة `20px 28px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 315:** `font-size`: حجم الخط بالقيمة `16px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 316:** `padding`: مسافة داخلية بالقيمة `30px 25px 40px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `35px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 317:** `font-size`: حجم الخط بالقيمة `36px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 318:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `rotate(-2deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 319:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `45px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 320:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `45px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 321–328

```css
    .support-heading { display: grid; gap: 18px; margin-bottom: 25px; }
    .review-grid { grid-template-columns: 1fr; }
    .review-card blockquote { min-height: 0; }
    .faq-section { padding: 50px 0; }
    .contact-section { padding-bottom: 45px; }
    .contact-intro h2 { font-size: 44px; }
    .contact-details .hours-row { font-size: 11px; }
    .garage-sidebar { position: relative; width: 100%; padding: 16px 14px 0; }
```

**السطر 321:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `18px`؛ `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `25px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 322:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`. القيم هنا تنسيق، مش function JavaScript.

**السطر 323:** `min-height`: أقل ارتفاع بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 324:** `padding`: مسافة داخلية بالقيمة `50px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 325:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `45px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 326:** `font-size`: حجم الخط بالقيمة `44px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 327:** `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 328:** `position`: نوع تموضع العنصر بالقيمة `relative`؛ `width`: العرض بالقيمة `100%`؛ `padding`: مسافة داخلية بالقيمة `16px 14px 0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 329–336

```css
    .garage-sidebar .brand { padding-left: 0; }
    .sidebar-caption, .sidebar-help, .back-to-site { display: none; }
    .garage-sidebar nav { display: grid; grid-template-columns: repeat(4,1fr); gap: 3px; margin-top: 22px; padding-bottom: 12px; }
    .garage-sidebar nav button { padding: 12px 4px; display: grid; justify-items: center; gap: 7px; font-size: 9px; text-align: center; }
    .garage-sidebar nav .nav-count { display: none; }
    .garage-main { margin-left: 0; }
    .garage-topbar { height: 58px; padding: 0 16px; }
    .breadcrumb { font-size: 10px; }
```

**السطر 329:** `padding-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 330:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 331:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `grid-template-columns`: تقسيم أعمدة grid بالقيمة `repeat(4,1fr)`؛ `gap`: مسافة بين عناصر layout بالقيمة `3px`؛ `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `22px`؛ `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 332:** `padding`: مسافة داخلية بالقيمة `12px 4px`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `justify-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`؛ `gap`: مسافة بين عناصر layout بالقيمة `7px`؛ `font-size`: حجم الخط بالقيمة `9px`؛ `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 333:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 334:** `margin-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 335:** `height`: الارتفاع بالقيمة `58px`؛ `padding`: مسافة داخلية بالقيمة `0 16px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 336:** `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 337–344

```css
    .profile-avatar { display: none; }
    .garage-content { padding: 25px 14px 0; }
    .garage-page-heading { display: grid; gap: 18px; }
    .garage-page-heading h1 { font-size: 30px; }
    .garage-page-heading .garage-primary { width: fit-content; }
    .garage-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .garage-stats article:last-child { grid-column: 1/-1; }
    .garage-stats article { padding: 15px 12px; }
```

**السطر 337:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 338:** `padding`: مسافة داخلية بالقيمة `25px 14px 0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 339:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`؛ `gap`: مسافة بين عناصر layout بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 340:** `font-size`: حجم الخط بالقيمة `30px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 341:** `width`: العرض بالقيمة `fit-content`. القيم هنا تنسيق، مش function JavaScript.

**السطر 342:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr 1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 343:** `article`: ضبط الخاصية المسماة كما في CSS بالقيمة `last-child`؛ `grid-column`: ضبط الخاصية المسماة كما في CSS بالقيمة `1/-1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 344:** `padding`: مسافة داخلية بالقيمة `15px 12px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 345–352

```css
    .garage-stats strong { font-size: 25px; }
    .stat-icon { width: 32px; height: 32px; }
    .stat-icon svg { width: 17px; height: 17px; }
    .garage-stats article > div > span { font-size: 9px; }
    .dashboard-card { padding: 20px; }
    .visit-date { gap: 10px; }
    .visit-date > .status-badge { font-size: 8px; padding: 5px 7px; }
    .visit-date > div { font-size: 11px; }
```

**السطر 345:** `font-size`: حجم الخط بالقيمة `25px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 346:** `width`: العرض بالقيمة `32px`؛ `height`: الارتفاع بالقيمة `32px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 347:** `width`: العرض بالقيمة `17px`؛ `height`: الارتفاع بالقيمة `17px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 348:** `font-size`: حجم الخط بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 349:** `padding`: مسافة داخلية بالقيمة `20px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 350:** `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 351:** `font-size`: حجم الخط بالقيمة `8px`؛ `padding`: مسافة داخلية بالقيمة `5px 7px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 352:** `font-size`: حجم الخط بالقيمة `11px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 353–360

```css
    .visit-date small { font-size: 9px; }
    .sample-update { display: none; }
    .repair-timeline { grid-template-columns: 1fr; gap: 18px; }
    .repair-timeline li { grid-template-columns: auto 1fr auto; justify-items: start; align-items: center; text-align: left; gap: 10px; }
    .repair-timeline li::before { left: 17px; top: -20px; right: auto; height: 30px; border-left: 1px solid #dce1cf; border-top: 0; }
    .repair-timeline li > span { width: 25px; height: 25px; }
    .repair-timeline li::before { left: 17px; }
    .repair-timeline small { justify-self: end; }
```

**السطر 353:** `font-size`: حجم الخط بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 354:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 355:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 356:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `auto 1fr auto`؛ `justify-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `start`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `text-align`: محاذاة النص بالقيمة `left`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 357:** `li`: ضبط الخاصية المسماة كما في CSS بالقيمة `:before`؛ `left`: المسافة من الشمال بالقيمة `17px`؛ `top`: المسافة من أعلى بالقيمة `-20px`؛ `right`: المسافة من اليمين بالقيمة `auto`؛ `height`: الارتفاع بالقيمة `30px`؛ `border-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #dce1cf`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 358:** `width`: العرض بالقيمة `25px`؛ `height`: الارتفاع بالقيمة `25px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 359:** `li`: ضبط الخاصية المسماة كما في CSS بالقيمة `:before`؛ `left`: المسافة من الشمال بالقيمة `17px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 360:** `justify-self`: ضبط الخاصية المسماة كما في CSS بالقيمة `end`. القيم هنا تنسيق، مش function JavaScript.

### السطور 361–368

```css
    .history-row { grid-template-columns: auto 1fr auto; gap: 10px; }
    .history-row > span:nth-child(3) { grid-column: 2; }
    .history-row > svg { grid-column: 3; grid-row: 1/3; }
    .history-icon { grid-row: 1/3; }
    .vehicle-grid { grid-template-columns: 1fr; gap: 0; }
    .add-vehicle-tile { margin-bottom: 20px; min-height: 180px; }
    .section-toolbar { align-items: start; flex-wrap: wrap; gap: 15px; }
    .appointment-card { align-items: start; gap: 15px; flex-wrap: wrap; }
```

**السطر 361:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `auto 1fr auto`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 362:** `span`: ضبط الخاصية المسماة كما في CSS بالقيمة `nth-child(3)`؛ `grid-column`: ضبط الخاصية المسماة كما في CSS بالقيمة `2`. القيم هنا تنسيق، مش function JavaScript.

**السطر 363:** `grid-column`: ضبط الخاصية المسماة كما في CSS بالقيمة `3`؛ `grid-row`: ضبط الخاصية المسماة كما في CSS بالقيمة `1/3`. القيم هنا تنسيق، مش function JavaScript.

**السطر 364:** `grid-row`: ضبط الخاصية المسماة كما في CSS بالقيمة `1/3`. القيم هنا تنسيق، مش function JavaScript.

**السطر 365:** `grid-template-columns`: تقسيم أعمدة grid بالقيمة `1fr`؛ `gap`: مسافة بين عناصر layout بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 366:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`؛ `min-height`: أقل ارتفاع بالقيمة `180px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 367:** `align-items`: محاذاة على المحور العرضي بالقيمة `start`؛ `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`؛ `gap`: مسافة بين عناصر layout بالقيمة `15px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 368:** `align-items`: محاذاة على المحور العرضي بالقيمة `start`؛ `gap`: مسافة بين عناصر layout بالقيمة `15px`؛ `flex-wrap`: ضبط الخاصية المسماة كما في CSS بالقيمة `wrap`. القيم هنا تنسيق، مش function JavaScript.

### السطور 369–376

```css
    .appointment-actions { flex: 1 0 100%; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e3e7d5; padding-top: 20px; gap: 10px; }
    .appointment-actions .text-link { font-size: 10px; }
    .appointment-copy h2 { font-size: 18px; }
    .appointment-date-block { min-width: 58px; }
    .garage-dialog-form { padding: 23px; }
    .dialog-fields { gap: 14px; }
    .garage-bottom { font-size: 8px; }
}
```

**السطر 369:** `flex`: ضبط الخاصية المسماة كما في CSS بالقيمة `1 0 100%`؛ `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`؛ `justify-content`: توزيع على المحور الرئيسي بالقيمة `space-between`؛ `align-items`: محاذاة على المحور العرضي بالقيمة `center`؛ `border-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1px solid #e3e7d5`؛ `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `20px`؛ `gap`: مسافة بين عناصر layout بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 370:** `font-size`: حجم الخط بالقيمة `10px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 371:** `font-size`: حجم الخط بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 372:** `min-width`: ضبط الخاصية المسماة كما في CSS بالقيمة `58px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 373:** `padding`: مسافة داخلية بالقيمة `23px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 374:** `gap`: مسافة بين عناصر layout بالقيمة `14px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 375:** `font-size`: حجم الخط بالقيمة `8px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 376:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
