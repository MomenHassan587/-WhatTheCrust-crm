<?php

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Export public menu fields only. Never export users, orders, credentials, or .env.
$response = app(App\Http\Controllers\Api\MenuController::class)->index();
$payload = $response->getData(true);
if (empty($payload['branches']) || empty($payload['items'])) {
    throw new RuntimeException('Seed the menu before exporting the demo catalog.');
}
file_put_contents(__DIR__.'/../resources/js/demo/catalog.json', json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL);
echo 'Exported public catalog: '.count($payload['items']).' products.'.PHP_EOL;
