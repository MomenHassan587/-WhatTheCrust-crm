# عمليات الإدارة من الإحصاءات لرفع المنتجات والتدقيق

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Controllers/Api/AdminController.php` · 169 سطر.

**وظيفة الملف:** كلاس يجمع endpoints الإدارة. role middleware وFormRequests يحموا التعديلات، وAdminAudit يسجلها. مهم نفرّق إنه كود شغال لكنه كبير، وممكن في refactor يتقسم لcontrollers أصغر من غير ما نغيّر API.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../app/Http/Controllers/Api/AdminController.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Controller.php](../Controller.php.md)

- [pizza-crm/app/Http/Requests/AdminBranchRequest.php](../../Requests/AdminBranchRequest.php.md)

- [pizza-crm/app/Http/Requests/AdminCategoryRequest.php](../../Requests/AdminCategoryRequest.php.md)

- [pizza-crm/app/Http/Requests/AdminProductRequest.php](../../Requests/AdminProductRequest.php.md)

- [pizza-crm/app/Http/Requests/AdminPasswordRequest.php](../../Requests/AdminPasswordRequest.php.md)

- [pizza-crm/app/Http/Requests/AdminOrderFilterRequest.php](../../Requests/AdminOrderFilterRequest.php.md)

- [pizza-crm/app/Http/Requests/AdminSettingsRequest.php](../../Requests/AdminSettingsRequest.php.md)

- [pizza-crm/app/Http/Requests/AdminStaffRequest.php](../../Requests/AdminStaffRequest.php.md)

- [pizza-crm/app/Models/AdminAuditLog.php](../../../Models/AdminAuditLog.php.md)

- [pizza-crm/app/Models/AppSetting.php](../../../Models/AppSetting.php.md)

- [pizza-crm/app/Models/Branch.php](../../../Models/Branch.php.md)

- [pizza-crm/app/Models/Category.php](../../../Models/Category.php.md)

- [pizza-crm/app/Models/MenuItem.php](../../../Models/MenuItem.php.md)

- [pizza-crm/app/Models/Order.php](../../../Models/Order.php.md)

- [pizza-crm/app/Models/OrderItem.php](../../../Models/OrderItem.php.md)

- [pizza-crm/app/Models/User.php](../../../Models/User.php.md)

- [pizza-crm/app/Services/AdminAudit.php](../../../Services/AdminAudit.php.md)

- [pizza-crm/app/Services/ProductImageService.php](../../../Services/ProductImageService.php.md)

- [pizza-crm/resources/js/Pages/Admin/AdminDashboard.jsx](../../../../resources/js/Pages/Admin/AdminDashboard.jsx.md)

- [pizza-crm/resources/js/Pages/Admin/AdminPanel.jsx](../../../../resources/js/Pages/Admin/AdminPanel.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminBranchRequest;
use App\Http\Requests\AdminCategoryRequest;
use App\Http\Requests\AdminProductRequest;
use App\Http\Requests\AdminPasswordRequest;
use App\Http\Requests\AdminOrderFilterRequest;
use App\Http\Requests\AdminSettingsRequest;
use App\Http\Requests\AdminStaffRequest;
use App\Models\AdminAuditLog;
use App\Models\AppSetting;
use App\Models\Branch;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Services\AdminAudit;
use App\Services\ProductImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $orders = Order::query()->whereDate('created_at', today())->whereNotIn('status', ['payment_pending', 'cancelled', 'rejected']);
        $sales = (clone $orders)->sum('total_price');
        $count = (clone $orders)->count();
        return response()->json([
            'summary' => ['sales' => $sales, 'orders' => $count, 'average' => $count ? round($sales / $count, 2) : 0],
            'by_status' => Order::whereDate('created_at', today())->select('status', DB::raw('count(*) total'))->groupBy('status')->pluck('total', 'status'),
            'by_branch' => Order::query()->join('branches', 'branches.id', '=', 'orders.branch_id')->whereDate('orders.created_at', today())->whereNotIn('orders.status', ['payment_pending', 'cancelled', 'rejected'])->groupBy('branches.id', 'branches.name')->select('branches.name', DB::raw('sum(orders.total_price) sales'))->get(),
            'best_items' => OrderItem::query()->join('orders', 'orders.id', '=', 'order_items.order_id')->whereDate('orders.created_at', today())->whereNotIn('orders.status', ['payment_pending', 'cancelled', 'rejected'])->groupBy('order_items.item_name')->select('order_items.item_name', DB::raw('sum(order_items.quantity) quantity'))->orderByDesc('quantity')->limit(8)->get(),
        ]);
    }

    public function catalog(): JsonResponse
    {
        return response()->json([
            'categories' => Category::orderBy('display_order')->get(),
            'branches' => Branch::orderBy('display_order')->get(),
            'items' => MenuItem::with(['category', 'branches'])->orderBy('category_id')->orderBy('display_order')->get(),
        ]);
    }

    public function storeProduct(AdminProductRequest $request, ProductImageService $images, AdminAudit $audit): JsonResponse
    {
        return $this->saveProduct($request, new MenuItem(), $images, $audit, 201);
    }

    public function updateProduct(AdminProductRequest $request, MenuItem $menuItem, ProductImageService $images, AdminAudit $audit): JsonResponse
    {
        return $this->saveProduct($request, $menuItem, $images, $audit);
    }

    private function saveProduct(AdminProductRequest $request, MenuItem $item, ProductImageService $images, AdminAudit $audit, int $status = 200): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('image')) $data['image_path'] = $images->store($request->file('image'), $data['name']);
        $options = $data['branch_options'];
        unset($data['branch_options'], $data['image']);
        $item->fill($data)->save();
        $item->branches()->sync(collect($options)->mapWithKeys(fn ($option) => [$option['branch_id'] => ['price' => $option['price'], 'is_available' => $option['is_available']]])->all());
        $audit->record($request->user(), $status === 201 ? 'product.created' : 'product.updated', $item, $data);
        return response()->json(['item' => $item->load(['category', 'branches'])], $status);
    }

    public function disableProduct(Request $request, MenuItem $menuItem, AdminAudit $audit): JsonResponse
    {
        $menuItem->update(['is_active' => false]);
        $audit->record($request->user(), 'product.disabled', $menuItem);
        return response()->json(['message' => 'Product disabled.']);
    }

    public function storeCategory(AdminCategoryRequest $request, AdminAudit $audit): JsonResponse
    {
        $category = Category::create($request->validated());
        $audit->record($request->user(), 'category.created', $category, $request->validated());
        return response()->json(['category' => $category], 201);
    }

    public function updateCategory(AdminCategoryRequest $request, Category $category, AdminAudit $audit): JsonResponse
    {
        $category->update($request->validated());
        $audit->record($request->user(), 'category.updated', $category, $request->validated());
        return response()->json(['category' => $category]);
    }

    public function branches(): JsonResponse { return response()->json(['branches' => Branch::orderBy('display_order')->get()]); }
    public function updateBranch(AdminBranchRequest $request, Branch $branch, AdminAudit $audit): JsonResponse
    {
        $branch->update($request->validated());
        $audit->record($request->user(), 'branch.updated', $branch, $request->validated());
        return response()->json(['branch' => $branch]);
    }

    public function staff(): JsonResponse { return response()->json(['users' => User::with('branch')->whereIn('role', ['staff', 'admin'])->orderBy('name')->get()]); }
    public function storeStaff(AdminStaffRequest $request, AdminAudit $audit): JsonResponse
    {
        $data = $request->validated();
        if ($data['role'] === 'admin') $data['branch_id'] = null;
        unset($data['password_confirmation']);
        $user = User::create($data);
        $audit->record($request->user(), 'staff.created', $user, ['email' => $user->email, 'role' => $user->role, 'branch_id' => $user->branch_id]);
        return response()->json(['user' => $user->load('branch')], 201);
    }
    public function updateStaff(AdminStaffRequest $request, User $user, AdminAudit $audit): JsonResponse
    {
        abort_unless(in_array($user->role, ['staff', 'admin'], true), 404);
        $data = $request->validated();
        if ($data['role'] === 'admin') $data['branch_id'] = null;
        if (empty($data['password'])) unset($data['password']);
        unset($data['password_confirmation']);
        $user->update($data);
        $audit->record($request->user(), 'staff.updated', $user, ['email' => $user->email, 'role' => $user->role, 'branch_id' => $user->branch_id, 'is_active' => $user->is_active]);
        return response()->json(['user' => $user->load('branch')]);
    }
    public function resetPassword(AdminPasswordRequest $request, User $user, AdminAudit $audit): JsonResponse
    {
        abort_unless(in_array($user->role, ['staff', 'admin'], true), 404);
        $data = $request->validated();
        $user->update(['password' => $data['password']]);
        $audit->record($request->user(), 'staff.password_reset', $user);
        return response()->json(['message' => 'Password reset.']);
    }

    public function orders(AdminOrderFilterRequest $request): JsonResponse
    {
        $orders = Order::with(['branch', 'items'])->when($request->branch_id, fn ($q, $v) => $q->where('branch_id', $v))->when($request->status, fn ($q, $v) => $q->where('status', $v))->when($request->payment_status, fn ($q, $v) => $q->where('payment_status', $v))->when($request->search, fn ($q, $v) => $q->where(fn ($nested) => $nested->where('id', $v)->orWhere('customer_name', 'like', "%{$v}%")->orWhere('customer_phone', 'like', "%{$v}%")))->latest()->limit(250)->get();
        return response()->json(['orders' => $orders]);
    }

    public function exportOrders(Request $request): StreamedResponse
    {
        $orders = Order::with('branch')->latest()->limit(5000)->get();
        return response()->streamDownload(function () use ($orders): void {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Order', 'Date', 'Branch', 'Customer', 'Phone', 'Status', 'Payment', 'Total']);
            foreach ($orders as $order) fputcsv($out, [$order->id, $order->created_at, $order->branch?->name, $order->customer_name, $order->customer_phone, $order->status, $order->payment_status, $order->total_price]);
            fclose($out);
        }, 'what-the-crust-orders.csv', ['Content-Type' => 'text/csv']);
    }

    public function customers(): JsonResponse
    {
        $customers = User::query()->where('role', 'customer')->withCount('orders')->withSum('orders', 'total_price')->withMax('orders', 'created_at')->orderByDesc('orders_sum_total_price')->get();
        return response()->json(['customers' => $customers]);
    }

    public function settings(): JsonResponse { return response()->json(['settings' => AppSetting::pluck('value', 'key')]); }
    public function updateSettings(AdminSettingsRequest $request, AdminAudit $audit): JsonResponse
    {
        foreach ($request->validated() as $key => $value) AppSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        $audit->record($request->user(), 'settings.updated', AppSetting::class, $request->validated());
        return $this->settings();
    }

    public function audit(): JsonResponse
    {
        return response()->json(['logs' => AdminAuditLog::with('user:id,name,email')->latest('created_at')->limit(100)->get()]);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### dashboard

احسب مبيعات وعدد ومتوسط طلبات اليوم وبحسب الفرع والحالة وأفضل الأصناف مع استبعاد الحالات الملغاة أو payment_pending من المبيعات.

- **بتاخد إيه؟ Inputs:** لا parameters؛ يوم السيرفر من today().

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON summary/by_status/by_branch/best_items.

### catalog

هات كامل كتالوج الإدارة بما فيه المعطّل، مع category وbranch prices.

- **بتاخد إيه؟ Inputs:** لا parameters.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON categories/branches/items.

### storeProduct

ابدأ MenuItem جديد ومرّره لنفس saveProduct مع status 201.

- **بتاخد إيه؟ Inputs:** AdminProductRequest وProductImageService وAdminAudit بحقن Laravel.

- **بترجع/بتغيّر إيه؟ Return / effect:** JsonResponse من saveProduct.

### updateProduct

مرر منتج موجود من route binding إلى saveProduct المشتركة.

- **بتاخد إيه؟ Inputs:** AdminProductRequest وMenuItem موجود وimages/audit services.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON item محدث، افتراضي 200.

### saveProduct

راجع البيانات، حوّل الصورة إن وجدت، احفظ المنتج، حدّث pivot أسعار/إتاحة الفروع، سجّل audit وأرجع العلاقات.

- **بتاخد إيه؟ Inputs:** request محقق وMenuItem جديد/موجود وimages/audit وHTTP status افتراضي 200.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON item محمل category/branches. التخزين والصورة وsync مش داخل transaction واحدة في الكود الحالي.

### disableProduct

عطّل is_active بدل حذف المنتج وسجّل product.disabled.

- **بتاخد إيه؟ Inputs:** Request وMenuItem وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON message؛ السجلات القديمة تفضل موجودة.

### storeCategory

أنشئ category من validated data وسجل عملية الإنشاء.

- **بتاخد إيه؟ Inputs:** AdminCategoryRequest وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON category مع 201.

### updateCategory

حدّث category موجودة بالحقول المحققة وسجّل التعديل.

- **بتاخد إيه؟ Inputs:** AdminCategoryRequest وCategory وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON category.

### branches

رجّع فروع الإدارة بترتيب العرض، مش الفروع النشطة فقط.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON branches.

### updateBranch

عدّل بيانات الفرع ورسوم وإتاحة التوصيل وسجّل audit.

- **بتاخد إيه؟ Inputs:** AdminBranchRequest وBranch وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON branch.

### staff

رجّع حسابات staff وadmin مع الفرع، مرتبة بالاسم.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON users بدون password بسبب User.hidden.

### storeStaff

أنشئ حساب موظف/إدمن؛ الإدمن branch_id=null، وشيل password_confirmation قبل create، وسجّل metadata من غير باسورد.

- **بتاخد إيه؟ Inputs:** AdminStaffRequest وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON user مع branch و201.

### updateStaff

حدّث حساب staff/admin؛ لو password فاضي متغيّروش؛ لو الدور admin افصل الفرع.

- **بتاخد إيه؟ Inputs:** AdminStaffRequest وUser من route وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON user أو 404 لو المستخدم مش staff/admin.

### resetPassword

غيّر باسورد staff/admin بعد تحقق التأكيد وسجّل اسم العملية فقط؛ cast hashed في User يحوّل الباسورد إلى hash أحادي الاتجاه، مش تشفير قابل للفك.

- **بتاخد إيه؟ Inputs:** AdminPasswordRequest وUser وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON Password reset، لا يرجع الباسورد.

### orders

فلتر الطلبات بالفرع والحالة والدفع وبحث رقم/اسم/هاتف، أحدث 250 طلبًا كحد أقصى.

- **بتاخد إيه؟ Inputs:** AdminOrderFilterRequest.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON orders مع branch/items، مش pagination حقيقي.

### exportOrders

نزّل CSV لأحدث 5000 طلب؛ يستخدم streamDownload وfputcsv. الكود الحالي لا يطبق filters واجهة البحث هنا.

- **بتاخد إيه؟ Inputs:** Request غير مستخدمة مباشرة.

- **بترجع/بتغيّر إيه؟ Return / effect:** StreamedResponse باسم what-the-crust-orders.csv؛ البيانات نفسها محمّلة get قبل streaming.

### customers

هات customers وعدد طلباتهم ومجموع totals وآخر تاريخ طلب بواسطة aggregate relations.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON customers مع orders_count/orders_sum_total_price/orders_max_created_at؛ المجموع غير مفلتر بحالة الدفع هنا.

### settings

حوّل app_settings لقاموس key => value.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON settings؛ value العمود نصي في schema.

### updateSettings

لكل setting محققة اعمل updateOrCreate وسجل audit ثم رجع نفس settings response.

- **بتاخد إيه؟ Inputs:** AdminSettingsRequest وAdminAudit.

- **بترجع/بتغيّر إيه؟ Return / effect:** JsonResponse من settings().

### audit

هات آخر 100 عملية إدارة مع بيانات المستخدم اللازمة فقط.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON logs مع user id/name/email.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Order::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 38.

### ->whereDate

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تقارن جزء التاريخ من عمود.

- **المدخلات — Arguments:** column وdate/operator.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 39.

### ->whereNotIn

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تستبعد قيم قائمة.

- **المدخلات — Arguments:** column وvalues.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 39.

### today

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** هات بداية اليوم الحالي في timezone المحددة أو توقيت التطبيق؛ مفيدة لفلترة created_at في dashboard.

- **المدخلات — Arguments:** timezone اختيارية.

- **الناتج/الأثر — Return / effect:** Carbon date-time object عند بداية اليوم، وليس كل orders اليوم.

- **أول موضع هنا:** السطر 39.

- **مثال:** Order::whereDate('created_at', today())->count();

### ->sum

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تجمع عمودًا/قيمًا.

- **المدخلات — Arguments:** column أو callback حسب المستقبِل.

- **الناتج/الأثر — Return / effect:** قيمة رقمية حسب النوع والمحرك؛ ليست rows كاملة.

- **أول موضع هنا:** السطر 33.

### ->count

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تحسب عدد الصفوف/العناصر حسب المستقبِل.

- **المدخلات — Arguments:** column اختيارية للـquery.

- **الناتج/الأثر — Return / effect:** عدد؛ query count تنفّذ aggregate.

- **أول موضع هنا:** السطر 34.

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 166.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 166.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

### round

- **جاية منين؟** PHP built-in

- **وظيفتها:** قرّب رقمًا حسب precision؛ الدفع يستخدمها بعد ضرب total في100 ثم cast إلىint، وده مختلف عن تقريب سعر للعرض فقط.

- **المدخلات — Arguments:** number ثم precision اختيارية افتراضي0 ثم rounding mode اختيارية.

- **الناتج/الأثر — Return / effect:** float نتيجة التقريب؛ cast(int) في payment يحوّلها بعد ذلك إلىinteger.

- **أول موضع هنا:** السطر 36.

- **مثال:** (int) round(((float) $order->total_price) * 100)

### Order::whereDate

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تقارن جزء التاريخ من عمود.

- **المدخلات — Arguments:** column وdate/operator.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 37.

### ->select

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تحدد الأعمدة المطلوبة.

- **المدخلات — Arguments:** columns.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 39.

### DB::raw

- **جاية منين؟** Laravel Database Query Builder

- **وظيفتها:** غلف تعبير SQL خام عشان query builder يدرجه كما هو، مثل count(*) total أوsum(...). لا يعمل escaping لمتغيرات مستخدم داخله.

- **المدخلات — Arguments:** نص SQL expression string؛ المشروع يستخدم نصوصًا ثابتة للحسابات.

- **الناتج/الأثر — Return / effect:** Illuminate Database Query Expression object، وليس نتيجة count نفسها؛ query تتنفذ لاحقًا.

- **أول موضع هنا:** السطر 39.

- **مثال:** DB::raw('count(*) total')

### ->groupBy

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تجمع rows/عناصر حسب مفتاح.

- **المدخلات — Arguments:** column/key.

- **الناتج/الأثر — Return / effect:** Builder للاستعلام أو Collection مجمعة حسب المستقبِل.

- **أول موضع هنا:** السطر 39.

### ->pluck

- **جاية منين؟** Laravel Collection/Query Builder

- **وظيفتها:** هات قيمة عمود واحد، ومع key تاني تعمل قاموس بدل rows كاملة.

- **المدخلات — Arguments:** value column ثم key column اختياري.

- **الناتج/الأثر — Return / effect:** Collection قيم أو قاموس.

- **أول موضع هنا:** السطر 37.

- **مثال:** AppSetting::pluck('value', 'key')

### ->join

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ربط جدول آخر للاستعلام.

- **المدخلات — Arguments:** table وjoin keys/closure.

- **الناتج/الأثر — Return / effect:** Builder؛ ليست علاقة model تلقائيًا.

- **أول موضع هنا:** السطر 39.

### ->get

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ الاستعلام وتجمع الصفوف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** Collection؛ مش استجابة JSON وحدها.

- **أول موضع هنا:** السطر 166.

### OrderItem::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 39.

### ->orderByDesc

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا تنازليًا.

- **المدخلات — Arguments:** column.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 152.

### ->limit

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تحدد أقصى عدد rows.

- **المدخلات — Arguments:** count.

- **الناتج/الأثر — Return / effect:** Builder؛ لا تنفذ القراءة وحدها.

- **أول موضع هنا:** السطر 166.

### Category::orderBy

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا حسب عمود واتجاه.

- **المدخلات — Arguments:** column وdirection.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 46.

### Branch::orderBy

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا حسب عمود واتجاه.

- **المدخلات — Arguments:** column وdirection.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 95.

### MenuItem::with

- **جاية منين؟** Eloquent

- **وظيفتها:** تحدد علاقات يتم eager load لها عند الجلب.

- **المدخلات — Arguments:** علاقات كنصوص/array.

- **الناتج/الأثر — Return / effect:** Builder؛ التحميل يكتمل عند تنفيذ query.

- **أول موضع هنا:** السطر 48.

### ->orderBy

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا حسب عمود واتجاه.

- **المدخلات — Arguments:** column وdirection.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 103.

### $this->saveProduct

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** راجع البيانات، حوّل الصورة إن وجدت، احفظ المنتج، حدّث pivot أسعار/إتاحة الفروع، سجّل audit وأرجع العلاقات.

- **المدخلات — Arguments:** request محقق وMenuItem جديد/موجود وimages/audit وHTTP status افتراضي 200.

- **الناتج/الأثر — Return / effect:** JSON item محمل category/branches. التخزين والصورة وsync مش داخل transaction واحدة في الكود الحالي.

- **أول موضع هنا:** السطر 59.

### $request->validated

- **جاية منين؟** Laravel FormRequest

- **وظيفتها:** اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB.

- **المدخلات — Arguments:** key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها.

- **الناتج/الأثر — Return / effect:** array من validated input في الاستخدام الحالي.

- **أول موضع هنا:** السطر 160.

- **مثال:** $data = $request->validated();

### $request->hasFile

- **جاية منين؟** Laravel Request

- **وظيفتها:** تختبر وجود ملف رفع صالح في الحقل.

- **المدخلات — Arguments:** اسم الحقل.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 65.

### $images->store

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** افتح UploadedFile حسب MIME وغيّر المقاس وسمّيها slug+random واحفظها ثم حرر صور GD.

- **المدخلات — Arguments:** UploadedFile $file وstring $name اسم المنتج لتكوين اسم ملف.

- **الناتج/الأثر — Return / effect:** string public URL يبدأ /images/menu/admin/؛ ValidationException لو GD/WebP غير متاح أو الصورة غير قابلة للفتح. imagewebp return غير مفحوص حاليًا.

- **أول موضع هنا:** السطر 65.

- **تكملة التعريف:** [app/Services/ProductImageService.php](../../../Services/ProductImageService.php.md)، عند السطر 11.

### $request->file

- **جاية منين؟** Laravel Request

- **وظيفتها:** تقرأ ملف الرفع.

- **المدخلات — Arguments:** اسم الحقل.

- **الناتج/الأثر — Return / effect:** UploadedFile أو array/null حسب الحقل.

- **أول موضع هنا:** السطر 65.

### unset

- **جاية منين؟** PHP language construct

- **وظيفتها:** احذف متغيرًا أو مفتاحًا من array المحلية؛ مش أمر حذف DB.

- **المدخلات — Arguments:** واحد أو أكثر من المتغيرات/المفاتيح.

- **الناتج/الأثر — Return / effect:** لا قيمة.

- **أول موضع هنا:** السطر 119.

- **مثال:** unset($data['branch_options'], $data['image']);

### $item->fill

- **جاية منين؟** Laravel Eloquent Model

- **وظيفتها:** املأ attributes المسموح بها بالmass assignment في الذاكرة فقط؛ save تكتبها بعد كده.

- **المدخلات — Arguments:** array attributes.

- **الناتج/الأثر — Return / effect:** نفس model للchain.

- **أول موضع هنا:** السطر 68.

- **مثال:** $item->fill($data)->save();

### ->save

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تحفظ حالة model الحالية.

- **المدخلات — Arguments:** options اختيارية.

- **الناتج/الأثر — Return / effect:** Boolean عادة؛ DB exceptions تظل ممكنة.

- **أول موضع هنا:** السطر 68.

### $item->branches

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** رجّع فروع الإدارة بترتيب العرض، مش الفروع النشطة فقط.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** JSON branches.

- **أول موضع هنا:** السطر 69.

### ->sync

- **جاية منين؟** Laravel BelongsToMany

- **وظيفتها:** خلّي pivot links مطابقة للقائمة الجديدة: أضف/حدّث واحذف links غير الموجودة؛ ده مش مجرد append.

- **المدخلات — Arguments:** related ids أو id=>pivot attributes.

- **الناتج/الأثر — Return / effect:** array يصف attached/detached/updated؛ غير مستخدمة هنا.

- **أول موضع هنا:** السطر 69.

- **مثال:** $item->branches()->sync([1 => ['price' => 50, 'is_available' => true]]);

### ->mapWithKeys

- **جاية منين؟** Laravel Collection

- **وظيفتها:** حوّل العناصر لقاموس؛ callback ترجع زوج key=>value بدل قائمة عادية.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** Collection keyed.

- **أول موضع هنا:** السطر 69.

- **مثال:** collect($options)->mapWithKeys(fn ($option) => [$option['branch_id'] => ['price' => $option['price']]])

### ->all

- **جاية منين؟** Laravel Collection

- **وظيفتها:** ترجع array العناصر الحالية.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** array؛ Model::all بدلًا منها تنفّذ query وترجع Collection.

- **أول موضع هنا:** السطر 69.

### collect

- **جاية منين؟** Laravel helper

- **وظيفتها:** حوّل array أو iterable إلى Collection في الذاكرة للاستفادة من map/filter/pluck؛ لا يقرأ DB وحده.

- **المدخلات — Arguments:** array أو iterable أو قيمة يقبلها Collection constructor؛ الافتراضي قائمة فاضية.

- **الناتج/الأثر — Return / effect:** Illuminate Support Collection object.

- **أول موضع هنا:** السطر 69.

- **مثال:** collect($options)->mapWithKeys(fn ($option) => [$option['branch_id'] => $option]);

### $audit->record

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية.

- **المدخلات — Arguments:** User $user وstring $action وModel|string $subject وarray $details افتراضي [].

- **الناتج/الأثر — Return / effect:** void؛ الأثر row جديدة في AdminAuditLog.

- **أول موضع هنا:** السطر 160.

- **تكملة التعريف:** [app/Services/AdminAudit.php](../../../Services/AdminAudit.php.md)، عند السطر 11.

### $request->user

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** الإدمن منفذ العملية إن لم يتم حذفه.

- **المدخلات — Arguments:** user_id nullable.

- **الناتج/الأثر — Return / effect:** BelongsTo.

- **أول موضع هنا:** السطر 160.

- **تكملة التعريف:** [app/Models/AdminAuditLog.php](../../../Models/AdminAuditLog.php.md)، عند السطر 16.

- **تكملة التعريف:** [app/Models/Order.php](../../../Models/Order.php.md)، عند السطر 76.

### $item->load

- **جاية منين؟** Eloquent Model/Collection

- **وظيفتها:** تحمّل علاقات على نتائج موجودة.

- **المدخلات — Arguments:** العلاقات.

- **الناتج/الأثر — Return / effect:** نفس model/collection بعد التحميل.

- **أول موضع هنا:** السطر 71.

### $menuItem->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 76.

### Category::create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 83.

### $category->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 90.

### $branch->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 98.

### User::with

- **جاية منين؟** Eloquent

- **وظيفتها:** تحدد علاقات يتم eager load لها عند الجلب.

- **المدخلات — Arguments:** علاقات كنصوص/array.

- **الناتج/الأثر — Return / effect:** Builder؛ التحميل يكتمل عند تنفيذ query.

- **أول موضع هنا:** السطر 103.

### ->whereIn

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف شرط انتماء لقائمة قيم.

- **المدخلات — Arguments:** column وvalues.

- **الناتج/الأثر — Return / effect:** Builder؛ Collection.whereIn بدلًا منها تعيد مجموعة مفلترة.

- **أول موضع هنا:** السطر 103.

### User::create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 109.

### $user->load

- **جاية منين؟** Eloquent Model/Collection

- **وظيفتها:** تحمّل علاقات على نتائج موجودة.

- **المدخلات — Arguments:** العلاقات.

- **الناتج/الأثر — Return / effect:** نفس model/collection بعد التحميل.

- **أول موضع هنا:** السطر 122.

### abort_unless

- **جاية منين؟** Laravel helper

- **وظيفتها:** لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل.

- **المدخلات — Arguments:** condition وstatus code ورسالة اختيارية.

- **الناتج/الأثر — Return / effect:** لا قيمة مفيدة؛ قد يرمي exception.

- **أول موضع هنا:** السطر 126.

- **مثال:** abort_unless($user->isAdmin(), 403);

### in_array

- **جاية منين؟** PHP built-in

- **وظيفتها:** هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة.

- **المدخلات — Arguments:** needle ثم haystack ثم strict bool.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 126.

- **مثال:** in_array($status, $allowed, true)

### empty

- **جاية منين؟** PHP language construct، مش method

- **وظيفتها:** تسأل هل القيمة فاضية بالمعنى الواسع في PHP. تعتبر غير الموجود وnull وfalse و0 والنص0 والنص الفاضي و[] كلها empty؛ لذلك ما تنفعش تميّز صفرًا صحيحًا عن حقل ناقص.

- **المدخلات — Arguments:** متغير أو تعبير تفحص قيمته. فحص متغير غير معرّف لا يصدر undefined-variable warning هنا.

- **الناتج/الأثر — Return / effect:** Boolean: true لو القيمة empty، false لغير كده. لا تمسح المتغير ولا تغيره.

- **أول موضع هنا:** السطر 118.

### $user->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 128.

### Order::with

- **جاية منين؟** Eloquent

- **وظيفتها:** تحدد علاقات يتم eager load لها عند الجلب.

- **المدخلات — Arguments:** علاقات كنصوص/array.

- **الناتج/الأثر — Return / effect:** Builder؛ التحميل يكتمل عند تنفيذ query.

- **أول موضع هنا:** السطر 141.

### ->when

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تنفّذ callback شرطية حسب قيمة.

- **المدخلات — Arguments:** value وcallback وdefault اختيارية.

- **الناتج/الأثر — Return / effect:** نتيجة callback أو السلسلة؛ في query هنا لاستكمال بناء الشروط.

- **أول موضع هنا:** السطر 135.

### $q->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 135.

### $nested->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 135.

### ->orWhere

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط OR في المجموعة الحالية.

- **المدخلات — Arguments:** column/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder؛ الأقواس/المجموعات مهمة لمعنى OR.

- **أول موضع هنا:** السطر 135.

### ->latest

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا تنازليًا للأحدث.

- **المدخلات — Arguments:** column اختياري؛ الافتراضي created_at.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 166.

### ->streamDownload

- **جاية منين؟** Laravel ResponseFactory

- **وظيفتها:** جهّز تنزيل response يكتب body عن طريق callback؛ مش معناه إن DB query نفسها lazy.

- **المدخلات — Arguments:** callback وfilename وheaders.

- **الناتج/الأثر — Return / effect:** StreamedResponse.

- **أول موضع هنا:** السطر 142.

- **مثال:** return response()->streamDownload(function () { /* output */ }, 'orders.csv');

### fopen

- **جاية منين؟** PHP built-in

- **وظيفتها:** افتح stream؛ php://output معناها اكتب في HTTP output بدل ملف على الهارد.

- **المدخلات — Arguments:** path/stream وmode w.

- **الناتج/الأثر — Return / effect:** resource أو false.

- **أول موضع هنا:** السطر 143.

- **مثال:** $out = fopen('php://output', 'w');

### fputcsv

- **جاية منين؟** PHP built-in

- **وظيفتها:** حوّل array خلايا لسطر CSV مع escaping للفواصل والاقتباسات واكتبه للstream؛ لا يمنع CSV formula injection وحده.

- **المدخلات — Arguments:** stream resource وarray cells.

- **الناتج/الأثر — Return / effect:** عدد bytes المكتوبة أو false.

- **أول موضع هنا:** السطر 145.

- **مثال:** fputcsv($out, ['Order', 'Date', 'Total']);

### fclose

- **جاية منين؟** PHP built-in

- **وظيفتها:** اقفل stream resource بعد الكتابة.

- **المدخلات — Arguments:** resource.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 146.

- **مثال:** fclose($out);

### User::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 152.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 152.

### ->withCount

- **جاية منين؟** Eloquent

- **وظيفتها:** تضيف عدد عناصر علاقات إلى نتائج query.

- **المدخلات — Arguments:** relations.

- **الناتج/الأثر — Return / effect:** Builder؛ الناتج يحمل أعمدة count عند الجلب.

- **أول موضع هنا:** السطر 152.

### ->withSum

- **جاية منين؟** Eloquent

- **وظيفتها:** تضيف aggregate sum على علاقة.

- **المدخلات — Arguments:** relation وcolumn.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 152.

### ->withMax

- **جاية منين؟** Eloquent

- **وظيفتها:** تضيف أعلى قيمة من علاقة.

- **المدخلات — Arguments:** relation وcolumn.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 152.

### AppSetting::pluck

- **جاية منين؟** Laravel Collection/Query Builder

- **وظيفتها:** هات قيمة عمود واحد، ومع key تاني تعمل قاموس بدل rows كاملة.

- **المدخلات — Arguments:** value column ثم key column اختياري.

- **الناتج/الأثر — Return / effect:** Collection قيم أو قاموس.

- **أول موضع هنا:** السطر 156.

- **مثال:** AppSetting::pluck('value', 'key')

### AppSetting::updateOrCreate

- **جاية منين؟** Laravel Eloquent

- **وظيفتها:** ابحث بالشروط؛ حدّث لو موجود أو أنشئ لو مفيش. مش معناها transaction مستقلة تمنع كل race condition تلقائيًا.

- **المدخلات — Arguments:** attributes للبحث ثم values للكتابة.

- **الناتج/الأثر — Return / effect:** Model محفوظة.

- **أول موضع هنا:** السطر 159.

- **مثال:** AppSetting::updateOrCreate(['key' => $key], ['value' => $value]);

### $this->settings

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** حوّل app_settings لقاموس key => value.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** JSON settings؛ value العمود نصي في schema.

- **أول موضع هنا:** السطر 161.

### AdminAuditLog::with

- **جاية منين؟** Eloquent

- **وظيفتها:** تحدد علاقات يتم eager load لها عند الجلب.

- **المدخلات — Arguments:** علاقات كنصوص/array.

- **الناتج/الأثر — Return / effect:** Builder؛ التحميل يكتمل عند تنفيذ query.

- **أول موضع هنا:** السطر 166.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminBranchRequest;
use App\Http\Requests\AdminCategoryRequest;
use App\Http\Requests\AdminProductRequest;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Controllers\Api`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Http\Controllers\Controller` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Http\Requests\AdminBranchRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Http\Requests\AdminCategoryRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Http\Requests\AdminProductRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Http\Requests\AdminPasswordRequest;
use App\Http\Requests\AdminOrderFilterRequest;
use App\Http\Requests\AdminSettingsRequest;
use App\Http\Requests\AdminStaffRequest;
use App\Models\AdminAuditLog;
use App\Models\AppSetting;
use App\Models\Branch;
use App\Models\Category;
```

