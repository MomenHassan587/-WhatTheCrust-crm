# تحميل صور القصة ورسمها على Canvas

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/components/StoryCanvas.vue` · 308 سطر.

**وظيفة الملف:** الصور pre-extracted WebP وليست video autoplay. المكوّن يستقبل time/effects من App، يحمل manifest ويختار frames خفيفة على الهاتف/3g، ويبلغ الأب ready/failure.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/components/StoryCanvas.vue). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/components/App.vue](App.vue.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```vue
<template>
    <div
        class="story-canvas-shell"
        :class="{ 'is-ready': ready, 'is-fallback': fallback, 'is-active': active }"
        :style="shellStyle"
        aria-hidden="true"
    >
        <canvas ref="canvasElement" class="story-canvas"></canvas>
        <div class="story-canvas-tint" :style="{ opacity: overlayOpacity }"></div>

        <div v-if="!ready && !fallback" class="story-loader">
            <div class="story-loader-mark">A</div>
            <span>Preparing your service story</span>
            <div class="story-loader-track"><i :style="{ width: `${loadProgress}%` }"></i></div>
            <strong>{{ loadProgress }}%</strong>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    time: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    fallback: { type: Boolean, default: false },
    canvasOpacity: { type: Number, default: 1 },
    overlayOpacity: { type: Number, default: 0.55 },
    blur: { type: Number, default: 0 },
    brightness: { type: Number, default: 1 },
    scale: { type: Number, default: 1 },
});

const emit = defineEmits(['ready', 'failure']);
const canvasElement = ref(null);
const ready = ref(false);
const loadProgress = ref(0);

let context;
let manifest;
let frameSet;
let resizeObserver;
let animationFrameId;
let idleHandle;
let destroyed = false;
let renderRequest = 0;
let lastDrawKey = '';

const encodedFrames = new Map();
const decodedFrames = new Map();
const decodingFrames = new Map();
const fetchingFrames = new Map();

const shellStyle = computed(() => ({
    opacity: props.canvasOpacity,
    filter: `blur(${props.blur}px) brightness(${props.brightness})`,
    transform: `scale(${props.scale})`,
    backgroundImage: "url('/assets/story/poster.webp')",
}));

function frameUrl(index) {
    const frameNumber = String(index + 1).padStart(4, '0');
    return frameSet.path.replace('%04d', frameNumber);
}

async function fetchEncoded(index) {
    if (index < 0 || index >= frameSet.count) return null;
    if (encodedFrames.has(index)) return encodedFrames.get(index);
    if (fetchingFrames.has(index)) return fetchingFrames.get(index);
    const task = (async () => {
        for (let attempt = 0; attempt < 3; attempt += 1) {
            if (destroyed) throw new Error('Story unmounted.');
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch(frameUrl(index), {
                    cache: attempt ? 'reload' : 'force-cache',
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(`Frame ${index + 1} failed to load.`);
                const blob = await response.blob();
                if (!blob.type.startsWith('image/')) throw new Error('Invalid frame response.');
                if (!destroyed) encodedFrames.set(index, blob);
                return blob;
            } catch (error) {
                if (attempt === 2 || destroyed) throw error;
            } finally {
                clearTimeout(timeout);
            }
        }
    })();
    fetchingFrames.set(index, task);
    try { return await task; } finally { fetchingFrames.delete(index); }
}

async function decodeBlob(blob) {
    if (typeof createImageBitmap === 'function') {
        try { return await createImageBitmap(blob); } catch { /* Try the browser image decoder. */ }
    }
    return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(blob);
        image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Frame could not be decoded.')); };
        image.src = url;
    });
}

async function decodeFrame(index) {
    if (index < 0 || index >= frameSet.count) return null;
    if (decodedFrames.has(index)) return decodedFrames.get(index);
    if (decodingFrames.has(index)) return decodingFrames.get(index);

    const task = fetchEncoded(index)
        .then(decodeBlob)
        .then((bitmap) => {
            if (destroyed) { bitmap.close?.(); throw new Error('Story unmounted.'); }
            decodedFrames.set(index, bitmap);
            decodingFrames.delete(index);
            return bitmap;
        })
        .catch((error) => {
            decodingFrames.delete(index);
            throw error;
        });

    decodingFrames.set(index, task);
    return task;
}

function resizeCanvas() {
    if (!canvasElement.value || !context) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    canvasElement.value.width = Math.round(width * dpr);
    canvasElement.value.height = Math.round(height * dpr);
    canvasElement.value.style.width = `${width}px`;
    canvasElement.value.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    lastDrawKey = '';
    scheduleDraw();
}

function drawCover(bitmap, alpha = 1) {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const imageRatio = bitmap.width / bitmap.height;
    const canvasRatio = canvasWidth / canvasHeight;
    let width;
    let height;

    if (imageRatio > canvasRatio) {
        height = canvasHeight;
        width = height * imageRatio;
    } else {
        width = canvasWidth;
        height = width / imageRatio;
    }

    const mobileOffset = window.innerWidth < 768 ? 0.62 : 0.5;
    const x = (canvasWidth - width) * mobileOffset;
    const y = (canvasHeight - height) / 2;
    context.globalAlpha = alpha;
    context.drawImage(bitmap, x, y, width, height);
}

async function renderFrame() {
    animationFrameId = null;
    if (!props.active || props.fallback || !ready.value || destroyed) return;

    const rawIndex = Math.max(0, Math.min(frameSet.count - 1, props.time * frameSet.fps));
    const lowerIndex = Math.floor(rawIndex);
    const upperIndex = Math.min(frameSet.count - 1, Math.ceil(rawIndex));
    const blend = rawIndex - lowerIndex;
    const drawKey = `${lowerIndex}:${upperIndex}:${blend.toFixed(3)}`;
    if (drawKey === lastDrawKey) return;

    const request = ++renderRequest;
    try {
        const [lower, upper] = await Promise.all([
            decodeFrame(lowerIndex),
            decodeFrame(upperIndex),
        ]);
        if (destroyed || request !== renderRequest || !props.active || props.fallback || !context) return;

        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawCover(lower, 1);
        if (upper && upperIndex !== lowerIndex && blend > 0.001) drawCover(upper, blend);
        context.globalAlpha = 1;
        lastDrawKey = drawKey;
        maintainDecodeWindow(lowerIndex);
    } catch (error) {
        if (!destroyed && request === renderRequest) emit('failure', error);
    }
}

function maintainDecodeWindow(center) {
    const minimum = Math.max(0, center - 30);
    const maximum = Math.min(frameSet.count - 1, center + 30);

    for (const [index, bitmap] of decodedFrames) {
        if (index < minimum || index > maximum) {
            bitmap.close?.();
            decodedFrames.delete(index);
        }
    }

    for (let index = minimum; index <= maximum; index += 1) {
        if (!decodedFrames.has(index) && !decodingFrames.has(index)) {
            decodeFrame(index).catch(() => {});
        }
    }
}

function scheduleDraw() {
    if (animationFrameId || !props.active) return;
    animationFrameId = requestAnimationFrame(renderFrame);
}

function scheduleIdlePreload(startIndex) {
    let cursor = startIndex;
    const loadBatch = async (deadline) => {
        if (destroyed) return;
        let loaded = 0;
        while (!destroyed && !props.fallback && cursor < frameSet.count && loaded < 8 && (!deadline || deadline.didTimeout || deadline.timeRemaining() > 4)) {
            try {
                await fetchEncoded(cursor);
            } catch {
                // A visible-frame failure is handled by renderFrame; idle preloads can retry later.
            }
            cursor += 1;
            loaded += 1;
        }

        if (!destroyed && !props.fallback && cursor < frameSet.count) {
            if ('requestIdleCallback' in window) {
                idleHandle = window.requestIdleCallback(loadBatch, { timeout: 900 });
            } else {
                idleHandle = window.setTimeout(() => loadBatch(null), 90);
            }
        }
    };

    loadBatch(null);
}

async function initialize() {
    if (props.fallback) {
        ready.value = true;
        emit('ready');
        return;
    }

    try {
        const response = await fetch('/assets/story/manifest.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Story manifest failed to load.');
        manifest = await response.json();
        if (destroyed || props.fallback) return;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const preferLightFrames = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
        frameSet = window.innerWidth < 768 || preferLightFrames ? manifest.mobile : manifest.desktop;

        const initialCount = Math.min(24, frameSet.count);
        let completed = 0;
        await Promise.all(Array.from({ length: initialCount }, async (_, index) => {
            await fetchEncoded(index);
            completed += 1;
            loadProgress.value = Math.round((completed / initialCount) * 100);
        }));

        await decodeFrame(0);
        if (destroyed) return;
        ready.value = true;
        emit('ready');
        resizeCanvas();
        scheduleIdlePreload(initialCount);
    } catch (error) {
        if (!destroyed) emit('failure', error);
    }
}

watch(() => props.time, scheduleDraw);
watch(() => props.active, (active) => {
    if (active) scheduleDraw();
});

onMounted(() => {
    context = canvasElement.value?.getContext('2d', { alpha: false });
    resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(document.documentElement);
    initialize();
});

onBeforeUnmount(() => {
    destroyed = true;
    cancelAnimationFrame(animationFrameId);
    resizeObserver?.disconnect();
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
    else clearTimeout(idleHandle);
    for (const bitmap of decodedFrames.values()) bitmap.close?.();
    decodedFrames.clear();
    decodingFrames.clear();
    encodedFrames.clear();
    fetchingFrames.clear();
});
</script>
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### defineProps

يعلن inputs من الأب للوقت والنشاط والفallback والblur والعتامة.

- **بتاخد إيه؟ Inputs:** time,active,fallback,canvasOpacity,overlayOpacity,blur,brightness,scale

- **بترجع/بتغيّر إيه؟ Return / effect:** readonly props proxy

### defineEmits

يعلن حدثي ready وfailure، وemit يرسل الإشعار للأب.

- **بتاخد إيه؟ Inputs:** ['ready','failure']

- **بترجع/بتغيّر إيه؟ Return / effect:** emit function

### shellStyle

CSS محسوب من props للصورة والblur والسطوع والتكبير؛ poster خلفية احتياط.

- **بتاخد إيه؟ Inputs:** props effects

