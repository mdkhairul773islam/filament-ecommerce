<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $sliders = Slider::where('is_active', true)->latest()->get();

        $featuredProducts = Product::with('category')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->take(8)
            ->get();

        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Home', [
            'sliders' => $sliders,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
