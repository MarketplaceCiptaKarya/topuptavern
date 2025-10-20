<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('d_trans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('h_trans_id');
            $table->uuid('package_id');
            $table->integer('qty')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->enum('status', ['WAITING', 'DELIVERED'])->default('WAITING');
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('d_trans');
    }
};
