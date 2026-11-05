# اختبارات الصلاحيات والطلب والدفع والتتبع

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `tests/Feature/OrderOperationsTest.php` · 259 سطر.

**وظيفة الملف:** Feature tests بقاعدة اختبار RefreshDatabase وcatalogue seed وevents fake. لا نشغّلها على DB الشغل بلا تحقق من test config. fake gateway يثبت منطق webhook وليس اتصال Stripe الحقيقي أو سلامة SDK signature.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../tests/Feature/OrderOperationsTest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Contracts/PaymentGateway.php](../../app/Contracts/PaymentGateway.php.md)

- [pizza-crm/app/Events/OrderPlaced.php](../../app/Events/OrderPlaced.php.md)

- [pizza-crm/app/Events/OrderStatusUpdated.php](../../app/Events/OrderStatusUpdated.php.md)

- [pizza-crm/app/Models/Order.php](../../app/Models/Order.php.md)

- [pizza-crm/app/Models/User.php](../../app/Models/User.php.md)

- [pizza-crm/database/seeders/MenuCatalogSeeder.php](../../database/seeders/MenuCatalogSeeder.php.md)

- [pizza-crm/app/Http/Middleware/RequireRole.php](../../app/Http/Middleware/RequireRole.php.md)

- [pizza-crm/app/Http/Controllers/Api/StaffOrderController.php](../../app/Http/Controllers/Api/StaffOrderController.php.md)

- [pizza-crm/app/Models/OrderStatusLog.php](../../app/Models/OrderStatusLog.php.md)

- [pizza-crm/app/Http/Requests/StoreOrderRequest.php](../../app/Http/Requests/StoreOrderRequest.php.md)

- [pizza-crm/app/Http/Controllers/Api/PaymentController.php](../../app/Http/Controllers/Api/PaymentController.php.md)

- [pizza-crm/app/Http/Controllers/Api/OrderTrackingController.php](../../app/Http/Controllers/Api/OrderTrackingController.php.md)

- [pizza-crm/routes/web.php](../../routes/web.php.md)

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../../app/Http/Controllers/Api/AdminController.php.md)

