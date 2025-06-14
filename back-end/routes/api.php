<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Protected User Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/profile', [ProfileController::class, 'update']);
});

// Product Routes
Route::get("/products", [ProductController::class, "index"]);
Route::post("/products", [ProductController::class, "store"]);
Route::get("/products/{id}", [ProductController::class, "show"]);
Route::put("/products/{id}", [ProductController::class, "update"]);
Route::delete("/products/{id}", [ProductController::class, "destroy"]);
Route::get('/products/featured', [ProductController::class, 'featured']);

// Admin authentication routes
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->middleware('auth:sanctum');

// Admin protected routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/panel', function () {
        return response()->json(['message' => 'Welcome to admin panel']);
    });
});
