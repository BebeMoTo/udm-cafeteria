import * as React from 'react';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { blueGrey } from '@mui/material/colors';
import TextInput from '@/Components/TextInput';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';

export default function Index({ auth, stores }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [userId, setUserId] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [created_at, setCreated_at] = useState(new Date().toISOString());

  const [selectedItemIndi, setSelectedItemIndi] = useState(0);
  const [quantityIndi, setQuantityIndi] = useState(0);
  const [created_atIndi, setCreated_atIndi] = useState(new Date().toISOString());
  const [totalPriceIndi, setTotalPriceIndi] = useState(0);

  
  console.log(userId, quantity, totalPrice, created_at);

  const handleSubmitOrder = async () => {
    if (!selectedStore || !selectedItem || !quantity || !totalPrice || !created_at) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }
  
    const payload = {
      user_id: userId, // If user_id is optional, handle accordingly
      item_id: selectedItem.id,
      store_id: selectedStore.id,
      quantity,
      total_price: totalPrice,
      created_at,
    };
  
    try {
      const response = await axios.post(route('orders.physicalPayment'), payload, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
  
      setSnackbarMessage(response.data.message || 'Order submitted successfully!');
      setSnackbarOpen(true);
  
      // Optionally, reset form fields after submission
      setQuantity(0);
      setTotalPrice(0);
      setCreated_at(new Date().toISOString());
      setSelectedItem(0);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to submit the order. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleSubmitOrderIndi = async () => {
    if (!selectedStore || !selectedItemIndi || !quantityIndi || !totalPriceIndi || !created_atIndi) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }
  
    const payload = {
      user_id: userId, // If user_id is optional, handle accordingly
      item_id: selectedItemIndi.id,
      store_id: selectedStore.id,
      quantity: 1,
      total_price: totalPriceIndi,
      created_at: created_atIndi,
    };
  
    try {
      for (let index = 0; index < quantityIndi; index++) {
        const response = await axios.post(route('orders.physicalPayment'), payload, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        setSnackbarMessage(response.data.message || 'Order submitted successfully!');
        setSnackbarOpen(true);
      }
  
  
      // Optionally, reset form fields after submission
      setQuantityIndi(0);
      setTotalPriceIndi(0);
      setCreated_atIndi(new Date().toISOString());
      setSelectedItemIndi(0);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to submit the order. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };
  

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


  console.log(selectedItem);
  

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
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControl margin="dense">
              <InputLabel id="store-label" sx={{ color: 'white' }}>
                Store
              </InputLabel>
              <Select
                labelId="store-label"
                name="store"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                label="Items"
                sx={{ minWidth: '200px', color: 'white', border: '1px solid grey' }}
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>


          {/* This is the form */}
        <div className='adminPhysicalPaymentContainer'>
        <div>
        <FormControl margin="dense">
              <InputLabel id="store-label" sx={{ color: 'white' }}>
                Items
              </InputLabel>
              <Select
                labelId="store-label"
                name="store"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                label="Store"
                sx={{ minWidth: '200px', color: 'white', border: '1px solid grey' }}
              >
                {selectedStore.items.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>

              <Typography sx={{ marginTop: '16px', color: 'white' }}>Quantity: </Typography>
              <TextInput value={quantity} onChange={(e) => setQuantity(e.target.value)} />

              <Typography sx={{ marginTop: '16px', color: 'white' }}>Total Price: </Typography>
              <TextInput value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />

              <Typography sx={{ marginTop: '16px', color: 'white' }}>Date: </Typography>
                <input type="datetime-local"  value={created_at}  onChange={(e) => setCreated_at(e.target.value)}/>

                <Button variant='contained' sx={{marginTop: "16px", backgroundColor: blueGrey[800]}} onClick={handleSubmitOrder}>
                    Submit
                </Button>
        </FormControl>
        </div>

        <div>
        <FormControl margin="dense">
              <InputLabel id="store-label" sx={{ color: 'white' }}>
                Items
              </InputLabel>
              <Select
                labelId="store-label"
                name="store"
                value={selectedItemIndi}
                onChange={(e) => setSelectedItemIndi(e.target.value)}
                label="Store"
                sx={{ minWidth: '200px', color: 'white', border: '1px solid grey' }}
              >
                {selectedStore.items.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>

              <Typography sx={{ marginTop: '16px', color: 'white' }}>Quantity: </Typography>
              <TextInput value={quantityIndi} onChange={(e) => setQuantityIndi(e.target.value)} />

              <Typography sx={{ marginTop: '16px', color: 'white' }}>Total Price: </Typography>
              <TextInput value={totalPriceIndi} onChange={(e) => setTotalPriceIndi(e.target.value)} />

              <Typography sx={{ marginTop: '16px', color: 'white' }}>Date: </Typography>
                <input type="datetime-local"  value={created_atIndi}  onChange={(e) => setCreated_atIndi(e.target.value)}/>

                <Button variant='contained' sx={{marginTop: "16px", backgroundColor: blueGrey[800]}} onClick={handleSubmitOrderIndi}>
                    Submit
                </Button>
        </FormControl>
        </div>
        </div>










        </div>
      </div>


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
  );
}
