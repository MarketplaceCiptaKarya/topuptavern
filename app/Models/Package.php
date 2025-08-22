<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use  SoftDeletes, HasUuids;

    protected $table = 'packages';

    protected $fillable = ['id', 'category_voucher_id', 'name', 'price', 'quantity'];

    public function categoryVoucher()
    {
        return $this->belongsTo(CategoryVoucher::class, 'category_voucher_id');
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class, 'package_id');
    }
}
