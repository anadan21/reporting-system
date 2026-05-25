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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('ticket')->unique()->nullable();
            $table->string('reporter_name');
            $table->string('reporter_email');
            $table->string('reporter_phone')->nullable();
            
            // 🛠️ WAJIB ADA: Kolom penampung struktur baru Anda
            $table->string('unit_business'); 
            $table->string('division_name');
            $table->string('unit_location'); 
            
            $table->string('title');
            $table->text('description');
            $table->string('attachment_path')->nullable(); // Tetap menggunakan nama yang Anda sukai
            $table->string('status')->default('open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
