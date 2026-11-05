# 16 — كل ملفات المصدر في مشاريعك

[العودة لبداية المذاكرة](00-start-here.md)

ده **مرجع المصدر الكامل**، مش بديل للدروس الصغيرة. كل ملف له كوده الحرفي، شرح متتابع لكل سطر غير فاضي، تعريفات الدوال وروابط الملفات المرتبطة. الشرح العام للسطر يفسّر بنيته؛ المسارات العملية في الدروس الإضافية تشرح ليه الميزة موجودة وإزاي نهايتها تظهر للمستخدم.

الحصر الحالي: **194 ملف**، **18012 سطر مصدر** في المشاريع الثلاثة. مش مطلوب تذاكرهم دفعة واحدة.

## تبدأ منين؟

- [Vue: اختيار خدمة والتأكيد وwatch، JavaScript مع template كاملين](17-service-confirmation-and-watch.md)

- [رحلات Pizza backend كاملة](18-pizza-backend-full-flows.md)

- [رحلات Pizza frontend كاملة](19-pizza-frontend-full-flows.md)

- [رحلات AutoCare والبورتفوليو كاملة](20-autocare-portfolio-full-flows.md)

## حدود الحصر — Scope

داخل الحصر: source التطبيق والواجهات وPHP وCSS وJSON/config والمهاجرات والاختبارات وسكربتات البناء/العرض، ومعاهم ملفات starter الموجودة مصنّفة بوضوح. خارج الحصر: vendor وnode_modules وملفات build/cache، backups/docs نفسها، صور وفيديو وخطوط، قواعد البيانات الثنائية و.env وأي مجلد خاص غير داخل مجلدات المصدر. لا ننشر أسرار أو بيانات عملاء. ملفات lock/metadata مولّدة مش دروس كود.

الكود نسخة قراءة بتاريخ توليد الحصر؛ لو عدلت المشروع بعد كده لازم تحدّث المرجع، مش بيتزامن تلقائيًا. ملفات التطبيق الأصلية لم تُعدّل لتجهيز المذكرات.

## pizza-crm

- [app/Console/Commands/CheckReadiness.php](source-code/pizza-crm/app/Console/Commands/CheckReadiness.php.md) — 93 سطر. php artisan app:readiness يفحص وجود env واتصال DB وmigrations وseed data وشكل مفاتيح Stripe بدون طباعة قيم الأسرار. لا يشغّل migrations ولا seed بنفسه، ووجود prefix test صالح مش إثبات اتصال فعلي بـ Stripe.

- [app/Contracts/PaymentGateway.php](source-code/pizza-crm/app/Contracts/PaymentGateway.php.md) — 11 سطر. مش implementation ومش بيكلم Stripe بنفسه. بيحدد الدوال اللي أي payment provider لازم يوفرها. controller يعتمد على العقد، والـ container يختار Stripe الحقيقي، والاختبار يقدر يبدّله بكلاس وهمي.

- [app/Events/OrderPlaced.php](source-code/pizza-crm/app/Events/OrderPlaced.php.md) — 35 سطر. ShouldBroadcastNow يطلب بثًا فوريًا باستخدام broadcasting driver المهيأ؛ لا يضمن إن driver أو frontend subscription موجودين. الواجهة الحالية تعرض polling أيضًا، لذلك وجود event مش معناه realtime وحده شغال.

- [app/Events/OrderStatusUpdated.php](source-code/pizza-crm/app/Events/OrderStatusUpdated.php.md) — 35 سطر. نفس قنوات event الطلب الجديد لكن payload فيها id والحالة الحالية. التنفيذ الفعلي للبث يعتمد على configuration؛ polling في StaffDashboard مش ملغاة.

- [app/Http/Controllers/Api/AdminController.php](source-code/pizza-crm/app/Http/Controllers/Api/AdminController.php.md) — 169 سطر. كلاس يجمع endpoints الإدارة. role middleware وFormRequests يحموا التعديلات، وAdminAudit يسجلها. مهم نفرّق إنه كود شغال لكنه كبير، وممكن في refactor يتقسم لcontrollers أصغر من غير ما نغيّر API.

- [app/Http/Controllers/Api/AuthController.php](source-code/pizza-crm/app/Http/Controllers/Api/AuthController.php.md) — 88 سطر. بيستقبل طلبات AuthContext من React، يتحقق من البيانات، ويستخدم Laravel session authentication مش JWT. كلمات المرور تتحول إلى hash أحادي الاتجاه من User casts، مش encryption قابلة للفك؛ session تتجدد بعد الدخول، والرد بيرجع user وCSRF token جديد للواجهة.

- [app/Http/Controllers/Api/MenuController.php](source-code/pizza-crm/app/Http/Controllers/Api/MenuController.php.md) — 63 سطر. بيقرأ الفروع والأقسام والمنتجات النشطة، يعمل eager loading للأسعار المتاحة بكل فرع، ويرجع الشكل اللي CatalogContext وMenuPage محتاجينه. السعر هنا مش property على menu_items؛ جاي من pivot branch_menu_item.

- [app/Http/Controllers/Api/OrderController.php](source-code/pizza-crm/app/Http/Controllers/Api/OrderController.php.md) — 33 سطر. نقطة دخول الطلب العادي من Cart. بيرفض card هنا عشان ما يتسجلش طلب مدفوع من مجرد كلام المتصفح. الشغل الفعلي لإنشاء الطلب وحساب الأسعار في OrderCreator، وبعده يرسل OrderPlaced ويرجع tracking_url.

- [app/Http/Controllers/Api/OrderTrackingController.php](source-code/pizza-crm/app/Http/Controllers/Api/OrderTrackingController.php.md) — 98 سطر. تتبع عام باستخدام random token مش رقم order متوقع. safeOrder تعمل allowlist للحقول، وتاريخ الحساب وإعادة الطلب محميان بsession والملكية. كلمة safe مش معناها مفيش بيانات شخصية: صاحب tracking URL يقدر يشوف الاسم والهاتف والعنوان المعروضين.

- [app/Http/Controllers/Api/PaymentController.php](source-code/pizza-crm/app/Http/Controllers/Api/PaymentController.php.md) — 104 سطر. createIntent ينشئ طلب payment_pending ثم يطلب Stripe intent. webhook مستقل يتأكد من signature قبل إعلان paid. نجاح واجهة الكارت وحده مش مصدر الثقة. الحماية الحالية للتكرار تمنع webhook متكرر بالتتابع، لكنها مش ضمان كامل ضد وصول حدثين متزامنين.

- [app/Http/Controllers/Api/StaffOrderController.php](source-code/pizza-crm/app/Http/Controllers/Api/StaffOrderController.php.md) — 122 سطر. يحصر الموظف في فرعه، يسمح للإدمن بكل الفروع، ويطبق انتقالات الطلب داخل transaction مع row lock. expected_status يكشف إن موظف تاني سبقك، وكل انتقال يتحفظ في order_status_logs.

