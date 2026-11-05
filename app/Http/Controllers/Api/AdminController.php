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
