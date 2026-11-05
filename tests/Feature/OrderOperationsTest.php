<?php

namespace Tests\Feature;

use App\Contracts\PaymentGateway;
use App\Events\OrderPlaced;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\MenuCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class OrderOperationsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MenuCatalogSeeder::class);
        Event::fake([OrderPlaced::class, OrderStatusUpdated::class]);
    }

    public function test_staff_routes_require_authentication_and_role(): void
    {
        $this->getJson('/api/staff/orders')->assertUnauthorized();

        $customer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($customer)->getJson('/api/staff/orders')->assertForbidden();

        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $this->actingAs($staff)->getJson('/api/staff/orders')->assertOk();
    }

    public function test_staff_status_transition_is_validated_and_logged(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);

        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", ['status' => 'ready'])
            ->assertUnprocessable();

        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", ['status' => 'accepted'])
            ->assertOk()->assertJsonPath('order.status', 'accepted');

        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id, 'user_id' => $staff->id,
            'from_status' => 'new', 'to_status' => 'accepted',
        ]);
    }

    public function test_accept_and_start_preparing_writes_both_honest_status_logs(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);

        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", [
            'status' => 'preparing',
            'expected_status' => 'new',
        ])->assertOk()->assertJsonPath('order.status', 'preparing');

        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id, 'from_status' => 'new', 'to_status' => 'accepted',
        ]);
        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id, 'from_status' => 'accepted', 'to_status' => 'preparing',
        ]);
    }

    public function test_stale_staff_update_returns_a_friendly_conflict(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_PREPARING, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);

        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", [
            'status' => 'accepted',
            'expected_status' => 'new',
        ])->assertStatus(409)->assertJsonValidationErrors('expected_status');

        $this->assertSame(Order::STATUS_PREPARING, $order->fresh()->status);
    }

    public function test_pickup_time_and_item_notes_are_validated_and_saved(): void
    {
        Carbon::setTestNow('2026-09-28 12:00:00');
        $payload = [
            'branch_id' => 1,
            'order_type' => 'pickup',
            'customer_name' => 'Test Customer',
            'customer_phone' => '01000000000',
            'payment_method' => 'cash',
            'pickup_time' => now()->addMinutes(10)->format('Y-m-d\TH:i'),
            'items' => [['menu_item_id' => 1, 'quantity' => 1, 'notes' => 'No onions']],
        ];

        $this->postJson('/api/orders', $payload)->assertUnprocessable()->assertJsonValidationErrors('pickup_time');

        $payload['pickup_time'] = now()->addMinutes(30)->format('Y-m-d\TH:i');
        $this->postJson('/api/orders', $payload)->assertCreated()->assertJsonPath('order.items.0.notes', 'No onions');
        $this->assertDatabaseHas('order_items', ['notes' => 'No onions']);
    }

    public function test_verified_payment_webhook_marks_order_paid_once(): void
    {
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'pickup', 'total_price' => 100,
            'status' => Order::STATUS_PAYMENT_PENDING, 'payment_method' => 'card',
            'payment_status' => 'pending', 'payment_gateway' => 'stripe', 'gateway_reference' => 'pi_test',
        ]);

        $event = (object) [
            'type' => 'payment_intent.succeeded',
            'data' => (object) ['object' => (object) ['id' => 'pi_test']],
        ];

        $gateway = new class($event) implements PaymentGateway
        {
            public function __construct(private object $event) {}

            public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array
            {
                return [];
            }

            public function parseWebhook(string $payload, string $signature): object
            {
                return $this->event;
            }
        };
        $this->app->instance(PaymentGateway::class, $gateway);

        $this->postJson('/api/payments/webhook', [], ['Stripe-Signature' => 'valid'])->assertOk();
        $this->postJson('/api/payments/webhook', [], ['Stripe-Signature' => 'valid'])->assertOk();

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid', 'status' => 'new']);
        $this->assertDatabaseCount('order_status_logs', 1);
    }

    public function test_branch_staff_only_see_and_update_their_own_branch_orders(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $own = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);
        $other = Order::create([
            'branch_id' => 2, 'order_type' => 'delivery', 'total_price' => 120,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);

        $this->actingAs($staff)->getJson('/api/staff/orders')
            ->assertOk()
            ->assertJsonCount(1, 'orders')
            ->assertJsonPath('orders.0.id', $own->id);
        $this->actingAs($staff)->getJson("/api/staff/orders/{$other->id}")->assertNotFound();
        $this->actingAs($staff)->patchJson("/api/staff/orders/{$other->id}/status", ['status' => 'accepted'])->assertNotFound();
    }

    public function test_admin_can_see_all_branches_and_filter_them(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'branch_id' => null]);
        Order::create(['branch_id' => 1, 'order_type' => 'pickup', 'total_price' => 90, 'status' => 'new', 'payment_method' => 'cash', 'payment_status' => 'unpaid']);
        Order::create(['branch_id' => 2, 'order_type' => 'pickup', 'total_price' => 95, 'status' => 'new', 'payment_method' => 'cash', 'payment_status' => 'unpaid']);

        $this->actingAs($admin)->getJson('/api/staff/orders')->assertOk()->assertJsonCount(2, 'orders');
        $this->actingAs($admin)->getJson('/api/staff/orders?branch_id=2')->assertOk()->assertJsonCount(1, 'orders')->assertJsonPath('orders.0.branch_id', 2);
    }

    public function test_guest_tracking_uses_a_random_token_and_returns_safe_fields(): void
    {
        $payload = [
            'branch_id' => 1, 'order_type' => 'pickup', 'customer_name' => 'Guest Customer',
            'customer_phone' => '01000000000', 'payment_method' => 'cash',
            'pickup_time' => now()->addMinutes(30)->format('Y-m-d\TH:i'),
            'items' => [['menu_item_id' => 1, 'quantity' => 1]],
        ];

        $created = $this->postJson('/api/orders', $payload)->assertCreated();
        $token = $created->json('tracking_token');
        $this->assertGreaterThanOrEqual(40, strlen($token));
        $created->assertJsonPath('tracking_url', "/orders/{$token}");

        $this->getJson("/api/orders/track/{$token}")
            ->assertOk()
            ->assertJsonPath('order.customer_name', 'Guest Customer')
            ->assertJsonMissingPath('order.user_id')
            ->assertJsonMissingPath('order.gateway_reference');
        $this->getJson('/api/orders/track/not-a-real-token')->assertNotFound();
    }

    public function test_customer_history_and_reorder_are_owner_only(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $otherCustomer = User::factory()->create(['role' => 'customer']);
        $order = Order::create([
            'user_id' => $customer->id, 'branch_id' => 1, 'order_type' => 'pickup',
            'total_price' => 90, 'status' => 'completed', 'payment_method' => 'cash',
            'payment_status' => 'unpaid', 'tracking_token' => 'customer-history-token',
        ]);
        $order->items()->create(['menu_item_id' => 1, 'item_name' => 'Margherita Verace', 'quantity' => 1, 'price' => 190]);

        $this->actingAs($customer)->getJson('/api/orders/history')
            ->assertOk()->assertJsonCount(1, 'orders')
            ->assertJsonPath('orders.0.tracking_token', 'customer-history-token');
        $this->actingAs($customer)->postJson("/api/orders/{$order->id}/reorder")
            ->assertOk()->assertJsonPath('cart_items.0.name', 'Margherita Verace');
        $this->actingAs($otherCustomer)->postJson("/api/orders/{$order->id}/reorder")->assertNotFound();
    }

    public function test_only_admin_can_open_admin_api(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($staff)->getJson('/api/admin/dashboard')->assertForbidden();
        $this->actingAs($admin)->getJson('/api/admin/dashboard')->assertOk();
    }

    public function test_admin_mutations_are_role_protected_validated_and_audited(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $admin = User::factory()->create(['role' => 'admin']);
        $payload = [
            'name' => 'The Drive',
            'location' => 'Updated New Cairo address',
            'phone' => '01000000000',
            'opening_hours' => '4 PM - 2 AM',
            'delivery_fee' => 35,
            'delivery_enabled' => true,
            'is_active' => true,
            'display_order' => 1,
        ];

        $this->actingAs($staff)->putJson('/api/admin/branches/1', $payload)->assertForbidden();
        $this->actingAs($admin)->putJson('/api/admin/branches/1', [])->assertUnprocessable();
        $this->actingAs($admin)->putJson('/api/admin/branches/1', $payload)
            ->assertOk()
            ->assertJsonPath('branch.delivery_fee', '35.00');

        $this->assertDatabaseHas('admin_audit_logs', [
            'user_id' => $admin->id,
            'action' => 'branch.updated',
            'subject_id' => 1,
        ]);
    }
}
