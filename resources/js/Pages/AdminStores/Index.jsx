import * as React from 'react';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StoreInfoUpdate from '../SellerStore/SellerStoreComponents/StoreInfoUpdate';


import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Index({ auth, stores }) {
    console.log(stores)

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedStore, setSelectedStore] = useState(1);

  console.log(selectedStore);
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleStoreUpdate = (success) => {
    if (success) {
      setSnackbarMessage('Store updated successfully!');
    } else {
      setSnackbarMessage('Error updating the store. Please try again.');
    }
    setSnackbarOpen(true);
  };

  return (
    <Authenticated
      user={auth.user}
      header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Store Information</h2>}
      type={auth.user.type}
      balance={auth.user.balance}
    >
      <Head title="Store Info" />
      <div className="py-5 inside-layout-background">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">



          <FormControl margin="dense">
            <InputLabel id="store-label" sx={{color: "white"}}>Store</InputLabel>
            <Select
              labelId="store-label"
              name="store"
              value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}
              label="Store"
              sx={{minWidth: "200px",color: "white", border: "1px solid grey"}}
            >
              {stores.map(store => (
                <MenuItem key={store.id} value={store}>{store.name}</MenuItem>
              ))}
            </Select>
          </FormControl>


              {/*This is the form*/}
          <StoreInfoUpdate store={selectedStore} onStoreUpdate={handleStoreUpdate} />
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Authenticated>
  );
}
