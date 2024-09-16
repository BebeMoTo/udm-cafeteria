//React
import React, { useState } from 'react';
//axios
import axios from 'axios';
//My components
import StoreSnackBar from './StoreSnackBar';
import StoresItemAddModal from './StoresItemAddModal';
//inertia
import { usePage } from '@inertiajs/react';
//materialUI
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { CardMedia } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BentoIcon from '@mui/icons-material/Bento';
//others
import PropTypes from 'prop-types';



function StoreItemInfo({ item, open, onClose }) {
  const { auth } = usePage().props; // Assuming user data is passed as 'auth'
  const [itemQuantity, setItemQuantity] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); //snackbar kuo

  //buying the item
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const handleConfirmBuy = async () => {
    setLoading(true);
    try {
      await axios.post('/carts', {
        user_id: auth.user.id,
        item_id: item.id,
        store_id: item.store_id,
        quantity: itemQuantity,
        total_price: itemQuantity * item.price
      });

      setSnackbarMessage('Item added to cart successfully!');
      setOpenSnackbar(true);  // Open snackbar on success
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setSnackbarMessage('Failed to add item to cart. Please try again.');
      setOpenSnackbar(true);  // Open snackbar on failure
    } finally {
      setLoading(false);
    }
  };

  // Handler for the "+" button
  const handleIncrease = () => {
    setItemQuantity(prevQuantity => Math.min(prevQuantity + 1, item.quantity));
  };

  // Handler for the "-" button
  const handleDecrease = () => {
    setItemQuantity(prevQuantity => Math.max(prevQuantity - 1, 0));
  };

  // Handler for the input change
  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= item.quantity) {
      setItemQuantity(value);
    }
  };

  // Show the correct icon based on the item type
  const showItemTypeIcon = (type) => {
    switch (type) {
      case "Meal": return <SoupKitchenIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Drink": return <LocalCafeIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Snack": return <KebabDiningIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      default: return <BentoIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
    }
  };

  // Handle "Add to Cart" click
    const handleAddToCart = async () => {
      setLoading(true);
      try {
        await axios.post('/carts', {
          user_id: auth.user.id,
          item_id: item.id,
          store_id: item.store_id,
          quantity: itemQuantity,
          total_price: itemQuantity * item.price
        });
  
        setSnackbarMessage('Item added to cart successfully!');
        setOpenSnackbar(true);  // Open snackbar on success
      } catch (error) {
        console.error('Error adding item to cart:', error);
        setSnackbarMessage('Failed to add item to cart. Please try again.');
        setOpenSnackbar(true);  // Open snackbar on failure
      } finally {
        setLoading(false);
      }
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
          image={item.image_path}
          title={item.name}
        />
        <Typography variant='h5' sx={{ fontWeight: "bold" }}>
          {item.name} {showItemTypeIcon(item.type)}
        </Typography>

        <Typography variant="body1" color='text-secondary' gutterBottom>
          {item.description}
        </Typography>
        <Typography variant="h6" sx={{ fontSize: "16px" }}>
          Price: {'\u20B1'}{item.price}
        </Typography>
        <Typography variant="body2">Stock: {item.quantity}</Typography>

        <Box mt={2}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleDecrease}>-</Button>
            <input
              type="number"
              value={itemQuantity}
              onChange={handleInputChange}
              style={{ width: "60px", textAlign: "center", borderRadius: "8px" }}
              min="0"
              max={item.quantity}
            />
            <Button onClick={handleIncrease}>+</Button>
          </Box>

          <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: green[800] }}
              onClick={handleAddToCart}
              disabled={loading || itemQuantity === 0} // Disable while loading or if no quantity
            >
              {loading ? "Adding..." : "Add to Cart"}
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: green[800] }}
              onClick={handleAddToCart}
              disabled={loading || itemQuantity === 0} // Disable while loading or if no quantity
            >
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
          </Box>
        </Box>
      </Box>
    </SwipeableDrawer>
    <StoreSnackBar message={snackbarMessage} openSnackbar={openSnackbar} />
    <StoresItemAddModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
    />
    </>
  );
}

StoreItemInfo.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StoreItemInfo;
