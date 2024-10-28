import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CreateSelect from './AdminUsersComponents/CreateSelect';
import CreateSellerForm from './AdminUsersComponents/CreateSellerForm';
import CreateAdminForm from './AdminUsersComponents/CreateAdminForm';
import CreateStoreForm from './AdminUsersComponents/CreateStoreForm';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Create = ({auth, stores}) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("Successfully Added!");

  const addedSnackbar = () => {
    setOpen(true);
  };
  const addedSnackbarMessage = (mess) => {
    setMessage(mess);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [create, setCreate] = React.useState('Seller');

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
            <CreateSelect createFunction={setCreate}/>  

          {create === "Seller" ? <CreateSellerForm stores={stores} addedSnackbar={addedSnackbar} addedSnackbarMessage={addedSnackbarMessage}/> : ""}
          {create === "Admin" ? <CreateAdminForm addedSnackbar={addedSnackbar} addedSnackbarMessage={addedSnackbarMessage}/> : ""}
          {create === "Store" ? <CreateStoreForm addedSnackbar={addedSnackbar} addedSnackbarMessage={addedSnackbarMessage}/> : ""}
        </div>
    </div>


    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
    </AuthenticatedLayout>
  )
}

export default Create;