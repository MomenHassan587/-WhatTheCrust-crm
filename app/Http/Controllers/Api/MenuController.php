<?php

// app/Http/Controllers/Api/MenuController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        $items = MenuItem::query()
            ->where('is_active', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->with(['category', 'branches' => fn ($query) => $query->where('branches.is_active', true)->orderBy('branches.display_order')])
            ->orderBy('category_id')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->map(function (MenuItem $item) {
                return [
                    'id' => $item->id,
                    'category_id' => $item->category_id,
                    'category' => $item->category?->name,
                    'category_slug' => $item->category?->slug,
                    'name' => $item->name,
                    'description' => $item->description,
                    'image_path' => $item->image_path,
                    'tag' => $item->tag,
                    'display_order' => $item->display_order,
                    'branch_options' => $item->branches->map(fn (Branch $branch) => [
                        'branch_id' => $branch->id,
                        'price' => $branch->pivot->price,
                        'is_available' => (bool) $branch->pivot->is_available,
                    ])->values(),
                ];
            });

        return response()->json([
            'branches' => $branches,
            'categories' => $categories,
            'items' => $items,
        ]);
    }
}
