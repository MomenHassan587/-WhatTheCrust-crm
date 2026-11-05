<?php

namespace App\Http\Controllers\Api;

use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\Orders\OrderCreator;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, OrderCreator $creator): JsonResponse
    {
        $data = $request->validated();
        if ($data['payment_method'] === 'card') {
            throw ValidationException::withMessages(['payment_method' => ['Card orders must use the payment intent endpoint.']]);
        }

        $order = $creator->create($data, $request->user(), Order::STATUS_NEW);
        OrderPlaced::dispatch($order);

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order,
            'tracking_token' => $order->tracking_token,
            'tracking_url' => "/orders/{$order->tracking_token}",
        ], 201);
    }
}
