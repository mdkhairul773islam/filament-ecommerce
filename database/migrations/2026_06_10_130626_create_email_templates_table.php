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
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'order_digital_product'
            $table->string('subject');
            $table->text('title')->nullable();
            $table->text('greeting')->nullable();
            $table->text('message')->nullable();
            $table->text('closing')->nullable();
            $table->json('metadata')->nullable(); // For additional dynamic fields
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_templates');
    }
};
