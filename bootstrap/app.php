<?php

use App\Http\Middleware\RequireRole;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        channels: __DIR__.'/../routes/channels.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias(['role' => RequireRole::class]);
        $middleware->validateCsrfTokens(except: ['api/payments/webhook']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (QueryException $exception, Request $request) {
            $message = strtolower($exception->getMessage());
            $isConnectionProblem = str_contains($message, 'connection refused')
                || str_contains($message, 'no connection could be made')
                || str_contains($message, 'unknown database')
                || str_contains($message, 'server has gone away')
                || str_contains($message, 'sqlstate[hy000] [2002]')
                || str_contains($message, 'sqlstate[hy000] [1049]');

            if (! $isConnectionProblem) {
                return null;
            }

            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Database is not running. Start MySQL in XAMPP and check the database name in .env.',
                ], 503);
            }

            return response()->view('errors.database', status: 503);
        });
    })->create();
