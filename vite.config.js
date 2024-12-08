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
            host: '192.168.254.187',  // Replace with your local IP address
            //host: '172.16.34.19',  // Replace with your local IP address
            //host: '192.168.209.177',  // Replace with your local IP address
            //host: '192.168.9.177',  // Replace with your local IP address
        },
    },
});
