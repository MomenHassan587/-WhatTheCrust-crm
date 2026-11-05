# Code Area: Homepage, Hero Video, Awards, and Animation

The active homepage is:

```text
resources/js/Pages/Home.jsx
```

It contains the active video hero, awards, featured pizzas, About, Contact, and a cart toast.

## 1. Imports

```jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
```

**What it says:** Bring React effect/state, animation components, and client-side links.

**Why it is there:** Home needs video/cart effects, animated sections, and Menu links.

**If you delete a used import:** The matching code becomes unknown.

The file uses `React.useRef` and `React.useCallback` through the main React object, so they are not named in the first import braces.

## 2. Featured item data

```jsx
const heatVaultItems = [
    {
        id: 1,
        name: 'Canivora Heat Pizza',
        description: 'Beef chunks, salami, mozzarella, basil, and rich tomato sauce.',
        price: 235,
        image_src: '/images/canivoral.jpg',
    },
    ...
];
```

**What it says:** Define four homepage product cards.

**Why it is there:** Heat Vault maps this list into visible cards.

**If you delete the array:** The featured section has no products.

This data is separate from MenuPage and database data. Prices can drift.

## 3. Awards data

```jsx
const awards = [
    {
        title: '50 Top Pizza World',
        detail: '2023 - 84th Place',
        label: 'World Ranking',
    },
    ...
];
```

Each object becomes one trophy card.

Deleting one object removes one card only.

## 4. Animation variants

A **variant** is a named animation plan reused by Framer Motion.

```jsx
const heroReveal = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};
```

**What it says:** Parent does not move itself. When visible, start each child 0.15 seconds after the previous one.

**Why it is there:** Hero words and buttons enter in a sequence.

**If you delete stagger:** Children may appear together or need their own timing.

```jsx
const heroRevealItem = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
```

**What it says:** Start invisible and 25 pixels lower. Move to normal position and fully visible over 0.6 seconds.

**Why it is there:** The reveal feels smooth.

**If you delete hidden state:** There is no visible entrance difference.

`textWrap` and `textItem` use the same idea for awards/featured text.

## 5. Cart helpers and Laurel icon

Home repeats the same local-storage cart helpers explained in the menu lesson.

`LaurelIcon()` returns a small SVG trophy/laurel drawing.

SVG is image code made from shapes and paths.

`aria-hidden="true"` tells screen readers it is decoration.

Deleting the icon does not remove award text, only the visual symbol.

## 6. `HeroSection` inputs

```jsx
function HeroSection({ isReady, onReady, reduceMotion }) {
```

**What it says:** Hero receives whether content is ready, a function to mark ready, and the user's reduced-motion choice.

**Why it is there:** AppShell owns shared readiness because both Navbar and Hero need it.

**If Hero owned all readiness alone:** Navbar would not know when to appear unless state was shared another way.

## 7. Video ref and reveal guard

```jsx
const videoRef = React.useRef(null);
const hasRevealedRef = React.useRef(false);
```

**What it says:** Keep a pointer to the real `<video>` element and remember whether this play already revealed content.

**Why refs are used:** Changing them should not redraw the page.

**If videoRef is deleted:** Code cannot reset speed/time or call play.

```jsx
const revealContent = React.useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    onReady();
}, [onReady]);
```

**What it says:** Reveal only once, then call parent function.

**Why it is there:** Slowdown, end, error, and autoplay failure may all try to reveal.

**If the guard is deleted:** Multiple events can repeat state work.

## 8. Reset on every mount

```jsx
useEffect(() => {
    let isCurrentPlayback = true;
    let animationFrameId = 0;
    const video = videoRef.current;

    if (!video) {
        revealContent();
        return undefined;
    }

    hasRevealedRef.current = false;
    video.pause();
    video.playbackRate = 1;
    video.currentTime = 0;
    video.load();
```

**What it says:** Start a safe effect, find video, reveal if missing, then reset reveal, pause, normal speed, first frame, and reload source.

**Why it is there:** Every page load/refresh should play from the beginning, not a stale frame.

**If you delete `currentTime = 0`:** A reused media element might continue from an old position.

**If you delete `playbackRate = 1`:** It could begin with a previous slow speed.

## 9. Smooth slow-motion calculation

