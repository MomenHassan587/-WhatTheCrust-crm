<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->string('phone', 40)->nullable()->after('location');
            $table->string('opening_hours')->nullable()->after('phone');
            $table->unsignedInteger('display_order')->default(0)->after('opening_hours');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('description');
            $table->string('tag', 60)->nullable()->after('image_path');
            $table->unsignedInteger('display_order')->default(0)->after('tag');
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'tag', 'display_order']);
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn(['phone', 'opening_hours', 'display_order']);
        });
    }
};
