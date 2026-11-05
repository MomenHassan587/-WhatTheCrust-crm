import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { realpathSync } from 'node:fs';

export default defineConfig({
    root: realpathSync('demo'),
    publicDir: false,
    plugins: [react()],
    define: {
        'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),
        'import.meta.env.VITE_STRIPE_KEY': JSON.stringify(''),
    },
    build: { outDir: '../dist-demo', emptyOutDir: true },
});
