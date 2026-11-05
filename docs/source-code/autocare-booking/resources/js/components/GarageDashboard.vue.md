# لوحة الجراج: عربيات وحجوزات وتاريخ

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/components/GarageDashboard.vue` · 176 سطر.

**وظيفة الملف:** مكوّن واجهة للديمو مبني على useGarage. فيه forms وdialogs وفلاتر وعمليات حذف/إلغاء محلية؛ مفيش صلاحيات مستخدم ولا backend مصادقة.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/components/GarageDashboard.vue). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/components/AppIcon.vue](AppIcon.vue.md)

- [autocare-booking/resources/js/components/StatusBadge.vue](StatusBadge.vue.md)

- [autocare-booking/resources/js/composables/useGarage.js](../composables/useGarage.js.md)

- [autocare-booking/resources/js/components/App.vue](App.vue.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```vue
<template>
    <div class="garage-app">
        <aside class="garage-sidebar">
            <a href="/" class="brand"><span class="brand-icon">A</span><span><strong>AutoCare</strong><small>PRO GARAGE</small></span></a>
            <div class="sidebar-caption">YOUR OWN CORNER OF THE GARAGE</div>
            <nav aria-label="My Garage navigation">
                <button v-for="item in tabs" :key="item.id" :class="{ selected: tab === item.id }" :aria-current="tab === item.id ? 'page' : undefined" @click="selectTab(item.id)">
                    <AppIcon :name="item.icon" />{{ item.label }}<span v-if="item.id === 'vehicles'" class="nav-count">{{ state.vehicles.length }}</span>
                </button>
            </nav>
            <div class="sidebar-help"><AppIcon name="shield" /><strong>Care, with clarity.</strong><p>Your vehicles and service information, together in one place.</p><a href="/#contact">Garage information <AppIcon name="arrow" /></a></div>
            <a href="/" class="back-to-site"><span aria-hidden="true">←</span> Back to the website</a>
        </aside>
        <div class="garage-main">
            <header class="garage-topbar"><div><span class="breadcrumb">AutoCare Pro <span>/</span> My Garage</span></div><div class="garage-profile"><span class="demo-label">Demo workspace</span><span class="profile-avatar" aria-label="Demo customer">AC</span></div></header>
            <main id="garage-content" class="garage-content">
                <div class="garage-page-heading"><div><p class="editorial-kicker">A LITTLE CARE GOES A LONG WAY</p><h1>{{ activeTitle }}</h1><p>{{ activeSubtitle }}</p></div><a class="btn garage-primary" href="/#booking"><AppIcon name="plus" /> Book a service</a></div>
                <div class="demo-notice"><AppIcon name="shield" /><p><strong>You’re exploring the demo.</strong> Vehicles, appointments, and repair updates are examples. Changes stay in this browser; no real appointment is made.</p></div>
                <p v-if="!storage.available" class="alert alert-error" role="status">Browser storage is unavailable. Changes will last only for this session.</p>
                <p v-if="notice" class="dashboard-notice" role="status"><AppIcon name="check" />{{ notice }}</p>

                <template v-if="tab === 'overview'">
                    <div class="garage-stats">
                        <article><span class="stat-icon"><AppIcon name="car" /></span><div><span>Saved vehicles</span><strong>{{ state.vehicles.length.toString().padStart(2, '0') }}</strong></div></article>
                        <article><span class="stat-icon"><AppIcon name="calendar" /></span><div><span>Upcoming visits</span><strong>{{ upcoming.length.toString().padStart(2, '0') }}</strong></div></article>
                        <article><span class="stat-icon"><AppIcon name="wrench" /></span><div><span>Sample repair</span><strong class="stat-word">In progress</strong></div></article>
                    </div>
                    <div class="dashboard-two-col">
                        <section class="dashboard-card next-visit">
                            <div class="card-heading"><h2>Your next visit</h2><button class="text-link" @click="selectTab('appointments')">View all <AppIcon name="arrow" /></button></div>
                            <template v-if="nextVisit">
                                <div class="visit-date"><span>{{ datePart(nextVisit.date, 'day') }}</span><div>{{ datePart(nextVisit.date, 'month') }}<small>{{ nextVisit.time }} · Preferred time</small></div><StatusBadge :label="statusInfo(nextVisit.status).label" :tone="statusInfo(nextVisit.status).tone" :icon="statusInfo(nextVisit.status).icon" /></div>
                                <h3>{{ nextVisit.service }}</h3><p class="muted">{{ nextVisit.car }}</p>
                                <div class="visit-footer"><span><AppIcon name="pin" />New Cairo · Demo location</span><button class="text-link" @click="openReschedule(nextVisit)">Reschedule</button></div>
                            </template>
                            <div v-else class="empty-state"><AppIcon name="calendar" /><h3>Room for your next visit.</h3><p>Request a service whenever you’re ready.</p><a href="/#booking" class="text-link">Book a service <AppIcon name="arrow" /></a></div>
                        </section>
                        <section class="dashboard-card vehicle-feature">
                            <div class="card-heading"><h2>In your garage</h2><button class="text-link" @click="selectTab('vehicles')">Manage <AppIcon name="arrow" /></button></div>
                            <template v-if="state.vehicles.length">
                                <div class="vehicle-art"><AppIcon name="car" /><span>{{ state.vehicles[0].make }}</span></div>
                                <div class="vehicle-feature-info"><div><h3>{{ state.vehicles[0].make }} {{ state.vehicles[0].model }}</h3><p>{{ state.vehicles[0].year }} · {{ state.vehicles[0].plate }}</p></div><span>{{ Number(state.vehicles[0].mileage).toLocaleString() }}<small>km recorded</small></span></div>
                            </template>
                            <div v-else class="empty-state"><p>Add a vehicle to make your next booking easier.</p><button class="text-link" @click="showVehicleForm = true">Add your first vehicle</button></div>
                        </section>
                    </div>
                    <section class="dashboard-card repair-card">
                        <div class="card-heading"><div><p class="card-kicker">{{ state.repair.id }} · SAMPLE WORK ORDER</p><h2>A clear view of the work.</h2></div><StatusBadge label="In progress" tone="amber" icon="wrench" /></div>
                        <div class="repair-summary"><span class="repair-icon"><AppIcon name="wrench" /></span><div><h3>{{ state.repair.service }}</h3><p>{{ state.repair.car }}</p></div><span class="sample-update">Illustrative progress</span></div>
                        <ol class="repair-timeline">
                            <li v-for="(stage, index) in repairStages" :key="stage" :class="{ done: index < state.repair.stage, current: index === state.repair.stage }" :aria-current="index === state.repair.stage ? 'step' : undefined"><span><AppIcon :name="index < state.repair.stage ? 'check' : index === state.repair.stage ? 'wrench' : 'clock'" /></span><strong>{{ stage }}</strong><small>{{ index < state.repair.stage ? 'Complete' : index === state.repair.stage ? 'In progress' : 'Upcoming' }}</small></li>
                        </ol>
                        <p class="repair-note"><AppIcon name="clock" />{{ state.repair.note }}</p>
                    </section>
                    <section class="dashboard-card">
                        <div class="card-heading"><h2>Recent service history</h2><button class="text-link" @click="selectTab('history')">View history <AppIcon name="arrow" /></button></div>
                        <div class="history-list"><button v-for="record in state.history.slice(0, 2)" :key="record.id" class="history-row" @click="selectedRecord = record"><span class="history-icon"><AppIcon name="check" /></span><span><strong>{{ record.service }}</strong><small>{{ record.car }}</small></span><span>{{ formatDate(record.date) }}</span><AppIcon name="chevron" /></button></div>
                    </section>
                </template>

                <template v-if="tab === 'vehicles'">
                    <div class="section-toolbar"><p>{{ state.vehicles.length }} saved vehicles</p><button class="btn garage-primary" @click="showVehicleForm = true"><AppIcon name="plus" /> Add vehicle</button></div>
                    <div class="vehicle-grid">
                        <article v-for="vehicle in state.vehicles" :key="vehicle.id" class="dashboard-card saved-vehicle">
                            <div class="vehicle-art"><AppIcon name="car" /><span>{{ vehicle.make }}</span></div>
                            <h2>{{ vehicle.make }} {{ vehicle.model }}</h2><p>{{ vehicle.year }} · {{ vehicle.plate }}</p>
                            <dl><div><dt>Recorded mileage</dt><dd>{{ Number(vehicle.mileage).toLocaleString() }} km</dd></div><div><dt>Service records</dt><dd>{{ state.history.filter(h => h.vehicleId === vehicle.id).length }}</dd></div></dl>
                            <div class="vehicle-actions"><button class="text-link" @click="bookVehicle(vehicle)">Book service <AppIcon name="arrow" /></button><button class="subtle-button" @click="removeTarget = vehicle">Remove</button></div>
                        </article>
                        <button class="add-vehicle-tile" @click="showVehicleForm = true"><AppIcon name="plus" /><strong>A space for your next car.</strong><span>Add another vehicle</span></button>
                    </div>
                </template>

                <template v-if="tab === 'appointments'">
                    <div class="section-toolbar"><p>Keep your next visit in view.</p><label class="filter-label">Show <select v-model="appointmentFilter"><option value="active">Upcoming</option><option value="all">All appointments</option></select></label></div>
                    <div class="appointments-list">
                        <article v-for="appointment in filteredAppointments" :key="appointment.id" class="dashboard-card appointment-card">
                            <div class="appointment-date-block"><strong>{{ datePart(appointment.date, 'day') }}</strong><span>{{ datePart(appointment.date, 'month') }}</span></div>
                            <div class="appointment-copy"><span class="card-kicker">{{ appointment.id }}</span><h2>{{ appointment.service }}</h2><p>{{ appointment.car }}</p><small>{{ formatDate(appointment.date) }} at {{ appointment.time }} · Demo location</small></div>
                            <div class="appointment-actions"><StatusBadge :label="statusInfo(appointment.status).label" :tone="statusInfo(appointment.status).tone" :icon="statusInfo(appointment.status).icon" /><template v-if="appointment.status !== 'cancelled'"><button class="text-link" @click="openReschedule(appointment)">Reschedule</button><button class="subtle-button" @click="cancelTarget = appointment">Cancel request</button></template><button v-else class="text-link" @click="appointment.status = 'requested'; notice = 'Demo request restored.'">Restore request</button></div>
                        </article>
                        <div v-if="!filteredAppointments.length" class="dashboard-card empty-state"><AppIcon name="calendar" /><h2>No upcoming appointments.</h2><p>When you request a service, it will appear here.</p><a href="/#booking" class="btn garage-primary">Find a service</a></div>
                    </div>
                </template>

                <template v-if="tab === 'history'">
                    <div class="section-toolbar"><p>Your car’s story, well documented.</p><label class="filter-label">Vehicle <select v-model="historyFilter"><option value="all">All vehicles</option><option v-for="vehicle in state.vehicles" :key="vehicle.id" :value="vehicle.id">{{ vehicle.make }} {{ vehicle.model }}</option></select></label></div>
                    <section class="dashboard-card"><div class="history-list"><button v-for="record in filteredHistory" :key="record.id" class="history-row" @click="selectedRecord = record"><span class="history-icon"><AppIcon name="check" /></span><span><strong>{{ record.service }}</strong><small>{{ record.car }} · {{ record.id }}</small></span><span>{{ formatDate(record.date) }}<small>{{ record.total }} EGP</small></span><AppIcon name="chevron" /></button><div v-if="!filteredHistory.length" class="empty-state"><h3>A fresh service history.</h3><p>No sample service records for this vehicle.</p></div></div></section>
                </template>
                <footer class="garage-bottom"><span>AutoCare Pro · Built around your peace of mind.</span><a href="/#faqs">Need a hand?</a></footer>
            </main>
        </div>

        <dialog ref="vehicleDialog" @close="showVehicleForm = false" @click="closeOnBackdrop($event, 'vehicle')">
            <form class="garage-dialog-form" @submit.prevent="saveVehicle">
                <div class="dialog-heading"><div><p class="editorial-kicker">MY VEHICLES</p><h2>Make room in your garage.</h2></div><button type="button" class="icon-button" aria-label="Close add vehicle" @click="showVehicleForm = false"><AppIcon name="close" /></button></div>
                <p class="muted">Save example vehicle details for quicker demo bookings.</p>
                <div class="dialog-fields"><label>Make<input v-model.trim="vehicleForm.make" required maxlength="40" placeholder="Toyota"></label><label>Model<input v-model.trim="vehicleForm.model" required maxlength="60" placeholder="Corolla"></label><label>Year<input v-model="vehicleForm.year" type="number" min="1950" :max="new Date().getFullYear() + 1" required></label><label>Registration<input v-model.trim="vehicleForm.plate" required maxlength="24" placeholder="DEMO 303"></label><label class="full-field">Recorded mileage (km)<input v-model="vehicleForm.mileage" type="number" min="0" max="2000000" required></label></div>
                <p v-if="vehicleError" role="alert" class="alert alert-error">{{ vehicleError }}</p>
                <button class="btn garage-primary" type="submit">Save vehicle <AppIcon name="check" /></button>
            </form>
        </dialog>

        <dialog ref="rescheduleDialog" @close="rescheduleTarget = null" @click="closeOnBackdrop($event, 'reschedule')">
            <form class="garage-dialog-form" @submit.prevent="saveReschedule">
                <div class="dialog-heading"><h2>A better time for your visit.</h2><button type="button" class="icon-button" aria-label="Close reschedule" @click="rescheduleTarget = null"><AppIcon name="close" /></button></div>
                <p class="muted">Changes remain a demo request until a real workshop confirms availability.</p>
                <div class="dialog-fields"><label>Preferred date<input v-model="rescheduleForm.date" type="date" :min="today" required></label><label>Preferred time<input v-model="rescheduleForm.time" type="time" required></label></div>
                <p v-if="rescheduleError" role="alert" class="alert alert-error">{{ rescheduleError }}</p>
                <button type="submit" class="btn garage-primary">Save requested time</button>
            </form>
        </dialog>

        <dialog ref="recordDialog" @close="selectedRecord = null" @click="closeOnBackdrop($event, 'record')">
            <div v-if="selectedRecord" class="garage-dialog-form">
                <div class="dialog-heading"><div><p class="editorial-kicker">{{ selectedRecord.id }} · DEMO RECORD</p><h2>{{ selectedRecord.service }}</h2></div><button class="icon-button" aria-label="Close service record" @click="selectedRecord = null"><AppIcon name="close" /></button></div>
                <StatusBadge label="Completed" tone="green" icon="check" /><h3 class="record-car">{{ selectedRecord.car }}</h3><p class="muted">{{ formatDate(selectedRecord.date) }}</p><p class="record-notes">{{ selectedRecord.notes }}</p><div class="record-total"><span>Example total</span><strong>{{ selectedRecord.total }} EGP</strong></div>
            </div>
        </dialog>
        <dialog ref="confirmDialog" @close="cancelTarget = null; removeTarget = null">
            <div class="garage-dialog-form">
                <div class="dialog-heading"><h2>{{ removeTarget ? 'Remove this saved vehicle?' : 'Cancel this demo request?' }}</h2><button class="icon-button" aria-label="Close confirmation" @click="cancelTarget = null; removeTarget = null"><AppIcon name="close" /></button></div>
                <p class="muted">{{ removeTarget ? 'Existing appointments and service records will be kept. You can add the vehicle again later.' : 'No real workshop will be contacted. You can restore this request from All appointments.' }}</p>
                <div class="confirm-actions"><button class="btn garage-primary" @click="confirmAction">{{ removeTarget ? 'Remove vehicle' : 'Cancel request' }}</button><button class="text-link" @click="cancelTarget = null; removeTarget = null">Keep it</button></div>
            </div>
        </dialog>
    </div>
