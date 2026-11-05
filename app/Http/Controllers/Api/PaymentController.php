<?php

namespace App\Http\Controllers\Api;

use App\Contracts\PaymentGateway;
use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Services\Orders\OrderCreator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class PaymentController extends Controller
{
    public function createIntent(StoreOrderRequest $request, OrderCreator $creator, PaymentGateway $gateway): JsonResponse
    {
        $data = $request->validated();
        if ($data['payment_method'] !== 'card') {
            throw ValidationException::withMessages(['payment_method' => ['Select card payment to create a payment intent.']]);
        }

        $key = $request->header('Idempotency-Key') ?: ($data['idempotency_key'] ?? null);
        if (! $key) {
            throw ValidationException::withMessages(['idempotency_key' => ['An idempotency key is required.']]);
        }

        if ($existing = Order::where('idempotency_key', $key)->first()) {
            return response()->json([
                'order_id' => $existing->id,
                'tracking_token' => $existing->tracking_token,
                'tracking_url' => "/orders/{$existing->tracking_token}",
                'client_secret' => null,
                'message' => 'This payment request has already been created.',
            ], 409);
        }

        $data['idempotency_key'] = $key;
        $order = $creator->create($data, $request->user(), Order::STATUS_PAYMENT_PENDING);

        try {
            $intent = $gateway->createIntent(
                (int) round(((float) $order->total_price) * 100),
                'egp',
                ['order_id' => (string) $order->id],
                $key,
            );
            $order->update(['payment_gateway' => 'stripe', 'gateway_reference' => $intent['id']]);
        } catch (Throwable $exception) {
            $order->delete();
            report($exception);

            return response()->json(['message' => 'Card payment could not be started.'], 502);
        }

        return response()->json([
            'order_id' => $order->id,
            'tracking_token' => $order->tracking_token,
            'tracking_url' => "/orders/{$order->tracking_token}",
            'client_secret' => $intent['client_secret'],
            'publishable_key' => config('services.stripe.key'),
        ], 201);
    }

    public function webhook(Request $request, PaymentGateway $gateway): JsonResponse
    {
        try {
            $event = $gateway->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'));
        } catch (Throwable) {
            return response()->json(['message' => 'Invalid webhook signature.'], 400);
        }

        $intent = $event->data->object;
        $order = Order::where('gateway_reference', $intent->id ?? null)->first();
        if (! $order) {
            return response()->json(['received' => true]);
        }

        if ($event->type === 'payment_intent.succeeded' && $order->payment_status !== 'paid') {
            DB::transaction(function () use ($order): void {
                $from = $order->status;
                $order->update(['payment_status' => 'paid', 'status' => Order::STATUS_NEW]);
                OrderStatusLog::create([
                    'order_id' => $order->id,
                    'from_status' => $from,
                    'to_status' => Order::STATUS_NEW,
                    'created_at' => now(),
                ]);
            });
            OrderPlaced::dispatch($order->fresh());
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $order->update(['payment_status' => 'failed']);
        }

        return response()->json(['received' => true]);
    }
}