- [app/Http/Controllers/Controller.php](source-code/pizza-crm/app/Http/Controllers/Controller.php.md) — 9 سطر. abstract class فاضية حاليًا؛ الوراثة منها بتنظم المشروع لكن مش فيها business logic أو authorize helper جاهز في هذا الملف.

- [app/Http/Middleware/RequireRole.php](source-code/pizza-crm/app/Http/Middleware/RequireRole.php.md) — 20 سطر. يرفض الطلب لو المستخدم غائب أو معطّل أو دوره مش ضمن roles المطلوبة. staff لازم مرتبط بفرع. إخفاء زر React مش أمن؛ الرفض الحقيقي هنا وفي authorizeBranch.

- [app/Http/Requests/AdminBranchRequest.php](source-code/pizza-crm/app/Http/Requests/AdminBranchRequest.php.md) — 24 سطر. Admin فقط، واسم/عنوان مطلوبين ورسوم توصيل رقمية غير سالبة وdelivery_enabled/is_active Boolean وترتيب integer.

- [app/Http/Requests/AdminCategoryRequest.php](source-code/pizza-crm/app/Http/Requests/AdminCategoryRequest.php.md) — 21 سطر. الslug لازم unique؛ عند تعديل category بنستثني نفس السجل من فحص uniqueness بدل ما نرفض اسمه الحالي.

- [app/Http/Requests/AdminOrderFilterRequest.php](source-code/pizza-crm/app/Http/Requests/AdminOrderFilterRequest.php.md) — 20 سطر. يحمي endpoint البحث من قيم بأنواع/أطوال غير متوقعة ويشترط branch_id موجودة؛ status/payment_status هنا string max40 مش Rule::in كاملة.

- [app/Http/Requests/AdminPasswordRequest.php](source-code/pizza-crm/app/Http/Requests/AdminPasswordRequest.php.md) — 16 سطر. Admin فقط؛ password مطلوبة وطولها 8 على الأقل ولازم تطابق password_confirmation. دي validation مش hashing؛ User cast يتولى hashing.

- [app/Http/Requests/AdminProductRequest.php](source-code/pizza-crm/app/Http/Requests/AdminProductRequest.php.md) — 35 سطر. الواجهة تبعت multipart/FormData: الصورة ملف، وbranch_options نص JSON؛ لذلك نفك النص قبل validation. يراجع image MIME/8MB والاسم والوصف والفرع والسعر والإتاحة.

- [app/Http/Requests/AdminSettingsRequest.php](source-code/pizza-crm/app/Http/Requests/AdminSettingsRequest.php.md) — 19 سطر. يتحقق من 3 إعدادات رقمية فقط؛ القيم تتحفظ كنص في AppSetting ونحوّلها لرقم عند الاستخدام. default_delivery_fee إعداد موجود لكن OrderCreator الحالي يستخدم delivery_fee الخاصة بالفرع.

- [app/Http/Requests/AdminStaffRequest.php](source-code/pizza-crm/app/Http/Requests/AdminStaffRequest.php.md) — 25 سطر. الrole فقط staff/admin. الموظف محتاج فرع؛ الباسورد مطلوبة للإنشاء واختيارية للتعديل. uniqueness الإيميل تستثني المستخدم الحالي وقت التعديل.

- [app/Http/Requests/StoreOrderRequest.php](source-code/pizza-crm/app/Http/Requests/StoreOrderRequest.php.md) — 69 سطر. FormRequest تحدد shape الطلب وقواعد الحقول وتراجع ميعاد pickup. authorize=true لأن الضيف مسموح؛ الأسعار مش موثوق فيها من المتصفح ومش ضمن validated payload. فحص ساعات الفرع مش مضمون حاليًا: opens_at/closes_at غير موجودين في schema المقروءة، الموجود opening_hours نص.

- [app/Http/Requests/UpdateOrderStatusRequest.php](source-code/pizza-crm/app/Http/Requests/UpdateOrderStatusRequest.php.md) — 25 سطر. يتأكد إن status/expected_status أسماء ضمن القائمة، ويطلب reason للإلغاء والرفض. صحة الانتقال من الحالة القديمة للجديدة مش هنا؛ داخل StaffOrderController بعد قفل الصف.

- [app/Models/AdminAuditLog.php](source-code/pizza-crm/app/Models/AdminAuditLog.php.md) — 21 سطر. details تتحول array تلقائيًا من JSON وcreated_at datetime؛ timestamps=false لعدم وجود updated_at. يخزن مرجع النوع والid للعنصر المعدل بدل علاقات منفصلة لكل نوع.

- [app/Models/AppSetting.php](source-code/pizza-crm/app/Models/AppSetting.php.md) — 16 سطر. يخزن الإعدادات كنصوص. valueFor تقرأ مفتاحًا أو default لو القيمة null أو السجل غير موجود؛ الصفر أو النص الفاضي مش بيتبدلوا بسبب ?? لو مش null.

- [app/Models/Branch.php](source-code/pizza-crm/app/Models/Branch.php.md) — 48 سطر. يخزن العنوان والهاتف ورسوم وإتاحة التوصيل. menuItems many-to-many وفي الـ pivot سعر وإتاحة كل صنف بالفرع. staff() اسم علاقة فقط؛ هي hasMany لكل users اللي branch_id بتاعهم الفرع، مش role filter داخل الدالة.

- [app/Models/Category.php](source-code/pizza-crm/app/Models/Category.php.md) — 29 سطر. يخزن الاسم والslug وترتيب العرض والإتاحة. is_active للقسم يشارك في فلترة المنيو وإنشاء الطلب، فمنتج داخل قسم معطّل مش بيتباع من OrderCreator.

- [app/Models/MenuItem.php](source-code/pizza-crm/app/Models/MenuItem.php.md) — 46 سطر. المنتج ليه category واحدة وفروع متعددة، وكل فرع ليه سعر وإتاحة على pivot. is_active تعطيل على مستوى كل الفروع؛ pivot.is_available تعطيل داخل فرع معين.

- [app/Models/Order.php](source-code/pizza-crm/app/Models/Order.php.md) — 96 سطر. يوحد أسماء الحالات وTRANSITIONS. يخفي tracking_token من serialization العادي؛ controllers ترجعه صراحةً في الحالات المطلوبة. total_price decimal:2 غالبًا تتسلسل string للحفاظ على شكل منزلتين، وpickup_time datetime.

- [app/Models/OrderItem.php](source-code/pizza-crm/app/Models/OrderItem.php.md) — 35 سطر. يحفظ menu_item_id وitem_name snapshot والكمية والسعر والملاحظات؛ ربط المنتج الحالي مش بديل حفظ الاسم والسعر وقت الطلب.

- [app/Models/OrderStatusLog.php](source-code/pizza-crm/app/Models/OrderStatusLog.php.md) — 26 سطر. timestamps=false لأن الجدول عنده created_at فقط. يسجل from_status/to_status وسبب التغيير والمستخدم، وقد يكون user_id null لتغيير آلي من الدفع.