**السطر 9:** use / استيراد الاسم `App\Http\Requests\AdminPasswordRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `App\Http\Requests\AdminOrderFilterRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `App\Http\Requests\AdminSettingsRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** use / استيراد الاسم `App\Http\Requests\AdminStaffRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** use / استيراد الاسم `App\Models\AdminAuditLog` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 14:** use / استيراد الاسم `App\Models\AppSetting` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 15:** use / استيراد الاسم `App\Models\Branch` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 16:** use / استيراد الاسم `App\Models\Category` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 17–24

```php
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Services\AdminAudit;
use App\Services\ProductImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
```

**السطر 17:** use / استيراد الاسم `App\Models\MenuItem` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 18:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 19:** use / استيراد الاسم `App\Models\OrderItem` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 20:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 21:** use / استيراد الاسم `App\Services\AdminAudit` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 22:** use / استيراد الاسم `App\Services\ProductImageService` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 23:** use / استيراد الاسم `Illuminate\Http\JsonResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 24:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 25–32

```php
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $orders = Order::query()->whereDate('created_at', today())->whereNotIn('status', ['payment_pending', 'cancelled', 'rejected']);
```

**السطر 25:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 26:** use / استيراد الاسم `Symfony\Component\HttpFoundation\StreamedResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 28:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 29:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 30:** Function / تعريف دالة `dashboard`؛ تعريفها مش تشغيلها. احسب مبيعات وعدد ومتوسط طلبات اليوم وبحسب الفرع والحالة وأفضل الأصناف مع استبعاد الحالات الملغاة أو payment_pending من المبيعات. مدخلاتها: لا parameters؛ يوم السيرفر من today(). ناتجها: JSON summary/by_status/by_branch/best_items.

