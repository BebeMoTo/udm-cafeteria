import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { CardMedia } from '@mui/material';
import { usePage } from '@inertiajs/react';

import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BentoIcon from '@mui/icons-material/Bento';

function StoreItemInfo({ item, open, onClose }) {
  const { auth } = usePage().props; // Assuming user data is passed as 'auth'
  const [itemQuantity, setItemQuantity] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state

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
        user_id: auth.user.id, // Pass user ID from authenticated user
        item_id: item.id,
        store_id: item.store_id,
        quantity: itemQuantity,
        total_price: itemQuantity * item.price
      });

      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
              style={{ width: "50px", textAlign: "center", borderRadius: "8px" }}
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
          </Box>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}

StoreItemInfo.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StoreItemInfo;