- [app/Models/User.php](source-code/pizza-crm/app/Models/User.php.md) — 61 سطر. Eloquent model يرث Authenticatable للدخول. fillable يحدد الحقول القابلة للتعبئة الجماعية، hidden يمنع password/remember_token من JSON، وhashed cast يحوّل الباسورد إلى hash أحادي الاتجاه عند الإسناد؛ مش encryption لها مفتاح لفك النص. hidden مش صلاحية قراءة قاعدة البيانات.

- [app/Providers/AppServiceProvider.php](source-code/pizza-crm/app/Providers/AppServiceProvider.php.md) — 27 سطر. بيربط اسم العقد PaymentGateway بالكلاس StripePaymentGateway. بالتالي Laravel يحقن التنفيذ لما PaymentController يطلب interface، من غير new داخل كل controller.

- [app/Services/AdminAudit.php](source-code/pizza-crm/app/Services/AdminAudit.php.md) — 23 سطر. service واحدة بتكتب admin_audit_logs لكل إجراء. subject ممكن Model موجود له id أو string اسم class لإجراء عام زي settings؛ details metadata مش مكان لحفظ passwords.

- [app/Services/Orders/OrderCreator.php](source-code/pizza-crm/app/Services/Orders/OrderCreator.php.md) — 79 سطر. كلاس service مش route. الكاش والكارت بيستخدموه عشان منكررش منطق الفروع والإتاحة والأسعار. بيحفظ الطلب وبنوده داخل transaction، وياخد السعر من DB مش من سعر جاي من المتصفح. لو أي بند غير متاح العملية كلها تتراجع.

- [app/Services/Payments/StripePaymentGateway.php](source-code/pizza-crm/app/Services/Payments/StripePaymentGateway.php.md) — 28 سطر. هو المكان اللي بيعرف Stripe SDK. المفتاح السري من config، ومش بيرجعه للمتصفح. الواجهة تستقبل client_secret بتاع intent فقط وpublishable key من controller.

- [app/Services/ProductImageService.php](source-code/pizza-crm/app/Services/ProductImageService.php.md) — 46 سطر. service يستخدم PHP GD؛ يقرأ JPEG/PNG/WebP، يحافظ على النسبة والشفافية، يصغّر العرض لحد 800 بدون تكبير الصور الصغيرة، ويكتب WebP جودة 82 باسم عشوائي داخل public/images/menu/admin.

- [artisan](source-code/pizza-crm/artisan.md) — 19 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [bootstrap/app.php](source-code/pizza-crm/bootstrap/app.php.md) — 44 سطر. بيحمّل routes وبيعرّف الاسم role للـ RequireRole. بيستثني webhook الدفع فقط من CSRF لأن Stripe مش متصفح عنده session token، وبيعتمد بدل ده على signature داخل PaymentGateway. لو خطأ اتصال قاعدة البيانات معروف، بيرجع JSON أو صفحة 503 مفهومة بدل رسالة SQL الخام.

- [bootstrap/providers.php](source-code/pizza-crm/bootstrap/providers.php.md) — 8 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [composer.json](source-code/pizza-crm/composer.json.md) — 89 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [config/app.php](source-code/pizza-crm/config/app.php.md) — 127 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/auth.php](source-code/pizza-crm/config/auth.php.md) — 118 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/cache.php](source-code/pizza-crm/config/cache.php.md) — 118 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/database.php](source-code/pizza-crm/config/database.php.md) — 185 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/filesystems.php](source-code/pizza-crm/config/filesystems.php.md) — 81 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/logging.php](source-code/pizza-crm/config/logging.php.md) — 133 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/mail.php](source-code/pizza-crm/config/mail.php.md) — 119 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/orders.php](source-code/pizza-crm/config/orders.php.md) — 10 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/queue.php](source-code/pizza-crm/config/queue.php.md) — 130 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/services.php](source-code/pizza-crm/config/services.php.md) — 45 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/session.php](source-code/pizza-crm/config/session.php.md) — 218 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [database/factories/UserFactory.php](source-code/pizza-crm/database/factories/UserFactory.php.md) — 48 سطر. Factory بتولد أسماء وإيميلات fake وpassword hashed وحالة customer نشطة؛ static password cache لتقليل hashing المتكرر داخل process الاختبار. ده مش account production ولا مكان تختار منه باسورد حقيقي.

- [database/migrations/0001_01_01_000000_create_users_table.php](source-code/pizza-crm/database/migrations/0001_01_01_000000_create_users_table.php.md) — 43 سطر. users/password_reset_tokens/sessions؛ الجلسات تخزن login state server-side حسب config. role/branch/is_active تمت إضافتها لاحقًا مش هنا.

- [database/migrations/0001_01_01_000001_create_cache_table.php](source-code/pizza-crm/database/migrations/0001_01_01_000001_create_cache_table.php.md) — 36 سطر. cache/cache_locks infrastructure لو cache driver database؛ وجودها لا يثبت استخدام cache في كل feature.

- [database/migrations/0001_01_01_000002_create_jobs_table.php](source-code/pizza-crm/database/migrations/0001_01_01_000002_create_jobs_table.php.md) — 58 سطر. jobs/job_batches/failed_jobs infrastructure؛ events الحالية ShouldBroadcastNow لا تحتاج queue worker لهذا النوع بالذات، ووجود جدول jobs لا يثبت إن كل request background job.

- [database/migrations/2026_06_14_000001_create_branches_table.php](source-code/pizza-crm/database/migrations/2026_06_14_000001_create_branches_table.php.md) — 22 سطر. المرحلة الأولى فيها id/name/location/timestamps؛ حقول الهاتف والرسوم والإتاحة اتضافت في migrations لاحقة. لازم تقرأ تاريخ migrations مش تفترض إن الملف ده schema النهائية.

- [database/migrations/2026_06_14_000002_create_categories_table.php](source-code/pizza-crm/database/migrations/2026_06_14_000002_create_categories_table.php.md) — 22 سطر. name وslug unique لمنع التكرار؛ display_order/is_active اتضافوا لاحقًا.

- [database/migrations/2026_06_14_000003_create_menu_items_table.php](source-code/pizza-crm/database/migrations/2026_06_14_000003_create_menu_items_table.php.md) — 23 سطر. category_id foreign key مع cascade delete؛ السعر مش هنا لأنه بيتحدد حسب الفرع في pivot.

- [database/migrations/2026_06_14_000004_create_branch_menu_item_table.php](source-code/pizza-crm/database/migrations/2026_06_14_000004_create_branch_menu_item_table.php.md) — 26 سطر. many-to-many pivot فيه branch_id/menu_item_id وprice decimal10,2 وis_available؛ unique المركبة تمنع تكرار نفس المنتج داخل الفرع.

