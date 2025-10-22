<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DTrans extends Model
{
    use SoftDeletes, HasUuids;

    protected $table = 'd_trans';

    protected $fillable = [
        'h_trans_id',
        'package_id',
        'qty',
        'unit_price',
        'subtotal',
    ];

    public function header()
    {
        return $this->belongsTo(HTrans::class, 'h_trans_id');
    }

    public function package()
    {
        return $this->belongsTo(Package::class, 'package_id');
    }

    public function vouchers()
    {
        return $this->belongsToMany(Voucher::class, 'd_trans_vouchers', 'd_trans_id', 'voucher_id')
            ->withTimestamps()
            ->withPivot('assigned_at');
    }

    public function hTrans()
    {
        return $this->belongsTo(HTrans::class, 'h_trans_id');
    }

    public function dTransVouchers()
    {
        return $this->hasMany(DTransVoucher::class, 'd_trans_id');
    }
}
