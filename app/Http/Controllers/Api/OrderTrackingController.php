<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderTrackingController extends Controller
{
    public function show(string $token): JsonResponse
    {
        $order = Order::query()
            ->where('tracking_token', $token)
            ->with(['branch', 'items', 'statusLogs'])
            ->firstOrFail();

        return response()->json(['order' => $this->safeOrder($order)]);
    }

    public function history(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()
            ->with(['branch', 'items', 'statusLogs'])
            ->latest()
            ->get()
            ->map(fn (Order $order) => $this->safeOrder($order, true));

        return response()->json(['orders' => $orders]);
    }

    public function reorder(Request $request, Order $order): JsonResponse
    {
        abort_unless((int) $order->user_id === (int) $request->user()->id, 404);
        $order->load(['branch', 'items.menuItem.branches']);

        $cartItems = $order->items->map(function ($line) use ($order) {
            $item = $line->menuItem;
            $option = $item?->branches->firstWhere('id', $order->branch_id);
            if (! $item?->is_active || ! $option?->pivot?->is_available) {
                return null;
            }

            return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'price' => (float) $option->pivot->price,
                'image_src' => $item->image_path,
                'branch_id' => $order->branch_id,
                'branch_name' => $order->branch->name,
                'quantity' => $line->quantity,
                'notes' => $line->notes,
            ];
        })->filter()->values();

        return response()->json([
            'branch_id' => $order->branch_id,
            'order_type' => $order->order_type,
            'cart_items' => $cartItems,
            'skipped_items' => $order->items->count() - $cartItems->count(),
        ]);
    }

    private function safeOrder(Order $order, bool $includeToken = false): array
    {
        return [
            'id' => $order->id,
            'tracking_token' => $includeToken ? $order->tracking_token : null,
            'status' => $order->status,
            'status_reason' => $order->status_reason,
            'order_type' => $order->order_type,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'delivery_address' => $order->delivery_address,
            'pickup_time' => $order->pickup_time,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'total_price' => $order->total_price,
            'created_at' => $order->created_at,
            'branch' => $order->branch?->only(['id', 'name', 'location', 'phone', 'opening_hours']),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'item_name' => $item->item_name,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'notes' => $item->notes,
            ]),
            'status_logs' => $order->statusLogs->map(fn ($log) => [
                'to_status' => $log->to_status,
                'reason' => $log->reason,
                'created_at' => $log->created_at,
            ]),
        ];
    }
}