- **بترجع/بتغيّر إيه؟ Return / effect:** computed CSS object

### frameUrl

يحوّل index الصفري لرقم ملف أربع خانات ثم يعوّض %04d.

- **بتاخد إيه؟ Inputs:** index number

- **بترجع/بتغيّر إيه؟ Return / effect:** URL string من frameSet.path

### fetchEncoded

يرجع Blob مخزّن أو Promise قيد التحميل، وإلا يعمل fetch حتى3محاولات مع timeout15s وفحص MIME.

- **بتاخد إيه؟ Inputs:** index number

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<Blob|null>؛ throw عند فشل المحاولة الأخيرة

### decodeBlob

يفك ضغط الصورة createImageBitmap أو Image fallback، ويحرر blob URL في الحالتين.

- **بتاخد إيه؟ Inputs:** blob من response.blob

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<ImageBitmap|HTMLImageElement>

### decodeFrame

يستخدم decoded cache أو decoding Promise لمنع فك نفس الصورة مرتين، ويراعي unmount.

- **بتاخد إيه؟ Inputs:** index number

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<bitmap|null> أو rejected Promise

### resizeCanvas

يضبط حجم canvas ودقة DPR محدودة2 ويعيد جدولة رسم.

- **بتاخد إيه؟ Inputs:** لا parameters؛ canvas ref/window

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined

### drawCover

يرسم الصورة بدون تشويه بحيث تغطي الشاشة، مع crop واختلاف موضع قص الهاتف.

- **بتاخد إيه؟ Inputs:** bitmap,alpha=1

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ canvas context.drawImage side effect

### renderFrame

يحسب frameين من time ويحمّلهما معًا ويblend، ويلغي نتائج رسم قديمة عبر renderRequest.

- **بتاخد إيه؟ Inputs:** يقرأ props.time/frameSet.fps

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>؛ emits failure لو أحدث طلب فشل

### maintainDecodeWindow

يبقي decoded frames ±30حول الحالي ويحذف/يغلق البعيد؛ encoded blobs تظل للتحكم في الشبكة.

- **بتاخد إيه؟ Inputs:** center index

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined

### scheduleDraw

يجمع تغيرات الوقت في requestAnimationFrame واحدة بدل رسم لكل تغيير فورًا.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ animationFrameId handle

### scheduleIdlePreload

يحمل باقي blobs في batches صغيرة حين المتصفح يسمح؛ أخطاء preload غير قاتلة وتُعاد عند الحاجة.

- **بتاخد إيه؟ Inputs:** startIndex

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ يخزن idleHandle

### loadBatch

callback داخلي يحمّل حتى8صور مع ميزانية idle، ثم يجدول نفسه لو باقي صور.

- **بتاخد إيه؟ Inputs:** IdleDeadline أو null

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>؛ nested inside scheduleIdlePreload

### initialize

يقرأ manifest ثم يختار desktop/mobile ويحمّل أول24 blob ويdecode أول صورة ويبلغ ready؛ failure يذهب للأب.

- **بتاخد إيه؟ Inputs:** لا parameters؛ props/browser capabilities

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>

### watch(() => props.time)

أي زمن جديد يجدوِل رسم؛ لا يكتب في props.

- **بتاخد إيه؟ Inputs:** getter وscheduleDraw callback

- **بترجع/بتغيّر إيه؟ Return / effect:** watch stop handle غير مخزن

### watch(() => props.active)

عند دخول المشهد مجددًا يطلب رسم؛ لو غير نشط يتجنب العمل.

- **بتاخد إيه؟ Inputs:** getter وcallback

- **بترجع/بتغيّر إيه؟ Return / effect:** watch stop handle غير مخزن

### onMounted

يحصل على2d context ويشغل ResizeObserver ويبدأ initialize بعد توفر canvas DOM.

- **بتاخد إيه؟ Inputs:** lifecycle callback

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined

### onBeforeUnmount

يمنع النتائج المتأخرة ويلغي animation/idle/observer ويغلق bitmap ويفضي Maps؛ لا يلغي كل fetch فورًا لأن controllers محلية لكل محاولة.

- **بتاخد إيه؟ Inputs:** lifecycle callback

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined

### encodedFrames

Map تخزن Blob مضغوط لتجنب تكرار الشبكة.

- **بتاخد إيه؟ Inputs:** index→Blob

- **بترجع/بتغيّر إيه؟ Return / effect:** Map

### decodedFrames

Map للصور الجاهزة للرسم؛ لها نافذة محدودة لتخفيف الذاكرة.

- **بتاخد إيه؟ Inputs:** index→bitmap

- **بترجع/بتغيّر إيه؟ Return / effect:** Map

### decodingFrames

Map للوعود أثناء decode حتى أكثر من طالب يشترك في نفس العمل.

- **بتاخد إيه؟ Inputs:** index→Promise

- **بترجع/بتغيّر إيه؟ Return / effect:** Map

### fetchingFrames

Map للوعود أثناء fetch لمنع تكرار طلب الملف في نفس الوقت.

- **بتاخد إيه؟ Inputs:** index→Promise

- **بترجع/بتغيّر إيه؟ Return / effect:** Map

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### defineProps

- **جاية منين؟** Vue compiler macro

- **وظيفتها:** يعلن المدخلات التي يبعتها المكوّن الأب؛ لا import داخل script setup.

- **المدخلات — Arguments:** runtime props definition أو type

- **الناتج/الأثر — Return / effect:** readonly props object

- **أول موضع هنا:** السطر 23، والمدخلات المكتوبة: `{     time: { type: Number, default: 0 },     active: { type: Boolean, default: true },     fallback: { type: Boolean, default: false },     canvasOpacity: { type: Number, default:…`.

- **مثال:** const props = defineProps({ time: Number });

### defineEmits

- **جاية منين؟** Vue compiler macro

- **وظيفتها:** يعلن أحداث المكوّن ويعطيك emit لإرسالها للأب.

- **المدخلات — Arguments:** event names أو تعريفات أنواع

- **الناتج/الأثر — Return / effect:** emit function

- **أول موضع هنا:** السطر 34، والمدخلات المكتوبة: `['ready', 'failure']`.

- **مثال:** const emit = defineEmits(['ready']); emit('ready');

### ref

- **جاية منين؟** Vue

- **وظيفتها:** يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** Ref object

- **أول موضع هنا:** السطر 37، والمدخلات المكتوبة: `0`.

- **مثال:** const menuOpen = ref(false); menuOpen.value = true;

### Map

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ مجموعة ربط key→value.

- **المدخلات — Arguments:** iterable أزواج اختيارية.

- **الناتج/الأثر — Return / effect:** Map instance في الذاكرة.

- **أول موضع هنا:** السطر 52.

### computed

- **جاية منين؟** Vue

- **وظيفتها:** قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي.

- **المدخلات — Arguments:** getter function

- **الناتج/الأثر — Return / effect:** ComputedRef

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `() => ({     opacity: props.canvasOpacity,     filter: 'blur(${props.blur}px) brightness(${props.brightness})',     transform: 'scale(${props.scale})',     backgroundImage: "url('/…`.

- **مثال:** const nextVisit = computed(() => upcoming.value[0]);

### String(index + 1).padStart

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تضيف padding لبداية النص حتى طول محدد.

- **المدخلات — Arguments:** targetLength وpadString.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 62، والمدخلات المكتوبة: `4`، `'0'`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 62، والمدخلات المكتوبة: `index + 1`.

### frameSet.path.replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 63، والمدخلات المكتوبة: `'%04d'`، `frameNumber`.

### encodedFrames.has

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 68، والمدخلات المكتوبة: `index`.

### encodedFrames.get

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** القيمة أو undefined.

- **أول موضع هنا:** السطر 68، والمدخلات المكتوبة: `index`.

### fetchingFrames.has

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 69، والمدخلات المكتوبة: `index`.

### fetchingFrames.get

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** القيمة أو undefined.

- **أول موضع هنا:** السطر 69، والمدخلات المكتوبة: `index`.

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 257، والمدخلات المكتوبة: `'Story manifest failed to load.'`.

### AbortController

- **جاية منين؟** Browser

- **وظيفتها:** كائن يوفّر signal لعملية تدعم الإلغاء؛ abort يطلب إلغاء fetch.

- **المدخلات — Arguments:** constructor بلا parameters

- **الناتج/الأثر — Return / effect:** controller instance

- **أول موضع هنا:** السطر 73.

- **مثال:** const controller = new AbortController(); fetch(url,{signal:controller.signal});

### setTimeout

- **جاية منين؟** Browser

- **وظيفتها:** يجدول callback مرة واحدة بعد حد أدنى من الملي ثانية؛ لا ينفذها فورًا ولا يضمن موعدًا دقيقًا.

- **المدخلات — Arguments:** callback,delayMs

- **الناتج/الأثر — Return / effect:** timer id

- **أول موضع هنا:** السطر 74، والمدخلات المكتوبة: `() => controller.abort()`، `15000`.

- **مثال:** const timeout = setTimeout(() => controller.abort(), 15000);

### controller.abort

- **جاية منين؟** AbortController

- **وظيفتها:** ترسل إشارة إلغاء للعمليات الموصولة بهذا controller.

- **المدخلات — Arguments:** reason اختيارية.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 74.

### fetch

- **جاية منين؟** Browser

- **وظيفتها:** يبعت HTTP request ويرجع Promise لاستجابة؛ status404 لا يرفض Promise تلقائيًا ولذلك نفحص response.ok.

- **المدخلات — Arguments:** URL,options مثل cache/signal

- **الناتج/الأثر — Return / effect:** Promise<Response>

- **أول موضع هنا:** السطر 256، والمدخلات المكتوبة: `'/assets/story/manifest.json'`، `{ cache: 'no-cache' }`.

- **مثال:** const response = await fetch('/assets/story/manifest.json', {cache:'no-cache'});

### frameUrl

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحوّل index الصفري لرقم ملف أربع خانات ثم يعوّض %04d.

- **المدخلات — Arguments:** index number

- **الناتج/الأثر — Return / effect:** URL string من frameSet.path

- **أول موضع هنا:** السطر 76، والمدخلات المكتوبة: `index`.

### response.blob

