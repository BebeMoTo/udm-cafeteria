import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import StoresAccordion from './StoresComponents/StoresAccordion';

const Show = ({ auth, store, items }) => {
    console.log(items);
  return (
    <AuthenticatedLayout user={auth.user} header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Store: {store.name}</h2>} type={auth.user.type} balance={auth.user.balance}>
      <Head title={store.name} />

      <div className="py-5">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
            <StoresAccordion
            stall_no= {store.stall_no}
            store_description = {store.description}
            store_state = {store.state === 0 ? 'Closed' : 'Open'}
            additional_fee = {store.additional_fee}
            store_items_count = {items.length}/>

          <Grid container spacing={2} mt={3}>
            <Typography variant="h6">Items:</Typography>
            {items.map(item => (
              <Grid key={item.id} item xs={12} sm={6}>
                <Typography>{item.name}</Typography>
                <Typography>{item.description}</Typography>
                <Typography>Price: {item.price}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Show;
