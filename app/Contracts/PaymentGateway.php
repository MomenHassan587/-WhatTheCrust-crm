<?php

namespace App\Contracts;

interface PaymentGateway
{
    public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array;

    public function parseWebhook(string $payload, string $signature): object;
}
