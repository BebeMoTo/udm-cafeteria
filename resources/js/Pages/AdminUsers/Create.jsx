import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CreateSelect from './AdminUsersComponents/CreateSelect';
import CreateSellerForm from './AdminUsersComponents/CreateSellerForm';
import { usePage } from '@inertiajs/react';

const Index = ({auth, stores}) => {
  
  console.log(stores);
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
            <CreateSelect />  

            <CreateSellerForm/>
        </div>
    </div>
    </AuthenticatedLayout>
  )
}

export default Index