- [pizza-crm/app/Services/AdminAudit.php](../../app/Services/AdminAudit.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
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
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### setUp

جهّز Laravel من الأب ثم seed catalogue وامنع بث events الحقيقي بالfake.

- **بتاخد إيه؟ Inputs:** دورة PHPUnit قبل كل test.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

### test_staff_routes_require_authentication_and_role

اثبت 401 للضيف و403 للعميل و200 لموظف بفرع.

- **بتاخد إيه؟ Inputs:** users factory.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_staff_status_transition_is_validated_and_logged

new=>ready مرفوض وnew=>accepted مقبول ومحفوظ في log.

- **بتاخد إيه؟ Inputs:** order وstaff تجريبيان.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_accept_and_start_preparing_writes_both_honest_status_logs

الاختصار new=>preparing يكتب خطوتين accepted ثم preparing.

- **بتاخد إيه؟ Inputs:** PATCH status/expected_status.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_stale_staff_update_returns_a_friendly_conflict

لو expected_status قديمة يرجع409 ولا يرجع الطلب لحالة قديمة.

- **بتاخد إيه؟ Inputs:** order preparing وrequest تتوقع new.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_pickup_time_and_item_notes_are_validated_and_saved

ثبت وقت الاختبار وجرّب pickup بعد10دقائق مرفوض وبعد30 مقبول مع notes محفوظة.

- **بتاخد إيه؟ Inputs:** Carbon test clock وpayload.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_verified_payment_webhook_marks_order_paid_once

بدّل PaymentGateway بfake event وابعت webhook مرتين؛ تأكد paid/new وlog واحدة في السيناريو المتتابع.

- **بتاخد إيه؟ Inputs:** fake gateway وOrder payment_pending.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions؛ لا يختبر concurrency أو Stripe الحقيقي.

### test_branch_staff_only_see_and_update_their_own_branch_orders

الموظف يشوف طلب فرعه فقط و404 عند show/update لفرع آخر.

- **بتاخد إيه؟ Inputs:** طلبان بفرعين مختلفين.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_admin_can_see_all_branches_and_filter_them

الإدمن يشوف الفرعين ويقدر يفلتر branch_id.

- **بتاخد إيه؟ Inputs:** admin وطلبان.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_guest_tracking_uses_a_random_token_and_returns_safe_fields

اطلب كضيف ثم تتبع بالtoken؛ افحص طوله وعدم وجود user_id/gateway_reference في الرد.

- **بتاخد إيه؟ Inputs:** cash pickup payload.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_customer_history_and_reorder_are_owner_only

صاحب الطلب يشوفه ويعيد للسلة وغير المالك404.

- **بتاخد إيه؟ Inputs:** customer وotherCustomer وorder بitem.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_only_admin_can_open_admin_api

dashboard403 للموظف و200 للإدمن.

- **بتاخد إيه؟ Inputs:** factory staff/admin.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_admin_mutations_are_role_protected_validated_and_audited

تعديل فرع403 لstaff و422 للبيانات الفاضية و200 للصحيح مع audit row.

- **بتاخد إيه؟ Inputs:** branch payload وadmin.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### parent::setUp

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** جهّز Laravel من الأب ثم seed catalogue وامنع بث events الحقيقي بالfake.

- **المدخلات — Arguments:** دورة PHPUnit قبل كل test.

- **الناتج/الأثر — Return / effect:** void.

- **أول موضع هنا:** السطر 22.

### $this->seed

- **جاية منين؟** Laravel TestCase/Seeder

- **وظيفتها:** تشغل seeders على اتصال البيئة الحالية.

- **المدخلات — Arguments:** seeder class(es).

- **الناتج/الأثر — Return / effect:** الأثر إنشاء بيانات؛ متجربهاش على production للتعلم.

- **أول موضع هنا:** السطر 23.

### Event::fake

- **جاية منين؟** Laravel Event facade

- **وظيفتها:** تستبدل إطلاق الأحداث الحقيقي بمسجل للاختبار.

- **المدخلات — Arguments:** events اختيارية.

- **الناتج/الأثر — Return / effect:** EventFake؛ مش اختبار WebSocket حقيقي.

- **أول موضع هنا:** السطر 24.

### $this->getJson

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تنفّذ طلب GET اختباري وتتوقع JSON.

- **المدخلات — Arguments:** URI وheaders اختيارية.

- **الناتج/الأثر — Return / effect:** TestResponse؛ مش اتصال production عادة.

- **أول موضع هنا:** السطر 200.

### ->assertUnauthorized

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد status401.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** TestResponse أو assertion failure.

- **أول موضع هنا:** السطر 29.

### User::factory

- **جاية منين؟** Laravel Model

- **وظيفتها:** تجهز factory بيانات للاختبار/seed.

- **المدخلات — Arguments:** count/state اختيارية.

- **الناتج/الأثر — Return / effect:** Factory، وليست records محفوظة قبل create.

- **أول موضع هنا:** السطر 234.

### ->create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 234.

### $this->actingAs

- **جاية منين؟** Laravel testing

- **وظيفتها:** خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي.

- **المدخلات — Arguments:** User وguard اختياري.

- **الناتج/الأثر — Return / effect:** test instance قابلة للchain.

- **أول موضع هنا:** السطر 248.

- **مثال:** $this->actingAs($staff)->getJson('/api/staff/orders');

### ->getJson

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تنفّذ طلب GET اختباري وتتوقع JSON.

- **المدخلات — Arguments:** URI وheaders اختيارية.

- **الناتج/الأثر — Return / effect:** TestResponse؛ مش اتصال production عادة.

- **أول موضع هنا:** السطر 228.

### ->assertForbidden

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد status403.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 246.

### ->assertOk

- **جاية منين؟** Laravel test response

- **وظيفتها:** تؤكد إن status هي200؛ الفشل يرمي assertion failure.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نفس TestResponse للـchaining، مش true.

- **أول موضع هنا:** السطر 249.

### Order::create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 207.

### ->patchJson

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تنفذ PATCH اختباري.

- **المدخلات — Arguments:** URI وdata وheaders.

- **الناتج/الأثر — Return / effect:** TestResponse.

- **أول موضع هنا:** السطر 168.

### ->assertUnprocessable

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد status422.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 247.

### ->assertJsonPath

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد قيمة مسار داخل JSON.

- **المدخلات — Arguments:** path وexpected.

- **الناتج/الأثر — Return / effect:** نفس TestResponse أو فشل assertion.

- **أول موضع هنا:** السطر 250.

### $this->assertDatabaseHas

- **جاية منين؟** Laravel testing

- **وظيفتها:** افشل الاختبار لو مفيش row في جدول تطابق القيم المحددة.

- **المدخلات — Arguments:** table name وexpected fields.

- **الناتج/الأثر — Return / effect:** assertion result غير مستخدم؛ test يفشل عند عدم التطابق.

- **أول موضع هنا:** السطر 252.

- **مثال:** $this->assertDatabaseHas('order_status_logs', ['to_status' => 'accepted']);

### ->assertStatus

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد status محددة.

- **المدخلات — Arguments:** expected code.

- **الناتج/الأثر — Return / effect:** TestResponse أو assertion failure.

- **أول موضع هنا:** السطر 90.

### ->assertJsonValidationErrors

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد وجود مفاتيح أخطاء validation.

- **المدخلات — Arguments:** keys.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 108.

### $this->assertSame

- **جاية منين؟** PHPUnit

- **وظيفتها:** تقارن القيمة والنوع بشكل صارم.

- **المدخلات — Arguments:** expected وactual.

- **الناتج/الأثر — Return / effect:** void أو فشل assertion.

- **أول موضع هنا:** السطر 92.

### $order->fresh

- **جاية منين؟** Laravel Eloquent Model

- **وظيفتها:** هات نسخة جديدة من السجل من DB بدل الاعتماد على نسخة قديمة في الذاكرة.

- **المدخلات — Arguments:** relations اختيارية.

- **الناتج/الأثر — Return / effect:** Model جديدة أو null لو السجل اختفى.

- **أول موضع هنا:** السطر 92.

- **مثال:** $order = $order->fresh()->load('items');

### Carbon::setTestNow

- **جاية منين؟** Carbon testing

- **وظيفتها:** تثبت وقت now للتجربة حتى إعادة ضبطه.

- **المدخلات — Arguments:** وقت أو null للإلغاء.

- **الناتج/الأثر — Return / effect:** أثر وقت الاختبار؛ لا تغيّر ساعة نظام التشغيل.

- **أول موضع هنا:** السطر 97.

### ->addMinutes

- **جاية منين؟** Carbon

- **وظيفتها:** تضيف دقائق للتاريخ.

- **المدخلات — Arguments:** count.

- **الناتج/الأثر — Return / effect:** نفس Carbon المعدلة في النوع mutable المعتاد.

- **أول موضع هنا:** السطر 186.

### ->format

- **جاية منين؟** PHP DateTime/Carbon

- **وظيفتها:** تنسّق تاريخًا كنص.

- **المدخلات — Arguments:** format string.

- **الناتج/الأثر — Return / effect:** string؛ توقيت object هو المستخدم.

- **أول موضع هنا:** السطر 186.

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 186.

- **مثال:** now()->addMinutes(20)

### $this->postJson

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تنفّذ POST اختباري.

- **المدخلات — Arguments:** URI وdata وheaders.

- **الناتج/الأثر — Return / effect:** TestResponse.

- **أول موضع هنا:** السطر 190.

### ->assertCreated

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد status201.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 190.

### app->instance

- **جاية منين؟** Laravel Service Container

- **وظيفتها:** سجّل object جاهزة بدل إنشاء implementation الافتراضي؛ مفيد لfake gateway في test.

- **المدخلات — Arguments:** abstract name وobject instance.

- **الناتج/الأثر — Return / effect:** نفس object التي سجلتها؛ الtest لا يستخدم return.

- **أول موضع هنا:** السطر 142.

- **مثال:** $this->app->instance(PaymentGateway::class, $gateway);

### $this->assertDatabaseCount

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تؤكد عدد rows في جدول بيئة الاختبار.

- **المدخلات — Arguments:** table وcount.

- **الناتج/الأثر — Return / effect:** void أو assertion failure.

- **أول موضع هنا:** السطر 148.

### ->assertJsonCount

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد عدد عناصر جزء JSON.

- **المدخلات — Arguments:** count وpath اختيارية.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 215.

### ->assertNotFound

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد status404.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 219.

### $created->json

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تفك/تقرأ JSON من الاستجابة الاختبارية الموجودة.

- **المدخلات — Arguments:** key path اختيارية.

- **الناتج/الأثر — Return / effect:** القيمة المفكوكة أو الجزء المطلوب؛ لا ترسل response جديدة.

- **أول موضع هنا:** السطر 191.

### $this->assertGreaterThanOrEqual

- **جاية منين؟** PHPUnit

- **وظيفتها:** تؤكد أن actual لا تقل عن expected.

- **المدخلات — Arguments:** expected وactual.

- **الناتج/الأثر — Return / effect:** void أو فشل assertion.

- **أول موضع هنا:** السطر 192.

### strlen

- **جاية منين؟** PHP built-in string function

- **وظيفتها:** ترجع طول النص بالبايت Bytes، مش عدد الحروف المرئية دائمًا. العربي UTF-8 قد يحتل أكثر من byte للحرف؛ لعد الحروف Unicode غالبًا نحتاج mb_strlen مع encoding مناسبة.

- **المدخلات — Arguments:** string: النص.

- **الناتج/الأثر — Return / effect:** int عدد البايتات؛ النص الفاضي طوله0. لا تحذف النص ولا تعيد تشكيله.

- **أول موضع هنا:** السطر 192.

### $created->assertJsonPath

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد قيمة مسار داخل JSON.

- **المدخلات — Arguments:** path وexpected.

- **الناتج/الأثر — Return / effect:** نفس TestResponse أو فشل assertion.

- **أول موضع هنا:** السطر 193.

### ->assertJsonMissingPath

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد غياب path من JSON.

- **المدخلات — Arguments:** path.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 199.

### $order->items

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** بنود الطلب المحفوظة باسم وسعر وقت الشراء.

- **المدخلات — Arguments:** order_items.order_id.

- **الناتج/الأثر — Return / effect:** HasMany؛ items() تبني query وitems property تجيب collection.

- **أول موضع هنا:** السطر 212.

- **تكملة التعريف:** [app/Models/Order.php](../../app/Models/Order.php.md)، عند السطر 86.

### ->postJson

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تنفّذ POST اختباري.

- **المدخلات — Arguments:** URI وdata وheaders.

- **الناتج/الأثر — Return / effect:** TestResponse.

- **أول موضع هنا:** السطر 219.

### ->putJson

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تنفذ PUT اختباري.

- **المدخلات — Arguments:** URI وdata وheaders.

- **الناتج/الأثر — Return / effect:** TestResponse.

- **أول موضع هنا:** السطر 248.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace Tests\Feature;

use App\Contracts\PaymentGateway;
use App\Events\OrderPlaced;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `Tests\Feature`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Contracts\PaymentGateway` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Events\OrderPlaced` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Events\OrderStatusUpdated` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\MenuCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class OrderOperationsTest extends TestCase
```

**السطر 9:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Carbon\Carbon` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Database\Seeders\MenuCatalogSeeder` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** use / استيراد الاسم `Illuminate\Foundation\Testing\RefreshDatabase` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** use / استيراد الاسم `Illuminate\Support\Facades\Event` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 14:** use / استيراد الاسم `Tests\TestCase` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 16:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

### السطور 17–24

```php
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MenuCatalogSeeder::class);
        Event::fake([OrderPlaced::class, OrderStatusUpdated::class]);
```

**السطر 17:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 18:** use / استيراد الاسم `RefreshDatabase` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 20:** Function / تعريف دالة `setUp`؛ تعريفها مش تشغيلها. جهّز Laravel من الأب ثم seed catalogue وامنع بث events الحقيقي بالfake. مدخلاتها: دورة PHPUnit قبل كل test. ناتجها: void.

**السطر 21:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `parent::setUp(...)`: جهّز Laravel من الأب ثم seed catalogue وامنع بث events الحقيقي بالfake. مدخلاتها: دورة PHPUnit قبل كل test. العائد/الأثر: void.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->seed(...)`: تشغل seeders على اتصال البيئة الحالية. مدخلاتها: seeder class(es). العائد/الأثر: الأثر إنشاء بيانات؛ متجربهاش على production للتعلم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Event::fake(...)`: تستبدل إطلاق الأحداث الحقيقي بمسجل للاختبار. مدخلاتها: events اختيارية. العائد/الأثر: EventFake؛ مش اختبار WebSocket حقيقي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```php
    }

    public function test_staff_routes_require_authentication_and_role(): void
    {
        $this->getJson('/api/staff/orders')->assertUnauthorized();

        $customer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($customer)->getJson('/api/staff/orders')->assertForbidden();
```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** Function / تعريف دالة `test_staff_routes_require_authentication_and_role`؛ تعريفها مش تشغيلها. اثبت 401 للضيف و403 للعميل و200 لموظف بفرع. مدخلاتها: users factory. ناتجها: void assertions.

**السطر 28:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertUnauthorized(...)`: تؤكد status401. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو assertion failure.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'customer'])` الأول وخزّن النتيجة في `$customer`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertForbidden(...)`: تؤكد status403. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```php

        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $this->actingAs($staff)->getJson('/api/staff/orders')->assertOk();
    }

    public function test_staff_status_transition_is_validated_and_logged(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
```

**السطر 34:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'staff', 'branch_id' => 1])` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** Function / تعريف دالة `test_staff_status_transition_is_validated_and_logged`؛ تعريفها مش تشغيلها. new=>ready مرفوض وnew=>accepted مقبول ومحفوظ في log. مدخلاتها: order وstaff تجريبيان. ناتجها: void assertions.

**السطر 39:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 40:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'staff', 'branch_id' => 1])` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 41–48

```php
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);

        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", ['status' => 'ready'])
            ->assertUnprocessable();

