<?php

namespace App\Services;

use App\Models\AdminAuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AdminAudit
{
    public function record(User $user, string $action, Model|string $subject, array $details = []): void
    {
        AdminAuditLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'subject_type' => $subject instanceof Model ? $subject::class : $subject,
            'subject_id' => $subject instanceof Model ? $subject->getKey() : null,
            'details' => $details,
            'created_at' => now(),
        ]);
    }
}
