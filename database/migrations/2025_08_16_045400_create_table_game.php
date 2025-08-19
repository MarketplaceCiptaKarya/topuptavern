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
        Schema::create('games', function (Blueprint $table) {
            $table->uuid('id')->primary();  // UUID as primary key
            $table->string('logo_game');    // image URL stored in bucket
            $table->string('nama_game');    // game name
            $table->string('perusahaan_game'); // company
            $table->timestamps();           // created_at & updated_at
            $table->softDeletes();          // deleted_at for soft delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game');
    }
};
