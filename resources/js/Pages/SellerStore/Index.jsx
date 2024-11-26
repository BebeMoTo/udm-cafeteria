import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import StoreInfoUpdate from './SellerStoreComponents/StoreInfoUpdate';


export default function Index({auth, store}) {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [storeState, setStoreState] = useState('');
//   const [additional_fee, setAdditional_fee] = useState('');

//   useEffect(() => {
//     if (store) {
//         setName(store.name);
//         setDescription(store.description);
//         setStoreState(store.state);
//         setAdditional_fee(store.additional_fee);
//     }
//   }, [store]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//         const response = await axios.put(route('stores.update', { store: store.id }), {
//             name,
//             description,
//             state: storeState, // Ensure the key matches backend validation
//             additional_fee,
//         });
//         console.log(response.data); // Handle success (e.g., show a message or refresh data)
//         Inertia.replace(route('store.index'));
//     } catch (error) {
//         console.error('There was an error updating the store!', error);
//     }
// };


  return (
    <Authenticated
    user={auth.user}
    header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Store Information</h2>}
    type={auth.user.type}
    balance={auth.user.balance}
    storeBalance={auth.user.store.balance}
    >
    
    <Head title="Store Info" />
    <div className="py-5 inside-layout-background">
    <div className="mx-auto px-3 sm:px-6 lg:px-8">

    <StoreInfoUpdate store={store} />

    </div>
    </div>
    </Authenticated>
  );
}
