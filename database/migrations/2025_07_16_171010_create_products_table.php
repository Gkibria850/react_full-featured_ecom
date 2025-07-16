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

            $table->unsignedBigInteger('created_by_id');
            $table->unsignedBigInteger('edited_by_id');

            
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
