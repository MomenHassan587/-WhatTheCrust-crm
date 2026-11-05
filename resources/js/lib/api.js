// resources/js/lib/api.js

export async function csrfFetch(url, options = {}) {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
        const { demoFetch } = await import('../demo/api');
        return demoFetch(url, options);
    }
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;

    if (payload?.csrf_token) {
        document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', payload.csrf_token);
    }

    if (!response.ok) {
        const message = payload?.message || 'Something went wrong. Please try again.';
        const error = new Error(message);
        error.payload = payload;
        throw error;
    }

    return payload;
}
