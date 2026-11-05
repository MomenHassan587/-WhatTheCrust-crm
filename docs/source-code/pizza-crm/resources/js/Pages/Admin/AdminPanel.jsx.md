# شاشات الإدارة: منتجات وفروع وموظفون وطلبات وإعدادات

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/Admin/AdminPanel.jsx` · 86 سطر.

**وظيفة الملف:** ملف كبير يجمع مكوّنًا لكل section ويمرر callbacks بعد الحفظ لإعادة التحميل. أسماء load/save مكررة داخل scopes مختلفة؛ لازم تعرف مكوّن الدالة قبل تتبعها. الملف مضغوط في سطور طويلة في المصدر، والشرح لا يختصر وجود باقي الفروع.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../resources/js/Pages/Admin/AdminPanel.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../../lib/api.js.md)

- [pizza-crm/resources/js/demo/api.js](../../demo/api.js.md)

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../../../../app/Http/Controllers/Api/AdminController.php.md)

- [pizza-crm/resources/js/app.jsx](../../app.jsx.md)

- [pizza-crm/resources/js/Pages/Admin/AdminLayout.jsx](AdminLayout.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { csrfFetch } from '../../lib/api';
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
async function exportDemoOrders(event) {
    if (!isDemo) return;
    event.preventDefault();
    const { orders } = await csrfFetch('/api/admin/orders');
    const cell = (value) => '"' + String(value ?? '').replaceAll('"', '""') + '"';
    const rows = [['Order', 'Branch', 'Customer', 'Status', 'Total'], ...orders.map((order) => [order.id, order.branch?.name, order.customer_name, order.status, order.total_price])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map(cell).join(',')).join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo-orders.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function ErrorBox({ error }) {
    return error ? <div className="alert alert-danger" role="alert">{error}</div> : null;
}

function ProductForm({ product, categories, branches, onSaved, onCancel }) {
    const [form, setForm] = useState(() => ({
        category_id: product?.category_id || categories[0]?.id || '',
        name: product?.name || '',
        description: product?.description || '',
        tag: product?.tag || '',
        display_order: product?.display_order || 0,
        is_active: product?.is_active ?? true,
        image: null,
        branch_options: branches.map((branch) => {
            const current = product?.branches?.find((item) => item.id === branch.id);
            return { branch_id: branch.id, price: current?.pivot?.price || '', is_available: current?.pivot?.is_available ?? true };
        }),
    }));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const setOption = (index, key, value) => setForm((current) => ({ ...current, branch_options: current.branch_options.map((option, optionIndex) => optionIndex === index ? { ...option, [key]: value } : option) }));
    const save = async (event) => {
        event.preventDefault();
        setBusy(true); setError('');
        const body = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'branch_options') body.append(key, JSON.stringify(value));
            else if (key === 'image' && value) body.append(key, value);
            else if (key !== 'image') body.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
        });
        try {
            await csrfFetch(product ? '/api/admin/products/' + product.id : '/api/admin/products', { method: 'POST', body });
            onSaved();
        } catch (requestError) { setError(requestError.payload?.errors ? Object.values(requestError.payload.errors).flat()[0] : requestError.message); }
        finally { setBusy(false); }
    };
    return <form className="wtc-admin-card p-3 mb-3" onSubmit={save}><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">{product ? 'Edit product' : 'New product'}</h2><button type="button" className="btn btn-sm btn-outline-light" onClick={onCancel}>Close</button></div><ErrorBox error={error}/><div className="row g-3"><label className="col-md-6">Name<input className="wtc-admin-input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required /></label><label className="col-md-3">Category<select className="wtc-admin-input" value={form.category_id} onChange={(e)=>setForm({...form,category_id:e.target.value})}>{categories.map((category)=><option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="col-md-3">Display order<input className="wtc-admin-input" type="number" min="0" value={form.display_order} onChange={(e)=>setForm({...form,display_order:e.target.value})}/></label><label className="col-12">Description<textarea className="wtc-admin-input" rows="3" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} required /></label><label className="col-md-5">Tag<input className="wtc-admin-input" value={form.tag} onChange={(e)=>setForm({...form,tag:e.target.value})}/></label><label className="col-md-5">Photo<input className="wtc-admin-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>setForm({...form,image:e.target.files[0]||null})}/></label><label className="col-md-2 d-flex align-items-end gap-2 pb-2"><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})}/> Active</label></div><h3 className="h6 mt-4">Branch prices and availability</h3><div className="row g-2">{form.branch_options.map((option,index)=><div className="col-md-4" key={option.branch_id}><div className="border border-secondary-subtle p-2"><strong>{branches[index]?.name}</strong><input className="wtc-admin-input my-2" type="number" step=".01" min="0" placeholder="Price" value={option.price} onChange={(e)=>setOption(index,'price',e.target.value)} required/><label className="d-flex gap-2"><input type="checkbox" checked={Boolean(option.is_available)} onChange={(e)=>setOption(index,'is_available',e.target.checked)}/> Available</label></div></div>)}</div><button className="btn btn-red mt-3" disabled={busy}>{busy?'Saving...':'Save product'}</button></form>;
}

function MenuAdmin() {
    const [data,setData]=useState(null),[editing,setEditing]=useState(undefined),[error,setError]=useState(''),[category,setCategory]=useState({name:'',slug:'',display_order:0,is_active:true});
    const load=()=>csrfFetch('/api/admin/catalog').then(setData).catch((e)=>setError(e.message));
    useEffect(()=>{load();},[]);
    const saveCategory=async(e)=>{e.preventDefault();try{await csrfFetch('/api/admin/categories',{method:'POST',body:JSON.stringify(category)});setCategory({name:'',slug:'',display_order:0,is_active:true});load();}catch(x){setError(x.message);}};
    const disable=async(item)=>{if(!window.confirm('Disable '+item.name+'? Existing orders will keep their saved item name and price.'))return;await csrfFetch('/api/admin/products/'+item.id,{method:'DELETE'});load();};
    const soldOut=async(item)=>{const body=new FormData();[['category_id',item.category_id],['name',item.name],['description',item.description],['tag',item.tag||''],['display_order',item.display_order],['is_active',item.is_active?'1':'0'],['branch_options',JSON.stringify(item.branches.map((b)=>({branch_id:b.id,price:b.pivot.price,is_available:false})))]].forEach(([k,v])=>body.append(k,v));await csrfFetch('/api/admin/products/'+item.id,{method:'POST',body});load();};
    if(!data)return <><h1 className="wtc-admin-title">Menu management</h1><ErrorBox error={error}/><p>Loading catalog...</p></>;
    return <><header className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3"><div><p className="eyebrow">Catalog</p><h1 className="wtc-admin-title mb-0">Menu management</h1></div><button className="btn btn-red" onClick={()=>setEditing(null)}>New product</button></header><ErrorBox error={error}/>{editing!==undefined&&<ProductForm key={editing?.id||'new'} product={editing} categories={data.categories} branches={data.branches} onSaved={()=>{setEditing(undefined);load();}} onCancel={()=>setEditing(undefined)}/>}<section className="wtc-admin-card p-3 mb-3"><h2 className="h5">Categories</h2><form className="row g-2" onSubmit={saveCategory}><div className="col-md-4"><input className="wtc-admin-input" placeholder="Category name" value={category.name} onChange={(e)=>setCategory({...category,name:e.target.value,slug:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')})} required/></div><div className="col-md-4"><input className="wtc-admin-input" placeholder="slug" value={category.slug} onChange={(e)=>setCategory({...category,slug:e.target.value})} required/></div><div className="col-md-2"><input className="wtc-admin-input" type="number" min="0" value={category.display_order} onChange={(e)=>setCategory({...category,display_order:e.target.value})}/></div><div className="col-md-2"><button className="btn btn-outline-light w-100 h-100">Add</button></div></form></section><section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Product</th><th>Category</th><th>Photo</th><th>Availability</th><th>Actions</th></tr></thead><tbody>{data.items.map((item)=><tr key={item.id}><td><strong>{item.name}</strong><small className="d-block text-secondary">{item.tag}</small></td><td>{item.category?.name}</td><td>{item.image_path?<img src={item.image_path} alt="" width="72" height="52" style={{objectFit:'cover'}} loading="lazy"/>:<span className="badge text-bg-dark">WTC placeholder</span>}</td><td>{item.is_active?'Active':'Disabled'} · {item.branches.filter((b)=>b.pivot.is_available).length}/{data.branches.length} branches</td><td><div className="d-flex flex-wrap gap-1"><button className="btn btn-sm btn-outline-light" onClick={()=>setEditing(item)}>Edit</button><button className="btn btn-sm btn-outline-warning" onClick={()=>soldOut(item)}>Sold out</button><button className="btn btn-sm btn-outline-danger" onClick={()=>disable(item)}>Disable</button></div></td></tr>)}</tbody></table></section></>;
}

function BranchRow({ branch, onSaved }) {
    const [form,setForm]=useState(branch),[busy,setBusy]=useState(false),[error,setError]=useState('');
    const save=async()=>{setBusy(true);setError('');try{await csrfFetch('/api/admin/branches/'+branch.id,{method:'PUT',body:JSON.stringify(form)});onSaved();}catch(e){setError(e.message);}finally{setBusy(false);}};
    return <section className="wtc-admin-card p-3"><h2 className="h5">{branch.name}</h2><ErrorBox error={error}/><div className="row g-2">{[['name','Name'],['location','Address'],['phone','Phone'],['opening_hours','Opening hours']].map(([key,label])=><label className={key==='location'?'col-12':'col-md-6'} key={key}>{label}<input className="wtc-admin-input" value={form[key]||''} onChange={(e)=>setForm({...form,[key]:e.target.value})}/></label>)}<label className="col-md-4">Delivery fee<input className="wtc-admin-input" type="number" min="0" step=".01" value={form.delivery_fee} onChange={(e)=>setForm({...form,delivery_fee:e.target.value})}/></label><label className="col-md-4">Display order<input className="wtc-admin-input" type="number" min="0" value={form.display_order} onChange={(e)=>setForm({...form,display_order:e.target.value})}/></label><div className="col-md-4 d-flex flex-column justify-content-end gap-2"><label><input type="checkbox" checked={form.delivery_enabled} onChange={(e)=>setForm({...form,delivery_enabled:e.target.checked})}/> Delivery enabled</label><label><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})}/> Active</label></div></div><button className="btn btn-red mt-3" disabled={busy} onClick={save}>Save branch</button></section>;
}

function BranchAdmin(){const[data,setData]=useState(null),[error,setError]=useState('');const load=()=>csrfFetch('/api/admin/branches').then(setData).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);return <><h1 className="wtc-admin-title">Branches</h1><p className="text-secondary">Disable a branch instead of deleting it so old orders remain complete.</p><ErrorBox error={error}/><div className="d-grid gap-3">{data?.branches.map((branch)=><BranchRow key={branch.id} branch={branch} onSaved={load}/>)}</div></>}

function StaffAdmin(){const[data,setData]=useState(null),[branches,setBranches]=useState([]),[form,setForm]=useState({name:'',email:'',role:'staff',branch_id:'',is_active:true,password:'',password_confirmation:''}),[editing,setEditing]=useState(null),[error,setError]=useState('');const load=()=>Promise.all([csrfFetch('/api/admin/staff'),csrfFetch('/api/admin/branches')]).then(([staff,branchData])=>{setData(staff.users);setBranches(branchData.branches);}).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);const select=(u)=>{setEditing(u);setForm({name:u.name,email:u.email,role:u.role,branch_id:u.branch_id||'',is_active:u.is_active,password:'',password_confirmation:''});};const save=async(e)=>{e.preventDefault();try{await csrfFetch(editing?'/api/admin/staff/'+editing.id:'/api/admin/staff',{method:editing?'PUT':'POST',body:JSON.stringify(form)});setEditing(null);setForm({name:'',email:'',role:'staff',branch_id:'',is_active:true,password:'',password_confirmation:''});load();}catch(x){setError(x.payload?.errors?Object.values(x.payload.errors).flat()[0]:x.message);}};return <><h1 className="wtc-admin-title">Staff accounts</h1><ErrorBox error={error}/><form className="wtc-admin-card p-3 mb-3" onSubmit={save}><h2 className="h5">{editing?'Edit account':'Create account'}</h2><div className="row g-2"><label className="col-md-6">Name<input className="wtc-admin-input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required/></label><label className="col-md-6">Email<input className="wtc-admin-input" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required/></label><label className="col-md-4">Role<select className="wtc-admin-input" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value,branch_id:e.target.value==='admin'?'':form.branch_id})}><option value="staff">Staff</option><option value="admin">Admin</option></select></label><label className="col-md-4">Branch<select className="wtc-admin-input" disabled={form.role==='admin'} value={form.branch_id} onChange={(e)=>setForm({...form,branch_id:e.target.value})}><option value="">Select branch</option>{branches.map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label className="col-md-4 d-flex align-items-end gap-2 pb-2"><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})}/> Active</label><label className="col-md-6">{editing?'New password (optional)':'Password'}<input className="wtc-admin-input" type="password" disabled={isDemo} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required={!isDemo&&!editing}/></label><label className="col-md-6">Confirm password<input className="wtc-admin-input" type="password" disabled={isDemo} value={form.password_confirmation} onChange={(e)=>setForm({...form,password_confirmation:e.target.value})} required={!isDemo&&Boolean(form.password)}/></label></div><button className="btn btn-red mt-3">Save account</button>{editing&&<button type="button" className="btn btn-outline-light mt-3 ms-2" onClick={()=>setEditing(null)}>Cancel</button>}</form><section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Name</th><th>Role</th><th>Branch</th><th>Status</th><th></th></tr></thead><tbody>{data?.map((u)=><tr key={u.id}><td>{u.name}<small className="d-block text-secondary">{u.email}</small></td><td>{u.role}</td><td>{u.branch?.name||'All branches'}</td><td>{u.is_active?'Active':'Disabled'}</td><td><button className="btn btn-sm btn-outline-light" onClick={()=>select(u)}>Edit / reset password</button></td></tr>)}</tbody></table></section></>}

function OrdersAdmin(){const[orders,setOrders]=useState([]),[filters,setFilters]=useState({search:'',status:'',payment_status:''}),[selected,setSelected]=useState(null),[error,setError]=useState('');const load=()=>csrfFetch('/api/admin/orders?'+new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)))).then((r)=>setOrders(r.orders)).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);return <><header className="d-flex justify-content-between align-items-end mb-3"><h1 className="wtc-admin-title mb-0">All orders</h1><a className="btn btn-outline-light" href="/api/admin/orders/export" onClick={exportDemoOrders}>Export CSV</a></header><ErrorBox error={error}/><form className="wtc-admin-card p-3 mb-3 row g-2" onSubmit={(e)=>{e.preventDefault();load();}}><div className="col-md-5"><input className="wtc-admin-input" placeholder="Order, customer or phone" value={filters.search} onChange={(e)=>setFilters({...filters,search:e.target.value})}/></div><div className="col-md-3"><select className="wtc-admin-input" value={filters.status} onChange={(e)=>setFilters({...filters,status:e.target.value})}><option value="">All statuses</option>{['new','accepted','preparing','ready','out_for_delivery','picked_up','completed','cancelled','rejected'].map((s)=><option key={s}>{s}</option>)}</select></div><div className="col-md-2"><select className="wtc-admin-input" value={filters.payment_status} onChange={(e)=>setFilters({...filters,payment_status:e.target.value})}><option value="">All payments</option>{['unpaid','pending','paid','failed'].map((s)=><option key={s}>{s}</option>)}</select></div><div className="col-md-2"><button className="btn btn-red w-100 h-100">Filter</button></div></form>{selected&&<section className="wtc-admin-card p-3 mb-3"><button className="btn btn-sm btn-outline-light float-end" onClick={()=>setSelected(null)}>Close</button><h2 className="h5">Order #{selected.id}</h2><p>{selected.customer_name} · {selected.customer_phone} · {selected.branch?.name}</p>{selected.items.map((item)=><div key={item.id}>{item.quantity} × {item.item_name}{item.notes&&<strong className="text-warning"> · {item.notes}</strong>}</div>)}</section>}<section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Branch</th><th>Status</th><th>Payment</th><th>Total</th></tr></thead><tbody>{orders.map((o)=><tr key={o.id} onClick={()=>setSelected(o)} style={{cursor:'pointer'}}><td>#{o.id}<small className="d-block text-secondary">{new Date(o.created_at).toLocaleString()}</small></td><td>{o.customer_name}<small className="d-block">{o.customer_phone}</small></td><td>{o.branch?.name}</td><td>{o.status}</td><td>{o.payment_status}</td><td>EGP {Number(o.total_price).toFixed(2)}</td></tr>)}</tbody></table></section></>}

function CustomersAdmin(){const[data,setData]=useState(null),[error,setError]=useState('');useEffect(()=>{csrfFetch('/api/admin/customers').then((r)=>setData(r.customers)).catch((e)=>setError(e.message));},[]);return <><h1 className="wtc-admin-title">Customers</h1><ErrorBox error={error}/><section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead><tbody>{data?.map((u)=><tr key={u.id}><td>{u.name}<small className="d-block text-secondary">{u.email}</small></td><td>{u.phone||'Not saved'}</td><td>{u.orders_count}</td><td>EGP {Number(u.orders_sum_total_price||0).toFixed(2)}</td><td>{u.orders_max_created_at?new Date(u.orders_max_created_at).toLocaleString():'Never'}</td></tr>)}</tbody></table></section></>}

function SettingsAdmin(){const[form,setForm]=useState(null),[logs,setLogs]=useState([]),[message,setMessage]=useState(''),[error,setError]=useState('');const load=()=>Promise.all([csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]).then(([s,a])=>{setForm(s.settings);setLogs(a.logs);}).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);const save=async(e)=>{e.preventDefault();try{await csrfFetch('/api/admin/settings',{method:'PUT',body:JSON.stringify(form)});setMessage('Settings saved.');load();}catch(x){setError(x.message);}};return <><h1 className="wtc-admin-title">Settings</h1><ErrorBox error={error}/>{message&&<div className="alert alert-success">{message}</div>}{form&&<form className="wtc-admin-card p-3 mb-3 row g-3" onSubmit={save}>{[['default_delivery_fee','Default delivery fee'],['minimum_pickup_prep_minutes','Minimum prep minutes'],['order_promise_minutes','Order promise minutes']].map(([key,label])=><label className="col-md-4" key={key}>{label}<input className="wtc-admin-input" type="number" min="0" value={form[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})}/></label>)}<div><button className="btn btn-red">Save settings</button></div></form>}<section className="wtc-admin-card wtc-admin-table-wrap"><h2 className="h5 p-3 mb-0">Recent admin activity</h2><table className="wtc-admin-table"><thead><tr><th>When</th><th>Admin</th><th>Action</th><th>Record</th></tr></thead><tbody>{logs.map((log)=><tr key={log.id}><td>{new Date(log.created_at).toLocaleString()}</td><td>{log.user?.name||'System'}</td><td>{log.action}</td><td>{log.subject_type.split('\\').pop()} {log.subject_id||''}</td></tr>)}</tbody></table></section></>}

export default function AdminPanel(){const{section}=useParams();const pages=useMemo(()=>({menu:<MenuAdmin/>,branches:<BranchAdmin/>,staff:<StaffAdmin/>,orders:<OrdersAdmin/>,customers:<CustomersAdmin/>,settings:<SettingsAdmin/>}),[]);return pages[section]||<section><h1>Page not found</h1></section>;}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### exportDemoOrders

في الديمو يمنع رابط CSV الحقيقي ويحوّل بيانات API المحلية إلى Blob CSV ينزله ثم يحرر object URL؛ في live يترك الرابط للسيرفر.

- **بتاخد إيه؟ Inputs:** event click على رابط Export CSV.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### cell

يهرب double quotes بوضع quote مزدوجة ويلف قيمة CSV بين علامات اقتباس؛ لا تعامله كحماية كاملة من spreadsheet formula injection.

- **بتاخد إيه؟ Inputs:** value.

- **بترجع/بتغيّر إيه؟ Return / effect:** CSV cell string.

### ErrorBox

يرسم alert لو error غير فاضي وإلا null.

- **بتاخد إيه؟ Inputs:** {error}.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX أو null.

### ProductForm

ينشئ state من product/categories/branches ويمسك صورة وأسعار/توافر كل فرع ويرسل FormData.

- **بتاخد إيه؟ Inputs:** product,categories,branches,onSaved,onCancel.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX form.

### setOption

يعدّل property واحدة في branch_options[index] بنسخ array/object بدل mutation.

- **بتاخد إيه؟ Inputs:** index,key,value.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### ProductForm.save

يمنع submit، يبني FormData من form ويحوّل branch_options إلى JSON والـ booleans إلى 1/0 ثم POST create/update وينادي onSaved.

- **بتاخد إيه؟ Inputs:** event.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### MenuAdmin

يحمل catalog الإداري؛ يدير new/edit/disable/soldOut وform الفئات.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### saveCategory

POST للفئة الحالية ثم تصفير form وإعادة تحميل catalog؛ يمنع reload الافتراضي.

- **بتاخد إيه؟ Inputs:** e: submit event.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### disable

يستأذن بـ confirm ثم DELETE للمنتج (تعطيل منطقي حسب backend) وإعادة تحميل؛ لا يوجد catch محلي هنا.

- **بتاخد إيه؟ Inputs:** item.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### soldOut

يرسل بيانات المنتج بـ FormData مع is_available=false لكل branch option ثم reload؛ مش حذف للمنتج.

- **بتاخد إيه؟ Inputs:** item.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### BranchRow

صف قابل للتحرير لفرع، يمسك form/busy/error مستقل لكل فرع.

- **بتاخد إيه؟ Inputs:** branch,onSaved.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### BranchRow.save

PUT لبيانات الفرع ثم onSaved لإعادة التحميل وإعادة busy في finally.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### BranchAdmin

يحمل /api/admin/branches ويرسم BranchRow لكل فرع.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### StaffAdmin

يحمل الموظفين والفروع بالتوازي ويعرض create/edit account؛ passwords معطلة في build الديمو.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### select

ينسخ بيانات الموظف المحدد إلى form ويترك password fields فاضية.

- **بتاخد إيه؟ Inputs:** u: user object.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### StaffAdmin.save

POST إنشاء أو PUT تعديل موظف حسب editing ثم يعيد form فارغًا ويعيد load؛ يعرض أول validation error.

- **بتاخد إيه؟ Inputs:** e submit event.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### OrdersAdmin

يعرض كل الطلبات بفلاتر بحث/حالة/دفع وتفاصيل الطلب المحدد وCSV.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### CustomersAdmin

يحمل ملخص العملاء وعدد الطلبات والمصروف وآخر طلب.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### SettingsAdmin

يحمل settings/audit معًا ويعرض form للإعدادات وجدول آخر الأنشطة.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### SettingsAdmin.save

PUT للإعدادات ثم رسالة نجاح وإعادة تحميل settings/audit.

- **بتاخد إيه؟ Inputs:** e submit event.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### load

اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة.

- **بتاخد إيه؟ Inputs:** لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise لطلب/طلبات csrfFetch ثم تحديث state.

### save

اسم handler محلي متكرر داخل ProductForm/BranchRow/StaffAdmin/SettingsAdmin؛ شوف مفاتيح Component.save هنا لتحديد payload/endpoint الصحيح. مش function واحدة مشتركة.

- **بتاخد إيه؟ Inputs:** event في forms؛ BranchRow.save لا يحتاج event.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>؛ تأثيره API ثم callback/reload.

### AdminPanel

يقرأ section من URL ويختار مكوّنًا من dictionary، أو يعرض Page not found.

- **بتاخد إيه؟ Inputs:** section من useParams.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX page من pages[section].

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### event.preventDefault

- **جاية منين؟** Browser Event

- **وظيفتها:** تمنع السلوك الافتراضي لحدث قابل للإلغاء.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف propagation تلقائيًا.

- **أول موضع هنا:** السطر 41.

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `'/api/admin/settings'`، `{method:'PUT',body:JSON.stringify(form)}`.

- **تكملة التعريف:** [resources/js/lib/api.js](../../lib/api.js.md)، عند السطر 3.

### String(value ?? '').replaceAll

- **جاية منين؟** String

- **وظيفتها:** تستبدل كل التطابقات بنص جديد.

- **المدخلات — Arguments:** search وreplacement.

- **الناتج/الأثر — Return / effect:** string جديدة؛ لا تعدّل الأصل.

- **أول موضع هنا:** السطر 9، والمدخلات المكتوبة: `'"'`، `'""'`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 9، والمدخلات المكتوبة: `value ?? ''`.

### orders.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `(o)=><tr key={o.id} onClick={()=>setSelected(o)} style={{cursor:'pointer'}}><td>#{o.id}<small className="d-block text-secondary">{new Date(o.created_at).toLocaleString()}</small></…`.

