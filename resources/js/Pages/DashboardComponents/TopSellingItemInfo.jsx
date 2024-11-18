import React, { useState } from 'react';
import axios from 'axios';
import StoreSnackBar from '../Stores/StoresComponents/StoreSnackBar';
import StoresItemAddModal from '../Stores/StoresComponents/StoresItemAddModal';
import { usePage } from '@inertiajs/react';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { CardMedia } from '@mui/material';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BentoIcon from '@mui/icons-material/Bento';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

function TopSellingItemInfo({ item, open, onClose, additional_fee }) {
  const { auth } = usePage().props;
  const [itemQuantity, setItemQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(''); // Unique key for Snackbar
  const [isModalOpen, setModalOpen] = useState(false);

  const handleIncrease = () => {
    setItemQuantity(prevQuantity => Math.min(prevQuantity + 1, item.item.quantity));
  };

  const handleDecrease = () => {
    setItemQuantity(prevQuantity => Math.max(prevQuantity - 1, 0));
  };

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= item.item.quantity) {
      setItemQuantity(value);
    }
  };

  const showItemTypeIcon = (type) => {
    switch (type) {
      case "Meal": return <SoupKitchenIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Drink": return <LocalCafeIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Snack": return <KebabDiningIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      default: return <BentoIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await axios.post('/carts', {
        user_id: auth.user.id,
        item_id: item.item.id,
        store_id: item.item.store_id,
        quantity: itemQuantity,
        total_price: (itemQuantity * item.item.price) + ((itemQuantity * item.item.price) * (additional_fee * .1000)),
      });

      setSnackbarMessage('Item added to cart successfully!');
      setSnackbarKey(uuidv4()); // Generate a new key
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setSnackbarMessage('Failed to add item to cart. Please try again.');
      setSnackbarKey(uuidv4()); // Generate a new key
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = () => {
    setModalOpen(true);
  };

  const handleConfirmBuy = async () => {
    setLoading(true);
    try {
      await axios.post('/orders', {
        user_id: auth.user.id,
        item_id: item.item.id,
        store_id: item.item.store_id,
        quantity: itemQuantity,
        total_price: ((itemQuantity * item.item.price) + ((itemQuantity * item.item.price) * (additional_fee * .01))).toFixed(2)
      });

      setSnackbarMessage('Order placed successfully!');
      setSnackbarKey(uuidv4()); // Generate a new key
      setOpenSnackbar(true);

      const timer = setTimeout(() => {
        window.location.reload();  // Refresh the page
      }, 2000);  // 3000 milliseconds = 3 seconds
    } catch (error) {
      console.error('Error placing order:', error);

      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        setSnackbarMessage(errorMessage);
        setSnackbarKey(uuidv4()); // Generate a new key
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Failed to place order. Please try again.');
        setSnackbarKey(uuidv4()); // Generate a new key
        setOpenSnackbar(true);
      }
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };


  const handleConfirmEWallet = async () => {
    console.log(item.item);
    if (item.item) {
        try {
            // Send the order data to the backend
            const response = await axios.post('/orders/paymongo', {
                user_id: auth.user.id,
                item_id: item.item.id,
                item_name: item.item.name,
                store_id: item.item.store_id,
                quantity: itemQuantity,
                total_price: ((itemQuantity * item.item.price) + ((itemQuantity * item.item.price) * (additional_fee * .01))).toFixed(2) * 100,
            });

            // Redirect the user to the PayMongo checkout page
            if (response.data && response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            }

            
        } catch (error) {
            console.error('Error initiating PayMongo payment:', error);

            // Display error message
            if (error.response && error.response.data.message) {
                setSnackbarMessage(error.response.data.message);
            } else {
                setSnackbarMessage('Failed to initiate payment. Please try again.');
            }
            setOpenSnackbar(true);
        }
    }
};





  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
      >
        <Box sx={{ padding: 2 }}>
          <CardMedia
            sx={{ height: 140, borderRadius: "10px", marginBottom: "1rem" }}
            image={`/storage${item.item.image_path}`}
            title={item.item.name}
          />
          <Typography variant='h5' sx={{ fontWeight: "bold" }}>
            {item.item.name} {showItemTypeIcon(item.item.type)}
          </Typography>

          <Typography variant="body1" color='text-secondary' gutterBottom>
            {item.item.description}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: "16px" }}>
            Price: {'\u20B1'}{item.item.price}
          </Typography>
          <Typography variant="body2">Stock: {item.item.quantity}</Typography>

          <Box mt={2}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleDecrease}>-</Button>
              <input
                type="number"
                value={itemQuantity}
                onChange={handleInputChange}
                style={{ width: "60px", textAlign: "center", borderRadius: "8px" }}
                min="0"
                max={item.item.quantity}
              />
              <Button onClick={handleIncrease}>+</Button>
            </Box>

            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: green[800] }}
                onClick={handleAddToCart}
                disabled={loading || itemQuantity === 0}
              >
                {loading ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                variant="contained"
                sx={{ backgroundColor: green[800], marginLeft: '10px' }}
                onClick={handleBuyItem}
                disabled={loading || itemQuantity === 0}
              >
                {loading ? "Buying..." : "Buy"}
              </Button>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Snackbar for feedback */}
      <StoreSnackBar
        key={snackbarKey} // Use unique key
        message={snackbarMessage}
        openSnackbar={openSnackbar}
        handleClose={handleSnackbarClose}
      />

      <StoresItemAddModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmBuy}
        onConfirmEWallet={handleConfirmEWallet}
      />
    </>
  );
}

TopSellingItemInfo.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TopSellingItemInfo;