```

**السطر 41:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 42:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `1, 'order_type' => 'delivery', 'total_price' => 100`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 43:** PHP array entry: المفتاح `status` مرتبط بالقيمة `Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->patchJson(...)`: تنفذ PATCH اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertUnprocessable(...)`: تؤكد status422. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 49–56

```php
        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", ['status' => 'accepted'])
            ->assertOk()->assertJsonPath('order.status', 'accepted');

        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id, 'user_id' => $staff->id,
            'from_status' => 'new', 'to_status' => 'accepted',
        ]);
    }
```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->patchJson(...)`: تنفذ PATCH اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.؛ `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertDatabaseHas(...)`: افشل الاختبار لو مفيش row في جدول تطابق القيم المحددة. مدخلاتها: table name وexpected fields. العائد/الأثر: assertion result غير مستخدم؛ test يفشل عند عدم التطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$order->id, 'user_id' => $staff->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 54:** PHP array entry: المفتاح `from_status` مرتبط بالقيمة `'new', 'to_status' => 'accepted'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–64

```php

    public function test_accept_and_start_preparing_writes_both_honest_status_logs(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);
```

**السطر 58:** Function / تعريف دالة `test_accept_and_start_preparing_writes_both_honest_status_logs`؛ تعريفها مش تشغيلها. الاختصار new=>preparing يكتب خطوتين accepted ثم preparing. مدخلاتها: PATCH status/expected_status. ناتجها: void assertions.