- [database/migrations/2026_06_14_000005_create_orders_table.php](source-code/pizza-crm/database/migrations/2026_06_14_000005_create_orders_table.php.md) — 25 سطر. user_id nullable للضيف مع nullOnDelete؛ branch_id cascadeOnDelete؛ status بدأت enum قديمة ثم تغيرت لاحقًا إلى string. الربط والسلوك مع الحذف مهم قبل أي حذف فرع حقيقي.

- [database/migrations/2026_06_14_000006_create_order_items_table.php](source-code/pizza-crm/database/migrations/2026_06_14_000006_create_order_items_table.php.md) — 24 سطر. order_id وmenu_item_id foreign keys وquantity unsigned وprice وقت البيع؛ الاسم والملاحظات اتضافوا لاحقًا. hard delete منتج حاليًا عليه cascade قد يحذف order_items قديمة؛ تعطيل المنتج safer لكن مش نفس ضمان soft delete schema.

- [database/migrations/2026_09_28_000001_add_commerce_fields.php](source-code/pizza-crm/database/migrations/2026_09_28_000001_add_commerce_fields.php.md) — 53 سطر. يضيف role ومعلومات العميل والدفع وgateway/idempotency keys وreason والملاحظات؛ يحول status إلى string ويترجم pending/confirmed القديمة. تغيير schema مش نفس business validation.

- [database/migrations/2026_09_28_000002_create_order_status_logs_table.php](source-code/pizza-crm/database/migrations/2026_09_28_000002_create_order_status_logs_table.php.md) — 27 سطر. يخزن order_id/user_id/from/to/reason/created_at فقط؛ المستخدم لو اتحذف يبقى null لكن الطلب لو اتحذف سجلاته cascade.

- [database/migrations/2026_10_09_000001_add_catalog_display_fields.php](source-code/pizza-crm/database/migrations/2026_10_09_000001_add_catalog_display_fields.php.md) — 35 سطر. يضيف phone/opening_hours/display_order للفروع وimage_path/tag/display_order للمنتجات؛ opening_hours نص للعرض مش جدول ساعات structured.

- [database/migrations/2026_10_13_000001_add_branch_tracking_and_admin_foundation.php](source-code/pizza-crm/database/migrations/2026_10_13_000001_add_branch_tracking_and_admin_foundation.php.md) — 95 سطر. يضيف رسوم وإتاحة الفرع وفرع/نشاط المستخدم وactivity الكتالوج وtracking token وitem_name snapshot؛ يعمل backfill للبيانات القديمة ثم ينشئ audit/settings ويملأ defaults. دي schema+data migration وليست مجرد create table.

- [database/seeders/DatabaseSeeder.php](source-code/pizza-crm/database/seeders/DatabaseSeeder.php.md) — 18 سطر. ينادي MenuCatalogSeeder قبل StaffUserSeeder قبل DemoOrderSeeder عشان الفروع والمنتجات موجودين قبل الموظفين والطلبات. الأمر db:seed بيكتب قاعدة البيانات فعليًا، مش جزء من قراءة المذكرات.

- [database/seeders/DemoOrderSeeder.php](source-code/pizza-crm/database/seeders/DemoOrderSeeder.php.md) — 109 سطر. يسجل أمثلة حالات مختلفة بمفاتيح demo-order-index؛ يعيد بناء بنود وسجل كل طلب demo مطابق للمفتاح. مش آمن تفترض إن db:seed لا يغير الطلبات القديمة: هو بيغيّر صفوف demo المقصودة. الأسعار من pivot لكن رسوم seeder من config بخلاف خدمة الطلب الحقيقية التي تستخدم الفرع.

- [database/seeders/MenuCatalogSeeder.php](source-code/pizza-crm/database/seeders/MenuCatalogSeeder.php.md) — 105 سطر. upsert للفروع الثلاثة والأقسام السبعة والمنتجات وpivot لكل فرع. المنتجات أسعارها في tuples داخل seeder ثم تتحول لbranch_menu_item rows؛ metadata اسم/صورة/tag تحفظ في menu_items. لا تختزل الملف إلى foreach وتتجاهل آخر upsert.

- [database/seeders/StaffUserSeeder.php](source-code/pizza-crm/database/seeders/StaffUserSeeder.php.md) — 48 سطر. يتوقف مع warning لو passwords غير مهيأة، ويعمل حساب staff لكل فرع نشط ثم admin بلا فرع. يقرأ أسماء env variables فقط؛ المذكرات لا يجب أن تنسخ قيم الأسرار من .env.

- [demo/index.html](source-code/pizza-crm/demo/index.html.md) — 15 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [package.json](source-code/pizza-crm/package.json.md) — 33 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [phpunit.xml](source-code/pizza-crm/phpunit.xml.md) — 37 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [public/index.php](source-code/pizza-crm/public/index.php.md) — 21 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [resources/css/app.css](source-code/pizza-crm/resources/css/app.css.md) — 1271 سطر. ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

- [resources/css/hero-slider.css](source-code/pizza-crm/resources/css/hero-slider.css.md) — 411 سطر. ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

- [resources/js/app.js](source-code/pizza-crm/resources/js/app.js.md) — 2 سطر. بيستورد bootstrap فقط؛ vite.config.js الحالي بيشير إلى app.jsx، فمتفترضش إن ده هو اللي بيرسم React.

- [resources/js/app.jsx](source-code/pizza-crm/resources/js/app.jsx.md) — 102 سطر. ده المدخل اللي vite.config.js بيبنيه فعلًا. بيعمل React root، يركّب Auth/Catalog/Order providers ويختار الصفحة من URL. نسخة الديمو بتغيّر شاشة الدخول لمستخدمين تجريبيين؛ ملف app.js الصغير مش المدخل الحالي.

- [resources/js/bootstrap.js](source-code/pizza-crm/resources/js/bootstrap.js.md) — 5 سطر. يسجّل DOMContentLoaded ويضيف app-ready على body؛ ده مش Bootstrap CSS framework ولا مكان تشغيل React.

- [resources/js/Components/BrandLogo.jsx](source-code/pizza-crm/resources/js/Components/BrandLogo.jsx.md) — 16 سطر. يرسم Link وصورة اللوجو، لكن Navbar الحالي كاتب صورته مباشرة؛ البحث عن imports لم يظهر استخدامًا لهذا المكوّن في resources.

- [resources/js/Components/CartDrawer.jsx](source-code/pizza-crm/resources/js/Components/CartDrawer.jsx.md) — 150 سطر. Offcanvas بيستقبل السلة ودوال تعديلها كـ props؛ app.jsx الحالي بيستخدم Pages/Cart.jsx ومفيش import لـ CartDrawer. الكود يسمح dine_in لكن الطلب الحالي delivery/pickup؛ ما تعتبرهوش أحدث checkout.

- [resources/js/Components/DemoBar.jsx](source-code/pizza-crm/resources/js/Components/DemoBar.jsx.md) — 26 سطر. بيتعمله lazy import فقط لما VITE_DEMO_MODE=true. حسابات بلا كلمة مرور للديمو مش نظام مصادقة إنتاجي، والـ reset يمسح مفاتيح الديمو المعروفة فقط.

