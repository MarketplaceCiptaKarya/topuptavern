<?php

namespace Database\Seeders;

use App\Models\StaticWebsiteDatum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class StaticWebsiteDatumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $keys = [
            // 'about-us',
            'contact-us',
            // 'cookie-policy',
            // 'faq',
            // 'payments',
            'privacy-policy',
            // 'shipping',
            'terms-and-conditions',
        ];

        foreach ($keys as $key) {
            StaticWebsiteDatum::firstOrCreate([
                'key' => $key,
                'value' => File::get(base_path("resources/static/{$key}.html"))
            ]);
        }
    }
}