</template>
<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import StatusBadge from './StatusBadge.vue';
import { useGarage, formatDate } from '../composables/useGarage';
const { state, storage, addVehicle } = useGarage();
const tabs = [{id:'overview',label:'Overview',icon:'grid'},{id:'vehicles',label:'My vehicles',icon:'car'},{id:'appointments',label:'Appointments',icon:'calendar'},{id:'history',label:'Service history',icon:'history'}];
const tab = ref(['overview','vehicles','appointments','history'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview');
const titles = { overview: ['Welcome to your garage.', 'Your cars. Your plans. Everything in good hands.'], vehicles: ['A place for every vehicle.', 'Keep the details handy, and your next booking simple.'], appointments: ['Your next visit, sorted.', 'Plan ahead and manage your demo requests.'], history: ['Every service has a story.', 'A clear record of the care your vehicles receive.'] };
const activeTitle = computed(() => titles[tab.value][0]);
const activeSubtitle = computed(() => titles[tab.value][1]);
const today = new Date().toLocaleDateString('en-CA');
const upcoming = computed(() => state.appointments.filter(a => a.status !== 'cancelled' && a.date >= today).sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time)));
const nextVisit = computed(() => upcoming.value[0]);
const appointmentFilter = ref('active');
const historyFilter = ref('all');
const filteredAppointments = computed(() => appointmentFilter.value === 'active' ? upcoming.value : [...state.appointments].sort((a,b) => b.date.localeCompare(a.date)));
const filteredHistory = computed(() => [...state.history].filter(h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value).sort((a,b) => b.date.localeCompare(a.date)));
const notice = ref('');
const repairStages = ['Checked in', 'Inspection', 'Service underway', 'Ready to collect'];
const statusInfo = status => ({ confirmed: {label:'Confirmed · demo',tone:'green',icon:'check'}, requested:{label:'Requested',tone:'amber',icon:'clock'}, cancelled:{label:'Cancelled',tone:'neutral',icon:'close'} }[status] || {label:'Pending review',tone:'neutral',icon:'clock'});
const datePart = (date, type) => new Date(date + 'T12:00:00').toLocaleDateString('en-GB', type === 'day' ? {day:'2-digit'} : {month:'short',year:'numeric'});
function selectTab(value) { tab.value = value; history.replaceState(null, '', '#' + value); notice.value = ''; window.scrollTo({top:0,behavior:'instant'}); }
const showVehicleForm = ref(false), vehicleDialog = ref(null), vehicleError = ref('');
const vehicleForm = reactive({make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0});
const rescheduleTarget = ref(null), rescheduleDialog = ref(null), rescheduleError = ref('');
const rescheduleForm = reactive({date:'',time:''});
const selectedRecord = ref(null), recordDialog = ref(null);
const cancelTarget = ref(null), removeTarget = ref(null), confirmDialog = ref(null);
function syncDialog(dialog, open) { if (!dialog) return; if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }
watch(showVehicleForm, async value => { await nextTick(); syncDialog(vehicleDialog.value, value); });
watch(rescheduleTarget, async value => { await nextTick(); syncDialog(rescheduleDialog.value, !!value); });
watch(selectedRecord, async value => { await nextTick(); syncDialog(recordDialog.value, !!value); });
watch([cancelTarget,removeTarget], async ([a,b]) => { await nextTick(); syncDialog(confirmDialog.value, !!a || !!b); });
function closeOnBackdrop(event, kind) { if (event.target !== event.currentTarget) return; const rect=event.currentTarget.getBoundingClientRect(); if (event.clientX>=rect.left && event.clientX<=rect.right && event.clientY>=rect.top && event.clientY<=rect.bottom) return; if(kind==='vehicle') showVehicleForm.value=false; if(kind==='record') selectedRecord.value=null; if(kind==='reschedule') rescheduleTarget.value=null; }
function saveVehicle() {
    vehicleError.value='';
    if (!vehicleForm.make.trim() || !vehicleForm.model.trim() || !vehicleForm.plate.trim()) { vehicleError.value='Please complete the vehicle details.'; return; }
    if (state.vehicles.some(v=>v.plate.toLowerCase()===vehicleForm.plate.toLowerCase())) { vehicleError.value='That registration is already saved.'; return; }
    addVehicle({...vehicleForm}); showVehicleForm.value=false; notice.value='Vehicle saved in this demo workspace.';
    Object.assign(vehicleForm,{make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0});
}
function openReschedule(appointment) { rescheduleError.value=''; Object.assign(rescheduleForm,{date:appointment.date,time:appointment.time}); rescheduleTarget.value=appointment; }
function saveReschedule() { if(rescheduleForm.date<today || !rescheduleForm.time){rescheduleError.value='Choose today or a future date and a preferred time.';return;} Object.assign(rescheduleTarget.value,rescheduleForm,{status:'requested'});rescheduleTarget.value=null;notice.value='Demo request updated. The new time is pending review.'; }
function confirmAction() { if(removeTarget.value){state.vehicles.splice(state.vehicles.findIndex(v=>v.id===removeTarget.value.id),1);removeTarget.value=null;notice.value='Saved vehicle removed.';} else if(cancelTarget.value){cancelTarget.value.status='cancelled';cancelTarget.value=null;notice.value='Demo request cancelled.';} }
function bookVehicle(vehicle) { try{sessionStorage.setItem('autocare.booking.vehicle',JSON.stringify({car:`${vehicle.year} ${vehicle.make} ${vehicle.model}`}));}catch{} location.href='/#booking'; }
</script>
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### tabs

