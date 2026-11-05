# بذرة بيانات الديمو — 3 فروع و7 أقسام و47 منتج

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/demo/catalog.json` · 1427 سطر.

**وظيفة الملف:** JSON ثابت يتم استيراده لإنشاء نسخة بيانات محلية أول مرة. branch_options تحفظ سعر وتوفر المنتج لكل فرع. تغييره لا يغيّر نسخة سبق حفظها قبل reset؛ ليس قاعدة بيانات السيرفر.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/demo/catalog.json). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```json
{
    "branches": [
        {
            "id": 1,
            "name": "The Drive",
            "location": "The Drive by Waterway, New Cairo",
            "phone": "+2 0101 599 6039",
            "opening_hours": "4 PM - 2 AM",
            "delivery_fee": "25.00",
            "delivery_enabled": true,
            "is_active": true,
            "display_order": 1,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 2,
            "name": "Golf Central",
            "location": "Golf Central, Palm Hills, 6th of October",
            "phone": null,
            "opening_hours": null,
            "delivery_fee": "25.00",
            "delivery_enabled": true,
            "is_active": true,
            "display_order": 2,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 3,
            "name": "LakeHouse",
            "location": "LakeHouse The Club, Dusit Thani, New Cairo",
            "phone": "+2 0103 314 4388",
            "opening_hours": "12 PM - 12 AM",
            "delivery_fee": "25.00",
            "delivery_enabled": true,
            "is_active": true,
            "display_order": 3,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        }
    ],
    "categories": [
        {
            "id": 1,
            "name": "Pizzas",
            "slug": "pizzas",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 2,
            "name": "Sandwiches",
            "slug": "sandwiches",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 3,
            "name": "Drinks",
            "slug": "drinks",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 4,
            "name": "Dips",
            "slug": "dips",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 5,
            "name": "Desserts",
            "slug": "desserts",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 6,
            "name": "Starters",
            "slug": "starters",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-10-09T17:31:21.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 7,
            "name": "Salads",
            "slug": "salads",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-10-09T17:31:21.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        }
    ],
    "items": [
        {
            "id": 1,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Margherita Verace",
            "description": "Italian tomatoes, fresh mozzarella, fresh basil, parmesan, and extra virgin olive oil.",
            "image_path": null,
            "tag": "The Queen",
            "display_order": 1,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "425.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "425.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "425.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 2,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Diavola",
            "description": "Italian tomatoes, fresh mozzarella, salami, dried chili, basil, parmesan, and olive oil.",
            "image_path": "/images/menu/diavola.webp",
            "tag": "The Devil's Pie",
            "display_order": 2,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "470.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "470.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "470.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 3,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Quattro Formaggi",
            "description": "Fresh mozzarella, smoked mozzarella, gorgonzola, parmesan, basil, and olive oil.",
            "image_path": "/images/menu/quattro-formaggi.webp",
            "tag": "Cheese Lover",
            "display_order": 3,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "500.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "500.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "500.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 4,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Al Pesto",
            "description": "Homemade pesto, fresh mozzarella, sundried tomatoes, basil, and parmesan.",
            "image_path": "/images/menu/al-pesto.webp",
            "tag": "The Green One",
            "display_order": 4,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "580.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "580.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "580.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 5,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Carnivora",
            "description": "Italian tomatoes, mozzarella, salami, Italian sausage, bresaola, parmesan, and basil.",
            "image_path": "/images/menu/carnivora.webp",
            "tag": "Meat Lover",
            "display_order": 5,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "555.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "555.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "555.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 6,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "La Sbagliata",
            "description": "Homemade pesto, fresh mozzarella, Italian tomatoes, parmesan, and basil.",
            "image_path": "/images/menu/la-sbagliata.webp",
            "tag": "Upside Down",
            "display_order": 6,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "560.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "560.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "560.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 7,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Capricciosa",
            "description": "Italian tomatoes, mozzarella, mushrooms, salami, artichokes, basil, and parmesan.",
            "image_path": "/images/menu/capricciosa.webp",
            "tag": "The Wild One",
            "display_order": 7,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "525.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "525.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "525.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 8,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "La Tartufata",
            "description": "Truffle cream, fresh mozzarella, mushrooms, parmesan, basil, and olive oil.",
            "image_path": null,
            "tag": "Truffle Lover",
            "display_order": 8,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "595.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "595.00",
                    "is_available": false
                },
                {
                    "branch_id": 3,
                    "price": "595.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 31,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Marinara Estiva",
            "description": "Cherry tomatoes, parmesan, fresh basil, and extra virgin olive oil.",
            "image_path": null,
            "tag": "Summery Sailor",
            "display_order": 9,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "300.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "300.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "300.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 32,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Margherita Estiva",
            "description": "Cherry tomatoes, fresh mozzarella, parmesan, basil, and extra virgin olive oil.",
            "image_path": null,
            "tag": "Summery Queen",
            "display_order": 10,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "450.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 33,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Marinara",
            "description": "Italian tomatoes, oregano, garlic, and extra virgin olive oil.",
            "image_path": null,
            "tag": "Sailor's Pie",
            "display_order": 11,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "275.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "275.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "275.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 34,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Scarpariello",
            "description": "Italian tomatoes, sundried tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.",
            "image_path": null,
            "tag": "Shoemaker's Pie",
            "display_order": 12,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "330.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "330.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "330.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 35,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Cosacca",
            "description": "Italian tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.",
            "image_path": null,
            "tag": "King's Pie",
            "display_order": 13,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "315.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "315.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "315.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 36,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Ai Funghi",
            "description": "Italian tomatoes, fresh mozzarella, mushrooms, basil, parmesan, and olive oil.",
            "image_path": null,
            "tag": "Mushroom Pie",
            "display_order": 14,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "480.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "480.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "480.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 37,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Romana",
            "description": "Italian tomatoes, fresh mozzarella, anchovies, Kalamata olives, basil, parmesan, and olive oil.",
            "image_path": null,
            "tag": "Roman Pie",
            "display_order": 15,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "450.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 38,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Ripieno",
            "description": "Fresh mozzarella, salami, mushrooms, Italian tomatoes, basil, parmesan, and olive oil.",
            "image_path": null,
            "tag": "Calzone",
            "display_order": 16,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "490.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "490.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "490.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 39,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Tonno E Cipolla",
            "description": "Italian tomatoes, mozzarella, tuna, red onion, Kalamata olives, parmesan, and basil.",
            "image_path": null,
            "tag": "Tuna Pie",
            "display_order": 17,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "575.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "575.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "575.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 40,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Canadian All-Dressed",
            "description": "Italian tomatoes, mozzarella, mushrooms, salami, red onions, peppers, parmesan, and basil.",
            "image_path": null,
            "tag": "Loaded",
            "display_order": 18,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "510.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "510.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "510.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 41,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Ortolana",
            "description": "Italian tomatoes, mozzarella, zucchini, aubergine, peppers, parmesan, and basil.",
            "image_path": null,
            "tag": "Vegetarian",
            "display_order": 19,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "450.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 9,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panuozzo Al Tonno",
            "description": "Italian tomatoes, mozzarella, tuna, red onion, olives, parmesan, basil, and lemon sauce.",
            "image_path": null,
            "tag": "Cold Sandwich",
            "display_order": 20,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "320.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "320.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "320.00",
                    "is_available": false
                }
            ]
        },
        {
            "id": 10,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panuozzo Al Roast Beef",
            "description": "Roast beef, fresh tomatoes, mozzarella, basil, and creamy pesto.",
            "image_path": null,
            "tag": "Cold Sandwich",
            "display_order": 21,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "310.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "310.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "310.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 11,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panuozzo Alla Caprese",
            "description": "Italian tomatoes, fresh mozzarella, basil, parmesan, and olive oil.",
            "image_path": null,
            "tag": "Cold Sandwich",
            "display_order": 22,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "240.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "240.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "240.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 12,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panuozzo Al Duck Bacon",
            "description": "Duck bacon, mozzarella, mixed leaves, red onion, pesto Caesar sauce, and lemon zest.",
            "image_path": null,
            "tag": "Cold Sandwich",
            "display_order": 23,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "285.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "285.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "285.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 42,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Rotolo Al Salami",
            "description": "Tomato sauce, mozzarella, mushrooms, salami, pickled onions, basil, parmesan, and arugula.",
            "image_path": null,
            "tag": "Hot Sandwich",
            "display_order": 24,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "255.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "255.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "255.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 43,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Rotolo Al Pesto",
            "description": "Pesto, mozzarella, sundried tomatoes, basil, parmesan, arugula, balsamic, and almonds.",
            "image_path": null,
            "tag": "Hot Sandwich",
            "display_order": 25,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "275.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "275.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "275.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 44,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panino Al Roast Beef",
            "description": "Roast beef, salami spread, mozzarella, artichokes, sundried tomatoes, arugula, and pesto.",
            "image_path": null,
            "tag": "Hot Sandwich",
            "display_order": 26,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "345.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "345.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "345.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 45,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panino Al Tartufo",
            "description": "Truffle cream, mozzarella, mushrooms, peppers, zucchini, aubergine, and parmesan.",
            "image_path": null,
            "tag": "Hot Sandwich",
            "display_order": 27,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "250.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "250.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "250.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 19,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Water",
            "description": "Mineral water.",
            "image_path": null,
            "tag": "Cold",
            "display_order": 34,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "20.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "20.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "20.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 20,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Sodas",
            "description": "Assorted carbonated soft drinks.",
            "image_path": null,
            "tag": "Cold",
            "display_order": 35,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "30.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "30.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "30.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 21,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Lemonade",
            "description": "A refreshing drink made with fresh lemons.",
            "image_path": null,
            "tag": "Fresh",
            "display_order": 36,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "115.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "115.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "115.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 22,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Iced Tea",
            "description": "Chilled brewed tea.",
            "image_path": "/images/menu/iced-tea.webp",
            "tag": "Cold",
            "display_order": 37,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "110.00",
                    "is_available": false
                },
                {
                    "branch_id": 2,
                    "price": "110.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "110.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 23,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Red Bull",
            "description": "Energy drink with caffeine, taurine, and B-group vitamins.",
            "image_path": null,
            "tag": "Energy",
            "display_order": 38,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "75.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "75.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "75.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 13,
            "category_id": 4,
            "category": "Dips",
            "category_slug": "dips",
            "name": "Marinara Dip",
            "description": "Marinara sauce for dipping.",
            "image_path": "/images/menu/marinara-dip.webp",
            "tag": "Crust Dip",
            "display_order": 28,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "60.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "60.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "60.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 14,
            "category_id": 4,
            "category": "Dips",
            "category_slug": "dips",
            "name": "Creamy Pesto Crust Dippers",
            "description": "Crust pieces served with a creamy pesto dip.",
            "image_path": "/images/menu/pesto-dip.webp",
            "tag": "Crust Dip",
            "display_order": 29,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "80.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "80.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "80.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 15,
            "category_id": 4,
            "category": "Dips",
            "category_slug": "dips",
            "name": "Creamy Truffle",
            "description": "A creamy sauce infused with truffle.",
            "image_path": null,
            "tag": "Crust Dip",
            "display_order": 30,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "110.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "110.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "110.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 16,
            "category_id": 5,
            "category": "Desserts",
            "category_slug": "desserts",
            "name": "Impasto Al Cacao",
            "description": "Cocoa dough with chocolate hazelnut spread, nuts, whipped cream, and sugar.",
            "image_path": "/images/menu/impasto-al-cacao.webp",
            "tag": "House Special",
            "display_order": 31,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "385.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "385.00",
                    "is_available": false
                },
                {
                    "branch_id": 3,
                    "price": "385.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 17,
            "category_id": 5,
            "category": "Desserts",
            "category_slug": "desserts",
            "name": "Ripieno Al Gianduia",
            "description": "Folded sweet dough filled with chocolate hazelnut cream and dusted with sugar.",
            "image_path": "/images/menu/ripieno-al-gianduia.webp",
            "tag": "Nutella Calzone",
            "display_order": 32,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "295.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "295.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "295.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 18,
            "category_id": 5,
            "category": "Desserts",
            "category_slug": "desserts",
            "name": "Tiramisu",
            "description": "House tiramisu served with a special creamy sauce.",
            "image_path": "/images/menu/tiramisu.webp",
            "tag": "Italian",
            "display_order": 33,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "210.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "210.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "210.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 24,
            "category_id": 6,
            "category": "Starters",
            "category_slug": "starters",
            "name": "Garlic Bread",
            "description": "Aromatic garlic butter on pizza dough.",
            "image_path": "/images/menu/garlic-bread.webp",
            "tag": "Shareable",
            "display_order": 39,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "250.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "250.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "250.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 25,
            "category_id": 6,
            "category": "Starters",
            "category_slug": "starters",
            "name": "Mozzarella Sticks",
            "description": "Crispy mozzarella sticks served hot.",
            "image_path": "/images/menu/mozzarella-sticks.webp",
            "tag": "Cheesy",
            "display_order": 40,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "145.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "145.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "145.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 30,
            "category_id": 6,
            "category": "Starters",
            "category_slug": "starters",
            "name": "Montanarina",
            "description": "Fried pizza dough with sweet marinara and parmesan.",
            "image_path": "/images/menu/montanarina.webp",
            "tag": "Neapolitan",
            "display_order": 41,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "225.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "225.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "225.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 47,
            "category_id": 6,
            "category": "Starters",
            "category_slug": "starters",
            "name": "Truffled Crochette",
            "description": "Potato croquettes, truffle paste, and house truffle dip.",
            "image_path": null,
            "tag": "Truffle",
            "display_order": 42,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "260.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "260.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "260.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 26,
            "category_id": 7,
            "category": "Salads",
            "category_slug": "salads",
            "name": "Insalata Arrostita",
            "description": "Zucchini, peppers, aubergine, mushrooms, pesto, feta, herbs, and lemon vinaigrette.",
            "image_path": "/images/menu/insalata-arrostita.webp",
            "tag": "Roasted",
            "display_order": 43,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "235.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "235.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "235.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 27,
            "category_id": 7,
            "category": "Salads",
            "category_slug": "salads",
            "name": "Insalata Di Tonno",
            "description": "Mixed leaves, tuna, roasted peppers, pickled onions, tomatoes, olives, and lemon dressing.",
            "image_path": "/images/menu/insalata-di-tonno.webp",
            "tag": "Protein",
            "display_order": 44,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "375.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "375.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "375.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 28,
            "category_id": 7,
            "category": "Salads",
            "category_slug": "salads",
            "name": "Greek Salad",
            "description": "Mixed leaves, cucumber, peppers, onions, olives, tomatoes, crumbs, oregano, and Greek dressing.",
            "image_path": "/images/menu/greek-salad.webp",
            "tag": "Fresh",
            "display_order": 45,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "265.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "265.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "265.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 29,
            "category_id": 7,
            "category": "Salads",
            "category_slug": "salads",
            "name": "House Caesar",
            "description": "Romaine, cherry tomatoes, pesto Caesar dressing, parmesan, and pizza dough crumbs.",
            "image_path": "/images/menu/house-caesar.webp",
            "tag": "House Pick",
            "display_order": 46,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "340.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "340.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "340.00",
                    "is_available": true
                }
            ]
        },
        {
            "id": 46,
            "category_id": 7,
            "category": "Salads",
            "category_slug": "salads",
            "name": "Caprese De Buffala",
            "description": "Cherry tomatoes, buffalo mozzarella, basil, and balsamic glaze.",
            "image_path": null,
            "tag": "Fresh",
            "display_order": 47,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "295.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "295.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "295.00",
                    "is_available": true
                }
            ]
        }
    ]
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```json
{
    "branches": [
        {
            "id": 1,
            "name": "The Drive",
            "location": "The Drive by Waterway, New Cairo",
            "phone": "+2 0101 599 6039",
            "opening_hours": "4 PM - 2 AM",
```