### URL.createObjectURL

- **جاية منين؟** Browser URL

- **وظيفتها:** يعمل blob: URL مؤقت لبيانات موجودة؛ لا يرفعها على سيرفر.

- **المدخلات — Arguments:** Blob

- **الناتج/الأثر — Return / effect:** string URL

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `new Blob([rows.map((row) => row.map(cell).join(',')).join('\n')], { type: 'text/csv' })`.

- **مثال:** const url = URL.createObjectURL(blob);

### Blob

- **جاية منين؟** Web API

- **وظيفتها:** تنشئ بيانات ملف ثنائية في الذاكرة.

- **المدخلات — Arguments:** parts وtype/options.

- **الناتج/الأثر — Return / effect:** Blob؛ تنزيلها يحتاج URL/عرض مناسب.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `[rows.map((row) => row.map(cell).join(',')).join('\n')]`، `{ type: 'text/csv' }`.

### rows.map((row) => row.map(cell).join(',')).join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `'\n'`.

### rows.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `(row) => row.map(cell).join(',')`.

### row.map(cell).join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `','`.

### row.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `cell`.

### document.createElement

- **جاية منين؟** DOM Document

- **وظيفتها:** تنشئ عنصر DOM في الذاكرة.

- **المدخلات — Arguments:** tagName.

