import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import CardPendingAllOrders from './CardPendingAllOrders';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900], // Set the primary color to white
    },
  },
});

const Index = ({auth, allOrders}) => {
    console.log(allOrders);

    
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

  return (
    <ThemeProvider theme={theme}>
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Orders</h2>}
    type={auth.user.type}
    balance={auth.user.balance}
    >
    <Head title="Manage Accounts" />

    <div className="py-5 inside-layout-background">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
         
         {allOrders.map(order => (
            <CardPendingAllOrders order={order} key={order.id}>
                <Typography>{order.status}</Typography>
            </CardPendingAllOrders>
         ))}

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
    </ThemeProvider>
  )
}

export default Index;