**السطر 1:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 2:** `branches` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 3:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 4:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 5:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"The Drive",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 6:** `location` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"The Drive by Waterway, New Cairo",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 7:** `phone` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"+2 0101 599 6039",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 8:** `opening_hours` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"4 PM - 2 AM",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 9–16

```json
            "delivery_fee": "25.00",
            "delivery_enabled": true,
            "is_active": true,
            "display_order": 1,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
```

**السطر 9:** `delivery_fee` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"25.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 10:** `delivery_enabled` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 11:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 12:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 13:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 14:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 17–24

```json
            "id": 2,
            "name": "Golf Central",
            "location": "Golf Central, Palm Hills, 6th of October",
            "phone": null,
            "opening_hours": null,
            "delivery_fee": "25.00",
            "delivery_enabled": true,
            "is_active": true,
```

**السطر 17:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 18:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Golf Central",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 19:** `location` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Golf Central, Palm Hills, 6th of October",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 20:** `phone` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 21:** `opening_hours` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 22:** `delivery_fee` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"25.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 23:** `delivery_enabled` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 24:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 25–32

```json
            "display_order": 2,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 3,
            "name": "LakeHouse",
            "location": "LakeHouse The Club, Dusit Thani, New Cairo",
```

**السطر 25:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 26:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 27:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 29:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 30:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 31:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"LakeHouse",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 32:** `location` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"LakeHouse The Club, Dusit Thani, New Cairo",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 33–40