بيانات sidebar؛ id للشرط وlabel للعرض وicon لAppIcon.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** array

### tab

حالة التبويب الأولي من hash لو مسموح، وإلا overview. لا يوجد hashchange listener هنا.

- **بتاخد إيه؟ Inputs:** location.hash.slice(1)

- **بترجع/بتغيّر إيه؟ Return / effect:** ref string

### activeTitle

عنوان الصفحة مشتق من tab.

- **بتاخد إيه؟ Inputs:** titles[tab.value][0]

- **بترجع/بتغيّر إيه؟ Return / effect:** computed string

### activeSubtitle

وصف الصفحة مشتق من tab.

- **بتاخد إيه؟ Inputs:** titles[tab.value][1]

- **بترجع/بتغيّر إيه؟ Return / effect:** computed string

### upcoming

يستبعد cancelled والماضي ثم يرتب تصاعديًا حسب التاريخ والوقت.

- **بتاخد إيه؟ Inputs:** state.appointments وtoday

- **بترجع/بتغيّر إيه؟ Return / effect:** computed array جديدة من filter

### nextVisit

أول حجز من upcoming المرتبة.

- **بتاخد إيه؟ Inputs:** upcoming.value[0]

- **بترجع/بتغيّر إيه؟ Return / effect:** appointment أو undefined

### filteredAppointments

لو active يرجع upcoming، وإلا نسخة مرتبة من كل الحجوزات، لا يغيّر ترتيب الأصل.

- **بتاخد إيه؟ Inputs:** appointmentFilter,state.appointments

- **بترجع/بتغيّر إيه؟ Return / effect:** computed array

### filteredHistory

ينسخ السجل، يفلتر بالعربية لو محددة، ثم يرتب بالأحدث.

- **بتاخد إيه؟ Inputs:** historyFilter,state.history

- **بترجع/بتغيّر إيه؟ Return / effect:** computed array

### statusInfo

قاموس status→label/tone/icon مع default؛ مفيش check server.

- **بتاخد إيه؟ Inputs:** status string

- **بترجع/بتغيّر إيه؟ Return / effect:** object شارة

### datePart

يعرض اليوم أو الشهر والسنة من تاريخ واحد.

- **بتاخد إيه؟ Inputs:** date نص وtype إما day أو غيره

- **بترجع/بتغيّر إيه؟ Return / effect:** string

### selectTab

يغيّر tab ويكتب hash بلا تحميل صفحة، يمسح notice ويطلع فوق.

- **بتاخد إيه؟ Inputs:** value: tab id

- **بترجع/بتغيّر إيه؟ Return / effect:** لا return صريح؛ side effects في state/history/scroll

### syncDialog

يوائم Boolean state مع native HTML dialog، ويمنع showModal على dialog مفتوحة.

- **بتاخد إيه؟ Inputs:** dialog DOM element وopen Boolean

- **بترجع/بتغيّر إيه؟ Return / effect:** لا return مفيد؛ showModal/close side effects

### closeOnBackdrop

يتأكد أن النقرة على dialog نفسها وخارج مستطيل المحتوى قبل تصفير state المناسبة.

- **بتاخد إيه؟ Inputs:** event,kind:vehicle|record|reschedule

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined، وقد يغير state

### saveVehicle

يفحص الحقول والسجل المكرر، ينادي composable، يقفل dialog ويعمل reset للنموذج.

- **بتاخد إيه؟ Inputs:** لا parameters؛ يقرأ vehicleForm/state

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ addVehicle يرجع entry لكن المكوّن لا يحتاجه

### openReschedule

يملأ نموذج تغيير الموعد من الحجز ويحدد target، فيفتح dialog عن طريق watch.

- **بتاخد إيه؟ Inputs:** appointment object من v-for

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ يغير reactive form/ref

### saveReschedule

يرفض تاريخًا سابقًا أو وقتًا فاضيًا؛ يعدّل نفس object الحجز ويضع status=requested.

- **بتاخد إيه؟ Inputs:** يقرأ rescheduleForm وrescheduleTarget

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ الحفظ التلقائي في composable watcher

### confirmAction

لو فيه removeTarget يحذف العربية بfindIndex/splice، وإلا يلغي الحجز بتغيير status فقط.

- **بتاخد إيه؟ Inputs:** state الحالية للأهداف

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ لا يمسح حجوزات/تاريخ العربية عند إزالة العربية

### bookVehicle

يخزن نص العربية مؤقتًا في sessionStorage ثم ينتقل للصفحة العامة عند #booking.

- **بتاخد إيه؟ Inputs:** vehicle object

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ يؤدي لتحميل document جديد

### watch(showVehicleForm)

ينتظر تحديث Vue ثم يفتح/يقفل dialog حسب Boolean.

- **بتاخد إيه؟ Inputs:** showVehicleForm ref

- **بترجع/بتغيّر إيه؟ Return / effect:** watch stop handle غير مخزن؛ component-bound watcher

### watch(rescheduleTarget)

تحويل target إلى Boolean ب!! والتحكم في dialog تغيير الموعد.

- **بتاخد إيه؟ Inputs:** rescheduleTarget

- **بترجع/بتغيّر إيه؟ Return / effect:** watch stop handle غير مخزن

### watch(selectedRecord)

يفتح تفاصيل سجل لما record تختار وتقفله لما null.

- **بتاخد إيه؟ Inputs:** selectedRecord

- **بترجع/بتغيّر إيه؟ Return / effect:** watch stop handle غير مخزن

### watch([cancelTarget,removeTarget])

dialog تأكيد واحد يتفتح لو أي target موجودة؛ array destructuring تفصل القيم.

- **بتاخد إيه؟ Inputs:** array of refs

- **بترجع/بتغيّر إيه؟ Return / effect:** watch stop handle غير مخزن

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useGarage

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يرجع الحالة وعمليات الإضافة؛ مش بيبدأ نسخة state منفصلة لكل component.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** { state, storage, addVehicle, addAppointment }

- **أول موضع هنا:** السطر 134.

- **تكملة التعريف:** [resources/js/composables/useGarage.js](../composables/useGarage.js.md)، عند السطر 29.

### ref

- **جاية منين؟** Vue

- **وظيفتها:** يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** Ref object

- **أول موضع هنا:** السطر 157، والمدخلات المكتوبة: `null`.

- **مثال:** const menuOpen = ref(false); menuOpen.value = true;

### ['overview','vehicles','appointments','history'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 136، والمدخلات المكتوبة: `location.hash.slice(1)`.

### location.hash.slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 136، والمدخلات المكتوبة: `1`.

### computed

- **جاية منين؟** Vue

- **وظيفتها:** قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي.

- **المدخلات — Arguments:** getter function

- **الناتج/الأثر — Return / effect:** ComputedRef

- **أول موضع هنا:** السطر 146، والمدخلات المكتوبة: `() => [...state.history].filter(h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value).sort((a,b) => b.date.localeCompare(a.date))`.

- **مثال:** const nextVisit = computed(() => upcoming.value[0]);

### new Date().toLocaleDateString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ للعرض حسب locale/options.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string، وليس قيمة مناسبة بالضرورة للتخزين.

- **أول موضع هنا:** السطر 140، والمدخلات المكتوبة: `'en-CA'`.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 169.

### state.appointments.filter(a => a.status !== 'cancelled' && a.date >= today).sort

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** ترتّب القائمة باستخدام المقارنة.

- **المدخلات — Arguments:** compare callback اختيارية.

- **الناتج/الأثر — Return / effect:** نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.

- **أول موضع هنا:** السطر 141، والمدخلات المكتوبة: `(a,b) => (a.date + a.time).localeCompare(b.date + b.time)`.

### state.appointments.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 141، والمدخلات المكتوبة: `a => a.status !== 'cancelled' && a.date >= today`.

### (a.date + a.time).localeCompare

- **جاية منين؟** JavaScript String

- **وظيفتها:** يرجع ترتيب مقارنة string لا Boolean؛ يستخدمه sort، وتواريخ YYYY-MM-DD قابلة للترتيب النصي.

- **المدخلات — Arguments:** otherString

- **الناتج/الأثر — Return / effect:** رقم سالب/صفر/موجب

- **أول موضع هنا:** السطر 141، والمدخلات المكتوبة: `b.date + b.time`.

- **مثال:** b.date.localeCompare(a.date);

### [...state.appointments].sort

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** ترتّب القائمة باستخدام المقارنة.

- **المدخلات — Arguments:** compare callback اختيارية.

- **الناتج/الأثر — Return / effect:** نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.

- **أول موضع هنا:** السطر 145، والمدخلات المكتوبة: `(a,b) => b.date.localeCompare(a.date)`.

### b.date.localeCompare

- **جاية منين؟** JavaScript String

- **وظيفتها:** يرجع ترتيب مقارنة string لا Boolean؛ يستخدمه sort، وتواريخ YYYY-MM-DD قابلة للترتيب النصي.

- **المدخلات — Arguments:** otherString

- **الناتج/الأثر — Return / effect:** رقم سالب/صفر/موجب

- **أول موضع هنا:** السطر 146، والمدخلات المكتوبة: `a.date`.

- **مثال:** b.date.localeCompare(a.date);

### [...state.history].filter(h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value).sort

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** ترتّب القائمة باستخدام المقارنة.