- [resources/js/Components/Footer.jsx](source-code/pizza-crm/resources/js/Components/Footer.jsx.md) — 35 سطر. يعرض loading/error ثم خريطة الفروع وساعاتها وهواتفها، ويحوّل الهاتف إلى tel بعد إزالة المسافات. روابط السوشيال / حاليًا placeholders وليست روابط فعلية.

- [resources/js/Components/Navbar.jsx](source-code/pizza-crm/resources/js/Components/Navbar.jsx.md) — 709 سطر. شريط الموقع الحالي؛ يظهر حسب جاهزية فيديو Home، يدعم قائمة موبايل وModal عنوان التوصيل وأزرار الحساب حسب role. عدّاد السلة متزامن مع custom event ومع storage من التبويبات الأخرى.

- [resources/js/context/AuthContext.jsx](source-code/pizza-crm/resources/js/context/AuthContext.jsx.md) — 79 سطر. يوفر user وحالة فحص الجلسة ودوال login/register/logout لكل الصفحات. يطلب /api/auth/me أول التركيب. رقم authRequestVersion يمنع استجابة فحص قديمة من الكتابة فوق تسجيل دخول أحدث.

- [resources/js/context/CatalogContext.jsx](source-code/pizza-crm/resources/js/context/CatalogContext.jsx.md) — 48 سطر. يطلب /api/menu ويوفر branches/categories/items مع loading/error/reload. Navbar/Footer/Menu/Cart/Home بياخدوا نفس الكتالوج بدل عمل API منفصل لكل مكوّن.

- [resources/js/context/OrderContext.jsx](source-code/pizza-crm/resources/js/context/OrderContext.jsx.md) — 132 سطر. يمسك delivery/pickup والفرع والعنوان ويخزن التفضيلات. عند تغيير فرع والسلة مرتبطة بفرع آخر يستأذن، يعيد تسعير المنتجات ويزيل غير المتاح ويصدر حدث تحديث السلة.

- [resources/js/demo/api.js](source-code/pizza-crm/resources/js/demo/api.js.md) — 235 سطر. يقلّد endpoints مستخدمة في الواجهة بدون Laravel/شبكة، ويخزن catalog/orders/users محليًا. role checks هنا لتوضيح الديمو وليست حماية أمنية لأن الزائر يتحكم في المتصفح. Payments/upload الحقيقي معطلان صراحة.

- [resources/js/demo/catalog.json](source-code/pizza-crm/resources/js/demo/catalog.json.md) — 1427 سطر. JSON ثابت يتم استيراده لإنشاء نسخة بيانات محلية أول مرة. branch_options تحفظ سعر وتوفر المنتج لكل فرع. تغييره لا يغيّر نسخة سبق حفظها قبل reset؛ ليس قاعدة بيانات السيرفر.

- [resources/js/lib/api.js](source-code/pizza-crm/resources/js/lib/api.js.md) — 47 سطر. دالة المشروع اللي الواجهات بتناديها بدل fetch المباشر. تضيف headers وCSRF وcookies، تفك JSON، وتحوّل HTTP errors إلى exceptions. في VITE_DEMO_MODE بتفوض demoFetch بدل أي اتصال Laravel.

- [resources/js/Pages/Admin/AdminDashboard.jsx](source-code/pizza-crm/resources/js/Pages/Admin/AdminDashboard.jsx.md) — 13 سطر. يطلب /api/admin/dashboard ويعرض sales/orders/average والمبيعات حسب الفرع والأكثر مبيعًا والحالات. maxBranch يمنع قسمة على صفر في عرض أعمدة الرسم.

- [resources/js/Pages/Admin/AdminLayout.jsx](source-code/pizza-crm/resources/js/Pages/Admin/AdminLayout.jsx.md) — 32 سطر. يفحص user.role للعرض، يرسم NavLink sidebar وOutlet مكان صفحة الأدمن الفرعية. الحماية الحقيقية لكل /api/admin موجودة بالـ middleware كمان.

- [resources/js/Pages/Admin/AdminPanel.jsx](source-code/pizza-crm/resources/js/Pages/Admin/AdminPanel.jsx.md) — 86 سطر. ملف كبير يجمع مكوّنًا لكل section ويمرر callbacks بعد الحفظ لإعادة التحميل. أسماء load/save مكررة داخل scopes مختلفة؛ لازم تعرف مكوّن الدالة قبل تتبعها. الملف مضغوط في سطور طويلة في المصدر، والشرح لا يختصر وجود باقي الفروع.

- [resources/js/Pages/Auth/Login.jsx](source-code/pizza-crm/resources/js/Pages/Auth/Login.jsx.md) — 98 سطر. Controlled inputs تحفظ email/password/remember. الإرسال لا يعيد تحميل الصفحة، يمرر form إلى AuthContext.login ويوجّه حسب role. build الديمو يستبدل الشاشة بـ DemoAccounts.

- [resources/js/Pages/Auth/Register.jsx](source-code/pizza-crm/resources/js/Pages/Auth/Register.jsx.md) — 110 سطر. يجمع name/email/password/password_confirmation في form ويستدعي register من AuthContext ثم /menu. لا يوجد حفظ لكلمة المرور في localStorage في هذا المكوّن.

- [resources/js/Pages/Cart.jsx](source-code/pizza-crm/resources/js/Pages/Cart.jsx.md) — 202 سطر. تزامن السلة من localStorage؛ تراجع العناصر ضد catalog، تحسب subtotal ورسوم الفرع، تبني payload بالـ IDs والكميات لا أسعار العميل. كاش ينشئ order، وكارت يمرّ بـ Stripe. نجاح طلب الكارت في الواجهة لا يغني عن webhook السيرفر.

- [resources/js/Pages/HeroLanding.jsx](source-code/pizza-crm/resources/js/Pages/HeroLanding.jsx.md) — 187 سطر. موجود للتصميم السابق: variants للنص وعناصر toppings بسبرنج. لا import له في شجرة app.jsx الحالية؛ لا تخلط بينه وبين HeroSection داخل Home.

- [resources/js/Pages/HeroSlider.jsx](source-code/pizza-crm/resources/js/Pages/HeroSlider.jsx.md) — 164 سطر. يسجل interval كل 6500ms ويتوقف عند hover؛ له أزرار previous/next/dots. الملف غير مستورد حاليًا، فدراسة كوده لا تعني أن الصفحة الحالية تستخدمه.

- [resources/js/Pages/Home.jsx](source-code/pizza-crm/resources/js/Pages/Home.jsx.md) — 1101 سطر. الفيديو الحالي داخل HeroSection هنا، مش HeroSlider/HeroLanding. Home يعرض featured pizzas من الكتالوج الحقيقي ويضيفها للسلة؛ النص والشريط يظهران بعد 1.2 ثانية من زمن الفيديو مع fallback عند play failure.