**السطر 31:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 32:** Assignment / إسناد: احسب `Order::query()->whereDate('created_at', today())->whereNotIn('status', ['payment_pending', 'cancelled', 'rejected'])` الأول وخزّن النتيجة في `$orders`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 33–40

```php
        $sales = (clone $orders)->sum('total_price');
        $count = (clone $orders)->count();
        return response()->json([
            'summary' => ['sales' => $sales, 'orders' => $count, 'average' => $count ? round($sales / $count, 2) : 0],
            'by_status' => Order::whereDate('created_at', today())->select('status', DB::raw('count(*) total'))->groupBy('status')->pluck('total', 'status'),
            'by_branch' => Order::query()->join('branches', 'branches.id', '=', 'orders.branch_id')->whereDate('orders.created_at', today())->whereNotIn('orders.status', ['payment_pending', 'cancelled', 'rejected'])->groupBy('branches.id', 'branches.name')->select('branches.name', DB::raw('sum(orders.total_price) sales'))->get(),
            'best_items' => OrderItem::query()->join('orders', 'orders.id', '=', 'order_items.order_id')->whereDate('orders.created_at', today())->whereNotIn('orders.status', ['payment_pending', 'cancelled', 'rejected'])->groupBy('order_items.item_name')->select('order_items.item_name', DB::raw('sum(order_items.quantity) quantity'))->orderByDesc('quantity')->limit(8)->get(),
        ]);
```