**السطر 59:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 60:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'staff', 'branch_id' => 1])` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 61:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 62:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `1, 'order_type' => 'delivery', 'total_price' => 100`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 63:** PHP array entry: المفتاح `status` مرتبط بالقيمة `Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 64:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```php

        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", [
            'status' => 'preparing',
            'expected_status' => 'new',
        ])->assertOk()->assertJsonPath('order.status', 'preparing');

        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id, 'from_status' => 'new', 'to_status' => 'accepted',
```

**السطر 66:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->patchJson(...)`: تنفذ PATCH اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 67:** PHP array entry: المفتاح `status` مرتبط بالقيمة `'preparing'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 68:** PHP array entry: المفتاح `expected_status` مرتبط بالقيمة `'new'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 69:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.؛ `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 71:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertDatabaseHas(...)`: افشل الاختبار لو مفيش row في جدول تطابق القيم المحددة. مدخلاتها: table name وexpected fields. العائد/الأثر: assertion result غير مستخدم؛ test يفشل عند عدم التطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 72:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$order->id, 'from_status' => 'new', 'to_status' => 'accepted'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 73–80

```php
        ]);
        $this->assertDatabaseHas('order_status_logs', [
            'order_id' => $order->id, 'from_status' => 'accepted', 'to_status' => 'preparing',
        ]);
    }

    public function test_stale_staff_update_returns_a_friendly_conflict(): void
    {
```

**السطر 73:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 74:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertDatabaseHas(...)`: افشل الاختبار لو مفيش row في جدول تطابق القيم المحددة. مدخلاتها: table name وexpected fields. العائد/الأثر: assertion result غير مستخدم؛ test يفشل عند عدم التطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 75:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$order->id, 'from_status' => 'accepted', 'to_status' => 'preparing'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 76:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 79:** Function / تعريف دالة `test_stale_staff_update_returns_a_friendly_conflict`؛ تعريفها مش تشغيلها. لو expected_status قديمة يرجع409 ولا يرجع الطلب لحالة قديمة. مدخلاتها: order preparing وrequest تتوقع new. ناتجها: void assertions.

**السطر 80:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 81–88

```php
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_PREPARING, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);

        $this->actingAs($staff)->patchJson("/api/staff/orders/{$order->id}/status", [
            'status' => 'accepted',
```

**السطر 81:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'staff', 'branch_id' => 1])` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 82:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 83:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `1, 'order_type' => 'delivery', 'total_price' => 100`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 84:** PHP array entry: المفتاح `status` مرتبط بالقيمة `Order::STATUS_PREPARING, 'payment_method' => 'cash', 'payment_status' => 'unpaid'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 87:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->patchJson(...)`: تنفذ PATCH اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 88:** PHP array entry: المفتاح `status` مرتبط بالقيمة `'accepted'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 89–96

```php
            'expected_status' => 'new',
        ])->assertStatus(409)->assertJsonValidationErrors('expected_status');

        $this->assertSame(Order::STATUS_PREPARING, $order->fresh()->status);
    }

    public function test_pickup_time_and_item_notes_are_validated_and_saved(): void
    {
```

