# المنيو: فلترة الفرع والقسم والإضافة للسلة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/MenuPage.jsx` · 134 سطر.

**وظيفة الملف:** يقرأ catalog/order contexts؛ يعرض الفرع ثم الفئات والمنتجات المتاحة بسعر الفرع. الإضافة تكتب السلة المحلية وتصدر حدثًا لتحديث العداد؛ لا تنشئ order في قاعدة البيانات.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Pages/MenuPage.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)

- [pizza-crm/resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](Cart.jsx.md)

- [pizza-crm/resources/js/Components/Navbar.jsx](../Components/Navbar.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branchOption, useCatalog } from '../context/CatalogContext';
import { useOrder } from '../context/OrderContext';

const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';

function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'); } catch { return []; }
}

function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}

function ProductImage({ item }) {
    const [failed, setFailed] = useState(false);
    if (!item.image_path || failed) {
        return <div className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</div>;
    }
    return <img src={item.image_path} alt={item.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

function CartToast({ message }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div className="wtc-menu-toast" initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: 0.25 }} role="status">
                    <span aria-hidden="true">+</span>{message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function MenuPage() {
    const { branches, categories, items, loading, error, reload } = useCatalog();
    const { mode, branchId: selectedBranchId, selectedBranch, availableBranches, setBranch } = useOrder();
    const [choosingBranch, setChoosingBranch] = useState(false);
    const [activeCategory, setActiveCategory] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!categories.length || activeCategory) return;
        setActiveCategory(categories[0].slug);
    }, [categories, activeCategory]);

    useEffect(() => {
        if (!toast) return undefined;
        const timeout = window.setTimeout(() => setToast(''), 2400);
        return () => window.clearTimeout(timeout);
    }, [toast]);

    const chooseBranch = (branch) => {
        if (!setBranch(branch.id)) return;
        setChoosingBranch(false);
        setActiveCategory(categories[0]?.slug || '');
    };

    const filteredItems = useMemo(() => items.filter((item) => {
        const option = branchOption(item, selectedBranchId);
        return item.category_slug === activeCategory && option?.is_available;
    }), [items, activeCategory, selectedBranchId]);

    const addToCart = (item) => {
        const option = branchOption(item, selectedBranchId);
        if (!selectedBranch || !option?.is_available) return;
        let currentCart = readCart();
        const differentBranch = currentCart.some((line) => Number(line.branch_id) !== selectedBranch.id);
        if (differentBranch) {
            if (!setBranch(selectedBranch.id)) return;
            currentCart = readCart();
        }
        const existing = currentCart.find((line) => line.id === item.id);
        const canonical = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(option.price),
            image_src: item.image_path,
            branch_id: selectedBranch.id,
            branch_name: selectedBranch.name,
        };
        const next = existing
            ? currentCart.map((line) => line.id === item.id ? { ...line, ...canonical, quantity: line.quantity + 1 } : line)
            : [...currentCart, { ...canonical, quantity: 1 }];
        writeCart(next);
        setToast(`${item.name} added to cart.`);
    };

    return (
        <main className="menu-page">
            <style>{`
                .wtc-menu-toast{position:fixed;right:1.4rem;bottom:1.4rem;z-index:3000;display:flex;align-items:center;gap:.7rem;max-width:min(430px,calc(100vw - 2rem));padding:.95rem 1.1rem;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(26,26,26,.96);color:#f5f5f5;font-weight:900;box-shadow:0 24px 70px rgba(0,0,0,.35)}.wtc-menu-toast span{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#e32626}.wtc-catalog-state{min-height:320px;display:grid;place-items:center;text-align:center}.wtc-catalog-state>div{max-width:520px}.menu-image-placeholder{font-size:1.25rem;font-weight:1000;color:#f1a83a;letter-spacing:.12em;background:radial-gradient(circle at center,rgba(227,38,38,.18),transparent 60%)}.menu-product-card{height:100%;overflow:hidden;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:#1a1a1a;color:#f5f5f5}.menu-product-card .card-body{display:flex;flex-direction:column}.menu-product-tag{color:#f1a83a;font-size:.7rem;font-weight:900;text-transform:uppercase}.menu-product-price{color:#ed3434;font-weight:950}.menu-product-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:1rem}.menu-product-footer button{width:38px;height:38px;border:0;border-radius:50%;background:#e32626;color:#fff;font-size:1.4rem}.branch-hours{display:block;color:#aaa}@media(max-width:575px){.wtc-menu-toast{left:1rem;right:1rem;bottom:1rem}}
            `}</style>
            <section className="section-padding menu-hero">
                <div className="container">
                    <header className="section-heading text-center">
                        <p className="eyebrow">Menu</p>
                        <h1 className="section-title">Choose your branch first.</h1>
                        <p className="section-copy mx-auto">Prices and availability come directly from each branch.</p>
                    </header>

                    {loading && <div className="wtc-catalog-state" role="status"><div><h2>Loading today&apos;s menu...</h2><p className="text-secondary">Checking branch prices and availability.</p></div></div>}
                    {!loading && error && <div className="wtc-catalog-state" role="alert"><div><h2>We could not load the menu.</h2><p className="text-secondary">{error}</p><button type="button" className="btn btn-red" onClick={reload}>Try Again</button></div></div>}
                    {!loading && !error && !branches.length && <div className="wtc-catalog-state"><div><h2>No branches are available.</h2><p className="text-secondary">Please check back shortly.</p></div></div>}

                    {!loading && !error && branches.length > 0 && (
                        <AnimatePresence mode="wait">
                            {choosingBranch || !selectedBranch ? (
                                <motion.div key="branches" className="branch-selection-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}>
                                    <span className="step-pill">Step 1</span><h2>Select a branch</h2><p>{mode === 'delivery' ? 'Showing branches that currently deliver.' : 'Choose where you will collect your order.'}</p>
                                    <Row className="g-4 mt-2">{availableBranches.map((branch) => <Col key={branch.id} xs={12} md={4}><button type="button" className="branch-card" onClick={() => chooseBranch(branch)}><span>{branch.location}</span><strong>{branch.name}</strong><small>{mode === 'delivery' ? `Delivery EGP ${Number(branch.delivery_fee || 0).toFixed(2)}` : branch.opening_hours || 'Opening hours coming soon'}</small></button></Col>)}</Row>
                                </motion.div>
                            ) : (
                                <motion.div key="products" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                    <div className="selected-branch-bar"><div><span className="step-pill">{mode === 'delivery' ? 'Delivery' : 'Pickup'} · Selected Branch</span><strong>{selectedBranch.name}</strong><small>{selectedBranch.location}</small></div><div className="selected-actions"><button type="button" className="btn btn-outline-glow" onClick={() => setChoosingBranch(true)}>Change Branch</button><Link to="/cart" className="btn btn-red">Go to Cart</Link></div></div>
                                    <div className="category-subnav"><span className="step-pill">Step 2</span><div className="category-scroll">{categories.map((category) => <button key={category.id} type="button" className={activeCategory === category.slug ? 'active' : ''} onClick={() => setActiveCategory(category.slug)}>{category.name}</button>)}</div></div>
                                    {!items.length ? <div className="empty-menu-state"><h2>The menu is empty.</h2><p>Seed the catalog to add products.</p></div> : !filteredItems.length ? <div className="empty-menu-state"><h2>Nothing available here right now.</h2><p>Try another category or branch.</p></div> : <Row className="g-4 menu-grid">{filteredItems.map((item, index) => { const option = branchOption(item, selectedBranch.id); return <Col key={item.id} xs={12} sm={6} lg={4} xl={3}><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: index * .06 }} className="h-100"><Card className="menu-product-card"><div className="menu-image"><ProductImage item={item} /></div><Card.Body><span className="menu-product-tag">{item.tag || item.category}</span><Card.Title className="mt-2 fw-bold">{item.name}</Card.Title><Card.Text className="text-secondary">{item.description}</Card.Text><div className="menu-product-footer"><strong className="menu-product-price">EGP {Number(option.price).toFixed(2)}</strong><button type="button" aria-label={`Add ${item.name} to cart`} onClick={() => addToCart(item)}>+</button></div></Card.Body></Card></motion.div></Col>; })}</Row>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </section>
            <CartToast message={toast} />
        </main>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### readCart

يفك سلة localStorage أو يرجّع [] عند فشل JSON.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** قائمة السلة المفكوكة.

### writeCart

يحفظ array السلة كنص JSON ثم يعلن wtc-cart-updated في نفس التبويب؛ setItem وحده لا يطلق storage هنا.

- **بتاخد إيه؟ Inputs:** cart: array أسطر السلة.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### ProductImage

يعرض الصورة أو placeholder عند غياب URL أو حصول onError.

- **بتاخد إيه؟ Inputs:** {item}.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX img أو div role=img.

### CartToast

يعرض message بحركة دخول وخروج إذا النص غير فاضي.

- **بتاخد إيه؟ Inputs:** {message}.

- **بترجع/بتغيّر إيه؟ Return / effect:** AnimatePresence/JSX.

### MenuPage

الصفحة النشطة على /menu؛ تعالج loading/error/empty واختيار الفرع والقسم.

- **بتاخد إيه؟ Inputs:** لا props؛ contexts.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX main.

### chooseBranch

يمرر branch.id إلى setBranch؛ لو نجح يقفل اختيار الفرع ويرجع لأول category.

- **بتاخد إيه؟ Inputs:** branch: object الفرع.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ early return عند رفض تغيير السلة.

### addToCart

يتأكد من خيار الفرع، يقرأ السلة، يزيد كمية الموجود بـ map أو يضيف object جديدًا بـ spread، يحفظ ويظهر Toast.

- **بتاخد إيه؟ Inputs:** item: المنتج اللي المستخدم ضغط + عليه.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ تأثيره كتابة السلة وsetToast.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `CART_STORAGE_KEY`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `CART_STORAGE_KEY`، `JSON.stringify(cart)`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `cart`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### window.dispatchEvent

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** ترسل Event للمستمعين على هذا الهدف بشكل متزامن.

- **المدخلات — Arguments:** Event object.

- **الناتج/الأثر — Return / effect:** Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.

- **أول موضع هنا:** السطر 17، والمدخلات المكتوبة: `new Event(CART_EVENT_NAME)`.

### Event

- **جاية منين؟** Browser

- **وظيفتها:** تنشئ Event تحمل نوع الحدث.

- **المدخلات — Arguments:** event type وoptions.

- **الناتج/الأثر — Return / effect:** Event object؛ الإرسال يحتاج dispatchEvent.

- **أول موضع هنا:** السطر 17، والمدخلات المكتوبة: `CART_EVENT_NAME`.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 45، والمدخلات المكتوبة: `''`.

- **مثال:** const [failed, setFailed] = useState(false);

### setFailed

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setFailed هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 25، والمدخلات المكتوبة: `true`.

### useCatalog

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** branches/categories/items/loading/error/reload.

- **أول موضع هنا:** السطر 41.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 37.

### useOrder

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.

- **أول موضع هنا:** السطر 42.

- **تكملة التعريف:** [resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)، عند السطر 127.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 52، والمدخلات المكتوبة: `() => {         if (!toast) return undefined;         const timeout = window.setTimeout(() => setToast(''), 2400);         return () => window.clearTimeout(timeout);     }`، `[toast]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### setActiveCategory

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setActiveCategory هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 122، والمدخلات المكتوبة: `category.slug`.

### window.setTimeout

- **جاية منين؟** Browser

- **وظيفتها:** ترتّب نداء callback مرة واحدة بعد التأخير.

- **المدخلات — Arguments:** callback وdelay بالمللي ثانية.

- **الناتج/الأثر — Return / effect:** timer ID في المتصفح.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `() => setToast('')`، `2400`.

### setToast

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setToast هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 92، والمدخلات المكتوبة: `'${item.name} added to cart.'`.

### window.clearTimeout

- **جاية منين؟** Browser

- **وظيفتها:** تلغي نداء timeout لم يبدأ بعد.

- **المدخلات — Arguments:** timeout ID.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تمسح تعريف callback.

- **أول موضع هنا:** السطر 55، والمدخلات المكتوبة: `timeout`.

### setBranch

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 75، والمدخلات المكتوبة: `selectedBranch.id`.

### setChoosingBranch

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setChoosingBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 121، والمدخلات المكتوبة: `true`.

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `() => items.filter((item) => {         const option = branchOption(item, selectedBranchId);         return item.category_slug === activeCategory && option?.is_available;     })`، `[items, activeCategory, selectedBranchId]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### items.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `(item) => {         const option = branchOption(item, selectedBranchId);         return item.category_slug === activeCategory && option?.is_available;     }`.

### branchOption

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options.

- **المدخلات — Arguments:** item: المنتج وقد يكون undefined؛ branchId: رقم أو نص معرّف الفرع.

- **الناتج/الأثر — Return / effect:** object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.

- **أول موضع هنا:** السطر 123، والمدخلات المكتوبة: `item`، `selectedBranch.id`.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 45.

### readCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يفك سلة localStorage أو يرجّع [] عند فشل JSON.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** قائمة السلة المفكوكة.

- **أول موضع هنا:** السطر 76.

### currentCart.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 73، والمدخلات المكتوبة: `(line) => Number(line.branch_id) !== selectedBranch.id`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 123، والمدخلات المكتوبة: `option.price`.

- **مثال:** Number(option.price);

### currentCart.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 78، والمدخلات المكتوبة: `(line) => line.id === item.id`.

### currentCart.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 89، والمدخلات المكتوبة: `(line) => line.id === item.id ? { ...line, ...canonical, quantity: line.quantity + 1 } : line`.

### writeCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحفظ array السلة كنص JSON ثم يعلن wtc-cart-updated في نفس التبويب؛ setItem وحده لا يطلق storage هنا.

- **المدخلات — Arguments:** cart: array أسطر السلة.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 91، والمدخلات المكتوبة: `next`.

### availableBranches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 117، والمدخلات المكتوبة: `(branch) => <Col key={branch.id} xs={12} md={4}><button type="button" className="branch-card" onClick={() => chooseBranch(branch)}><span>{branch.location}</span><strong>{branch.nam…`.

### chooseBranch

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يمرر branch.id إلى setBranch؛ لو نجح يقفل اختيار الفرع ويرجع لأول category.

- **المدخلات — Arguments:** branch: object الفرع.

- **الناتج/الأثر — Return / effect:** undefined؛ early return عند رفض تغيير السلة.

- **أول موضع هنا:** السطر 117، والمدخلات المكتوبة: `branch`.

### Number(branch.delivery_fee || 0).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 117، والمدخلات المكتوبة: `2`.

### categories.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 122، والمدخلات المكتوبة: `(category) => <button key={category.id} type="button" className={activeCategory === category.slug ? 'active' : ''} onClick={() => setActiveCategory(category.slug)}>{category.name}<…`.

### filteredItems.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 123، والمدخلات المكتوبة: `(item, index) => { const option = branchOption(item, selectedBranch.id); return <Col key={item.id} xs={12} sm={6} lg={4} xl={3}><motion.div initial={{ opacity: 0, y: 18 }} animate=…`.

### Number(option.price).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 123، والمدخلات المكتوبة: `2`.

### addToCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يتأكد من خيار الفرع، يقرأ السلة، يزيد كمية الموجود بـ map أو يضيف object جديدًا بـ spread، يحفظ ويظهر Toast.

- **المدخلات — Arguments:** item: المنتج اللي المستخدم ضغط + عليه.

- **الناتج/الأثر — Return / effect:** undefined؛ تأثيره كتابة السلة وsetToast.

- **أول موضع هنا:** السطر 123، والمدخلات المكتوبة: `item`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branchOption, useCatalog } from '../context/CatalogContext';
import { useOrder } from '../context/OrderContext';

const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
```

**السطر 1:** Import / استيراد: الأسماء `React`، `useEffect`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `Card`، `Col`، `Row` جاية من `react-bootstrap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `AnimatePresence`، `motion` جاية من `framer-motion`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `Link` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `branchOption`، `useCatalog` جاية من `../context/CatalogContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `useOrder` جاية من `../context/OrderContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 8:** Variable declaration / تعريف `CART_STORAGE_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 9–16

```jsx
const CART_EVENT_NAME = 'wtc-cart-updated';

function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'); } catch { return []; }
}

function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
```

**السطر 9:** Variable declaration / تعريف `CART_EVENT_NAME` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"wtc-cart-updated"`، مش ناتج طلب شبكة.

**السطر 11:** Function / تعريف دالة `readCart`؛ تعريفها مش تشغيلها. يفك سلة localStorage أو يرجّع [] عند فشل JSON. مدخلاتها: لا شيء. ناتجها: قائمة السلة المفكوكة.

**السطر 12:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `CART_STORAGE_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** Function / تعريف دالة `writeCart`؛ تعريفها مش تشغيلها. يحفظ array السلة كنص JSON ثم يعلن wtc-cart-updated في نفس التبويب؛ setItem وحده لا يطلق storage هنا. مدخلاتها: cart: array أسطر السلة. ناتجها: undefined.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `CART_STORAGE_KEY`، `JSON.stringify(cart)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `cart`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```jsx
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}

function ProductImage({ item }) {
    const [failed, setFailed] = useState(false);
    if (!item.image_path || failed) {
        return <div className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</div>;
    }
```

**السطر 17:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.dispatchEvent(...)`: ترسل Event للمستمعين على هذا الهدف بشكل متزامن. القيم المكتوبة هنا: `new Event(CART_EVENT_NAME)`. العائد/الأثر: Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.؛ `Event(...)`: تنشئ Event تحمل نوع الحدث. القيم المكتوبة هنا: `CART_EVENT_NAME`. العائد/الأثر: Event object؛ الإرسال يحتاج dispatchEvent.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 20:** Function / تعريف دالة `ProductImage`؛ تعريفها مش تشغيلها. يعرض الصورة أو placeholder عند غياب URL أو حصول onError. مدخلاتها: {item}. ناتجها: JSX img أو div role=img.

**السطر 21:** Variable declaration / تعريف `failed + setFailed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 22:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 23:** Return / رجّع `<div className="menu-image-placeholder" role="img" aria-label={'${item.name} photo coming soon'}>WTC</div>` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```jsx
    return <img src={item.image_path} alt={item.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

function CartToast({ message }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div className="wtc-menu-toast" initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: 0.25 }} role="status">
```

**السطر 25:** Return / رجّع `<img src={item.image_path} alt={item.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `setFailed(...)`: لو setFailed هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 28:** Function / تعريف دالة `CartToast`؛ تعريفها مش تشغيلها. يعرض message بحركة دخول وخروج إذا النص غير فاضي. مدخلاتها: {message}. ناتجها: AnimatePresence/JSX.

**السطر 29:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 30:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 31:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 32:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 33–40

```jsx
                    <span aria-hidden="true">+</span>{message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function MenuPage() {
```

**السطر 33:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 34:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 36:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 37:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 40:** Function / تعريف دالة `MenuPage`؛ تعريفها مش تشغيلها. الصفحة النشطة على /menu؛ تعالج loading/error/empty واختيار الفرع والقسم. مدخلاتها: لا props؛ contexts. ناتجها: JSX main.

### السطور 41–48

```jsx
    const { branches, categories, items, loading, error, reload } = useCatalog();
    const { mode, branchId: selectedBranchId, selectedBranch, availableBranches, setBranch } = useOrder();
    const [choosingBranch, setChoosingBranch] = useState(false);
    const [activeCategory, setActiveCategory] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!categories.length || activeCategory) return;
```

**السطر 41:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useCatalog(...)`: يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود. مدخلاتها: لا شيء. العائد/الأثر: branches/categories/items/loading/error/reload.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useOrder(...)`: Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها. مدخلاتها: لا شيء. العائد/الأثر: value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** Variable declaration / تعريف `choosingBranch + setChoosingBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Variable declaration / تعريف `activeCategory + setActiveCategory` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Variable declaration / تعريف `toast + setToast` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         if (!categories.length || activeCategory) return;         setActiveCategory(categories[0].slug…`، `[categories, activeCategory]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 49–56

```jsx
        setActiveCategory(categories[0].slug);
    }, [categories, activeCategory]);

    useEffect(() => {
        if (!toast) return undefined;
        const timeout = window.setTimeout(() => setToast(''), 2400);
        return () => window.clearTimeout(timeout);
    }, [toast]);
```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setActiveCategory(...)`: لو setActiveCategory هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `categories[0].slug`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 52:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         if (!toast) return undefined;         const timeout = window.setTimeout(() => setToast(''), 24…`، `[toast]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 54:** Variable declaration / تعريف `timeout` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `window.setTimeout(...)`: ترتّب نداء callback مرة واحدة بعد التأخير. القيم المكتوبة هنا: `() => setToast('')`، `2400`. العائد/الأثر: timer ID في المتصفح.؛ `setToast(...)`: لو setToast هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** Return / رجّع `() => window.clearTimeout(timeout)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `window.clearTimeout(...)`: تلغي نداء timeout لم يبدأ بعد. القيم المكتوبة هنا: `timeout`. العائد/الأثر: undefined؛ لا تمسح تعريف callback.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 57–64

```jsx

    const chooseBranch = (branch) => {
        if (!setBranch(branch.id)) return;
        setChoosingBranch(false);
        setActiveCategory(categories[0]?.slug || '');
    };

    const filteredItems = useMemo(() => items.filter((item) => {
```

**السطر 58:** Variable declaration / تعريف `chooseBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `chooseBranch` هنا: يمرر branch.id إلى setBranch؛ لو نجح يقفل اختيار الفرع ويرجع لأول category. المدخلات: branch: object الفرع.. الناتج/الأثر: undefined؛ early return عند رفض تغيير السلة..

**السطر 59:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `branch.id`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setChoosingBranch(...)`: لو setChoosingBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setActiveCategory(...)`: لو setActiveCategory هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `categories[0]?.slug || ''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 64:** Variable declaration / تعريف `filteredItems` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => items.filter((item) => {         const option = branchOption(item, selectedBranchId);         return ite…`، `[items, activeCategory, selectedBranchId]`. العائد/الأثر: القيمة المحسوبة.؛ `items.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(item) => {         const option = branchOption(item, selectedBranchId);         return item.category_slug ===…`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 65–72

```jsx
        const option = branchOption(item, selectedBranchId);
        return item.category_slug === activeCategory && option?.is_available;
    }), [items, activeCategory, selectedBranchId]);

    const addToCart = (item) => {
        const option = branchOption(item, selectedBranchId);
        if (!selectedBranch || !option?.is_available) return;
        let currentCart = readCart();
```

**السطر 65:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branchOption(...)`: يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. القيم المكتوبة هنا: `item`، `selectedBranchId`. العائد/الأثر: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** Return / رجّع `item.category_slug === activeCategory && option?.is_available` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 67:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 69:** Variable declaration / تعريف `addToCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `addToCart` هنا: يتأكد من خيار الفرع، يقرأ السلة، يزيد كمية الموجود بـ map أو يضيف object جديدًا بـ spread، يحفظ ويظهر Toast. المدخلات: item: المنتج اللي المستخدم ضغط + عليه.. الناتج/الأثر: undefined؛ تأثيره كتابة السلة وsetToast..

**السطر 70:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branchOption(...)`: يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. القيم المكتوبة هنا: `item`، `selectedBranchId`. العائد/الأثر: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 71:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 72:** Variable declaration / تعريف `currentCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `readCart(...)`: يفك سلة localStorage أو يرجّع [] عند فشل JSON. مدخلاتها: لا شيء. العائد/الأثر: قائمة السلة المفكوكة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 73–80

```jsx
        const differentBranch = currentCart.some((line) => Number(line.branch_id) !== selectedBranch.id);
        if (differentBranch) {
            if (!setBranch(selectedBranch.id)) return;
            currentCart = readCart();
        }
        const existing = currentCart.find((line) => line.id === item.id);
        const canonical = {
            id: item.id,
```

**السطر 73:** Variable declaration / تعريف `differentBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `currentCart.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `(line) => Number(line.branch_id) !== selectedBranch.id`. العائد/الأثر: Boolean.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `line.branch_id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 74:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 75:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `selectedBranch.id`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 76:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `readCart(...)`: يفك سلة localStorage أو يرجّع [] عند فشل JSON. مدخلاتها: لا شيء. العائد/الأثر: قائمة السلة المفكوكة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 77:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 78:** Variable declaration / تعريف `existing` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `currentCart.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(line) => line.id === item.id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 79:** Variable declaration / تعريف `canonical` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `id`، `name`، `description`، `price`، `image_src`، `branch_id`، `branch_name`.

**السطر 80:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 81–88

```jsx
            name: item.name,
            description: item.description,
            price: Number(option.price),
            image_src: item.image_path,
            branch_id: selectedBranch.id,
            branch_name: selectedBranch.name,
        };
        const next = existing
```

**السطر 81:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 82:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 83:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `option.price`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 84:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 85:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 86:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 87:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 88:** Variable declaration / تعريف `next` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 89–96

```jsx
            ? currentCart.map((line) => line.id === item.id ? { ...line, ...canonical, quantity: line.quantity + 1 } : line)
            : [...currentCart, { ...canonical, quantity: 1 }];
        writeCart(next);
        setToast(`${item.name} added to cart.`);
    };

    return (
        <main className="menu-page">
```

**السطر 89:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `currentCart.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(line) => line.id === item.id ? { ...line, ...canonical, quantity: line.quantity + 1 } : line`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 90:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 91:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeCart(...)`: يحفظ array السلة كنص JSON ثم يعلن wtc-cart-updated في نفس التبويب؛ setItem وحده لا يطلق storage هنا. القيم المكتوبة هنا: `next`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 92:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setToast(...)`: لو setToast هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'${item.name} added to cart.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 93:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 95:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 96:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 97–104

```jsx
            <style>{`
                .wtc-menu-toast{position:fixed;right:1.4rem;bottom:1.4rem;z-index:3000;display:flex;align-items:center;gap:.7rem;max-width:min(430px,calc(100vw - 2rem));padding:.95rem 1.1rem;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(26,26,26,.96);color:#f5f5f5;font-weight:900;box-shadow:0 24px 70px rgba(0,0,0,.35)}.wtc-menu-toast span{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#e32626}.wtc-catalog-state{min-height:320px;display:grid;place-items:center;text-align:center}.wtc-catalog-state>div{max-width:520px}.menu-image-placeholder{font-size:1.25rem;font-weight:1000;color:#f1a83a;letter-spacing:.12em;background:radial-gradient(circle at center,rgba(227,38,38,.18),transparent 60%)}.menu-product-card{height:100%;overflow:hidden;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:#1a1a1a;color:#f5f5f5}.menu-product-card .card-body{display:flex;flex-direction:column}.menu-product-tag{color:#f1a83a;font-size:.7rem;font-weight:900;text-transform:uppercase}.menu-product-price{color:#ed3434;font-weight:950}.menu-product-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:1rem}.menu-product-footer button{width:38px;height:38px;border:0;border-radius:50%;background:#e32626;color:#fff;font-size:1.4rem}.branch-hours{display:block;color:#aaa}@media(max-width:575px){.wtc-menu-toast{left:1rem;right:1rem;bottom:1rem}}
            `}</style>
            <section className="section-padding menu-hero">
                <div className="container">
                    <header className="section-heading text-center">
                        <p className="eyebrow">Menu</p>
                        <h1 className="section-title">Choose your branch first.</h1>
```

**السطر 97:** بداية CSS / تنسيق؛ لو scoped فـVue تضيف عزلًا بالـattributes أثناء البناء.

**السطر 98:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 99:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 100:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 101:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 102:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 103:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 104:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 105–112

```jsx
                        <p className="section-copy mx-auto">Prices and availability come directly from each branch.</p>
                    </header>

                    {loading && <div className="wtc-catalog-state" role="status"><div><h2>Loading today&apos;s menu...</h2><p className="text-secondary">Checking branch prices and availability.</p></div></div>}
                    {!loading && error && <div className="wtc-catalog-state" role="alert"><div><h2>We could not load the menu.</h2><p className="text-secondary">{error}</p><button type="button" className="btn btn-red" onClick={reload}>Try Again</button></div></div>}
                    {!loading && !error && !branches.length && <div className="wtc-catalog-state"><div><h2>No branches are available.</h2><p className="text-secondary">Please check back shortly.</p></div></div>}

                    {!loading && !error && branches.length > 0 && (
```

**السطر 105:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 106:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 108:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 109:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 110:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 112:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 113–120

```jsx
                        <AnimatePresence mode="wait">
                            {choosingBranch || !selectedBranch ? (
                                <motion.div key="branches" className="branch-selection-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}>
                                    <span className="step-pill">Step 1</span><h2>Select a branch</h2><p>{mode === 'delivery' ? 'Showing branches that currently deliver.' : 'Choose where you will collect your order.'}</p>
                                    <Row className="g-4 mt-2">{availableBranches.map((branch) => <Col key={branch.id} xs={12} md={4}><button type="button" className="branch-card" onClick={() => chooseBranch(branch)}><span>{branch.location}</span><strong>{branch.name}</strong><small>{mode === 'delivery' ? `Delivery EGP ${Number(branch.delivery_fee || 0).toFixed(2)}` : branch.opening_hours || 'Opening hours coming soon'}</small></button></Col>)}</Row>
                                </motion.div>
                            ) : (
                                <motion.div key="products" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
```

**السطر 113:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 114:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 115:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 116:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 117:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `availableBranches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch) => <Col key={branch.id} xs={12} md={4}><button type="button" className="branch-card" onClick={() => c…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `chooseBranch(...)`: يمرر branch.id إلى setBranch؛ لو نجح يقفل اختيار الفرع ويرجع لأول category. القيم المكتوبة هنا: `branch`. العائد/الأثر: undefined؛ early return عند رفض تغيير السلة.؛ `Number(branch.delivery_fee || 0).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branch.delivery_fee || 0`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 118:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 119:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 120:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 121–128

```jsx
                                    <div className="selected-branch-bar"><div><span className="step-pill">{mode === 'delivery' ? 'Delivery' : 'Pickup'} · Selected Branch</span><strong>{selectedBranch.name}</strong><small>{selectedBranch.location}</small></div><div className="selected-actions"><button type="button" className="btn btn-outline-glow" onClick={() => setChoosingBranch(true)}>Change Branch</button><Link to="/cart" className="btn btn-red">Go to Cart</Link></div></div>
                                    <div className="category-subnav"><span className="step-pill">Step 2</span><div className="category-scroll">{categories.map((category) => <button key={category.id} type="button" className={activeCategory === category.slug ? 'active' : ''} onClick={() => setActiveCategory(category.slug)}>{category.name}</button>)}</div></div>
                                    {!items.length ? <div className="empty-menu-state"><h2>The menu is empty.</h2><p>Seed the catalog to add products.</p></div> : !filteredItems.length ? <div className="empty-menu-state"><h2>Nothing available here right now.</h2><p>Try another category or branch.</p></div> : <Row className="g-4 menu-grid">{filteredItems.map((item, index) => { const option = branchOption(item, selectedBranch.id); return <Col key={item.id} xs={12} sm={6} lg={4} xl={3}><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: index * .06 }} className="h-100"><Card className="menu-product-card"><div className="menu-image"><ProductImage item={item} /></div><Card.Body><span className="menu-product-tag">{item.tag || item.category}</span><Card.Title className="mt-2 fw-bold">{item.name}</Card.Title><Card.Text className="text-secondary">{item.description}</Card.Text><div className="menu-product-footer"><strong className="menu-product-price">EGP {Number(option.price).toFixed(2)}</strong><button type="button" aria-label={`Add ${item.name} to cart`} onClick={() => addToCart(item)}>+</button></div></Card.Body></Card></motion.div></Col>; })}</Row>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
```

**السطر 121:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setChoosingBranch(...)`: لو setChoosingBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 122:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `categories.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(category) => <button key={category.id} type="button" className={activeCategory === category.slug ? 'active' :…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `setActiveCategory(...)`: لو setActiveCategory هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `category.slug`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 123:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `filteredItems.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item, index) => { const option = branchOption(item, selectedBranch.id); return <Col key={item.id} xs={12} sm=…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `branchOption(...)`: يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. القيم المكتوبة هنا: `item`، `selectedBranch.id`. العائد/الأثر: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.؛ `Number(option.price).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `option.price`. العائد/الأثر: number أو NaN.؛ `addToCart(...)`: يتأكد من خيار الفرع، يقرأ السلة، يزيد كمية الموجود بـ map أو يضيف object جديدًا بـ spread، يحفظ ويظهر Toast. القيم المكتوبة هنا: `item`. العائد/الأثر: undefined؛ تأثيره كتابة السلة وsetToast.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 124:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 125:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 126:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 127:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 128:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 129–134

```jsx
            </section>
            <CartToast message={toast} />
        </main>
    );
}

```

**السطر 129:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 130:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 131:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 132:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 133:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
