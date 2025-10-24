<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HTrans extends Model
{
    use SoftDeletes, HasUuids;

    protected $table = 'h_trans';

    protected $fillable = [
        'external_id',
        'total_amount',
        'status',
        'customer_name',
        'customer_email',
        'customer_address',
        'topup_data',
        'transaction_date',
        'payment_transaction_id',
        'payment_url'
    ];

    protected $casts = [
        'topup_data' => 'array',
    ];

    public function details()
    {
        return $this->hasMany(DTrans::class, 'h_trans_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function dTrans()
    {
        return $this->hasMany(DTrans::class, 'h_trans_id');
    }
}
