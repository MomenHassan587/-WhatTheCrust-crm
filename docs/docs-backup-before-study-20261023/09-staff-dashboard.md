# Code Area: Staff Dashboard, Notifications, and Order Statuses

The active staff page is:

```text
resources/js/Pages/StaffDashboard.jsx
```

Only staff and admin should use it.

## 1. Imports

```jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { csrfFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
```

**What it says:** Bring React memory/effects/refs, animation, navigation, request helper, and shared auth.

**Why it is there:** The dashboard must check roles, fetch repeatedly, animate, and link guests to login.

**If you delete a used import:** The matching feature cannot compile.

## 2. Branches and statuses

```jsx
const branches = [
    { id: '', name: 'All branches' },
    { id: 1, name: 'Nasr City' },
    { id: 2, name: 'New Cairo' },
    { id: 3, name: 'Maadi' },
];

const columns = [
    'new', 'accepted', 'preparing', 'ready',
    'out_for_delivery', 'picked_up', 'completed',
    'cancelled', 'rejected',
];
```

**What it says:** Define branch filter choices and status-tab order.

**Why it is there:** React maps these lists into controls.

**If a status is removed from columns:** Orders with that status still exist but have no tab.

`labels` changes machine words such as `out_for_delivery` into readable words.

## 3. Next action map

```jsx
const nextActions = {
    new: [['accepted', 'Accept'], ['rejected', 'Reject']],
    accepted: [['preparing', 'Start preparing']],
    preparing: [['ready', 'Mark ready']],
    ready: [['out_for_delivery', 'Send delivery'], ['picked_up', 'Picked up']],
    out_for_delivery: [['completed', 'Complete']],
    picked_up: [['completed', 'Complete']],
};
```

**What it says:** For each current status, list button target and button text.

**Why it is there:** Staff should see only sensible next actions.

**If you delete it:** Cards have no normal status buttons.

This is not the final security rule. Laravel checks transitions again.

## 4. Today's date

```jsx
function today() {
    return new Date().toISOString().slice(0, 10);
}
```

**What it says:** Make a `YYYY-MM-DD` date string.

**Why it is there:** Date filter starts on today.

**Weak point:** `toISOString()` uses UTC. Around midnight in Cairo it can briefly choose a different day.

## 5. Auth and visible state

```jsx
const { user, isCheckingAuth } = useAuth();
const [orders, setOrders] = useState([]);
const [branch, setBranch] = useState('');
const [date, setDate] = useState(today());
const [activeStatus, setActiveStatus] = useState('new');
const [message, setMessage] = useState('');
```

**What it says:** Read shared user and remember orders, filters, selected tab, and notification text.

**Why it is there:** Every value changes what the screen shows.

**If you delete user:** The page cannot decide whether to fetch protected data.

## 6. Sound and new-order memory

```jsx
const [muted, setMuted] = useState(
    () => localStorage.getItem('wtc-staff-muted') === '1'
);
const [highlighted, setHighlighted] = useState([]);
const knownIds = useRef(new Set());
const loadedOnce = useRef(false);
const audioContext = useRef(null);
```

**What it says:** Remember sound preference, highlighted IDs, previously seen order IDs, whether first load happened, and browser audio tool.

**Why refs are used:** These operational values should survive redraws without causing extra redraws.

**If `loadedOnce` is deleted:** Every order on first page load may be announced as new.

## 7. `notify()`

```jsx
const notify = useCallback((newOrders) => {
    if (!newOrders.length) return;
    setMessage(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received.`);
    setHighlighted(newOrders.map((order) => order.id));
    window.setTimeout(() => setHighlighted([]), 3500);