- **جاية منين؟** Browser Fetch Response

- **وظيفتها:** يقرأ body كبيانات binary لصور القصة.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** Promise<Blob>

- **أول موضع هنا:** السطر 81.

- **مثال:** const blob = await response.blob();

### blob.type.startsWith

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تفحص بداية النص.

- **المدخلات — Arguments:** prefix وموضع اختياري.

- **الناتج/الأثر — Return / effect:** Boolean؛ لا تتحقق من وجود ملف.

- **أول موضع هنا:** السطر 82، والمدخلات المكتوبة: `'image/'`.

### encodedFrames.set

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** نفس Map للـchaining.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `index`، `blob`.

### clearTimeout

- **جاية منين؟** Browser

- **وظيفتها:** يلغي timeout لم ينفذ بعد بواسطة id؛ لا يلغي fetch وحده.

- **المدخلات — Arguments:** timer id

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 300، والمدخلات المكتوبة: `idleHandle`.

- **مثال:** finally { clearTimeout(timeout); }

### fetchingFrames.set

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** نفس Map للـchaining.

- **أول موضع هنا:** السطر 92، والمدخلات المكتوبة: `index`، `task`.

### fetchingFrames.delete

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 93، والمدخلات المكتوبة: `index`.

### createImageBitmap

- **جاية منين؟** Browser

- **وظيفتها:** يفك صورة Blob لكائن bitmap قابل للرسم على canvas؛ له close لتحرير الموارد.

- **المدخلات — Arguments:** Blob/image source

- **الناتج/الأثر — Return / effect:** Promise<ImageBitmap>

- **أول موضع هنا:** السطر 98، والمدخلات المكتوبة: `blob`.

- **مثال:** return await createImageBitmap(blob);

### Promise

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ عملية تمثل نتيجة asynchronous.

- **المدخلات — Arguments:** executor يستقبل resolve وreject.

- **الناتج/الأثر — Return / effect:** Promise؛ executor يبدأ فور الإنشاء.

- **أول موضع هنا:** السطر 100، والمدخلات المكتوبة: `(resolve, reject) => {         const image = new Image();         const url = URL.createObjectURL(blob);         image.onload = () => { URL.revokeObjectURL(url); resolve(image); };…`.

### Image

- **جاية منين؟** Browser HTMLImageElement

- **وظيفتها:** تنشئ عنصر صورة في الذاكرة.

- **المدخلات — Arguments:** عرض وارتفاع اختياريان.

- **الناتج/الأثر — Return / effect:** Image element؛ التحميل يبدأ عند src المناسب.

- **أول موضع هنا:** السطر 101.

### URL.createObjectURL

- **جاية منين؟** Browser URL

- **وظيفتها:** يعمل blob: URL مؤقت لبيانات موجودة؛ لا يرفعها على سيرفر.

- **المدخلات — Arguments:** Blob

- **الناتج/الأثر — Return / effect:** string URL

- **أول موضع هنا:** السطر 102، والمدخلات المكتوبة: `blob`.

- **مثال:** const url = URL.createObjectURL(blob);

### URL.revokeObjectURL

- **جاية منين؟** Browser URL

- **وظيفتها:** يفك ربط blob URL بعد الانتهاء لتقليل احتفاظ الموارد.

- **المدخلات — Arguments:** blob URL

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 104، والمدخلات المكتوبة: `url`.

- **مثال:** image.onload = () => { URL.revokeObjectURL(url); resolve(image); };

### resolve

- **جاية منين؟** Promise executor callback

- **وظيفتها:** تحسم العملية بالقيمة/الـthenable الممررة.

- **المدخلات — Arguments:** القيمة.

- **الناتج/الأثر — Return / effect:** undefined من callback نفسها؛ الأثر حسم Promise.

- **أول موضع هنا:** السطر 103، والمدخلات المكتوبة: `image`.

### reject

- **جاية منين؟** Promise executor callback

- **وظيفتها:** ترفض العملية بسبب الخطأ/القيمة.

- **المدخلات — Arguments:** سبب الفشل.

- **الناتج/الأثر — Return / effect:** undefined؛ الـPromise تصبح rejected.

- **أول موضع هنا:** السطر 104، والمدخلات المكتوبة: `new Error('Frame could not be decoded.')`.

### decodedFrames.has

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 210، والمدخلات المكتوبة: `index`.

### decodedFrames.get

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** القيمة أو undefined.

- **أول موضع هنا:** السطر 111، والمدخلات المكتوبة: `index`.

### decodingFrames.has

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 210، والمدخلات المكتوبة: `index`.

### decodingFrames.get

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** القيمة أو undefined.

- **أول موضع هنا:** السطر 112، والمدخلات المكتوبة: `index`.

### fetchEncoded(index)         .then(decodeBlob)         .then((bitmap) => {             if (destroyed) { bitmap.close?.(); throw new Error('Story unmounted.'); }             decodedFrames.set(index, bitmap);             decodingFrames.delete(index);             return bitmap;         })         .catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 114، والمدخلات المكتوبة: `(error) => {             decodingFrames.delete(index);             throw error;         }`.

### fetchEncoded(index)         .then(decodeBlob)         .then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 114، والمدخلات المكتوبة: `(bitmap) => {             if (destroyed) { bitmap.close?.(); throw new Error('Story unmounted.'); }             decodedFrames.set(index, bitmap);             decodingFrames.delete(…`.

### fetchEncoded(index)         .then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 114، والمدخلات المكتوبة: `decodeBlob`.

### fetchEncoded

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يرجع Blob مخزّن أو Promise قيد التحميل، وإلا يعمل fetch حتى3محاولات مع timeout15s وفحص MIME.

- **المدخلات — Arguments:** index number

- **الناتج/الأثر — Return / effect:** Promise<Blob|null>؛ throw عند فشل المحاولة الأخيرة

- **أول موضع هنا:** السطر 267، والمدخلات المكتوبة: `index`.

### bitmap.close

- **جاية منين؟** يعتمد على المستقبِل

- **وظيفتها:** ImageBitmap.close تحرر bitmap؛ dialog.close تغلق حوارًا.

- **المدخلات — Arguments:** حسب المستقبِل؛ الاستخدام المعتاد بدون.

- **الناتج/الأثر — Return / effect:** void في هذين الاستخدامين؛ مش حذف الأصل.

- **أول موضع هنا:** السطر 301.

### decodedFrames.set

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** نفس Map للـchaining.

- **أول موضع هنا:** السطر 118، والمدخلات المكتوبة: `index`، `bitmap`.

### decodingFrames.delete

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 123، والمدخلات المكتوبة: `index`.

### decodingFrames.set

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** نفس Map للـchaining.

- **أول موضع هنا:** السطر 127، والمدخلات المكتوبة: `index`، `task`.

### Math.min

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أصغر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 264، والمدخلات المكتوبة: `24`، `frameSet.count`.

### Math.max

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أكبر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 199، والمدخلات المكتوبة: `0`، `center - 30`.

### Math.round

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** تقرّب عددًا لأقرب integer.

- **المدخلات — Arguments:** number.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 269، والمدخلات المكتوبة: `(completed / initialCount) * 100`.

### context.setTransform

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setTransform هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 140، والمدخلات المكتوبة: `dpr`، `0`، `0`، `dpr`، `0`، `0`.

### scheduleDraw

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يجمع تغيرات الوقت في requestAnimationFrame واحدة بدل رسم لكل تغيير فورًا.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** undefined؛ animationFrameId handle

- **أول موضع هنا:** السطر 285.

### context.drawImage

- **جاية منين؟** Canvas 2D

- **وظيفتها:** ترسم صورة/فيديو في canvas مع أبعاد/قص حسب overload.

- **المدخلات — Arguments:** مصدر الصورة وإحداثيات وأبعاد.

- **الناتج/الأثر — Return / effect:** undefined؛ الأثر رسم البكسلات.

- **أول موضع هنا:** السطر 165، والمدخلات المكتوبة: `bitmap`، `x`، `y`، `width`، `height`.

### Math.floor

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** تأخذ أكبر integer لا يزيد عن العدد.

- **المدخلات — Arguments:** number.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 173، والمدخلات المكتوبة: `rawIndex`.

### Math.ceil

- **جاية منين؟** Math

- **وظيفتها:** تقرب العدد لأعلى integer لا يقل عنه.

- **المدخلات — Arguments:** number.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 174، والمدخلات المكتوبة: `rawIndex`.

### blend.toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 176، والمدخلات المكتوبة: `3`.

### Promise.all

- **جاية منين؟** JavaScript

- **وظيفتها:** يجمع promises ويحافظ على ترتيب النتائج؛ يرفض عند أول رفض ولا يلغي بقية العمليات تلقائيًا.

- **المدخلات — Arguments:** iterable promises

- **الناتج/الأثر — Return / effect:** Promise<array>

- **أول موضع هنا:** السطر 266، والمدخلات المكتوبة: `Array.from({ length: initialCount }, async (_, index) => {             await fetchEncoded(index);             completed += 1;             loadProgress.value = Math.round((completed…`.

- **مثال:** const [lower,upper] = await Promise.all([decodeFrame(lowerIndex),decodeFrame(upperIndex)]);

### decodeFrame

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يستخدم decoded cache أو decoding Promise لمنع فك نفس الصورة مرتين، ويراعي unmount.

- **المدخلات — Arguments:** index number

- **الناتج/الأثر — Return / effect:** Promise<bitmap|null> أو rejected Promise

- **أول موضع هنا:** السطر 272، والمدخلات المكتوبة: `0`.

### context.clearRect

- **جاية منين؟** Canvas 2D

- **وظيفتها:** تمسح مستطيلًا في canvas.

- **المدخلات — Arguments:** x وy وعرض وارتفاع.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 187، والمدخلات المكتوبة: `0`، `0`، `window.innerWidth`، `window.innerHeight`.

### drawCover

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يرسم الصورة بدون تشويه بحيث تغطي الشاشة، مع crop واختلاف موضع قص الهاتف.

- **المدخلات — Arguments:** bitmap,alpha=1

- **الناتج/الأثر — Return / effect:** undefined؛ canvas context.drawImage side effect

- **أول موضع هنا:** السطر 189، والمدخلات المكتوبة: `upper`، `blend`.

