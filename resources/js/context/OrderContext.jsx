import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { branchOption, useCatalog } from './CatalogContext';

const OrderContext = createContext(null);
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const PREFERENCES_KEY = isDemo ? 'wtc_demo_order_preferences' : 'wtc_order_preferences';
const CART_KEY = isDemo ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT = 'wtc-cart-updated';

function savedPreferences() {
    try {
        return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    } catch {
        return {};
    }
}

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
}

export function OrderProvider({ children }) {
    const { branches, items } = useCatalog();
    const initial = savedPreferences();
    const [mode, setMode] = useState(initial.mode === 'pickup' ? 'pickup' : 'delivery');
    const [branchId, setBranchId] = useState(Number(initial.branchId) || null);
    const [deliveryAddress, setDeliveryAddress] = useState(initial.deliveryAddress || '');
    const [deliveryArea, setDeliveryArea] = useState(initial.deliveryArea || '');
    const [notice, setNotice] = useState('');

    const availableBranches = useMemo(
        () => branches.filter((branch) => branch.is_active !== false && (mode !== 'delivery' || branch.delivery_enabled)),
        [branches, mode],
    );
    const selectedBranch = branches.find((branch) => Number(branch.id) === Number(branchId)) || null;

    useEffect(() => {
        if (!branches.length) return;
        const valid = availableBranches.some((branch) => Number(branch.id) === Number(branchId));
        if (!valid) setBranchId(availableBranches[0]?.id || null);
    }, [availableBranches, branchId, branches.length]);

    useEffect(() => {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
            mode,
            branchId,
            deliveryAddress,
            deliveryArea,
        }));
        if (branchId) localStorage.setItem(isDemo ? 'wtc_demo_branch_id' : 'wtc_branch_id', String(branchId));
    }, [mode, branchId, deliveryAddress, deliveryArea]);

    const changeBranch = useCallback((nextBranchId, { confirmCart = true } = {}) => {
        const numericId = Number(nextBranchId);
        const branch = branches.find((entry) => Number(entry.id) === numericId);
        if (!branch || (mode === 'delivery' && !branch.delivery_enabled)) return false;

        const cart = readCart();
        const changesBranch = cart.some((line) => Number(line.branch_id) !== numericId);
        if (changesBranch && confirmCart && !window.confirm('Switch to ' + branch.name + '? Your cart will be repriced and unavailable items will be removed.')) {
            return false;
        }

        if (changesBranch) {
            let removed = 0;
            const nextCart = cart.flatMap((line) => {
                const item = items.find((candidate) => Number(candidate.id) === Number(line.id));
                const option = branchOption(item, numericId);
                if (!item || !option?.is_available) {
                    removed += 1;
                    return [];
                }
                return [{
                    ...line,
                    name: item.name,
                    description: item.description,
                    image_src: item.image_path,
                    price: Number(option.price),
                    branch_id: numericId,
                    branch_name: branch.name,
                }];
            });
            localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
            window.dispatchEvent(new Event(CART_EVENT));
            setNotice(removed
                ? removed + ' unavailable cart item' + (removed === 1 ? '' : 's') + ' removed for ' + branch.name + '.'
                : 'Cart updated for ' + branch.name + '.');
        }

        setBranchId(numericId);
        return true;
    }, [branches, items, mode]);

    const changeMode = useCallback((nextMode) => {
        const normalized = nextMode === 'pickup' ? 'pickup' : 'delivery';
        setMode(normalized);
        if (normalized === 'delivery') {
            const current = branches.find((branch) => Number(branch.id) === Number(branchId));
            if (current && !current.delivery_enabled) {
                setBranchId(branches.find((branch) => branch.delivery_enabled && branch.is_active !== false)?.id || null);
            }
        }
    }, [branches, branchId]);

    const value = useMemo(() => ({
        mode,
        branchId,
        selectedBranch,
        availableBranches,
        deliveryAddress,
        deliveryArea,
        notice,
        setOrderMode: changeMode,
        setBranch: changeBranch,
        setDeliveryAddress,
        setDeliveryArea,
        clearNotice: () => setNotice(''),
    }), [mode, branchId, selectedBranch, availableBranches, deliveryAddress, deliveryArea, notice, changeMode, changeBranch]);

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrder must be used inside OrderProvider.');
    return context;
}
