# Free interactive demo

Published preview: https://pizza-ordering-preview.pages.dev/

Cloudflare Pages project: `pizza-ordering-preview`. Public menu, homepage video, deep-link refresh, and demo admin login were verified after deployment on October 13, 2026.

The existing React website now has a separate static demo build. It runs without PHP, MySQL, or payment keys. The full Laravel website continues to use XAMPP MySQL.

## Try locally

Open http://127.0.0.1:4173 while the preview server is running.

```powershell
npm run demo:build
npm run demo:preview
```

The menu snapshot includes 47 products and three branches. Refresh the public menu snapshot when needed with `npm run demo:export`. That command exports only public catalog fields, never customer orders, users, passwords, payment keys, or .env.

## Demo behavior

- A permanent banner says that orders are samples and no payments are collected.
- Login and registration show account-selection buttons instead of password forms.
- Customer, each branch's staff, and admin can be tried instantly.
- Checkout creates sample orders; staff can change stages and tracking updates every seven seconds.
- Menu and branch edits, staff assignment, settings, audit history, and CSV export work locally.
- Photo uploads require the full Laravel website and are explicitly unavailable in this preview.
- Use made-up customer contact details. No email, payment, or real kitchen request is sent.
- Reset demo removes only demo data, leaving the real local cart untouched.

Data is stored in localStorage in this browser. Every visitor and device has separate data. To demonstrate tracking, keep the tracking page in one tab and the staff dashboard in another tab of the SAME browser. This static preview does not synchronize orders across different devices.

## Publish free on Cloudflare Pages

1. Create your Cloudflare account and sign in.
2. Open Workers & Pages, then Create application.
3. Select Pages and upload prebuilt files (Drag and drop).
4. Choose a project name, for example pizza-ordering-preview.
5. Upload `pizza-demo-upload.zip` or the contents of `dist-demo`.
6. Deploy, then open the pages.dev URL Cloudflare provides.
7. Check menu, demo login, staff and admin, and refresh a tracking URL.

Upload only the ZIP or dist-demo. Do not upload the whole Laravel project. index.html must be at the ZIP root.

The package contains compiled frontend files and public images/video. PHP, .env, vendor, databases, and real order data are excluded. Routing rules support page refreshes. No-index headers identify it as a preview. The packaging script checks the 25 MiB per-file limit.

Official instructions: https://developers.cloudflare.com/pages/get-started/direct-upload/

## Presentation order

1. Show homepage video, menu, branch selection, and delivery/pickup.
2. Add an item, write a kitchen note, and place a sample cash order.
3. Keep tracking open in one tab.
4. Open another tab and choose that branch's staff account.
5. Accept, prepare, mark ready, and complete the order.
6. Return to tracking to see the stage change.
7. Choose Demo Admin to show metrics, menu management, branches, orders, and settings.

Restaurant branding is retained for presenting this project to its owner. Before selling a reusable public template to other restaurants, replace it with your own branding and licensed assets.

## Checks

```powershell
npm run demo:test
npm run demo:build
npm run build
php artisan test
```

