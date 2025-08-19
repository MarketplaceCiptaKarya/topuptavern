<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Game::create([
            'logo_game' => 'https://bucket.example.com/pubg.png',
            'nama_game' => 'PUBG Mobile',
            'perusahaan_game' => 'Tencent',
        ]);

        Game::create([
            'logo_game' => 'https://bucket.example.com/ml.png',
            'nama_game' => 'Mobile Legends',
            'perusahaan_game' => 'Moonton',
        ]);

        Game::create([
            'logo_game' => 'https://bucket.example.com/valo.png',
            'nama_game' => 'Valorant',
            'perusahaan_game' => 'Riot Games',
        ]);
    }
}