- **الناتج/الأثر — Return / effect:** Element؛ لا يظهر قبل إضافته للـDOM.

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `'a'`.

### link.click

- **جاية منين؟** DOM Element

- **وظيفتها:** تطلب تفعيل حدث click برمجيًا.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** undefined؛ تنزيل الملف يعتمد على خصائص الرابط.

- **أول موضع هنا:** السطر 15.

### URL.revokeObjectURL

- **جاية منين؟** Browser URL

- **وظيفتها:** يفك ربط blob URL بعد الانتهاء لتقليل احتفاظ الموارد.

- **المدخلات — Arguments:** blob URL

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `url`.

- **مثال:** image.onload = () => { URL.revokeObjectURL(url); resolve(image); };

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `''`.

- **مثال:** const [failed, setFailed] = useState(false);

### branches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `(b)=><option key={b.id} value={b.id}>{b.name}</option>`.

### product?.branches?.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 33، والمدخلات المكتوبة: `(item) => item.id === branch.id`.

### setForm

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `{...form,[key]:e.target.value}`.

### current.branch_options.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 39، والمدخلات المكتوبة: `(option, optionIndex) => optionIndex === index ? { ...option, [key]: value } : option`.

### setBusy

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBusy هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 71، والمدخلات المكتوبة: `false`.

### setError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `x.message`.

### FormData

- **جاية منين؟** Web API

- **وظيفتها:** تنشئ حاوية multipart للحقول والملفات.

- **المدخلات — Arguments:** form element اختيارية.

- **الناتج/الأثر — Return / effect:** FormData object، مش JSON string.

- **أول موضع هنا:** السطر 64.

### Object.entries(form).forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `([key, value]) => {             if (key === 'branch_options') body.append(key, JSON.stringify(value));             else if (key === 'image' && value) body.append(key, value);      …`.

### Object.entries

- **جاية منين؟** JavaScript Object

- **وظيفتها:** يحوّل الخصائص الذاتية القابلة للتعداد لأزواج [key,value]؛ مفيد لبناء FormData وفلاتر URL.

- **المدخلات — Arguments:** object.

- **الناتج/الأثر — Return / effect:** array أزواج.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `filters`.

- **مثال:** Object.entries(form).forEach(([key, value]) => { /* append */ });

### body.append

- **جاية منين؟** Browser FormData/URLSearchParams

- **وظيفتها:** في FormData يضيف حقلًا ويقبل File/Blob أو نص؛ تكرار المفتاح يضيف قيمة أخرى مش يستبدل السابقة.

- **المدخلات — Arguments:** name,value وfilename اختياري للملفات.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `k`، `v`.

- **مثال:** body.append('branch_options', JSON.stringify(value));

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `form`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### onSaved

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onSaved؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** بدون arguments مباشرة هنا.

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 71.

### Object.values(requestError.payload.errors).flat

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفرد مستويات arrays حسب العمق.

- **المدخلات — Arguments:** depth اختياري افتراضيه1.

- **الناتج/الأثر — Return / effect:** array جديدة.

- **أول موضع هنا:** السطر 52.

### Object.values

- **جاية منين؟** JavaScript Object

- **وظيفتها:** يرجع قيم خصائص object بدون مفاتيح؛ مستخدم لاستخراج validation messages.

- **المدخلات — Arguments:** object.

- **الناتج/الأثر — Return / effect:** array قيم.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `x.payload.errors`.

- **مثال:** Object.values(error.payload.errors).flat()[0];

### categories.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 55، والمدخلات المكتوبة: `(category)=><option key={category.id} value={category.id}>{category.name}</option>`.

### form.branch_options.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 55، والمدخلات المكتوبة: `(option,index)=><div className="col-md-4" key={option.branch_id}><div className="border border-secondary-subtle p-2"><strong>{branches[index]?.name}</strong><input className="wtc-a…`.

### setOption

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يعدّل property واحدة في branch_options[index] بنسخ array/object بدل mutation.

- **المدخلات — Arguments:** index,key,value.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 55، والمدخلات المكتوبة: `index`، `'is_available'`، `e.target.checked`.

### Boolean

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى true/false حسب truthiness.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** Boolean؛ النص false غير الفاضي يساوي true.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `form.password`.

### csrfFetch('/api/admin/catalog').then(setData).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `(e)=>setError(e.message)`.

### csrfFetch('/api/admin/catalog').then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `setData`.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `()=>{load();}`، `[]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### load

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة.

- **المدخلات — Arguments:** لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله.

- **الناتج/الأثر — Return / effect:** Promise لطلب/طلبات csrfFetch ثم تحديث state.

- **أول موضع هنا:** السطر 83.

### e.preventDefault

- **جاية منين؟** Browser Event

- **وظيفتها:** تمنع السلوك الافتراضي لحدث قابل للإلغاء.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف propagation تلقائيًا.

- **أول موضع هنا:** السطر 83.

### setCategory

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setCategory هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `{...category,display_order:e.target.value}`.

### window.confirm

- **جاية منين؟** Browser

- **وظيفتها:** تطلب تأكيدًا بسيطًا من المستخدم.

- **المدخلات — Arguments:** نص السؤال.

- **الناتج/الأثر — Return / effect:** Boolean؛ ده قرار واجهة مش authorization.

- **أول موضع هنا:** السطر 63، والمدخلات المكتوبة: `'Disable '+item.name+'? Existing orders will keep their saved item name and price.'`.