### maintainDecodeWindow

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يبقي decoded frames ±30حول الحالي ويحذف/يغلق البعيد؛ encoded blobs تظل للتحكم في الشبكة.

- **المدخلات — Arguments:** center index

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 192، والمدخلات المكتوبة: `lowerIndex`.

### emit

- **جاية منين؟** Vue component

- **وظيفتها:** تبلّغ الأب بحدث المكوّن والبيانات المرتبطة.

- **المدخلات — Arguments:** اسم الحدث ثم payload.

- **الناتج/الأثر — Return / effect:** void؛ البيانات توصل للـlistener، مش من return.

- **أول موضع هنا:** السطر 279، والمدخلات المكتوبة: `'failure'`، `error`.

### decodedFrames.delete

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 205، والمدخلات المكتوبة: `index`.

### decodeFrame(index).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 211، والمدخلات المكتوبة: `() => {}`.

### requestAnimationFrame

- **جاية منين؟** Browser

- **وظيفتها:** يطلب callback مرة قبل فرصة رسم لاحقة؛ التجميع يقلل عمل scroll المكرر.

- **المدخلات — Arguments:** callback(timestamp)

- **الناتج/الأثر — Return / effect:** request id

- **أول موضع هنا:** السطر 218، والمدخلات المكتوبة: `renderFrame`.

- **مثال:** animationFrameId = requestAnimationFrame(renderFrame);

### deadline.timeRemaining

- **جاية منين؟** IdleDeadline

- **وظيفتها:** تقرأ تقدير الوقت المتاح في فرصة idle الحالية.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** عدد milliseconds؛ مش حجز وقت مضمون.

- **أول موضع هنا:** السطر 226.

### window.requestIdleCallback

- **جاية منين؟** Browser

- **وظيفتها:** ترتّب شغلًا عند وقت خمول المتصفح حيث تتوفر API.

- **المدخلات — Arguments:** callback وoptions اختيارية.

- **الناتج/الأثر — Return / effect:** ID؛ التوقيت وtimeout مش ضمان لوجود وقت فراغ.

- **أول موضع هنا:** السطر 238، والمدخلات المكتوبة: `loadBatch`، `{ timeout: 900 }`.

### window.setTimeout

- **جاية منين؟** Browser

- **وظيفتها:** ترتّب نداء callback مرة واحدة بعد التأخير.

- **المدخلات — Arguments:** callback وdelay بالمللي ثانية.

- **الناتج/الأثر — Return / effect:** timer ID في المتصفح.

- **أول موضع هنا:** السطر 240، والمدخلات المكتوبة: `() => loadBatch(null)`، `90`.

### loadBatch

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** callback داخلي يحمّل حتى8صور مع ميزانية idle، ثم يجدول نفسه لو باقي صور.

- **المدخلات — Arguments:** IdleDeadline أو null

- **الناتج/الأثر — Return / effect:** Promise<void>؛ nested inside scheduleIdlePreload

- **أول موضع هنا:** السطر 245، والمدخلات المكتوبة: `null`.

### response.json

- **جاية منين؟** Browser Fetch Response

- **وظيفتها:** يقرأ body ويفك JSON بصورة async؛ ممكن يفشل لو المحتوى مش JSON.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** Promise<JS value>

- **أول موضع هنا:** السطر 258.

- **مثال:** manifest = await response.json();

### ['slow-2g', '2g', '3g'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 261، والمدخلات المكتوبة: `connection?.effectiveType`.

### Array.from

- **جاية منين؟** Array static

- **وظيفتها:** تحوّل iterable/array-like إلى array جديدة.

- **المدخلات — Arguments:** القيمة وmapper اختياري.

- **الناتج/الأثر — Return / effect:** Array.

- **أول موضع هنا:** السطر 266، والمدخلات المكتوبة: `{ length: initialCount }`، `async (_, index) => {             await fetchEncoded(index);             completed += 1;             loadProgress.value = Math.round((completed / initialCount) * 100);         }`.

### resizeCanvas

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يضبط حجم canvas ودقة DPR محدودة2 ويعيد جدولة رسم.

- **المدخلات — Arguments:** لا parameters؛ canvas ref/window

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 276.

### scheduleIdlePreload

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحمل باقي blobs في batches صغيرة حين المتصفح يسمح؛ أخطاء preload غير قاتلة وتُعاد عند الحاجة.

- **المدخلات — Arguments:** startIndex

- **الناتج/الأثر — Return / effect:** undefined؛ يخزن idleHandle

- **أول موضع هنا:** السطر 277، والمدخلات المكتوبة: `initialCount`.

### watch

- **جاية منين؟** Vue

- **وظيفتها:** يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog.

- **المدخلات — Arguments:** source, callback, options مثل deep

- **الناتج/الأثر — Return / effect:** watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه

- **أول موضع هنا:** السطر 284، والمدخلات المكتوبة: `() => props.active`، `(active) => {     if (active) scheduleDraw(); }`.

- **مثال:** watch(state, () => garageRepository.write(state), { deep: true });

### onMounted

- **جاية منين؟** Vue

- **وظيفتها:** يسجل callback للتنفيذ بعد تركيب component وتوفر refs الخاصة بالDOM.

- **المدخلات — Arguments:** callback

- **الناتج/الأثر — Return / effect:** void

- **أول موضع هنا:** السطر 288، والمدخلات المكتوبة: `() => {     context = canvasElement.value?.getContext('2d', { alpha: false });     resizeObserver = new ResizeObserver(resizeCanvas);     resizeObserver.observe(document.documentEl…`.

- **مثال:** onMounted(() => initialize());

### canvasElement.value?.getContext

- **جاية منين؟** Canvas

- **وظيفتها:** تطلب سياق رسم من canvas.

- **المدخلات — Arguments:** نوع مثل 2d وخيارات.

- **الناتج/الأثر — Return / effect:** RenderingContext أو null.

- **أول موضع هنا:** السطر 289، والمدخلات المكتوبة: `'2d'`، `{ alpha: false }`.

### ResizeObserver

- **جاية منين؟** Browser

- **وظيفتها:** يراقب تغير حجم عنصر ويشغّل callback؛ cleanup بdisconnect.

- **المدخلات — Arguments:** callback

- **الناتج/الأثر — Return / effect:** observer instance

- **أول موضع هنا:** السطر 290، والمدخلات المكتوبة: `resizeCanvas`.

- **مثال:** const resizeObserver = new ResizeObserver(updateRunway); resizeObserver.observe(lastCard);

### resizeObserver.observe

- **جاية منين؟** Browser Observer

- **وظيفتها:** تبدأ مراقبة عنصر بالـobserver الحالي.

- **المدخلات — Arguments:** عنصر وخيارات حسب API.

- **الناتج/الأثر — Return / effect:** عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.

- **أول موضع هنا:** السطر 291، والمدخلات المكتوبة: `document.documentElement`.

### initialize

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقرأ manifest ثم يختار desktop/mobile ويحمّل أول24 blob ويdecode أول صورة ويبلغ ready؛ failure يذهب للأب.

- **المدخلات — Arguments:** لا parameters؛ props/browser capabilities

- **الناتج/الأثر — Return / effect:** Promise<void>

- **أول موضع هنا:** السطر 292.

### onBeforeUnmount

- **جاية منين؟** Vue

- **وظيفتها:** يسجل تنظيفًا قبل إزالة component، مثل kill/disconnect/removeListener.

- **المدخلات — Arguments:** callback

- **الناتج/الأثر — Return / effect:** void

- **أول موضع هنا:** السطر 295، والمدخلات المكتوبة: `() => {     destroyed = true;     cancelAnimationFrame(animationFrameId);     resizeObserver?.disconnect();     if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHa…`.

- **مثال:** onBeforeUnmount(() => storyObserver?.disconnect());

### cancelAnimationFrame

- **جاية منين؟** Browser

- **وظيفتها:** يلغي callback rAF مجدول لم ينفذ بعد؛ لا يوقف Promise بدأ بالفعل.

- **المدخلات — Arguments:** request id

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 297، والمدخلات المكتوبة: `animationFrameId`.

- **مثال:** cancelAnimationFrame(animationFrameId);

### resizeObserver?.disconnect

- **جاية منين؟** Browser Observer

- **وظيفتها:** توقف مراقبة الأهداف الخاصة بهذا observer.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 298.

### window.cancelIdleCallback

- **جاية منين؟** Browser

- **وظيفتها:** تلغي idle callback معلّقة.

- **المدخلات — Arguments:** ID.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 299، والمدخلات المكتوبة: `idleHandle`.

### decodedFrames.values

- **جاية منين؟** Object/Map

- **وظيفتها:** Object.values تجمع قيم الخصائص؛ Map.values تجهز مرورًا على القيم.

- **المدخلات — Arguments:** object في الحالة الأولى، ولا arguments في الثانية.

- **الناتج/الأثر — Return / effect:** array من Object.values أو iterator من Map.values؛ اقرأ المستقبِل في السطر.

- **أول موضع هنا:** السطر 301.

### decodedFrames.clear

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 302.

### decodingFrames.clear

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 303.

### encodedFrames.clear

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 304.

### fetchingFrames.clear

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 305.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```vue
<template>
    <div
        class="story-canvas-shell"
        :class="{ 'is-ready': ready, 'is-fallback': fallback, 'is-active': active }"
        :style="shellStyle"
        aria-hidden="true"
    >
        <canvas ref="canvasElement" class="story-canvas"></canvas>
```

**السطر 1:** بداية Vue template / شكل الواجهة؛ تعبيراته تقرأ الحالة والدوال من script المكوّن.

**السطر 2:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 3:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 4:** :class اختصار v-bind:class: قيّم `{ 'is-ready': ready, 'is-fallback': fallback, 'is-active': active }` كـJavaScript وحط النتيجة في الخاصية `class`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 5:** :style اختصار v-bind:style: قيّم `shellStyle` كـJavaScript وحط النتيجة في الخاصية `style`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 6:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 7:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 8:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 9–16

```vue
        <div class="story-canvas-tint" :style="{ opacity: overlayOpacity }"></div>

        <div v-if="!ready && !fallback" class="story-loader">
            <div class="story-loader-mark">A</div>
            <span>Preparing your service story</span>
            <div class="story-loader-track"><i :style="{ width: `${loadProgress}%` }"></i></div>
            <strong>{{ loadProgress }}%</strong>
        </div>
```