**السطر 89:** PHP array entry: المفتاح `expected_status` مرتبط بالقيمة `'new'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 90:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertStatus(...)`: تؤكد status محددة. مدخلاتها: expected code. العائد/الأثر: TestResponse أو assertion failure.؛ `->assertJsonValidationErrors(...)`: تؤكد وجود مفاتيح أخطاء validation. مدخلاتها: keys. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 92:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertSame(...)`: تقارن القيمة والنوع بشكل صارم. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.؛ `$order->fresh(...)`: هات نسخة جديدة من السجل من DB بدل الاعتماد على نسخة قديمة في الذاكرة. مدخلاتها: relations اختيارية. العائد/الأثر: Model جديدة أو null لو السجل اختفى.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 93:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 95:** Function / تعريف دالة `test_pickup_time_and_item_notes_are_validated_and_saved`؛ تعريفها مش تشغيلها. ثبت وقت الاختبار وجرّب pickup بعد10دقائق مرفوض وبعد30 مقبول مع notes محفوظة. مدخلاتها: Carbon test clock وpayload. ناتجها: void assertions.

**السطر 96:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 97–104

```php
        Carbon::setTestNow('2026-09-28 12:00:00');
        $payload = [
            'branch_id' => 1,
            'order_type' => 'pickup',
            'customer_name' => 'Test Customer',
            'customer_phone' => '01000000000',
            'payment_method' => 'cash',
            'pickup_time' => now()->addMinutes(10)->format('Y-m-d\TH:i'),
```

**السطر 97:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Carbon::setTestNow(...)`: تثبت وقت now للتجربة حتى إعادة ضبطه. مدخلاتها: وقت أو null للإلغاء. العائد/الأثر: أثر وقت الاختبار؛ لا تغيّر ساعة نظام التشغيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 98:** Assignment / إسناد: احسب `[` الأول وخزّن النتيجة في `$payload`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 99:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `1`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 100:** PHP array entry: المفتاح `order_type` مرتبط بالقيمة `'pickup'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 101:** PHP array entry: المفتاح `customer_name` مرتبط بالقيمة `'Test Customer'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 102:** PHP array entry: المفتاح `customer_phone` مرتبط بالقيمة `'01000000000'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 103:** PHP array entry: المفتاح `payment_method` مرتبط بالقيمة `'cash'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 104:** PHP array entry: المفتاح `pickup_time` مرتبط بالقيمة `now()->addMinutes(10)->format('Y-m-d\TH:i')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 105–112

```php
            'items' => [['menu_item_id' => 1, 'quantity' => 1, 'notes' => 'No onions']],
        ];

        $this->postJson('/api/orders', $payload)->assertUnprocessable()->assertJsonValidationErrors('pickup_time');

        $payload['pickup_time'] = now()->addMinutes(30)->format('Y-m-d\TH:i');
        $this->postJson('/api/orders', $payload)->assertCreated()->assertJsonPath('order.items.0.notes', 'No onions');
        $this->assertDatabaseHas('order_items', ['notes' => 'No onions']);
```

**السطر 105:** PHP array entry: المفتاح `items` مرتبط بالقيمة `[['menu_item_id' => 1, 'quantity' => 1, 'notes' => 'No onions']]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 106:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 108:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->postJson(...)`: تنفّذ POST اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertUnprocessable(...)`: تؤكد status422. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.؛ `->assertJsonValidationErrors(...)`: تؤكد وجود مفاتيح أخطاء validation. مدخلاتها: keys. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 110:** Assignment / إسناد: احسب القيمة على يمين = وخزّنها في المتغير أو خاصية الـobject على الشمال. -> وصول لخاصية/دالة object، و:: وصول static/facade حسب التعريف. الدوال الموجودة في السطر: `->addMinutes(...)`: تضيف دقائق للتاريخ. مدخلاتها: count. العائد/الأثر: نفس Carbon المعدلة في النوع mutable المعتاد.؛ `->format(...)`: تنسّق تاريخًا كنص. مدخلاتها: format string. العائد/الأثر: string؛ توقيت object هو المستخدم.؛ `now(...)`: أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds. مدخلاتها: timezone اختيارية؛ المشروع غالبًا بدون arguments. العائد/الأثر: Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 111:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->postJson(...)`: تنفّذ POST اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertCreated(...)`: تؤكد status201. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.؛ `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 112:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertDatabaseHas(...)`: افشل الاختبار لو مفيش row في جدول تطابق القيم المحددة. مدخلاتها: table name وexpected fields. العائد/الأثر: assertion result غير مستخدم؛ test يفشل عند عدم التطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 113–120

```php
    }

    public function test_verified_payment_webhook_marks_order_paid_once(): void
    {
        $order = Order::create([
            'branch_id' => 1, 'order_type' => 'pickup', 'total_price' => 100,
            'status' => Order::STATUS_PAYMENT_PENDING, 'payment_method' => 'card',
            'payment_status' => 'pending', 'payment_gateway' => 'stripe', 'gateway_reference' => 'pi_test',
```

**السطر 113:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 115:** Function / تعريف دالة `test_verified_payment_webhook_marks_order_paid_once`؛ تعريفها مش تشغيلها. بدّل PaymentGateway بfake event وابعت webhook مرتين؛ تأكد paid/new وlog واحدة في السيناريو المتتابع. مدخلاتها: fake gateway وOrder payment_pending. ناتجها: void assertions؛ لا يختبر concurrency أو Stripe الحقيقي.

**السطر 116:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 117:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 118:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `1, 'order_type' => 'pickup', 'total_price' => 100`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 119:** PHP array entry: المفتاح `status` مرتبط بالقيمة `Order::STATUS_PAYMENT_PENDING, 'payment_method' => 'card'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 120:** PHP array entry: المفتاح `payment_status` مرتبط بالقيمة `'pending', 'payment_gateway' => 'stripe', 'gateway_reference' => 'pi_test'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 121–128