```json
            "phone": "+2 0103 314 4388",
            "opening_hours": "12 PM - 12 AM",
            "delivery_fee": "25.00",
            "delivery_enabled": true,
            "is_active": true,
            "display_order": 3,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
```

**السطر 33:** `phone` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"+2 0103 314 4388",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 34:** `opening_hours` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"12 PM - 12 AM",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 35:** `delivery_fee` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"25.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 36:** `delivery_enabled` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 37:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 38:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 39:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 40:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 41–48

```json
        }
    ],
    "categories": [
        {
            "id": 1,
            "name": "Pizzas",
            "slug": "pizzas",
            "display_order": 0,
```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** `categories` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 44:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 45:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 46:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 47:** `slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 48:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `0,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 49–56

```json
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 2,
            "name": "Sandwiches",
            "slug": "sandwiches",
```

**السطر 49:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 50:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 51:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 52:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 53:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 54:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 55:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 56:** `slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 57–64

```json
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 3,
            "name": "Drinks",
```

**السطر 57:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `0,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 58:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 59:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 60:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 61:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 62:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 63:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 64:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 65–72

```json
            "slug": "drinks",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
            "id": 4,
```

**السطر 65:** `slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 66:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `0,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 67:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 68:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 69:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 70:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 71:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 72:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `4,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 73–80

```json
            "name": "Dips",
            "slug": "dips",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
        {
```

**السطر 73:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 74:** `slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 75:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `0,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 76:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 77:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 78:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 79:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 80:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 81–88

```json
            "id": 5,
            "name": "Desserts",
            "slug": "desserts",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-09-28T13:28:34.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
        },
```

**السطر 81:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `5,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 82:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 83:** `slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 84:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `0,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 85:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 86:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-09-28T13:28:34.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 87:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 88:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 89–96

```json
        {
            "id": 6,
            "name": "Starters",
            "slug": "starters",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-10-09T17:31:21.000000Z",
            "updated_at": "2026-10-09T18:18:18.000000Z"
```

