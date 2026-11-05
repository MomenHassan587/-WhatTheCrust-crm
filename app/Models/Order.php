<?php

// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUS_PAYMENT_PENDING = 'payment_pending';

    public const STATUS_NEW = 'new';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_PREPARING = 'preparing';

    public const STATUS_READY = 'ready';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    public const STATUS_PICKED_UP = 'picked_up';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_REJECTED = 'rejected';

    public const STAFF_STATUSES = [
        self::STATUS_NEW, self::STATUS_ACCEPTED, self::STATUS_PREPARING,
        self::STATUS_READY, self::STATUS_OUT_FOR_DELIVERY, self::STATUS_PICKED_UP,
        self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_REJECTED,
    ];

    public const TRANSITIONS = [
        self::STATUS_NEW => [self::STATUS_ACCEPTED, self::STATUS_REJECTED, self::STATUS_CANCELLED],
        self::STATUS_ACCEPTED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
        self::STATUS_PREPARING => [self::STATUS_READY, self::STATUS_CANCELLED],
        self::STATUS_READY => [self::STATUS_OUT_FOR_DELIVERY, self::STATUS_PICKED_UP, self::STATUS_CANCELLED],
        self::STATUS_OUT_FOR_DELIVERY => [self::STATUS_COMPLETED, self::STATUS_CANCELLED],
        self::STATUS_PICKED_UP => [self::STATUS_COMPLETED],
    ];

    protected $fillable = [
        'user_id',
        'branch_id',
        'order_type',
        'total_price',
        'status',
        'pickup_time',
        'customer_name',
        'customer_phone',
        'delivery_address',
        'payment_method',
        'payment_status',
        'payment_gateway',
        'gateway_reference',
        'idempotency_key',
        'tracking_token',
        'status_reason',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'pickup_time' => 'datetime',
    ];

    protected $hidden = [
        'tracking_token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(OrderStatusLog::class)->orderBy('created_at');
    }
}
