<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoOrderSeeder extends Seeder
{
    public function run(): void
    {
        $staff = User::whereIn('role', ['staff', 'admin'])->first();
        $examples = [
            ['new', 'delivery', 1, 'Mariam Adel', '01090000101', [1, 24]],
            ['accepted', 'pickup', 2, 'Omar Hany', '01090000102', [5]],
            ['preparing', 'delivery', 3, 'Nour Ahmed', '01090000103', [2, 14]],
            ['ready', 'pickup', 1, 'Youssef Ali', '01090000104', [3, 20]],
            ['out_for_delivery', 'delivery', 2, 'Salma Tarek', '01090000105', [6, 25]],
            ['picked_up', 'pickup', 3, 'Karim Mostafa', '01090000106', [7, 18]],
            ['completed', 'delivery', 1, 'Farah Samir', '01090000107', [4, 28]],
            ['completed', 'pickup', 2, 'Ziad Emad', '01090000108', [5, 17]],
            ['cancelled', 'delivery', 3, 'Laila Wael', '01090000109', [1]],
            ['rejected', 'pickup', 1, 'Adam Khaled', '01090000110', [8]],
        ];

        foreach ($examples as $index => [$status, $type, $branchId, $name, $phone, $itemIds]) {
            $createdAt = now()->subMinutes(($index + 1) * 7);
            $order = Order::updateOrCreate(
                ['idempotency_key' => "demo-order-{$index}"],
                [
                    'branch_id' => $branchId,
                    'tracking_token' => Str::random(48),
                    'order_type' => $type,
                    'pickup_time' => $type === 'pickup' ? now()->addMinutes(35 + $index * 5) : null,
                    'customer_name' => $name,
                    'customer_phone' => $phone,
                    'delivery_address' => $type === 'delivery' ? (12 + $index).' Demo Street, Cairo' : null,
                    'payment_method' => $index % 3 === 0 ? 'card' : 'cash',
                    'payment_status' => $index % 3 === 0 ? 'paid' : 'unpaid',
                    'payment_gateway' => $index % 3 === 0 ? 'stripe' : null,
                    'gateway_reference' => $index % 3 === 0 ? "pi_demo_{$index}" : null,
                    'status' => $status,
                    'status_reason' => $status === 'cancelled' ? 'Customer changed their plans.' : ($status === 'rejected' ? 'Kitchen capacity reached.' : null),
                    'total_price' => 0,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ],
            );

            $order->items()->delete();
            $total = 0;
            foreach ($itemIds as $position => $menuItemId) {
                $pivot = DB::table('branch_menu_item')->where('branch_id', $branchId)->where('menu_item_id', $menuItemId)->first();
                if (! $pivot) {
                    continue;
                }
                $quantity = $position === 0 && $index % 2 === 0 ? 2 : 1;
                $order->items()->create([
                    'menu_item_id' => $menuItemId,
                    'item_name' => DB::table('menu_items')->where('id', $menuItemId)->value('name') ?: 'Menu item',
                    'quantity' => $quantity,
                    'price' => $pivot->price,
                    'notes' => $position === 0 && $index % 2 === 0 ? 'Demo note: extra crispy, please.' : null,
                ]);
                $total += (float) $pivot->price * $quantity;
            }
            if ($type === 'delivery') {
                $total += (float) config('orders.delivery_fee', 25);
            }
            $order->update(['total_price' => $total, 'created_at' => $createdAt, 'updated_at' => $createdAt]);

            $order->statusLogs()->delete();
            foreach ($this->statusPath($status, $type) as $step => [$from, $to]) {
                OrderStatusLog::create([
                    'order_id' => $order->id,
                    'user_id' => $staff?->id,
                    'from_status' => $from,
                    'to_status' => $to,
                    'reason' => in_array($to, ['cancelled', 'rejected'], true) ? $order->status_reason : null,
                    'created_at' => $createdAt->copy()->addMinutes($step * 2),
                ]);
            }
        }
    }

    private function statusPath(string $status, string $type): array
    {
        $delivery = ['new', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'completed'];
        $pickup = ['new', 'accepted', 'preparing', 'ready', 'picked_up', 'completed'];
        $path = $type === 'pickup' ? $pickup : $delivery;
        if (in_array($status, ['cancelled', 'rejected'], true)) {
            $path = ['new', $status];
        } else {
            $path = array_slice($path, 0, array_search($status, $path, true) + 1);
        }

        $logs = [];
        foreach ($path as $index => $to) {
            $logs[] = [$index === 0 ? null : $path[$index - 1], $to];
        }

        return $logs;
    }
}