```php
        ]);

        $event = (object) [
            'type' => 'payment_intent.succeeded',
            'data' => (object) ['object' => (object) ['id' => 'pi_test']],
        ];

        $gateway = new class($event) implements PaymentGateway
```

**السطر 121:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 123:** Assignment / إسناد: احسب `(object) [` الأول وخزّن النتيجة في `$event`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 124:** PHP array entry: المفتاح `type` مرتبط بالقيمة `'payment_intent.succeeded'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 125:** PHP array entry: المفتاح `data` مرتبط بالقيمة `(object) ['object' => (object) ['id' => 'pi_test']]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 126:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 128:** Assignment / إسناد: احسب `new class($event) implements PaymentGateway` الأول وخزّن النتيجة في `$gateway`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 129–136

```php
        {
            public function __construct(private object $event) {}

            public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array
            {
                return [];
            }

```

**السطر 129:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 130:** Function / تعريف دالة `__construct`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 132:** Function / تعريف دالة `createIntent`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 133:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 134:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 135:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 137–144

```php
            public function parseWebhook(string $payload, string $signature): object
            {
                return $this->event;
            }
        };
        $this->app->instance(PaymentGateway::class, $gateway);

        $this->postJson('/api/payments/webhook', [], ['Stripe-Signature' => 'valid'])->assertOk();
```

**السطر 137:** Function / تعريف دالة `parseWebhook`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 138:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 139:** return تعيد التعبير `$this->event` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 140:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 141:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 142:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `app->instance(...)`: سجّل object جاهزة بدل إنشاء implementation الافتراضي؛ مفيد لfake gateway في test. مدخلاتها: abstract name وobject instance. العائد/الأثر: نفس object التي سجلتها؛ الtest لا يستخدم return.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 144:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->postJson(...)`: تنفّذ POST اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 145–152

```php
        $this->postJson('/api/payments/webhook', [], ['Stripe-Signature' => 'valid'])->assertOk();

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid', 'status' => 'new']);
        $this->assertDatabaseCount('order_status_logs', 1);
    }

    public function test_branch_staff_only_see_and_update_their_own_branch_orders(): void
    {
```

**السطر 145:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->postJson(...)`: تنفّذ POST اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 147:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertDatabaseHas(...)`: افشل الاختبار لو مفيش row في جدول تطابق القيم المحددة. مدخلاتها: table name وexpected fields. العائد/الأثر: assertion result غير مستخدم؛ test يفشل عند عدم التطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 148:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertDatabaseCount(...)`: تؤكد عدد rows في جدول بيئة الاختبار. مدخلاتها: table وcount. العائد/الأثر: void أو assertion failure.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 149:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 151:** Function / تعريف دالة `test_branch_staff_only_see_and_update_their_own_branch_orders`؛ تعريفها مش تشغيلها. الموظف يشوف طلب فرعه فقط و404 عند show/update لفرع آخر. مدخلاتها: طلبان بفرعين مختلفين. ناتجها: void assertions.

**السطر 152:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 153–160

```php
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $own = Order::create([
            'branch_id' => 1, 'order_type' => 'delivery', 'total_price' => 100,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
        ]);
        $other = Order::create([
            'branch_id' => 2, 'order_type' => 'delivery', 'total_price' => 120,
            'status' => Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid',
```

**السطر 153:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'staff', 'branch_id' => 1])` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 154:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$own`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 155:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `1, 'order_type' => 'delivery', 'total_price' => 100`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 156:** PHP array entry: المفتاح `status` مرتبط بالقيمة `Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 157:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 158:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$other`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 159:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `2, 'order_type' => 'delivery', 'total_price' => 120`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 160:** PHP array entry: المفتاح `status` مرتبط بالقيمة `Order::STATUS_NEW, 'payment_method' => 'cash', 'payment_status' => 'unpaid'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 161–168

```php
        ]);

        $this->actingAs($staff)->getJson('/api/staff/orders')
            ->assertOk()
            ->assertJsonCount(1, 'orders')
            ->assertJsonPath('orders.0.id', $own->id);
        $this->actingAs($staff)->getJson("/api/staff/orders/{$other->id}")->assertNotFound();
        $this->actingAs($staff)->patchJson("/api/staff/orders/{$other->id}/status", ['status' => 'accepted'])->assertNotFound();
```

**السطر 161:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 163:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 164:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 165:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonCount(...)`: تؤكد عدد عناصر جزء JSON. مدخلاتها: count وpath اختيارية. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 166:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 167:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertNotFound(...)`: تؤكد status404. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 168:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->patchJson(...)`: تنفذ PATCH اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertNotFound(...)`: تؤكد status404. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 169–176

```php
    }

    public function test_admin_can_see_all_branches_and_filter_them(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'branch_id' => null]);
        Order::create(['branch_id' => 1, 'order_type' => 'pickup', 'total_price' => 90, 'status' => 'new', 'payment_method' => 'cash', 'payment_status' => 'unpaid']);
        Order::create(['branch_id' => 2, 'order_type' => 'pickup', 'total_price' => 95, 'status' => 'new', 'payment_method' => 'cash', 'payment_status' => 'unpaid']);

```

**السطر 169:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 171:** Function / تعريف دالة `test_admin_can_see_all_branches_and_filter_them`؛ تعريفها مش تشغيلها. الإدمن يشوف الفرعين ويقدر يفلتر branch_id. مدخلاتها: admin وطلبان. ناتجها: void assertions.

**السطر 172:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 173:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'admin', 'branch_id' => null])` الأول وخزّن النتيجة في `$admin`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 174:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Order::create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 175:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Order::create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 177–184