```

**What it says:** Do nothing for empty list. Otherwise show correct singular/plural message, highlight new IDs, and clear highlight after 3.5 seconds.

**Why it is there:** Staff need a clear visual signal.

**If you delete the timeout:** Cards stay highlighted forever.

### Sound block

```jsx
if (!muted && audioContext.current) {
    const oscillator = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.12, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.current.currentTime + 0.22,
    );
    oscillator.connect(gain).connect(audioContext.current.destination);
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.22);
}
```

**What it says:** If sound is on and unlocked, create a short 740 Hz tone that quickly becomes quiet.

**Why it is there:** No audio file is needed. Staff hear a short new-order beep.

**If gain ramp is deleted:** The tone can stop more sharply and sound unpleasant.

Browsers block sound before a user action. That is why AudioContext begins only when staff press the sound button.

## 8. Load orders

```jsx
const loadOrders = useCallback(async () => {
    if (!user || !['staff', 'admin'].includes(user.role)) return;
```

**What it says:** Do not call staff API unless React knows user is staff/admin.

**Why it is there:** It avoids useless forbidden requests.

**If you delete it:** Guests/customers may repeatedly call the protected endpoint, though Laravel still blocks them.

### Build filters

```jsx
const params = new URLSearchParams({ date });
if (branch) params.set('branch_id', branch);
const response = await csrfFetch(`/api/staff/orders?${params}`);
```

**What it says:** Put date and optional branch into the URL, then fetch orders.

**Why it is there:** Laravel can filter before sending data.

**If you delete params:** Branch/date controls no longer affect server results.

### Find newly arrived orders

```jsx
const fresh = response.orders || [];
if (loadedOnce.current) {
    notify(fresh.filter((order) => (
        order.status === 'new' && !knownIds.current.has(order.id)
    )));
}
knownIds.current = new Set(fresh.map((order) => order.id));
loadedOnce.current = true;
setOrders(fresh);
```

**What it says:** Use returned list. After first load, find new-status IDs not seen before. Save all current IDs and render fresh list.

**Why it is there:** Polling responses need comparison to know what is newly arrived.

**If you replace the Set without comparison:** New-order notification cannot tell old from new.

One weakness: errors are not caught inside `loadOrders`, so a network failure can create an unhandled promise warning.

## 9. Poll every seven seconds

```jsx
useEffect(() => {
    loadOrders();
    const timer = window.setInterval(loadOrders, 7000);
    return () => window.clearInterval(timer);
}, [loadOrders]);
```

**What it says:** Load immediately, repeat every seven seconds, stop old timer during cleanup.

**Why it is there:** This is the current near-live update method.

**If you delete immediate call:** Staff wait up to seven seconds on page open.

**If you delete interval:** Other staff changes/new orders do not appear automatically.

One weakness: if a request takes longer than seven seconds, another can begin before it finishes.

## 10. Sound toggle

```jsx
const toggleSound = async () => {
    if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    await audioContext.current.resume();
    const next = !muted;
    setMuted(next);
    localStorage.setItem('wtc-staff-muted', next ? '1' : '0');
};
```

**What it says:** Create/resume audio after click, reverse mute value, save preference.

**Why it is there:** Browser sound permission needs user action and preference should survive refresh.

**If you create audio during page load:** Browser may block it.

## 11. Update an order status

```jsx
const updateStatus = async (order, status) => {
    let reason = null;
    if (['rejected', 'cancelled'].includes(status)) {
        reason = window.prompt(`Reason for ${status}:`);
        if (!reason) return;
    }
```

**What it says:** Cancellation/rejection asks for a reason. Empty/cancelled prompt stops.

**Why it is there:** Backend requires a reason for those actions.

**Weak point:** Browser prompt is basic and not a polished accessible form. A modal would be better.

```jsx
const response = await csrfFetch(`/api/staff/orders/${order.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
});
setOrders((current) => current.map((item) => (
    item.id === order.id ? response.order : item
)));
```

**What it says:** Send partial update. Replace matching order with Laravel's updated copy.

**Why it is there:** Screen changes immediately after success.

**If you change local state before server success:** The UI can show a change Laravel rejected.

## 12. Frontend access screens

```jsx
if (isCheckingAuth) return ...;
if (!user) return ... sign-in link ...;
if (!['staff', 'admin'].includes(user.role)) return ... restricted ...;
```

These early returns show the correct screen while checking, logged out, or wrong role.

They improve user experience. Backend middleware remains the real protection.

## 13. Filters and tabs

The branch `<select>` changes `branch`.

The date `<input type="date">` changes date.

The sound button calls toggleSound.

Tabs map every status and show count:

```jsx
{labels[status]} ({orders.filter((order) => order.status === status).length})
```

`role="tablist"`, `role="tab"`, and `aria-selected` provide some accessibility meaning.

Full keyboard arrow behavior is not implemented.

## 14. Visible cards

```jsx
const visible = orders.filter((order) => order.status === activeStatus);
```

Only the selected status reaches the grid.

Each `motion.article`:

- enters with fade/up movement;
- pulses if its ID is highlighted;
- shows ID and time;
- shows customer and telephone link;
- shows branch and fulfillment;
- shows address or pickup arrival;
- maps every item and note;
- shows payment and total;
- maps allowed action buttons.

The ready action filter chooses delivery route for delivery and picked-up route for pickup.

Active nonterminal orders also receive Cancel.

## 15. Inline dashboard CSS

The `<style>` block defines:

- dark page and spacing;
- flexible header/filters;
- scrolling status pills;
- three-column order grid;
- red new-order border;
- item separators and gold notes;
- action buttons and fixed banner;
- two columns below 991px;
- one column and stacked controls below 650px.

Removing CSS does not remove data logic, but the dashboard becomes difficult to scan and use.

## 16. Backend list request

`StaffOrderController::index` validates filters, eager-loads relationships, excludes payment-pending/unpaid cards, filters, orders newest first, and returns JSON.

The status filter currently accepts any string instead of checking `Order::STAFF_STATUSES`. That can be tightened.

## 17. Backend transition safety

Laravel reads `Order::TRANSITIONS`.

When status is ready, it allows only:

- delivery -> out_for_delivery;
- pickup -> picked_up;
- either may cancel.

It uses a database transaction to update Order and create OrderStatusLog together.

Frontend buttons cannot bypass this server check.

## 18. Broadcasting versus polling

`OrderPlaced` and `OrderStatusUpdated` broadcast on private `staff.orders`.

`routes/channels.php` checks `isStaff()`.

But these JavaScript packages are not installed/configured:

- Laravel Echo;
- Pusher JS;
- Laravel Reverb client connection.

Therefore the visible dashboard uses polling.

Do not call it WebSocket real-time in a presentation. Say “seven-second polling, with backend broadcast events prepared for a future upgrade.”

## What you should remember

- AuthContext helps the page decide which screen to show; Laravel middleware protects the data.
- The dashboard polls every seven seconds.
- Refs remember known order IDs without redrawing the screen.
- Laravel, not the button list, decides whether a status change is legal.
- Every accepted status change is saved in an audit log.

## Test yourself

1. Why is `loadedOnce` needed?
2. What does polling mean here?
3. Why must sound begin after a click?
4. What happens when staff rejects an order?
5. Is Echo/Reverb currently connected in React?

## Answers

1. It stops all existing orders from being announced as new on first load.
2. The browser asks Laravel for orders immediately and every seven seconds.
3. Browsers normally block sound before a user action.
4. The page asks for a reason and sends status/reason to Laravel for validation and logging.
5. No. The active browser update system is polling.