### [['category_id',item.category_id],['name',item.name],['description',item.description],['tag',item.tag||''],['display_order',item.display_order],['is_active',item.is_active?'1':'0'],['branch_options',JSON.stringify(item.branches.map((b)=>({branch_id:b.id,price:b.pivot.price,is_available:false})))]].forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `([k,v])=>body.append(k,v)`.

### item.branches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `(b)=>({branch_id:b.id,price:b.pivot.price,is_available:false})`.

### setEditing

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setEditing هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `null`.

### e.target.value.toLowerCase().replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `/[^a-z0-9]+/g`، `'-'`.

### e.target.value.toLowerCase

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تحوّل الحروف لحالتها الصغيرة.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 66.

### data.items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `(item)=><tr key={item.id}><td><strong>{item.name}</strong><small className="d-block text-secondary">{item.tag}</small></td><td>{item.category?.name}</td><td>{item.image_path?<img s…`.

### item.branches.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `(b)=>b.pivot.is_available`.

### soldOut

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يرسل بيانات المنتج بـ FormData مع is_available=false لكل branch option ثم reload؛ مش حذف للمنتج.

- **المدخلات — Arguments:** item.

- **الناتج/الأثر — Return / effect:** Promise<void>.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `item`.

### disable

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يستأذن بـ confirm ثم DELETE للمنتج (تعطيل منطقي حسب backend) وإعادة تحميل؛ لا يوجد catch محلي هنا.

- **المدخلات — Arguments:** item.

- **الناتج/الأثر — Return / effect:** Promise<void>.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `item`.

### [['name','Name'],['location','Address'],['phone','Phone'],['opening_hours','Opening hours']].map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 72، والمدخلات المكتوبة: `([key,label])=><label className={key==='location'?'col-12':'col-md-6'} key={key}>{label}<input className="wtc-admin-input" value={form[key]||''} onChange={(e)=>setForm({...form,[ke…`.

### csrfFetch('/api/admin/branches').then(setData).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 75، والمدخلات المكتوبة: `(e)=>setError(e.message)`.

### csrfFetch('/api/admin/branches').then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 75، والمدخلات المكتوبة: `setData`.

### data?.branches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 75، والمدخلات المكتوبة: `(branch)=><BranchRow key={branch.id} branch={branch} onSaved={load}/>`.

### Promise.all([csrfFetch('/api/admin/staff'),csrfFetch('/api/admin/branches')]).then(([staff,branchData])=>{setData(staff.users);setBranches(branchData.branches);}).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `(e)=>setError(e.message)`.

### Promise.all([csrfFetch('/api/admin/staff'),csrfFetch('/api/admin/branches')]).then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `([staff,branchData])=>{setData(staff.users);setBranches(branchData.branches);}`.

### Promise.all

- **جاية منين؟** JavaScript

- **وظيفتها:** يجمع promises ويحافظ على ترتيب النتائج؛ يرفض عند أول رفض ولا يلغي بقية العمليات تلقائيًا.

- **المدخلات — Arguments:** iterable promises

- **الناتج/الأثر — Return / effect:** Promise<array>

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `[csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]`.

- **مثال:** const [lower,upper] = await Promise.all([decodeFrame(lowerIndex),decodeFrame(upperIndex)]);

### setData

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setData هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 81، والمدخلات المكتوبة: `r.customers`.

### setBranches

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranches هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `branchData.branches`.

### Object.values(x.payload.errors).flat

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفرد مستويات arrays حسب العمق.

- **المدخلات — Arguments:** depth اختياري افتراضيه1.

- **الناتج/الأثر — Return / effect:** array جديدة.

- **أول موضع هنا:** السطر 77.

### data?.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 81، والمدخلات المكتوبة: `(u)=><tr key={u.id}><td>{u.name}<small className="d-block text-secondary">{u.email}</small></td><td>{u.phone||'Not saved'}</td><td>{u.orders_count}</td><td>EGP {Number(u.orders_sum…`.

### select

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** ينسخ بيانات الموظف المحدد إلى form ويترك password fields فاضية.

- **المدخلات — Arguments:** u: user object.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `u`.

### csrfFetch('/api/admin/orders?'+new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)))).then((r)=>setOrders(r.orders)).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `(e)=>setError(e.message)`.

### csrfFetch('/api/admin/orders?'+new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)))).then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `(r)=>setOrders(r.orders)`.

### URLSearchParams

- **جاية منين؟** Browser URL API

- **وظيفتها:** يبني query parameters ويعمل encoding عند إدراجه في URL؛ لا يرسل طلبًا بنفسه.

- **المدخلات — Arguments:** object أو query string أو entries.

- **الناتج/الأثر — Return / effect:** URLSearchParams instance.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `Object.fromEntries(Object.entries(filters).filter(([,v])=>v))`.

- **مثال:** const params = new URLSearchParams({ date });

### Object.fromEntries

- **جاية منين؟** JavaScript Object

- **وظيفتها:** عكس entries: يبني object من أزواج key/value، مثل تحويل entries FormData أو فلاتر غير فاضية.

- **المدخلات — Arguments:** iterable أزواج.

- **الناتج/الأثر — Return / effect:** object.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `Object.entries(filters).filter(([,v])=>v)`.

- **مثال:** Object.fromEntries(Object.entries(filters).filter(([,v]) => v));

### Object.entries(filters).filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `([,v])=>v`.

### setOrders

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `r.orders`.

### setFilters

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setFilters هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `{...filters,payment_status:e.target.value}`.

### ['new','accepted','preparing','ready','out_for_delivery','picked_up','completed','cancelled','rejected'].map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `(s)=><option key={s}>{s}</option>`.

### ['unpaid','pending','paid','failed'].map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `(s)=><option key={s}>{s}</option>`.

### setSelected

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setSelected هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `o`.

### selected.items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `(item)=><div key={item.id}>{item.quantity} × {item.item_name}{item.notes&&<strong className="text-warning"> · {item.notes}</strong>}</div>`.

### new Date(o.created_at).toLocaleString

- **جاية منين؟** Date/Number instance

- **وظيفتها:** تنسّق القيمة للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 79.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `log.created_at`.

### Number(o.total_price).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `2`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 81، والمدخلات المكتوبة: `u.orders_sum_total_price||0`.

- **مثال:** Number(option.price);

### csrfFetch('/api/admin/customers').then((r)=>setData(r.customers)).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 81، والمدخلات المكتوبة: `(e)=>setError(e.message)`.

### csrfFetch('/api/admin/customers').then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 81، والمدخلات المكتوبة: `(r)=>setData(r.customers)`.

### Number(u.orders_sum_total_price||0).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 81، والمدخلات المكتوبة: `2`.

### new Date(u.orders_max_created_at).toLocaleString

- **جاية منين؟** Date/Number instance

- **وظيفتها:** تنسّق القيمة للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 81.

### Promise.all([csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]).then(([s,a])=>{setForm(s.settings);setLogs(a.logs);}).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `(e)=>setError(e.message)`.

### Promise.all([csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]).then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `([s,a])=>{setForm(s.settings);setLogs(a.logs);}`.

### setLogs

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setLogs هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `a.logs`.

### setMessage

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `'Settings saved.'`.

### [['default_delivery_fee','Default delivery fee'],['minimum_pickup_prep_minutes','Minimum prep minutes'],['order_promise_minutes','Order promise minutes']].map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `([key,label])=><label className="col-md-4" key={key}>{label}<input className="wtc-admin-input" type="number" min="0" value={form[key]} onChange={(e)=>setForm({...form,[key]:e.targe…`.

### logs.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `(log)=><tr key={log.id}><td>{new Date(log.created_at).toLocaleString()}</td><td>{log.user?.name||'System'}</td><td>{log.action}</td><td>{log.subject_type.split('\\').pop()} {log.su…`.

### new Date(log.created_at).toLocaleString

- **جاية منين؟** Date/Number instance

- **وظيفتها:** تنسّق القيمة للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 83.

### log.subject_type.split('\\').pop

- **جاية منين؟** Array

- **وظيفتها:** تشيل آخر عنصر من array الأصلية.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** العنصر المحذوف أو undefined.

- **أول موضع هنا:** السطر 83.

### log.subject_type.split

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تقسم النص لأجزاء.

- **المدخلات — Arguments:** separator وlimit اختيارية.

- **الناتج/الأثر — Return / effect:** array نصوص.

- **أول موضع هنا:** السطر 83، والمدخلات المكتوبة: `'\\'`.

### useParams

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يقرأ الأجزاء الديناميكية من Route؛ token من /orders/:token وsection من /admin/:section.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object قيم parameters كنصوص عادة.

- **أول موضع هنا:** السطر 85.

- **مثال:** const { token } = useParams();

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 85، والمدخلات المكتوبة: `()=>({menu:<MenuAdmin/>,branches:<BranchAdmin/>,staff:<StaffAdmin/>,orders:<OrdersAdmin/>,customers:<CustomersAdmin/>,settings:<SettingsAdmin/>})`، `[]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { csrfFetch } from '../../lib/api';
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
async function exportDemoOrders(event) {
    if (!isDemo) return;
    event.preventDefault();
    const { orders } = await csrfFetch('/api/admin/orders');
```

**السطر 1:** Import / استيراد: الأسماء `React`، `useEffect`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `useParams` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `csrfFetch` جاية من `../../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Variable declaration / تعريف `isDemo` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 5:** Function / تعريف دالة `exportDemoOrders`؛ تعريفها مش تشغيلها. في الديمو يمنع رابط CSV الحقيقي ويحوّل بيانات API المحلية إلى Blob CSV ينزله ثم يحرر object URL؛ في live يترك الرابط للسيرفر. مدخلاتها: event click على رابط Export CSV. ناتجها: Promise<void>.

**السطر 6:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 7:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `event.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/orders'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```jsx
    const cell = (value) => '"' + String(value ?? '').replaceAll('"', '""') + '"';
    const rows = [['Order', 'Branch', 'Customer', 'Status', 'Total'], ...orders.map((order) => [order.id, order.branch?.name, order.customer_name, order.status, order.total_price])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map(cell).join(',')).join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo-orders.csv';
    link.click();
    URL.revokeObjectURL(url);
