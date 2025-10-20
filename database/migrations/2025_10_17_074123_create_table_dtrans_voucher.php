<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('d_trans_vouchers', function (Blueprint $table) {
            $table->uuid('d_trans_id');
            $table->uuid('voucher_id');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamps();

            $table->primary(['d_trans_id', 'voucher_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('d_trans_vouchers');
    }
};
