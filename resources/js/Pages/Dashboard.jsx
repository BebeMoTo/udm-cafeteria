import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
function showStoreBalance() {
    if (auth.user.type === "Seller") {
        return auth.user.store.balance;
    }
    else {
        return
    }
}
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Dashboard</h2>}
            type={auth.user.type}
            balance={auth.user.balance}
            storeBalance={showStoreBalance()}
        >
            <Head title="Dashboard" />

            <div className="py-5">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
