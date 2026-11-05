import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { csrfFetch } from '../lib/api';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
    const [catalog, setCatalog] = useState({ branches: [], categories: [], items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const reload = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await csrfFetch('/api/menu');
            setCatalog({
                branches: response.branches || [],
                categories: response.categories || [],
                items: response.items || [],
            });
        } catch (requestError) {
            setError(requestError.message || 'The menu could not be loaded.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const value = useMemo(() => ({ ...catalog, loading, error, reload }), [catalog, loading, error, reload]);

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error('useCatalog must be used inside CatalogProvider.');
    }
    return context;
}

export function branchOption(item, branchId) {
    return item?.branch_options?.find((option) => Number(option.branch_id) === Number(branchId)) || null;
}
