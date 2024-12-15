import * as React from 'react';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StoreInfoUpdate from '../SellerStore/SellerStoreComponents/StoreInfoUpdate';
import DeleteIcon from '@mui/icons-material/Delete';
import { blueGrey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900], // Set the primary color to white
    },
  },
});

export default function Index({ auth, stores }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedStore, setSelectedStore] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleStoreUpdate = (success) => {
    setSnackbarMessage(
      success ? 'Store updated successfully!' : 'Error updating the store. Please try again.'
    );
    setSnackbarOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log(selectedStore.id)
    axios
      .delete(`/stores/${selectedStore.id}`)
      .then((response) => {
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setDeleteDialogOpen(false);

        // Optionally reload or update the store list here
        // window.location.reload(); // Reload the page to reflect changes
      })
      .catch((error) => {
        setSnackbarMessage(
          error.response?.data?.message || 'Error deleting the store. Please try again.'
        );
        setSnackbarOpen(true);
        setDeleteDialogOpen(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
    <Authenticated
      user={auth.user}
      header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Store Information</h2>}
      type={auth.user.type}
      balance={auth.user.balance}
    >
      <Head title="Store Info" />
      <div className="py-5 inside-layout-background">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControl margin="dense">
              <InputLabel id="store-label" sx={{ color: 'black' }}>
                Store
              </InputLabel>
              <Select
                labelId="store-label"
                name="store"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                label="Store"
                sx={{ minWidth: '200px', color: 'black', border: '1px solid grey' }}
              >
                <MenuItem value={0}>Select Store</MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
              <DeleteIcon /> Delete
            </Button>
          </div>

          {/* This is the form */}
          <StoreInfoUpdate store={selectedStore} onStoreUpdate={handleStoreUpdate} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this store? All items within the store will be deleted,
            and this action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{backgroundColor: blueGrey[800]}} variant='contained'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
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
    </ThemeProvider>
  );
}
