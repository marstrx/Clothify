<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');
        $cacheKey = $category ? "products_{$category}" : 'products_all';

        return Cache::remember($cacheKey, 3600, function () use ($category) {
            $query = Product::select([
                'id',
                'name',
                'category',
                'description',
                'price',
                'old_price',
                'image',
                'stock',
                'status',
                'rating'
            ]);

            if ($category) {
                $query->where('category', strtolower($category));
            }

            return $query->get();
        });
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'old_price' => 'nullable|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'status' => 'required|in:active,inactive',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/products', $imageName);
                $validatedData['image'] = 'storage/products/' . $imageName;
            }

            $product = Product::create($validatedData);
            
            // Clear all product caches
            Cache::forget('products_all');
            Cache::forget("products_{$product->category}");
            Cache::forget('featured_products');

            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create product'], 500);
        }
    }

    public function show($id)
    {
        return Cache::remember('product_' . $id, 3600, function () use ($id) {
            return Product::findOrFail($id);
        });
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            $oldCategory = $product->category;

            $validatedData = $request->validate([
                'name' => 'sometimes|string|max:255',
                'category' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'old_price' => 'nullable|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'status' => 'sometimes|in:active,inactive',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::delete(str_replace('storage/', 'public/', $product->image));
                }
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/products', $imageName);
                $validatedData['image'] = 'storage/products/' . $imageName;
            }

            $product->update($validatedData);

            // Clear all relevant caches
            Cache::forget('products_all');
            Cache::forget("products_{$oldCategory}");
            if (isset($validatedData['category']) && $validatedData['category'] !== $oldCategory) {
                Cache::forget("products_{$validatedData['category']}");
            }
            Cache::forget('featured_products');
            Cache::forget("product_{$id}");

            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update product'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            $category = $product->category;

            if ($product->image) {
                Storage::delete(str_replace('storage/', 'public/', $product->image));
            }

            $product->delete();

            // Clear all relevant caches
            Cache::forget('products_all');
            Cache::forget("products_{$category}");
            Cache::forget('featured_products');
            Cache::forget("product_{$id}");

            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete product'], 500);
        }
    }

    public function featured()
    {
        return Cache::remember('featured_products', 3600, function () {
            return Product::where('is_featured', true)
                         ->where('status', true)
                         ->select([
                             'id',
                             'name',
                             'category',
                             'description',
                             'old_price',
                             'price',
                             'image',
                             'stock',
                             'rating',
                             'features',
                             'is_featured',
                             'status'
                         ])
                         ->limit(8)
                         ->get();
        });
    }
}
