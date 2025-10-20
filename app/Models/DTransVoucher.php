<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DTransVoucher extends Model
{
    use HasFactory;

    protected $table = 'd_trans_vouchers';
    public $incrementing = false;
    public $timestamps = true;

    protected $fillable = [
        'd_trans_id',
        'voucher_id',
        'assigned_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
    ];

    public function detail()
    {
        return $this->belongsTo(DTrans::class, 'd_trans_id');
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }

    public function dTrans()
    {
        return $this->belongsTo(DTrans::class, 'd_trans_id');
    }
}
