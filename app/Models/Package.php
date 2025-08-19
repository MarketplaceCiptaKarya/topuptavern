<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $table = 'package';

    protected $fillable = ['id', 'category_voucher_id', 'nama', 'harga', 'jumlah'];

    public function categoryVoucher()
    {
        return $this->belongsTo(CategoryVoucher::class, 'category_voucher_id');
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class, 'package_id');
    }
}