- [resources/js/Pages/MenuPage.jsx](source-code/pizza-crm/resources/js/Pages/MenuPage.jsx.md) — 134 سطر. يقرأ catalog/order contexts؛ يعرض الفرع ثم الفئات والمنتجات المتاحة بسعر الفرع. الإضافة تكتب السلة المحلية وتصدر حدثًا لتحديث العداد؛ لا تنشئ order في قاعدة البيانات.

- [resources/js/Pages/MyOrders.jsx](source-code/pizza-crm/resources/js/Pages/MyOrders.jsx.md) — 42 سطر. يجلب تاريخ المستخدم المسجل. Reorder لا ينسخ السعر القديم حرفيًا؛ API يرجع cart_items الحالية ثم الواجهة تملأ السلة وتنتقل إليها.

- [resources/js/Pages/OrderTracking.jsx](source-code/pizza-crm/resources/js/Pages/OrderTracking.jsx.md) — 78 سطر. يقرأ token من route ويجلب الطلب ثم polling. يشتق الخطوات حسب delivery/pickup؛ يحوّل accepted بصريًا إلى preparing، ويعرض سبب الإغلاق بدل التايملاين للملغي والمرفوض.

- [resources/js/Pages/SpecialsSection.jsx](source-code/pizza-crm/resources/js/Pages/SpecialsSection.jsx.md) — 77 سطر. قائمة static غير مربوطة بالكتالوج الحالي ولا مستوردة. زر Quick Add هنا ملوش onClick، فمش بيضيف فعلًا للسلة؛ الإضافة النشطة موجودة MenuPage/Home.

- [resources/js/Pages/StaffDashboard.jsx](source-code/pizza-crm/resources/js/Pages/StaffDashboard.jsx.md) — 316 سطر. واجهة staff/admin تعرض Kanban للطلبات في التاريخ والفرع المختارين، تحديث API كل 7 ثوانٍ وساعة محلية كل ثانية. Role check في الواجهة للتجربة؛ الحماية الفعلية موجودة middleware/controllers في Laravel.

- [resources/views/app.blade.php](source-code/pizza-crm/resources/views/app.blade.php.md) — 16 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [resources/views/errors/database.blade.php](source-code/pizza-crm/resources/views/errors/database.blade.php.md) — 34 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [resources/views/welcome.blade.php](source-code/pizza-crm/resources/views/welcome.blade.php.md) — 278 سطر. صفحة Laravel starter الأصلية غير المستخدمة في routes الحالية؛ موجودة كمرجع مصدر، مش واجهة المنتج النشطة ولا مطلوب تحفظ CSS المولّد فيها.

- [routes/channels.php](source-code/pizza-crm/routes/channels.php.md) — 9 سطر. admin channel للإدمن النشط فقط، وفرع channel للإدمن النشط أو موظف نشط صاحب نفس branchId. دي authorization للاشتراك مش نفس تعريف event ولا مجرد إخفاء عنصر UI.

- [routes/console.php](source-code/pizza-crm/routes/console.php.md) — 9 سطر. يسجل أمر CLI يطبع اقتباس؛ مش route HTTP ومش جزء من تشغيل الطلبات.

- [routes/web.php](source-code/pizza-crm/routes/web.php.md) — 64 سطر. ده جدول التوصيل الحقيقي: عنوان زي POST /api/orders يروح لـ OrderController.store. كل المسارات هنا تحت web middleware؛ كلمة api في prefix مش معناها إن Laravel حوّلها تلقائيًا لـ stateless API. آخر route بيرجع Blade لتطبيق React بشرط المسار ما يبدأش api.

- [sales/index.html](source-code/pizza-crm/sales/index.html.md) — 15 سطر. ملف عرض/تقديم تجاري مساعد للمشروع؛ مش مسار المتجر الأساسي ولا API إنتاج.

- [sales/presentation.html](source-code/pizza-crm/sales/presentation.html.md) — 26 سطر. ملف عرض/تقديم تجاري مساعد للمشروع؛ مش مسار المتجر الأساسي ولا API إنتاج.

- [sales/render-video.mjs](source-code/pizza-crm/sales/render-video.mjs.md) — 54 سطر. ملف عرض/تقديم تجاري مساعد للمشروع؛ مش مسار المتجر الأساسي ولا API إنتاج.

- [sales/styles.css](source-code/pizza-crm/sales/styles.css.md) — 2 سطر. ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

- [scripts/export-demo-catalog.php](source-code/pizza-crm/scripts/export-demo-catalog.php.md) — 15 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [scripts/package-demo.mjs](source-code/pizza-crm/scripts/package-demo.mjs.md) — 30 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [tests/demo/orders.test.mjs](source-code/pizza-crm/tests/demo/orders.test.mjs.md) — 62 سطر. اختبار أو تجهيز بيئة اختبار. assertions تثبت سيناريو محدد؛ لا تعتبر نجاح اختبار واحد إثباتًا لكل المشروع.

- [tests/Feature/ExampleTest.php](source-code/pizza-crm/tests/Feature/ExampleTest.php.md) — 20 سطر. GET / ويراجع HTTP200 فقط؛ ده مش اختبار تنفيذ React داخل browser.

- [tests/Feature/MenuApiTest.php](source-code/pizza-crm/tests/Feature/MenuApiTest.php.md) — 59 سطر. تتحقق إن GET /api/menu بيرجع الفروع والأصناف وbranch prices والترتيب المتوقع من seeder؛ دي expectations ثابتة من fixtures مش تقرير عن DB المستخدم الحالية.

- [tests/Feature/OrderOperationsTest.php](source-code/pizza-crm/tests/Feature/OrderOperationsTest.php.md) — 259 سطر. Feature tests بقاعدة اختبار RefreshDatabase وcatalogue seed وevents fake. لا نشغّلها على DB الشغل بلا تحقق من test config. fake gateway يثبت منطق webhook وليس اتصال Stripe الحقيقي أو سلامة SDK signature.

- [tests/TestCase.php](source-code/pizza-crm/tests/TestCase.php.md) — 11 سطر. يرث Laravel BaseTestCase من غير تخصيص حاليًا؛ Feature tests بتاخد منه helpers HTTP وDB.

- [tests/Unit/ExampleTest.php](source-code/pizza-crm/tests/Unit/ExampleTest.php.md) — 17 سطر. assertTrue(true) مثال starter فقط؛ لا يثبت feature business logic ولا Laravel request.

- [vite.config.js](source-code/pizza-crm/vite.config.js.md) — 18 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [vite.demo.config.js](source-code/pizza-crm/vite.demo.config.js.md) — 15 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

## autocare-booking

