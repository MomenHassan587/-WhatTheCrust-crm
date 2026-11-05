# Code Area: Menu, Add to Cart, and Cart Storage

This lesson explains the journey from choosing a branch to saving items in the browser cart.

## 1. The active menu file

The active menu page is:

```text
resources/js/Pages/MenuPage.jsx
```

It currently uses menu data written directly in the React file.

It does not fetch `GET /api/menu` yet.

## 2. Imports in `MenuPage.jsx`

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
```

**What it says:** Bring React memory/effect/calculation hooks, Bootstrap layout cards, animation tools, and navigation Link.

**Why it is there:** The page needs state, responsive cards, animated transitions, and a Cart link.

**If you delete a used import:** The matching name becomes unknown and the build fails.

## 3. Shared cart names

```jsx
const CART_STORAGE_KEY = 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';
```

**What it says:** Give fixed names to browser cart storage and the cart-change event.

**Why it is there:** Menu, Home, Cart, and Navbar must use the exact same names.

**If one file uses a different key:** It reads a different cart.

## 4. Branch and category data

```jsx
const branches = [
    { id: 1, name: 'Nasr City', location: 'Cairo, Egypt', note: 'Fastest delivery zone' },
    { id: 2, name: 'New Cairo', location: 'Cairo, Egypt', note: 'Premium dine-in stock' },
    { id: 3, name: 'Maadi', location: 'Cairo, Egypt', note: 'Family order favorite' },
];

const categories = ['Pizzas', 'Sandwiches', 'Drinks', 'Dips', 'Desserts'];
```

**What it says:** Create three branch objects and five category names.

**Why it is there:** The page needs choices before rendering items.

**If you delete branches:** Customers cannot choose where they are ordering from.

**If you delete categories:** Category navigation is empty.

This duplicates branch/category data from SQLite. That is a weakness. The API should become the single source later.

## 5. Read and write browser cart

```jsx
function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}
```

**What it says:** Read cart text from browser storage and turn it back into a list. If the text is broken, use an empty list.

**Why it is there:** Refreshing or changing pages should not lose the cart. The `try/catch` prevents bad stored text from crashing the page.

**If you delete it:** The page has no safe way to read previous items.

```jsx
function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}
```

**What it says:** Turn the list into JSON text, save it, and announce the change.

**Why it is there:** Other components update immediately.

**If you delete the event:** Same-tab Navbar count may stay old until another update or reload.

## 6. `CartToast`

```jsx
function CartToast({ show }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="wtc-menu-toast"
                    initial={{ opacity: 0, y: 22, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    role="status"
                >
                    <span>✓</span>
                    Added to Cart Successfully!
                </motion.div>
            )}
        </AnimatePresence>
    );
}
```

**What it says:** When `show` is true, display an animated success message. Fade/move/scale it in and out.

**Why it is there:** The customer needs feedback after pressing Add.

**If you delete it:** Adding still works, but the customer gets less confirmation.

`role="status"` lets assistive technology announce the message.

## 7. Menu page state

```jsx
const [selectedBranch, setSelectedBranch] = useState(null);
const [activeCategory, setActiveCategory] = useState('Pizzas');
const [showToast, setShowToast] = useState(false);
```

**What it says:** Remember selected branch, current category, and toast visibility.

**Why it is there:** Changing these values must redraw the page.

**If you delete selectedBranch state:** The page cannot move from branch selection to branch menu.

## 8. Hard-coded `menuItems`

The long `useState([...])` array contains 18 product objects.

Each object has:

```jsx
{
    id: 2,
    category: 'Pizzas',
    name: 'Red Hook Margherita',
    description: 'Tomato sauce, mozzarella, basil, olive oil, and blistered crust.',
    image_src: '',
    prices: { 1: 149, 2: 167, 3: 158 },
    available_branches: [1, 2, 3],
    tag: 'Classic',
}
```

- `id` is used as item identity and is later sent to Laravel.
- `category` decides which tab shows it.
- `prices` maps branch ID to display/cart price.
- `available_branches` controls filtering.
- Empty image shows an emoji placeholder.
- `tag` is visual text.

If IDs differ from database IDs, Laravel can price/reject a different product. This is why fetching the API is a future priority.

## 9. Hide the toast later

```jsx
useEffect(() => {
    if (!showToast) return undefined;

    const timeoutId = window.setTimeout(() => {
        setShowToast(false);
    }, 2200);

    return () => {
        window.clearTimeout(timeoutId);
    };
}, [showToast]);
```

**What it says:** When toast appears, wait 2.2 seconds and hide it. Cancel old timer during cleanup.

**Why it is there:** The message should not stay forever or leave forgotten timers.

**If you delete cleanup:** A timer can run after the component leaves.

## 10. Filter the visible items

```jsx
const filteredItems = useMemo(() => {
    if (!selectedBranch) return [];

    return menuItems.filter((item) => (
        item.category === activeCategory
        && item.available_branches.includes(selectedBranch.id)
    ));
}, [activeCategory, menuItems, selectedBranch]);
```

**What it says:** Recalculate visible items only when branch, category, or menu list changes.

**Why it is there:** Customers should see only matching products.

**If you delete the branch condition:** Unavailable products may appear.

## 11. Add to cart

```jsx
const addToCart = (item) => {
    if (!selectedBranch) return;

    const price = item.prices[selectedBranch.id];
    const currentCart = readCart();
    const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);
