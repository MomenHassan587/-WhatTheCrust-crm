<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('branches')->upsert([
            ['id' => 1, 'name' => 'The Drive', 'location' => 'The Drive by Waterway, New Cairo', 'phone' => '+2 0101 599 6039', 'opening_hours' => '4 PM - 2 AM', 'display_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Golf Central', 'location' => 'Golf Central, Palm Hills, 6th of October', 'phone' => null, 'opening_hours' => null, 'display_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'LakeHouse', 'location' => 'LakeHouse The Club, Dusit Thani, New Cairo', 'phone' => '+2 0103 314 4388', 'opening_hours' => '12 PM - 12 AM', 'display_order' => 3, 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'location', 'phone', 'opening_hours', 'display_order', 'updated_at']);

        DB::table('categories')->upsert([
            ['id' => 1, 'name' => 'Pizzas', 'slug' => 'pizzas', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Sandwiches', 'slug' => 'sandwiches', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'Drinks', 'slug' => 'drinks', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'name' => 'Dips', 'slug' => 'dips', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'name' => 'Desserts', 'slug' => 'desserts', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'name' => 'Starters', 'slug' => 'starters', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 7, 'name' => 'Salads', 'slug' => 'salads', 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'slug', 'updated_at']);

        $items = [
            [1, 1, 'Margherita Verace', 'Italian tomatoes, fresh mozzarella, fresh basil, parmesan, and extra virgin olive oil.', 425, null, 'The Queen'],
            [2, 1, 'Diavola', 'Italian tomatoes, fresh mozzarella, salami, dried chili, basil, parmesan, and olive oil.', 470, '/images/menu/diavola.webp', 'The Devil\'s Pie'],
            [3, 1, 'Quattro Formaggi', 'Fresh mozzarella, smoked mozzarella, gorgonzola, parmesan, basil, and olive oil.', 500, '/images/menu/quattro-formaggi.webp', 'Cheese Lover'],
            [4, 1, 'Al Pesto', 'Homemade pesto, fresh mozzarella, sundried tomatoes, basil, and parmesan.', 580, '/images/menu/al-pesto.webp', 'The Green One'],
            [5, 1, 'Carnivora', 'Italian tomatoes, mozzarella, salami, Italian sausage, bresaola, parmesan, and basil.', 555, '/images/menu/carnivora.webp', 'Meat Lover'],
            [6, 1, 'La Sbagliata', 'Homemade pesto, fresh mozzarella, Italian tomatoes, parmesan, and basil.', 560, '/images/menu/la-sbagliata.webp', 'Upside Down'],
            [7, 1, 'Capricciosa', 'Italian tomatoes, mozzarella, mushrooms, salami, artichokes, basil, and parmesan.', 525, '/images/menu/capricciosa.webp', 'The Wild One'],
            [8, 1, 'La Tartufata', 'Truffle cream, fresh mozzarella, mushrooms, parmesan, basil, and olive oil.', 595, null, 'Truffle Lover'],
            [31, 1, 'Marinara Estiva', 'Cherry tomatoes, parmesan, fresh basil, and extra virgin olive oil.', 300, null, 'Summery Sailor'],
            [32, 1, 'Margherita Estiva', 'Cherry tomatoes, fresh mozzarella, parmesan, basil, and extra virgin olive oil.', 450, null, 'Summery Queen'],
            [33, 1, 'Marinara', 'Italian tomatoes, oregano, garlic, and extra virgin olive oil.', 275, null, 'Sailor\'s Pie'],
            [34, 1, 'Scarpariello', 'Italian tomatoes, sundried tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.', 330, null, 'Shoemaker\'s Pie'],
            [35, 1, 'Cosacca', 'Italian tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.', 315, null, 'King\'s Pie'],
            [36, 1, 'Ai Funghi', 'Italian tomatoes, fresh mozzarella, mushrooms, basil, parmesan, and olive oil.', 480, null, 'Mushroom Pie'],
            [37, 1, 'Romana', 'Italian tomatoes, fresh mozzarella, anchovies, Kalamata olives, basil, parmesan, and olive oil.', 450, null, 'Roman Pie'],
            [38, 1, 'Ripieno', 'Fresh mozzarella, salami, mushrooms, Italian tomatoes, basil, parmesan, and olive oil.', 490, null, 'Calzone'],
            [39, 1, 'Tonno E Cipolla', 'Italian tomatoes, mozzarella, tuna, red onion, Kalamata olives, parmesan, and basil.', 575, null, 'Tuna Pie'],
            [40, 1, 'Canadian All-Dressed', 'Italian tomatoes, mozzarella, mushrooms, salami, red onions, peppers, parmesan, and basil.', 510, null, 'Loaded'],
            [41, 1, 'Ortolana', 'Italian tomatoes, mozzarella, zucchini, aubergine, peppers, parmesan, and basil.', 450, null, 'Vegetarian'],
            [9, 2, 'Panuozzo Al Tonno', 'Italian tomatoes, mozzarella, tuna, red onion, olives, parmesan, basil, and lemon sauce.', 320, null, 'Cold Sandwich'],
            [10, 2, 'Panuozzo Al Roast Beef', 'Roast beef, fresh tomatoes, mozzarella, basil, and creamy pesto.', 310, null, 'Cold Sandwich'],
            [11, 2, 'Panuozzo Alla Caprese', 'Italian tomatoes, fresh mozzarella, basil, parmesan, and olive oil.', 240, null, 'Cold Sandwich'],
            [12, 2, 'Panuozzo Al Duck Bacon', 'Duck bacon, mozzarella, mixed leaves, red onion, pesto Caesar sauce, and lemon zest.', 285, null, 'Cold Sandwich'],
            [42, 2, 'Rotolo Al Salami', 'Tomato sauce, mozzarella, mushrooms, salami, pickled onions, basil, parmesan, and arugula.', 255, null, 'Hot Sandwich'],
            [43, 2, 'Rotolo Al Pesto', 'Pesto, mozzarella, sundried tomatoes, basil, parmesan, arugula, balsamic, and almonds.', 275, null, 'Hot Sandwich'],
            [44, 2, 'Panino Al Roast Beef', 'Roast beef, salami spread, mozzarella, artichokes, sundried tomatoes, arugula, and pesto.', 345, null, 'Hot Sandwich'],
            [45, 2, 'Panino Al Tartufo', 'Truffle cream, mozzarella, mushrooms, peppers, zucchini, aubergine, and parmesan.', 250, null, 'Hot Sandwich'],
            [13, 4, 'Marinara Dip', 'Marinara sauce for dipping.', 60, '/images/menu/marinara-dip.webp', 'Crust Dip'],
            [14, 4, 'Creamy Pesto Crust Dippers', 'Crust pieces served with a creamy pesto dip.', 80, '/images/menu/pesto-dip.webp', 'Crust Dip'],
            [15, 4, 'Creamy Truffle', 'A creamy sauce infused with truffle.', 110, null, 'Crust Dip'],
            [16, 5, 'Impasto Al Cacao', 'Cocoa dough with chocolate hazelnut spread, nuts, whipped cream, and sugar.', 385, '/images/menu/impasto-al-cacao.webp', 'House Special'],
            [17, 5, 'Ripieno Al Gianduia', 'Folded sweet dough filled with chocolate hazelnut cream and dusted with sugar.', 295, '/images/menu/ripieno-al-gianduia.webp', 'Nutella Calzone'],
            [18, 5, 'Tiramisu', 'House tiramisu served with a special creamy sauce.', 210, '/images/menu/tiramisu.webp', 'Italian'],
            [19, 3, 'Water', 'Mineral water.', 20, null, 'Cold'],
            [20, 3, 'Sodas', 'Assorted carbonated soft drinks.', 30, null, 'Cold'],
            [21, 3, 'Lemonade', 'A refreshing drink made with fresh lemons.', 115, null, 'Fresh'],
            [22, 3, 'Iced Tea', 'Chilled brewed tea.', 110, '/images/menu/iced-tea.webp', 'Cold'],
            [23, 3, 'Red Bull', 'Energy drink with caffeine, taurine, and B-group vitamins.', 75, null, 'Energy'],
            [24, 6, 'Garlic Bread', 'Aromatic garlic butter on pizza dough.', 250, '/images/menu/garlic-bread.webp', 'Shareable'],
            [25, 6, 'Mozzarella Sticks', 'Crispy mozzarella sticks served hot.', 145, '/images/menu/mozzarella-sticks.webp', 'Cheesy'],
            [30, 6, 'Montanarina', 'Fried pizza dough with sweet marinara and parmesan.', 225, '/images/menu/montanarina.webp', 'Neapolitan'],
            [47, 6, 'Truffled Crochette', 'Potato croquettes, truffle paste, and house truffle dip.', 260, null, 'Truffle'],
            [26, 7, 'Insalata Arrostita', 'Zucchini, peppers, aubergine, mushrooms, pesto, feta, herbs, and lemon vinaigrette.', 235, '/images/menu/insalata-arrostita.webp', 'Roasted'],
            [27, 7, 'Insalata Di Tonno', 'Mixed leaves, tuna, roasted peppers, pickled onions, tomatoes, olives, and lemon dressing.', 375, '/images/menu/insalata-di-tonno.webp', 'Protein'],
            [28, 7, 'Greek Salad', 'Mixed leaves, cucumber, peppers, onions, olives, tomatoes, crumbs, oregano, and Greek dressing.', 265, '/images/menu/greek-salad.webp', 'Fresh'],
            [29, 7, 'House Caesar', 'Romaine, cherry tomatoes, pesto Caesar dressing, parmesan, and pizza dough crumbs.', 340, '/images/menu/house-caesar.webp', 'House Pick'],
            [46, 7, 'Caprese De Buffala', 'Cherry tomatoes, buffalo mozzarella, basil, and balsamic glaze.', 295, null, 'Fresh'],
        ];

        DB::table('menu_items')->upsert(array_map(fn ($item, $index) => [
            'id' => $item[0], 'category_id' => $item[1], 'name' => $item[2],
            'description' => $item[3], 'image_path' => $item[5], 'tag' => $item[6],
            'display_order' => $index + 1, 'created_at' => $now, 'updated_at' => $now,
        ], $items, array_keys($items)), ['id'], ['category_id', 'name', 'description', 'image_path', 'tag', 'display_order', 'updated_at']);

        $multipliers = [1 => 1.00, 2 => 1.00, 3 => 1.00];
        $unavailable = [1 => [22], 2 => [8, 16], 3 => [9]];
        $rows = [];
        foreach ($multipliers as $branchId => $multiplier) {
            foreach ($items as $item) {
                $rows[] = [
                    'branch_id' => $branchId,
                    'menu_item_id' => $item[0],
                    'price' => round($item[4] * $multiplier, 2),
                    'is_available' => ! in_array($item[0], $unavailable[$branchId], true),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('branch_menu_item')->upsert($rows, ['branch_id', 'menu_item_id'], ['price', 'is_available', 'updated_at']);
    }
}