- **المدخلات — Arguments:** compare callback اختيارية.

- **الناتج/الأثر — Return / effect:** نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.

- **أول موضع هنا:** السطر 146، والمدخلات المكتوبة: `(a,b) => b.date.localeCompare(a.date)`.

### [...state.history].filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 146، والمدخلات المكتوبة: `h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value`.

### new Date(date + 'T12:00:00').toLocaleDateString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ للعرض حسب locale/options.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string، وليس قيمة مناسبة بالضرورة للتخزين.

- **أول موضع هنا:** السطر 150، والمدخلات المكتوبة: `'en-GB'`، `type === 'day' ? {day:'2-digit'} : {month:'short',year:'numeric'}`.

### history.replaceState

- **جاية منين؟** Browser History

- **وظيفتها:** يعدل URL/history entry الحالية بلا reload ولا request جديد.

- **المدخلات — Arguments:** state,unused,url

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 151، والمدخلات المكتوبة: `null`، `''`، `'#' + value`.

- **مثال:** history.replaceState(null, '', '#' + value);

### window.scrollTo

- **جاية منين؟** Browser Window/Element

- **وظيفتها:** تحرّك موضع التمرير.

- **المدخلات — Arguments:** coordinates أو options.

- **الناتج/الأثر — Return / effect:** undefined؛ الحركة الناعمة ليست Promise تنتظرها.

- **أول موضع هنا:** السطر 151، والمدخلات المكتوبة: `{top:0,behavior:'instant'}`.

### reactive

- **جاية منين؟** Vue

- **وظيفتها:** يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value.

- **المدخلات — Arguments:** object

- **الناتج/الأثر — Return / effect:** reactive Proxy

- **أول موضع هنا:** السطر 155، والمدخلات المكتوبة: `{date:'',time:''}`.

- **مثال:** const form = reactive({ car: '' }); form.car = 'Toyota';

### new Date().getFullYear

- **جاية منين؟** Date instance

- **وظيفتها:** تقرأ السنة المحلية كاملة.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** number مثل2026.

- **أول موضع هنا:** السطر 169.

### dialog.showModal

- **جاية منين؟** Browser HTMLDialogElement

- **وظيفتها:** يفتح dialog في top layer كmodal، مع إدارة focus وbackdrop أصلية.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** undefined؛ قد يرمي لو الحالة غير مناسبة

- **أول موضع هنا:** السطر 158.

- **مثال:** if (open && !dialog.open) dialog.showModal();

### dialog.close

- **جاية منين؟** يعتمد على المستقبِل

- **وظيفتها:** ImageBitmap.close تحرر bitmap؛ dialog.close تغلق حوارًا.

- **المدخلات — Arguments:** حسب المستقبِل؛ الاستخدام المعتاد بدون.

- **الناتج/الأثر — Return / effect:** void في هذين الاستخدامين؛ مش حذف الأصل.

- **أول موضع هنا:** السطر 158.

### watch

- **جاية منين؟** Vue

- **وظيفتها:** يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog.

- **المدخلات — Arguments:** source, callback, options مثل deep

- **الناتج/الأثر — Return / effect:** watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه

- **أول موضع هنا:** السطر 162، والمدخلات المكتوبة: `[cancelTarget,removeTarget]`، `async ([a,b]) => { await nextTick(); syncDialog(confirmDialog.value, !!a || !!b); }`.

- **مثال:** watch(state, () => garageRepository.write(state), { deep: true });

### nextTick

- **جاية منين؟** Vue

- **وظيفتها:** ينتظر انتهاء دفعة تحديث DOM الحالية بعد تغيير state، مش انتظار network ولا تأخير ثابت.

- **المدخلات — Arguments:** callback اختياري

- **الناتج/الأثر — Return / effect:** Promise<void>

- **أول موضع هنا:** السطر 162.

- **مثال:** await nextTick(); syncDialog(vehicleDialog.value, true);

### syncDialog

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يوائم Boolean state مع native HTML dialog، ويمنع showModal على dialog مفتوحة.

- **المدخلات — Arguments:** dialog DOM element وopen Boolean

- **الناتج/الأثر — Return / effect:** لا return مفيد؛ showModal/close side effects

- **أول موضع هنا:** السطر 162، والمدخلات المكتوبة: `confirmDialog.value`، `!!a || !!b`.

### event.currentTarget.getBoundingClientRect

- **جاية منين؟** DOM Element

- **وظيفتها:** تقيس موضع وأبعاد العنصر بالنسبة للـviewport.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** DOMRect؛ القيم تتأثر بالـscroll والتحويلات.

- **أول موضع هنا:** السطر 163.

### vehicleForm.make.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 166.

### vehicleForm.model.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 166.

### vehicleForm.plate.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 166.

### state.vehicles.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 167، والمدخلات المكتوبة: `v=>v.plate.toLowerCase()===vehicleForm.plate.toLowerCase()`.

### v.plate.toLowerCase

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تحوّل الحروف لحالتها الصغيرة.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 167.

### vehicleForm.plate.toLowerCase

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تحوّل الحروف لحالتها الصغيرة.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 167.

### addVehicle

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** ينسخ form ويضيف UUID ويحوّل السنة والعداد لأرقام، ثم push في قائمة العربيات.

- **المدخلات — Arguments:** vehicle: object من نموذج Dashboard

- **الناتج/الأثر — Return / effect:** entry: العربية الجديدة؛ الحفظ يتم من deep watcher

- **أول موضع هنا:** السطر 168، والمدخلات المكتوبة: `{...vehicleForm}`.

- **تكملة التعريف:** [resources/js/composables/useGarage.js](../composables/useGarage.js.md)، عند السطر 30.

### Object.assign

- **جاية منين؟** JavaScript

- **وظيفتها:** ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله.

- **المدخلات — Arguments:** target,...sources

- **الناتج/الأثر — Return / effect:** target بعد التعديل

- **أول موضع هنا:** السطر 172، والمدخلات المكتوبة: `rescheduleTarget.value`، `rescheduleForm`، `{status:'requested'}`.

- **مثال:** Object.assign(rescheduleTarget.value, rescheduleForm, {status:'requested'});

### state.vehicles.splice

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحذف/تضيف في مكان محدد من الأصل.

- **المدخلات — Arguments:** start وdeleteCount والعناصر الجديدة.

- **الناتج/الأثر — Return / effect:** array بالعناصر المحذوفة؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 173، والمدخلات المكتوبة: `state.vehicles.findIndex(v=>v.id===removeTarget.value.id)`، `1`.

### state.vehicles.findIndex

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث عن موضع أول عنصر مطابق.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** index أو -1 لو مفيش تطابق.

- **أول موضع هنا:** السطر 173، والمدخلات المكتوبة: `v=>v.id===removeTarget.value.id`.

### sessionStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 174، والمدخلات المكتوبة: `'autocare.booking.vehicle'`، `JSON.stringify({car:'${vehicle.year} ${vehicle.make} ${vehicle.model}'})`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 174، والمدخلات المكتوبة: `{car:'${vehicle.year} ${vehicle.make} ${vehicle.model}'}`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```vue
<template>
    <div class="garage-app">
        <aside class="garage-sidebar">
            <a href="/" class="brand"><span class="brand-icon">A</span><span><strong>AutoCare</strong><small>PRO GARAGE</small></span></a>
            <div class="sidebar-caption">YOUR OWN CORNER OF THE GARAGE</div>
            <nav aria-label="My Garage navigation">
                <button v-for="item in tabs" :key="item.id" :class="{ selected: tab === item.id }" :aria-current="tab === item.id ? 'page' : undefined" @click="selectTab(item.id)">
                    <AppIcon :name="item.icon" />{{ item.label }}<span v-if="item.id === 'vehicles'" class="nav-count">{{ state.vehicles.length }}</span>
```

**السطر 1:** بداية Vue template / شكل الواجهة؛ تعبيراته تقرأ الحالة والدوال من script المكوّن.

**السطر 2:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 3:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 4:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 5:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 6:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 7:** v-for: لف على `tabs`، وفي كل دورة اسم العنصر الحالي `item`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 8:** `v-if` تعتمد على `item.id === 'vehicles'` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

### السطور 9–16

```vue
                </button>
            </nav>
            <div class="sidebar-help"><AppIcon name="shield" /><strong>Care, with clarity.</strong><p>Your vehicles and service information, together in one place.</p><a href="/#contact">Garage information <AppIcon name="arrow" /></a></div>
            <a href="/" class="back-to-site"><span aria-hidden="true">←</span> Back to the website</a>
        </aside>
        <div class="garage-main">
            <header class="garage-topbar"><div><span class="breadcrumb">AutoCare Pro <span>/</span> My Garage</span></div><div class="garage-profile"><span class="demo-label">Demo workspace</span><span class="profile-avatar" aria-label="Demo customer">AC</span></div></header>
            <main id="garage-content" class="garage-content">
```

**السطر 9:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 10:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 11:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 12:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 13:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 14:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 15:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 16:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 17–24

```vue
                <div class="garage-page-heading"><div><p class="editorial-kicker">A LITTLE CARE GOES A LONG WAY</p><h1>{{ activeTitle }}</h1><p>{{ activeSubtitle }}</p></div><a class="btn garage-primary" href="/#booking"><AppIcon name="plus" /> Book a service</a></div>
                <div class="demo-notice"><AppIcon name="shield" /><p><strong>You’re exploring the demo.</strong> Vehicles, appointments, and repair updates are examples. Changes stay in this browser; no real appointment is made.</p></div>
                <p v-if="!storage.available" class="alert alert-error" role="status">Browser storage is unavailable. Changes will last only for this session.</p>
                <p v-if="notice" class="dashboard-notice" role="status"><AppIcon name="check" />{{ notice }}</p>

                <template v-if="tab === 'overview'">
                    <div class="garage-stats">
                        <article><span class="stat-icon"><AppIcon name="car" /></span><div><span>Saved vehicles</span><strong>{{ state.vehicles.length.toString().padStart(2, '0') }}</strong></div></article>