**السطر 9:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 11:** `v-if` تعتمد على `!ready && !fallback` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 12:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 13:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 14:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 15:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 16:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 17–24

```vue
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    time: { type: Number, default: 0 },
```

**السطر 17:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 18:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 20:** بداية جزء JavaScript في مكوّن Vue/صفحة HTML. setup في Vue تتيح التعريفات للـtemplate؛ type=module في HTML يحدد تحميل module.

**السطر 21:** Import / استيراد: الأسماء `computed`، `onBeforeUnmount`، `onMounted`، `ref`، `watch` جاية من `vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 23:** Variable declaration / تعريف `props` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `defineProps(...)`: يعلن المدخلات التي يبعتها المكوّن الأب؛ لا import داخل script setup. القيم المكتوبة هنا: `{     time: { type: Number, default: 0 },     active: { type: Boolean, default: true },     fallback: { type: …`. العائد/الأثر: readonly props object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 25–32

```vue
    active: { type: Boolean, default: true },
    fallback: { type: Boolean, default: false },
    canvasOpacity: { type: Number, default: 1 },
    overlayOpacity: { type: Number, default: 0.55 },
    blur: { type: Number, default: 0 },
    brightness: { type: Number, default: 1 },
    scale: { type: Number, default: 1 },
});
```

**السطر 25:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 26:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 27:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 28:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 29:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 30:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 31:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```vue

const emit = defineEmits(['ready', 'failure']);
const canvasElement = ref(null);
const ready = ref(false);
const loadProgress = ref(0);

let context;
let manifest;
```

**السطر 34:** Variable declaration / تعريف `emit` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `defineEmits(...)`: يعلن أحداث المكوّن ويعطيك emit لإرسالها للأب. القيم المكتوبة هنا: `['ready', 'failure']`. العائد/الأثر: emit function. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Variable declaration / تعريف `canvasElement` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `null`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Variable declaration / تعريف `ready` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `false`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Variable declaration / تعريف `loadProgress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `0`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** Variable declaration / تعريف `context` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 40:** Variable declaration / تعريف `manifest` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 41–48

```vue
let frameSet;
let resizeObserver;
let animationFrameId;
let idleHandle;
let destroyed = false;
let renderRequest = 0;
let lastDrawKey = '';

```

**السطر 41:** Variable declaration / تعريف `frameSet` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 42:** Variable declaration / تعريف `resizeObserver` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 43:** Variable declaration / تعريف `animationFrameId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 44:** Variable declaration / تعريف `idleHandle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 45:** Variable declaration / تعريف `destroyed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `false`، مش ناتج طلب شبكة.

**السطر 46:** Variable declaration / تعريف `renderRequest` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 47:** Variable declaration / تعريف `lastDrawKey` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `""`، مش ناتج طلب شبكة.

### السطور 49–56

```vue
const encodedFrames = new Map();
const decodedFrames = new Map();
const decodingFrames = new Map();
const fetchingFrames = new Map();

