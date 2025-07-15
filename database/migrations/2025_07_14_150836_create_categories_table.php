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
      Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->string('description')->nullable();
            $table->string('des_short')->nullable();

            // Enum for status (0 = active, 1 = deactive)
            $table->enum('status', ['0', '1'])->default('0'); // '0' for active, '1' for deactive

            $table->unsignedBigInteger('created_by_id');
            $table->unsignedBigInteger('edited_by_id');

            // Self-referencing foreign key
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