```php
        $this->actingAs($admin)->getJson('/api/staff/orders')->assertOk()->assertJsonCount(2, 'orders');
        $this->actingAs($admin)->getJson('/api/staff/orders?branch_id=2')->assertOk()->assertJsonCount(1, 'orders')->assertJsonPath('orders.0.branch_id', 2);
    }

    public function test_guest_tracking_uses_a_random_token_and_returns_safe_fields(): void
    {
        $payload = [
            'branch_id' => 1, 'order_type' => 'pickup', 'customer_name' => 'Guest Customer',
```

**السطر 177:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.؛ `->assertJsonCount(...)`: تؤكد عدد عناصر جزء JSON. مدخلاتها: count وpath اختيارية. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 178:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.؛ `->assertJsonCount(...)`: تؤكد عدد عناصر جزء JSON. مدخلاتها: count وpath اختيارية. العائد/الأثر: TestResponse أو فشل.؛ `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 179:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 181:** Function / تعريف دالة `test_guest_tracking_uses_a_random_token_and_returns_safe_fields`؛ تعريفها مش تشغيلها. اطلب كضيف ثم تتبع بالtoken؛ افحص طوله وعدم وجود user_id/gateway_reference في الرد. مدخلاتها: cash pickup payload. ناتجها: void assertions.

**السطر 182:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 183:** Assignment / إسناد: احسب `[` الأول وخزّن النتيجة في `$payload`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 184:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `1, 'order_type' => 'pickup', 'customer_name' => 'Guest Customer'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 185–192

```php
            'customer_phone' => '01000000000', 'payment_method' => 'cash',
            'pickup_time' => now()->addMinutes(30)->format('Y-m-d\TH:i'),
            'items' => [['menu_item_id' => 1, 'quantity' => 1]],
        ];

        $created = $this->postJson('/api/orders', $payload)->assertCreated();
        $token = $created->json('tracking_token');
        $this->assertGreaterThanOrEqual(40, strlen($token));
```

**السطر 185:** PHP array entry: المفتاح `customer_phone` مرتبط بالقيمة `'01000000000', 'payment_method' => 'cash'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 186:** PHP array entry: المفتاح `pickup_time` مرتبط بالقيمة `now()->addMinutes(30)->format('Y-m-d\TH:i')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 187:** PHP array entry: المفتاح `items` مرتبط بالقيمة `[['menu_item_id' => 1, 'quantity' => 1]]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 188:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 190:** Assignment / إسناد: احسب `$this->postJson('/api/orders', $payload)->assertCreated()` الأول وخزّن النتيجة في `$created`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 191:** Assignment / إسناد: احسب `$created->json('tracking_token')` الأول وخزّن النتيجة في `$token`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 192:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertGreaterThanOrEqual(...)`: تؤكد أن actual لا تقل عن expected. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.؛ `strlen(...)`: ترجع طول النص بالبايت Bytes، مش عدد الحروف المرئية دائمًا. العربي UTF-8 قد يحتل أكثر من byte للحرف؛ لعد الحروف Unicode غالبًا نحتاج mb_strlen مع encoding مناسبة. مدخلاتها: string: النص. العائد/الأثر: int عدد البايتات؛ النص الفاضي طوله0. لا تحذف النص ولا تعيد تشكيله.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 193–200

```php
        $created->assertJsonPath('tracking_url', "/orders/{$token}");

        $this->getJson("/api/orders/track/{$token}")
            ->assertOk()
            ->assertJsonPath('order.customer_name', 'Guest Customer')
            ->assertJsonMissingPath('order.user_id')
            ->assertJsonMissingPath('order.gateway_reference');
        $this->getJson('/api/orders/track/not-a-real-token')->assertNotFound();
```

**السطر 193:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$created->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 195:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 196:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 197:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 198:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonMissingPath(...)`: تؤكد غياب path من JSON. مدخلاتها: path. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 199:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonMissingPath(...)`: تؤكد غياب path من JSON. مدخلاتها: path. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 200:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertNotFound(...)`: تؤكد status404. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 201–208

```php
    }

    public function test_customer_history_and_reorder_are_owner_only(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $otherCustomer = User::factory()->create(['role' => 'customer']);
        $order = Order::create([
            'user_id' => $customer->id, 'branch_id' => 1, 'order_type' => 'pickup',
```

**السطر 201:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 203:** Function / تعريف دالة `test_customer_history_and_reorder_are_owner_only`؛ تعريفها مش تشغيلها. صاحب الطلب يشوفه ويعيد للسلة وغير المالك404. مدخلاتها: customer وotherCustomer وorder بitem. ناتجها: void assertions.

**السطر 204:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 205:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'customer'])` الأول وخزّن النتيجة في `$customer`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 206:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'customer'])` الأول وخزّن النتيجة في `$otherCustomer`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 207:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 208:** PHP array entry: المفتاح `user_id` مرتبط بالقيمة `$customer->id, 'branch_id' => 1, 'order_type' => 'pickup'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 209–216

```php
            'total_price' => 90, 'status' => 'completed', 'payment_method' => 'cash',
            'payment_status' => 'unpaid', 'tracking_token' => 'customer-history-token',
        ]);
        $order->items()->create(['menu_item_id' => 1, 'item_name' => 'Margherita Verace', 'quantity' => 1, 'price' => 190]);

        $this->actingAs($customer)->getJson('/api/orders/history')
            ->assertOk()->assertJsonCount(1, 'orders')
            ->assertJsonPath('orders.0.tracking_token', 'customer-history-token');
```

**السطر 209:** PHP array entry: المفتاح `total_price` مرتبط بالقيمة `90, 'status' => 'completed', 'payment_method' => 'cash'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 210:** PHP array entry: المفتاح `payment_status` مرتبط بالقيمة `'unpaid', 'tracking_token' => 'customer-history-token'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 211:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 212:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->items(...)`: بنود الطلب المحفوظة باسم وسعر وقت الشراء. مدخلاتها: order_items.order_id. العائد/الأثر: HasMany؛ items() تبني query وitems property تجيب collection.؛ `->create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 214:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 215:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.؛ `->assertJsonCount(...)`: تؤكد عدد عناصر جزء JSON. مدخلاتها: count وpath اختيارية. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 216:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 217–224

```php
        $this->actingAs($customer)->postJson("/api/orders/{$order->id}/reorder")
            ->assertOk()->assertJsonPath('cart_items.0.name', 'Margherita Verace');
        $this->actingAs($otherCustomer)->postJson("/api/orders/{$order->id}/reorder")->assertNotFound();
    }

    public function test_only_admin_can_open_admin_api(): void
    {
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
```

**السطر 217:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->postJson(...)`: تنفّذ POST اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 218:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.؛ `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 219:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->postJson(...)`: تنفّذ POST اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertNotFound(...)`: تؤكد status404. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 220:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 222:** Function / تعريف دالة `test_only_admin_can_open_admin_api`؛ تعريفها مش تشغيلها. dashboard403 للموظف و200 للإدمن. مدخلاتها: factory staff/admin. ناتجها: void assertions.

**السطر 223:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 224:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'staff', 'branch_id' => 1])` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 225–232

```php
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($staff)->getJson('/api/admin/dashboard')->assertForbidden();
        $this->actingAs($admin)->getJson('/api/admin/dashboard')->assertOk();
    }

    public function test_admin_mutations_are_role_protected_validated_and_audited(): void
    {
```

**السطر 225:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'admin'])` الأول وخزّن النتيجة في `$admin`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 227:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertForbidden(...)`: تؤكد status403. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 228:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->getJson(...)`: تنفّذ طلب GET اختباري وتتوقع JSON. مدخلاتها: URI وheaders اختيارية. العائد/الأثر: TestResponse؛ مش اتصال production عادة.؛ `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 229:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 231:** Function / تعريف دالة `test_admin_mutations_are_role_protected_validated_and_audited`؛ تعريفها مش تشغيلها. تعديل فرع403 لstaff و422 للبيانات الفاضية و200 للصحيح مع audit row. مدخلاتها: branch payload وadmin. ناتجها: void assertions.

**السطر 232:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 233–240

```php
        $staff = User::factory()->create(['role' => 'staff', 'branch_id' => 1]);
        $admin = User::factory()->create(['role' => 'admin']);
        $payload = [
            'name' => 'The Drive',
            'location' => 'Updated New Cairo address',
            'phone' => '01000000000',
            'opening_hours' => '4 PM - 2 AM',
            'delivery_fee' => 35,
```

**السطر 233:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'staff', 'branch_id' => 1])` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 234:** Assignment / إسناد: احسب `User::factory()->create(['role' => 'admin'])` الأول وخزّن النتيجة في `$admin`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 235:** Assignment / إسناد: احسب `[` الأول وخزّن النتيجة في `$payload`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 236:** PHP array entry: المفتاح `name` مرتبط بالقيمة `'The Drive'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 237:** PHP array entry: المفتاح `location` مرتبط بالقيمة `'Updated New Cairo address'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 238:** PHP array entry: المفتاح `phone` مرتبط بالقيمة `'01000000000'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 239:** PHP array entry: المفتاح `opening_hours` مرتبط بالقيمة `'4 PM - 2 AM'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 240:** PHP array entry: المفتاح `delivery_fee` مرتبط بالقيمة `35`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 241–248

```php
            'delivery_enabled' => true,
            'is_active' => true,
            'display_order' => 1,
        ];

        $this->actingAs($staff)->putJson('/api/admin/branches/1', $payload)->assertForbidden();
        $this->actingAs($admin)->putJson('/api/admin/branches/1', [])->assertUnprocessable();
        $this->actingAs($admin)->putJson('/api/admin/branches/1', $payload)
```

**السطر 241:** PHP array entry: المفتاح `delivery_enabled` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 242:** PHP array entry: المفتاح `is_active` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 243:** PHP array entry: المفتاح `display_order` مرتبط بالقيمة `1`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 244:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 246:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->putJson(...)`: تنفذ PUT اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertForbidden(...)`: تؤكد status403. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 247:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->putJson(...)`: تنفذ PUT اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.؛ `->assertUnprocessable(...)`: تؤكد status422. مدخلاتها: بدون arguments. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 248:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->actingAs(...)`: خلّي طلبات الاختبار التالية تتصرف كمستخدم معين من غير login form حقيقي. مدخلاتها: User وguard اختياري. العائد/الأثر: test instance قابلة للchain.؛ `->putJson(...)`: تنفذ PUT اختباري. مدخلاتها: URI وdata وheaders. العائد/الأثر: TestResponse.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 249–256

```php
            ->assertOk()
            ->assertJsonPath('branch.delivery_fee', '35.00');

        $this->assertDatabaseHas('admin_audit_logs', [
            'user_id' => $admin->id,
            'action' => 'branch.updated',
            'subject_id' => 1,
        ]);
```

**السطر 249:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertOk(...)`: تؤكد إن status هي200؛ الفشل يرمي assertion failure. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس TestResponse للـchaining، مش true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 250:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 252:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertDatabaseHas(...)`: افشل الاختبار لو مفيش row في جدول تطابق القيم المحددة. مدخلاتها: table name وexpected fields. العائد/الأثر: assertion result غير مستخدم؛ test يفشل عند عدم التطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 253:** PHP array entry: المفتاح `user_id` مرتبط بالقيمة `$admin->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 254:** PHP array entry: المفتاح `action` مرتبط بالقيمة `'branch.updated'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 255:** PHP array entry: المفتاح `subject_id` مرتبط بالقيمة `1`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 256:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 257–259

```php
    }
}

```

**السطر 257:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 258:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
