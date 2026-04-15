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
        Schema::table('products', function (Blueprint $table) {
            $table->longText('specification')->nullable();
            $table->longText('author_details')->nullable();
            $table->string('look_inside_type')->nullable(); // 'pdf', 'image', 'text'
            $table->string('look_inside_pdf')->nullable();
            $table->json('look_inside_images')->nullable();
            $table->longText('look_inside_text')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'specification',
                'author_details',
                'look_inside_type',
                'look_inside_pdf',
                'look_inside_images',
                'look_inside_text',
            ]);
        });
    }
};
