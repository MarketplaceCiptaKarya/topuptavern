<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    use SoftDeletes, HasUuids;

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
