<?php

// app/Models/Branch.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'location',
        'phone',
        'opening_hours',
        'delivery_fee',
        'delivery_enabled',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'delivery_fee' => 'decimal:2',
        'delivery_enabled' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function menuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class)
            ->withPivot(['price', 'is_available'])
            ->withTimestamps();
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