- [app/Http/Controllers/Controller.php](source-code/autocare-booking/app/Http/Controllers/Controller.php.md) — 9 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [app/Models/User.php](source-code/autocare-booking/app/Models/User.php.md) — 50 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [app/Providers/AppServiceProvider.php](source-code/autocare-booking/app/Providers/AppServiceProvider.php.md) — 25 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [artisan](source-code/autocare-booking/artisan.md) — 19 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [bootstrap/app.php](source-code/autocare-booking/bootstrap/app.php.md) — 19 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [bootstrap/providers.php](source-code/autocare-booking/bootstrap/providers.php.md) — 8 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [cloudflare/index.html](source-code/autocare-booking/cloudflare/index.html.md) — 17 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [composer.json](source-code/autocare-booking/composer.json.md) — 87 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [config/app.php](source-code/autocare-booking/config/app.php.md) — 127 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/auth.php](source-code/autocare-booking/config/auth.php.md) — 118 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/cache.php](source-code/autocare-booking/config/cache.php.md) — 118 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/database.php](source-code/autocare-booking/config/database.php.md) — 185 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/filesystems.php](source-code/autocare-booking/config/filesystems.php.md) — 81 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/logging.php](source-code/autocare-booking/config/logging.php.md) — 133 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/mail.php](source-code/autocare-booking/config/mail.php.md) — 119 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/queue.php](source-code/autocare-booking/config/queue.php.md) — 130 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/services.php](source-code/autocare-booking/config/services.php.md) — 39 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [config/session.php](source-code/autocare-booking/config/session.php.md) — 218 سطر. ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

- [database/factories/UserFactory.php](source-code/autocare-booking/database/factories/UserFactory.php.md) — 46 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [database/migrations/0001_01_01_000000_create_users_table.php](source-code/autocare-booking/database/migrations/0001_01_01_000000_create_users_table.php.md) — 50 سطر. Migration / وصف تغييرات هيكل قاعدة البيانات في up/down. قراءة الملف لا تنفّذ migration؛ rollback قد يحذف بيانات، فلا تجرب على قاعدة حقيقية.

- [database/migrations/0001_01_01_000001_create_cache_table.php](source-code/autocare-booking/database/migrations/0001_01_01_000001_create_cache_table.php.md) — 36 سطر. Migration / وصف تغييرات هيكل قاعدة البيانات في up/down. قراءة الملف لا تنفّذ migration؛ rollback قد يحذف بيانات، فلا تجرب على قاعدة حقيقية.

- [database/migrations/0001_01_01_000002_create_jobs_table.php](source-code/autocare-booking/database/migrations/0001_01_01_000002_create_jobs_table.php.md) — 58 سطر. Migration / وصف تغييرات هيكل قاعدة البيانات في up/down. قراءة الملف لا تنفّذ migration؛ rollback قد يحذف بيانات، فلا تجرب على قاعدة حقيقية.

- [database/seeders/DatabaseSeeder.php](source-code/autocare-booking/database/seeders/DatabaseSeeder.php.md) — 26 سطر. Seeder / تجهيز بيانات أولية أو demo حسب الملف. الكود كامل للتعلّم، وليس أمرًا لتشغيله على بيانات عملاء.

- [package.json](source-code/autocare-booking/package.json.md) — 24 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [phpunit.xml](source-code/autocare-booking/phpunit.xml.md) — 37 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [public/index.php](source-code/autocare-booking/public/index.php.md) — 21 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [resources/css/app.css](source-code/autocare-booking/resources/css/app.css.md) — 433 سطر. ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

- [resources/css/product.css](source-code/autocare-booking/resources/css/product.css.md) — 377 سطر. ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

- [resources/js/app.js](source-code/autocare-booking/resources/js/app.js.md) — 13 سطر. ده مش تصميم الصفحة؛ ده السلك اللي بيقرأ الـ URL، يختار الـ component المناسب، ويشبّك Vue بالـ div اللي Laravel رجّعها.

- [resources/js/bootstrap.js](source-code/autocare-booking/resources/js/bootstrap.js.md) — 5 سطر. يستورد Axios ويخليه متاح كـ window.axios ويضيف header يعرّف طلبات JavaScript. الملف ده مش بيبعت request لوحده.

- [resources/js/components/App.vue](source-code/autocare-booking/resources/js/components/App.vue.md) — 564 سطر. App تجمع المكونات وتربط scroll progress بالصور والنصوص، وتعرض الفورم الذي يضيف طلبًا demo للجراج. محليًا Laravel يرجع shell فقط؛ نسخة Pages static لا تشغّل PHP.

- [resources/js/components/AppIcon.vue](source-code/autocare-booking/resources/js/components/AppIcon.vue.md) — 32 سطر. الأب يبعت اسم أيقونة، المكوّن يختار قائمة path من object ويرسمها. لو الاسم مش موجود يستخدم car.

- [resources/js/components/CustomerSupport.vue](source-code/autocare-booking/resources/js/components/CustomerSupport.vue.md) — 52 سطر. تقييمات الديمو وساعات العمل جاية من config. الـ FAQ تستخدم details/summary الأصلية في HTML، مش JavaScript toggle.

- [resources/js/components/GarageDashboard.vue](source-code/autocare-booking/resources/js/components/GarageDashboard.vue.md) — 176 سطر. مكوّن واجهة للديمو مبني على useGarage. فيه forms وdialogs وفلاتر وعمليات حذف/إلغاء محلية؛ مفيش صلاحيات مستخدم ولا backend مصادقة.

- [resources/js/components/StatusBadge.vue](source-code/autocare-booking/resources/js/components/StatusBadge.vue.md) — 14 سطر. تستقبل label/tone/icon بدل الاعتماد على اللون فقط. tone تبني اسم CSS وicon تنتقل إلى AppIcon.

- [resources/js/components/StoryCanvas.vue](source-code/autocare-booking/resources/js/components/StoryCanvas.vue.md) — 308 سطر. الصور pre-extracted WebP وليست video autoplay. المكوّن يستقبل time/effects من App، يحمل manifest ويختار frames خفيفة على الهاتف/3g، ويبلغ الأب ready/failure.

- [resources/js/components/WorkshopSection.vue](source-code/autocare-booking/resources/js/components/WorkshopSection.vue.md) — 62 سطر. قسم عرض: يستورد business ويكرر supportedMakes، ويستخدم AppIcon/StatusBadge. الصور lazy وثابتة؛ مفيش API أو فورم هنا.

- [resources/js/composables/useGarage.js](source-code/autocare-booking/resources/js/composables/useGarage.js.md) — 51 سطر. حالة واحدة خارج useGarage بتتشارك بين مستدعي الـ composable في نفس تشغيل الصفحة. أول التشغيل يقرأ التخزين أو يعمل seed، وdeep watch يحفظ التغييرات.

- [resources/js/config/business.js](source-code/autocare-booking/resources/js/config/business.js.md) — 23 سطر. مصدر مركزي للأسماء والمواعيد والعنوان والتقييمات. التقييمات illustrative وليست تقييمات حقيقية، والإيميل example غير عامل.

- [resources/js/services/garageRepository.js](source-code/autocare-booking/resources/js/services/garageRepository.js.md) — 16 سطر. ده storage adapter للديمو فقط. write مش API وread مش SQL؛ كل البيانات بتفضل على نفس المتصفح ونفس origin.

