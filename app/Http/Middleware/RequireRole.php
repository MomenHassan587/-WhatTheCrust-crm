<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        abort_unless($user && $user->is_active && in_array($user->role, $roles, true), 403);
        abort_if($user->role === 'staff' && ! $user->branch_id, 403, 'This staff account is not assigned to a branch.');

        return $next($request);
    }
}