```jsx
const updatePlayback = () => {
    if (!isCurrentPlayback || video.error) return;

    if (Number.isFinite(video.duration) && video.duration > 0) {
        const slowdownStart = Math.max(0, video.duration - 2);

        if (video.currentTime >= slowdownStart) {
            const progress = Math.min(1, (video.currentTime - slowdownStart) / 2);
            const easedProgress = progress * progress * (3 - (2 * progress));
            video.playbackRate = 1 - (0.72 * easedProgress);
            revealContent();
        } else {
            video.playbackRate = 1;
        }
    }
```

**What it says:** Stop if old/error. Wait for known duration. Find final two media seconds. During them, calculate progress from 0 to 1. Smooth it. Change speed from 1 to about 0.28. Reveal content.

**Why smoothstep formula is there:** Speed begins and settles gently. There is no sudden jump from 1x to 0.28x.

**If you set `playbackRate = 0.28` immediately:** The speed change feels abrupt.

**If you delete `revealContent`:** Navbar/text may wait until video ends instead of pizza center/slowdown start.

The final two video seconds take longer than two real seconds because they play slowly.

## 10. Ask for next screen frame

```jsx
if (!video.ended) {
    animationFrameId = window.requestAnimationFrame(updatePlayback);
}
```

**What it says:** Ask browser to check again before its next screen drawing, until video ends.

**Why it is there:** Playback speed changes smoothly many times.

**If you use a slow timer instead:** Speed may change in visible steps.

## 11. Play and fallback

```jsx
animationFrameId = window.requestAnimationFrame(updatePlayback);

const playPromise = video.play();
playPromise?.catch(() => {
    if (isCurrentPlayback) {
        revealContent();
        window.cancelAnimationFrame(animationFrameId);
    }
});
```

**What it says:** Start timeline and video. If browser blocks autoplay, reveal navigation immediately and stop the timeline.

**Why it is there:** The page must never hide navigation forever.

**If you delete catch:** Blocked autoplay can leave the page without navigation/content.

## 12. Cleanup

```jsx
return () => {
    isCurrentPlayback = false;
    window.cancelAnimationFrame(animationFrameId);
};
```

**What it says:** When Hero leaves, mark old work inactive and cancel the browser frame request.

**Why it is there:** Old effects should not keep changing an unmounted page.

**If you delete cleanup:** Background callbacks may continue.

## 13. Video element

```jsx
<video
    key="hero-intro-video"
    ref={videoRef}
    className="wtc-hero-video object-cover w-100 h-100 position-absolute top-0 start-0"
    src="/videos/hero-pizza-motion.mp4"
    muted
    playsInline
    preload="auto"
    onEnded={revealContent}
    onError={revealContent}
    aria-hidden="true"
/>
```

- `key` gives this element identity.
- `ref` connects it to JavaScript.
- `src` points into `public/videos`.
- `muted` helps autoplay be allowed.
- `playsInline` avoids forced full-screen video on phones.
- `preload="auto"` asks browser to load it early.
- Ended and error both guarantee content reveal.
- Decorative video is hidden from screen readers.

There is no `loop` attribute. The video plays once and naturally stays on its final frame.

The old `hero-pizza-ending-loop.mp4` file is not referenced.

## 14. Hero overlay

```jsx
<AnimatePresence>
    {isReady && (
        <motion.div
            className="wtc-hero-overlay"
            variants={heroReveal}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
        >
```

**What it says:** Render overlay only when ready. Use stagger variants. Skip hidden entrance when user asks for less motion.

**Why it is there:** Hidden buttons do not exist/capture clicks before reveal.

**If you render all the time with only opacity zero:** Invisible controls may still receive focus or clicks unless handled carefully.

The overlay contains:

- eyebrow text;
- white/red heading;
- description;
- Order Now and View Menu links;
- a “3-Min Delivery” badge;
- three highlight columns with flame, leaf, and delivery symbols.

Each main child uses `heroRevealItem`.

## 15. `AwardsSection`

The section maps awards into four cards.

```jsx
{awards.map((award, index) => (
    <motion.article
        key={award.title}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.42, delay: index * 0.07 }}
    >
```

**What it says:** Animate each card once when 25% enters the screen. Delay each next card by 0.07 seconds.

**Why it is there:** Cards enter in a short stagger instead of all at once.

**If `once` is false:** Animation can repeat when scrolling in/out.

## 16. `HeatVaultSection`

It maps the four featured pizzas into image cards.

