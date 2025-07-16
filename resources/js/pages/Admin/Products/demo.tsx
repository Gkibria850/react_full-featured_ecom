<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Basic details
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();

            // Pricing
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('original_price', 10, 2)->default(0);

            // Brand and Category
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();

            // Product Details
            $table->string('model')->nullable();
            $table->string('sku', 255)->nullable(); // ❗️ 2000 is unnecessary
            $table->string('barcode', 255)->nullable(); // ❗️ 2000 is unnecessary
            $table->string('status')->index(); // Consider enum if values are fixed
            $table->integer('quantity')->nullable(); // ✅ should be integer, not string

            // Ratings
            $table->decimal('rating', 2, 1)->default(4);
            $table->integer('review_count')->default(50);

            // JSON Feature Sections
            $table->json('features')->nullable();
            $table->json('new_arrival')->nullable(); // ❗ corrected from `newArrivel`
            $table->json('popular')->nullable();
            $table->json('on_sale')->nullable();     // ❗ corrected
            $table->json('best_sale')->nullable();   // ❗ corrected
            $table->json('colors')->nullable();
            $table->json('sizes')->nullable();

            // Media
            $table->string('image')->nullable();
            $table->json('images')->nullable();

            // Flags
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_on_sale')->default(false);     // ❗ corrected
            $table->boolean('is_best_sale')->default(false);   // ❗ corrected
            $table->boolean('is_new_arrival')->default(false); // ❗ corrected
            $table->boolean('in_stock')->default(true);

            $table->timestamps();
             });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