const shellStyle = computed(() => ({
    opacity: props.canvasOpacity,
    filter: `blur(${props.blur}px) brightness(${props.brightness})`,
```

**السطر 49:** Variable declaration / تعريف `encodedFrames` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `encodedFrames` هنا: Map تخزن Blob مضغوط لتجنب تكرار الشبكة. المدخلات: index→Blob. الناتج/الأثر: Map. الدوال الموجودة في السطر: `Map(...)`: تنشئ مجموعة ربط key→value. مدخلاتها: iterable أزواج اختيارية. العائد/الأثر: Map instance في الذاكرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** Variable declaration / تعريف `decodedFrames` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `decodedFrames` هنا: Map للصور الجاهزة للرسم؛ لها نافذة محدودة لتخفيف الذاكرة. المدخلات: index→bitmap. الناتج/الأثر: Map. الدوال الموجودة في السطر: `Map(...)`: تنشئ مجموعة ربط key→value. مدخلاتها: iterable أزواج اختيارية. العائد/الأثر: Map instance في الذاكرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** Variable declaration / تعريف `decodingFrames` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `decodingFrames` هنا: Map للوعود أثناء decode حتى أكثر من طالب يشترك في نفس العمل. المدخلات: index→Promise. الناتج/الأثر: Map. الدوال الموجودة في السطر: `Map(...)`: تنشئ مجموعة ربط key→value. مدخلاتها: iterable أزواج اختيارية. العائد/الأثر: Map instance في الذاكرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Variable declaration / تعريف `fetchingFrames` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `fetchingFrames` هنا: Map للوعود أثناء fetch لمنع تكرار طلب الملف في نفس الوقت. المدخلات: index→Promise. الناتج/الأثر: Map. الدوال الموجودة في السطر: `Map(...)`: تنشئ مجموعة ربط key→value. مدخلاتها: iterable أزواج اختيارية. العائد/الأثر: Map instance في الذاكرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 54:** Variable declaration / تعريف `shellStyle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `shellStyle` هنا: CSS محسوب من props للصورة والblur والسطوع والتكبير؛ poster خلفية احتياط. المدخلات: props effects. الناتج/الأثر: computed CSS object. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => ({     opacity: props.canvasOpacity,     filter: 'blur(${props.blur}px) brightness(${props.brightness})'…`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 56:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 57–64

```vue
    transform: `scale(${props.scale})`,
    backgroundImage: "url('/assets/story/poster.webp')",
}));

function frameUrl(index) {
    const frameNumber = String(index + 1).padStart(4, '0');
    return frameSet.path.replace('%04d', frameNumber);
}
```

**السطر 57:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 58:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 59:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 61:** Function / تعريف دالة `frameUrl`؛ تعريفها مش تشغيلها. يحوّل index الصفري لرقم ملف أربع خانات ثم يعوّض %04d. مدخلاتها: index number ناتجها: URL string من frameSet.path

**السطر 62:** Variable declaration / تعريف `frameNumber` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `String(index + 1).padStart(...)`: تضيف padding لبداية النص حتى طول محدد. القيم المكتوبة هنا: `4`، `'0'`. العائد/الأثر: نص جديد.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `index + 1`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** Return / رجّع `frameSet.path.replace('%04d', frameNumber)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `frameSet.path.replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `'%04d'`، `frameNumber`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```vue

async function fetchEncoded(index) {
    if (index < 0 || index >= frameSet.count) return null;
    if (encodedFrames.has(index)) return encodedFrames.get(index);
    if (fetchingFrames.has(index)) return fetchingFrames.get(index);
    const task = (async () => {
        for (let attempt = 0; attempt < 3; attempt += 1) {
            if (destroyed) throw new Error('Story unmounted.');
```

**السطر 66:** Function / تعريف دالة `fetchEncoded`؛ تعريفها مش تشغيلها. يرجع Blob مخزّن أو Promise قيد التحميل، وإلا يعمل fetch حتى3محاولات مع timeout15s وفحص MIME. مدخلاتها: index number ناتجها: Promise<Blob|null>؛ throw عند فشل المحاولة الأخيرة

**السطر 67:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 68:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `encodedFrames.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.؛ `encodedFrames.get(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: القيمة أو undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 69:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `fetchingFrames.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.؛ `fetchingFrames.get(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: القيمة أو undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 70:** Variable declaration / تعريف `task` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 71:** Variable declaration / تعريف `attempt` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 72:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Story unmounted.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 73–80

```vue
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch(frameUrl(index), {
                    cache: attempt ? 'reload' : 'force-cache',
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(`Frame ${index + 1} failed to load.`);
```

**السطر 73:** Variable declaration / تعريف `controller` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `AbortController(...)`: كائن يوفّر signal لعملية تدعم الإلغاء؛ abort يطلب إلغاء fetch. مدخلاتها: constructor بلا parameters العائد/الأثر: controller instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 74:** Variable declaration / تعريف `timeout` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `setTimeout(...)`: يجدول callback مرة واحدة بعد حد أدنى من الملي ثانية؛ لا ينفذها فورًا ولا يضمن موعدًا دقيقًا. القيم المكتوبة هنا: `() => controller.abort()`، `15000`. العائد/الأثر: timer id؛ `controller.abort(...)`: ترسل إشارة إلغاء للعمليات الموصولة بهذا controller. مدخلاتها: reason اختيارية. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 75:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 76:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `fetch(...)`: يبعت HTTP request ويرجع Promise لاستجابة؛ status404 لا يرفض Promise تلقائيًا ولذلك نفحص response.ok. القيم المكتوبة هنا: `frameUrl(index)`، `{                     cache: attempt ? 'reload' : 'force-cache',                     signal: controller.signal…`. العائد/الأثر: Promise<Response>؛ `frameUrl(...)`: يحوّل index الصفري لرقم ملف أربع خانات ثم يعوّض %04d. القيم المكتوبة هنا: `index`. العائد/الأثر: URL string من frameSet.path. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 77:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 78:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 79:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 80:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Frame ${index + 1} failed to load.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 81–88

```vue
                const blob = await response.blob();
                if (!blob.type.startsWith('image/')) throw new Error('Invalid frame response.');
                if (!destroyed) encodedFrames.set(index, blob);
                return blob;
            } catch (error) {
                if (attempt === 2 || destroyed) throw error;
            } finally {
                clearTimeout(timeout);
```

**السطر 81:** Variable declaration / تعريف `blob` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `response.blob(...)`: يقرأ body كبيانات binary لصور القصة. مدخلاتها: لا شيء العائد/الأثر: Promise<Blob>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 82:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `blob.type.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'image/'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.؛ `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Invalid frame response.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 83:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `encodedFrames.set(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`، `blob`. العائد/الأثر: نفس Map للـchaining.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 84:** Return / رجّع `blob` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 85:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 86:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 87:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 88:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `clearTimeout(...)`: يلغي timeout لم ينفذ بعد بواسطة id؛ لا يلغي fetch وحده. القيم المكتوبة هنا: `timeout`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 89–96

```vue
            }
        }
    })();
    fetchingFrames.set(index, task);
    try { return await task; } finally { fetchingFrames.delete(index); }
}

async function decodeBlob(blob) {
```

**السطر 89:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 90:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 91:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 92:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `fetchingFrames.set(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`، `task`. العائد/الأثر: نفس Map للـchaining.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 93:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة. الدوال الموجودة في السطر: `fetchingFrames.delete(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 96:** Function / تعريف دالة `decodeBlob`؛ تعريفها مش تشغيلها. يفك ضغط الصورة createImageBitmap أو Image fallback، ويحرر blob URL في الحالتين. مدخلاتها: blob من response.blob ناتجها: Promise<ImageBitmap|HTMLImageElement>

### السطور 97–104

```vue
    if (typeof createImageBitmap === 'function') {
        try { return await createImageBitmap(blob); } catch { /* Try the browser image decoder. */ }
    }
    return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(blob);
        image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Frame could not be decoded.')); };
```

**السطر 97:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 98:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة. الدوال الموجودة في السطر: `createImageBitmap(...)`: يفك صورة Blob لكائن bitmap قابل للرسم على canvas؛ له close لتحرير الموارد. القيم المكتوبة هنا: `blob`. العائد/الأثر: Promise<ImageBitmap>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 100:** Return / رجّع `new Promise((resolve, reject) => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `Promise(...)`: تنشئ عملية تمثل نتيجة asynchronous. القيم المكتوبة هنا: `(resolve, reject) => {         const image = new Image();         const url = URL.createObjectURL(blob);      …`. العائد/الأثر: Promise؛ executor يبدأ فور الإنشاء.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 101:** Variable declaration / تعريف `image` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Image(...)`: تنشئ عنصر صورة في الذاكرة. مدخلاتها: عرض وارتفاع اختياريان. العائد/الأثر: Image element؛ التحميل يبدأ عند src المناسب.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 102:** Variable declaration / تعريف `url` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `URL.createObjectURL(...)`: يعمل blob: URL مؤقت لبيانات موجودة؛ لا يرفعها على سيرفر. القيم المكتوبة هنا: `blob`. العائد/الأثر: string URL. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 103:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `URL.revokeObjectURL(...)`: يفك ربط blob URL بعد الانتهاء لتقليل احتفاظ الموارد. القيم المكتوبة هنا: `url`. العائد/الأثر: undefined؛ `resolve(...)`: تحسم العملية بالقيمة/الـthenable الممررة. القيم المكتوبة هنا: `image`. العائد/الأثر: undefined من callback نفسها؛ الأثر حسم Promise.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 104:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `URL.revokeObjectURL(...)`: يفك ربط blob URL بعد الانتهاء لتقليل احتفاظ الموارد. القيم المكتوبة هنا: `url`. العائد/الأثر: undefined؛ `reject(...)`: ترفض العملية بسبب الخطأ/القيمة. القيم المكتوبة هنا: `new Error('Frame could not be decoded.')`. العائد/الأثر: undefined؛ الـPromise تصبح rejected.؛ `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Frame could not be decoded.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 105–112

```vue
        image.src = url;
    });
}

async function decodeFrame(index) {
    if (index < 0 || index >= frameSet.count) return null;
    if (decodedFrames.has(index)) return decodedFrames.get(index);
    if (decodingFrames.has(index)) return decodingFrames.get(index);
```

**السطر 105:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 106:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 107:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 109:** Function / تعريف دالة `decodeFrame`؛ تعريفها مش تشغيلها. يستخدم decoded cache أو decoding Promise لمنع فك نفس الصورة مرتين، ويراعي unmount. مدخلاتها: index number ناتجها: Promise<bitmap|null> أو rejected Promise

**السطر 110:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 111:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `decodedFrames.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.؛ `decodedFrames.get(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: القيمة أو undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 112:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `decodingFrames.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.؛ `decodingFrames.get(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: القيمة أو undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 113–120

```vue

    const task = fetchEncoded(index)
        .then(decodeBlob)
        .then((bitmap) => {
            if (destroyed) { bitmap.close?.(); throw new Error('Story unmounted.'); }
            decodedFrames.set(index, bitmap);
            decodingFrames.delete(index);
            return bitmap;
```

**السطر 114:** Variable declaration / تعريف `task` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `fetchEncoded(index)         .then(decodeBlob)         .then((bitmap) => {             if (destroyed) { bitmap.close?.(); throw new Error('Story unmounted.'); }             decodedFrames.set(index, bitmap);             decodingFrames.delete(index);             return bitmap;         })         .catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(error) => {             decodingFrames.delete(index);             throw error;         }`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `fetchEncoded(index)         .then(decodeBlob)         .then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `(bitmap) => {             if (destroyed) { bitmap.close?.(); throw new Error('Story unmounted.'); }           …`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `fetchEncoded(index)         .then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `decodeBlob`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `fetchEncoded(...)`: يرجع Blob مخزّن أو Promise قيد التحميل، وإلا يعمل fetch حتى3محاولات مع timeout15s وفحص MIME. القيم المكتوبة هنا: `index`. العائد/الأثر: Promise<Blob|null>؛ throw عند فشل المحاولة الأخيرة. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 115:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 116:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 117:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `bitmap.close(...)`: ImageBitmap.close تحرر bitmap؛ dialog.close تغلق حوارًا. مدخلاتها: حسب المستقبِل؛ الاستخدام المعتاد بدون. العائد/الأثر: void في هذين الاستخدامين؛ مش حذف الأصل.؛ `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Story unmounted.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 118:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodedFrames.set(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`، `bitmap`. العائد/الأثر: نفس Map للـchaining.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 119:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodingFrames.delete(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 120:** Return / رجّع `bitmap` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 121–128

```vue
        })
        .catch((error) => {
            decodingFrames.delete(index);
            throw error;
        });

    decodingFrames.set(index, task);
    return task;
```

**السطر 121:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 122:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 123:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodingFrames.delete(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 124:** Throw / ارمِ خطأ وأوقف المسار الحالي؛ الدالة async تتحول Promise الخاصة بها إلى rejected لو لم يُمسك الخطأ داخلها.

**السطر 125:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 127:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodingFrames.set(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`، `task`. العائد/الأثر: نفس Map للـchaining.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 128:** Return / رجّع `task` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 129–136

```vue
}

function resizeCanvas() {
    if (!canvasElement.value || !context) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    canvasElement.value.width = Math.round(width * dpr);
```

**السطر 129:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 131:** Function / تعريف دالة `resizeCanvas`؛ تعريفها مش تشغيلها. يضبط حجم canvas ودقة DPR محدودة2 ويعيد جدولة رسم. مدخلاتها: لا parameters؛ canvas ref/window ناتجها: undefined

**السطر 132:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 133:** Variable declaration / تعريف `dpr` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `window.devicePixelRatio || 1`، `2`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 134:** Variable declaration / تعريف `width` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `1`، `window.innerWidth`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 135:** Variable declaration / تعريف `height` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `1`، `window.innerHeight`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 136:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `Math.round(...)`: تقرّب عددًا لأقرب integer. القيم المكتوبة هنا: `width * dpr`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 137–144

```vue
    canvasElement.value.height = Math.round(height * dpr);
    canvasElement.value.style.width = `${width}px`;
    canvasElement.value.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    lastDrawKey = '';
    scheduleDraw();
}

```

**السطر 137:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `Math.round(...)`: تقرّب عددًا لأقرب integer. القيم المكتوبة هنا: `height * dpr`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 138:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 139:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 140:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `context.setTransform(...)`: لو setTransform هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `dpr`، `0`، `0`، `dpr`، `0`، `0`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 141:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 142:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `scheduleDraw(...)`: يجمع تغيرات الوقت في requestAnimationFrame واحدة بدل رسم لكل تغيير فورًا. مدخلاتها: لا شيء العائد/الأثر: undefined؛ animationFrameId handle. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 143:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 145–152

```vue
function drawCover(bitmap, alpha = 1) {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const imageRatio = bitmap.width / bitmap.height;
    const canvasRatio = canvasWidth / canvasHeight;
    let width;
    let height;

```

**السطر 145:** Function / تعريف دالة `drawCover`؛ تعريفها مش تشغيلها. يرسم الصورة بدون تشويه بحيث تغطي الشاشة، مع crop واختلاف موضع قص الهاتف. مدخلاتها: bitmap,alpha=1 ناتجها: undefined؛ canvas context.drawImage side effect

**السطر 146:** Variable declaration / تعريف `canvasWidth` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 147:** Variable declaration / تعريف `canvasHeight` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 148:** Variable declaration / تعريف `imageRatio` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 149:** Variable declaration / تعريف `canvasRatio` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 150:** Variable declaration / تعريف `width` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 151:** Variable declaration / تعريف `height` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 153–160

```vue
    if (imageRatio > canvasRatio) {
        height = canvasHeight;
        width = height * imageRatio;
    } else {
        width = canvasWidth;
        height = width / imageRatio;
    }

```

**السطر 153:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 154:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 155:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 156:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 157:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 158:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 159:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 161–168

```vue
    const mobileOffset = window.innerWidth < 768 ? 0.62 : 0.5;
    const x = (canvasWidth - width) * mobileOffset;
    const y = (canvasHeight - height) / 2;
    context.globalAlpha = alpha;
    context.drawImage(bitmap, x, y, width, height);
}

async function renderFrame() {
```

**السطر 161:** Variable declaration / تعريف `mobileOffset` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 162:** Variable declaration / تعريف `x` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 163:** Variable declaration / تعريف `y` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 164:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 165:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `context.drawImage(...)`: ترسم صورة/فيديو في canvas مع أبعاد/قص حسب overload. القيم المكتوبة هنا: `bitmap`، `x`، `y`، `width`، `height`. العائد/الأثر: undefined؛ الأثر رسم البكسلات.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 166:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 168:** Function / تعريف دالة `renderFrame`؛ تعريفها مش تشغيلها. يحسب frameين من time ويحمّلهما معًا ويblend، ويلغي نتائج رسم قديمة عبر renderRequest. مدخلاتها: يقرأ props.time/frameSet.fps ناتجها: Promise<void>؛ emits failure لو أحدث طلب فشل

### السطور 169–176

```vue
    animationFrameId = null;
    if (!props.active || props.fallback || !ready.value || destroyed) return;

    const rawIndex = Math.max(0, Math.min(frameSet.count - 1, props.time * frameSet.fps));
    const lowerIndex = Math.floor(rawIndex);
    const upperIndex = Math.min(frameSet.count - 1, Math.ceil(rawIndex));
    const blend = rawIndex - lowerIndex;
    const drawKey = `${lowerIndex}:${upperIndex}:${blend.toFixed(3)}`;
```

**السطر 169:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 170:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 172:** Variable declaration / تعريف `rawIndex` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `0`، `Math.min(frameSet.count - 1, props.time * frameSet.fps)`. العائد/الأثر: number.؛ `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `frameSet.count - 1`، `props.time * frameSet.fps`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 173:** Variable declaration / تعريف `lowerIndex` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.floor(...)`: تأخذ أكبر integer لا يزيد عن العدد. القيم المكتوبة هنا: `rawIndex`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 174:** Variable declaration / تعريف `upperIndex` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `frameSet.count - 1`، `Math.ceil(rawIndex)`. العائد/الأثر: number.؛ `Math.ceil(...)`: تقرب العدد لأعلى integer لا يقل عنه. القيم المكتوبة هنا: `rawIndex`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 175:** Variable declaration / تعريف `blend` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 176:** Variable declaration / تعريف `drawKey` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `blend.toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `3`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 177–184

```vue
    if (drawKey === lastDrawKey) return;

    const request = ++renderRequest;
    try {
        const [lower, upper] = await Promise.all([
            decodeFrame(lowerIndex),
            decodeFrame(upperIndex),
        ]);
```

**السطر 177:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 179:** Variable declaration / تعريف `request` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 180:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 181:** Variable declaration / تعريف `lower + upper` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Promise.all(...)`: يجمع promises ويحافظ على ترتيب النتائج؛ يرفض عند أول رفض ولا يلغي بقية العمليات تلقائيًا. القيم المكتوبة هنا: `[             decodeFrame(lowerIndex),             decodeFrame(upperIndex),         ]`. العائد/الأثر: Promise<array>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 182:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodeFrame(...)`: يستخدم decoded cache أو decoding Promise لمنع فك نفس الصورة مرتين، ويراعي unmount. القيم المكتوبة هنا: `lowerIndex`. العائد/الأثر: Promise<bitmap|null> أو rejected Promise. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 183:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodeFrame(...)`: يستخدم decoded cache أو decoding Promise لمنع فك نفس الصورة مرتين، ويراعي unmount. القيم المكتوبة هنا: `upperIndex`. العائد/الأثر: Promise<bitmap|null> أو rejected Promise. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 184:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 185–192

```vue
        if (destroyed || request !== renderRequest || !props.active || props.fallback || !context) return;

        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawCover(lower, 1);
        if (upper && upperIndex !== lowerIndex && blend > 0.001) drawCover(upper, blend);
        context.globalAlpha = 1;
        lastDrawKey = drawKey;
        maintainDecodeWindow(lowerIndex);
```

**السطر 185:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 187:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `context.clearRect(...)`: تمسح مستطيلًا في canvas. القيم المكتوبة هنا: `0`، `0`، `window.innerWidth`، `window.innerHeight`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 188:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `drawCover(...)`: يرسم الصورة بدون تشويه بحيث تغطي الشاشة، مع crop واختلاف موضع قص الهاتف. القيم المكتوبة هنا: `lower`، `1`. العائد/الأثر: undefined؛ canvas context.drawImage side effect. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 189:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `drawCover(...)`: يرسم الصورة بدون تشويه بحيث تغطي الشاشة، مع crop واختلاف موضع قص الهاتف. القيم المكتوبة هنا: `upper`، `blend`. العائد/الأثر: undefined؛ canvas context.drawImage side effect. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 190:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 191:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 192:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `maintainDecodeWindow(...)`: يبقي decoded frames ±30حول الحالي ويحذف/يغلق البعيد؛ encoded blobs تظل للتحكم في الشبكة. القيم المكتوبة هنا: `lowerIndex`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 193–200

```vue
    } catch (error) {
        if (!destroyed && request === renderRequest) emit('failure', error);
    }
}

function maintainDecodeWindow(center) {
    const minimum = Math.max(0, center - 30);
    const maximum = Math.min(frameSet.count - 1, center + 30);
```

**السطر 193:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 194:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `emit(...)`: تبلّغ الأب بحدث المكوّن والبيانات المرتبطة. القيم المكتوبة هنا: `'failure'`، `error`. العائد/الأثر: void؛ البيانات توصل للـlistener، مش من return.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 195:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 196:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 198:** Function / تعريف دالة `maintainDecodeWindow`؛ تعريفها مش تشغيلها. يبقي decoded frames ±30حول الحالي ويحذف/يغلق البعيد؛ encoded blobs تظل للتحكم في الشبكة. مدخلاتها: center index ناتجها: undefined

**السطر 199:** Variable declaration / تعريف `minimum` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `0`، `center - 30`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 200:** Variable declaration / تعريف `maximum` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `frameSet.count - 1`، `center + 30`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 201–208

```vue

    for (const [index, bitmap] of decodedFrames) {
        if (index < minimum || index > maximum) {
            bitmap.close?.();
            decodedFrames.delete(index);
        }
    }

```

**السطر 202:** Variable declaration / تعريف `index + bitmap` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 203:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 204:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `bitmap.close(...)`: ImageBitmap.close تحرر bitmap؛ dialog.close تغلق حوارًا. مدخلاتها: حسب المستقبِل؛ الاستخدام المعتاد بدون. العائد/الأثر: void في هذين الاستخدامين؛ مش حذف الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 205:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodedFrames.delete(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 206:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 207:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 209–216

```vue
    for (let index = minimum; index <= maximum; index += 1) {
        if (!decodedFrames.has(index) && !decodingFrames.has(index)) {
            decodeFrame(index).catch(() => {});
        }
    }
}

function scheduleDraw() {
```

**السطر 209:** Variable declaration / تعريف `index` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 210:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `decodedFrames.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.؛ `decodingFrames.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `index`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 211:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي. الدوال الموجودة في السطر: `decodeFrame(index).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `() => {}`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `decodeFrame(...)`: يستخدم decoded cache أو decoding Promise لمنع فك نفس الصورة مرتين، ويراعي unmount. القيم المكتوبة هنا: `index`. العائد/الأثر: Promise<bitmap|null> أو rejected Promise. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 212:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 213:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 214:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 216:** Function / تعريف دالة `scheduleDraw`؛ تعريفها مش تشغيلها. يجمع تغيرات الوقت في requestAnimationFrame واحدة بدل رسم لكل تغيير فورًا. مدخلاتها: لا شيء ناتجها: undefined؛ animationFrameId handle

### السطور 217–224

```vue
    if (animationFrameId || !props.active) return;
    animationFrameId = requestAnimationFrame(renderFrame);
}

function scheduleIdlePreload(startIndex) {
    let cursor = startIndex;
    const loadBatch = async (deadline) => {
        if (destroyed) return;
```

**السطر 217:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 218:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `requestAnimationFrame(...)`: يطلب callback مرة قبل فرصة رسم لاحقة؛ التجميع يقلل عمل scroll المكرر. القيم المكتوبة هنا: `renderFrame`. العائد/الأثر: request id. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 219:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 221:** Function / تعريف دالة `scheduleIdlePreload`؛ تعريفها مش تشغيلها. يحمل باقي blobs في batches صغيرة حين المتصفح يسمح؛ أخطاء preload غير قاتلة وتُعاد عند الحاجة. مدخلاتها: startIndex ناتجها: undefined؛ يخزن idleHandle

**السطر 222:** Variable declaration / تعريف `cursor` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 223:** Variable declaration / تعريف `loadBatch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `loadBatch` هنا: callback داخلي يحمّل حتى8صور مع ميزانية idle، ثم يجدول نفسه لو باقي صور. المدخلات: IdleDeadline أو null. الناتج/الأثر: Promise<void>؛ nested inside scheduleIdlePreload.

**السطر 224:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 225–232

```vue
        let loaded = 0;
        while (!destroyed && !props.fallback && cursor < frameSet.count && loaded < 8 && (!deadline || deadline.didTimeout || deadline.timeRemaining() > 4)) {
            try {
                await fetchEncoded(cursor);
            } catch {
                // A visible-frame failure is handled by renderFrame; idle preloads can retry later.
            }
            cursor += 1;
```

**السطر 225:** Variable declaration / تعريف `loaded` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 226:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة. الدوال الموجودة في السطر: `deadline.timeRemaining(...)`: تقرأ تقدير الوقت المتاح في فرصة idle الحالية. مدخلاتها: بدون arguments. العائد/الأثر: عدد milliseconds؛ مش حجز وقت مضمون.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 227:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 228:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `fetchEncoded(...)`: يرجع Blob مخزّن أو Promise قيد التحميل، وإلا يعمل fetch حتى3محاولات مع timeout15s وفحص MIME. القيم المكتوبة هنا: `cursor`. العائد/الأثر: Promise<Blob|null>؛ throw عند فشل المحاولة الأخيرة. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 229:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 230:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 231:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 232:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 233–240

```vue
            loaded += 1;
        }

        if (!destroyed && !props.fallback && cursor < frameSet.count) {
            if ('requestIdleCallback' in window) {
                idleHandle = window.requestIdleCallback(loadBatch, { timeout: 900 });
            } else {
                idleHandle = window.setTimeout(() => loadBatch(null), 90);
```

**السطر 233:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 234:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 236:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 237:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 238:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `window.requestIdleCallback(...)`: ترتّب شغلًا عند وقت خمول المتصفح حيث تتوفر API. القيم المكتوبة هنا: `loadBatch`، `{ timeout: 900 }`. العائد/الأثر: ID؛ التوقيت وtimeout مش ضمان لوجود وقت فراغ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 239:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 240:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `window.setTimeout(...)`: ترتّب نداء callback مرة واحدة بعد التأخير. القيم المكتوبة هنا: `() => loadBatch(null)`، `90`. العائد/الأثر: timer ID في المتصفح.؛ `loadBatch(...)`: callback داخلي يحمّل حتى8صور مع ميزانية idle، ثم يجدول نفسه لو باقي صور. القيم المكتوبة هنا: `null`. العائد/الأثر: Promise<void>؛ nested inside scheduleIdlePreload. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 241–248

```vue
            }
        }
    };

    loadBatch(null);
}

async function initialize() {
```

**السطر 241:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 242:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 243:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 245:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `loadBatch(...)`: callback داخلي يحمّل حتى8صور مع ميزانية idle، ثم يجدول نفسه لو باقي صور. القيم المكتوبة هنا: `null`. العائد/الأثر: Promise<void>؛ nested inside scheduleIdlePreload. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 246:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 248:** Function / تعريف دالة `initialize`؛ تعريفها مش تشغيلها. يقرأ manifest ثم يختار desktop/mobile ويحمّل أول24 blob ويdecode أول صورة ويبلغ ready؛ failure يذهب للأب. مدخلاتها: لا parameters؛ props/browser capabilities ناتجها: Promise<void>

### السطور 249–256

```vue
    if (props.fallback) {
        ready.value = true;
        emit('ready');
        return;
    }

    try {
        const response = await fetch('/assets/story/manifest.json', { cache: 'no-cache' });
```

**السطر 249:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 250:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 251:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `emit(...)`: تبلّغ الأب بحدث المكوّن والبيانات المرتبطة. القيم المكتوبة هنا: `'ready'`. العائد/الأثر: void؛ البيانات توصل للـlistener، مش من return.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 252:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 253:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 255:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 256:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `fetch(...)`: يبعت HTTP request ويرجع Promise لاستجابة؛ status404 لا يرفض Promise تلقائيًا ولذلك نفحص response.ok. القيم المكتوبة هنا: `'/assets/story/manifest.json'`، `{ cache: 'no-cache' }`. العائد/الأثر: Promise<Response>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 257–264

```vue
        if (!response.ok) throw new Error('Story manifest failed to load.');
        manifest = await response.json();
        if (destroyed || props.fallback) return;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const preferLightFrames = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
        frameSet = window.innerWidth < 768 || preferLightFrames ? manifest.mobile : manifest.desktop;

        const initialCount = Math.min(24, frameSet.count);
```

**السطر 257:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Story manifest failed to load.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 258:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `response.json(...)`: يقرأ body ويفك JSON بصورة async؛ ممكن يفشل لو المحتوى مش JSON. مدخلاتها: لا شيء العائد/الأثر: Promise<JS value>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 259:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 260:** Variable declaration / تعريف `connection` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 261:** Variable declaration / تعريف `preferLightFrames` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `['slow-2g', '2g', '3g'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `connection?.effectiveType`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 262:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 264:** Variable declaration / تعريف `initialCount` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `24`، `frameSet.count`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 265–272

```vue
        let completed = 0;
        await Promise.all(Array.from({ length: initialCount }, async (_, index) => {
            await fetchEncoded(index);
            completed += 1;
            loadProgress.value = Math.round((completed / initialCount) * 100);
        }));

        await decodeFrame(0);
```

**السطر 265:** Variable declaration / تعريف `completed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 266:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Promise.all(...)`: يجمع promises ويحافظ على ترتيب النتائج؛ يرفض عند أول رفض ولا يلغي بقية العمليات تلقائيًا. القيم المكتوبة هنا: `Array.from({ length: initialCount }, async (_, index) => {             await fetchEncoded(index);             …`. العائد/الأثر: Promise<array>؛ `Array.from(...)`: تحوّل iterable/array-like إلى array جديدة. القيم المكتوبة هنا: `{ length: initialCount }`، `async (_, index) => {             await fetchEncoded(index);             completed += 1;             loadProgr…`. العائد/الأثر: Array.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 267:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `fetchEncoded(...)`: يرجع Blob مخزّن أو Promise قيد التحميل، وإلا يعمل fetch حتى3محاولات مع timeout15s وفحص MIME. القيم المكتوبة هنا: `index`. العائد/الأثر: Promise<Blob|null>؛ throw عند فشل المحاولة الأخيرة. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 268:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 269:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `Math.round(...)`: تقرّب عددًا لأقرب integer. القيم المكتوبة هنا: `(completed / initialCount) * 100`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 270:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 272:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodeFrame(...)`: يستخدم decoded cache أو decoding Promise لمنع فك نفس الصورة مرتين، ويراعي unmount. القيم المكتوبة هنا: `0`. العائد/الأثر: Promise<bitmap|null> أو rejected Promise. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 273–280

```vue
        if (destroyed) return;
        ready.value = true;
        emit('ready');
        resizeCanvas();
        scheduleIdlePreload(initialCount);
    } catch (error) {
        if (!destroyed) emit('failure', error);
    }
```

**السطر 273:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 274:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 275:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `emit(...)`: تبلّغ الأب بحدث المكوّن والبيانات المرتبطة. القيم المكتوبة هنا: `'ready'`. العائد/الأثر: void؛ البيانات توصل للـlistener، مش من return.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 276:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `resizeCanvas(...)`: يضبط حجم canvas ودقة DPR محدودة2 ويعيد جدولة رسم. مدخلاتها: لا parameters؛ canvas ref/window العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 277:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `scheduleIdlePreload(...)`: يحمل باقي blobs في batches صغيرة حين المتصفح يسمح؛ أخطاء preload غير قاتلة وتُعاد عند الحاجة. القيم المكتوبة هنا: `initialCount`. العائد/الأثر: undefined؛ يخزن idleHandle. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 278:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 279:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `emit(...)`: تبلّغ الأب بحدث المكوّن والبيانات المرتبطة. القيم المكتوبة هنا: `'failure'`، `error`. العائد/الأثر: void؛ البيانات توصل للـlistener، مش من return.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 280:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 281–288

```vue
}

watch(() => props.time, scheduleDraw);
watch(() => props.active, (active) => {
    if (active) scheduleDraw();
});

onMounted(() => {
```

**السطر 281:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 283:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `watch(...)`: يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog. القيم المكتوبة هنا: `() => props.time`، `scheduleDraw`. العائد/الأثر: watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 284:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `watch(...)`: يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog. القيم المكتوبة هنا: `() => props.active`، `(active) => {     if (active) scheduleDraw(); }`. العائد/الأثر: watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 285:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `scheduleDraw(...)`: يجمع تغيرات الوقت في requestAnimationFrame واحدة بدل رسم لكل تغيير فورًا. مدخلاتها: لا شيء العائد/الأثر: undefined؛ animationFrameId handle. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 286:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 288:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onMounted(...)`: يسجل callback للتنفيذ بعد تركيب component وتوفر refs الخاصة بالDOM. القيم المكتوبة هنا: `() => {     context = canvasElement.value?.getContext('2d', { alpha: false });     resizeObserver = new Resize…`. العائد/الأثر: void. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 289–296

```vue
    context = canvasElement.value?.getContext('2d', { alpha: false });
    resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(document.documentElement);
    initialize();
});

onBeforeUnmount(() => {
    destroyed = true;
```

**السطر 289:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `canvasElement.value?.getContext(...)`: تطلب سياق رسم من canvas. القيم المكتوبة هنا: `'2d'`، `{ alpha: false }`. العائد/الأثر: RenderingContext أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 290:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `ResizeObserver(...)`: يراقب تغير حجم عنصر ويشغّل callback؛ cleanup بdisconnect. القيم المكتوبة هنا: `resizeCanvas`. العائد/الأثر: observer instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 291:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `resizeObserver.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `document.documentElement`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 292:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `initialize(...)`: يقرأ manifest ثم يختار desktop/mobile ويحمّل أول24 blob ويdecode أول صورة ويبلغ ready؛ failure يذهب للأب. مدخلاتها: لا parameters؛ props/browser capabilities العائد/الأثر: Promise<void>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 293:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 295:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onBeforeUnmount(...)`: يسجل تنظيفًا قبل إزالة component، مثل kill/disconnect/removeListener. القيم المكتوبة هنا: `() => {     destroyed = true;     cancelAnimationFrame(animationFrameId);     resizeObserver?.disconnect();   …`. العائد/الأثر: void. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 296:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 297–304

```vue
    cancelAnimationFrame(animationFrameId);
    resizeObserver?.disconnect();
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
    else clearTimeout(idleHandle);
    for (const bitmap of decodedFrames.values()) bitmap.close?.();
    decodedFrames.clear();
    decodingFrames.clear();
    encodedFrames.clear();
```

**السطر 297:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `cancelAnimationFrame(...)`: يلغي callback rAF مجدول لم ينفذ بعد؛ لا يوقف Promise بدأ بالفعل. القيم المكتوبة هنا: `animationFrameId`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 298:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `resizeObserver?.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 299:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `window.cancelIdleCallback(...)`: تلغي idle callback معلّقة. القيم المكتوبة هنا: `idleHandle`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 300:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clearTimeout(...)`: يلغي timeout لم ينفذ بعد بواسطة id؛ لا يلغي fetch وحده. القيم المكتوبة هنا: `idleHandle`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 301:** Variable declaration / تعريف `bitmap` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `decodedFrames.values(...)`: Object.values تجمع قيم الخصائص؛ Map.values تجهز مرورًا على القيم. مدخلاتها: object في الحالة الأولى، ولا arguments في الثانية. العائد/الأثر: array من Object.values أو iterator من Map.values؛ اقرأ المستقبِل في السطر.؛ `bitmap.close(...)`: ImageBitmap.close تحرر bitmap؛ dialog.close تغلق حوارًا. مدخلاتها: حسب المستقبِل؛ الاستخدام المعتاد بدون. العائد/الأثر: void في هذين الاستخدامين؛ مش حذف الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 302:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodedFrames.clear(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. مدخلاتها: مفتاح/قيمة حسب get/set/has/delete، وclear بدون. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 303:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `decodingFrames.clear(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. مدخلاتها: مفتاح/قيمة حسب get/set/has/delete، وclear بدون. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 304:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `encodedFrames.clear(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. مدخلاتها: مفتاح/قيمة حسب get/set/has/delete، وclear بدون. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 305–308

```vue
    fetchingFrames.clear();
});
</script>

```

**السطر 305:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `fetchingFrames.clear(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. مدخلاتها: مفتاح/قيمة حسب get/set/has/delete، وclear بدون. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 306:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 307:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