```

**السطر 17:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 18:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 19:** `v-if` تعتمد على `!storage.available` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 20:** `v-if` تعتمد على `notice` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 22:** `v-if` تعتمد على `tab === 'overview'` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 23:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 24:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 25–32

```vue
                        <article><span class="stat-icon"><AppIcon name="calendar" /></span><div><span>Upcoming visits</span><strong>{{ upcoming.length.toString().padStart(2, '0') }}</strong></div></article>
                        <article><span class="stat-icon"><AppIcon name="wrench" /></span><div><span>Sample repair</span><strong class="stat-word">In progress</strong></div></article>
                    </div>
                    <div class="dashboard-two-col">
                        <section class="dashboard-card next-visit">
                            <div class="card-heading"><h2>Your next visit</h2><button class="text-link" @click="selectTab('appointments')">View all <AppIcon name="arrow" /></button></div>
                            <template v-if="nextVisit">
                                <div class="visit-date"><span>{{ datePart(nextVisit.date, 'day') }}</span><div>{{ datePart(nextVisit.date, 'month') }}<small>{{ nextVisit.time }} · Preferred time</small></div><StatusBadge :label="statusInfo(nextVisit.status).label" :tone="statusInfo(nextVisit.status).tone" :icon="statusInfo(nextVisit.status).icon" /></div>
```

**السطر 25:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 26:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 27:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 28:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 29:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 30:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `selectTab('appointments')` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 31:** `v-if` تعتمد على `nextVisit` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 32:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 33–40

```vue
                                <h3>{{ nextVisit.service }}</h3><p class="muted">{{ nextVisit.car }}</p>
                                <div class="visit-footer"><span><AppIcon name="pin" />New Cairo · Demo location</span><button class="text-link" @click="openReschedule(nextVisit)">Reschedule</button></div>
                            </template>
                            <div v-else class="empty-state"><AppIcon name="calendar" /><h3>Room for your next visit.</h3><p>Request a service whenever you’re ready.</p><a href="/#booking" class="text-link">Book a service <AppIcon name="arrow" /></a></div>
                        </section>
                        <section class="dashboard-card vehicle-feature">
                            <div class="card-heading"><h2>In your garage</h2><button class="text-link" @click="selectTab('vehicles')">Manage <AppIcon name="arrow" /></button></div>
                            <template v-if="state.vehicles.length">
```

**السطر 33:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 34:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `openReschedule(nextVisit)` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 35:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 36:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 37:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 38:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 39:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `selectTab('vehicles')` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 40:** `v-if` تعتمد على `state.vehicles.length` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

### السطور 41–48

```vue
                                <div class="vehicle-art"><AppIcon name="car" /><span>{{ state.vehicles[0].make }}</span></div>
                                <div class="vehicle-feature-info"><div><h3>{{ state.vehicles[0].make }} {{ state.vehicles[0].model }}</h3><p>{{ state.vehicles[0].year }} · {{ state.vehicles[0].plate }}</p></div><span>{{ Number(state.vehicles[0].mileage).toLocaleString() }}<small>km recorded</small></span></div>
                            </template>
                            <div v-else class="empty-state"><p>Add a vehicle to make your next booking easier.</p><button class="text-link" @click="showVehicleForm = true">Add your first vehicle</button></div>
                        </section>
                    </div>
                    <section class="dashboard-card repair-card">
                        <div class="card-heading"><div><p class="card-kicker">{{ state.repair.id }} · SAMPLE WORK ORDER</p><h2>A clear view of the work.</h2></div><StatusBadge label="In progress" tone="amber" icon="wrench" /></div>
```

**السطر 41:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 42:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 43:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 44:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `showVehicleForm = true` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 45:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 46:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 47:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 48:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 49–56

```vue
                        <div class="repair-summary"><span class="repair-icon"><AppIcon name="wrench" /></span><div><h3>{{ state.repair.service }}</h3><p>{{ state.repair.car }}</p></div><span class="sample-update">Illustrative progress</span></div>
                        <ol class="repair-timeline">
                            <li v-for="(stage, index) in repairStages" :key="stage" :class="{ done: index < state.repair.stage, current: index === state.repair.stage }" :aria-current="index === state.repair.stage ? 'step' : undefined"><span><AppIcon :name="index < state.repair.stage ? 'check' : index === state.repair.stage ? 'wrench' : 'clock'" /></span><strong>{{ stage }}</strong><small>{{ index < state.repair.stage ? 'Complete' : index === state.repair.stage ? 'In progress' : 'Upcoming' }}</small></li>
                        </ol>
                        <p class="repair-note"><AppIcon name="clock" />{{ state.repair.note }}</p>
                    </section>
                    <section class="dashboard-card">
                        <div class="card-heading"><h2>Recent service history</h2><button class="text-link" @click="selectTab('history')">View history <AppIcon name="arrow" /></button></div>
```

**السطر 49:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 50:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 51:** v-for: لف على `repairStages`، وفي كل دورة اسم العنصر الحالي `(stage, index)`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 52:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 53:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 54:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 55:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 56:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `selectTab('history')` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

### السطور 57–64

```vue
                        <div class="history-list"><button v-for="record in state.history.slice(0, 2)" :key="record.id" class="history-row" @click="selectedRecord = record"><span class="history-icon"><AppIcon name="check" /></span><span><strong>{{ record.service }}</strong><small>{{ record.car }}</small></span><span>{{ formatDate(record.date) }}</span><AppIcon name="chevron" /></button></div>
                    </section>
                </template>

                <template v-if="tab === 'vehicles'">
                    <div class="section-toolbar"><p>{{ state.vehicles.length }} saved vehicles</p><button class="btn garage-primary" @click="showVehicleForm = true"><AppIcon name="plus" /> Add vehicle</button></div>
                    <div class="vehicle-grid">
                        <article v-for="vehicle in state.vehicles" :key="vehicle.id" class="dashboard-card saved-vehicle">
```

**السطر 57:** v-for: لف على `state.history.slice(0, 2)`، وفي كل دورة اسم العنصر الحالي `record`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 58:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 59:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 61:** `v-if` تعتمد على `tab === 'vehicles'` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 62:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `showVehicleForm = true` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 63:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 64:** v-for: لف على `state.vehicles`، وفي كل دورة اسم العنصر الحالي `vehicle`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

### السطور 65–72

```vue
                            <div class="vehicle-art"><AppIcon name="car" /><span>{{ vehicle.make }}</span></div>
                            <h2>{{ vehicle.make }} {{ vehicle.model }}</h2><p>{{ vehicle.year }} · {{ vehicle.plate }}</p>
                            <dl><div><dt>Recorded mileage</dt><dd>{{ Number(vehicle.mileage).toLocaleString() }} km</dd></div><div><dt>Service records</dt><dd>{{ state.history.filter(h => h.vehicleId === vehicle.id).length }}</dd></div></dl>
                            <div class="vehicle-actions"><button class="text-link" @click="bookVehicle(vehicle)">Book service <AppIcon name="arrow" /></button><button class="subtle-button" @click="removeTarget = vehicle">Remove</button></div>
                        </article>
                        <button class="add-vehicle-tile" @click="showVehicleForm = true"><AppIcon name="plus" /><strong>A space for your next car.</strong><span>Add another vehicle</span></button>
                    </div>
                </template>
```

**السطر 65:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 66:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 67:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 68:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `bookVehicle(vehicle)` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 69:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 70:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `showVehicleForm = true` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 71:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 72:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 73–80

```vue

                <template v-if="tab === 'appointments'">
                    <div class="section-toolbar"><p>Keep your next visit in view.</p><label class="filter-label">Show <select v-model="appointmentFilter"><option value="active">Upcoming</option><option value="all">All appointments</option></select></label></div>
                    <div class="appointments-list">
                        <article v-for="appointment in filteredAppointments" :key="appointment.id" class="dashboard-card appointment-card">
                            <div class="appointment-date-block"><strong>{{ datePart(appointment.date, 'day') }}</strong><span>{{ datePart(appointment.date, 'month') }}</span></div>
                            <div class="appointment-copy"><span class="card-kicker">{{ appointment.id }}</span><h2>{{ appointment.service }}</h2><p>{{ appointment.car }}</p><small>{{ formatDate(appointment.date) }} at {{ appointment.time }} · Demo location</small></div>
                            <div class="appointment-actions"><StatusBadge :label="statusInfo(appointment.status).label" :tone="statusInfo(appointment.status).tone" :icon="statusInfo(appointment.status).icon" /><template v-if="appointment.status !== 'cancelled'"><button class="text-link" @click="openReschedule(appointment)">Reschedule</button><button class="subtle-button" @click="cancelTarget = appointment">Cancel request</button></template><button v-else class="text-link" @click="appointment.status = 'requested'; notice = 'Demo request restored.'">Restore request</button></div>
```

**السطر 74:** `v-if` تعتمد على `tab === 'appointments'` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 75:** v-model تربط قيمة عنصر الإدخال بـ`appointmentFilter` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 76:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 77:** v-for: لف على `filteredAppointments`، وفي كل دورة اسم العنصر الحالي `appointment`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 78:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 79:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 80:** `v-if` تعتمد على `appointment.status !== 'cancelled'` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

### السطور 81–88

```vue
                        </article>
                        <div v-if="!filteredAppointments.length" class="dashboard-card empty-state"><AppIcon name="calendar" /><h2>No upcoming appointments.</h2><p>When you request a service, it will appear here.</p><a href="/#booking" class="btn garage-primary">Find a service</a></div>
                    </div>
                </template>

                <template v-if="tab === 'history'">
                    <div class="section-toolbar"><p>Your car’s story, well documented.</p><label class="filter-label">Vehicle <select v-model="historyFilter"><option value="all">All vehicles</option><option v-for="vehicle in state.vehicles" :key="vehicle.id" :value="vehicle.id">{{ vehicle.make }} {{ vehicle.model }}</option></select></label></div>
                    <section class="dashboard-card"><div class="history-list"><button v-for="record in filteredHistory" :key="record.id" class="history-row" @click="selectedRecord = record"><span class="history-icon"><AppIcon name="check" /></span><span><strong>{{ record.service }}</strong><small>{{ record.car }} · {{ record.id }}</small></span><span>{{ formatDate(record.date) }}<small>{{ record.total }} EGP</small></span><AppIcon name="chevron" /></button><div v-if="!filteredHistory.length" class="empty-state"><h3>A fresh service history.</h3><p>No sample service records for this vehicle.</p></div></div></section>