Each card shows number, name, description, price, and Add button.

The button calls `onAddToCart(item)` passed from Home.

Using a callback prop keeps cart action in the parent while section focuses on display.

## 17. Home state and quick-add

Home remembers only `showToast`.

An effect hides it after 2.2 seconds.

`addToCart` reads storage, increments or appends item, writes cart, and shows toast.

New homepage items are saved with branch 1/Nasr City.

This is convenient but can conflict with branch choice later.

## 18. About and Contact sections

About uses Bootstrap columns to place heading beside paragraph.

Contact uses mail link and Menu link.

Their IDs `about` and `contact` let Navbar hash links scroll to them.

Delete an ID and the matching `/#about` or `/#contact` link cannot target it correctly.

## 19. Inline Home CSS

Home includes a large `<style>` block.

Important groups:

- `.wtc-hero-section`: full screen, clipped media.
- `.wtc-hero-video`: absolute cover, centered, scaled 1.1 to crop top-left badge.
- `.wtc-hero-shade`: dark gradients for readable text.
- `.wtc-hero-overlay`: content above video.
- `.wtc-hero-title`: large white heading with red span.
- `.wtc-speed-badge`: small delivery promise.
- `.wtc-hero-highlights`: three benefit columns.
- `.wtc-awards-*`: trophy showcase.
- `.wtc-heat-*`: featured product layout.
- media queries: tablet/mobile sizing, stacking, and spacing.

Deleting the scale can reveal the small source badge at top-left.

Deleting z-index order can put text behind video/shade.

The file is over 1,000 lines partly because so much CSS is embedded. Splitting it later would improve maintenance.

## 20. `resources/js/Pages/HeroLanding.jsx`

This is an older image-based hero.

It defines:

- `textWrap` and `textItem` variants;
- `toppingDrop` spring animation;
- left-side text/buttons/highlights;
- circular pizza image;
- decorative falling topping spans.

It references `/images/canivora.jpg`, which is not in the current listed public images.

It is not imported by active Home or App.

Deleting it currently does not change the active page, but archive/delete only during planned cleanup.

## 21. `resources/js/Pages/HeroSlider.jsx`

This older hero has a `slides` list, active index, pause state, and 6.5-second automatic timer.

`useMemo` chooses current slide.

The effect starts interval unless mouse hover pauses it, then clears interval.

Previous/next functions wrap around the list.

Dots choose a slide directly.

Images use an error fallback.

It imports `resources/css/hero-slider.css`.

It is not active and references images that may not exist.

## 22. `resources/css/hero-slider.css`

This 410-line stylesheet belongs only to HeroSlider.

It contains:

- slider background and full-height layout;
- large heading and buttons;
- 3D-looking pizza stage;
- arrows and dots;
- rotating/entrance keyframe animations;
- responsive tablet/mobile rules;
- reduced-motion override.

Because HeroSlider is not imported, this CSS is also not loaded by active app.jsx. It is imported only if HeroSlider is used.

## 23. `resources/js/Pages/SpecialsSection.jsx`

This older section was covered in the cart lesson.

It uses React Bootstrap cards and Framer `whileInView` stagger.

It is not imported by active Home.

## 24. Public hero media

- `public/videos/hero-pizza-motion.mp4`: active one-shot hero video.
- `public/videos/hero-pizza-ending-loop.mp4`: old generated loop, currently unused.
- `public/images/*`: logo and product images used by active/older components.

Public files use URLs beginning with `/`, not `/public/`.

## What you should remember

- AppShell owns hero readiness so Navbar and words reveal together.
- The active video resets, plays once, slows smoothly for its final two media seconds, and holds the last frame.
- Failure/autoplay rejection reveals content immediately.
- Home also contains awards, featured products, About, Contact, and quick-add logic.
- HeroLanding, HeroSlider, hero-slider.css, and SpecialsSection are older inactive experiments.

## Test yourself

1. Why is `videoRef` needed?
2. When does hero content reveal normally?
3. What playback rate is reached near the end?
4. Does the active video loop?
5. Which hero component is active?

## Answers

1. It lets JavaScript control the real video time, speed, loading, and playback.
2. At the start of the final two media seconds, when slow motion begins.
3. About `0.28x`.
4. No. It ends and stays on the final frame.
5. The HeroSection inside `resources/js/Pages/Home.jsx`.
