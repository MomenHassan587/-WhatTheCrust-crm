<?php

return [
    'minimum_pickup_prep_minutes' => (int) env('ORDER_MIN_PICKUP_PREP_MINUTES', 20),
    'delivery_fee' => (float) env('ORDER_DELIVERY_FEE', 25),
    'order_promise_minutes' => (int) env('ORDER_PROMISE_MINUTES', 3),
    'kitchen_timer_green_minutes' => (int) env('ORDER_KITCHEN_GREEN_MINUTES', 3),
    'kitchen_timer_orange_minutes' => (int) env('ORDER_KITCHEN_ORANGE_MINUTES', 6),
];