**السطر 33:** Assignment / إسناد: احسب `(clone $orders)->sum('total_price')` الأول وخزّن النتيجة في `$sales`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 34:** Assignment / إسناد: احسب `(clone $orders)->count()` الأول وخزّن النتيجة في `$count`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 35:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 36:** PHP array entry: المفتاح `summary` مرتبط بالقيمة `['sales' => $sales, 'orders' => $count, 'average' => $count ? round($sales / $count, 2) : 0]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 37:** PHP array entry: المفتاح `by_status` مرتبط بالقيمة `Order::whereDate('created_at', today())->select('status', DB::raw('count(*) total'))->groupBy('status')->pluck('total', 'status')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 38:** PHP array entry: المفتاح `by_branch` مرتبط بالقيمة `Order::query()->join('branches', 'branches.id', '=', 'orders.branch_id')->whereDate('orders.created_at', today())->whereNotIn('orders.status', ['payment_pending', 'cancelled', 'rejected'])->groupBy('branches.id…`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 39:** PHP array entry: المفتاح `best_items` مرتبط بالقيمة `OrderItem::query()->join('orders', 'orders.id', '=', 'order_items.order_id')->whereDate('orders.created_at', today())->whereNotIn('orders.status', ['payment_pending', 'cancelled', 'rejected'])->groupBy('order_i…`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 40:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```php
    }

    public function catalog(): JsonResponse
    {
        return response()->json([
            'categories' => Category::orderBy('display_order')->get(),
            'branches' => Branch::orderBy('display_order')->get(),
            'items' => MenuItem::with(['category', 'branches'])->orderBy('category_id')->orderBy('display_order')->get(),
```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** Function / تعريف دالة `catalog`؛ تعريفها مش تشغيلها. هات كامل كتالوج الإدارة بما فيه المعطّل، مع category وbranch prices. مدخلاتها: لا parameters. ناتجها: JSON categories/branches/items.

