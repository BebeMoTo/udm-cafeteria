import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
//import axios from 'axios'; // Import axios

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// // Get CSRF token from the meta tag
// const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// // Set the CSRF token in the axios headers globally
// axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#0dbc5a',
    },
});
