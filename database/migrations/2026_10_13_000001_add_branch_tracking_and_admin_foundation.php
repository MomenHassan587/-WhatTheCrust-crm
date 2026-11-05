<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->decimal('delivery_fee', 10, 2)->default(25)->after('opening_hours');
            $table->boolean('delivery_enabled')->default(true)->after('delivery_fee');
            $table->boolean('is_active')->default(true)->after('delivery_enabled');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('role')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('branch_id');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedInteger('display_order')->default(0)->after('slug');
            $table->boolean('is_active')->default(true)->after('display_order');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('display_order');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('tracking_token', 64)->nullable()->unique()->after('idempotency_key');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('item_name')->nullable()->after('menu_item_id');
        });

        DB::table('orders')->orderBy('id')->each(function (object $order): void {
            DB::table('orders')->where('id', $order->id)->update([
                'tracking_token' => Str::random(48),
            ]);
        });

        DB::table('order_items')->orderBy('id')->each(function (object $item): void {
            $name = DB::table('menu_items')->where('id', $item->menu_item_id)->value('name');
            DB::table('order_items')->where('id', $item->id)->update([
                'item_name' => $name ?: 'Menu item',
            ]);
        });

        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('subject_type');
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('details')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['subject_type', 'subject_id']);
        });

        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        DB::table('app_settings')->insert([
            ['key' => 'default_delivery_fee', 'value' => (string) config('orders.delivery_fee', 25), 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'minimum_pickup_prep_minutes', 'value' => (string) config('orders.minimum_pickup_prep_minutes', 20), 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'order_promise_minutes', 'value' => (string) config('orders.order_promise_minutes', 3), 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('app_settings');
        Schema::dropIfExists('admin_audit_logs');

        Schema::table('order_items', fn (Blueprint $table) => $table->dropColumn('item_name'));
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn('tracking_token'));
        Schema::table('menu_items', fn (Blueprint $table) => $table->dropColumn('is_active'));
        Schema::table('categories', fn (Blueprint $table) => $table->dropColumn(['display_order', 'is_active']));
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('branch_id');
            $table->dropColumn('is_active');
        });
        Schema::table('branches', fn (Blueprint $table) => $table->dropColumn(['delivery_fee', 'delivery_enabled', 'is_active']));
    }
};
