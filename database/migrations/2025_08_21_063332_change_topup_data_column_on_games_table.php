<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            // Change column from VARCHAR(255) to TEXT
            $table->text('topup_data')->change();
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            // Rollback to original (varchar 255)
            $table->string('topup_data', 255)->change();
        });
    }
};