```

**السطر 9:** Variable declaration / تعريف `cell` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `cell` هنا: يهرب double quotes بوضع quote مزدوجة ويلف قيمة CSV بين علامات اقتباس؛ لا تعامله كحماية كاملة من spreadsheet formula injection. المدخلات: value.. الناتج/الأثر: CSV cell string.. الدوال الموجودة في السطر: `String(value ?? '').replaceAll(...)`: تستبدل كل التطابقات بنص جديد. القيم المكتوبة هنا: `'"'`، `'""'`. العائد/الأثر: string جديدة؛ لا تعدّل الأصل.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `value ?? ''`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Variable declaration / تعريف `rows` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 2 عنصرًا؛ العناصر نفسها في السطور التالية. الدوال الموجودة في السطر: `orders.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(order) => [order.id, order.branch?.name, order.customer_name, order.status, order.total_price]`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Variable declaration / تعريف `url` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `URL.createObjectURL(...)`: يعمل blob: URL مؤقت لبيانات موجودة؛ لا يرفعها على سيرفر. القيم المكتوبة هنا: `new Blob([rows.map((row) => row.map(cell).join(',')).join('\n')], { type: 'text/csv' })`. العائد/الأثر: string URL؛ `Blob(...)`: تنشئ بيانات ملف ثنائية في الذاكرة. القيم المكتوبة هنا: `[rows.map((row) => row.map(cell).join(',')).join('\n')]`، `{ type: 'text/csv' }`. العائد/الأثر: Blob؛ تنزيلها يحتاج URL/عرض مناسب.؛ `rows.map((row) => row.map(cell).join(',')).join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `'\n'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `rows.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(row) => row.map(cell).join(',')`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `row.map(cell).join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `','`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `row.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `cell`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Variable declaration / تعريف `link` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `document.createElement(...)`: تنشئ عنصر DOM في الذاكرة. القيم المكتوبة هنا: `'a'`. العائد/الأثر: Element؛ لا يظهر قبل إضافته للـDOM.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 14:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `link.click(...)`: تطلب تفعيل حدث click برمجيًا. مدخلاتها: بدون arguments. العائد/الأثر: undefined؛ تنزيل الملف يعتمد على خصائص الرابط.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `URL.revokeObjectURL(...)`: يفك ربط blob URL بعد الانتهاء لتقليل احتفاظ الموارد. القيم المكتوبة هنا: `url`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```jsx
}

function ErrorBox({ error }) {
    return error ? <div className="alert alert-danger" role="alert">{error}</div> : null;
}

