import * as React from 'react';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StoreInfoUpdate from './SellerStoreComponents/StoreInfoUpdate';

export default function Index({ auth, store }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      storeBalance={auth.user.store.balance}
    >
      <Head title="Store Info" />
      <div className="py-5 inside-layout-background">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
          <StoreInfoUpdate store={store} onStoreUpdate={handleStoreUpdate} />
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
