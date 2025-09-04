<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaticWebsiteDatum extends Model
{
    protected $table = 'static_website_data';
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'key',
        'value',
    ];

    public $timestamps = false;

    public static function getValueByKey(string $key): ?string
    {
        return self::where('key', $key)->value('value');
    }
}
