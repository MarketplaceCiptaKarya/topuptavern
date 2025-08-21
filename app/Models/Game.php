<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Game extends Model
{
    use HasFactory, SoftDeletes, HasUuid;
    protected $table = 'games';

    protected $fillable = [
        'id',
        'logo',
        'name',
        'company',
        'how_to',
        'topup_data',
        'slug'
    ];

    protected $casts = [
        'topup_data' => 'array',
    ];

    public function categoryVoucher()
    {
        return $this->hasMany(CategoryVoucher::class, 'game_id');
    }
}
