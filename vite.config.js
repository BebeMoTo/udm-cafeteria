import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: true,  // This allows the Vite server to be accessed over the network
        port: 5173,  // The default Vite port
        hmr: {
            host: '192.168.254.143',  // Replace with your local IP address
        },
    },
});
