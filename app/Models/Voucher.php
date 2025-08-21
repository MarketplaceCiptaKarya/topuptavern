<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use  SoftDeletes, HasUuids;

    protected $table = 'vouchers';

    protected $fillable = ['id', 'package_id', 'voucher_code', 'used_at'];

    protected $casts = [
        'voucher_code' => 'encrypted'
    ];

    public function package()
    {
        return $this->belongsTo(Package::class, 'package_id');
    }
}
