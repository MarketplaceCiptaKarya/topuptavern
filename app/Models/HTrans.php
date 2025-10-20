<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class HTrans extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $table = 'h_trans';

    protected $fillable = [
        'id',
        'user_id',
        'external_id',
        'payment_ref',
        'total_amount',
        'status',
        'payment_channel',
        'customer_name',
        'customer_email',
        'customer_address',
        'topup_data',
    ];

    protected $casts = [
        'topup_data' => 'array', // 👈 JSON column cast to array
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
