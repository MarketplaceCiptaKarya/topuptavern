<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

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