```

**السطر 81:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 82:** `v-if` تعتمد على `!filteredAppointments.length` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 83:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 84:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 86:** `v-if` تعتمد على `tab === 'history'` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 87:** v-model تربط قيمة عنصر الإدخال بـ`historyFilter` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 88:** v-for: لف على `filteredHistory`، وفي كل دورة اسم العنصر الحالي `record`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

### السطور 89–96

```vue
                </template>
                <footer class="garage-bottom"><span>AutoCare Pro · Built around your peace of mind.</span><a href="/#faqs">Need a hand?</a></footer>
            </main>
        </div>

        <dialog ref="vehicleDialog" @close="showVehicleForm = false" @click="closeOnBackdrop($event, 'vehicle')">
            <form class="garage-dialog-form" @submit.prevent="saveVehicle">
                <div class="dialog-heading"><div><p class="editorial-kicker">MY VEHICLES</p><h2>Make room in your garage.</h2></div><button type="button" class="icon-button" aria-label="Close add vehicle" @click="showVehicleForm = false"><AppIcon name="close" /></button></div>
```

**السطر 89:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 90:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 91:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 92:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 94:** @close اختصار v-on:close: لما الحدث `close` يحصل، نفّذ `showVehicleForm = false` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 95:** @submit اختصار v-on:submit: لما الحدث `submit` يحصل، نفّذ `saveVehicle` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب. .prevent تمنع التصرف الافتراضي للحدث، مثل إعادة تحميل الصفحة عند submit؛ مش هي اللي تبعت request.

**السطر 96:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `showVehicleForm = false` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

### السطور 97–104

```vue
                <p class="muted">Save example vehicle details for quicker demo bookings.</p>
                <div class="dialog-fields"><label>Make<input v-model.trim="vehicleForm.make" required maxlength="40" placeholder="Toyota"></label><label>Model<input v-model.trim="vehicleForm.model" required maxlength="60" placeholder="Corolla"></label><label>Year<input v-model="vehicleForm.year" type="number" min="1950" :max="new Date().getFullYear() + 1" required></label><label>Registration<input v-model.trim="vehicleForm.plate" required maxlength="24" placeholder="DEMO 303"></label><label class="full-field">Recorded mileage (km)<input v-model="vehicleForm.mileage" type="number" min="0" max="2000000" required></label></div>
                <p v-if="vehicleError" role="alert" class="alert alert-error">{{ vehicleError }}</p>
                <button class="btn garage-primary" type="submit">Save vehicle <AppIcon name="check" /></button>
            </form>
        </dialog>

        <dialog ref="rescheduleDialog" @close="rescheduleTarget = null" @click="closeOnBackdrop($event, 'reschedule')">
```

**السطر 97:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 98:** v-model تربط قيمة عنصر الإدخال بـ`vehicleForm.make` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 99:** `v-if` تعتمد على `vehicleError` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 100:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 101:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 102:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 104:** @close اختصار v-on:close: لما الحدث `close` يحصل، نفّذ `rescheduleTarget = null` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

### السطور 105–112

```vue
            <form class="garage-dialog-form" @submit.prevent="saveReschedule">
                <div class="dialog-heading"><h2>A better time for your visit.</h2><button type="button" class="icon-button" aria-label="Close reschedule" @click="rescheduleTarget = null"><AppIcon name="close" /></button></div>
                <p class="muted">Changes remain a demo request until a real workshop confirms availability.</p>
                <div class="dialog-fields"><label>Preferred date<input v-model="rescheduleForm.date" type="date" :min="today" required></label><label>Preferred time<input v-model="rescheduleForm.time" type="time" required></label></div>
                <p v-if="rescheduleError" role="alert" class="alert alert-error">{{ rescheduleError }}</p>
                <button type="submit" class="btn garage-primary">Save requested time</button>
            </form>
        </dialog>
```

**السطر 105:** @submit اختصار v-on:submit: لما الحدث `submit` يحصل، نفّذ `saveReschedule` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب. .prevent تمنع التصرف الافتراضي للحدث، مثل إعادة تحميل الصفحة عند submit؛ مش هي اللي تبعت request.

**السطر 106:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `rescheduleTarget = null` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 107:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 108:** v-model تربط قيمة عنصر الإدخال بـ`rescheduleForm.date` من script: تختار/تكتب فيتحدّث المتغير، ولو المتغير اتغيّر بالكود يتحدّث الإدخال. في template عادة مش بتكتب .value للـref.

**السطر 109:** `v-if` تعتمد على `rescheduleError` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 110:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 111:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 112:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 113–120

```vue

        <dialog ref="recordDialog" @close="selectedRecord = null" @click="closeOnBackdrop($event, 'record')">
            <div v-if="selectedRecord" class="garage-dialog-form">
                <div class="dialog-heading"><div><p class="editorial-kicker">{{ selectedRecord.id }} · DEMO RECORD</p><h2>{{ selectedRecord.service }}</h2></div><button class="icon-button" aria-label="Close service record" @click="selectedRecord = null"><AppIcon name="close" /></button></div>
                <StatusBadge label="Completed" tone="green" icon="check" /><h3 class="record-car">{{ selectedRecord.car }}</h3><p class="muted">{{ formatDate(selectedRecord.date) }}</p><p class="record-notes">{{ selectedRecord.notes }}</p><div class="record-total"><span>Example total</span><strong>{{ selectedRecord.total }} EGP</strong></div>
            </div>
        </dialog>
        <dialog ref="confirmDialog" @close="cancelTarget = null; removeTarget = null">
```

**السطر 114:** @close اختصار v-on:close: لما الحدث `close` يحصل، نفّذ `selectedRecord = null` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 115:** `v-if` تعتمد على `selectedRecord` من script. لو الشرط صح Vue تنشئ الفرع، ولو غلط تشيله من DOM؛ ده مهم قبل قراءة خصائص object ممكن تكون undefined.

**السطر 116:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `selectedRecord = null` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 117:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 118:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 119:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 120:** @close اختصار v-on:close: لما الحدث `close` يحصل، نفّذ `cancelTarget = null; removeTarget = null` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

### السطور 121–128

```vue
            <div class="garage-dialog-form">
                <div class="dialog-heading"><h2>{{ removeTarget ? 'Remove this saved vehicle?' : 'Cancel this demo request?' }}</h2><button class="icon-button" aria-label="Close confirmation" @click="cancelTarget = null; removeTarget = null"><AppIcon name="close" /></button></div>
                <p class="muted">{{ removeTarget ? 'Existing appointments and service records will be kept. You can add the vehicle again later.' : 'No real workshop will be contacted. You can restore this request from All appointments.' }}</p>
                <div class="confirm-actions"><button class="btn garage-primary" @click="confirmAction">{{ removeTarget ? 'Remove vehicle' : 'Cancel request' }}</button><button class="text-link" @click="cancelTarget = null; removeTarget = null">Keep it</button></div>
            </div>
        </dialog>
    </div>