- [resources/views/app.blade.php](source-code/autocare-booking/resources/views/app.blade.php.md) — 13 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [resources/views/welcome.blade.php](source-code/autocare-booking/resources/views/welcome.blade.php.md) — 278 سطر. صفحة Laravel starter الأصلية غير المستخدمة في routes الحالية؛ موجودة كمرجع مصدر، مش واجهة المنتج النشطة ولا مطلوب تحفظ CSS المولّد فيها.

- [routes/console.php](source-code/autocare-booking/routes/console.php.md) — 9 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [routes/web.php](source-code/autocare-booking/routes/web.php.md) — 7 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [scripts/build-cloudflare.mjs](source-code/autocare-booking/scripts/build-cloudflare.mjs.md) — 63 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [tests/Feature/ExampleTest.php](source-code/autocare-booking/tests/Feature/ExampleTest.php.md) — 20 سطر. اختبار أو تجهيز بيئة اختبار. assertions تثبت سيناريو محدد؛ لا تعتبر نجاح اختبار واحد إثباتًا لكل المشروع.

- [tests/TestCase.php](source-code/autocare-booking/tests/TestCase.php.md) — 11 سطر. اختبار أو تجهيز بيئة اختبار. assertions تثبت سيناريو محدد؛ لا تعتبر نجاح اختبار واحد إثباتًا لكل المشروع.

- [tests/Unit/ExampleTest.php](source-code/autocare-booking/tests/Unit/ExampleTest.php.md) — 17 سطر. اختبار أو تجهيز بيئة اختبار. assertions تثبت سيناريو محدد؛ لا تعتبر نجاح اختبار واحد إثباتًا لكل المشروع.

- [vite.cloudflare.config.js](source-code/autocare-booking/vite.cloudflare.config.js.md) — 17 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [vite.config.js](source-code/autocare-booking/vite.config.js.md) — 13 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

## mo-m-en-portfolio

- [index.html](source-code/mo-m-en-portfolio/index.html.md) — 22 سطر. ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

- [package.json](source-code/mo-m-en-portfolio/package.json.md) — 28 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [postcss.config.js](source-code/mo-m-en-portfolio/postcss.config.js.md) — 7 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [src/App.tsx](source-code/mo-m-en-portfolio/src/App.tsx.md) — 27 سطر. App مجرد composition للأقسام بالترتيب، من غير state أو API. خلفية والoverflow هنا inline style.

- [src/components/AnimatedText.tsx](source-code/mo-m-en-portfolio/src/components/AnimatedText.tsx.md) — 56 سطر. الأب يقسم النص لحروف ويمرر scrollYProgress؛ كل Char تحول جزء من التقدم إلى opacity. الاسم متغير ref هنا مش Vue ref.

- [src/components/ContactButton.tsx](source-code/mo-m-en-portfolio/src/components/ContactButton.tsx.md) — 29 سطر. اسم المكوّن Button لكنه يرندر anchor للتنقل. default href=#projects وlabel=View Projects؛ className اختياري.

- [src/components/FadeIn.tsx](source-code/mo-m-en-portfolio/src/components/FadeIn.tsx.md) — 41 سطر. يستقبل children وإعدادات الحركة ويختار tag ديناميكيًا؛ whileInView يبدأ الحركة عند دخول مجال الرؤية.

- [src/components/LiveProjectButton.tsx](source-code/mo-m-en-portfolio/src/components/LiveProjectButton.tsx.md) — 15 سطر. يعرض button شكل فقط، لا href ولا onClick. غير مستورد في sections الحالية؛ ليس زر live المستخدم في ProjectsSection.

- [src/components/Magnet.tsx](source-code/mo-m-en-portfolio/src/components/Magnet.tsx.md) — 66 سطر. يسجل mousemove، يحسب المسافة من مركز wrapper، ويحرّك inner div فقط قرب العنصر. يحافظ على wrapper كمقياس ثابت فلا يدخل feedback بسبب تحريك العنصر المقاس.

- [src/index.css](source-code/mo-m-en-portfolio/src/index.css.md) — 44 سطر. ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

- [src/main.tsx](source-code/mo-m-en-portfolio/src/main.tsx.md) — 11 سطر. يجد root من HTML ويعمل React root ويرندر App داخل StrictMode. TypeScript ! تأكيد للمترجم، مش حماية runtime.

- [src/sections/AboutSection.tsx](source-code/mo-m-en-portfolio/src/sections/AboutSection.tsx.md) — 91 سطر. يخزن ABOUT_TEXT وصور زخرفية ويستخدم AnimatedText لربط ظهور الحروف بالscroll. الصور alt فاضي لأنها decorative.

- [src/sections/ContactSection.tsx](source-code/mo-m-en-portfolio/src/sections/ContactSection.tsx.md) — 23 سطر. فيه نص فرص عمل وزر View My Work يذهب للمشاريع. لا يوجد إرسال رسالة أو بريد أو form حاليًا؛ النص يقول الروابط ستضاف لاحقًا.

- [src/sections/HeroSection.tsx](source-code/mo-m-en-portfolio/src/sections/HeroSection.tsx.md) — 83 سطر. يعرض NAV_LINKS بmap ويستخدم FadeIn للظهور وMagnet للصورة وContactButton للتنقل. لا backend ولا form هنا.

- [src/sections/MarqueeSection.tsx](source-code/mo-m-en-portfolio/src/sections/MarqueeSection.tsx.md) — 265 سطر. MediaItem union تفرق image/video. lazy load حقيقي بالIntersectionObserver، فيديوهات play عند الظهور وpause خارجه، والصفوف لها نسختان للتكرار البصري.

- [src/sections/ProjectsSection.tsx](source-code/mo-m-en-portfolio/src/sections/ProjectsSection.tsx.md) — 202 سطر. الكروت ثابتة CSS داخل container واحد، وJS يحسب runway للبطاقة الأخيرة. liveUrl optional وغير موجود في البيانات الحالية، فكل Live Project ظاهر غير فعال.

- [src/sections/ServicesSection.tsx](source-code/mo-m-en-portfolio/src/sections/ServicesSection.tsx.md) — 89 سطر. SERVICES array ثابتة، وكل خدمة تدخل FadeIn بتأخير i*.1 وتعرض number/name/description.

- [src/sections/SkillsSection.tsx](source-code/mo-m-en-portfolio/src/sections/SkillsSection.tsx.md) — 64 سطر. map الأولى تعمل card لكل مجموعة، والثانية تعمل li لكل مهارة. delays مشتقة من index.

- [tailwind.config.js](source-code/mo-m-en-portfolio/tailwind.config.js.md) — 17 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [tsconfig.json](source-code/mo-m-en-portfolio/tsconfig.json.md) — 21 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

- [vite.config.ts](source-code/mo-m-en-portfolio/vite.config.ts.md) — 7 سطر. إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.
