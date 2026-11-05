<?php

namespace Tests\Feature;

use Database\Seeders\MenuCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MenuCatalogSeeder::class);
    }

    public function test_menu_returns_the_canonical_branches_and_complete_catalog(): void
    {
        $response = $this->getJson('/api/menu')->assertOk();

        $this->assertSame(
            ['The Drive', 'Golf Central', 'LakeHouse'],
            collect($response->json('branches'))->pluck('name')->all(),
        );
        $response->assertJsonPath('items.0.id', 1)
            ->assertJsonPath('items.0.name', 'Margherita Verace')
            ->assertJsonPath('items.0.tag', 'The Queen')
            ->assertJsonCount(3, 'items.0.branch_options');

        $diavola = collect($response->json('items'))->firstWhere('name', 'Diavola');
        $this->assertSame('/images/menu/diavola.webp', $diavola['image_path']);
    }

    public function test_drinks_are_seeded_and_every_item_has_branch_prices(): void
    {
        $payload = $this->getJson('/api/menu')->assertOk()->json();
        $drinks = collect($payload['items'])->where('category_slug', 'drinks');

        $this->assertGreaterThanOrEqual(5, $drinks->count());
        $this->assertTrue(collect($payload['items'])->every(
            fn (array $item) => count($item['branch_options']) === 3,
        ));
        $this->assertGreaterThanOrEqual(47, count($payload['items']));
        $this->assertNotNull(collect($payload['items'])->firstWhere('name', 'Panino Al Tartufo'));
        $this->assertNotNull(collect($payload['items'])->firstWhere('name', 'Ortolana'));
    }

    public function test_menu_items_are_returned_in_display_order(): void
    {
        $items = $this->getJson('/api/menu')->assertOk()->json('items');
        $pizzas = collect($items)->where('category_slug', 'pizzas')->values();

        $this->assertSame('Margherita Verace', $pizzas->first()['name']);
        $this->assertSame(range(1, 19), $pizzas->pluck('display_order')->all());
    }
}
