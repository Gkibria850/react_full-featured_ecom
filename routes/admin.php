<?php

use App\Http\Middleware\adminCheckMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Models\Category;

;

Route::middleware(['auth', adminCheckMiddleware::class])->group(function () {

Route::prefix('admin')->name('admin.')->group(function () {

   Route::resources([
 'users' =>UserController::class,
 'admins' =>AdminController::class,
 'categories' =>CategoryController::class,
 'brands' =>BrandController::class,

   ]);
});

});