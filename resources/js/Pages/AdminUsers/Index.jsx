import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Index = ({auth, users}) => {
console.log(users);
  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Manage Accounts</h2>}
    type={auth.user.type}
    balance={auth.user.balance}
    >
    <Head title="Manage Accounts" />

    <div className="py-5">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
            Dito lalabas yung accounts
        </div>
    </div>
    </AuthenticatedLayout>
  )
}

export default Index