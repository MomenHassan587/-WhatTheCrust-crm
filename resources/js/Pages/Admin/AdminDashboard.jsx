import React, { useEffect, useState } from 'react';
import { csrfFetch } from '../../lib/api';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => { csrfFetch('/api/admin/dashboard').then(setData).catch((requestError) => setError(requestError.message)); }, []);
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!data) return <p>Loading today&apos;s numbers...</p>;
    const maxBranch = Math.max(1, ...data.by_branch.map((item) => Number(item.sales)));
    return <><header className="mb-4"><p className="eyebrow">Today</p><h1 className="wtc-admin-title">Business overview</h1></header><div className="wtc-admin-grid mb-4">{[['Sales','EGP '+Number(data.summary.sales).toFixed(2)],['Orders',data.summary.orders],['Average order','EGP '+Number(data.summary.average).toFixed(2)]].map(([label,value])=><section className="wtc-admin-card p-3" key={label}><span className="text-secondary">{label}</span><strong className="d-block fs-2">{value}</strong></section>)}</div><div className="row g-3"><div className="col-12 col-lg-7"><section className="wtc-admin-card p-3"><h2 className="h5">Sales by branch</h2>{data.by_branch.map((item)=><div className="mb-3" key={item.name}><div className="d-flex justify-content-between"><span>{item.name}</span><strong>EGP {Number(item.sales).toFixed(2)}</strong></div><div style={{height:8,background:'#303030'}}><div style={{height:'100%',width:(Number(item.sales)/maxBranch*100)+'%',background:'#e32626'}} /></div></div>)}</section></div><div className="col-12 col-lg-5"><section className="wtc-admin-card p-3"><h2 className="h5">Best sellers</h2>{data.best_items.map((item,index)=><div className="d-flex justify-content-between py-2 border-bottom border-secondary-subtle" key={item.item_name}><span>{index+1}. {item.item_name}</span><strong>{item.quantity}</strong></div>)}</section></div><div className="col-12"><section className="wtc-admin-card p-3"><h2 className="h5">Orders by status</h2><div className="d-flex flex-wrap gap-2">{Object.entries(data.by_status).map(([status,count])=><span className="badge text-bg-dark p-2 text-capitalize" key={status}>{status.replaceAll('_',' ')}: {count}</span>)}</div></section></div></div></>;
}
