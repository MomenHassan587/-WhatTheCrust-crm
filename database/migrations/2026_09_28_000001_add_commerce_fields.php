<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->index();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('new')->change();
            $table->dateTime('pickup_time')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone', 40)->nullable();
            $table->text('delivery_address')->nullable();
            $table->string('payment_method')->default('cash');
            $table->string('payment_status')->default('unpaid')->index();
            $table->string('payment_gateway')->nullable();
            $table->string('gateway_reference')->nullable()->unique();
            $table->string('idempotency_key')->nullable()->unique();
            $table->text('status_reason')->nullable();
        });

        DB::table('orders')->where('status', 'pending')->update(['status' => 'new']);
        DB::table('orders')->where('status', 'confirmed')->update(['status' => 'accepted']);

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('notes', 200)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('order_items', fn (Blueprint $table) => $table->dropColumn('notes'));

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'pickup_time', 'customer_name', 'customer_phone', 'delivery_address',
                'payment_method', 'payment_status', 'payment_gateway', 'gateway_reference',
                'idempotency_key', 'status_reason',
            ]);
        });

        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('role'));
    }
};
