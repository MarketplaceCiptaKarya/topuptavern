<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('h_trans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('external_id')->unique();
            $table->string('payment_ref')->nullable();
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->enum('status', ['PENDING', 'PAID', 'FAILED', 'EXPIRED'])->default('PENDING');
            $table->string('payment_channel')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_address')->nullable();
            $table->text('topup_data')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('h_trans');
    }
};
