<?php

use App\Http\Middleware\adminCheckMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminController;
;

Route::middleware(['auth', adminCheckMiddleware::class])->group(function () {

Route::prefix('admin')->name('admin.')->group(function () {

   Route::resources([
 'users' =>UserController::class,
 'admins' =>AdminController::class,

   ]);
});

});