**السطر 44:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 45:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 46:** PHP array entry: المفتاح `categories` مرتبط بالقيمة `Category::orderBy('display_order')->get()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 47:** PHP array entry: المفتاح `branches` مرتبط بالقيمة `Branch::orderBy('display_order')->get()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 48:** PHP array entry: المفتاح `items` مرتبط بالقيمة `MenuItem::with(['category', 'branches'])->orderBy('category_id')->orderBy('display_order')->get()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 49–56

```php
        ]);
    }

    public function storeProduct(AdminProductRequest $request, ProductImageService $images, AdminAudit $audit): JsonResponse
    {
        return $this->saveProduct($request, new MenuItem(), $images, $audit, 201);
    }

```

**السطر 49:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 50:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 52:** Function / تعريف دالة `storeProduct`؛ تعريفها مش تشغيلها. ابدأ MenuItem جديد ومرّره لنفس saveProduct مع status 201. مدخلاتها: AdminProductRequest وProductImageService وAdminAudit بحقن Laravel. ناتجها: JsonResponse من saveProduct.

**السطر 53:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 54:** return تعيد التعبير `$this->saveProduct($request, new MenuItem(), $images, $audit, 201)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–64

```php
    public function updateProduct(AdminProductRequest $request, MenuItem $menuItem, ProductImageService $images, AdminAudit $audit): JsonResponse
    {
        return $this->saveProduct($request, $menuItem, $images, $audit);
    }

    private function saveProduct(AdminProductRequest $request, MenuItem $item, ProductImageService $images, AdminAudit $audit, int $status = 200): JsonResponse
    {
        $data = $request->validated();
```