</template>
```

**السطر 121:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 122:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `cancelTarget = null; removeTarget = null` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 123:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 124:** @click اختصار v-on:click: لما الحدث `click` يحصل، نفّذ `confirmAction` من script. اسم الدالة بدون () يمرّر handler؛ التعبير اللي فيه () يتنفذ وقت الحدث هنا، مش عند تعريف القالب.

**السطر 125:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 126:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 127:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 128:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 129–136

```vue
<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import StatusBadge from './StatusBadge.vue';
import { useGarage, formatDate } from '../composables/useGarage';
const { state, storage, addVehicle } = useGarage();
const tabs = [{id:'overview',label:'Overview',icon:'grid'},{id:'vehicles',label:'My vehicles',icon:'car'},{id:'appointments',label:'Appointments',icon:'calendar'},{id:'history',label:'Service history',icon:'history'}];
const tab = ref(['overview','vehicles','appointments','history'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview');
```

**السطر 129:** بداية جزء JavaScript في مكوّن Vue/صفحة HTML. setup في Vue تتيح التعريفات للـtemplate؛ type=module في HTML يحدد تحميل module.

**السطر 130:** Import / استيراد: الأسماء `computed`، `nextTick`، `reactive`، `ref`، `watch` جاية من `vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 131:** Import / استيراد: الأسماء `AppIcon` جاية من `./AppIcon.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 132:** Import / استيراد: الأسماء `StatusBadge` جاية من `./StatusBadge.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 133:** Import / استيراد: الأسماء `useGarage`، `formatDate` جاية من `../composables/useGarage`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 134:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useGarage(...)`: يرجع الحالة وعمليات الإضافة؛ مش بيبدأ نسخة state منفصلة لكل component. مدخلاتها: لا شيء العائد/الأثر: { state, storage, addVehicle, addAppointment }. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 135:** Variable declaration / تعريف `tabs` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 4 عنصرًا؛ العناصر نفسها في السطور التالية. دور `tabs` هنا: بيانات sidebar؛ id للشرط وlabel للعرض وicon لAppIcon. المدخلات: لا شيء. الناتج/الأثر: array.

**السطر 136:** Variable declaration / تعريف `tab` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `tab` هنا: حالة التبويب الأولي من hash لو مسموح، وإلا overview. لا يوجد hashchange listener هنا. المدخلات: location.hash.slice(1). الناتج/الأثر: ref string. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `['overview','vehicles','appointments','history'].includes(location.hash.slice(1)) ? location.hash.slice(1) : '…`. العائد/الأثر: Ref object؛ `['overview','vehicles','appointments','history'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `location.hash.slice(1)`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `location.hash.slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `1`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 137–144

```vue
const titles = { overview: ['Welcome to your garage.', 'Your cars. Your plans. Everything in good hands.'], vehicles: ['A place for every vehicle.', 'Keep the details handy, and your next booking simple.'], appointments: ['Your next visit, sorted.', 'Plan ahead and manage your demo requests.'], history: ['Every service has a story.', 'A clear record of the care your vehicles receive.'] };
const activeTitle = computed(() => titles[tab.value][0]);
const activeSubtitle = computed(() => titles[tab.value][1]);
const today = new Date().toLocaleDateString('en-CA');
const upcoming = computed(() => state.appointments.filter(a => a.status !== 'cancelled' && a.date >= today).sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time)));
const nextVisit = computed(() => upcoming.value[0]);
const appointmentFilter = ref('active');
const historyFilter = ref('all');
```

**السطر 137:** Variable declaration / تعريف `titles` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `overview`، `vehicles`، `appointments`، `history`.

**السطر 138:** Variable declaration / تعريف `activeTitle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `activeTitle` هنا: عنوان الصفحة مشتق من tab. المدخلات: titles[tab.value][0]. الناتج/الأثر: computed string. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => titles[tab.value][0]`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 139:** Variable declaration / تعريف `activeSubtitle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `activeSubtitle` هنا: وصف الصفحة مشتق من tab. المدخلات: titles[tab.value][1]. الناتج/الأثر: computed string. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => titles[tab.value][1]`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 140:** Variable declaration / تعريف `today` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `new Date().toLocaleDateString(...)`: تنسّق التاريخ للعرض حسب locale/options. القيم المكتوبة هنا: `'en-CA'`. العائد/الأثر: string، وليس قيمة مناسبة بالضرورة للتخزين.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 141:** Variable declaration / تعريف `upcoming` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `upcoming` هنا: يستبعد cancelled والماضي ثم يرتب تصاعديًا حسب التاريخ والوقت. المدخلات: state.appointments وtoday. الناتج/الأثر: computed array جديدة من filter. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => state.appointments.filter(a => a.status !== 'cancelled' && a.date >= today).sort((a,b) => (a.date + a.ti…`. العائد/الأثر: ComputedRef؛ `state.appointments.filter(a => a.status !== 'cancelled' && a.date >= today).sort(...)`: ترتّب القائمة باستخدام المقارنة. القيم المكتوبة هنا: `(a,b) => (a.date + a.time).localeCompare(b.date + b.time)`. العائد/الأثر: نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.؛ `state.appointments.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `a => a.status !== 'cancelled' && a.date >= today`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `(a.date + a.time).localeCompare(...)`: يرجع ترتيب مقارنة string لا Boolean؛ يستخدمه sort، وتواريخ YYYY-MM-DD قابلة للترتيب النصي. القيم المكتوبة هنا: `b.date + b.time`. العائد/الأثر: رقم سالب/صفر/موجب. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 142:** Variable declaration / تعريف `nextVisit` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `nextVisit` هنا: أول حجز من upcoming المرتبة. المدخلات: upcoming.value[0]. الناتج/الأثر: appointment أو undefined. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => upcoming.value[0]`. العائد/الأثر: ComputedRef. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 143:** Variable declaration / تعريف `appointmentFilter` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `'active'`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 144:** Variable declaration / تعريف `historyFilter` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `'all'`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 145–152

```vue
const filteredAppointments = computed(() => appointmentFilter.value === 'active' ? upcoming.value : [...state.appointments].sort((a,b) => b.date.localeCompare(a.date)));
const filteredHistory = computed(() => [...state.history].filter(h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value).sort((a,b) => b.date.localeCompare(a.date)));
const notice = ref('');
const repairStages = ['Checked in', 'Inspection', 'Service underway', 'Ready to collect'];
const statusInfo = status => ({ confirmed: {label:'Confirmed · demo',tone:'green',icon:'check'}, requested:{label:'Requested',tone:'amber',icon:'clock'}, cancelled:{label:'Cancelled',tone:'neutral',icon:'close'} }[status] || {label:'Pending review',tone:'neutral',icon:'clock'});
const datePart = (date, type) => new Date(date + 'T12:00:00').toLocaleDateString('en-GB', type === 'day' ? {day:'2-digit'} : {month:'short',year:'numeric'});
function selectTab(value) { tab.value = value; history.replaceState(null, '', '#' + value); notice.value = ''; window.scrollTo({top:0,behavior:'instant'}); }
const showVehicleForm = ref(false), vehicleDialog = ref(null), vehicleError = ref('');
```

**السطر 145:** Variable declaration / تعريف `filteredAppointments` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `filteredAppointments` هنا: لو active يرجع upcoming، وإلا نسخة مرتبة من كل الحجوزات، لا يغيّر ترتيب الأصل. المدخلات: appointmentFilter,state.appointments. الناتج/الأثر: computed array. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => appointmentFilter.value === 'active' ? upcoming.value : [...state.appointments].sort((a,b) => b.date.loc…`. العائد/الأثر: ComputedRef؛ `[...state.appointments].sort(...)`: ترتّب القائمة باستخدام المقارنة. القيم المكتوبة هنا: `(a,b) => b.date.localeCompare(a.date)`. العائد/الأثر: نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.؛ `b.date.localeCompare(...)`: يرجع ترتيب مقارنة string لا Boolean؛ يستخدمه sort، وتواريخ YYYY-MM-DD قابلة للترتيب النصي. القيم المكتوبة هنا: `a.date`. العائد/الأثر: رقم سالب/صفر/موجب. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 146:** Variable declaration / تعريف `filteredHistory` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `filteredHistory` هنا: ينسخ السجل، يفلتر بالعربية لو محددة، ثم يرتب بالأحدث. المدخلات: historyFilter,state.history. الناتج/الأثر: computed array. الدوال الموجودة في السطر: `computed(...)`: قيمة مشتقة cached حسب reactive dependencies؛ مش مكان حفظ أو fetch جانبي. القيم المكتوبة هنا: `() => [...state.history].filter(h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value).sor…`. العائد/الأثر: ComputedRef؛ `[...state.history].filter(h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value).sort(...)`: ترتّب القائمة باستخدام المقارنة. القيم المكتوبة هنا: `(a,b) => b.date.localeCompare(a.date)`. العائد/الأثر: نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.؛ `[...state.history].filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `h => historyFilter.value === 'all' || h.vehicleId === historyFilter.value`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `b.date.localeCompare(...)`: يرجع ترتيب مقارنة string لا Boolean؛ يستخدمه sort، وتواريخ YYYY-MM-DD قابلة للترتيب النصي. القيم المكتوبة هنا: `a.date`. العائد/الأثر: رقم سالب/صفر/موجب. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 147:** Variable declaration / تعريف `notice` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `''`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 148:** Variable declaration / تعريف `repairStages` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 4 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 149:** Variable declaration / تعريف `statusInfo` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `statusInfo` هنا: قاموس status→label/tone/icon مع default؛ مفيش check server. المدخلات: status string. الناتج/الأثر: object شارة.

**السطر 150:** Variable declaration / تعريف `datePart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `datePart` هنا: يعرض اليوم أو الشهر والسنة من تاريخ واحد. المدخلات: date نص وtype إما day أو غيره. الناتج/الأثر: string. الدوال الموجودة في السطر: `new Date(date + 'T12:00:00').toLocaleDateString(...)`: تنسّق التاريخ للعرض حسب locale/options. القيم المكتوبة هنا: `'en-GB'`، `type === 'day' ? {day:'2-digit'} : {month:'short',year:'numeric'}`. العائد/الأثر: string، وليس قيمة مناسبة بالضرورة للتخزين.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `date + 'T12:00:00'`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 151:** Function / تعريف دالة `selectTab`؛ تعريفها مش تشغيلها. يغيّر tab ويكتب hash بلا تحميل صفحة، يمسح notice ويطلع فوق. مدخلاتها: value: tab id ناتجها: لا return صريح؛ side effects في state/history/scroll الدوال الموجودة في السطر: `history.replaceState(...)`: يعدل URL/history entry الحالية بلا reload ولا request جديد. القيم المكتوبة هنا: `null`، `''`، `'#' + value`. العائد/الأثر: undefined؛ `window.scrollTo(...)`: تحرّك موضع التمرير. القيم المكتوبة هنا: `{top:0,behavior:'instant'}`. العائد/الأثر: undefined؛ الحركة الناعمة ليست Promise تنتظرها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 152:** Variable declaration / تعريف `showVehicleForm`، `vehicleDialog`، `vehicleError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `''`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 153–160

```vue
const vehicleForm = reactive({make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0});
const rescheduleTarget = ref(null), rescheduleDialog = ref(null), rescheduleError = ref('');
const rescheduleForm = reactive({date:'',time:''});
const selectedRecord = ref(null), recordDialog = ref(null);
const cancelTarget = ref(null), removeTarget = ref(null), confirmDialog = ref(null);
function syncDialog(dialog, open) { if (!dialog) return; if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }
watch(showVehicleForm, async value => { await nextTick(); syncDialog(vehicleDialog.value, value); });
watch(rescheduleTarget, async value => { await nextTick(); syncDialog(rescheduleDialog.value, !!value); });
```

**السطر 153:** Variable declaration / تعريف `vehicleForm` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `reactive(...)`: يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value. القيم المكتوبة هنا: `{make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0}`. العائد/الأثر: reactive Proxy؛ `new Date().getFullYear(...)`: تقرأ السنة المحلية كاملة. مدخلاتها: بدون arguments. العائد/الأثر: number مثل2026.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 154:** Variable declaration / تعريف `rescheduleTarget`، `rescheduleDialog`، `rescheduleError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `''`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 155:** Variable declaration / تعريف `rescheduleForm` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `reactive(...)`: يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value. القيم المكتوبة هنا: `{date:'',time:''}`. العائد/الأثر: reactive Proxy. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 156:** Variable declaration / تعريف `selectedRecord`، `recordDialog` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `null`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 157:** Variable declaration / تعريف `cancelTarget`، `removeTarget`، `confirmDialog` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ref(...)`: يعمل صندوق reactive لقيمة؛ في JS تقرأ/تكتب .value وفي template غالبًا Vue تفكها. القيم المكتوبة هنا: `null`. العائد/الأثر: Ref object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 158:** Function / تعريف دالة `syncDialog`؛ تعريفها مش تشغيلها. يوائم Boolean state مع native HTML dialog، ويمنع showModal على dialog مفتوحة. مدخلاتها: dialog DOM element وopen Boolean ناتجها: لا return مفيد؛ showModal/close side effects الدوال الموجودة في السطر: `dialog.showModal(...)`: يفتح dialog في top layer كmodal، مع إدارة focus وbackdrop أصلية. مدخلاتها: لا شيء العائد/الأثر: undefined؛ قد يرمي لو الحالة غير مناسبة؛ `dialog.close(...)`: ImageBitmap.close تحرر bitmap؛ dialog.close تغلق حوارًا. مدخلاتها: حسب المستقبِل؛ الاستخدام المعتاد بدون. العائد/الأثر: void في هذين الاستخدامين؛ مش حذف الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 159:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `watch(...)`: يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog. القيم المكتوبة هنا: `showVehicleForm`، `async value => { await nextTick(); syncDialog(vehicleDialog.value, value); }`. العائد/الأثر: watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه؛ `nextTick(...)`: ينتظر انتهاء دفعة تحديث DOM الحالية بعد تغيير state، مش انتظار network ولا تأخير ثابت. مدخلاتها: callback اختياري العائد/الأثر: Promise<void>؛ `syncDialog(...)`: يوائم Boolean state مع native HTML dialog، ويمنع showModal على dialog مفتوحة. القيم المكتوبة هنا: `vehicleDialog.value`، `value`. العائد/الأثر: لا return مفيد؛ showModal/close side effects. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 160:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `watch(...)`: يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog. القيم المكتوبة هنا: `rescheduleTarget`، `async value => { await nextTick(); syncDialog(rescheduleDialog.value, !!value); }`. العائد/الأثر: watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه؛ `nextTick(...)`: ينتظر انتهاء دفعة تحديث DOM الحالية بعد تغيير state، مش انتظار network ولا تأخير ثابت. مدخلاتها: callback اختياري العائد/الأثر: Promise<void>؛ `syncDialog(...)`: يوائم Boolean state مع native HTML dialog، ويمنع showModal على dialog مفتوحة. القيم المكتوبة هنا: `rescheduleDialog.value`، `!!value`. العائد/الأثر: لا return مفيد؛ showModal/close side effects. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 161–168

```vue
watch(selectedRecord, async value => { await nextTick(); syncDialog(recordDialog.value, !!value); });
watch([cancelTarget,removeTarget], async ([a,b]) => { await nextTick(); syncDialog(confirmDialog.value, !!a || !!b); });
function closeOnBackdrop(event, kind) { if (event.target !== event.currentTarget) return; const rect=event.currentTarget.getBoundingClientRect(); if (event.clientX>=rect.left && event.clientX<=rect.right && event.clientY>=rect.top && event.clientY<=rect.bottom) return; if(kind==='vehicle') showVehicleForm.value=false; if(kind==='record') selectedRecord.value=null; if(kind==='reschedule') rescheduleTarget.value=null; }
function saveVehicle() {
    vehicleError.value='';
    if (!vehicleForm.make.trim() || !vehicleForm.model.trim() || !vehicleForm.plate.trim()) { vehicleError.value='Please complete the vehicle details.'; return; }
    if (state.vehicles.some(v=>v.plate.toLowerCase()===vehicleForm.plate.toLowerCase())) { vehicleError.value='That registration is already saved.'; return; }
    addVehicle({...vehicleForm}); showVehicleForm.value=false; notice.value='Vehicle saved in this demo workspace.';
```

**السطر 161:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `watch(...)`: يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog. القيم المكتوبة هنا: `selectedRecord`، `async value => { await nextTick(); syncDialog(recordDialog.value, !!value); }`. العائد/الأثر: watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه؛ `nextTick(...)`: ينتظر انتهاء دفعة تحديث DOM الحالية بعد تغيير state، مش انتظار network ولا تأخير ثابت. مدخلاتها: callback اختياري العائد/الأثر: Promise<void>؛ `syncDialog(...)`: يوائم Boolean state مع native HTML dialog، ويمنع showModal على dialog مفتوحة. القيم المكتوبة هنا: `recordDialog.value`، `!!value`. العائد/الأثر: لا return مفيد؛ showModal/close side effects. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 162:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `watch(...)`: يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog. القيم المكتوبة هنا: `[cancelTarget,removeTarget]`، `async ([a,b]) => { await nextTick(); syncDialog(confirmDialog.value, !!a || !!b); }`. العائد/الأثر: watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه؛ `nextTick(...)`: ينتظر انتهاء دفعة تحديث DOM الحالية بعد تغيير state، مش انتظار network ولا تأخير ثابت. مدخلاتها: callback اختياري العائد/الأثر: Promise<void>؛ `syncDialog(...)`: يوائم Boolean state مع native HTML dialog، ويمنع showModal على dialog مفتوحة. القيم المكتوبة هنا: `confirmDialog.value`، `!!a || !!b`. العائد/الأثر: لا return مفيد؛ showModal/close side effects. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 163:** Function / تعريف دالة `closeOnBackdrop`؛ تعريفها مش تشغيلها. يتأكد أن النقرة على dialog نفسها وخارج مستطيل المحتوى قبل تصفير state المناسبة. مدخلاتها: event,kind:vehicle|record|reschedule ناتجها: undefined، وقد يغير state الدوال الموجودة في السطر: `event.currentTarget.getBoundingClientRect(...)`: تقيس موضع وأبعاد العنصر بالنسبة للـviewport. مدخلاتها: بدون مدخلات. العائد/الأثر: DOMRect؛ القيم تتأثر بالـscroll والتحويلات.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 164:** Function / تعريف دالة `saveVehicle`؛ تعريفها مش تشغيلها. يفحص الحقول والسجل المكرر، ينادي composable، يقفل dialog ويعمل reset للنموذج. مدخلاتها: لا parameters؛ يقرأ vehicleForm/state ناتجها: undefined؛ addVehicle يرجع entry لكن المكوّن لا يحتاجه

**السطر 165:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 166:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `vehicleForm.make.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `vehicleForm.model.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `vehicleForm.plate.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 167:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `state.vehicles.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `v=>v.plate.toLowerCase()===vehicleForm.plate.toLowerCase()`. العائد/الأثر: Boolean.؛ `v.plate.toLowerCase(...)`: تحوّل الحروف لحالتها الصغيرة. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد.؛ `vehicleForm.plate.toLowerCase(...)`: تحوّل الحروف لحالتها الصغيرة. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 168:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `addVehicle(...)`: ينسخ form ويضيف UUID ويحوّل السنة والعداد لأرقام، ثم push في قائمة العربيات. القيم المكتوبة هنا: `{...vehicleForm}`. العائد/الأثر: entry: العربية الجديدة؛ الحفظ يتم من deep watcher. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 169–176

```vue
    Object.assign(vehicleForm,{make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0});
}
function openReschedule(appointment) { rescheduleError.value=''; Object.assign(rescheduleForm,{date:appointment.date,time:appointment.time}); rescheduleTarget.value=appointment; }
function saveReschedule() { if(rescheduleForm.date<today || !rescheduleForm.time){rescheduleError.value='Choose today or a future date and a preferred time.';return;} Object.assign(rescheduleTarget.value,rescheduleForm,{status:'requested'});rescheduleTarget.value=null;notice.value='Demo request updated. The new time is pending review.'; }
function confirmAction() { if(removeTarget.value){state.vehicles.splice(state.vehicles.findIndex(v=>v.id===removeTarget.value.id),1);removeTarget.value=null;notice.value='Saved vehicle removed.';} else if(cancelTarget.value){cancelTarget.value.status='cancelled';cancelTarget.value=null;notice.value='Demo request cancelled.';} }
function bookVehicle(vehicle) { try{sessionStorage.setItem('autocare.booking.vehicle',JSON.stringify({car:`${vehicle.year} ${vehicle.make} ${vehicle.model}`}));}catch{} location.href='/#booking'; }
</script>

```

**السطر 169:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `vehicleForm`، `{make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0}`. العائد/الأثر: target بعد التعديل؛ `new Date().getFullYear(...)`: تقرأ السنة المحلية كاملة. مدخلاتها: بدون arguments. العائد/الأثر: number مثل2026.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 170:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 171:** Function / تعريف دالة `openReschedule`؛ تعريفها مش تشغيلها. يملأ نموذج تغيير الموعد من الحجز ويحدد target، فيفتح dialog عن طريق watch. مدخلاتها: appointment object من v-for ناتجها: undefined؛ يغير reactive form/ref الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `rescheduleForm`، `{date:appointment.date,time:appointment.time}`. العائد/الأثر: target بعد التعديل. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 172:** Function / تعريف دالة `saveReschedule`؛ تعريفها مش تشغيلها. يرفض تاريخًا سابقًا أو وقتًا فاضيًا؛ يعدّل نفس object الحجز ويضع status=requested. مدخلاتها: يقرأ rescheduleForm وrescheduleTarget ناتجها: undefined؛ الحفظ التلقائي في composable watcher الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `rescheduleTarget.value`، `rescheduleForm`، `{status:'requested'}`. العائد/الأثر: target بعد التعديل. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 173:** Function / تعريف دالة `confirmAction`؛ تعريفها مش تشغيلها. لو فيه removeTarget يحذف العربية بfindIndex/splice، وإلا يلغي الحجز بتغيير status فقط. مدخلاتها: state الحالية للأهداف ناتجها: undefined؛ لا يمسح حجوزات/تاريخ العربية عند إزالة العربية الدوال الموجودة في السطر: `state.vehicles.splice(...)`: تحذف/تضيف في مكان محدد من الأصل. القيم المكتوبة هنا: `state.vehicles.findIndex(v=>v.id===removeTarget.value.id)`، `1`. العائد/الأثر: array بالعناصر المحذوفة؛ تعدّل الأصل.؛ `state.vehicles.findIndex(...)`: تبحث عن موضع أول عنصر مطابق. القيم المكتوبة هنا: `v=>v.id===removeTarget.value.id`. العائد/الأثر: index أو -1 لو مفيش تطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 174:** Function / تعريف دالة `bookVehicle`؛ تعريفها مش تشغيلها. يخزن نص العربية مؤقتًا في sessionStorage ثم ينتقل للصفحة العامة عند #booking. مدخلاتها: vehicle object ناتجها: undefined؛ يؤدي لتحميل document جديد الدوال الموجودة في السطر: `sessionStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `'autocare.booking.vehicle'`، `JSON.stringify({car:'${vehicle.year} ${vehicle.make} ${vehicle.model}'})`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `{car:'${vehicle.year} ${vehicle.make} ${vehicle.model}'}`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 175:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
