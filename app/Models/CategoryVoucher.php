<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryVoucher extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $table = 'category_voucher';

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
