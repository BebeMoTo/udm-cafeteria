import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, items }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Inventory</h2>}
            type={auth.user.type}
            balance={auth.user.balance}
            storeBalance={auth.user.store.balance}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {items.map(item => (
                                <div key={item.id}><b>{item.name}</b><p>{item.description}</p><br /></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