function ProductForm({ product, categories, branches, onSaved, onCancel }) {
    const [form, setForm] = useState(() => ({
```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** Function / تعريف دالة `ErrorBox`؛ تعريفها مش تشغيلها. يرسم alert لو error غير فاضي وإلا null. مدخلاتها: {error}. ناتجها: JSX أو null.

**السطر 20:** Return / رجّع `error ? <div className="alert alert-danger" role="alert">{error}</div> : null` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** Function / تعريف دالة `ProductForm`؛ تعريفها مش تشغيلها. ينشئ state من product/categories/branches ويمسك صورة وأسعار/توافر كل فرع ويرسل FormData. مدخلاتها: product,categories,branches,onSaved,onCancel. ناتجها: JSX form.

**السطر 24:** Variable declaration / تعريف `form + setForm` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `() => ({         category_id: product?.category_id || categories[0]?.id || '',         name: product?.name || …`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```jsx
        category_id: product?.category_id || categories[0]?.id || '',
        name: product?.name || '',
        description: product?.description || '',
        tag: product?.tag || '',
        display_order: product?.display_order || 0,
        is_active: product?.is_active ?? true,
        image: null,
        branch_options: branches.map((branch) => {
```

**السطر 25:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 26:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 27:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 28:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 29:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 30:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 31:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 32:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `branches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch) => {             const current = product?.branches?.find((item) => item.id === branch.id);           …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```jsx
            const current = product?.branches?.find((item) => item.id === branch.id);
            return { branch_id: branch.id, price: current?.pivot?.price || '', is_available: current?.pivot?.is_available ?? true };
        }),
    }));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const setOption = (index, key, value) => setForm((current) => ({ ...current, branch_options: current.branch_options.map((option, optionIndex) => optionIndex === index ? { ...option, [key]: value } : option) }));
    const save = async (event) => {
```

**السطر 33:** Variable declaration / تعريف `current` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `product?.branches?.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(item) => item.id === branch.id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** Return / رجّع `{ branch_id: branch.id, price: current?.pivot?.price || '', is_available: current?.pivot?.is_available ?? true }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** Variable declaration / تعريف `busy + setBusy` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Variable declaration / تعريف `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** Variable declaration / تعريف `setOption` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `setOption` هنا: يعدّل property واحدة في branch_options[index] بنسخ array/object بدل mutation. المدخلات: index,key,value.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `setForm(...)`: لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `(current) => ({ ...current, branch_options: current.branch_options.map((option, optionIndex) => optionIndex ==…`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `current.branch_options.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(option, optionIndex) => optionIndex === index ? { ...option, [key]: value } : option`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** Variable declaration / تعريف `save` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `save` هنا: اسم handler محلي متكرر داخل ProductForm/BranchRow/StaffAdmin/SettingsAdmin؛ شوف مفاتيح Component.save هنا لتحديد payload/endpoint الصحيح. مش function واحدة مشتركة. المدخلات: event في forms؛ BranchRow.save لا يحتاج event.. الناتج/الأثر: Promise<void>؛ تأثيره API ثم callback/reload..

### السطور 41–48

```jsx
        event.preventDefault();
        setBusy(true); setError('');
        const body = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'branch_options') body.append(key, JSON.stringify(value));
            else if (key === 'image' && value) body.append(key, value);
            else if (key !== 'image') body.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
        });
```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `event.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setBusy(...)`: لو setBusy هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** Variable declaration / تعريف `body` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `FormData(...)`: تنشئ حاوية multipart للحقول والملفات. مدخلاتها: form element اختيارية. العائد/الأثر: FormData object، مش JSON string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Object.entries(form).forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `([key, value]) => {             if (key === 'branch_options') body.append(key, JSON.stringify(value));        …`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.؛ `Object.entries(...)`: يحوّل الخصائص الذاتية القابلة للتعداد لأزواج [key,value]؛ مفيد لبناء FormData وفلاتر URL. القيم المكتوبة هنا: `form`. العائد/الأثر: array أزواج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `body.append(...)`: في FormData يضيف حقلًا ويقبل File/Blob أو نص؛ تكرار المفتاح يضيف قيمة أخرى مش يستبدل السابقة. القيم المكتوبة هنا: `key`، `JSON.stringify(value)`. العائد/الأثر: undefined.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `value`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `body.append(...)`: في FormData يضيف حقلًا ويقبل File/Blob أو نص؛ تكرار المفتاح يضيف قيمة أخرى مش يستبدل السابقة. القيم المكتوبة هنا: `key`، `value`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `body.append(...)`: في FormData يضيف حقلًا ويقبل File/Blob أو نص؛ تكرار المفتاح يضيف قيمة أخرى مش يستبدل السابقة. القيم المكتوبة هنا: `key`، `typeof value === 'boolean' ? (value ? '1' : '0') : value`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```jsx
        try {
            await csrfFetch(product ? '/api/admin/products/' + product.id : '/api/admin/products', { method: 'POST', body });
            onSaved();
        } catch (requestError) { setError(requestError.payload?.errors ? Object.values(requestError.payload.errors).flat()[0] : requestError.message); }
        finally { setBusy(false); }
    };
    return <form className="wtc-admin-card p-3 mb-3" onSubmit={save}><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">{product ? 'Edit product' : 'New product'}</h2><button type="button" className="btn btn-sm btn-outline-light" onClick={onCancel}>Close</button></div><ErrorBox error={error}/><div className="row g-3"><label className="col-md-6">Name<input className="wtc-admin-input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required /></label><label className="col-md-3">Category<select className="wtc-admin-input" value={form.category_id} onChange={(e)=>setForm({...form,category_id:e.target.value})}>{categories.map((category)=><option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="col-md-3">Display order<input className="wtc-admin-input" type="number" min="0" value={form.display_order} onChange={(e)=>setForm({...form,display_order:e.target.value})}/></label><label className="col-12">Description<textarea className="wtc-admin-input" rows="3" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} required /></label><label className="col-md-5">Tag<input className="wtc-admin-input" value={form.tag} onChange={(e)=>setForm({...form,tag:e.target.value})}/></label><label className="col-md-5">Photo<input className="wtc-admin-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>setForm({...form,image:e.target.files[0]||null})}/></label><label className="col-md-2 d-flex align-items-end gap-2 pb-2"><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})}/> Active</label></div><h3 className="h6 mt-4">Branch prices and availability</h3><div className="row g-2">{form.branch_options.map((option,index)=><div className="col-md-4" key={option.branch_id}><div className="border border-secondary-subtle p-2"><strong>{branches[index]?.name}</strong><input className="wtc-admin-input my-2" type="number" step=".01" min="0" placeholder="Price" value={option.price} onChange={(e)=>setOption(index,'price',e.target.value)} required/><label className="d-flex gap-2"><input type="checkbox" checked={Boolean(option.is_available)} onChange={(e)=>setOption(index,'is_available',e.target.checked)}/> Available</label></div></div>)}</div><button className="btn btn-red mt-3" disabled={busy}>{busy?'Saving...':'Save product'}</button></form>;
}
```

**السطر 49:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 50:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `product ? '/api/admin/products/' + product.id : '/api/admin/products'`، `{ method: 'POST', body }`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onSaved(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onSaved؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. مدخلاتها: بدون arguments مباشرة هنا. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.payload?.errors ? Object.values(requestError.payload.errors).flat()[0] : requestError.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `Object.values(requestError.payload.errors).flat(...)`: تفرد مستويات arrays حسب العمق. مدخلاتها: depth اختياري افتراضيه1. العائد/الأثر: array جديدة.؛ `Object.values(...)`: يرجع قيم خصائص object بدون مفاتيح؛ مستخدم لاستخراج validation messages. القيم المكتوبة هنا: `requestError.payload.errors`. العائد/الأثر: array قيم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت. الدوال الموجودة في السطر: `setBusy(...)`: لو setBusy هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 55:** Return / رجّع `<form className="wtc-admin-card p-3 mb-3" onSubmit={save}><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">{product ? 'Edit product' : 'New product'}</h2><button type="butto…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `setForm(...)`: لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{...form,is_active:e.target.checked}`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `categories.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(category)=><option key={category.id} value={category.id}>{category.name}</option>`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `form.branch_options.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(option,index)=><div className="col-md-4" key={option.branch_id}><div className="border border-secondary-subtl…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `setOption(...)`: يعدّل property واحدة في branch_options[index] بنسخ array/object بدل mutation. القيم المكتوبة هنا: `index`، `'is_available'`، `e.target.checked`. العائد/الأثر: undefined.؛ `Boolean(...)`: تحوّل قيمة إلى true/false حسب truthiness. القيم المكتوبة هنا: `option.is_available`. العائد/الأثر: Boolean؛ النص false غير الفاضي يساوي true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–64

```jsx

function MenuAdmin() {
    const [data,setData]=useState(null),[editing,setEditing]=useState(undefined),[error,setError]=useState(''),[category,setCategory]=useState({name:'',slug:'',display_order:0,is_active:true});
    const load=()=>csrfFetch('/api/admin/catalog').then(setData).catch((e)=>setError(e.message));
    useEffect(()=>{load();},[]);
    const saveCategory=async(e)=>{e.preventDefault();try{await csrfFetch('/api/admin/categories',{method:'POST',body:JSON.stringify(category)});setCategory({name:'',slug:'',display_order:0,is_active:true});load();}catch(x){setError(x.message);}};
    const disable=async(item)=>{if(!window.confirm('Disable '+item.name+'? Existing orders will keep their saved item name and price.'))return;await csrfFetch('/api/admin/products/'+item.id,{method:'DELETE'});load();};
    const soldOut=async(item)=>{const body=new FormData();[['category_id',item.category_id],['name',item.name],['description',item.description],['tag',item.tag||''],['display_order',item.display_order],['is_active',item.is_active?'1':'0'],['branch_options',JSON.stringify(item.branches.map((b)=>({branch_id:b.id,price:b.pivot.price,is_available:false})))]].forEach(([k,v])=>body.append(k,v));await csrfFetch('/api/admin/products/'+item.id,{method:'POST',body});load();};
```

**السطر 58:** Function / تعريف دالة `MenuAdmin`؛ تعريفها مش تشغيلها. يحمل catalog الإداري؛ يدير new/edit/disable/soldOut وform الفئات. مدخلاتها: لا شيء. ناتجها: JSX.

**السطر 59:** Variable declaration / تعريف `data + setData`، `editing + setEditing`، `error + setError`، `category + setCategory` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `{name:'',slug:'',display_order:0,is_active:true}`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** Variable declaration / تعريف `load` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `load` هنا: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. المدخلات: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله.. الناتج/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.. الدوال الموجودة في السطر: `csrfFetch('/api/admin/catalog').then(setData).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(e)=>setError(e.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `csrfFetch('/api/admin/catalog').then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `setData`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/catalog'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `e.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `()=>{load();}`، `[]`. العائد/الأثر: undefined؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** Variable declaration / تعريف `saveCategory` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `saveCategory` هنا: POST للفئة الحالية ثم تصفير form وإعادة تحميل catalog؛ يمنع reload الافتراضي. المدخلات: e: submit event.. الناتج/الأثر: Promise<void>.. الدوال الموجودة في السطر: `e.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/categories'`، `{method:'POST',body:JSON.stringify(category)}`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `category`. العائد/الأثر: string أو undefined لبعض القيم؛ `setCategory(...)`: لو setCategory هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{name:'',slug:'',display_order:0,is_active:true}`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `x.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** Variable declaration / تعريف `disable` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `disable` هنا: يستأذن بـ confirm ثم DELETE للمنتج (تعطيل منطقي حسب backend) وإعادة تحميل؛ لا يوجد catch محلي هنا. المدخلات: item.. الناتج/الأثر: Promise<void>.. الدوال الموجودة في السطر: `window.confirm(...)`: تطلب تأكيدًا بسيطًا من المستخدم. القيم المكتوبة هنا: `'Disable '+item.name+'? Existing orders will keep their saved item name and price.'`. العائد/الأثر: Boolean؛ ده قرار واجهة مش authorization.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/products/'+item.id`، `{method:'DELETE'}`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** Variable declaration / تعريف `soldOut`، `body` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `soldOut` هنا: يرسل بيانات المنتج بـ FormData مع is_available=false لكل branch option ثم reload؛ مش حذف للمنتج. المدخلات: item.. الناتج/الأثر: Promise<void>.. الدوال الموجودة في السطر: `FormData(...)`: تنشئ حاوية multipart للحقول والملفات. مدخلاتها: form element اختيارية. العائد/الأثر: FormData object، مش JSON string.؛ `[['category_id',item.category_id],['name',item.name],['description',item.description],['tag',item.tag||''],['display_order',item.display_order],['is_active',item.is_active?'1':'0'],['branch_options',JSON.stringify(item.branches.map((b)=>({branch_id:b.id,price:b.pivot.price,is_available:false})))]].forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `([k,v])=>body.append(k,v)`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `item.branches.map((b)=>({branch_id:b.id,price:b.pivot.price,is_available:false}))`. العائد/الأثر: string أو undefined لبعض القيم؛ `item.branches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(b)=>({branch_id:b.id,price:b.pivot.price,is_available:false})`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `body.append(...)`: في FormData يضيف حقلًا ويقبل File/Blob أو نص؛ تكرار المفتاح يضيف قيمة أخرى مش يستبدل السابقة. القيم المكتوبة هنا: `k`، `v`. العائد/الأثر: undefined.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/products/'+item.id`، `{method:'POST',body}`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 65–72

```jsx
    if(!data)return <><h1 className="wtc-admin-title">Menu management</h1><ErrorBox error={error}/><p>Loading catalog...</p></>;
    return <><header className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3"><div><p className="eyebrow">Catalog</p><h1 className="wtc-admin-title mb-0">Menu management</h1></div><button className="btn btn-red" onClick={()=>setEditing(null)}>New product</button></header><ErrorBox error={error}/>{editing!==undefined&&<ProductForm key={editing?.id||'new'} product={editing} categories={data.categories} branches={data.branches} onSaved={()=>{setEditing(undefined);load();}} onCancel={()=>setEditing(undefined)}/>}<section className="wtc-admin-card p-3 mb-3"><h2 className="h5">Categories</h2><form className="row g-2" onSubmit={saveCategory}><div className="col-md-4"><input className="wtc-admin-input" placeholder="Category name" value={category.name} onChange={(e)=>setCategory({...category,name:e.target.value,slug:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')})} required/></div><div className="col-md-4"><input className="wtc-admin-input" placeholder="slug" value={category.slug} onChange={(e)=>setCategory({...category,slug:e.target.value})} required/></div><div className="col-md-2"><input className="wtc-admin-input" type="number" min="0" value={category.display_order} onChange={(e)=>setCategory({...category,display_order:e.target.value})}/></div><div className="col-md-2"><button className="btn btn-outline-light w-100 h-100">Add</button></div></form></section><section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Product</th><th>Category</th><th>Photo</th><th>Availability</th><th>Actions</th></tr></thead><tbody>{data.items.map((item)=><tr key={item.id}><td><strong>{item.name}</strong><small className="d-block text-secondary">{item.tag}</small></td><td>{item.category?.name}</td><td>{item.image_path?<img src={item.image_path} alt="" width="72" height="52" style={{objectFit:'cover'}} loading="lazy"/>:<span className="badge text-bg-dark">WTC placeholder</span>}</td><td>{item.is_active?'Active':'Disabled'} · {item.branches.filter((b)=>b.pivot.is_available).length}/{data.branches.length} branches</td><td><div className="d-flex flex-wrap gap-1"><button className="btn btn-sm btn-outline-light" onClick={()=>setEditing(item)}>Edit</button><button className="btn btn-sm btn-outline-warning" onClick={()=>soldOut(item)}>Sold out</button><button className="btn btn-sm btn-outline-danger" onClick={()=>disable(item)}>Disable</button></div></td></tr>)}</tbody></table></section></>;
}

function BranchRow({ branch, onSaved }) {
    const [form,setForm]=useState(branch),[busy,setBusy]=useState(false),[error,setError]=useState('');
    const save=async()=>{setBusy(true);setError('');try{await csrfFetch('/api/admin/branches/'+branch.id,{method:'PUT',body:JSON.stringify(form)});onSaved();}catch(e){setError(e.message);}finally{setBusy(false);}};
    return <section className="wtc-admin-card p-3"><h2 className="h5">{branch.name}</h2><ErrorBox error={error}/><div className="row g-2">{[['name','Name'],['location','Address'],['phone','Phone'],['opening_hours','Opening hours']].map(([key,label])=><label className={key==='location'?'col-12':'col-md-6'} key={key}>{label}<input className="wtc-admin-input" value={form[key]||''} onChange={(e)=>setForm({...form,[key]:e.target.value})}/></label>)}<label className="col-md-4">Delivery fee<input className="wtc-admin-input" type="number" min="0" step=".01" value={form.delivery_fee} onChange={(e)=>setForm({...form,delivery_fee:e.target.value})}/></label><label className="col-md-4">Display order<input className="wtc-admin-input" type="number" min="0" value={form.display_order} onChange={(e)=>setForm({...form,display_order:e.target.value})}/></label><div className="col-md-4 d-flex flex-column justify-content-end gap-2"><label><input type="checkbox" checked={form.delivery_enabled} onChange={(e)=>setForm({...form,delivery_enabled:e.target.checked})}/> Delivery enabled</label><label><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})}/> Active</label></div></div><button className="btn btn-red mt-3" disabled={busy} onClick={save}>Save branch</button></section>;
```

**السطر 65:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 66:** Return / رجّع `<><header className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3"><div><p className="eyebrow">Catalog</p><h1 className="wtc-admin-title mb-0">Menu management</h1></div><button className="btn btn-r…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `setEditing(...)`: لو setEditing هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `item`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.؛ `setCategory(...)`: لو setCategory هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{...category,display_order:e.target.value}`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `e.target.value.toLowerCase().replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `/[^a-z0-9]+/g`، `'-'`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.؛ `e.target.value.toLowerCase(...)`: تحوّل الحروف لحالتها الصغيرة. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد.؛ `data.items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item)=><tr key={item.id}><td><strong>{item.name}</strong><small className="d-block text-secondary">{item.tag}…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `item.branches.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(b)=>b.pivot.is_available`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `soldOut(...)`: يرسل بيانات المنتج بـ FormData مع is_available=false لكل branch option ثم reload؛ مش حذف للمنتج. القيم المكتوبة هنا: `item`. العائد/الأثر: Promise<void>.؛ `disable(...)`: يستأذن بـ confirm ثم DELETE للمنتج (تعطيل منطقي حسب backend) وإعادة تحميل؛ لا يوجد catch محلي هنا. القيم المكتوبة هنا: `item`. العائد/الأثر: Promise<void>.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 69:** Function / تعريف دالة `BranchRow`؛ تعريفها مش تشغيلها. صف قابل للتحرير لفرع، يمسك form/busy/error مستقل لكل فرع. مدخلاتها: branch,onSaved. ناتجها: JSX.

**السطر 70:** Variable declaration / تعريف `form + setForm`، `busy + setBusy`، `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 71:** Variable declaration / تعريف `save` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `save` هنا: اسم handler محلي متكرر داخل ProductForm/BranchRow/StaffAdmin/SettingsAdmin؛ شوف مفاتيح Component.save هنا لتحديد payload/endpoint الصحيح. مش function واحدة مشتركة. المدخلات: event في forms؛ BranchRow.save لا يحتاج event.. الناتج/الأثر: Promise<void>؛ تأثيره API ثم callback/reload.. الدوال الموجودة في السطر: `setBusy(...)`: لو setBusy هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `e.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/branches/'+branch.id`، `{method:'PUT',body:JSON.stringify(form)}`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `form`. العائد/الأثر: string أو undefined لبعض القيم؛ `onSaved(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onSaved؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. مدخلاتها: بدون arguments مباشرة هنا. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 72:** Return / رجّع `<section className="wtc-admin-card p-3"><h2 className="h5">{branch.name}</h2><ErrorBox error={error}/><div className="row g-2">{[['name','Name'],['location','Address'],['phone','Phone'],['opening_hours','Opening hours']]…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `[['name','Name'],['location','Address'],['phone','Phone'],['opening_hours','Opening hours']].map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `([key,label])=><label className={key==='location'?'col-12':'col-md-6'} key={key}>{label}<input className="wtc-…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `setForm(...)`: لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{...form,is_active:e.target.checked}`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 73–80

```jsx
}

function BranchAdmin(){const[data,setData]=useState(null),[error,setError]=useState('');const load=()=>csrfFetch('/api/admin/branches').then(setData).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);return <><h1 className="wtc-admin-title">Branches</h1><p className="text-secondary">Disable a branch instead of deleting it so old orders remain complete.</p><ErrorBox error={error}/><div className="d-grid gap-3">{data?.branches.map((branch)=><BranchRow key={branch.id} branch={branch} onSaved={load}/>)}</div></>}

function StaffAdmin(){const[data,setData]=useState(null),[branches,setBranches]=useState([]),[form,setForm]=useState({name:'',email:'',role:'staff',branch_id:'',is_active:true,password:'',password_confirmation:''}),[editing,setEditing]=useState(null),[error,setError]=useState('');const load=()=>Promise.all([csrfFetch('/api/admin/staff'),csrfFetch('/api/admin/branches')]).then(([staff,branchData])=>{setData(staff.users);setBranches(branchData.branches);}).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);const select=(u)=>{setEditing(u);setForm({name:u.name,email:u.email,role:u.role,branch_id:u.branch_id||'',is_active:u.is_active,password:'',password_confirmation:''});};const save=async(e)=>{e.preventDefault();try{await csrfFetch(editing?'/api/admin/staff/'+editing.id:'/api/admin/staff',{method:editing?'PUT':'POST',body:JSON.stringify(form)});setEditing(null);setForm({name:'',email:'',role:'staff',branch_id:'',is_active:true,password:'',password_confirmation:''});load();}catch(x){setError(x.payload?.errors?Object.values(x.payload.errors).flat()[0]:x.message);}};return <><h1 className="wtc-admin-title">Staff accounts</h1><ErrorBox error={error}/><form className="wtc-admin-card p-3 mb-3" onSubmit={save}><h2 className="h5">{editing?'Edit account':'Create account'}</h2><div className="row g-2"><label className="col-md-6">Name<input className="wtc-admin-input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required/></label><label className="col-md-6">Email<input className="wtc-admin-input" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required/></label><label className="col-md-4">Role<select className="wtc-admin-input" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value,branch_id:e.target.value==='admin'?'':form.branch_id})}><option value="staff">Staff</option><option value="admin">Admin</option></select></label><label className="col-md-4">Branch<select className="wtc-admin-input" disabled={form.role==='admin'} value={form.branch_id} onChange={(e)=>setForm({...form,branch_id:e.target.value})}><option value="">Select branch</option>{branches.map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label className="col-md-4 d-flex align-items-end gap-2 pb-2"><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})}/> Active</label><label className="col-md-6">{editing?'New password (optional)':'Password'}<input className="wtc-admin-input" type="password" disabled={isDemo} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required={!isDemo&&!editing}/></label><label className="col-md-6">Confirm password<input className="wtc-admin-input" type="password" disabled={isDemo} value={form.password_confirmation} onChange={(e)=>setForm({...form,password_confirmation:e.target.value})} required={!isDemo&&Boolean(form.password)}/></label></div><button className="btn btn-red mt-3">Save account</button>{editing&&<button type="button" className="btn btn-outline-light mt-3 ms-2" onClick={()=>setEditing(null)}>Cancel</button>}</form><section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Name</th><th>Role</th><th>Branch</th><th>Status</th><th></th></tr></thead><tbody>{data?.map((u)=><tr key={u.id}><td>{u.name}<small className="d-block text-secondary">{u.email}</small></td><td>{u.role}</td><td>{u.branch?.name||'All branches'}</td><td>{u.is_active?'Active':'Disabled'}</td><td><button className="btn btn-sm btn-outline-light" onClick={()=>select(u)}>Edit / reset password</button></td></tr>)}</tbody></table></section></>}

function OrdersAdmin(){const[orders,setOrders]=useState([]),[filters,setFilters]=useState({search:'',status:'',payment_status:''}),[selected,setSelected]=useState(null),[error,setError]=useState('');const load=()=>csrfFetch('/api/admin/orders?'+new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)))).then((r)=>setOrders(r.orders)).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);return <><header className="d-flex justify-content-between align-items-end mb-3"><h1 className="wtc-admin-title mb-0">All orders</h1><a className="btn btn-outline-light" href="/api/admin/orders/export" onClick={exportDemoOrders}>Export CSV</a></header><ErrorBox error={error}/><form className="wtc-admin-card p-3 mb-3 row g-2" onSubmit={(e)=>{e.preventDefault();load();}}><div className="col-md-5"><input className="wtc-admin-input" placeholder="Order, customer or phone" value={filters.search} onChange={(e)=>setFilters({...filters,search:e.target.value})}/></div><div className="col-md-3"><select className="wtc-admin-input" value={filters.status} onChange={(e)=>setFilters({...filters,status:e.target.value})}><option value="">All statuses</option>{['new','accepted','preparing','ready','out_for_delivery','picked_up','completed','cancelled','rejected'].map((s)=><option key={s}>{s}</option>)}</select></div><div className="col-md-2"><select className="wtc-admin-input" value={filters.payment_status} onChange={(e)=>setFilters({...filters,payment_status:e.target.value})}><option value="">All payments</option>{['unpaid','pending','paid','failed'].map((s)=><option key={s}>{s}</option>)}</select></div><div className="col-md-2"><button className="btn btn-red w-100 h-100">Filter</button></div></form>{selected&&<section className="wtc-admin-card p-3 mb-3"><button className="btn btn-sm btn-outline-light float-end" onClick={()=>setSelected(null)}>Close</button><h2 className="h5">Order #{selected.id}</h2><p>{selected.customer_name} · {selected.customer_phone} · {selected.branch?.name}</p>{selected.items.map((item)=><div key={item.id}>{item.quantity} × {item.item_name}{item.notes&&<strong className="text-warning"> · {item.notes}</strong>}</div>)}</section>}<section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Branch</th><th>Status</th><th>Payment</th><th>Total</th></tr></thead><tbody>{orders.map((o)=><tr key={o.id} onClick={()=>setSelected(o)} style={{cursor:'pointer'}}><td>#{o.id}<small className="d-block text-secondary">{new Date(o.created_at).toLocaleString()}</small></td><td>{o.customer_name}<small className="d-block">{o.customer_phone}</small></td><td>{o.branch?.name}</td><td>{o.status}</td><td>{o.payment_status}</td><td>EGP {Number(o.total_price).toFixed(2)}</td></tr>)}</tbody></table></section></>}

```

**السطر 73:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 75:** Function / تعريف دالة `BranchAdmin`؛ تعريفها مش تشغيلها. يحمل /api/admin/branches ويرسم BranchRow لكل فرع. مدخلاتها: لا شيء. ناتجها: JSX. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]؛ `csrfFetch('/api/admin/branches').then(setData).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(e)=>setError(e.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `csrfFetch('/api/admin/branches').then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `setData`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/branches'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `e.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `()=>{load();}`، `[]`. العائد/الأثر: undefined؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.؛ `data?.branches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch)=><BranchRow key={branch.id} branch={branch} onSaved={load}/>`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 77:** Function / تعريف دالة `StaffAdmin`؛ تعريفها مش تشغيلها. يحمل الموظفين والفروع بالتوازي ويعرض create/edit account؛ passwords معطلة في build الديمو. مدخلاتها: لا شيء. ناتجها: JSX. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]؛ `Promise.all([csrfFetch('/api/admin/staff'),csrfFetch('/api/admin/branches')]).then(([staff,branchData])=>{setData(staff.users);setBranches(branchData.branches);}).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(e)=>setError(e.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `Promise.all([csrfFetch('/api/admin/staff'),csrfFetch('/api/admin/branches')]).then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `([staff,branchData])=>{setData(staff.users);setBranches(branchData.branches);}`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `Promise.all(...)`: يجمع promises ويحافظ على ترتيب النتائج؛ يرفض عند أول رفض ولا يلغي بقية العمليات تلقائيًا. القيم المكتوبة هنا: `[csrfFetch('/api/admin/staff'),csrfFetch('/api/admin/branches')]`. العائد/الأثر: Promise<array>؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `editing?'/api/admin/staff/'+editing.id:'/api/admin/staff'`، `{method:editing?'PUT':'POST',body:JSON.stringify(form)}`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `setData(...)`: لو setData هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `staff.users`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setBranches(...)`: لو setBranches هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `branchData.branches`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `x.payload?.errors?Object.values(x.payload.errors).flat()[0]:x.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `()=>{load();}`، `[]`. العائد/الأثر: undefined؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.؛ `setEditing(...)`: لو setEditing هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setForm(...)`: لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{...form,password_confirmation:e.target.value}`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `e.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `form`. العائد/الأثر: string أو undefined لبعض القيم؛ `Object.values(x.payload.errors).flat(...)`: تفرد مستويات arrays حسب العمق. مدخلاتها: depth اختياري افتراضيه1. العائد/الأثر: array جديدة.؛ `Object.values(...)`: يرجع قيم خصائص object بدون مفاتيح؛ مستخدم لاستخراج validation messages. القيم المكتوبة هنا: `x.payload.errors`. العائد/الأثر: array قيم.؛ `branches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(b)=><option key={b.id} value={b.id}>{b.name}</option>`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Boolean(...)`: تحوّل قيمة إلى true/false حسب truthiness. القيم المكتوبة هنا: `form.password`. العائد/الأثر: Boolean؛ النص false غير الفاضي يساوي true.؛ `data?.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(u)=><tr key={u.id}><td>{u.name}<small className="d-block text-secondary">{u.email}</small></td><td>{u.role}</…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `select(...)`: ينسخ بيانات الموظف المحدد إلى form ويترك password fields فاضية. القيم المكتوبة هنا: `u`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 79:** Function / تعريف دالة `OrdersAdmin`؛ تعريفها مش تشغيلها. يعرض كل الطلبات بفلاتر بحث/حالة/دفع وتفاصيل الطلب المحدد وCSV. مدخلاتها: لا شيء. ناتجها: JSX. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]؛ `csrfFetch('/api/admin/orders?'+new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)))).then((r)=>setOrders(r.orders)).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(e)=>setError(e.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `csrfFetch('/api/admin/orders?'+new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)))).then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `(r)=>setOrders(r.orders)`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/orders?'+new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)))`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `URLSearchParams(...)`: يبني query parameters ويعمل encoding عند إدراجه في URL؛ لا يرسل طلبًا بنفسه. القيم المكتوبة هنا: `Object.fromEntries(Object.entries(filters).filter(([,v])=>v))`. العائد/الأثر: URLSearchParams instance.؛ `Object.fromEntries(...)`: عكس entries: يبني object من أزواج key/value، مثل تحويل entries FormData أو فلاتر غير فاضية. القيم المكتوبة هنا: `Object.entries(filters).filter(([,v])=>v)`. العائد/الأثر: object.؛ `Object.entries(filters).filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `([,v])=>v`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `Object.entries(...)`: يحوّل الخصائص الذاتية القابلة للتعداد لأزواج [key,value]؛ مفيد لبناء FormData وفلاتر URL. القيم المكتوبة هنا: `filters`. العائد/الأثر: array أزواج.؛ `setOrders(...)`: لو setOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `r.orders`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `e.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `()=>{load();}`، `[]`. العائد/الأثر: undefined؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.؛ `e.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.؛ `setFilters(...)`: لو setFilters هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{...filters,payment_status:e.target.value}`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `['new','accepted','preparing','ready','out_for_delivery','picked_up','completed','cancelled','rejected'].map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(s)=><option key={s}>{s}</option>`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `['unpaid','pending','paid','failed'].map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(s)=><option key={s}>{s}</option>`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `setSelected(...)`: لو setSelected هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `o`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `selected.items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item)=><div key={item.id}>{item.quantity} × {item.item_name}{item.notes&&<strong className="text-warning"> · …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `orders.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(o)=><tr key={o.id} onClick={()=>setSelected(o)} style={{cursor:'pointer'}}><td>#{o.id}<small className="d-blo…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `new Date(o.created_at).toLocaleString(...)`: تنسّق القيمة للعرض المحلي. مدخلاتها: locale وخيارات. العائد/الأثر: string.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `o.created_at`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.؛ `Number(o.total_price).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `o.total_price`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 81–86

```jsx
function CustomersAdmin(){const[data,setData]=useState(null),[error,setError]=useState('');useEffect(()=>{csrfFetch('/api/admin/customers').then((r)=>setData(r.customers)).catch((e)=>setError(e.message));},[]);return <><h1 className="wtc-admin-title">Customers</h1><ErrorBox error={error}/><section className="wtc-admin-card wtc-admin-table-wrap"><table className="wtc-admin-table"><thead><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead><tbody>{data?.map((u)=><tr key={u.id}><td>{u.name}<small className="d-block text-secondary">{u.email}</small></td><td>{u.phone||'Not saved'}</td><td>{u.orders_count}</td><td>EGP {Number(u.orders_sum_total_price||0).toFixed(2)}</td><td>{u.orders_max_created_at?new Date(u.orders_max_created_at).toLocaleString():'Never'}</td></tr>)}</tbody></table></section></>}

function SettingsAdmin(){const[form,setForm]=useState(null),[logs,setLogs]=useState([]),[message,setMessage]=useState(''),[error,setError]=useState('');const load=()=>Promise.all([csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]).then(([s,a])=>{setForm(s.settings);setLogs(a.logs);}).catch((e)=>setError(e.message));useEffect(()=>{load();},[]);const save=async(e)=>{e.preventDefault();try{await csrfFetch('/api/admin/settings',{method:'PUT',body:JSON.stringify(form)});setMessage('Settings saved.');load();}catch(x){setError(x.message);}};return <><h1 className="wtc-admin-title">Settings</h1><ErrorBox error={error}/>{message&&<div className="alert alert-success">{message}</div>}{form&&<form className="wtc-admin-card p-3 mb-3 row g-3" onSubmit={save}>{[['default_delivery_fee','Default delivery fee'],['minimum_pickup_prep_minutes','Minimum prep minutes'],['order_promise_minutes','Order promise minutes']].map(([key,label])=><label className="col-md-4" key={key}>{label}<input className="wtc-admin-input" type="number" min="0" value={form[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})}/></label>)}<div><button className="btn btn-red">Save settings</button></div></form>}<section className="wtc-admin-card wtc-admin-table-wrap"><h2 className="h5 p-3 mb-0">Recent admin activity</h2><table className="wtc-admin-table"><thead><tr><th>When</th><th>Admin</th><th>Action</th><th>Record</th></tr></thead><tbody>{logs.map((log)=><tr key={log.id}><td>{new Date(log.created_at).toLocaleString()}</td><td>{log.user?.name||'System'}</td><td>{log.action}</td><td>{log.subject_type.split('\\').pop()} {log.subject_id||''}</td></tr>)}</tbody></table></section></>}

export default function AdminPanel(){const{section}=useParams();const pages=useMemo(()=>({menu:<MenuAdmin/>,branches:<BranchAdmin/>,staff:<StaffAdmin/>,orders:<OrdersAdmin/>,customers:<CustomersAdmin/>,settings:<SettingsAdmin/>}),[]);return pages[section]||<section><h1>Page not found</h1></section>;}

```

**السطر 81:** Function / تعريف دالة `CustomersAdmin`؛ تعريفها مش تشغيلها. يحمل ملخص العملاء وعدد الطلبات والمصروف وآخر طلب. مدخلاتها: لا شيء. ناتجها: JSX. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]؛ `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `()=>{csrfFetch('/api/admin/customers').then((r)=>setData(r.customers)).catch((e)=>setError(e.message));}`، `[]`. العائد/الأثر: undefined؛ `csrfFetch('/api/admin/customers').then((r)=>setData(r.customers)).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(e)=>setError(e.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `csrfFetch('/api/admin/customers').then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `(r)=>setData(r.customers)`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/customers'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `setData(...)`: لو setData هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `r.customers`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `e.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `data?.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(u)=><tr key={u.id}><td>{u.name}<small className="d-block text-secondary">{u.email}</small></td><td>{u.phone||…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Number(u.orders_sum_total_price||0).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `u.orders_sum_total_price||0`. العائد/الأثر: number أو NaN.؛ `new Date(u.orders_max_created_at).toLocaleString(...)`: تنسّق القيمة للعرض المحلي. مدخلاتها: locale وخيارات. العائد/الأثر: string.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `u.orders_max_created_at`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 83:** Function / تعريف دالة `SettingsAdmin`؛ تعريفها مش تشغيلها. يحمل settings/audit معًا ويعرض form للإعدادات وجدول آخر الأنشطة. مدخلاتها: لا شيء. ناتجها: JSX. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]؛ `Promise.all([csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]).then(([s,a])=>{setForm(s.settings);setLogs(a.logs);}).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(e)=>setError(e.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `Promise.all([csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]).then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `([s,a])=>{setForm(s.settings);setLogs(a.logs);}`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `Promise.all(...)`: يجمع promises ويحافظ على ترتيب النتائج؛ يرفض عند أول رفض ولا يلغي بقية العمليات تلقائيًا. القيم المكتوبة هنا: `[csrfFetch('/api/admin/settings'),csrfFetch('/api/admin/audit')]`. العائد/الأثر: Promise<array>؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/settings'`، `{method:'PUT',body:JSON.stringify(form)}`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `setForm(...)`: لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{...form,[key]:e.target.value}`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setLogs(...)`: لو setLogs هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `a.logs`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `x.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `()=>{load();}`، `[]`. العائد/الأثر: undefined؛ `load(...)`: اسم محلي متكرر: MenuAdmin يحمل catalog؛ BranchAdmin يحمل branches؛ StaffAdmin يحمل staff+branches؛ OrdersAdmin يبني URLSearchParams؛ SettingsAdmin يحمل settings+audit. كل واحد في scope منفصل ومش نفس الدالة. مدخلاتها: لا parameters؛ يستخدم state الخاص بالمكوّن اللي اتعرّف داخله. العائد/الأثر: Promise لطلب/طلبات csrfFetch ثم تحديث state.؛ `e.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `form`. العائد/الأثر: string أو undefined لبعض القيم؛ `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'Settings saved.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `[['default_delivery_fee','Default delivery fee'],['minimum_pickup_prep_minutes','Minimum prep minutes'],['order_promise_minutes','Order promise minutes']].map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `([key,label])=><label className="col-md-4" key={key}>{label}<input className="wtc-admin-input" type="number" m…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `logs.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(log)=><tr key={log.id}><td>{new Date(log.created_at).toLocaleString()}</td><td>{log.user?.name||'System'}</td…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `new Date(log.created_at).toLocaleString(...)`: تنسّق القيمة للعرض المحلي. مدخلاتها: locale وخيارات. العائد/الأثر: string.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `log.created_at`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.؛ `log.subject_type.split('\\').pop(...)`: تشيل آخر عنصر من array الأصلية. مدخلاتها: بدون arguments. العائد/الأثر: العنصر المحذوف أو undefined.؛ `log.subject_type.split(...)`: تقسم النص لأجزاء. القيم المكتوبة هنا: `'\\'`. العائد/الأثر: array نصوص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 85:** Function / تعريف دالة `AdminPanel`؛ تعريفها مش تشغيلها. يقرأ section من URL ويختار مكوّنًا من dictionary، أو يعرض Page not found. مدخلاتها: section من useParams. ناتجها: JSX page من pages[section]. الدوال الموجودة في السطر: `useParams(...)`: يقرأ الأجزاء الديناميكية من Route؛ token من /orders/:token وsection من /admin/:section. مدخلاتها: لا شيء. العائد/الأثر: object قيم parameters كنصوص عادة.؛ `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `()=>({menu:<MenuAdmin/>,branches:<BranchAdmin/>,staff:<StaffAdmin/>,orders:<OrdersAdmin/>,customers:<Customers…`، `[]`. العائد/الأثر: القيمة المحسوبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
