<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryVoucher extends Model
{
    use SoftDeletes, HasUuids;

    protected $table = 'category_vouchers';

    protected $fillable = ['id', 'game_id', 'name'];

    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id');
    }

    public function packages()
    {
        return $this->hasMany(Package::class, 'category_voucher_id');
    }
}