```

**What it says:** Require a branch, choose its price, read cart, and look for this item.

**Why it is there:** Existing items should increase instead of making duplicate cards.

**If you delete the branch guard:** Code may try to read a price using no branch.

```jsx
const nextCart = existingItem
    ? currentCart.map((cartItem) => (
        cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
    ))
    : [
        ...currentCart,
        {
            id: item.id,
            name: item.name,
            description: item.description,
            price,
            image_src: item.image_src,
            branch_id: selectedBranch.id,
            branch_name: selectedBranch.name,
            quantity: 1,
        },
    ];
```

**What it says:** If found, make a new cart list with quantity + 1. Otherwise append a new line with display details and quantity 1.

**Why it is there:** React-style updates avoid changing the old array directly.

**If you delete branch metadata:** The saved line loses where it was selected, although active Cart currently chooses its own branch separately.

```jsx
writeCart(nextCart);
setShowToast(true);
```

This saves and gives feedback.

## 12. Branch selection screen

`AnimatePresence mode="wait"` displays either branch selection or menu, not both.

Each branch is a real `<button>`. On click:

```jsx
setSelectedBranch(branch);
setActiveCategory('Pizzas');
```

This remembers branch and resets category.

Bootstrap `Col xs={12} md={4}` means one full-width column on small screens and three columns from medium screens.

## 13. Selected branch and category controls

The selected bar shows branch and has Change Branch plus Go to Cart.

Change sets branch to null, returning to branch selection.

Category buttons map the category list. Active button gets an `active` class.

The menu motion key includes branch ID and category, so changing either creates an entrance animation.

## 14. Product cards

```jsx
{filteredItems.map((item) => (
    <Col key={item.id} xs={12} md={6} lg={4}>
        <Card className="dark-card menu-item-card h-100">
```

**What it says:** Make one responsive card per visible item. Use item ID as stable React key.

**Why it is there:** React needs a stable identity for list changes.

**If you delete `key`:** React warns and may handle list updates less safely.

Empty `image_src` displays a pizza emoji. Price uses selected branch ID. Add button calls `addToCart(item)`.

If no items match, an empty-state message appears.

## 15. Menu inline CSS

The `<style>` block mainly styles the fixed toast and its mobile position.

Other menu styles live in `resources/css/app.css`:

- `.menu-page`
- `.branch-selection-panel`
- `.branch-card`
- `.selected-branch-bar`
- `.category-subnav`
- `.menu-image`
- `.empty-menu-state`

If these styles disappear, the logic still works but the page loses layout/design.

## 16. Homepage quick-add cart

`resources/js/Pages/Home.jsx` repeats `readCart`, `writeCart`, and merge logic for Heat Vault items.

It saves ID, name, description, price, image, quantity, and hard-coded branch 1/Nasr City.

This repetition can drift. A shared cart module or Context would be cleaner later.

## 17. `resources/js/Pages/SpecialsSection.jsx`

This older component defines four special cards and animates them while entering view.

Its Quick Add button has no click handler.

It is not imported by the active app.

Deleting it currently does not change the visible site, but do that only after confirming no future plan uses it.

## 18. `resources/js/Components/CartDrawer.jsx`

This is an older off-canvas cart component.

It is not mounted by `app.jsx` or current Navbar.

### Props

```jsx
export default function CartDrawer({ show, onHide, branch }) {
```

It expects a visible flag, close function, and branch.

### State and effect

It remembers cart items, fulfillment type, submitting, and message.

When drawer shows, it reads storage and listens for cart changes.

### Totals and controls

It calculates total with `useMemo`, updates quantities with `map`, removes with `filter`, and submits a simpler order.

### Important weakness

Its order payload only contains branch, order type, and items.

Current `StoreOrderRequest` also requires customer name/phone and conditional address/time.

So this old drawer checkout would fail current backend validation.

The active checkout is `Pages/Cart.jsx`.

## 19. Cart truth and safety

The browser cart contains display price.

But a customer can edit local storage.

Laravel ignores that price.

It looks up `branch_menu_item.price` during OrderCreator.

This is the correct safety design.

## Weak spots to understand

- Visible menu data is duplicated instead of using `/api/menu`.
- Cart identity uses only item ID, not branch or options.
- Cart page defaults branch 1 even if the menu selection was another branch.
- Cart helpers are copied across multiple files.
- Old CartDrawer and SpecialsSection remain in the project.

## What you should remember

- MenuPage currently uses hard-coded branch/menu data.
- Cart is JSON saved in browser local storage.
- A custom event updates Navbar in the same browser tab.
- React creates new arrays with `map`, `filter`, and spread instead of changing old state directly.
- Laravel never trusts the browser's saved price.

## Test yourself

1. What key stores the cart?
2. Why does `readCart()` use `try/catch`?
3. What happens when an existing item is added again?
4. Does the active menu fetch `/api/menu`?
5. Is CartDrawer the active checkout?

## Answers

1. `wtc_cart`.
2. Broken stored JSON should return an empty cart instead of crashing.
3. Its quantity increases by one.
4. No. The active MenuPage uses its own array.
5. No. `Pages/Cart.jsx` is the active checkout.
