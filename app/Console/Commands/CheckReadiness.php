<?php

namespace App\Console\Commands;

use App\Models\Branch;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckReadiness extends Command
{
    protected $signature = 'app:readiness';

    protected $description = 'Check local setup, database data, migrations, and Stripe test keys';

    public function handle(): int
    {
        $failed = false;
        $this->components->info('What The Crust readiness check');

        if (file_exists(base_path('.env'))) {
            $this->line('<fg=green>PASS</> .env exists.');
        } else {
            $this->line('<fg=red>FAIL</> .env is missing. Copy .env.example to .env.');
            $failed = true;
        }

        if (config('database.default') === 'mysql') {
            $this->line('<fg=green>PASS</> MySQL is the active database connection.');
        } else {
            $this->line('<fg=yellow>WARN</> The active database is '.config('database.default').'. MySQL is recommended for XAMPP.');
        }

        try {
            DB::connection()->getPdo();
            $this->line('<fg=green>PASS</> Database connection works.');

            $migrator = app('migrator');
            if (! $migrator->repositoryExists()) {
                $this->line('<fg=red>FAIL</> Migration table is missing. Run php artisan migrate.');
                $failed = true;
            } else {
                $files = $migrator->getMigrationFiles(database_path('migrations'));
                $pending = array_diff(array_keys($files), $migrator->getRepository()->getRan());
                if ($pending === []) {
                    $this->line('<fg=green>PASS</> All migrations have run.');
                } else {
                    $this->line('<fg=red>FAIL</> '.count($pending).' migration(s) are pending. Run php artisan migrate.');
                    $failed = true;
                }
            }

            $expectedBranches = ['The Drive', 'Golf Central', 'LakeHouse'];
            $hasSeedData = Branch::whereIn('name', $expectedBranches)->count() === 3
                && Category::count() >= 7
                && MenuItem::count() >= 47
                && User::whereIn('role', ['staff', 'admin'])->exists()
                && Order::where('idempotency_key', 'like', 'demo-order-%')->exists();
            if ($hasSeedData) {
                $this->line('<fg=green>PASS</> Menu, branches, staff account, and demo orders are seeded.');
            } else {
                $this->line('<fg=red>FAIL</> Seed data is incomplete. Run php artisan db:seed.');
                $failed = true;
            }
        } catch (\Throwable $exception) {
            $this->line('<fg=red>FAIL</> Database is not ready: '.$exception->getMessage());
            $this->line('Start MySQL in XAMPP and create the database named in DB_DATABASE.');
            $failed = true;
        }

        $stripe = config('services.stripe');
        $stripeReady = str_starts_with((string) $stripe['key'], 'pk_test_')
            && ! str_contains((string) $stripe['key'], 'replace_me')
            && str_starts_with((string) $stripe['secret'], 'sk_test_')
            && ! str_contains((string) $stripe['secret'], 'replace_me')
            && str_starts_with((string) $stripe['webhook_secret'], 'whsec_')
            && ! str_contains((string) $stripe['webhook_secret'], 'replace_me');
        if ($stripeReady) {
            $this->line('<fg=green>PASS</> Stripe test keys are configured.');
        } else {
            $this->line('<fg=yellow>WARN</> Stripe test keys are placeholders. Cash orders work, but card payments do not.');
        }

        $this->newLine();
        $failed ? $this->components->error('Setup is not ready yet.') : $this->components->info('Setup is ready.');

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
