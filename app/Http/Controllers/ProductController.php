<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\FacebookCAPIService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $products = $query->paginate(12);
        $categories = Category::where('is_active', true)->get();

        $fbEventId = null;

        if (config('facebook.pixel_id')) {
            $capiService = app(FacebookCAPIService::class);
            $fbEventId = $capiService->generateEventId();

            if ($request->has('search') && $request->search) {
                $capiService->sendEvent('Search', $request, [
                    'search_string' => $request->search,
                    'content_type' => 'product',
                ], [], $fbEventId);
            } elseif ($request->has('category') && $request->category) {
                $capiService->sendEvent('ViewCategory', $request, [
                    'content_category' => $request->category,
                    'content_type' => 'product',
                ], [], $fbEventId);
            }
        }

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $request->category,
                'type' => $request->type,
                'search' => $request->search,
            ],
            'fbEventId' => $fbEventId,
            'fbEventType' => $request->has('search') && $request->search
                ? 'Search'
                : ($request->has('category') && $request->category ? 'ViewCategory' : null),
        ]);
    }

    public function show($slug)
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $fbEventId = null;

        if (config('facebook.pixel_id')) {
            $capiService = app(FacebookCAPIService::class);
            $fbEventId = $capiService->generateEventId();
            $capiService->sendEvent('ViewContent', request(), [
                'content_ids' => [(string) $product->id],
                'content_name' => $product->name,
                'content_type' => 'product',
                'value' => (float) $product->final_price,
                'currency' => 'BDT',
            ], [], $fbEventId);
        }

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'fbEventId' => $fbEventId,
        ]);
    }
}
