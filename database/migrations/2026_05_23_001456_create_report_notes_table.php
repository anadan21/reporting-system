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
        Schema::create('report_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained()->cascadeOnDelete();
            
            // Mengarahkan foreign key admin_id ke tabel users dengan aman
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            
            $table->text('note');
            
            // 🛠️ PERBAIKAN: Mengganti created_at manual dengan timestamps bawaan Laravel
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_notes');
    }
};
