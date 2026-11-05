<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripePaymentGateway implements PaymentGateway
{
    public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array
    {
        $intent = (new StripeClient(config('services.stripe.secret')))->paymentIntents->create([
            'amount' => $amount,
            'currency' => $currency,
            'automatic_payment_methods' => ['enabled' => true],
            'metadata' => $metadata,
        ], ['idempotency_key' => $idempotencyKey]);

        return ['id' => $intent->id, 'client_secret' => $intent->client_secret];
    }

    public function parseWebhook(string $payload, string $signature): object
    {
        return Webhook::constructEvent($payload, $signature, config('services.stripe.webhook_secret'));
    }
}
