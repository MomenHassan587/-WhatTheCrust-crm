# What The Crust

A Laravel 12 and React 19 pizza ordering site with a customer menu, cart, Stripe test payments, and a staff order dashboard.

## Clean setup with XAMPP and MySQL

1. Open XAMPP Control Panel and start **MySQL**.
2. Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Select **New**, create a database named `what_the_crust`, and use `utf8mb4_unicode_ci` if phpMyAdmin asks for a collation.
4. Open PowerShell in this project folder.
5. Create the local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

6. Install PHP packages and create the application key:

   ```powershell
   composer install
   php artisan key:generate
   ```

7. Install browser packages:

   ```powershell
   npm install
   ```

8. In `.env`, set local demo passwords before seeding. Do not commit these values:

   ```dotenv
   STAFF_PASSWORD=choose-a-local-password
   ADMIN_PASSWORD=choose-a-different-local-password
   ```

9. Create the tables and demo data:

   ```powershell
   php artisan migrate
   php artisan db:seed
   ```

10. Check the setup:

   ```powershell
   composer ready
   ```

11. Start Vite in one terminal:

    ```powershell
    npm run dev
    ```

12. Start Laravel in a second terminal:

    ```powershell
    php artisan serve
    ```

13. Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

The seeder creates these branch accounts:

- `staff.the-drive@whatthecrust.test`
- `staff.golf-central@whatthecrust.test`
- `staff.lakehouse@whatthecrust.test`
- `admin@whatthecrust.test`

Branch staff use `STAFF_PASSWORD`. The admin uses `ADMIN_PASSWORD`. Passwords are never hard-coded in the seeder.

## Stripe test mode

Cash orders work without Stripe. For card testing, replace the placeholder `pk_test_`, `sk_test_`, and `whsec_` values in `.env`, then restart Laravel and Vite. Never add real secret keys to Git.

## Database choices

MySQL from XAMPP is the main database for this project. SQLite remains documented in `.env.example` only as a lightweight backup for local development and automated tests.

## Useful commands

```powershell
composer ready
php artisan test
npm run build
php artisan migrate:fresh --seed
```

`migrate:fresh` deletes existing database records, so use it only when you intentionally want fresh demo data.

## Menu photos

Optimized WebP copies live in `public/images/menu`. Original source photos remain unchanged in `public/images`. See `docs/product-photo-report.md` for the products that still need a photo.