**السطر 57:** Function / تعريف دالة `updateProduct`؛ تعريفها مش تشغيلها. مرر منتج موجود من route binding إلى saveProduct المشتركة. مدخلاتها: AdminProductRequest وMenuItem موجود وimages/audit services. ناتجها: JSON item محدث، افتراضي 200.

**السطر 58:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 59:** return تعيد التعبير `$this->saveProduct($request, $menuItem, $images, $audit)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 60:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 62:** Function / تعريف دالة `saveProduct`؛ تعريفها مش تشغيلها. راجع البيانات، حوّل الصورة إن وجدت، احفظ المنتج، حدّث pivot أسعار/إتاحة الفروع، سجّل audit وأرجع العلاقات. مدخلاتها: request محقق وMenuItem جديد/موجود وimages/audit وHTTP status افتراضي 200. ناتجها: JSON item محمل category/branches. التخزين والصورة وsync مش داخل transaction واحدة في الكود الحالي.

**السطر 63:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 64:** Assignment / إسناد: احسب `$request->validated()` الأول وخزّن النتيجة في `$data`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 65–72

```php
        if ($request->hasFile('image')) $data['image_path'] = $images->store($request->file('image'), $data['name']);
        $options = $data['branch_options'];
        unset($data['branch_options'], $data['image']);
        $item->fill($data)->save();
        $item->branches()->sync(collect($options)->mapWithKeys(fn ($option) => [$option['branch_id'] => ['price' => $option['price'], 'is_available' => $option['is_available']]])->all());
        $audit->record($request->user(), $status === 201 ? 'product.created' : 'product.updated', $item, $data);
        return response()->json(['item' => $item->load(['category', 'branches'])], $status);
    }
```

**السطر 65:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `$request->hasFile(...)`: تختبر وجود ملف رفع صالح في الحقل. مدخلاتها: اسم الحقل. العائد/الأثر: Boolean.؛ `$images->store(...)`: افتح UploadedFile حسب MIME وغيّر المقاس وسمّيها slug+random واحفظها ثم حرر صور GD. مدخلاتها: UploadedFile $file وstring $name اسم المنتج لتكوين اسم ملف. العائد/الأثر: string public URL يبدأ /images/menu/admin/؛ ValidationException لو GD/WebP غير متاح أو الصورة غير قابلة للفتح. imagewebp return غير مفحوص حاليًا.؛ `$request->file(...)`: تقرأ ملف الرفع. مدخلاتها: اسم الحقل. العائد/الأثر: UploadedFile أو array/null حسب الحقل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** Assignment / إسناد: احسب `$data['branch_options']` الأول وخزّن النتيجة في `$options`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 67:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `unset(...)`: احذف متغيرًا أو مفتاحًا من array المحلية؛ مش أمر حذف DB. مدخلاتها: واحد أو أكثر من المتغيرات/المفاتيح. العائد/الأثر: لا قيمة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 68:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$item->fill(...)`: املأ attributes المسموح بها بالmass assignment في الذاكرة فقط؛ save تكتبها بعد كده. مدخلاتها: array attributes. العائد/الأثر: نفس model للchain.؛ `->save(...)`: تحفظ حالة model الحالية. مدخلاتها: options اختيارية. العائد/الأثر: Boolean عادة؛ DB exceptions تظل ممكنة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 69:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$item->branches(...)`: رجّع فروع الإدارة بترتيب العرض، مش الفروع النشطة فقط. مدخلاتها: لا شيء. العائد/الأثر: JSON branches.؛ `->sync(...)`: خلّي pivot links مطابقة للقائمة الجديدة: أضف/حدّث واحذف links غير الموجودة؛ ده مش مجرد append. مدخلاتها: related ids أو id=>pivot attributes. العائد/الأثر: array يصف attached/detached/updated؛ غير مستخدمة هنا.؛ `->mapWithKeys(...)`: حوّل العناصر لقاموس؛ callback ترجع زوج key=>value بدل قائمة عادية. مدخلاتها: callback. العائد/الأثر: Collection keyed.؛ `->all(...)`: ترجع array العناصر الحالية. مدخلاتها: بدون arguments. العائد/الأثر: array؛ Model::all بدلًا منها تنفّذ query وترجع Collection.؛ `collect(...)`: حوّل array أو iterable إلى Collection في الذاكرة للاستفادة من map/filter/pluck؛ لا يقرأ DB وحده. مدخلاتها: array أو iterable أو قيمة يقبلها Collection constructor؛ الافتراضي قائمة فاضية. العائد/الأثر: Illuminate Support Collection object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 70:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 71:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 72:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–80

```php

    public function disableProduct(Request $request, MenuItem $menuItem, AdminAudit $audit): JsonResponse
    {
        $menuItem->update(['is_active' => false]);
        $audit->record($request->user(), 'product.disabled', $menuItem);
        return response()->json(['message' => 'Product disabled.']);
    }

```

**السطر 74:** Function / تعريف دالة `disableProduct`؛ تعريفها مش تشغيلها. عطّل is_active بدل حذف المنتج وسجّل product.disabled. مدخلاتها: Request وMenuItem وAdminAudit. ناتجها: JSON message؛ السجلات القديمة تفضل موجودة.

**السطر 75:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 76:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$menuItem->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 77:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 78:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 79:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 81–88

```php
    public function storeCategory(AdminCategoryRequest $request, AdminAudit $audit): JsonResponse
    {
        $category = Category::create($request->validated());
        $audit->record($request->user(), 'category.created', $category, $request->validated());
        return response()->json(['category' => $category], 201);
    }

    public function updateCategory(AdminCategoryRequest $request, Category $category, AdminAudit $audit): JsonResponse
```

**السطر 81:** Function / تعريف دالة `storeCategory`؛ تعريفها مش تشغيلها. أنشئ category من validated data وسجل عملية الإنشاء. مدخلاتها: AdminCategoryRequest وAdminAudit. ناتجها: JSON category مع 201.

**السطر 82:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 83:** Assignment / إسناد: احسب `Category::create($request->validated())` الأول وخزّن النتيجة في `$category`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 84:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.؛ `$request->validated(...)`: اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB. مدخلاتها: key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها. العائد/الأثر: array من validated input في الاستخدام الحالي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 85:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 86:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 88:** Function / تعريف دالة `updateCategory`؛ تعريفها مش تشغيلها. حدّث category موجودة بالحقول المحققة وسجّل التعديل. مدخلاتها: AdminCategoryRequest وCategory وAdminAudit. ناتجها: JSON category.

### السطور 89–96

```php
    {
        $category->update($request->validated());
        $audit->record($request->user(), 'category.updated', $category, $request->validated());
        return response()->json(['category' => $category]);
    }

    public function branches(): JsonResponse { return response()->json(['branches' => Branch::orderBy('display_order')->get()]); }
    public function updateBranch(AdminBranchRequest $request, Branch $branch, AdminAudit $audit): JsonResponse