**السطر 89:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 90:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `6,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 91:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 92:** `slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 93:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `0,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 94:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 95:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T17:31:21.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 96:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 97–104

```json
        },
        {
            "id": 7,
            "name": "Salads",
            "slug": "salads",
            "display_order": 0,
            "is_active": true,
            "created_at": "2026-10-09T17:31:21.000000Z",
```

**السطر 97:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 98:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 99:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 100:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 101:** `slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 102:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `0,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 103:** `is_active` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 104:** `created_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T17:31:21.000000Z",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 105–112

```json
            "updated_at": "2026-10-09T18:18:18.000000Z"
        }
    ],
    "items": [
        {
            "id": 1,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 105:** `updated_at` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"2026-10-09T18:18:18.000000Z"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 106:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 107:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 108:** `items` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 109:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 110:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 111:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 112:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 113–120

```json
            "category_slug": "pizzas",
            "name": "Margherita Verace",
            "description": "Italian tomatoes, fresh mozzarella, fresh basil, parmesan, and extra virgin olive oil.",
            "image_path": null,
            "tag": "The Queen",
            "display_order": 1,
            "branch_options": [
                {
```

**السطر 113:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 114:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Margherita Verace",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 115:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, fresh mozzarella, fresh basil, parmesan, and extra virgin olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 116:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 117:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"The Queen",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 118:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 119:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 120:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 121–128

```json
                    "branch_id": 1,
                    "price": "425.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "425.00",
                    "is_available": true
```

**السطر 121:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 122:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"425.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 123:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 124:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 125:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 126:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 127:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"425.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 128:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 129–136

```json
                },
                {
                    "branch_id": 3,
                    "price": "425.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 129:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 130:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 131:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 132:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"425.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 133:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 134:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 135:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 136:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 137–144

```json
        {
            "id": 2,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Diavola",
            "description": "Italian tomatoes, fresh mozzarella, salami, dried chili, basil, parmesan, and olive oil.",
            "image_path": "/images/menu/diavola.webp",
```

**السطر 137:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 138:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 139:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 140:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 141:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 142:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Diavola",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 143:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, fresh mozzarella, salami, dried chili, basil, parmesan, and olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 144:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/diavola.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 145–152

```json
            "tag": "The Devil's Pie",
            "display_order": 2,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "470.00",
                    "is_available": true
                },
```

**السطر 145:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"The Devil's Pie",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 146:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 147:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 148:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 149:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 150:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"470.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 151:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 152:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 153–160

```json
                {
                    "branch_id": 2,
                    "price": "470.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "470.00",
```

**السطر 153:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 154:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 155:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"470.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 156:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 157:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 158:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 159:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 160:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"470.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 161–168

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 3,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 161:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 162:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 163:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 164:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 165:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 166:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 167:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 168:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 169–176

```json
            "category_slug": "pizzas",
            "name": "Quattro Formaggi",
            "description": "Fresh mozzarella, smoked mozzarella, gorgonzola, parmesan, basil, and olive oil.",
            "image_path": "/images/menu/quattro-formaggi.webp",
            "tag": "Cheese Lover",
            "display_order": 3,
            "branch_options": [
                {
```

**السطر 169:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 170:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Quattro Formaggi",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 171:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Fresh mozzarella, smoked mozzarella, gorgonzola, parmesan, basil, and olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 172:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/quattro-formaggi.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 173:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cheese Lover",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 174:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 175:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 176:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 177–184

```json
                    "branch_id": 1,
                    "price": "500.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "500.00",
                    "is_available": true
```

**السطر 177:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 178:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"500.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 179:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 180:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 181:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 182:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 183:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"500.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 184:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 185–192

```json
                },
                {
                    "branch_id": 3,
                    "price": "500.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 185:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 186:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 187:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 188:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"500.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 189:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 190:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 191:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 192:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 193–200

```json
        {
            "id": 4,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Al Pesto",
            "description": "Homemade pesto, fresh mozzarella, sundried tomatoes, basil, and parmesan.",
            "image_path": "/images/menu/al-pesto.webp",
```

**السطر 193:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 194:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `4,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 195:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 196:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 197:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 198:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Al Pesto",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 199:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Homemade pesto, fresh mozzarella, sundried tomatoes, basil, and parmesan.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 200:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/al-pesto.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 201–208

```json
            "tag": "The Green One",
            "display_order": 4,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "580.00",
                    "is_available": true
                },
```

**السطر 201:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"The Green One",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 202:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `4,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 203:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 204:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 205:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 206:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"580.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 207:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 208:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 209–216

```json
                {
                    "branch_id": 2,
                    "price": "580.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "580.00",
```

**السطر 209:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 210:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 211:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"580.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 212:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 213:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 214:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 215:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 216:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"580.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 217–224

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 5,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 217:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 218:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 219:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 220:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 221:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 222:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `5,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 223:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 224:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 225–232

```json
            "category_slug": "pizzas",
            "name": "Carnivora",
            "description": "Italian tomatoes, mozzarella, salami, Italian sausage, bresaola, parmesan, and basil.",
            "image_path": "/images/menu/carnivora.webp",
            "tag": "Meat Lover",
            "display_order": 5,
            "branch_options": [
                {
```

**السطر 225:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 226:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Carnivora",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 227:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, mozzarella, salami, Italian sausage, bresaola, parmesan, and basil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 228:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/carnivora.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 229:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Meat Lover",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 230:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `5,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 231:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 232:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 233–240

```json
                    "branch_id": 1,
                    "price": "555.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "555.00",
                    "is_available": true
```

**السطر 233:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 234:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"555.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 235:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 236:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 237:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 238:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 239:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"555.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 240:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 241–248

```json
                },
                {
                    "branch_id": 3,
                    "price": "555.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 241:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 242:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 243:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 244:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"555.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 245:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 246:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 247:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 248:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 249–256

```json
        {
            "id": 6,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "La Sbagliata",
            "description": "Homemade pesto, fresh mozzarella, Italian tomatoes, parmesan, and basil.",
            "image_path": "/images/menu/la-sbagliata.webp",
```

**السطر 249:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 250:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `6,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 251:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 252:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 253:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 254:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"La Sbagliata",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 255:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Homemade pesto, fresh mozzarella, Italian tomatoes, parmesan, and basil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 256:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/la-sbagliata.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 257–264

```json
            "tag": "Upside Down",
            "display_order": 6,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "560.00",
                    "is_available": true
                },
```

**السطر 257:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Upside Down",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 258:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `6,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 259:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 260:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 261:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 262:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"560.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 263:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 264:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 265–272

```json
                {
                    "branch_id": 2,
                    "price": "560.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "560.00",
```

**السطر 265:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 266:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 267:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"560.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 268:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 269:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 270:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 271:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 272:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"560.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 273–280

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 7,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 273:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 274:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 275:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 276:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 277:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 278:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 279:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 280:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 281–288

```json
            "category_slug": "pizzas",
            "name": "Capricciosa",
            "description": "Italian tomatoes, mozzarella, mushrooms, salami, artichokes, basil, and parmesan.",
            "image_path": "/images/menu/capricciosa.webp",
            "tag": "The Wild One",
            "display_order": 7,
            "branch_options": [
                {
```

**السطر 281:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 282:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Capricciosa",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 283:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, mozzarella, mushrooms, salami, artichokes, basil, and parmesan.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 284:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/capricciosa.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 285:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"The Wild One",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 286:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 287:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 288:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 289–296

```json
                    "branch_id": 1,
                    "price": "525.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "525.00",
                    "is_available": true
```

**السطر 289:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 290:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"525.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 291:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 292:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 293:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 294:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 295:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"525.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 296:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 297–304

```json
                },
                {
                    "branch_id": 3,
                    "price": "525.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 297:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 298:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 299:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 300:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"525.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 301:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 302:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 303:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 304:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 305–312

```json
        {
            "id": 8,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "La Tartufata",
            "description": "Truffle cream, fresh mozzarella, mushrooms, parmesan, basil, and olive oil.",
            "image_path": null,
```

**السطر 305:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 306:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `8,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 307:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 308:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 309:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 310:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"La Tartufata",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 311:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Truffle cream, fresh mozzarella, mushrooms, parmesan, basil, and olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 312:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 313–320

```json
            "tag": "Truffle Lover",
            "display_order": 8,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "595.00",
                    "is_available": true
                },
```

**السطر 313:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Truffle Lover",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 314:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `8,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 315:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 316:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 317:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 318:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"595.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 319:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 320:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 321–328

```json
                {
                    "branch_id": 2,
                    "price": "595.00",
                    "is_available": false
                },
                {
                    "branch_id": 3,
                    "price": "595.00",
```

**السطر 321:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 322:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 323:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"595.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 324:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `false`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 325:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 326:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 327:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 328:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"595.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 329–336

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 31,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 329:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 330:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 331:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 332:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 333:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 334:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `31,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 335:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 336:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 337–344

```json
            "category_slug": "pizzas",
            "name": "Marinara Estiva",
            "description": "Cherry tomatoes, parmesan, fresh basil, and extra virgin olive oil.",
            "image_path": null,
            "tag": "Summery Sailor",
            "display_order": 9,
            "branch_options": [
                {
```

**السطر 337:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 338:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Marinara Estiva",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 339:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cherry tomatoes, parmesan, fresh basil, and extra virgin olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 340:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 341:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Summery Sailor",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 342:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `9,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 343:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 344:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 345–352

```json
                    "branch_id": 1,
                    "price": "300.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "300.00",
                    "is_available": true
```

**السطر 345:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 346:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"300.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 347:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 348:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 349:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 350:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 351:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"300.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 352:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 353–360

```json
                },
                {
                    "branch_id": 3,
                    "price": "300.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 353:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 354:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 355:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 356:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"300.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 357:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 358:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 359:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 360:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 361–368

```json
        {
            "id": 32,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Margherita Estiva",
            "description": "Cherry tomatoes, fresh mozzarella, parmesan, basil, and extra virgin olive oil.",
            "image_path": null,
```

**السطر 361:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 362:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `32,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 363:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 364:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 365:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 366:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Margherita Estiva",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 367:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cherry tomatoes, fresh mozzarella, parmesan, basil, and extra virgin olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 368:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 369–376

```json
            "tag": "Summery Queen",
            "display_order": 10,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "450.00",
                    "is_available": true
                },
```

**السطر 369:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Summery Queen",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 370:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `10,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 371:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 372:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 373:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 374:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 375:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 376:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 377–384

```json
                {
                    "branch_id": 2,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "450.00",
```

**السطر 377:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 378:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 379:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 380:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 381:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 382:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 383:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 384:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 385–392

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 33,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 385:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 386:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 387:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 388:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 389:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 390:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `33,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 391:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 392:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 393–400

```json
            "category_slug": "pizzas",
            "name": "Marinara",
            "description": "Italian tomatoes, oregano, garlic, and extra virgin olive oil.",
            "image_path": null,
            "tag": "Sailor's Pie",
            "display_order": 11,
            "branch_options": [
                {
```

**السطر 393:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 394:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Marinara",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 395:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, oregano, garlic, and extra virgin olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 396:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 397:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sailor's Pie",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 398:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `11,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 399:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 400:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 401–408

```json
                    "branch_id": 1,
                    "price": "275.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "275.00",
                    "is_available": true
```

**السطر 401:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 402:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"275.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 403:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 404:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 405:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 406:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 407:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"275.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 408:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 409–416

```json
                },
                {
                    "branch_id": 3,
                    "price": "275.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 409:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 410:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 411:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 412:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"275.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 413:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 414:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 415:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 416:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 417–424

```json
        {
            "id": 34,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Scarpariello",
            "description": "Italian tomatoes, sundried tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.",
            "image_path": null,
```

**السطر 417:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 418:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `34,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 419:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 420:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 421:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 422:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Scarpariello",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 423:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, sundried tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 424:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 425–432

```json
            "tag": "Shoemaker's Pie",
            "display_order": 12,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "330.00",
                    "is_available": true
                },
```

**السطر 425:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Shoemaker's Pie",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 426:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `12,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 427:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 428:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 429:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 430:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"330.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 431:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 432:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 433–440

```json
                {
                    "branch_id": 2,
                    "price": "330.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "330.00",
```

**السطر 433:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 434:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 435:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"330.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 436:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 437:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 438:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 439:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 440:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"330.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 441–448

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 35,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 441:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 442:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 443:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 444:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 445:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 446:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `35,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 447:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 448:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 449–456

```json
            "category_slug": "pizzas",
            "name": "Cosacca",
            "description": "Italian tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.",
            "image_path": null,
            "tag": "King's Pie",
            "display_order": 13,
            "branch_options": [
                {
```

**السطر 449:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 450:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cosacca",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 451:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 452:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 453:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"King's Pie",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 454:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `13,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 455:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 456:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 457–464

```json
                    "branch_id": 1,
                    "price": "315.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "315.00",
                    "is_available": true
```

**السطر 457:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 458:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"315.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 459:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 460:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 461:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 462:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 463:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"315.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 464:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 465–472

```json
                },
                {
                    "branch_id": 3,
                    "price": "315.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 465:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 466:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 467:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 468:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"315.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 469:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 470:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 471:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 472:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 473–480

```json
        {
            "id": 36,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Ai Funghi",
            "description": "Italian tomatoes, fresh mozzarella, mushrooms, basil, parmesan, and olive oil.",
            "image_path": null,
```

**السطر 473:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 474:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `36,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 475:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 476:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 477:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 478:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Ai Funghi",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 479:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, fresh mozzarella, mushrooms, basil, parmesan, and olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 480:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 481–488

```json
            "tag": "Mushroom Pie",
            "display_order": 14,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "480.00",
                    "is_available": true
                },
```

**السطر 481:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Mushroom Pie",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 482:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `14,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 483:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 484:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 485:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 486:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"480.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 487:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 488:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 489–496

```json
                {
                    "branch_id": 2,
                    "price": "480.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "480.00",
```

**السطر 489:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 490:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 491:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"480.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 492:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 493:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 494:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 495:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 496:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"480.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 497–504

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 37,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 497:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 498:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 499:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 500:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 501:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 502:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `37,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 503:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 504:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 505–512

```json
            "category_slug": "pizzas",
            "name": "Romana",
            "description": "Italian tomatoes, fresh mozzarella, anchovies, Kalamata olives, basil, parmesan, and olive oil.",
            "image_path": null,
            "tag": "Roman Pie",
            "display_order": 15,
            "branch_options": [
                {
```

**السطر 505:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 506:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Romana",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 507:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, fresh mozzarella, anchovies, Kalamata olives, basil, parmesan, and olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 508:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 509:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Roman Pie",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 510:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `15,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 511:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 512:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 513–520

```json
                    "branch_id": 1,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "450.00",
                    "is_available": true
```

**السطر 513:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 514:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 515:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 516:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 517:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 518:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 519:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 520:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 521–528

```json
                },
                {
                    "branch_id": 3,
                    "price": "450.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 521:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 522:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 523:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 524:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 525:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 526:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 527:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 528:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 529–536

```json
        {
            "id": 38,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Ripieno",
            "description": "Fresh mozzarella, salami, mushrooms, Italian tomatoes, basil, parmesan, and olive oil.",
            "image_path": null,
```

**السطر 529:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 530:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `38,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 531:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 532:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 533:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 534:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Ripieno",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 535:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Fresh mozzarella, salami, mushrooms, Italian tomatoes, basil, parmesan, and olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 536:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 537–544

```json
            "tag": "Calzone",
            "display_order": 16,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "490.00",
                    "is_available": true
                },
```

**السطر 537:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Calzone",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 538:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `16,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 539:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 540:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 541:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 542:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"490.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 543:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 544:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 545–552

```json
                {
                    "branch_id": 2,
                    "price": "490.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "490.00",
```

**السطر 545:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 546:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 547:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"490.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 548:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 549:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 550:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 551:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 552:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"490.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 553–560

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 39,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 553:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 554:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 555:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 556:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 557:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 558:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `39,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 559:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 560:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 561–568

```json
            "category_slug": "pizzas",
            "name": "Tonno E Cipolla",
            "description": "Italian tomatoes, mozzarella, tuna, red onion, Kalamata olives, parmesan, and basil.",
            "image_path": null,
            "tag": "Tuna Pie",
            "display_order": 17,
            "branch_options": [
                {
```

**السطر 561:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 562:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Tonno E Cipolla",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 563:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, mozzarella, tuna, red onion, Kalamata olives, parmesan, and basil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 564:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 565:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Tuna Pie",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 566:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `17,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 567:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 568:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 569–576

```json
                    "branch_id": 1,
                    "price": "575.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "575.00",
                    "is_available": true
```

**السطر 569:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 570:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"575.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 571:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 572:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 573:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 574:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 575:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"575.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 576:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 577–584

```json
                },
                {
                    "branch_id": 3,
                    "price": "575.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 577:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 578:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 579:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 580:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"575.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 581:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 582:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 583:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 584:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 585–592

```json
        {
            "id": 40,
            "category_id": 1,
            "category": "Pizzas",
            "category_slug": "pizzas",
            "name": "Canadian All-Dressed",
            "description": "Italian tomatoes, mozzarella, mushrooms, salami, red onions, peppers, parmesan, and basil.",
            "image_path": null,
```

**السطر 585:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 586:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `40,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 587:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 588:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 589:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 590:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Canadian All-Dressed",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 591:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, mozzarella, mushrooms, salami, red onions, peppers, parmesan, and basil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 592:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 593–600

```json
            "tag": "Loaded",
            "display_order": 18,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "510.00",
                    "is_available": true
                },
```

**السطر 593:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Loaded",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 594:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `18,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 595:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 596:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 597:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 598:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"510.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 599:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 600:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 601–608

```json
                {
                    "branch_id": 2,
                    "price": "510.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "510.00",
```

**السطر 601:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 602:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 603:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"510.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 604:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 605:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 606:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 607:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 608:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"510.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 609–616

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 41,
            "category_id": 1,
            "category": "Pizzas",
```

**السطر 609:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 610:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 611:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 612:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 613:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 614:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `41,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 615:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 616:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 617–624

```json
            "category_slug": "pizzas",
            "name": "Ortolana",
            "description": "Italian tomatoes, mozzarella, zucchini, aubergine, peppers, parmesan, and basil.",
            "image_path": null,
            "tag": "Vegetarian",
            "display_order": 19,
            "branch_options": [
                {
```

**السطر 617:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"pizzas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 618:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Ortolana",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 619:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, mozzarella, zucchini, aubergine, peppers, parmesan, and basil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 620:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 621:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Vegetarian",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 622:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `19,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 623:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 624:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 625–632

```json
                    "branch_id": 1,
                    "price": "450.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "450.00",
                    "is_available": true
```

**السطر 625:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 626:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 627:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 628:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 629:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 630:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 631:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 632:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 633–640

```json
                },
                {
                    "branch_id": 3,
                    "price": "450.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 633:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 634:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 635:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 636:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"450.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 637:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 638:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 639:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 640:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 641–648

```json
        {
            "id": 9,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panuozzo Al Tonno",
            "description": "Italian tomatoes, mozzarella, tuna, red onion, olives, parmesan, basil, and lemon sauce.",
            "image_path": null,
```

**السطر 641:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 642:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `9,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 643:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 644:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 645:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 646:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Panuozzo Al Tonno",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 647:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, mozzarella, tuna, red onion, olives, parmesan, basil, and lemon sauce.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 648:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 649–656

```json
            "tag": "Cold Sandwich",
            "display_order": 20,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "320.00",
                    "is_available": true
                },
```

**السطر 649:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cold Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 650:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `20,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 651:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 652:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 653:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 654:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"320.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 655:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 656:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 657–664

```json
                {
                    "branch_id": 2,
                    "price": "320.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "320.00",
```

**السطر 657:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 658:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 659:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"320.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 660:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 661:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 662:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 663:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 664:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"320.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 665–672

```json
                    "is_available": false
                }
            ]
        },
        {
            "id": 10,
            "category_id": 2,
            "category": "Sandwiches",
```

**السطر 665:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `false`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 666:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 667:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 668:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 669:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 670:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `10,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 671:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 672:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 673–680

```json
            "category_slug": "sandwiches",
            "name": "Panuozzo Al Roast Beef",
            "description": "Roast beef, fresh tomatoes, mozzarella, basil, and creamy pesto.",
            "image_path": null,
            "tag": "Cold Sandwich",
            "display_order": 21,
            "branch_options": [
                {
```

**السطر 673:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 674:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Panuozzo Al Roast Beef",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 675:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Roast beef, fresh tomatoes, mozzarella, basil, and creamy pesto.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 676:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 677:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cold Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 678:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `21,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 679:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 680:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 681–688

```json
                    "branch_id": 1,
                    "price": "310.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "310.00",
                    "is_available": true
```

**السطر 681:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 682:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"310.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 683:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 684:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 685:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 686:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 687:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"310.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 688:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 689–696

```json
                },
                {
                    "branch_id": 3,
                    "price": "310.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 689:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 690:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 691:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 692:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"310.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 693:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 694:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 695:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 696:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 697–704

```json
        {
            "id": 11,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panuozzo Alla Caprese",
            "description": "Italian tomatoes, fresh mozzarella, basil, parmesan, and olive oil.",
            "image_path": null,
```

**السطر 697:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 698:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `11,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 699:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 700:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 701:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 702:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Panuozzo Alla Caprese",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 703:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian tomatoes, fresh mozzarella, basil, parmesan, and olive oil.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 704:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 705–712

```json
            "tag": "Cold Sandwich",
            "display_order": 22,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "240.00",
                    "is_available": true
                },
```

**السطر 705:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cold Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 706:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `22,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 707:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 708:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 709:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 710:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"240.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 711:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 712:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 713–720

```json
                {
                    "branch_id": 2,
                    "price": "240.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "240.00",
```

**السطر 713:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 714:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 715:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"240.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 716:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 717:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 718:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 719:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 720:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"240.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 721–728

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 12,
            "category_id": 2,
            "category": "Sandwiches",
```

**السطر 721:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 722:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 723:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 724:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 725:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 726:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `12,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 727:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 728:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 729–736

```json
            "category_slug": "sandwiches",
            "name": "Panuozzo Al Duck Bacon",
            "description": "Duck bacon, mozzarella, mixed leaves, red onion, pesto Caesar sauce, and lemon zest.",
            "image_path": null,
            "tag": "Cold Sandwich",
            "display_order": 23,
            "branch_options": [
                {
```

**السطر 729:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 730:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Panuozzo Al Duck Bacon",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 731:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Duck bacon, mozzarella, mixed leaves, red onion, pesto Caesar sauce, and lemon zest.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 732:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 733:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cold Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 734:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `23,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 735:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 736:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 737–744

```json
                    "branch_id": 1,
                    "price": "285.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "285.00",
                    "is_available": true
```

**السطر 737:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 738:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"285.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 739:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 740:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 741:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 742:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 743:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"285.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 744:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 745–752

```json
                },
                {
                    "branch_id": 3,
                    "price": "285.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 745:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 746:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 747:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 748:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"285.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 749:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 750:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 751:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 752:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 753–760

```json
        {
            "id": 42,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Rotolo Al Salami",
            "description": "Tomato sauce, mozzarella, mushrooms, salami, pickled onions, basil, parmesan, and arugula.",
            "image_path": null,
```

**السطر 753:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 754:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `42,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 755:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 756:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 757:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 758:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Rotolo Al Salami",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 759:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Tomato sauce, mozzarella, mushrooms, salami, pickled onions, basil, parmesan, and arugula.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 760:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 761–768

```json
            "tag": "Hot Sandwich",
            "display_order": 24,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "255.00",
                    "is_available": true
                },
```

**السطر 761:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Hot Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 762:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `24,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 763:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 764:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 765:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 766:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"255.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 767:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 768:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 769–776

```json
                {
                    "branch_id": 2,
                    "price": "255.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "255.00",
```

**السطر 769:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 770:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 771:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"255.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 772:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 773:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 774:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 775:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 776:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"255.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 777–784

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 43,
            "category_id": 2,
            "category": "Sandwiches",
```

**السطر 777:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 778:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 779:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 780:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 781:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 782:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `43,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 783:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 784:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 785–792

```json
            "category_slug": "sandwiches",
            "name": "Rotolo Al Pesto",
            "description": "Pesto, mozzarella, sundried tomatoes, basil, parmesan, arugula, balsamic, and almonds.",
            "image_path": null,
            "tag": "Hot Sandwich",
            "display_order": 25,
            "branch_options": [
                {
```

**السطر 785:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 786:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Rotolo Al Pesto",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 787:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Pesto, mozzarella, sundried tomatoes, basil, parmesan, arugula, balsamic, and almonds.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 788:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 789:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Hot Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 790:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `25,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 791:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 792:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 793–800

```json
                    "branch_id": 1,
                    "price": "275.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "275.00",
                    "is_available": true
```

**السطر 793:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 794:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"275.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 795:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 796:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 797:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 798:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 799:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"275.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 800:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 801–808

```json
                },
                {
                    "branch_id": 3,
                    "price": "275.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 801:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 802:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 803:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 804:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"275.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 805:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 806:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 807:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 808:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 809–816

```json
        {
            "id": 44,
            "category_id": 2,
            "category": "Sandwiches",
            "category_slug": "sandwiches",
            "name": "Panino Al Roast Beef",
            "description": "Roast beef, salami spread, mozzarella, artichokes, sundried tomatoes, arugula, and pesto.",
            "image_path": null,
```

**السطر 809:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 810:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `44,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 811:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 812:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 813:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 814:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Panino Al Roast Beef",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 815:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Roast beef, salami spread, mozzarella, artichokes, sundried tomatoes, arugula, and pesto.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 816:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 817–824

```json
            "tag": "Hot Sandwich",
            "display_order": 26,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "345.00",
                    "is_available": true
                },
```

**السطر 817:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Hot Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 818:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `26,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 819:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 820:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 821:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 822:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"345.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 823:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 824:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 825–832

```json
                {
                    "branch_id": 2,
                    "price": "345.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "345.00",
```

**السطر 825:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 826:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 827:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"345.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 828:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 829:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 830:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 831:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 832:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"345.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 833–840

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 45,
            "category_id": 2,
            "category": "Sandwiches",
```

**السطر 833:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 834:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 835:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 836:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 837:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 838:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `45,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 839:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 840:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 841–848

```json
            "category_slug": "sandwiches",
            "name": "Panino Al Tartufo",
            "description": "Truffle cream, mozzarella, mushrooms, peppers, zucchini, aubergine, and parmesan.",
            "image_path": null,
            "tag": "Hot Sandwich",
            "display_order": 27,
            "branch_options": [
                {
```

**السطر 841:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"sandwiches",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 842:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Panino Al Tartufo",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 843:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Truffle cream, mozzarella, mushrooms, peppers, zucchini, aubergine, and parmesan.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 844:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 845:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Hot Sandwich",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 846:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `27,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 847:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 848:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 849–856

```json
                    "branch_id": 1,
                    "price": "250.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "250.00",
                    "is_available": true
```

**السطر 849:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 850:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"250.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 851:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 852:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 853:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 854:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 855:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"250.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 856:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 857–864

```json
                },
                {
                    "branch_id": 3,
                    "price": "250.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 857:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 858:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 859:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 860:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"250.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 861:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 862:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 863:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 864:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 865–872

```json
        {
            "id": 19,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Water",
            "description": "Mineral water.",
            "image_path": null,
```

**السطر 865:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 866:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `19,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 867:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 868:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 869:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 870:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Water",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 871:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Mineral water.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 872:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 873–880

```json
            "tag": "Cold",
            "display_order": 34,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "20.00",
                    "is_available": true
                },
```

**السطر 873:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cold",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 874:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `34,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 875:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 876:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 877:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 878:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"20.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 879:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 880:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 881–888

```json
                {
                    "branch_id": 2,
                    "price": "20.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "20.00",
```

**السطر 881:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 882:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 883:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"20.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 884:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 885:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 886:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 887:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 888:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"20.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 889–896

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 20,
            "category_id": 3,
            "category": "Drinks",
```

**السطر 889:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 890:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 891:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 892:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 893:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 894:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `20,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 895:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 896:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 897–904

```json
            "category_slug": "drinks",
            "name": "Sodas",
            "description": "Assorted carbonated soft drinks.",
            "image_path": null,
            "tag": "Cold",
            "display_order": 35,
            "branch_options": [
                {
```

**السطر 897:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 898:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Sodas",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 899:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Assorted carbonated soft drinks.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 900:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 901:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cold",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 902:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `35,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 903:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 904:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 905–912

```json
                    "branch_id": 1,
                    "price": "30.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "30.00",
                    "is_available": true
```

**السطر 905:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 906:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"30.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 907:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 908:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 909:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 910:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 911:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"30.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 912:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 913–920

```json
                },
                {
                    "branch_id": 3,
                    "price": "30.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 913:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 914:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 915:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 916:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"30.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 917:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 918:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 919:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 920:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 921–928

```json
        {
            "id": 21,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Lemonade",
            "description": "A refreshing drink made with fresh lemons.",
            "image_path": null,
```

**السطر 921:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 922:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `21,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 923:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 924:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 925:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 926:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Lemonade",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 927:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"A refreshing drink made with fresh lemons.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 928:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 929–936

```json
            "tag": "Fresh",
            "display_order": 36,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "115.00",
                    "is_available": true
                },
```

**السطر 929:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Fresh",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 930:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `36,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 931:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 932:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 933:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 934:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"115.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 935:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 936:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 937–944

```json
                {
                    "branch_id": 2,
                    "price": "115.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "115.00",
```

**السطر 937:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 938:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 939:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"115.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 940:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 941:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 942:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 943:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 944:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"115.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 945–952

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 22,
            "category_id": 3,
            "category": "Drinks",
```

**السطر 945:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 946:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 947:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 948:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 949:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 950:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `22,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 951:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 952:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 953–960

```json
            "category_slug": "drinks",
            "name": "Iced Tea",
            "description": "Chilled brewed tea.",
            "image_path": "/images/menu/iced-tea.webp",
            "tag": "Cold",
            "display_order": 37,
            "branch_options": [
                {
```

**السطر 953:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 954:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Iced Tea",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 955:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Chilled brewed tea.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 956:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/iced-tea.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 957:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cold",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 958:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `37,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 959:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 960:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 961–968

```json
                    "branch_id": 1,
                    "price": "110.00",
                    "is_available": false
                },
                {
                    "branch_id": 2,
                    "price": "110.00",
                    "is_available": true
```

**السطر 961:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 962:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"110.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 963:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `false`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 964:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 965:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 966:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 967:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"110.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 968:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 969–976

```json
                },
                {
                    "branch_id": 3,
                    "price": "110.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 969:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 970:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 971:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 972:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"110.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 973:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 974:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 975:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 976:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 977–984

```json
        {
            "id": 23,
            "category_id": 3,
            "category": "Drinks",
            "category_slug": "drinks",
            "name": "Red Bull",
            "description": "Energy drink with caffeine, taurine, and B-group vitamins.",
            "image_path": null,
```

**السطر 977:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 978:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `23,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 979:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 980:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 981:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"drinks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 982:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Red Bull",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 983:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Energy drink with caffeine, taurine, and B-group vitamins.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 984:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 985–992

```json
            "tag": "Energy",
            "display_order": 38,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "75.00",
                    "is_available": true
                },
```

**السطر 985:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Energy",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 986:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `38,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 987:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 988:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 989:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 990:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"75.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 991:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 992:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 993–1000

```json
                {
                    "branch_id": 2,
                    "price": "75.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "75.00",
```

**السطر 993:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 994:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 995:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"75.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 996:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 997:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 998:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 999:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1000:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"75.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1001–1008

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 13,
            "category_id": 4,
            "category": "Dips",
```

**السطر 1001:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1002:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1003:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1004:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1005:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1006:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `13,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1007:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `4,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1008:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1009–1016

```json
            "category_slug": "dips",
            "name": "Marinara Dip",
            "description": "Marinara sauce for dipping.",
            "image_path": "/images/menu/marinara-dip.webp",
            "tag": "Crust Dip",
            "display_order": 28,
            "branch_options": [
                {
```

**السطر 1009:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1010:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Marinara Dip",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1011:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Marinara sauce for dipping.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1012:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/marinara-dip.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1013:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Crust Dip",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1014:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `28,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1015:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1016:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1017–1024

```json
                    "branch_id": 1,
                    "price": "60.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "60.00",
                    "is_available": true
```

**السطر 1017:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1018:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"60.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1019:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1020:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1021:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1022:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1023:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"60.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1024:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1025–1032

```json
                },
                {
                    "branch_id": 3,
                    "price": "60.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 1025:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1026:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1027:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1028:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"60.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1029:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1030:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1031:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1032:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1033–1040

```json
        {
            "id": 14,
            "category_id": 4,
            "category": "Dips",
            "category_slug": "dips",
            "name": "Creamy Pesto Crust Dippers",
            "description": "Crust pieces served with a creamy pesto dip.",
            "image_path": "/images/menu/pesto-dip.webp",
```

**السطر 1033:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1034:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `14,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1035:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `4,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1036:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1037:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1038:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Creamy Pesto Crust Dippers",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1039:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Crust pieces served with a creamy pesto dip.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1040:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/pesto-dip.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1041–1048

```json
            "tag": "Crust Dip",
            "display_order": 29,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "80.00",
                    "is_available": true
                },
```

**السطر 1041:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Crust Dip",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1042:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `29,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1043:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1044:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1045:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1046:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"80.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1047:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1048:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1049–1056

```json
                {
                    "branch_id": 2,
                    "price": "80.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "80.00",
```

**السطر 1049:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1050:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1051:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"80.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1052:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1053:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1054:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1055:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1056:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"80.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1057–1064

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 15,
            "category_id": 4,
            "category": "Dips",
```

**السطر 1057:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1058:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1059:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1060:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1061:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1062:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `15,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1063:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `4,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1064:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1065–1072

```json
            "category_slug": "dips",
            "name": "Creamy Truffle",
            "description": "A creamy sauce infused with truffle.",
            "image_path": null,
            "tag": "Crust Dip",
            "display_order": 30,
            "branch_options": [
                {
```

**السطر 1065:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"dips",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1066:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Creamy Truffle",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1067:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"A creamy sauce infused with truffle.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1068:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1069:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Crust Dip",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1070:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `30,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1071:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1072:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1073–1080

```json
                    "branch_id": 1,
                    "price": "110.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "110.00",
                    "is_available": true
```

**السطر 1073:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1074:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"110.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1075:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1076:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1077:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1078:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1079:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"110.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1080:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1081–1088

```json
                },
                {
                    "branch_id": 3,
                    "price": "110.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 1081:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1082:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1083:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1084:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"110.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1085:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1086:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1087:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1088:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1089–1096

```json
        {
            "id": 16,
            "category_id": 5,
            "category": "Desserts",
            "category_slug": "desserts",
            "name": "Impasto Al Cacao",
            "description": "Cocoa dough with chocolate hazelnut spread, nuts, whipped cream, and sugar.",
            "image_path": "/images/menu/impasto-al-cacao.webp",
```

**السطر 1089:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1090:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `16,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1091:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `5,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1092:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1093:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1094:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Impasto Al Cacao",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1095:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cocoa dough with chocolate hazelnut spread, nuts, whipped cream, and sugar.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1096:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/impasto-al-cacao.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1097–1104

```json
            "tag": "House Special",
            "display_order": 31,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "385.00",
                    "is_available": true
                },
```

**السطر 1097:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"House Special",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1098:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `31,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1099:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1100:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1101:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1102:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"385.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1103:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1104:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1105–1112

```json
                {
                    "branch_id": 2,
                    "price": "385.00",
                    "is_available": false
                },
                {
                    "branch_id": 3,
                    "price": "385.00",
```

**السطر 1105:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1106:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1107:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"385.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1108:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `false`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1109:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1110:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1111:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1112:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"385.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1113–1120

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 17,
            "category_id": 5,
            "category": "Desserts",
```

**السطر 1113:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1114:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1115:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1116:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1117:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1118:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `17,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1119:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `5,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1120:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1121–1128

```json
            "category_slug": "desserts",
            "name": "Ripieno Al Gianduia",
            "description": "Folded sweet dough filled with chocolate hazelnut cream and dusted with sugar.",
            "image_path": "/images/menu/ripieno-al-gianduia.webp",
            "tag": "Nutella Calzone",
            "display_order": 32,
            "branch_options": [
                {
```

**السطر 1121:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1122:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Ripieno Al Gianduia",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1123:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Folded sweet dough filled with chocolate hazelnut cream and dusted with sugar.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1124:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/ripieno-al-gianduia.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1125:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Nutella Calzone",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1126:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `32,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1127:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1128:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1129–1136

```json
                    "branch_id": 1,
                    "price": "295.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "295.00",
                    "is_available": true
```

**السطر 1129:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1130:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"295.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1131:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1132:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1133:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1134:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1135:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"295.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1136:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1137–1144

```json
                },
                {
                    "branch_id": 3,
                    "price": "295.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 1137:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1138:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1139:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1140:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"295.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1141:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1142:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1143:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1144:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1145–1152

```json
        {
            "id": 18,
            "category_id": 5,
            "category": "Desserts",
            "category_slug": "desserts",
            "name": "Tiramisu",
            "description": "House tiramisu served with a special creamy sauce.",
            "image_path": "/images/menu/tiramisu.webp",
```

**السطر 1145:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1146:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `18,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1147:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `5,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1148:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1149:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"desserts",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1150:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Tiramisu",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1151:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"House tiramisu served with a special creamy sauce.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1152:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/tiramisu.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1153–1160

```json
            "tag": "Italian",
            "display_order": 33,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "210.00",
                    "is_available": true
                },
```

**السطر 1153:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Italian",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1154:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `33,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1155:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1156:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1157:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1158:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"210.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1159:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1160:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1161–1168

```json
                {
                    "branch_id": 2,
                    "price": "210.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "210.00",
```

**السطر 1161:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1162:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1163:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"210.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1164:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1165:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1166:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1167:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1168:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"210.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1169–1176

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 24,
            "category_id": 6,
            "category": "Starters",
```

**السطر 1169:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1170:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1171:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1172:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1173:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1174:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `24,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1175:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `6,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1176:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1177–1184

```json
            "category_slug": "starters",
            "name": "Garlic Bread",
            "description": "Aromatic garlic butter on pizza dough.",
            "image_path": "/images/menu/garlic-bread.webp",
            "tag": "Shareable",
            "display_order": 39,
            "branch_options": [
                {
```

**السطر 1177:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1178:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Garlic Bread",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1179:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Aromatic garlic butter on pizza dough.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1180:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/garlic-bread.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1181:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Shareable",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1182:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `39,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1183:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1184:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1185–1192

```json
                    "branch_id": 1,
                    "price": "250.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "250.00",
                    "is_available": true
```

**السطر 1185:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1186:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"250.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1187:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1188:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1189:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1190:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1191:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"250.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1192:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1193–1200

```json
                },
                {
                    "branch_id": 3,
                    "price": "250.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 1193:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1194:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1195:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1196:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"250.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1197:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1198:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1199:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1200:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1201–1208

```json
        {
            "id": 25,
            "category_id": 6,
            "category": "Starters",
            "category_slug": "starters",
            "name": "Mozzarella Sticks",
            "description": "Crispy mozzarella sticks served hot.",
            "image_path": "/images/menu/mozzarella-sticks.webp",
```

**السطر 1201:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1202:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `25,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1203:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `6,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1204:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1205:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1206:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Mozzarella Sticks",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1207:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Crispy mozzarella sticks served hot.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1208:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/mozzarella-sticks.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1209–1216

```json
            "tag": "Cheesy",
            "display_order": 40,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "145.00",
                    "is_available": true
                },
```

**السطر 1209:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cheesy",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1210:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `40,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1211:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1212:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1213:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1214:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"145.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1215:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1216:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1217–1224

```json
                {
                    "branch_id": 2,
                    "price": "145.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "145.00",
```

**السطر 1217:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1218:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1219:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"145.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1220:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1221:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1222:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1223:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1224:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"145.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1225–1232

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 30,
            "category_id": 6,
            "category": "Starters",
```

**السطر 1225:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1226:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1227:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1228:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1229:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1230:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `30,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1231:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `6,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1232:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1233–1240

```json
            "category_slug": "starters",
            "name": "Montanarina",
            "description": "Fried pizza dough with sweet marinara and parmesan.",
            "image_path": "/images/menu/montanarina.webp",
            "tag": "Neapolitan",
            "display_order": 41,
            "branch_options": [
                {
```

**السطر 1233:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1234:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Montanarina",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1235:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Fried pizza dough with sweet marinara and parmesan.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1236:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/montanarina.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1237:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Neapolitan",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1238:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `41,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1239:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1240:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1241–1248

```json
                    "branch_id": 1,
                    "price": "225.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "225.00",
                    "is_available": true
```

**السطر 1241:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1242:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"225.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1243:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1244:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1245:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1246:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1247:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"225.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1248:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1249–1256

```json
                },
                {
                    "branch_id": 3,
                    "price": "225.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 1249:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1250:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1251:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1252:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"225.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1253:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1254:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1255:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1256:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1257–1264

```json
        {
            "id": 47,
            "category_id": 6,
            "category": "Starters",
            "category_slug": "starters",
            "name": "Truffled Crochette",
            "description": "Potato croquettes, truffle paste, and house truffle dip.",
            "image_path": null,
```

**السطر 1257:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1258:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `47,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1259:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `6,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1260:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1261:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"starters",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1262:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Truffled Crochette",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1263:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Potato croquettes, truffle paste, and house truffle dip.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1264:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1265–1272

```json
            "tag": "Truffle",
            "display_order": 42,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "260.00",
                    "is_available": true
                },
```

**السطر 1265:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Truffle",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1266:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `42,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1267:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1268:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1269:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1270:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"260.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1271:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1272:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1273–1280

```json
                {
                    "branch_id": 2,
                    "price": "260.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "260.00",
```

**السطر 1273:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1274:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1275:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"260.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1276:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1277:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1278:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1279:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1280:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"260.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1281–1288

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 26,
            "category_id": 7,
            "category": "Salads",
```

**السطر 1281:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1282:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1283:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1284:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1285:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1286:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `26,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1287:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1288:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1289–1296

```json
            "category_slug": "salads",
            "name": "Insalata Arrostita",
            "description": "Zucchini, peppers, aubergine, mushrooms, pesto, feta, herbs, and lemon vinaigrette.",
            "image_path": "/images/menu/insalata-arrostita.webp",
            "tag": "Roasted",
            "display_order": 43,
            "branch_options": [
                {
```

**السطر 1289:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1290:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Insalata Arrostita",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1291:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Zucchini, peppers, aubergine, mushrooms, pesto, feta, herbs, and lemon vinaigrette.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1292:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/insalata-arrostita.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1293:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Roasted",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1294:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `43,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1295:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1296:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1297–1304

```json
                    "branch_id": 1,
                    "price": "235.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "235.00",
                    "is_available": true
```

**السطر 1297:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1298:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"235.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1299:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1300:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1301:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1302:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1303:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"235.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1304:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1305–1312

```json
                },
                {
                    "branch_id": 3,
                    "price": "235.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 1305:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1306:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1307:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1308:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"235.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1309:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1310:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1311:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1312:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1313–1320

```json
        {
            "id": 27,
            "category_id": 7,
            "category": "Salads",
            "category_slug": "salads",
            "name": "Insalata Di Tonno",
            "description": "Mixed leaves, tuna, roasted peppers, pickled onions, tomatoes, olives, and lemon dressing.",
            "image_path": "/images/menu/insalata-di-tonno.webp",
```

**السطر 1313:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1314:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `27,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1315:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1316:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1317:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1318:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Insalata Di Tonno",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1319:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Mixed leaves, tuna, roasted peppers, pickled onions, tomatoes, olives, and lemon dressing.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1320:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/insalata-di-tonno.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1321–1328

```json
            "tag": "Protein",
            "display_order": 44,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "375.00",
                    "is_available": true
                },
```

**السطر 1321:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Protein",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1322:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `44,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1323:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1324:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1325:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1326:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"375.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1327:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1328:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1329–1336

```json
                {
                    "branch_id": 2,
                    "price": "375.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "375.00",
```

**السطر 1329:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1330:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1331:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"375.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1332:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1333:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1334:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1335:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1336:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"375.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1337–1344

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 28,
            "category_id": 7,
            "category": "Salads",
```

**السطر 1337:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1338:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1339:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1340:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1341:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1342:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `28,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1343:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1344:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1345–1352

```json
            "category_slug": "salads",
            "name": "Greek Salad",
            "description": "Mixed leaves, cucumber, peppers, onions, olives, tomatoes, crumbs, oregano, and Greek dressing.",
            "image_path": "/images/menu/greek-salad.webp",
            "tag": "Fresh",
            "display_order": 45,
            "branch_options": [
                {
```

**السطر 1345:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1346:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Greek Salad",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1347:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Mixed leaves, cucumber, peppers, onions, olives, tomatoes, crumbs, oregano, and Greek dressing.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1348:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/greek-salad.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1349:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Fresh",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1350:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `45,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1351:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1352:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1353–1360

```json
                    "branch_id": 1,
                    "price": "265.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "265.00",
                    "is_available": true
```

**السطر 1353:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1354:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"265.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1355:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1356:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1357:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1358:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1359:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"265.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1360:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1361–1368

```json
                },
                {
                    "branch_id": 3,
                    "price": "265.00",
                    "is_available": true
                }
            ]
        },
```

**السطر 1361:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1362:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1363:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1364:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"265.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1365:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1366:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1367:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1368:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1369–1376

```json
        {
            "id": 29,
            "category_id": 7,
            "category": "Salads",
            "category_slug": "salads",
            "name": "House Caesar",
            "description": "Romaine, cherry tomatoes, pesto Caesar dressing, parmesan, and pizza dough crumbs.",
            "image_path": "/images/menu/house-caesar.webp",
```

**السطر 1369:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1370:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `29,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1371:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1372:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1373:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1374:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"House Caesar",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1375:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Romaine, cherry tomatoes, pesto Caesar dressing, parmesan, and pizza dough crumbs.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1376:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"/images/menu/house-caesar.webp",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1377–1384

```json
            "tag": "House Pick",
            "display_order": 46,
            "branch_options": [
                {
                    "branch_id": 1,
                    "price": "340.00",
                    "is_available": true
                },
```

**السطر 1377:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"House Pick",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1378:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `46,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1379:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1380:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1381:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1382:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"340.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1383:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1384:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1385–1392

```json
                {
                    "branch_id": 2,
                    "price": "340.00",
                    "is_available": true
                },
                {
                    "branch_id": 3,
                    "price": "340.00",
```

**السطر 1385:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1386:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1387:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"340.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1388:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1389:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1390:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1391:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1392:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"340.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1393–1400

```json
                    "is_available": true
                }
            ]
        },
        {
            "id": 46,
            "category_id": 7,
            "category": "Salads",
```

**السطر 1393:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1394:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1395:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1396:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1397:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1398:** `id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `46,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1399:** `category_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `7,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1400:** `category` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1401–1408

```json
            "category_slug": "salads",
            "name": "Caprese De Buffala",
            "description": "Cherry tomatoes, buffalo mozzarella, basil, and balsamic glaze.",
            "image_path": null,
            "tag": "Fresh",
            "display_order": 47,
            "branch_options": [
                {
```

**السطر 1401:** `category_slug` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"salads",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1402:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Caprese De Buffala",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1403:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Cherry tomatoes, buffalo mozzarella, basil, and balsamic glaze.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1404:** `image_path` اسم حقل/إعداد، والقيمة بعد النقطتين هي `null,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1405:** `tag` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"Fresh",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1406:** `display_order` اسم حقل/إعداد، والقيمة بعد النقطتين هي `47,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1407:** `branch_options` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1408:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 1409–1416

```json
                    "branch_id": 1,
                    "price": "295.00",
                    "is_available": true
                },
                {
                    "branch_id": 2,
                    "price": "295.00",
                    "is_available": true
```

**السطر 1409:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `1,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1410:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"295.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1411:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1412:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1413:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1414:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `2,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1415:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"295.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1416:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 1417–1424

```json
                },
                {
                    "branch_id": 3,
                    "price": "295.00",
                    "is_available": true
                }
            ]
        }
```

**السطر 1417:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1418:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 1419:** `branch_id` اسم حقل/إعداد، والقيمة بعد النقطتين هي `3,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1420:** `price` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"295.00",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1421:** `is_available` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 1422:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1423:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1424:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1425–1427

```json
    ]
}

```

**السطر 1425:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1426:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
