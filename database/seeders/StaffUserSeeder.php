<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StaffUserSeeder extends Seeder
{
    public function run(): void
    {
        $staffPassword = env('STAFF_PASSWORD');
        $adminPassword = env('ADMIN_PASSWORD') ?: $staffPassword;

        if (! $staffPassword || ! $adminPassword) {
            $this->command?->warn('STAFF_PASSWORD and ADMIN_PASSWORD must be set before staff accounts can be seeded.');
            return;
        }

        Branch::query()->where('is_active', true)->each(function (Branch $branch) use ($staffPassword): void {
            $slug = Str::slug($branch->name);
            User::updateOrCreate(
                ['email' => "staff.{$slug}@whatthecrust.test"],
                [
                    'name' => "{$branch->name} Staff",
                    'password' => $staffPassword,
                    'role' => 'staff',
                    'branch_id' => $branch->id,
                    'is_active' => true,
                ],
            );
        });

        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@whatthecrust.test')],
            [
                'name' => env('ADMIN_NAME', 'What The Crust Admin'),
                'password' => $adminPassword,
                'role' => 'admin',
                'branch_id' => null,
                'is_active' => true,
            ],
        );
    }
}