```

**السطر 89:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 90:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$category->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.؛ `$request->validated(...)`: اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB. مدخلاتها: key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها. العائد/الأثر: array من validated input في الاستخدام الحالي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 91:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.؛ `$request->validated(...)`: اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB. مدخلاتها: key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها. العائد/الأثر: array من validated input في الاستخدام الحالي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 92:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 93:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 95:** Function / تعريف دالة `branches`؛ تعريفها مش تشغيلها. رجّع فروع الإدارة بترتيب العرض، مش الفروع النشطة فقط. مدخلاتها: لا شيء. ناتجها: JSON branches. الدوال الموجودة في السطر: `->json(...)`: تجهّز HTTP response من بيانات JSON. مدخلاتها: data وstatus وheaders. العائد/الأثر: JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.؛ `Branch::orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.؛ `->get(...)`: تنفّذ الاستعلام وتجمع الصفوف. مدخلاتها: columns اختيارية. العائد/الأثر: Collection؛ مش استجابة JSON وحدها.؛ `response(...)`: جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload. مدخلاتها: بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة. العائد/الأثر: ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 96:** Function / تعريف دالة `updateBranch`؛ تعريفها مش تشغيلها. عدّل بيانات الفرع ورسوم وإتاحة التوصيل وسجّل audit. مدخلاتها: AdminBranchRequest وBranch وAdminAudit. ناتجها: JSON branch.

### السطور 97–104

```php
    {
        $branch->update($request->validated());
        $audit->record($request->user(), 'branch.updated', $branch, $request->validated());
        return response()->json(['branch' => $branch]);
    }

    public function staff(): JsonResponse { return response()->json(['users' => User::with('branch')->whereIn('role', ['staff', 'admin'])->orderBy('name')->get()]); }
    public function storeStaff(AdminStaffRequest $request, AdminAudit $audit): JsonResponse
```

**السطر 97:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 98:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$branch->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.؛ `$request->validated(...)`: اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB. مدخلاتها: key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها. العائد/الأثر: array من validated input في الاستخدام الحالي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.؛ `$request->validated(...)`: اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB. مدخلاتها: key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها. العائد/الأثر: array من validated input في الاستخدام الحالي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 100:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 101:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 103:** Function / تعريف دالة `staff`؛ تعريفها مش تشغيلها. رجّع حسابات staff وadmin مع الفرع، مرتبة بالاسم. مدخلاتها: لا شيء. ناتجها: JSON users بدون password بسبب User.hidden. الدوال الموجودة في السطر: `->json(...)`: تجهّز HTTP response من بيانات JSON. مدخلاتها: data وstatus وheaders. العائد/الأثر: JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.؛ `User::with(...)`: تحدد علاقات يتم eager load لها عند الجلب. مدخلاتها: علاقات كنصوص/array. العائد/الأثر: Builder؛ التحميل يكتمل عند تنفيذ query.؛ `->whereIn(...)`: تضيف شرط انتماء لقائمة قيم. مدخلاتها: column وvalues. العائد/الأثر: Builder؛ Collection.whereIn بدلًا منها تعيد مجموعة مفلترة.؛ `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.؛ `->get(...)`: تنفّذ الاستعلام وتجمع الصفوف. مدخلاتها: columns اختيارية. العائد/الأثر: Collection؛ مش استجابة JSON وحدها.؛ `response(...)`: جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload. مدخلاتها: بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة. العائد/الأثر: ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 104:** Function / تعريف دالة `storeStaff`؛ تعريفها مش تشغيلها. أنشئ حساب موظف/إدمن؛ الإدمن branch_id=null، وشيل password_confirmation قبل create، وسجّل metadata من غير باسورد. مدخلاتها: AdminStaffRequest وAdminAudit. ناتجها: JSON user مع branch و201.

### السطور 105–112

```php
    {
        $data = $request->validated();
        if ($data['role'] === 'admin') $data['branch_id'] = null;
        unset($data['password_confirmation']);
        $user = User::create($data);
        $audit->record($request->user(), 'staff.created', $user, ['email' => $user->email, 'role' => $user->role, 'branch_id' => $user->branch_id]);
        return response()->json(['user' => $user->load('branch')], 201);
    }
