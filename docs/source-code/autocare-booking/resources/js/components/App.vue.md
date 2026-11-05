# الصفحة العامة وقصة الصور والحجز

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/components/App.vue` · 564 سطر.

**وظيفة الملف:** App تجمع المكونات وتربط scroll progress بالصور والنصوص، وتعرض الفورم الذي يضيف طلبًا demo للجراج. محليًا Laravel يرجع shell فقط؛ نسخة Pages static لا تشغّل PHP.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/components/App.vue). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/components/StoryCanvas.vue](StoryCanvas.vue.md)

- [autocare-booking/resources/js/components/AppIcon.vue](AppIcon.vue.md)

- [autocare-booking/resources/js/components/StatusBadge.vue](StatusBadge.vue.md)

- [autocare-booking/resources/js/components/WorkshopSection.vue](WorkshopSection.vue.md)

- [autocare-booking/resources/js/components/CustomerSupport.vue](CustomerSupport.vue.md)

- [autocare-booking/resources/js/composables/useGarage.js](../composables/useGarage.js.md)

- [autocare-booking/resources/js/services/garageRepository.js](../services/garageRepository.js.md)

- [autocare-booking/resources/js/components/GarageDashboard.vue](GarageDashboard.vue.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```vue
<template>
    <div class="site-wrapper" :class="{ 'story-fallback': useFallback }">
        <nav class="navbar" :class="{ 'is-scrolled': navbarScrolled }">
            <div class="container nav-content">
                <a href="#" class="brand" aria-label="AutoCare Pro home" @click.prevent="scrollToBeat(0)">
                    <span class="brand-icon">A</span>
                    <span><strong>AutoCare</strong><small>Pro Garage</small></span>
                </a>

                <button
                    class="menu-btn"
                    type="button"
                    :aria-expanded="menuOpen"
                    aria-label="Toggle navigation"
                    @click="menuOpen = !menuOpen"
                >
                    <span></span><span></span><span></span>
                </button>

                <div class="nav-links" :class="{ active: menuOpen }">
                    <a href="#services" @click.prevent="scrollToBeat(STORY_CONFIG.navigation.services)">Services</a>
                    <a href="#process" @click.prevent="scrollToBeat(STORY_CONFIG.navigation.process)">Process</a>
                    <a href="#booking" @click.prevent="scrollToBooking">Booking</a>
                    <a href="#contact" @click="closeMenu">Contact</a>
                    <a href="/my-garage" class="nav-garage"><AppIcon name="car" />My Garage</a>
                </div>
            </div>
        </nav>

        <section
            ref="storyElement"
            class="story"
            :class="{ 'is-ready': storyReady, 'is-fallback': useFallback }"
            :style="storyHeightStyle"
        >
            <div v-if="useFallback" class="story-mode-control">
                <div class="story-mode-message"><AppIcon name="clock" /><p>{{ fallbackMessage }}</p><button class="btn" type="button" @click="enableAnimation">{{ fallbackReason === 'load' ? 'Retry animation' : 'Enable animation' }}<AppIcon name="arrow" /></button></div>
            </div>
            <StoryCanvas
                :key="storyAttempt"
                :time="storyTime"
                :active="storyActive"
                :fallback="useFallback"
                :canvas-opacity="canvasOpacity"
                :overlay-opacity="canvasOverlayOpacity"
                :blur="whipEffects.blur"
                :brightness="whipEffects.brightness"
                :scale="whipEffects.scale"
                @ready="handleStoryReady"
                @failure="activateFallback"
            />

            <div class="story-stage">
                <section class="story-panel hero-beat" :style="panelStyle('hero')">
                    <div class="container hero-story-content">
                        <p class="story-warning">Warning light on? Let’s find out why.</p>
                        <p class="eyebrow story-eyebrow">Premium car maintenance booking system</p>
                        <h1>Book your car service <span>with confidence.</span></h1>
                        <p class="hero-description">
                            AutoCare Pro helps customers book garage appointments, choose services,
                            and track repair status with a clean and modern experience.
                        </p>
                        <div class="hero-actions">
                            <button class="btn btn-primary" type="button" @click="scrollToBooking">Book Appointment</button>
                            <button class="btn btn-secondary" type="button" @click="scrollToBeat(STORY_CONFIG.navigation.services)">View Services</button>
                        </div>
                    </div>

                    <div v-if="smoothProgress <= STORY_CONFIG.scrollCueEnd" class="story-scroll-cue" aria-hidden="true">
                        <span></span>Scroll to explore
                    </div>
                </section>

                <section class="story-panel whip-beat" :style="panelStyle('whip')">
                    <p>Let’s look under the hood.</p>
                </section>

                <section id="services" class="story-panel services-beat" :style="panelStyle('services')">
                    <div class="container beat-surface services-surface">
                        <div class="beat-heading">
                            <p class="eyebrow">What we do</p>
                            <h2>Professional garage services</h2>
                            <p>Thoughtful maintenance, clearly explained. Explore our sample services and prices.</p>
                        </div>
                        <div class="services-grid">
                            <article v-for="service in services" :key="service.id" class="service-card">
                                <div class="service-icon"><AppIcon :name="service.icon" /></div>
                                <div class="service-copy">
                                    <h3>{{ service.name }}</h3>
                                    <p>{{ service.description }}</p>
                                </div>
                                <div class="service-footer">
                                    <strong>{{ service.price }} EGP</strong><span>{{ service.time }}</span>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                <section id="process" class="story-panel process-beat" :style="panelStyle('process')">
                    <div class="container beat-surface process-surface">
                        <div class="beat-heading align-left">
                            <p class="eyebrow">Simple process</p>
                            <h2>From booking to repair in four steps</h2>
                            <p>A straightforward journey, from your first request to the final handover.</p>
                        </div>
                        <div class="steps">
                            <article
                                v-for="(step, index) in steps"
                                :key="step.number"
                                class="step"
                                :style="processStepStyle(index)"
                            >
                                <span>{{ step.number }}</span>
                                <div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div>
                            </article>
                        </div>
                    </div>
                </section>

                <section class="story-panel diagnosis-beat" :style="panelStyle('diagnosis')">
                    <div class="container diagnosis-layout">
                        <aside class="diagnosis-panel" aria-label="Example vehicle inspection">
                            <div class="diagnosis-header">
                                <div>
                                    <span class="diagnosis-kicker"><AppIcon name="shield" /> Example report</span>
                                    <h2>Vehicle health, made clear.</h2>
                                </div>
                                <span class="diagnosis-pulse" aria-hidden="true"></span>
                            </div>

                            <div class="diagnosis-list">
                                <article
                                    v-for="item in diagnosisData"
                                    :key="item.name"
                                    class="diagnosis-card"
                                    :class="`status-${item.status}`"
                                >
                                    <div class="diagnosis-card-copy">
                                        <span class="diagnosis-status-icon" aria-hidden="true"><AppIcon :name="item.status === 'green' ? 'check' : item.status === 'amber' ? 'clock' : 'warning'" /></span>
                                        <div><strong>{{ item.name }}</strong><small>{{ item.label }}</small></div>
                                    </div>
                                    <div class="diagnosis-value">{{ diagnosisDisplayValue(item.value) }}%</div>
                                    <div class="diagnosis-track" aria-hidden="true">
                                        <span :style="{ width: `${diagnosisDisplayValue(item.value)}%` }"></span>
                                    </div>
                                </article>
                            </div>

                            <p class="diagnosis-disclaimer">Illustrative readings, not a diagnosis of your vehicle.</p>
                            <button class="btn diagnosis-button" type="button" @click="bookRecommendedService">
                                Book recommended service
                            </button>
                        </aside>
                    </div>
                </section>

                <section class="story-panel finale-beat" :style="panelStyle('finale')">
                    <div class="finale-card">
                        <p class="eyebrow">Ready when you are</p>
                        <h2>Your car deserves confident care.</h2>
                        <p>Choose a convenient time and let our garage team handle the rest.</p>
                        <button class="btn btn-primary" type="button" @click="scrollToBooking">Schedule your service</button>
                    </div>
                </section>
            </div>
        </section>

        <main class="page-content">
            <WorkshopSection />
            <section class="section booking-section" id="booking">
                <div class="container booking-grid">
                    <div class="booking-info">
                        <p class="eyebrow">Book now</p>
                        <h2>Schedule your appointment</h2>
                        <p>
                            Tell us what your car needs and choose a preferred time.
                            Your demo request will appear in My Garage, ready for you to manage.
                        </p>
                        <div class="info-box"><AppIcon name="shield" /><strong>A little detail makes a difference.</strong><span>Describe the symptoms so a workshop can prepare for your visit.</span></div>
                        <p class="booking-demo-note"><StatusBadge label="Demo booking" icon="calendar" tone="neutral" /> No real appointment is made. Service requests are saved in this browser only.</p>
                    </div>

                    <form class="booking-form" @submit.prevent="submitBooking">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="booking-name">Full Name</label>
                                <input id="booking-name" v-model="form.name" type="text" autocomplete="name" required placeholder="Example: Momen Hassan">
                            </div>
                            <div class="form-group">
                                <label for="booking-phone">Phone Number</label>
                                <input id="booking-phone" v-model="form.phone" type="tel" autocomplete="tel" required placeholder="Example: 01012345678">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="booking-car">Car Model</label>
                                <input id="booking-car" v-model="form.car" type="text" required placeholder="Example: Toyota Corolla 2018">
                            </div>
                            <div class="form-group">
                                <label for="booking-service">Service</label>
                                <select id="booking-service" v-model="form.service" required>
                                    <option value="">Choose service</option>
                                    <option v-for="service in services" :key="service.id" :value="service.name">{{ service.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="booking-date">Date</label>
                                <input id="booking-date" v-model="form.date" type="date" :min="today" required>
                            </div>
                            <div class="form-group">
                                <label for="booking-time">Time</label>
                                <input id="booking-time" v-model="form.time" type="time" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="booking-notes">Problem Description</label>
                            <textarea id="booking-notes" v-model="form.notes" rows="5" placeholder="Tell us what happened with the car..."></textarea>
                        </div>
                        <p v-if="errorMessage" class="alert alert-error" role="alert"><AppIcon name="warning" />{{ errorMessage }}</p>
                        <p v-if="successMessage" class="alert alert-success" role="status"><AppIcon name="check" />{{ successMessage }} <a href="/my-garage#appointments">View in My Garage →</a></p>
                        <button class="btn btn-primary form-btn" type="submit">Submit Booking</button>
                    </form>
                </div>
            </section>
            <CustomerSupport />
        </main>

        <footer class="footer">
            <div class="container footer-content">
                <div><strong>AutoCare Pro</strong><p>Care for your car. Clarity for you.</p><small class="footer-demo">Portfolio demo · Sample business and customer details.</small></div>
                <div class="footer-links"><a href="/my-garage">My Garage</a><a href="#faqs">FAQs</a><a href="#contact">Contact &amp; hours</a></div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StoryCanvas from './StoryCanvas.vue';
import AppIcon from './AppIcon.vue';
import StatusBadge from './StatusBadge.vue';
import WorkshopSection from './WorkshopSection.vue';
import CustomerSupport from './CustomerSupport.vue';
import { useGarage } from '../composables/useGarage';

const { addAppointment, storage } = useGarage();
const today = new Date().toLocaleDateString('en-CA');

gsap.registerPlugin(ScrollTrigger);

// All scroll-story pacing, beat ranges and effects can be tuned from this object.
const STORY_CONFIG = Object.freeze({
    duration: 10.04,
    heightDesktopVh: 800,
    heightMobileVh: 600,
    smoothingSeconds: 0.5,
    scrollCueEnd: 0.03,
    scrollMap: [
        { p: 0.00, t: 0.0 },
        { p: 0.26, t: 3.3 },
        { p: 0.34, t: 4.8 },
        { p: 0.52, t: 6.6 },
        { p: 0.62, t: 7.5 },
        { p: 0.90, t: 9.6 },
        { p: 1.00, t: 10.04 },
    ],
    beats: {
        hero: [0.00, 0.26],
        whip: [0.26, 0.34],
        services: [0.34, 0.52],
        process: [0.52, 0.62],
        diagnosis: [0.62, 0.90],
        finale: [0.90, 1.00],
    },
    navigation: { services: 0.36, process: 0.53 },
    panelFade: 0.022,
    canvasFade: [0.94, 1.00],
    diagnosisCountEnd: 0.74,
    whip: {
        range: [0.26, 0.34],
        blur: 6,
        brightness: 1.15,
        scale: 1.04,
    },
});

const services = [
    { id: 1, icon: 'oil', name: 'Oil Change', description: 'Replace engine oil and filter to keep your engine clean and healthy.', price: 450, time: '35 min' },
    { id: 2, icon: 'car', name: 'Tire Service', description: 'Tire inspection, pressure check, rotation, and replacement support.', price: 300, time: '25 min' },
    { id: 3, icon: 'brake', name: 'Brake Repair', description: 'Check brake pads, discs, oil, and braking performance.', price: 700, time: '60 min' },
    { id: 4, icon: 'wrench', name: 'Engine Check', description: 'Full engine diagnosis to detect problems before they grow.', price: 850, time: '75 min' },
    { id: 5, icon: 'battery', name: 'Battery Test', description: 'Battery health check, charging test, and replacement advice.', price: 250, time: '20 min' },
    { id: 6, icon: 'snow', name: 'AC Service', description: 'Air conditioning inspection, gas refill, and cooling performance check.', price: 650, time: '50 min' },
];

const steps = [
    { number: '01', title: 'Choose Service', text: 'Customer selects the maintenance service they need.' },
    { number: '02', title: 'Send Request', text: 'Customer enters car details, date, time, and problem notes.' },
    { number: '03', title: 'Admin Review', text: 'Garage admin approves, rejects, or updates the booking status.' },
    { number: '04', title: 'Repair Complete', text: 'Mechanic finishes the job and the system marks it as completed.' },
];

const diagnosisData = [
    { name: 'Engine check', value: 92, status: 'green', label: 'Running smoothly' },
    { name: 'Oil level', value: 76, status: 'amber', label: 'Service soon' },
    { name: 'Brake pads', value: 48, status: 'red', label: 'Needs attention' },
    { name: 'Battery', value: 88, status: 'green', label: 'Healthy charge' },
];

const menuOpen = ref(false);
const navbarScrolled = ref(false);
const storyElement = ref(null);
const storyReady = ref(false);
const storyActive = ref(true);
const useFallback = ref(false);
const storyAttempt = ref(0);
const fallbackReason = ref('');
const fallbackMessage = computed(() => ({
    motion: 'Static preview: your device prefers reduced motion. You can choose to enable the scroll animation.',
    data: 'Static preview: Data Saver is enabled. Playing the animation will download additional images.',
    connection: 'Static preview: a very slow connection was detected. You can try the scroll animation.',
    load: 'The animation could not finish loading. You can retry; all services and booking remain available.',
}[fallbackReason.value] || 'You are viewing a static preview.'));
const smoothProgress = ref(0);
const rawProgress = ref(0);
const errorMessage = ref('');
const successMessage = ref('');
const mobileViewport = ref(false);
let scrollTrigger;
let storyObserver;
const smoothState = { value: 0 };

const form = reactive({ name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' });

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
const smoothstep = (value) => {
    const x = clamp(value);
    return x * x * (3 - (2 * x));
};

const storyHeightStyle = computed(() => ({
    '--story-height': `${mobileViewport.value ? STORY_CONFIG.heightMobileVh : STORY_CONFIG.heightDesktopVh}vh`,
}));

const storyTime = computed(() => {
    const progress = smoothProgress.value;
    const points = STORY_CONFIG.scrollMap;
    for (let index = 0; index < points.length - 1; index += 1) {
        const current = points[index];
        const next = points[index + 1];
        if (progress <= next.p) {
            const amount = clamp((progress - current.p) / (next.p - current.p));
            return current.t + ((next.t - current.t) * amount);
        }
    }
    return STORY_CONFIG.duration;
});

const canvasOpacity = computed(() => {
    if (useFallback.value) return 1;
    const [start, end] = STORY_CONFIG.canvasFade;
    return 1 - smoothstep((smoothProgress.value - start) / (end - start));
});

const canvasOverlayOpacity = computed(() => {
    if (useFallback.value) return 0.72;
    if (smoothProgress.value >= STORY_CONFIG.beats.services[0] && smoothProgress.value < STORY_CONFIG.beats.finale[0]) return 0.72;
    return 0.55;
});

const whipEffects = computed(() => {
    if (useFallback.value) return { blur: 0, brightness: 1, scale: 1 };
    const [start, end] = STORY_CONFIG.whip.range;
    const phase = clamp((smoothProgress.value - start) / (end - start));
    const intensity = Math.sin(Math.PI * phase);
    return {
        blur: STORY_CONFIG.whip.blur * intensity,
        brightness: 1 + ((STORY_CONFIG.whip.brightness - 1) * intensity),
        scale: 1 + ((STORY_CONFIG.whip.scale - 1) * intensity),
    };
});

function panelOpacity(name) {
    if (useFallback.value) return 1;
    const [start, end] = STORY_CONFIG.beats[name];
    const fade = STORY_CONFIG.panelFade;
    const fadeIn = start === 0 ? 1 : smoothstep((smoothProgress.value - start) / fade);
    const fadeOut = end === 1 ? 1 : smoothstep((end - smoothProgress.value) / fade);
    return clamp(Math.min(fadeIn, fadeOut));
}

function panelStyle(name) {
    const opacity = panelOpacity(name);
    return {
        opacity,
        transform: useFallback.value ? 'none' : `translateY(${(1 - opacity) * 28}px)`,
        pointerEvents: opacity > 0.65 ? 'auto' : 'none',
        visibility: opacity > 0.001 ? 'visible' : 'hidden',
    };
}

function processStepStyle(index) {
    if (useFallback.value) return {};
    const [start, end] = STORY_CONFIG.beats.process;
    const local = clamp((smoothProgress.value - start) / (end - start));
    const stepProgress = smoothstep((local - (index * 0.13)) / 0.28);
    return { opacity: stepProgress, transform: `translateY(${(1 - stepProgress) * 24}px)` };
}

function diagnosisDisplayValue(target) {
    if (useFallback.value) return target;
    const start = STORY_CONFIG.beats.diagnosis[0];
    const progress = smoothstep((smoothProgress.value - start) / (STORY_CONFIG.diagnosisCountEnd - start));
    return Math.round(target * progress);
}

function scrollToBeat(progress) {
    closeMenu();
    if (useFallback.value) {
        if (progress === 0) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const destination = progress < 0.5 ? '#services' : '#process';
        document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    if (!storyElement.value) return;
    const storyTop = storyElement.value.offsetTop;
    const distance = storyElement.value.offsetHeight - window.innerHeight;
    window.scrollTo({ top: storyTop + (distance * progress), behavior: 'smooth' });
}

function scrollToBooking() {
    closeMenu();
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
}

function bookRecommendedService() {
    form.service = 'Engine Check';
    scrollToBooking();
}

function closeMenu() {
    menuOpen.value = false;
}

function activateFallback(reason = 'load') {
    fallbackReason.value = typeof reason === 'string' ? reason : 'load';
    useFallback.value = true;
    storyReady.value = true;
    scrollTrigger?.kill();
    gsap.killTweensOf(smoothState);
    smoothProgress.value = 1;
}

function handleStoryReady() {
    storyReady.value = true;
    if (!useFallback.value) requestAnimationFrame(() => scrollTrigger?.refresh());
}

async function enableAnimation() {
    useFallback.value = false;
    fallbackReason.value = '';
    storyReady.value = false;
    smoothState.value = 0;
    smoothProgress.value = 0;
    rawProgress.value = 0;
    storyActive.value = true;
    storyAttempt.value += 1;
    await nextTick();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setupScrollStory();
}

function setupScrollStory() {
    scrollTrigger?.kill();
    storyObserver?.disconnect();
    scrollTrigger = ScrollTrigger.create({
        trigger: storyElement.value,
        start: 'top top',
        end: 'bottom bottom',
        onRefresh: (self) => {
            gsap.killTweensOf(smoothState);
            smoothState.value = self.progress;
            smoothProgress.value = clamp(self.progress);
        },
        onUpdate: (self) => {
            rawProgress.value = self.progress;
            gsap.to(smoothState, {
                value: self.progress,
                duration: STORY_CONFIG.smoothingSeconds,
                ease: 'power2.out',
                overwrite: true,
                onUpdate: () => { smoothProgress.value = clamp(smoothState.value); },
            });
        },
    });
    storyObserver = new IntersectionObserver(([entry]) => {
        storyActive.value = entry.isIntersecting;
    }, { threshold: 0.01 });
    storyObserver.observe(storyElement.value);
}

function updateNavbar() {
    navbarScrolled.value = window.scrollY > 24;
}

function updateViewport() {
    mobileViewport.value = window.innerWidth < 768;
}

function submitBooking() {
    errorMessage.value = '';
    successMessage.value = '';
    if (!form.name || !form.phone || !form.car || !form.service || !form.date || !form.time) {
        errorMessage.value = 'Please fill in all required fields before submitting.';
        return;
    }
    if (form.date < today) {
        errorMessage.value = 'Choose today or a future date for your request.';
        return;
    }
    const appointment = addAppointment(form);
    successMessage.value = storage.available
        ? `Demo request ${appointment.id} saved. It is pending review; no real appointment has been made.`
        : 'Browser storage is unavailable. Your demo request cannot be kept after leaving this page.';
    Object.assign(form, { name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' });
}

onMounted(() => {
    try {
        const selected = JSON.parse(sessionStorage.getItem('autocare.booking.vehicle'));
        if (selected?.car) form.car = selected.car;
        sessionStorage.removeItem('autocare.booking.vehicle');
    } catch { /* The booking form works without browser storage. */ }
    updateViewport();
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
    window.addEventListener('resize', updateViewport, { passive: true });

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // A 3G estimate selects lighter frames, rather than permanently disabling motion.
    const reason = reducedMotion ? 'motion' : connection?.saveData ? 'data'
        : ['slow-2g', '2g'].includes(connection?.effectiveType) ? 'connection' : '';
    if (reason) {
        activateFallback(reason);
        return;
    }
    setupScrollStory();
});

onBeforeUnmount(() => {
    scrollTrigger?.kill();
    storyObserver?.disconnect();
    gsap.killTweensOf(smoothState);
    window.removeEventListener('scroll', updateNavbar);
    window.removeEventListener('resize', updateViewport);
});
</script>
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### STORY_CONFIG

إعدادات ثابتة للقصة: مدى الأقسام، زمن الصور، ارتفاع مساحة scroll، التنعيم والblur.

- **بتاخد إيه؟ Inputs:** Object.freeze على object إعدادات

- **بترجع/بتغيّر إيه؟ Return / effect:** object مجمّد shallow؛ nested objects ليست deep-frozen تلقائيًا

### services

قائمة الخدمات والأسعار والأيقونات، تتكرر في الكروت وخيارات select.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** array ثابتة

### form

بيانات الفورم مجمعة في reactive object، وv-model تكتب في حقولها مباشرة.

- **بتاخد إيه؟ Inputs:** name,phone,car,service,date,time,notes

- **بترجع/بتغيّر إيه؟ Return / effect:** Vue reactive proxy

### fallbackMessage

سبب fallback يختار رسالة مفهومة وزر محاولة؛ لا يصنع حركة.

- **بتاخد إيه؟ Inputs:** fallbackReason.value

- **بترجع/بتغيّر إيه؟ Return / effect:** computed string

### clamp

يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1.

- **بتاخد إيه؟ Inputs:** value,minimum=0,maximum=1

- **بترجع/بتغيّر إيه؟ Return / effect:** number

### smoothstep

يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp.

- **بتاخد إيه؟ Inputs:** value

- **بترجع/بتغيّر إيه؟ Return / effect:** number 0..1

### storyHeightStyle

يبني CSS custom property للارتفاع حسب عرض الشاشة.

- **بتاخد إيه؟ Inputs:** mobileViewport.value وSTORY_CONFIG

- **بترجع/بتغيّر إيه؟ Return / effect:** computed object {'--story-height':'600vh' أو '800vh'}

### storyTime

يحوّل تقدم scroll إلى زمن صور بالمقاطع المحددة في scrollMap؛ مش video.currentTime.

- **بتاخد إيه؟ Inputs:** smoothProgress.value

- **بترجع/بتغيّر إيه؟ Return / effect:** computed number من0 إلى10.04

### canvasOpacity

يحافظ على الصورة في fallback وإلا يخفّيها تدريجيًا قرب نهاية القصة.

- **بتاخد إيه؟ Inputs:** smoothProgress,useFallback

- **بترجع/بتغيّر إيه؟ Return / effect:** computed opacity number

### canvasOverlayOpacity

يزود طبقة التعتيم خلف فترات القراءة؛ 0.72 في الأقسام و0.55 في البداية والنهاية.

- **بتاخد إيه؟ Inputs:** smoothProgress,useFallback

- **بترجع/بتغيّر إيه؟ Return / effect:** computed number

### whipEffects

نبضة blur/brightness/scale تبدأ بصفر وتعلو ثم ترجع عند انتقال whip.

- **بتاخد إيه؟ Inputs:** smoothProgress,useFallback,STORY_CONFIG.whip

- **بترجع/بتغيّر إيه؟ Return / effect:** computed object ينتقل كprops

### panelOpacity

يحسب دخول وخروج قسم واحد حسب مداه؛ في fallback يرجع1 لكل الأقسام.

- **بتاخد إيه؟ Inputs:** name مفتاح beats

- **بترجع/بتغيّر إيه؟ Return / effect:** number بين0و1

### panelStyle

يحوّل opacity إلى CSS للحركة والتفاعل والظهور؛ العناصر تظل mounted.

- **بتاخد إيه؟ Inputs:** name

- **بترجع/بتغيّر إيه؟ Return / effect:** {opacity,transform,pointerEvents,visibility}

### processStepStyle

يؤخر ظهور كل خطوة حسب index داخل مدى process.

- **بتاخد إيه؟ Inputs:** index رقم الخطوة

- **بترجع/بتغيّر إيه؟ Return / effect:** CSS object أو {} في fallback

### diagnosisDisplayValue

عداد رسومي للقراءات demo؛ يرجع الهدف مباشرة في fallback.

- **بتاخد إيه؟ Inputs:** target نسبة مثال

- **بترجع/بتغيّر إيه؟ Return / effect:** integer؛ مش تحليل سيارة فعلي

### scrollToBeat

يقفل mobile menu ثم ينتقل لإحداثي progress في story؛ fallback يستخدم sections عادية.

- **بتاخد إيه؟ Inputs:** progress رقم0..1

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ DOM scrolling

### scrollToBooking

يقفل المينو وينزل لعنصر booking لو موجود.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ optional chaining يمنع خطأ غياب العنصر

### bookRecommendedService

يختار Engine Check برمجيًا في form ثم يذهب للحجز.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ side effects

### closeMenu

يضبط menuOpen=false بعد التنقل.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined

### activateFallback

يسجل السبب ويحوّل العرض إلى ثابت ويوقف ScrollTrigger/tweens ويجعل النصوص قابلة للقراءة.

- **بتاخد إيه؟ Inputs:** reason='load'؛ failure event ممكن يبعت Error فيتحول السبب إلى load

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ fallback لا يحذف خدمات/فورم

### handleStoryReady

ينهي loader، ثم refresh في animation frame لو الحركة فعالة.

- **بتاخد إيه؟ Inputs:** ready event من StoryCanvas

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined

### enableAnimation

يصفّر الحالة ويزيد key لإعادة إنشاء StoryCanvas، ثم ينتظر DOM ويبدأ scroll story من فوق.

- **بتاخد إيه؟ Inputs:** نقرة Retry/Enable

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>؛ async ولا يرسل backend request

### setupScrollStory

ينظف instances سابقة، يعمل ScrollTrigger لتقدم القصة وIntersectionObserver لتعطيل رسم الخلفية خارج المشهد.

- **بتاخد إيه؟ Inputs:** storyElement DOM وconfig

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ يحتفظ handles في scrollTrigger/storyObserver

### updateNavbar

يربط is-scrolled بتجاوز24px؛ class binding يغير المظهر.

- **بتاخد إيه؟ Inputs:** window.scrollY

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ navbarScrolled Boolean

### updateViewport

يحسم mobile layout عند أقل من768px.

- **بتاخد إيه؟ Inputs:** window.innerWidth

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ mobileViewport Boolean

### submitBooking

يمسح رسائل، يتحقق من الحقول والتاريخ، يضيف demo appointment، يعرض نجاحًا ويحذف بيانات النموذج من الذاكرة.

- **بتاخد إيه؟ Inputs:** لا parameters؛ form reactive

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ لا Axios/fetch هنا

### onMounted

يستهلك sessionStorage لتعبئة العربية، يبدأ listeners، يقرر reduced-motion/data/2g fallback أو يبدأ القصة.

- **بتاخد إيه؟ Inputs:** Vue lifecycle callback

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ ليس وظيفة HTTP

### onBeforeUnmount

يقتل animation instances وobserver ويسحب listeners لمنع التسريبات.

- **بتاخد إيه؟ Inputs:** Vue lifecycle callback

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useGarage

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يرجع الحالة وعمليات الإضافة؛ مش بيبدأ نسخة state منفصلة لكل component.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** { state, storage, addVehicle, addAppointment }

- **أول موضع هنا:** السطر 251.

- **تكملة التعريف:** [resources/js/composables/useGarage.js](../composables/useGarage.js.md)، عند السطر 29.

### new Date().toLocaleDateString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ للعرض حسب locale/options.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string، وليس قيمة مناسبة بالضرورة للتخزين.

- **أول موضع هنا:** السطر 252، والمدخلات المكتوبة: `'en-CA'`.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 252.

### gsap.registerPlugin

- **جاية منين؟** GSAP

- **وظيفتها:** تسجّل plugin مثل ScrollTrigger قبل استخدامه.

- **المدخلات — Arguments:** plugin(s).

- **الناتج/الأثر — Return / effect:** لا نعتمد على return؛ الأثر إتاحة plugin في GSAP.

- **أول موضع هنا:** السطر 254، والمدخلات المكتوبة: `ScrollTrigger`.

### Object.freeze

- **جاية منين؟** JavaScript

- **وظيفتها:** يجمد properties على المستوى الأول فقط؛ مش deep freeze.

- **المدخلات — Arguments:** object

- **الناتج/الأثر — Return / effect:** نفس object مجمد

- **أول موضع هنا:** السطر 257، والمدخلات المكتوبة: `{     duration: 10.04,     heightDesktopVh: 800,     heightMobileVh: 600,     smoothingSeconds: 0.5,     scrollCueEnd: 0.03,     scrollMap: [         { p: 0.00, t: 0.0 },         {…`.

- **مثال:** const STORY_CONFIG = Object.freeze({ duration:10.04, beats:{hero:[0,.26]} });

### ref

- **جاية منين؟** Vue

- **وظيفتها:** يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** Ref object

- **أول موضع هنا:** السطر 333، والمدخلات المكتوبة: `false`.

- **مثال:** const menuOpen = ref(false); menuOpen.value = true;

### computed

- **جاية منين؟** Vue

- **وظيفتها:** قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي.

- **المدخلات — Arguments:** getter function

- **الناتج/الأثر — Return / effect:** ComputedRef

- **أول موضع هنا:** السطر 376، والمدخلات المكتوبة: `() => {     if (useFallback.value) return { blur: 0, brightness: 1, scale: 1 };     const [start, end] = STORY_CONFIG.whip.range;     const phase = clamp((smoothProgress.value - st…`.

- **مثال:** const nextVisit = computed(() => upcoming.value[0]);

### reactive

- **جاية منين؟** Vue

- **وظيفتها:** يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value.

- **المدخلات — Arguments:** object

- **الناتج/الأثر — Return / effect:** reactive Proxy

- **أول موضع هنا:** السطر 338، والمدخلات المكتوبة: `{ name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' }`.

- **مثال:** const form = reactive({ car: '' }); form.car = 'Toyota';

### Math.min

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أصغر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 394، والمدخلات المكتوبة: `fadeIn`، `fadeOut`.

### Math.max

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أكبر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 340، والمدخلات المكتوبة: `minimum`، `value`.

### clamp

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1.

- **المدخلات — Arguments:** value,minimum=0,maximum=1

- **الناتج/الأثر — Return / effect:** number

- **أول موضع هنا:** السطر 497، والمدخلات المكتوبة: `smoothState.value`.

### smoothstep

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** number 0..1

- **أول موضع هنا:** السطر 418، والمدخلات المكتوبة: `(smoothProgress.value - start) / (STORY_CONFIG.diagnosisCountEnd - start)`.

### Math.sin

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** تحسب sine لزاوية بالراديان.

- **المدخلات — Arguments:** زاوية.

- **الناتج/الأثر — Return / effect:** number؛ مثال انتقال الصورة يستخدم منحنى0→1→0.

- **أول موضع هنا:** السطر 380، والمدخلات المكتوبة: `Math.PI * phase`.

### panelOpacity

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحسب دخول وخروج قسم واحد حسب مداه؛ في fallback يرجع1 لكل الأقسام.

- **المدخلات — Arguments:** name مفتاح beats

- **الناتج/الأثر — Return / effect:** number بين0و1

- **أول موضع هنا:** السطر 398، والمدخلات المكتوبة: `name`.

### Math.round

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** تقرّب عددًا لأقرب integer.

- **المدخلات — Arguments:** number.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 419، والمدخلات المكتوبة: `target * progress`.

### closeMenu

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يضبط menuOpen=false بعد التنقل.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 437.

### window.scrollTo

- **جاية منين؟** Browser Window/Element

- **وظيفتها:** تحرّك موضع التمرير.

- **المدخلات — Arguments:** coordinates أو options.

- **الناتج/الأثر — Return / effect:** undefined؛ الحركة الناعمة ليست Promise تنتظرها.

- **أول موضع هنا:** السطر 474، والمدخلات المكتوبة: `{ top: 0, behavior: 'instant' }`.

### document.querySelector(destination)?.scrollIntoView

- **جاية منين؟** DOM Element

- **وظيفتها:** تطلب تمرير حاويات لإظهار العنصر.

- **المدخلات — Arguments:** options اختيارية.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 427، والمدخلات المكتوبة: `{ behavior: 'smooth' }`.

### document.querySelector

- **جاية منين؟** DOM

- **وظيفتها:** تبحث عن أول عنصر يطابق CSS selector.

- **المدخلات — Arguments:** selector.

- **الناتج/الأثر — Return / effect:** Element أو null.

- **أول موضع هنا:** السطر 438، والمدخلات المكتوبة: `'#booking'`.

### document.querySelector('#booking')?.scrollIntoView

- **جاية منين؟** DOM Element

- **وظيفتها:** تطلب تمرير حاويات لإظهار العنصر.

- **المدخلات — Arguments:** options اختيارية.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 438، والمدخلات المكتوبة: `{ behavior: 'smooth' }`.

### scrollToBooking

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقفل المينو وينزل لعنصر booking لو موجود.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** undefined؛ optional chaining يمنع خطأ غياب العنصر

- **أول موضع هنا:** السطر 443.

### scrollTrigger?.kill

- **جاية منين؟** GSAP ScrollTrigger/Tween حسب المستقبِل

- **وظيفتها:** تنهي هذه instance وتوقف تحديثاتها/اشتراكاتها وفق API.

- **المدخلات — Arguments:** خيارات اختيارية حسب النوع.

- **الناتج/الأثر — Return / effect:** الأثر تنظيف هذه الحركة/المراقبة، مش إلغاء كل JavaScript.

- **أول موضع هنا:** السطر 557.

### gsap.killTweensOf

- **جاية منين؟** GSAP

- **وظيفتها:** يوقف tweens المرتبطة بالtarget قبل reset/cleanup.

- **المدخلات — Arguments:** target

- **الناتج/الأثر — Return / effect:** void

- **أول موضع هنا:** السطر 559، والمدخلات المكتوبة: `smoothState`.

- **مثال:** gsap.killTweensOf(smoothState);

### requestAnimationFrame

- **جاية منين؟** Browser

- **وظيفتها:** يطلب callback مرة قبل فرصة رسم لاحقة؛ التجميع يقلل عمل scroll المكرر.

- **المدخلات — Arguments:** callback(timestamp)

- **الناتج/الأثر — Return / effect:** request id

- **أول موضع هنا:** السطر 461، والمدخلات المكتوبة: `() => scrollTrigger?.refresh()`.

- **مثال:** animationFrameId = requestAnimationFrame(renderFrame);

### scrollTrigger?.refresh

- **جاية منين؟** GSAP ScrollTrigger

- **وظيفتها:** تعيد حساب مواضع بداية/نهاية triggers بعد تغيّر layout.

- **المدخلات — Arguments:** خيارات اختيارية.

- **الناتج/الأثر — Return / effect:** أثر إعادة الحساب وتفعيل callbacks المناسبة؛ لا تعيد تحميل الصفحة.

- **أول موضع هنا:** السطر 461.

### nextTick

- **جاية منين؟** Vue

- **وظيفتها:** ينتظر انتهاء دفعة تحديث DOM الحالية بعد تغيير state، مش انتظار network ولا تأخير ثابت.

- **المدخلات — Arguments:** callback اختياري

- **الناتج/الأثر — Return / effect:** Promise<void>

- **أول موضع هنا:** السطر 473.

- **مثال:** await nextTick(); syncDialog(vehicleDialog.value, true);

### setupScrollStory

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** ينظف instances سابقة، يعمل ScrollTrigger لتقدم القصة وIntersectionObserver لتعطيل رسم الخلفية خارج المشهد.

- **المدخلات — Arguments:** storyElement DOM وconfig

- **الناتج/الأثر — Return / effect:** undefined؛ يحتفظ handles في scrollTrigger/storyObserver

- **أول موضع هنا:** السطر 553.

### storyObserver?.disconnect

- **جاية منين؟** Browser Observer

- **وظيفتها:** توقف مراقبة الأهداف الخاصة بهذا observer.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 558.

### ScrollTrigger.create

- **جاية منين؟** GSAP plugin

- **وظيفتها:** يبني مراقبة مدى scroll ويستدعي callbacks بتقدم0..1، بدون React/Vue router.

- **المدخلات — Arguments:** {trigger,start,end,onUpdate,onRefresh}

- **الناتج/الأثر — Return / effect:** ScrollTrigger instance له kill/refresh

- **أول موضع هنا:** السطر 481، والمدخلات المكتوبة: `{         trigger: storyElement.value,         start: 'top top',         end: 'bottom bottom',         onRefresh: (self) => {             gsap.killTweensOf(smoothState);           …`.

- **مثال:** scrollTrigger = ScrollTrigger.create({trigger:storyElement.value,start:'top top',end:'bottom bottom',onUpdate:self=>{rawProgress.value=self.progress;}});

### gsap.to

- **جاية منين؟** GSAP

- **وظيفتها:** ينشئ tween يغير target تدريجيًا نحو values؛ overwrite يمنع تعارض القديم.

- **المدخلات — Arguments:** target,vars

- **الناتج/الأثر — Return / effect:** Tween

- **أول موضع هنا:** السطر 492، والمدخلات المكتوبة: `smoothState`، `{                 value: self.progress,                 duration: STORY_CONFIG.smoothingSeconds,                 ease: 'power2.out',                 overwrite: true,               …`.

- **مثال:** gsap.to(smoothState,{value:self.progress,duration:.5,overwrite:true});

### IntersectionObserver

- **جاية منين؟** Browser

- **وظيفتها:** يراقب دخول عنصر ضمن viewport/root بشكل async؛ لا يحتاج listener scroll يدوي لكل عنصر.

- **المدخلات — Arguments:** callback(entries),{rootMargin,threshold}

- **الناتج/الأثر — Return / effect:** observer instance

- **أول موضع هنا:** السطر 501، والمدخلات المكتوبة: `([entry]) => {         storyActive.value = entry.isIntersecting;     }`، `{ threshold: 0.01 }`.

- **مثال:** new IntersectionObserver(([entry]) => { storyActive.value=entry.isIntersecting; },{threshold:.01});

### storyObserver.observe

- **جاية منين؟** Browser Observer

- **وظيفتها:** تبدأ مراقبة عنصر بالـobserver الحالي.

- **المدخلات — Arguments:** عنصر وخيارات حسب API.

- **الناتج/الأثر — Return / effect:** عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.

- **أول موضع هنا:** السطر 504، والمدخلات المكتوبة: `storyElement.value`.

### addAppointment

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يطابق العربية بالنص، يولّد رقم طلب، وينسخ حقول الحجز الآمنة فقط ثم يحفظ فورًا.

- **المدخلات — Arguments:** form: car,service,date,time مع حقول أخرى لا تُحفظ

- **الناتج/الأثر — Return / effect:** entry: طلب demo status=requested؛ لا يتم حفظ الاسم والتليفون والملاحظات

- **أول موضع هنا:** السطر 526، والمدخلات المكتوبة: `form`.

- **تكملة التعريف:** [resources/js/composables/useGarage.js](../composables/useGarage.js.md)، عند السطر 35.

### Object.assign

- **جاية منين؟** JavaScript

- **وظيفتها:** ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله.

- **المدخلات — Arguments:** target,...sources

- **الناتج/الأثر — Return / effect:** target بعد التعديل

- **أول موضع هنا:** السطر 530، والمدخلات المكتوبة: `form`، `{ name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' }`.

- **مثال:** Object.assign(rescheduleTarget.value, rescheduleForm, {status:'requested'});

### onMounted

- **جاية منين؟** Vue

- **وظيفتها:** يسجل callback للتنفيذ بعد تركيب component وتوفر refs الخاصة بالDOM.

- **المدخلات — Arguments:** callback

- **الناتج/الأثر — Return / effect:** void

- **أول موضع هنا:** السطر 533، والمدخلات المكتوبة: `() => {     try {         const selected = JSON.parse(sessionStorage.getItem('autocare.booking.vehicle'));         if (selected?.car) form.car = selected.car;         sessionStorag…`.

- **مثال:** onMounted(() => initialize());

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 535، والمدخلات المكتوبة: `sessionStorage.getItem('autocare.booking.vehicle')`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### sessionStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 535، والمدخلات المكتوبة: `'autocare.booking.vehicle'`.

### sessionStorage.removeItem

- **جاية منين؟** Browser Storage

- **وظيفتها:** تمسح مفتاحًا محددًا فقط.

- **المدخلات — Arguments:** key.

- **الناتج/الأثر — Return / effect:** undefined؛ ليست حذف قاعدة بيانات Laravel.

- **أول موضع هنا:** السطر 537، والمدخلات المكتوبة: `'autocare.booking.vehicle'`.

### updateViewport

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحسم mobile layout عند أقل من768px.

- **المدخلات — Arguments:** window.innerWidth

- **الناتج/الأثر — Return / effect:** undefined؛ mobileViewport Boolean

- **أول موضع هنا:** السطر 539.

### updateNavbar

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يربط is-scrolled بتجاوز24px؛ class binding يغير المظهر.

- **المدخلات — Arguments:** window.scrollY

- **الناتج/الأثر — Return / effect:** undefined؛ navbarScrolled Boolean

- **أول موضع هنا:** السطر 540.

### window.addEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تسجّل listener؛ مصدر الحدث يناديها ويمرر Event.

- **المدخلات — Arguments:** اسم الحدث والدالة وخيارات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تشغّل handler لحظة التسجيل.

- **أول موضع هنا:** السطر 542، والمدخلات المكتوبة: `'resize'`، `updateViewport`، `{ passive: true }`.

### window.matchMedia

- **جاية منين؟** Browser

- **وظيفتها:** تجهّز اختبار media query.

- **المدخلات — Arguments:** نص query.

- **الناتج/الأثر — Return / effect:** MediaQueryList؛ matches خاصية Boolean.

- **أول موضع هنا:** السطر 545، والمدخلات المكتوبة: `'(prefers-reduced-motion: reduce)'`.

### ['slow-2g', '2g'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 548، والمدخلات المكتوبة: `connection?.effectiveType`.

### activateFallback

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يسجل السبب ويحوّل العرض إلى ثابت ويوقف ScrollTrigger/tweens ويجعل النصوص قابلة للقراءة.

- **المدخلات — Arguments:** reason='load'؛ failure event ممكن يبعت Error فيتحول السبب إلى load

- **الناتج/الأثر — Return / effect:** undefined؛ fallback لا يحذف خدمات/فورم

- **أول موضع هنا:** السطر 550، والمدخلات المكتوبة: `reason`.

### onBeforeUnmount

- **جاية منين؟** Vue

- **وظيفتها:** يسجل تنظيفًا قبل إزالة component، مثل kill/disconnect/removeListener.

- **المدخلات — Arguments:** callback

- **الناتج/الأثر — Return / effect:** void

- **أول موضع هنا:** السطر 556، والمدخلات المكتوبة: `() => {     scrollTrigger?.kill();     storyObserver?.disconnect();     gsap.killTweensOf(smoothState);     window.removeEventListener('scroll', updateNavbar);     window.removeEve…`.

- **مثال:** onBeforeUnmount(() => storyObserver?.disconnect());

### window.removeEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب.

- **المدخلات — Arguments:** نوع الحدث والدالة وخيار capture إن لزم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف الحدث نفسه.

- **أول موضع هنا:** السطر 561، والمدخلات المكتوبة: `'resize'`، `updateViewport`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```vue
<template>
    <div class="site-wrapper" :class="{ 'story-fallback': useFallback }">
        <nav class="navbar" :class="{ 'is-scrolled': navbarScrolled }">
            <div class="container nav-content">
                <a href="#" class="brand" aria-label="AutoCare Pro home" @click.prevent="scrollToBeat(0)">
                    <span class="brand-icon">A</span>
                    <span><strong>AutoCare</strong><small>Pro Garage</small></span>
                </a>
```

**السطر 1:** بداية Vue template / شكل الواجهة؛ تعبيراته تقرأ الحالة والدوال من script المكوّن.

**السطر 2:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 3:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 4:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 5:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `scrollToBeat(0)` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب. .prevent تمنع التصرف الافتراضي للحدث، مثل إعادة تحميل الصفحة عند submit؛ مش هي اللي تبعت request.

**السطر 6:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 7:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 8:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 9–16

```vue

                <button
                    class="menu-btn"
                    type="button"
                    :aria-expanded="menuOpen"
                    aria-label="Toggle navigation"
                    @click="menuOpen = !menuOpen"
                >
```

**السطر 10:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 11:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 12:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 13:** :aria-expanded اختصار v-bind:aria-expanded: قيّم `menuOpen` كـJavaScript وحط النتيجة في الخاصية `aria-expanded`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 14:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 15:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `menuOpen = !menuOpen` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```vue
                    <span></span><span></span><span></span>
                </button>

                <div class="nav-links" :class="{ active: menuOpen }">
                    <a href="#services" @click.prevent="scrollToBeat(STORY_CONFIG.navigation.services)">Services</a>
                    <a href="#process" @click.prevent="scrollToBeat(STORY_CONFIG.navigation.process)">Process</a>
                    <a href="#booking" @click.prevent="scrollToBooking">Booking</a>
                    <a href="#contact" @click="closeMenu">Contact</a>
```

**السطر 17:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 18:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 20:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 21:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `scrollToBeat(STORY_CONFIG.navigation.services)` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب. .prevent تمنع التصرف الافتراضي للحدث، مثل إعادة تحميل الصفحة عند submit؛ مش هي اللي تبعت request.

**السطر 22:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `scrollToBeat(STORY_CONFIG.navigation.process)` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب. .prevent تمنع التصرف الافتراضي للحدث، مثل إعادة تحميل الصفحة عند submit؛ مش هي اللي تبعت request.

**السطر 23:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `scrollToBooking` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب. .prevent تمنع التصرف الافتراضي للحدث، مثل إعادة تحميل الصفحة عند submit؛ مش هي اللي تبعت request.

**السطر 24:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `closeMenu` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

### السطور 25–32

```vue
                    <a href="/my-garage" class="nav-garage"><AppIcon name="car" />My Garage</a>
                </div>
            </div>
        </nav>

        <section
            ref="storyElement"
            class="story"
```

**السطر 25:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 26:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 27:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 28:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 30:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 31:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 32:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 33–40

```vue
            :class="{ 'is-ready': storyReady, 'is-fallback': useFallback }"
            :style="storyHeightStyle"
        >
            <div v-if="useFallback" class="story-mode-control">
                <div class="story-mode-message"><AppIcon name="clock" /><p>{{ fallbackMessage }}</p><button class="btn" type="button" @click="enableAnimation">{{ fallbackReason === 'load' ? 'Retry animation' : 'Enable animation' }}<AppIcon name="arrow" /></button></div>
            </div>
            <StoryCanvas
                :key="storyAttempt"
```

**السطر 33:** :class اختصار v-bind:class: قيّم `{ 'is-ready': storyReady, 'is-fallback': useFallback }` كـJavaScript وحط النتيجة في الخاصية `class`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 34:** :style اختصار v-bind:style: قيّم `storyHeightStyle` كـJavaScript وحط النتيجة في الخاصية `style`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 35:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 36:** `v-if` تعتمد على `useFallback` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 37:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `enableAnimation` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 38:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 39:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 40:** :key اختصار v-bind:key: قيّم `storyAttempt` كـJavaScript وحط النتيجة في الخاصية `key`؛ من غير : كانت القيمة نصًا حرفيًا. key هوية العنصر في التكرار، مش القيمة المختارة من select.

### السطور 41–48

```vue
                :time="storyTime"
                :active="storyActive"
                :fallback="useFallback"
                :canvas-opacity="canvasOpacity"
                :overlay-opacity="canvasOverlayOpacity"
                :blur="whipEffects.blur"
                :brightness="whipEffects.brightness"
                :scale="whipEffects.scale"
```

**السطر 41:** :time اختصار v-bind:time: قيّم `storyTime` كـJavaScript وحط النتيجة في الخاصية `time`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 42:** :active اختصار v-bind:active: قيّم `storyActive` كـJavaScript وحط النتيجة في الخاصية `active`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 43:** :fallback اختصار v-bind:fallback: قيّم `useFallback` كـJavaScript وحط النتيجة في الخاصية `fallback`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 44:** :canvas-opacity اختصار v-bind:canvas-opacity: قيّم `canvasOpacity` كـJavaScript وحط النتيجة في الخاصية `canvas-opacity`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 45:** :overlay-opacity اختصار v-bind:overlay-opacity: قيّم `canvasOverlayOpacity` كـJavaScript وحط النتيجة في الخاصية `overlay-opacity`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 46:** :blur اختصار v-bind:blur: قيّم `whipEffects.blur` كـJavaScript وحط النتيجة في الخاصية `blur`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 47:** :brightness اختصار v-bind:brightness: قيّم `whipEffects.brightness` كـJavaScript وحط النتيجة في الخاصية `brightness`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 48:** :scale اختصار v-bind:scale: قيّم `whipEffects.scale` كـJavaScript وحط النتيجة في الخاصية `scale`؛ من غير : كانت القيمة نصًا حرفيًا.

### السطور 49–56

```vue
                @ready="handleStoryReady"
                @failure="activateFallback"
            />

            <div class="story-stage">
                <section class="story-panel hero-beat" :style="panelStyle('hero')">
                    <div class="container hero-story-content">
                        <p class="story-warning">Warning light on? Let’s find out why.</p>
```

**السطر 49:** @ready اختصار v-on:ready: لما الحدث `ready` يحصل، نفّذ `handleStoryReady` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 50:** @failure اختصار v-on:failure: لما الحدث `failure` يحصل، نفّذ `activateFallback` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 51:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 53:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 54:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 55:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 56:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 57–64

```vue
                        <p class="eyebrow story-eyebrow">Premium car maintenance booking system</p>
                        <h1>Book your car service <span>with confidence.</span></h1>
                        <p class="hero-description">
                            AutoCare Pro helps customers book garage appointments, choose services,
                            and track repair status with a clean and modern experience.
                        </p>
                        <div class="hero-actions">
                            <button class="btn btn-primary" type="button" @click="scrollToBooking">Book Appointment</button>
```

**السطر 57:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 58:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 59:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 60:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 61:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 62:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 63:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 64:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `scrollToBooking` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

### السطور 65–72

```vue
                            <button class="btn btn-secondary" type="button" @click="scrollToBeat(STORY_CONFIG.navigation.services)">View Services</button>
                        </div>
                    </div>

                    <div v-if="smoothProgress <= STORY_CONFIG.scrollCueEnd" class="story-scroll-cue" aria-hidden="true">
                        <span></span>Scroll to explore
                    </div>
                </section>
```

**السطر 65:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `scrollToBeat(STORY_CONFIG.navigation.services)` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 66:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 67:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 69:** `v-if` تعتمد على `smoothProgress <= STORY_CONFIG.scrollCueEnd` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 70:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 71:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 72:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 73–80

```vue

                <section class="story-panel whip-beat" :style="panelStyle('whip')">
                    <p>Let’s look under the hood.</p>
                </section>

                <section id="services" class="story-panel services-beat" :style="panelStyle('services')">
                    <div class="container beat-surface services-surface">
                        <div class="beat-heading">
```

**السطر 74:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 75:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 76:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 78:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 79:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 80:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 81–88

```vue
                            <p class="eyebrow">What we do</p>
                            <h2>Professional garage services</h2>
                            <p>Thoughtful maintenance, clearly explained. Explore our sample services and prices.</p>
                        </div>
                        <div class="services-grid">
                            <article v-for="service in services" :key="service.id" class="service-card">
                                <div class="service-icon"><AppIcon :name="service.icon" /></div>
                                <div class="service-copy">
```

**السطر 81:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 82:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 83:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 84:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 85:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 86:** v-for: لف على `services`، وفي كل دورة اسم العنصر الحالي `service`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 87:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 88:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 89–96

```vue
                                    <h3>{{ service.name }}</h3>
                                    <p>{{ service.description }}</p>
                                </div>
                                <div class="service-footer">
                                    <strong>{{ service.price }} EGP</strong><span>{{ service.time }}</span>
                                </div>
                            </article>
                        </div>
```

**السطر 89:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 90:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 91:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 92:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 93:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 94:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 95:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 96:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 97–104

```vue
                    </div>
                </section>

                <section id="process" class="story-panel process-beat" :style="panelStyle('process')">
                    <div class="container beat-surface process-surface">
                        <div class="beat-heading align-left">
                            <p class="eyebrow">Simple process</p>
                            <h2>From booking to repair in four steps</h2>
```

**السطر 97:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 98:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 100:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 101:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 102:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 103:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 104:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 105–112

```vue
                            <p>A straightforward journey, from your first request to the final handover.</p>
                        </div>
                        <div class="steps">
                            <article
                                v-for="(step, index) in steps"
                                :key="step.number"
                                class="step"
                                :style="processStepStyle(index)"
```

**السطر 105:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 106:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 107:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 108:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 109:** v-for: لف على `steps`، وفي كل دورة اسم العنصر الحالي `(step, index)`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 110:** :key اختصار v-bind:key: قيّم `step.number` كـJavaScript وحط النتيجة في الخاصية `key`؛ من غير : كانت القيمة نصًا حرفيًا. key هوية العنصر في التكرار، مش القيمة المختارة من select.

**السطر 111:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 112:** :style اختصار v-bind:style: قيّم `processStepStyle(index)` كـJavaScript وحط النتيجة في الخاصية `style`؛ من غير : كانت القيمة نصًا حرفيًا.

### السطور 113–120

```vue
                            >
                                <span>{{ step.number }}</span>
                                <div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div>
                            </article>
                        </div>
                    </div>
                </section>

```

**السطر 113:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 114:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 115:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 116:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 117:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 118:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 119:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 121–128

```vue
                <section class="story-panel diagnosis-beat" :style="panelStyle('diagnosis')">
                    <div class="container diagnosis-layout">
                        <aside class="diagnosis-panel" aria-label="Example vehicle inspection">
                            <div class="diagnosis-header">
                                <div>
                                    <span class="diagnosis-kicker"><AppIcon name="shield" /> Example report</span>
                                    <h2>Vehicle health, made clear.</h2>
                                </div>
```

**السطر 121:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 122:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 123:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 124:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 125:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 126:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 127:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 128:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 129–136

```vue
                                <span class="diagnosis-pulse" aria-hidden="true"></span>
                            </div>

                            <div class="diagnosis-list">
                                <article
                                    v-for="item in diagnosisData"
                                    :key="item.name"
                                    class="diagnosis-card"
```

**السطر 129:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 130:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 132:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 133:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 134:** v-for: لف على `diagnosisData`، وفي كل دورة اسم العنصر الحالي `item`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 135:** :key اختصار v-bind:key: قيّم `item.name` كـJavaScript وحط النتيجة في الخاصية `key`؛ من غير : كانت القيمة نصًا حرفيًا. key هوية العنصر في التكرار، مش القيمة المختارة من select.

**السطر 136:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 137–144

```vue
                                    :class="`status-${item.status}`"
                                >
                                    <div class="diagnosis-card-copy">
                                        <span class="diagnosis-status-icon" aria-hidden="true"><AppIcon :name="item.status === 'green' ? 'check' : item.status === 'amber' ? 'clock' : 'warning'" /></span>
                                        <div><strong>{{ item.name }}</strong><small>{{ item.label }}</small></div>
                                    </div>
                                    <div class="diagnosis-value">{{ diagnosisDisplayValue(item.value) }}%</div>
                                    <div class="diagnosis-track" aria-hidden="true">
```

**السطر 137:** :class اختصار v-bind:class: قيّم `'status-${item.status}'` كـJavaScript وحط النتيجة في الخاصية `class`؛ من غير : كانت القيمة نصًا حرفيًا.

**السطر 138:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 139:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 140:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 141:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 142:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 143:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 144:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 145–152

```vue
                                        <span :style="{ width: `${diagnosisDisplayValue(item.value)}%` }"></span>
                                    </div>
                                </article>
                            </div>

                            <p class="diagnosis-disclaimer">Illustrative readings, not a diagnosis of your vehicle.</p>
                            <button class="btn diagnosis-button" type="button" @click="bookRecommendedService">
                                Book recommended service
```

**السطر 145:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 146:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 147:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 148:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 150:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 151:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `bookRecommendedService` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 152:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 153–160

```vue
                            </button>
                        </aside>
                    </div>
                </section>

                <section class="story-panel finale-beat" :style="panelStyle('finale')">
                    <div class="finale-card">
                        <p class="eyebrow">Ready when you are</p>
```

**السطر 153:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 154:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 155:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 156:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 158:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 159:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 160:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 161–168

```vue
                        <h2>Your car deserves confident care.</h2>
                        <p>Choose a convenient time and let our garage team handle the rest.</p>
                        <button class="btn btn-primary" type="button" @click="scrollToBooking">Schedule your service</button>
                    </div>
                </section>
            </div>
        </section>

```

**السطر 161:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 162:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 163:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `scrollToBooking` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 164:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 165:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 166:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 167:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 169–176

```vue
        <main class="page-content">
            <WorkshopSection />
            <section class="section booking-section" id="booking">
                <div class="container booking-grid">
                    <div class="booking-info">
                        <p class="eyebrow">Book now</p>
                        <h2>Schedule your appointment</h2>
                        <p>
```

**السطر 169:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 170:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 171:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 172:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 173:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 174:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 175:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 176:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 177–184

```vue
                            Tell us what your car needs and choose a preferred time.
                            Your demo request will appear in My Garage, ready for you to manage.
                        </p>
                        <div class="info-box"><AppIcon name="shield" /><strong>A little detail makes a difference.</strong><span>Describe the symptoms so a workshop can prepare for your visit.</span></div>
                        <p class="booking-demo-note"><StatusBadge label="Demo booking" icon="calendar" tone="neutral" /> No real appointment is made. Service requests are saved in this browser only.</p>
                    </div>

                    <form class="booking-form" @submit.prevent="submitBooking">
```

**السطر 177:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 178:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 179:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 180:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 181:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 182:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 184:** @submit اختصار v-on:submit: لما الحدث `submit` يحصل، نفّذ `submitBooking` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب. .prevent تمنع التصرف الافتراضي للحدث، مثل إعادة تحميل الصفحة عند submit؛ مش هي اللي تبعت request.

### السطور 185–192

```vue
                        <div class="form-row">
                            <div class="form-group">
                                <label for="booking-name">Full Name</label>
                                <input id="booking-name" v-model="form.name" type="text" autocomplete="name" required placeholder="Example: Momen Hassan">
                            </div>
                            <div class="form-group">
                                <label for="booking-phone">Phone Number</label>
                                <input id="booking-phone" v-model="form.phone" type="tel" autocomplete="tel" required placeholder="Example: 01012345678">
```

**السطر 185:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 186:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 187:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 188:** v-model تربط قيمة عنصر الإدخال بـ`form.name` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 189:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 190:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 191:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 192:** v-model تربط قيمة عنصر الإدخال بـ`form.phone` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

### السطور 193–200

```vue
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="booking-car">Car Model</label>
                                <input id="booking-car" v-model="form.car" type="text" required placeholder="Example: Toyota Corolla 2018">
                            </div>
                            <div class="form-group">
```

**السطر 193:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 194:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 195:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 196:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 197:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 198:** v-model تربط قيمة عنصر الإدخال بـ`form.car` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 199:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 200:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 201–208

```vue
                                <label for="booking-service">Service</label>
                                <select id="booking-service" v-model="form.service" required>
                                    <option value="">Choose service</option>
                                    <option v-for="service in services" :key="service.id" :value="service.name">{{ service.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
```

**السطر 201:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 202:** v-model تربط قيمة عنصر الإدخال بـ`form.service` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 203:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 204:** v-for: لف على `services`، وفي كل دورة اسم العنصر الحالي `service`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 205:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 206:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 207:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 208:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 209–216

```vue
                            <div class="form-group">
                                <label for="booking-date">Date</label>
                                <input id="booking-date" v-model="form.date" type="date" :min="today" required>
                            </div>
                            <div class="form-group">
                                <label for="booking-time">Time</label>
                                <input id="booking-time" v-model="form.time" type="time" required>
                            </div>
```

**السطر 209:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 210:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 211:** v-model تربط قيمة عنصر الإدخال بـ`form.date` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 212:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 213:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 214:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 215:** v-model تربط قيمة عنصر الإدخال بـ`form.time` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 216:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 217–224

```vue
                        </div>
                        <div class="form-group">
                            <label for="booking-notes">Problem Description</label>
                            <textarea id="booking-notes" v-model="form.notes" rows="5" placeholder="Tell us what happened with the car..."></textarea>
                        </div>
                        <p v-if="errorMessage" class="alert alert-error" role="alert"><AppIcon name="warning" />{{ errorMessage }}</p>
                        <p v-if="successMessage" class="alert alert-success" role="status"><AppIcon name="check" />{{ successMessage }} <a href="/my-garage#appointments">View in My Garage →</a></p>
                        <button class="btn btn-primary form-btn" type="submit">Submit Booking</button>
```

**السطر 217:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 218:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 219:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 220:** v-model تربط قيمة عنصر الإدخال بـ`form.notes` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 221:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 222:** `v-if` تعتمد على `errorMessage` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 223:** `v-if` تعتمد على `successMessage` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 224:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 225–232

```vue
                    </form>
                </div>
            </section>
            <CustomerSupport />
        </main>

        <footer class="footer">
            <div class="container footer-content">
```

**السطر 225:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 226:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 227:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 228:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 229:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 231:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 232:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 233–240

```vue
                <div><strong>AutoCare Pro</strong><p>Care for your car. Clarity for you.</p><small class="footer-demo">Portfolio demo · Sample business and customer details.</small></div>
                <div class="footer-links"><a href="/my-garage">My Garage</a><a href="#faqs">FAQs</a><a href="#contact">Contact &amp; hours</a></div>
            </div>
        </footer>
    </div>
</template>

<script setup>
```

**السطر 233:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 234:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 235:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 236:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 237:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 238:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 240:** بداية جزء JavaScript في مكوّن Vue/صفحة HTML. setup في Vue تتيح التعريفات للـtemplate؛ type=module في HTML يحدد تحميل module.

### السطور 241–248

```vue
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StoryCanvas from './StoryCanvas.vue';
import AppIcon from './AppIcon.vue';
import StatusBadge from './StatusBadge.vue';
import WorkshopSection from './WorkshopSection.vue';
import CustomerSupport from './CustomerSupport.vue';
```

**السطر 241:** Import / استيراد: الأسماء `computed`، `nextTick`، `onBeforeUnmount`، `onMounted`، `reactive`، `ref` جاية من `vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 242:** Import / استيراد: الأسماء `gsap` جاية من `gsap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 243:** Import / استيراد: الأسماء `ScrollTrigger` جاية من `gsap/ScrollTrigger`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 244:** Import / استيراد: الأسماء `StoryCanvas` جاية من `./StoryCanvas.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 245:** Import / استيراد: الأسماء `AppIcon` جاية من `./AppIcon.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 246:** Import / استيراد: الأسماء `StatusBadge` جاية من `./StatusBadge.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 247:** Import / استيراد: الأسماء `WorkshopSection` جاية من `./WorkshopSection.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 248:** Import / استيراد: الأسماء `CustomerSupport` جاية من `./CustomerSupport.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 249–256

```vue
import { useGarage } from '../composables/useGarage';

const { addAppointment, storage } = useGarage();
const today = new Date().toLocaleDateString('en-CA');

gsap.registerPlugin(ScrollTrigger);

// All scroll-story pacing, beat ranges and effects can be tuned from this object.
```

**السطر 249:** Import / استيراد: الأسماء `useGarage` جاية من `../composables/useGarage`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 251:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useGarage(...)`: يرجع الحالة وعمليات الإضافة؛ مش بيبدأ نسخة state منفصلة لكل component. مدخلاتها: لا شيء العائد/الأثر: { state, storage, addVehicle, addAppointment }. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 252:** Variable declaration / تعريف `today` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `new Date().toLocaleDateString(...)`: تنسّق التاريخ للعرض حسب locale/options. القيم المكتوبة هنا: `'en-CA'`. العائد/الأثر: string، وليس قيمة مناسبة بالضرورة للتخزين.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 254:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `gsap.registerPlugin(...)`: تسجّل plugin مثل ScrollTrigger قبل استخدامه. القيم المكتوبة هنا: `ScrollTrigger`. العائد/الأثر: لا نعتمد على return؛ الأثر إتاحة plugin في GSAP.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 256:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 257–264

```vue
const STORY_CONFIG = Object.freeze({
    duration: 10.04,
    heightDesktopVh: 800,
    heightMobileVh: 600,
    smoothingSeconds: 0.5,
    scrollCueEnd: 0.03,
    scrollMap: [
        { p: 0.00, t: 0.0 },
```

**السطر 257:** Variable declaration / تعريف `STORY_CONFIG` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `STORY_CONFIG` هنا: إعدادات ثابتة للقصة: مدى الأقسام، زمن الصور، ارتفاع مساحة scroll، التنعيم والblur. المدخلات: Object.freeze على object إعدادات. الناتج/الأثر: object مجمّد shallow؛ nested objects ليست deep-frozen تلقائيًا. الدوال الموجودة في السطر: `Object.freeze(...)`: يجمد properties على المستوى الأول فقط؛ مش deep freeze. القيم المكتوبة هنا: `{     duration: 10.04,     heightDesktopVh: 800,     heightMobileVh: 600,     smoothingSeconds: 0.5,     scrol…`. العائد/الأثر: نفس object مجمد. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 258:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 259:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 260:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 261:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 262:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 263:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 264:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 265–272

```vue
        { p: 0.26, t: 3.3 },
        { p: 0.34, t: 4.8 },
        { p: 0.52, t: 6.6 },
        { p: 0.62, t: 7.5 },
        { p: 0.90, t: 9.6 },
        { p: 1.00, t: 10.04 },
    ],
    beats: {
```

**السطر 265:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 266:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 267:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 268:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 269:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 270:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 271:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 272:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 273–280

```vue
        hero: [0.00, 0.26],
        whip: [0.26, 0.34],
        services: [0.34, 0.52],
        process: [0.52, 0.62],
        diagnosis: [0.62, 0.90],
        finale: [0.90, 1.00],
    },
    navigation: { services: 0.36, process: 0.53 },
```

**السطر 273:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 274:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 275:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 276:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 277:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 278:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 279:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 280:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 281–288

```vue
    panelFade: 0.022,
    canvasFade: [0.94, 1.00],
    diagnosisCountEnd: 0.74,
    whip: {
        range: [0.26, 0.34],
        blur: 6,
        brightness: 1.15,
        scale: 1.04,
```

**السطر 281:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 282:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 283:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 284:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 285:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 286:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 287:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 288:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 289–296

```vue
    },
});

const services = [
    { id: 1, icon: 'oil', name: 'Oil Change', description: 'Replace engine oil and filter to keep your engine clean and healthy.', price: 450, time: '35 min' },
    { id: 2, icon: 'car', name: 'Tire Service', description: 'Tire inspection, pressure check, rotation, and replacement support.', price: 300, time: '25 min' },
    { id: 3, icon: 'brake', name: 'Brake Repair', description: 'Check brake pads, discs, oil, and braking performance.', price: 700, time: '60 min' },
    { id: 4, icon: 'wrench', name: 'Engine Check', description: 'Full engine diagnosis to detect problems before they grow.', price: 850, time: '75 min' },
```

**السطر 289:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 290:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 292:** Variable declaration / تعريف `services` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 6 عنصرًا؛ العناصر نفسها في السطور التالية. دور `services` هنا: قائمة الخدمات والأسعار والأيقونات، تتكرر في الكروت وخيارات select. المدخلات: لا شيء. الناتج/الأثر: array ثابتة.

**السطر 293:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 294:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 295:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 296:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 297–304

```vue
    { id: 5, icon: 'battery', name: 'Battery Test', description: 'Battery health check, charging test, and replacement advice.', price: 250, time: '20 min' },
    { id: 6, icon: 'snow', name: 'AC Service', description: 'Air conditioning inspection, gas refill, and cooling performance check.', price: 650, time: '50 min' },
];

const steps = [
    { number: '01', title: 'Choose Service', text: 'Customer selects the maintenance service they need.' },
    { number: '02', title: 'Send Request', text: 'Customer enters car details, date, time, and problem notes.' },
    { number: '03', title: 'Admin Review', text: 'Garage admin approves, rejects, or updates the booking status.' },
```

**السطر 297:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 298:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 299:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 301:** Variable declaration / تعريف `steps` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 4 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 302:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 303:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 304:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 305–312

```vue
    { number: '04', title: 'Repair Complete', text: 'Mechanic finishes the job and the system marks it as completed.' },
];

const diagnosisData = [
    { name: 'Engine check', value: 92, status: 'green', label: 'Running smoothly' },
    { name: 'Oil level', value: 76, status: 'amber', label: 'Service soon' },
    { name: 'Brake pads', value: 48, status: 'red', label: 'Needs attention' },
    { name: 'Battery', value: 88, status: 'green', label: 'Healthy charge' },
```

**السطر 305:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 306:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 308:** Variable declaration / تعريف `diagnosisData` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 4 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 309:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 310:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 311:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 312:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 313–320

```vue
];

const menuOpen = ref(false);
const navbarScrolled = ref(false);
const storyElement = ref(null);
const storyReady = ref(false);
const storyActive = ref(true);
const useFallback = ref(false);
```

**السطر 313:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 315:** Variable declaration / تعريف `menuOpen` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `false`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 316:** Variable declaration / تعريف `navbarScrolled` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `false`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 317:** Variable declaration / تعريف `storyElement` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `null`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 318:** Variable declaration / تعريف `storyReady` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `false`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 319:** Variable declaration / تعريف `storyActive` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `true`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 320:** Variable declaration / تعريف `useFallback` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `false`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 321–328

```vue
const storyAttempt = ref(0);
const fallbackReason = ref('');
const fallbackMessage = computed(() => ({
    motion: 'Static preview: your device prefers reduced motion. You can choose to enable the scroll animation.',
    data: 'Static preview: Data Saver is enabled. Playing the animation will download additional images.',
    connection: 'Static preview: a very slow connection was detected. You can try the scroll animation.',
    load: 'The animation could not finish loading. You can retry; all services and booking remain available.',
}[fallbackReason.value] || 'You are viewing a static preview.'));
```

**السطر 321:** Variable declaration / تعريف `storyAttempt` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `0`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 322:** Variable declaration / تعريف `fallbackReason` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `''`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 323:** Variable declaration / تعريف `fallbackMessage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `fallbackMessage` هنا: سبب fallback يختار رسالة مفهومة وزر محاولة؛ لا يصنع حركة. المدخلات: fallbackReason.value. الناتج/الأثر: computed string. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => ({     motion: 'Static preview: your device prefers reduced motion. You can choose to enable the scroll …`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 324:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 325:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 326:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 327:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 328:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 329–336

```vue
const smoothProgress = ref(0);
const rawProgress = ref(0);
const errorMessage = ref('');
const successMessage = ref('');
const mobileViewport = ref(false);
let scrollTrigger;
let storyObserver;
const smoothState = { value: 0 };
```

**السطر 329:** Variable declaration / تعريف `smoothProgress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `0`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 330:** Variable declaration / تعريف `rawProgress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `0`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 331:** Variable declaration / تعريف `errorMessage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `''`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 332:** Variable declaration / تعريف `successMessage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `''`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 333:** Variable declaration / تعريف `mobileViewport` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `false`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 334:** Variable declaration / تعريف `scrollTrigger` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 335:** Variable declaration / تعريف `storyObserver` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 336:** Variable declaration / تعريف `smoothState` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `value`.

### السطور 337–344

```vue

const form = reactive({ name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' });

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
const smoothstep = (value) => {
    const x = clamp(value);
    return x * x * (3 - (2 * x));
};
```

**السطر 338:** Variable declaration / تعريف `form` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `form` هنا: بيانات الفورم مجمعة في reactive object، وv-model تكتب في حقولها مباشرة. المدخلات: name,phone,car,service,date,time,notes. الناتج/الأثر: Vue reactive proxy. الدوال الموجودة في السطر: `reactive(...)`: يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value. القيم المكتوبة هنا: `{ name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' }`. العائد/الأثر: reactive Proxy. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 340:** Variable declaration / تعريف `clamp` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `clamp` هنا: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. المدخلات: value,minimum=0,maximum=1. الناتج/الأثر: number. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `maximum`، `Math.max(minimum, value)`. العائد/الأثر: number.؛ `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `minimum`، `value`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 341:** Variable declaration / تعريف `smoothstep` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `smoothstep` هنا: يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp. المدخلات: value. الناتج/الأثر: number 0..1.

**السطر 342:** Variable declaration / تعريف `x` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `clamp(...)`: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. القيم المكتوبة هنا: `value`. العائد/الأثر: number. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 343:** Return / رجّع `x * x * (3 - (2 * x))` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 344:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 345–352

```vue

const storyHeightStyle = computed(() => ({
    '--story-height': `${mobileViewport.value ? STORY_CONFIG.heightMobileVh : STORY_CONFIG.heightDesktopVh}vh`,
}));

const storyTime = computed(() => {
    const progress = smoothProgress.value;
    const points = STORY_CONFIG.scrollMap;
```

**السطر 346:** Variable declaration / تعريف `storyHeightStyle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `storyHeightStyle` هنا: يبني CSS custom property للارتفاع حسب عرض الشاشة. المدخلات: mobileViewport.value وSTORY_CONFIG. الناتج/الأثر: computed object {'--story-height':'600vh' أو '800vh'}. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => ({     '--story-height': '${mobileViewport.value ? STORY_CONFIG.heightMobileVh : STORY_CONFIG.heightDesk…`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 347:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 348:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 350:** Variable declaration / تعريف `storyTime` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `storyTime` هنا: يحوّل تقدم scroll إلى زمن صور بالمقاطع المحددة في scrollMap؛ مش video.currentTime. المدخلات: smoothProgress.value. الناتج/الأثر: computed number من0 إلى10.04. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => {     const progress = smoothProgress.value;     const points = STORY_CONFIG.scrollMap;     for (let ind…`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 351:** Variable declaration / تعريف `progress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 352:** Variable declaration / تعريف `points` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 353–360

```vue
    for (let index = 0; index < points.length - 1; index += 1) {
        const current = points[index];
        const next = points[index + 1];
        if (progress <= next.p) {
            const amount = clamp((progress - current.p) / (next.p - current.p));
            return current.t + ((next.t - current.t) * amount);
        }
    }
```

**السطر 353:** Variable declaration / تعريف `index` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 354:** Variable declaration / تعريف `current` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 355:** Variable declaration / تعريف `next` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 356:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 357:** Variable declaration / تعريف `amount` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `clamp(...)`: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. القيم المكتوبة هنا: `(progress - current.p) / (next.p - current.p)`. العائد/الأثر: number. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 358:** Return / رجّع `current.t + ((next.t - current.t) * amount)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 359:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 360:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 361–368

```vue
    return STORY_CONFIG.duration;
});

const canvasOpacity = computed(() => {
    if (useFallback.value) return 1;
    const [start, end] = STORY_CONFIG.canvasFade;
    return 1 - smoothstep((smoothProgress.value - start) / (end - start));
});
```

**السطر 361:** Return / رجّع `STORY_CONFIG.duration` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 362:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 364:** Variable declaration / تعريف `canvasOpacity` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `canvasOpacity` هنا: يحافظ على الصورة في fallback وإلا يخفّيها تدريجيًا قرب نهاية القصة. المدخلات: smoothProgress,useFallback. الناتج/الأثر: computed opacity number. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => {     if (useFallback.value) return 1;     const [start, end] = STORY_CONFIG.canvasFade;     return 1 - …`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 365:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 366:** Variable declaration / تعريف `start + end` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 367:** Return / رجّع `1 - smoothstep((smoothProgress.value - start) / (end - start))` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `smoothstep(...)`: يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp. القيم المكتوبة هنا: `(smoothProgress.value - start) / (end - start)`. العائد/الأثر: number 0..1. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 368:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 369–376

```vue

const canvasOverlayOpacity = computed(() => {
    if (useFallback.value) return 0.72;
    if (smoothProgress.value >= STORY_CONFIG.beats.services[0] && smoothProgress.value < STORY_CONFIG.beats.finale[0]) return 0.72;
    return 0.55;
});

const whipEffects = computed(() => {
```

**السطر 370:** Variable declaration / تعريف `canvasOverlayOpacity` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `canvasOverlayOpacity` هنا: يزود طبقة التعتيم خلف فترات القراءة؛ 0.72 في الأقسام و0.55 في البداية والنهاية. المدخلات: smoothProgress,useFallback. الناتج/الأثر: computed number. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => {     if (useFallback.value) return 0.72;     if (smoothProgress.value >= STORY_CONFIG.beats.services[0]…`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 371:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 372:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 373:** Return / رجّع `0.55` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 374:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 376:** Variable declaration / تعريف `whipEffects` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `whipEffects` هنا: نبضة blur/brightness/scale تبدأ بصفر وتعلو ثم ترجع عند انتقال whip. المدخلات: smoothProgress,useFallback,STORY_CONFIG.whip. الناتج/الأثر: computed object ينتقل كprops. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => {     if (useFallback.value) return { blur: 0, brightness: 1, scale: 1 };     const [start, end] = STORY…`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 377–384

```vue
    if (useFallback.value) return { blur: 0, brightness: 1, scale: 1 };
    const [start, end] = STORY_CONFIG.whip.range;
    const phase = clamp((smoothProgress.value - start) / (end - start));
    const intensity = Math.sin(Math.PI * phase);
    return {
        blur: STORY_CONFIG.whip.blur * intensity,
        brightness: 1 + ((STORY_CONFIG.whip.brightness - 1) * intensity),
        scale: 1 + ((STORY_CONFIG.whip.scale - 1) * intensity),
```

**السطر 377:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 378:** Variable declaration / تعريف `start + end` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 379:** Variable declaration / تعريف `phase` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `clamp(...)`: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. القيم المكتوبة هنا: `(smoothProgress.value - start) / (end - start)`. العائد/الأثر: number. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 380:** Variable declaration / تعريف `intensity` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.sin(...)`: تحسب sine لزاوية بالراديان. القيم المكتوبة هنا: `Math.PI * phase`. العائد/الأثر: number؛ مثال انتقال الصورة يستخدم منحنى0→1→0.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 381:** Return / رجّع `{` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 382:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 383:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 384:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 385–392

```vue
    };
});

function panelOpacity(name) {
    if (useFallback.value) return 1;
    const [start, end] = STORY_CONFIG.beats[name];
    const fade = STORY_CONFIG.panelFade;
    const fadeIn = start === 0 ? 1 : smoothstep((smoothProgress.value - start) / fade);
```

**السطر 385:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 386:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 388:** Function / تعريف دالة `panelOpacity`؛ تعريفها مش تشغيلها. يحسب دخول وخروج قسم واحد حسب مداه؛ في fallback يرجع1 لكل الأقسام. مدخلاتها: name مفتاح beats ناتجها: number بين0و1

**السطر 389:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 390:** Variable declaration / تعريف `start + end` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 391:** Variable declaration / تعريف `fade` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 392:** Variable declaration / تعريف `fadeIn` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `smoothstep(...)`: يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp. القيم المكتوبة هنا: `(smoothProgress.value - start) / fade`. العائد/الأثر: number 0..1. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 393–400

```vue
    const fadeOut = end === 1 ? 1 : smoothstep((end - smoothProgress.value) / fade);
    return clamp(Math.min(fadeIn, fadeOut));
}

function panelStyle(name) {
    const opacity = panelOpacity(name);
    return {
        opacity,
```

**السطر 393:** Variable declaration / تعريف `fadeOut` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `smoothstep(...)`: يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp. القيم المكتوبة هنا: `(end - smoothProgress.value) / fade`. العائد/الأثر: number 0..1. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 394:** Return / رجّع `clamp(Math.min(fadeIn, fadeOut))` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clamp(...)`: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. القيم المكتوبة هنا: `Math.min(fadeIn, fadeOut)`. العائد/الأثر: number؛ `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `fadeIn`، `fadeOut`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 395:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 397:** Function / تعريف دالة `panelStyle`؛ تعريفها مش تشغيلها. يحوّل opacity إلى CSS للحركة والتفاعل والظهور؛ العناصر تظل mounted. مدخلاتها: name ناتجها: {opacity,transform,pointerEvents,visibility}

**السطر 398:** Variable declaration / تعريف `opacity` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `panelOpacity(...)`: يحسب دخول وخروج قسم واحد حسب مداه؛ في fallback يرجع1 لكل الأقسام. القيم المكتوبة هنا: `name`. العائد/الأثر: number بين0و1. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 399:** Return / رجّع `{` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 400:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 401–408

```vue
        transform: useFallback.value ? 'none' : `translateY(${(1 - opacity) * 28}px)`,
        pointerEvents: opacity > 0.65 ? 'auto' : 'none',
        visibility: opacity > 0.001 ? 'visible' : 'hidden',
    };
}

function processStepStyle(index) {
    if (useFallback.value) return {};
```

**السطر 401:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 402:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 403:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 404:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 405:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 407:** Function / تعريف دالة `processStepStyle`؛ تعريفها مش تشغيلها. يؤخر ظهور كل خطوة حسب index داخل مدى process. مدخلاتها: index رقم الخطوة ناتجها: CSS object أو {} في fallback

**السطر 408:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 409–416

```vue
    const [start, end] = STORY_CONFIG.beats.process;
    const local = clamp((smoothProgress.value - start) / (end - start));
    const stepProgress = smoothstep((local - (index * 0.13)) / 0.28);
    return { opacity: stepProgress, transform: `translateY(${(1 - stepProgress) * 24}px)` };
}

function diagnosisDisplayValue(target) {
    if (useFallback.value) return target;
```

**السطر 409:** Variable declaration / تعريف `start + end` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 410:** Variable declaration / تعريف `local` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `clamp(...)`: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. القيم المكتوبة هنا: `(smoothProgress.value - start) / (end - start)`. العائد/الأثر: number. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 411:** Variable declaration / تعريف `stepProgress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `smoothstep(...)`: يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp. القيم المكتوبة هنا: `(local - (index * 0.13)) / 0.28`. العائد/الأثر: number 0..1. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 412:** Return / رجّع `{ opacity: stepProgress, transform: 'translateY(${(1 - stepProgress) * 24}px)' }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 413:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 415:** Function / تعريف دالة `diagnosisDisplayValue`؛ تعريفها مش تشغيلها. عداد رسومي للقراءات demo؛ يرجع الهدف مباشرة في fallback. مدخلاتها: target نسبة مثال ناتجها: integer؛ مش تحليل سيارة فعلي

**السطر 416:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 417–424

```vue
    const start = STORY_CONFIG.beats.diagnosis[0];
    const progress = smoothstep((smoothProgress.value - start) / (STORY_CONFIG.diagnosisCountEnd - start));
    return Math.round(target * progress);
}

function scrollToBeat(progress) {
    closeMenu();
    if (useFallback.value) {
```

**السطر 417:** Variable declaration / تعريف `start` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 418:** Variable declaration / تعريف `progress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `smoothstep(...)`: يحوّل تقدم 0..1 إلى منحنى دخول/خروج ناعم بعد clamp. القيم المكتوبة هنا: `(smoothProgress.value - start) / (STORY_CONFIG.diagnosisCountEnd - start)`. العائد/الأثر: number 0..1. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 419:** Return / رجّع `Math.round(target * progress)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `Math.round(...)`: تقرّب عددًا لأقرب integer. القيم المكتوبة هنا: `target * progress`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 420:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 422:** Function / تعريف دالة `scrollToBeat`؛ تعريفها مش تشغيلها. يقفل mobile menu ثم ينتقل لإحداثي progress في story؛ fallback يستخدم sections عادية. مدخلاتها: progress رقم0..1 ناتجها: undefined؛ DOM scrolling

**السطر 423:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `closeMenu(...)`: يضبط menuOpen=false بعد التنقل. مدخلاتها: لا شيء العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 424:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 425–432

```vue
        if (progress === 0) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const destination = progress < 0.5 ? '#services' : '#process';
        document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    if (!storyElement.value) return;
    const storyTop = storyElement.value.offsetTop;
    const distance = storyElement.value.offsetHeight - window.innerHeight;
```

**السطر 425:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `window.scrollTo(...)`: تحرّك موضع التمرير. القيم المكتوبة هنا: `{ top: 0, behavior: 'smooth' }`. العائد/الأثر: undefined؛ الحركة الناعمة ليست Promise تنتظرها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 426:** Variable declaration / تعريف `destination` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 427:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `document.querySelector(destination)?.scrollIntoView(...)`: تطلب تمرير حاويات لإظهار العنصر. القيم المكتوبة هنا: `{ behavior: 'smooth' }`. العائد/الأثر: undefined.؛ `document.querySelector(...)`: تبحث عن أول عنصر يطابق CSS selector. القيم المكتوبة هنا: `destination`. العائد/الأثر: Element أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 428:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 429:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 430:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 431:** Variable declaration / تعريف `storyTop` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 432:** Variable declaration / تعريف `distance` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 433–440

```vue
    window.scrollTo({ top: storyTop + (distance * progress), behavior: 'smooth' });
}

function scrollToBooking() {
    closeMenu();
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
}

```

**السطر 433:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `window.scrollTo(...)`: تحرّك موضع التمرير. القيم المكتوبة هنا: `{ top: storyTop + (distance * progress), behavior: 'smooth' }`. العائد/الأثر: undefined؛ الحركة الناعمة ليست Promise تنتظرها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 434:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 436:** Function / تعريف دالة `scrollToBooking`؛ تعريفها مش تشغيلها. يقفل المينو وينزل لعنصر booking لو موجود. مدخلاتها: لا شيء ناتجها: undefined؛ optional chaining يمنع خطأ غياب العنصر

**السطر 437:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `closeMenu(...)`: يضبط menuOpen=false بعد التنقل. مدخلاتها: لا شيء العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 438:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `document.querySelector('#booking')?.scrollIntoView(...)`: تطلب تمرير حاويات لإظهار العنصر. القيم المكتوبة هنا: `{ behavior: 'smooth' }`. العائد/الأثر: undefined.؛ `document.querySelector(...)`: تبحث عن أول عنصر يطابق CSS selector. القيم المكتوبة هنا: `'#booking'`. العائد/الأثر: Element أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 439:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 441–448

```vue
function bookRecommendedService() {
    form.service = 'Engine Check';
    scrollToBooking();
}

function closeMenu() {
    menuOpen.value = false;
}
```

**السطر 441:** Function / تعريف دالة `bookRecommendedService`؛ تعريفها مش تشغيلها. يختار Engine Check برمجيًا في form ثم يذهب للحجز. مدخلاتها: لا شيء ناتجها: undefined؛ side effects

**السطر 442:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 443:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `scrollToBooking(...)`: يقفل المينو وينزل لعنصر booking لو موجود. مدخلاتها: لا شيء العائد/الأثر: undefined؛ optional chaining يمنع خطأ غياب العنصر. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 444:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 446:** Function / تعريف دالة `closeMenu`؛ تعريفها مش تشغيلها. يضبط menuOpen=false بعد التنقل. مدخلاتها: لا شيء ناتجها: undefined

**السطر 447:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 448:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 449–456

```vue

function activateFallback(reason = 'load') {
    fallbackReason.value = typeof reason === 'string' ? reason : 'load';
    useFallback.value = true;
    storyReady.value = true;
    scrollTrigger?.kill();
    gsap.killTweensOf(smoothState);
    smoothProgress.value = 1;
```

**السطر 450:** Function / تعريف دالة `activateFallback`؛ تعريفها مش تشغيلها. يسجل السبب ويحوّل العرض إلى ثابت ويوقف ScrollTrigger/tweens ويجعل النصوص قابلة للقراءة. مدخلاتها: reason='load'؛ failure event ممكن يبعت Error فيتحول السبب إلى load ناتجها: undefined؛ fallback لا يحذف خدمات/فورم

**السطر 451:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 452:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 453:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 454:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `scrollTrigger?.kill(...)`: تنهي هذه instance وتوقف تحديثاتها/اشتراكاتها وفق API. مدخلاتها: خيارات اختيارية حسب النوع. العائد/الأثر: الأثر تنظيف هذه الحركة/المراقبة، مش إلغاء كل JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 455:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `gsap.killTweensOf(...)`: يوقف tweens المرتبطة بالtarget قبل reset/cleanup. القيم المكتوبة هنا: `smoothState`. العائد/الأثر: void. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 456:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 457–464

```vue
}

function handleStoryReady() {
    storyReady.value = true;
    if (!useFallback.value) requestAnimationFrame(() => scrollTrigger?.refresh());
}

async function enableAnimation() {
```

**السطر 457:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 459:** Function / تعريف دالة `handleStoryReady`؛ تعريفها مش تشغيلها. ينهي loader، ثم refresh في animation frame لو الحركة فعالة. مدخلاتها: ready event من StoryCanvas ناتجها: undefined

**السطر 460:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 461:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `requestAnimationFrame(...)`: يطلب callback مرة قبل فرصة رسم لاحقة؛ التجميع يقلل عمل scroll المكرر. القيم المكتوبة هنا: `() => scrollTrigger?.refresh()`. العائد/الأثر: request id؛ `scrollTrigger?.refresh(...)`: تعيد حساب مواضع بداية/نهاية triggers بعد تغيّر layout. مدخلاتها: خيارات اختيارية. العائد/الأثر: أثر إعادة الحساب وتفعيل callbacks المناسبة؛ لا تعيد تحميل الصفحة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 462:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 464:** Function / تعريف دالة `enableAnimation`؛ تعريفها مش تشغيلها. يصفّر الحالة ويزيد key لإعادة إنشاء StoryCanvas، ثم ينتظر DOM ويبدأ scroll story من فوق. مدخلاتها: نقرة Retry/Enable ناتجها: Promise<void>؛ async ولا يرسل backend request

### السطور 465–472

```vue
    useFallback.value = false;
    fallbackReason.value = '';
    storyReady.value = false;
    smoothState.value = 0;
    smoothProgress.value = 0;
    rawProgress.value = 0;
    storyActive.value = true;
    storyAttempt.value += 1;
```

**السطر 465:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 466:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 467:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 468:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 469:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 470:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 471:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 472:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 473–480

```vue
    await nextTick();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setupScrollStory();
}

function setupScrollStory() {
    scrollTrigger?.kill();
    storyObserver?.disconnect();
```

**السطر 473:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `nextTick(...)`: ينتظر انتهاء دفعة تحديث DOM الحالية بعد تغيير state، مش انتظار network ولا تأخير ثابت. مدخلاتها: callback اختياري العائد/الأثر: Promise<void>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 474:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `window.scrollTo(...)`: تحرّك موضع التمرير. القيم المكتوبة هنا: `{ top: 0, behavior: 'instant' }`. العائد/الأثر: undefined؛ الحركة الناعمة ليست Promise تنتظرها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 475:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setupScrollStory(...)`: ينظف instances سابقة، يعمل ScrollTrigger لتقدم القصة وIntersectionObserver لتعطيل رسم الخلفية خارج المشهد. مدخلاتها: storyElement DOM وconfig العائد/الأثر: undefined؛ يحتفظ handles في scrollTrigger/storyObserver. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 476:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 478:** Function / تعريف دالة `setupScrollStory`؛ تعريفها مش تشغيلها. ينظف instances سابقة، يعمل ScrollTrigger لتقدم القصة وIntersectionObserver لتعطيل رسم الخلفية خارج المشهد. مدخلاتها: storyElement DOM وconfig ناتجها: undefined؛ يحتفظ handles في scrollTrigger/storyObserver

**السطر 479:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `scrollTrigger?.kill(...)`: تنهي هذه instance وتوقف تحديثاتها/اشتراكاتها وفق API. مدخلاتها: خيارات اختيارية حسب النوع. العائد/الأثر: الأثر تنظيف هذه الحركة/المراقبة، مش إلغاء كل JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 480:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `storyObserver?.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 481–488

```vue
    scrollTrigger = ScrollTrigger.create({
        trigger: storyElement.value,
        start: 'top top',
        end: 'bottom bottom',
        onRefresh: (self) => {
            gsap.killTweensOf(smoothState);
            smoothState.value = self.progress;
            smoothProgress.value = clamp(self.progress);
```

**السطر 481:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `ScrollTrigger.create(...)`: يبني مراقبة مدى scroll ويستدعي callbacks بتقدم0..1، بدون React/Vue router. القيم المكتوبة هنا: `{         trigger: storyElement.value,         start: 'top top',         end: 'bottom bottom',         onRefre…`. العائد/الأثر: ScrollTrigger instance له kill/refresh. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 482:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 483:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 484:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 485:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 486:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `gsap.killTweensOf(...)`: يوقف tweens المرتبطة بالtarget قبل reset/cleanup. القيم المكتوبة هنا: `smoothState`. العائد/الأثر: void. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 487:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 488:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `clamp(...)`: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. القيم المكتوبة هنا: `self.progress`. العائد/الأثر: number. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 489–496

```vue
        },
        onUpdate: (self) => {
            rawProgress.value = self.progress;
            gsap.to(smoothState, {
                value: self.progress,
                duration: STORY_CONFIG.smoothingSeconds,
                ease: 'power2.out',
                overwrite: true,
```

**السطر 489:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 490:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 491:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 492:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `gsap.to(...)`: ينشئ tween يغير target تدريجيًا نحو values؛ overwrite يمنع تعارض القديم. القيم المكتوبة هنا: `smoothState`، `{                 value: self.progress,                 duration: STORY_CONFIG.smoothingSeconds,              …`. العائد/الأثر: Tween. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 493:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 494:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 495:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 496:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 497–504

```vue
                onUpdate: () => { smoothProgress.value = clamp(smoothState.value); },
            });
        },
    });
    storyObserver = new IntersectionObserver(([entry]) => {
        storyActive.value = entry.isIntersecting;
    }, { threshold: 0.01 });
    storyObserver.observe(storyElement.value);
```

**السطر 497:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `clamp(...)`: يمنع رقم من الخروج عن الحدين، افتراضيًا 0..1. القيم المكتوبة هنا: `smoothState.value`. العائد/الأثر: number. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 498:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 499:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 500:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 501:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `IntersectionObserver(...)`: يراقب دخول عنصر ضمن viewport/root بشكل async؛ لا يحتاج listener scroll يدوي لكل عنصر. القيم المكتوبة هنا: `([entry]) => {         storyActive.value = entry.isIntersecting;     }`، `{ threshold: 0.01 }`. العائد/الأثر: observer instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 502:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 503:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 504:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `storyObserver.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `storyElement.value`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 505–512

```vue
}

function updateNavbar() {
    navbarScrolled.value = window.scrollY > 24;
}

function updateViewport() {
    mobileViewport.value = window.innerWidth < 768;
```

**السطر 505:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 507:** Function / تعريف دالة `updateNavbar`؛ تعريفها مش تشغيلها. يربط is-scrolled بتجاوز24px؛ class binding يغير المظهر. مدخلاتها: window.scrollY ناتجها: undefined؛ navbarScrolled Boolean

**السطر 508:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 509:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 511:** Function / تعريف دالة `updateViewport`؛ تعريفها مش تشغيلها. يحسم mobile layout عند أقل من768px. مدخلاتها: window.innerWidth ناتجها: undefined؛ mobileViewport Boolean

**السطر 512:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 513–520

```vue
}

function submitBooking() {
    errorMessage.value = '';
    successMessage.value = '';
    if (!form.name || !form.phone || !form.car || !form.service || !form.date || !form.time) {
        errorMessage.value = 'Please fill in all required fields before submitting.';
        return;
```

**السطر 513:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 515:** Function / تعريف دالة `submitBooking`؛ تعريفها مش تشغيلها. يمسح رسائل، يتحقق من الحقول والتاريخ، يضيف demo appointment، يعرض نجاحًا ويحذف بيانات النموذج من الذاكرة. مدخلاتها: لا parameters؛ form reactive ناتجها: undefined؛ لا Axios/fetch هنا

**السطر 516:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 517:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 518:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 519:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 520:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 521–528

```vue
    }
    if (form.date < today) {
        errorMessage.value = 'Choose today or a future date for your request.';
        return;
    }
    const appointment = addAppointment(form);
    successMessage.value = storage.available
        ? `Demo request ${appointment.id} saved. It is pending review; no real appointment has been made.`
```

**السطر 521:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 522:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 523:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 524:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 525:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 526:** Variable declaration / تعريف `appointment` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `addAppointment(...)`: يطابق العربية بالنص، يولّد رقم طلب، وينسخ حقول الحجز الآمنة فقط ثم يحفظ فورًا. القيم المكتوبة هنا: `form`. العائد/الأثر: entry: طلب demo status=requested؛ لا يتم حفظ الاسم والتليفون والملاحظات. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 527:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 528:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 529–536

```vue
        : 'Browser storage is unavailable. Your demo request cannot be kept after leaving this page.';
    Object.assign(form, { name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' });
}

onMounted(() => {
    try {
        const selected = JSON.parse(sessionStorage.getItem('autocare.booking.vehicle'));
        if (selected?.car) form.car = selected.car;
```

**السطر 529:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 530:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `form`، `{ name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' }`. العائد/الأثر: target بعد التعديل. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 531:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 533:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onMounted(...)`: يسجل callback للتنفيذ بعد تركيب component وتوفر refs الخاصة بالDOM. القيم المكتوبة هنا: `() => {     try {         const selected = JSON.parse(sessionStorage.getItem('autocare.booking.vehicle'));    …`. العائد/الأثر: void. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 534:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 535:** Variable declaration / تعريف `selected` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `sessionStorage.getItem('autocare.booking.vehicle')`. العائد/الأثر: JS value؛ `sessionStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `'autocare.booking.vehicle'`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 536:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 537–544

```vue
        sessionStorage.removeItem('autocare.booking.vehicle');
    } catch { /* The booking form works without browser storage. */ }
    updateViewport();
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
    window.addEventListener('resize', updateViewport, { passive: true });

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
```

**السطر 537:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `sessionStorage.removeItem(...)`: تمسح مفتاحًا محددًا فقط. القيم المكتوبة هنا: `'autocare.booking.vehicle'`. العائد/الأثر: undefined؛ ليست حذف قاعدة بيانات Laravel.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 538:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 539:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `updateViewport(...)`: يحسم mobile layout عند أقل من768px. مدخلاتها: window.innerWidth العائد/الأثر: undefined؛ mobileViewport Boolean. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 540:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `updateNavbar(...)`: يربط is-scrolled بتجاوز24px؛ class binding يغير المظهر. مدخلاتها: window.scrollY العائد/الأثر: undefined؛ navbarScrolled Boolean. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 541:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'scroll'`، `updateNavbar`، `{ passive: true }`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 542:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'resize'`، `updateViewport`، `{ passive: true }`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 544:** Variable declaration / تعريف `connection` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 545–552

```vue
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // A 3G estimate selects lighter frames, rather than permanently disabling motion.
    const reason = reducedMotion ? 'motion' : connection?.saveData ? 'data'
        : ['slow-2g', '2g'].includes(connection?.effectiveType) ? 'connection' : '';
    if (reason) {
        activateFallback(reason);
        return;
    }
```

**السطر 545:** Variable declaration / تعريف `reducedMotion` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `window.matchMedia(...)`: تجهّز اختبار media query. القيم المكتوبة هنا: `'(prefers-reduced-motion: reduce)'`. العائد/الأثر: MediaQueryList؛ matches خاصية Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 546:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 547:** Variable declaration / تعريف `reason` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 548:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `['slow-2g', '2g'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `connection?.effectiveType`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 549:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 550:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `activateFallback(...)`: يسجل السبب ويحوّل العرض إلى ثابت ويوقف ScrollTrigger/tweens ويجعل النصوص قابلة للقراءة. القيم المكتوبة هنا: `reason`. العائد/الأثر: undefined؛ fallback لا يحذف خدمات/فورم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 551:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 552:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 553–560

```vue
    setupScrollStory();
});

onBeforeUnmount(() => {
    scrollTrigger?.kill();
    storyObserver?.disconnect();
    gsap.killTweensOf(smoothState);
    window.removeEventListener('scroll', updateNavbar);
```

**السطر 553:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setupScrollStory(...)`: ينظف instances سابقة، يعمل ScrollTrigger لتقدم القصة وIntersectionObserver لتعطيل رسم الخلفية خارج المشهد. مدخلاتها: storyElement DOM وconfig العائد/الأثر: undefined؛ يحتفظ handles في scrollTrigger/storyObserver. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 554:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 556:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onBeforeUnmount(...)`: يسجل تنظيفًا قبل إزالة component، مثل kill/disconnect/removeListener. القيم المكتوبة هنا: `() => {     scrollTrigger?.kill();     storyObserver?.disconnect();     gsap.killTweensOf(smoothState);     wi…`. العائد/الأثر: void. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 557:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `scrollTrigger?.kill(...)`: تنهي هذه instance وتوقف تحديثاتها/اشتراكاتها وفق API. مدخلاتها: خيارات اختيارية حسب النوع. العائد/الأثر: الأثر تنظيف هذه الحركة/المراقبة، مش إلغاء كل JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 558:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `storyObserver?.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 559:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `gsap.killTweensOf(...)`: يوقف tweens المرتبطة بالtarget قبل reset/cleanup. القيم المكتوبة هنا: `smoothState`. العائد/الأثر: void. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 560:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `'scroll'`، `updateNavbar`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 561–564

```vue
    window.removeEventListener('resize', updateViewport);
});
</script>

```

**السطر 561:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `'resize'`، `updateViewport`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 562:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 563:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
