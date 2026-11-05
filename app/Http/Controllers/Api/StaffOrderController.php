<?php

namespace App\Http\Controllers\Api;

use App\Events\OrderStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Models\AppSetting;
use App\Models\OrderStatusLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StaffOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', 'string'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $user = $request->user();
        $orders = Order::query()
            ->with(['branch', 'user', 'items.menuItem', 'statusLogs.user'])
            ->when(! $user->isAdmin(), fn ($query) => $query->where('branch_id', $user->branch_id))
            ->where('status', '!=', Order::STATUS_PAYMENT_PENDING)
            ->where(fn ($query) => $query->where('payment_method', 'cash')->orWhere('payment_status', 'paid'))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($user->isAdmin() && $request->branch_id, fn ($query) => $query->where('branch_id', $request->branch_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('created_at', $date))
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
            'timing' => [
                'green_minutes' => (int) AppSetting::valueFor('order_promise_minutes', config('orders.kitchen_timer_green_minutes', 3)),
                'orange_minutes' => config('orders.kitchen_timer_orange_minutes', 6),
            ],
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        $this->authorizeBranch(request(), $order);

        return response()->json(['order' => $order->load(['branch', 'user', 'items.menuItem', 'statusLogs.user'])]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $this->authorizeBranch($request, $order);
        $data = $request->validated();
        DB::transaction(function () use ($request, $order, $data): void {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if (($data['expected_status'] ?? null) && $lockedOrder->status !== $data['expected_status']) {
                $exception = ValidationException::withMessages([
                    'expected_status' => ['Another staff member already updated this order. The card has been refreshed.'],
                ]);
                $exception->status(409);
                throw $exception;
            }

            $steps = $lockedOrder->status === Order::STATUS_NEW && $data['status'] === Order::STATUS_PREPARING
                ? [Order::STATUS_ACCEPTED, Order::STATUS_PREPARING]
                : [$data['status']];

            foreach ($steps as $status) {
                $allowed = $this->allowedTransitions($lockedOrder);
                if (! in_array($status, $allowed, true)) {
                    throw ValidationException::withMessages([
                        'status' => ["Cannot move an order from {$lockedOrder->status} to {$status}."],
                    ]);
                }

                $from = $lockedOrder->status;
                $lockedOrder->update([
                    'status' => $status,
                    'status_reason' => in_array($status, [Order::STATUS_CANCELLED, Order::STATUS_REJECTED], true)
                        ? ($data['reason'] ?? null)
                        : null,
                ]);
                OrderStatusLog::create([
                    'order_id' => $lockedOrder->id,
                    'user_id' => $request->user()->id,
                    'from_status' => $from,
                    'to_status' => $status,
                    'reason' => $data['reason'] ?? null,
                    'created_at' => now(),
                ]);
            }
        });

        $order = $order->fresh()->load(['branch', 'user', 'items.menuItem', 'statusLogs.user']);
        OrderStatusUpdated::dispatch($order);

        return response()->json(['message' => 'Order status updated.', 'order' => $order]);
    }

    private function allowedTransitions(Order $order): array
    {
        if ($order->status === Order::STATUS_READY) {
            return $order->order_type === 'delivery'
                ? [Order::STATUS_OUT_FOR_DELIVERY, Order::STATUS_CANCELLED]
                : [Order::STATUS_PICKED_UP, Order::STATUS_CANCELLED];
        }

        return Order::TRANSITIONS[$order->status] ?? [];
    }

    private function authorizeBranch(Request $request, Order $order): void
    {
        $user = $request->user();
        abort_unless($user->isAdmin() || (int) $user->branch_id === (int) $order->branch_id, 404);
    }
}
