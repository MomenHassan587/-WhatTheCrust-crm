<?php

// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(MenuCatalogSeeder::class);
        $this->call(StaffUserSeeder::class);
        $this->call(DemoOrderSeeder::class);
    }
}
