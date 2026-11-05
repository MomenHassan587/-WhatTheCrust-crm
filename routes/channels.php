<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('staff.admin', fn ($user) => $user->isAdmin() && $user->is_active);
Broadcast::channel('staff.branch.{branchId}', fn ($user, int $branchId) => $user->is_active && (
    $user->isAdmin() || ($user->role === 'staff' && (int) $user->branch_id === $branchId)
));
