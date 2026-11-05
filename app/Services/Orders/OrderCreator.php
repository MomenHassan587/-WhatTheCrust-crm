<?php

namespace App\Services\Orders;

use App\Models\Branch;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderCreator
{
    public function create(array $data, ?User $user, string $status): Order
    {
        return DB::transaction(function () use ($data, $user, $status) {
            $branch = Branch::query()->where('is_active', true)->findOrFail($data['branch_id']);
            if ($data['order_type'] === 'delivery' && ! $branch->delivery_enabled) {
                throw ValidationException::withMessages([
                    'branch_id' => ['This branch is not accepting delivery orders right now.'],
                ]);
            }
            $order = Order::create([
                'user_id' => $user?->id,
                'branch_id' => $branch->id,
                'order_type' => $data['order_type'],
                'pickup_time' => $data['order_type'] === 'pickup' ? $data['pickup_time'] : null,
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'delivery_address' => $data['order_type'] === 'delivery' ? $data['delivery_address'] : null,
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_method'] === 'card' ? 'pending' : 'unpaid',
                'status' => $status,
                'idempotency_key' => $data['idempotency_key'] ?? null,
                'tracking_token' => Str::random(48),
                'total_price' => 0,
            ]);

            $total = 0;
            foreach ($data['items'] as $line) {
                $menuItem = MenuItem::query()
                    ->where('is_active', true)
                    ->whereHas('category', fn ($query) => $query->where('is_active', true))
                    ->find($line['menu_item_id']);
                $pivot = DB::table('branch_menu_item')
                    ->where('branch_id', $branch->id)
                    ->where('menu_item_id', $line['menu_item_id'])
                    ->first();

                if (! $menuItem || ! $pivot || ! $pivot->is_available) {
                    throw ValidationException::withMessages([
                        'items' => ["Menu item {$line['menu_item_id']} is unavailable at {$branch->name}."],
                    ]);
                }

                $price = (float) $pivot->price;
                $quantity = (int) $line['quantity'];
                $total += $price * $quantity;
                $order->items()->create([
                    'menu_item_id' => $line['menu_item_id'],
                    'item_name' => $menuItem->name,
                    'quantity' => $quantity,
                    'price' => $price,
                    'notes' => $line['notes'] ?? null,
                ]);
            }

            if ($data['order_type'] === 'delivery') {
                $total += (float) $branch->delivery_fee;
            }

            $order->update(['total_price' => $total]);

            return $order->load(['branch', 'user', 'items.menuItem']);
        });
    }
}