```

**السطر 105:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 106:** Assignment / إسناد: احسب `$request->validated()` الأول وخزّن النتيجة في `$data`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 107:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 108:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `unset(...)`: احذف متغيرًا أو مفتاحًا من array المحلية؛ مش أمر حذف DB. مدخلاتها: واحد أو أكثر من المتغيرات/المفاتيح. العائد/الأثر: لا قيمة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 109:** User::create تحفظ مستخدمًا جديدًا بالبيانات المعطاة وترجع User model نخزّنها في `$user`. قواعد fillable وcasts في User.php جزء من العملية، ومنها hashing للباسورد؛ ده حفظ في السيرفر مش state بالمتصفح.

**السطر 110:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 111:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 112:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 113–120

```php
    public function updateStaff(AdminStaffRequest $request, User $user, AdminAudit $audit): JsonResponse
    {
        abort_unless(in_array($user->role, ['staff', 'admin'], true), 404);
        $data = $request->validated();
        if ($data['role'] === 'admin') $data['branch_id'] = null;
        if (empty($data['password'])) unset($data['password']);
        unset($data['password_confirmation']);
        $user->update($data);
```

**السطر 113:** Function / تعريف دالة `updateStaff`؛ تعريفها مش تشغيلها. حدّث حساب staff/admin؛ لو password فاضي متغيّروش؛ لو الدور admin افصل الفرع. مدخلاتها: AdminStaffRequest وUser من route وAdminAudit. ناتجها: JSON user أو 404 لو المستخدم مش staff/admin.

**السطر 114:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 115:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `abort_unless(...)`: لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل. مدخلاتها: condition وstatus code ورسالة اختيارية. العائد/الأثر: لا قيمة مفيدة؛ قد يرمي exception.؛ `in_array(...)`: هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة. مدخلاتها: needle ثم haystack ثم strict bool. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 116:** Assignment / إسناد: احسب `$request->validated()` الأول وخزّن النتيجة في `$data`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 117:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 118:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `empty(...)`: تسأل هل القيمة فاضية بالمعنى الواسع في PHP. تعتبر غير الموجود وnull وfalse و0 والنص0 والنص الفاضي و[] كلها empty؛ لذلك ما تنفعش تميّز صفرًا صحيحًا عن حقل ناقص. مدخلاتها: متغير أو تعبير تفحص قيمته. فحص متغير غير معرّف لا يصدر undefined-variable warning هنا. العائد/الأثر: Boolean: true لو القيمة empty، false لغير كده. لا تمسح المتغير ولا تغيره.؛ `unset(...)`: احذف متغيرًا أو مفتاحًا من array المحلية؛ مش أمر حذف DB. مدخلاتها: واحد أو أكثر من المتغيرات/المفاتيح. العائد/الأثر: لا قيمة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 119:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `unset(...)`: احذف متغيرًا أو مفتاحًا من array المحلية؛ مش أمر حذف DB. مدخلاتها: واحد أو أكثر من المتغيرات/المفاتيح. العائد/الأثر: لا قيمة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 120:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$user->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 121–128

```php
        $audit->record($request->user(), 'staff.updated', $user, ['email' => $user->email, 'role' => $user->role, 'branch_id' => $user->branch_id, 'is_active' => $user->is_active]);
        return response()->json(['user' => $user->load('branch')]);
    }
    public function resetPassword(AdminPasswordRequest $request, User $user, AdminAudit $audit): JsonResponse
    {
        abort_unless(in_array($user->role, ['staff', 'admin'], true), 404);
        $data = $request->validated();
        $user->update(['password' => $data['password']]);
```

**السطر 121:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 122:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 123:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 124:** Function / تعريف دالة `resetPassword`؛ تعريفها مش تشغيلها. غيّر باسورد staff/admin بعد تحقق التأكيد وسجّل اسم العملية فقط؛ cast hashed في User يحوّل الباسورد إلى hash أحادي الاتجاه، مش تشفير قابل للفك. مدخلاتها: AdminPasswordRequest وUser وAdminAudit. ناتجها: JSON Password reset، لا يرجع الباسورد.

**السطر 125:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 126:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `abort_unless(...)`: لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل. مدخلاتها: condition وstatus code ورسالة اختيارية. العائد/الأثر: لا قيمة مفيدة؛ قد يرمي exception.؛ `in_array(...)`: هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة. مدخلاتها: needle ثم haystack ثم strict bool. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 127:** Assignment / إسناد: احسب `$request->validated()` الأول وخزّن النتيجة في `$data`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 128:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$user->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 129–136

```php
        $audit->record($request->user(), 'staff.password_reset', $user);
        return response()->json(['message' => 'Password reset.']);
    }

    public function orders(AdminOrderFilterRequest $request): JsonResponse
    {
        $orders = Order::with(['branch', 'items'])->when($request->branch_id, fn ($q, $v) => $q->where('branch_id', $v))->when($request->status, fn ($q, $v) => $q->where('status', $v))->when($request->payment_status, fn ($q, $v) => $q->where('payment_status', $v))->when($request->search, fn ($q, $v) => $q->where(fn ($nested) => $nested->where('id', $v)->orWhere('customer_name', 'like', "%{$v}%")->orWhere('customer_phone', 'like', "%{$v}%")))->latest()->limit(250)->get();
        return response()->json(['orders' => $orders]);
```

**السطر 129:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 130:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 131:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 133:** Function / تعريف دالة `orders`؛ تعريفها مش تشغيلها. فلتر الطلبات بالفرع والحالة والدفع وبحث رقم/اسم/هاتف، أحدث 250 طلبًا كحد أقصى. مدخلاتها: AdminOrderFilterRequest. ناتجها: JSON orders مع branch/items، مش pagination حقيقي.

**السطر 134:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 135:** Assignment / إسناد: احسب `Order::with(['branch', 'items'])->when($request->branch_id, fn ($q, $v) => $q->where('branch_id', $v))->when($request->status, fn ($q, $v) => $q->where('status', $v))->when($request->payment_status, fn ($q, $v)…` الأول وخزّن النتيجة في `$orders`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 136:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

### السطور 137–144

```php
    }

    public function exportOrders(Request $request): StreamedResponse
    {
        $orders = Order::with('branch')->latest()->limit(5000)->get();
        return response()->streamDownload(function () use ($orders): void {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Order', 'Date', 'Branch', 'Customer', 'Phone', 'Status', 'Payment', 'Total']);
```

**السطر 137:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 139:** Function / تعريف دالة `exportOrders`؛ تعريفها مش تشغيلها. نزّل CSV لأحدث 5000 طلب؛ يستخدم streamDownload وfputcsv. الكود الحالي لا يطبق filters واجهة البحث هنا. مدخلاتها: Request غير مستخدمة مباشرة. ناتجها: StreamedResponse باسم what-the-crust-orders.csv؛ البيانات نفسها محمّلة get قبل streaming.

**السطر 140:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 141:** Assignment / إسناد: احسب `Order::with('branch')->latest()->limit(5000)->get()` الأول وخزّن النتيجة في `$orders`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 142:** return تعيد التعبير `response()->streamDownload(function () use ($orders): void {` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 143:** Assignment / إسناد: احسب `fopen('php://output', 'w')` الأول وخزّن النتيجة في `$out`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 144:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `fputcsv(...)`: حوّل array خلايا لسطر CSV مع escaping للفواصل والاقتباسات واكتبه للstream؛ لا يمنع CSV formula injection وحده. مدخلاتها: stream resource وarray cells. العائد/الأثر: عدد bytes المكتوبة أو false.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 145–152

```php
            foreach ($orders as $order) fputcsv($out, [$order->id, $order->created_at, $order->branch?->name, $order->customer_name, $order->customer_phone, $order->status, $order->payment_status, $order->total_price]);
            fclose($out);
        }, 'what-the-crust-orders.csv', ['Content-Type' => 'text/csv']);
    }

    public function customers(): JsonResponse
    {
        $customers = User::query()->where('role', 'customer')->withCount('orders')->withSum('orders', 'total_price')->withMax('orders', 'created_at')->orderByDesc('orders_sum_total_price')->get();
```

**السطر 145:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة. الدوال الموجودة في السطر: `fputcsv(...)`: حوّل array خلايا لسطر CSV مع escaping للفواصل والاقتباسات واكتبه للstream؛ لا يمنع CSV formula injection وحده. مدخلاتها: stream resource وarray cells. العائد/الأثر: عدد bytes المكتوبة أو false.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 146:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `fclose(...)`: اقفل stream resource بعد الكتابة. مدخلاتها: resource. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 147:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 148:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 150:** Function / تعريف دالة `customers`؛ تعريفها مش تشغيلها. هات customers وعدد طلباتهم ومجموع totals وآخر تاريخ طلب بواسطة aggregate relations. مدخلاتها: لا شيء. ناتجها: JSON customers مع orders_count/orders_sum_total_price/orders_max_created_at؛ المجموع غير مفلتر بحالة الدفع هنا.

**السطر 151:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 152:** Assignment / إسناد: احسب `User::query()->where('role', 'customer')->withCount('orders')->withSum('orders', 'total_price')->withMax('orders', 'created_at')->orderByDesc('orders_sum_total_price')->get()` الأول وخزّن النتيجة في `$customers`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 153–160

```php
        return response()->json(['customers' => $customers]);
    }

    public function settings(): JsonResponse { return response()->json(['settings' => AppSetting::pluck('value', 'key')]); }
    public function updateSettings(AdminSettingsRequest $request, AdminAudit $audit): JsonResponse
    {
        foreach ($request->validated() as $key => $value) AppSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        $audit->record($request->user(), 'settings.updated', AppSetting::class, $request->validated());
```

**السطر 153:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 154:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 156:** Function / تعريف دالة `settings`؛ تعريفها مش تشغيلها. حوّل app_settings لقاموس key => value. مدخلاتها: لا شيء. ناتجها: JSON settings؛ value العمود نصي في schema. الدوال الموجودة في السطر: `->json(...)`: تجهّز HTTP response من بيانات JSON. مدخلاتها: data وstatus وheaders. العائد/الأثر: JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.؛ `AppSetting::pluck(...)`: هات قيمة عمود واحد، ومع key تاني تعمل قاموس بدل rows كاملة. مدخلاتها: value column ثم key column اختياري. العائد/الأثر: Collection قيم أو قاموس.؛ `response(...)`: جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload. مدخلاتها: بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة. العائد/الأثر: ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 157:** Function / تعريف دالة `updateSettings`؛ تعريفها مش تشغيلها. لكل setting محققة اعمل updateOrCreate وسجل audit ثم رجع نفس settings response. مدخلاتها: AdminSettingsRequest وAdminAudit. ناتجها: JsonResponse من settings().

**السطر 158:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 159:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة. الدوال الموجودة في السطر: `$request->validated(...)`: اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB. مدخلاتها: key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها. العائد/الأثر: array من validated input في الاستخدام الحالي.؛ `AppSetting::updateOrCreate(...)`: ابحث بالشروط؛ حدّث لو موجود أو أنشئ لو مفيش. مش معناها transaction مستقلة تمنع كل race condition تلقائيًا. مدخلاتها: attributes للبحث ثم values للكتابة. العائد/الأثر: Model محفوظة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 160:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$audit->record(...)`: احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. العائد/الأثر: void؛ الأثر row جديدة في AdminAuditLog.؛ `$request->user(...)`: الإدمن منفذ العملية إن لم يتم حذفه. مدخلاتها: user_id nullable. العائد/الأثر: BelongsTo.؛ `$request->validated(...)`: اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB. مدخلاتها: key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها. العائد/الأثر: array من validated input في الاستخدام الحالي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 161–168

```php
        return $this->settings();
    }

    public function audit(): JsonResponse
    {
        return response()->json(['logs' => AdminAuditLog::with('user:id,name,email')->latest('created_at')->limit(100)->get()]);
    }
}
```

**السطر 161:** return تعيد التعبير `$this->settings()` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 162:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 164:** Function / تعريف دالة `audit`؛ تعريفها مش تشغيلها. هات آخر 100 عملية إدارة مع بيانات المستخدم اللازمة فقط. مدخلاتها: لا شيء. ناتجها: JSON logs مع user id/name/email.

**السطر 165:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 166:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 167:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 168:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
