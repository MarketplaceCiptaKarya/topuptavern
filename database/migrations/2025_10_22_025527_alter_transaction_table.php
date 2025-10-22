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
        Schema::table('h_trans', function (Blueprint $table) {
            $table->timestamp('transaction_date')->after('id')->default(now());
            $table->dropColumn('payment_channel');
            $table->dropColumn('payment_ref');
            $table->text('payment_url')->after('external_id')->nullable();
            $table->text('payment_transaction_id')->after('payment_url')->nullable();
        });
        Schema::table('d_trans', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('delivered_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('h_trans', function (Blueprint $table) {
            $table->dropColumn('transaction_date');
            $table->string('payment_channel')->nullable();
            $table->string('payment_ref')->nullable();
            $table->dropColumn('payment_url');
            $table->dropColumn('payment_transaction_id');
        });

        Schema::table('d_trans', function (Blueprint $table) {
            $table->enum('status', ['WAITING', 'DELIVERED'])->default('WAITING');
            $table->timestamp('delivered_at')->nullable();
        });
    }
};
