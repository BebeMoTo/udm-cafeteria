import React, { useState } from 'react';
import axios from 'axios';
//import StoreSnackBar from './StoreSnackBar';
//import StoresItemAddModal from './StoresItemAddModal';
import { usePage } from '@inertiajs/react';
import { styled } from '@mui/material/styles';
import { blueGrey, red } from '@mui/material/colors';
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

function SellerItemInfo({ item, open, onClose, openEditModal }) {
  const { auth } = usePage().props;
  const [itemQuantity, setItemQuantity] = useState(0);
  const [loading, setLoading] = useState(false);


  const showItemTypeIcon = (type) => {
    switch (type) {
      case "Meal": return <SoupKitchenIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Drink": return <LocalCafeIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Snack": return <KebabDiningIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      default: return <BentoIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
    }
  };

  const handleDeleteItem = async () => {
    try {
      // Make the delete request to the server
      const response = await axios.delete(route('items.destroy', item.id), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      // You can do something with the response here (e.g., remove the item from the state)
      console.log(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Failed to delete item:', error.response ? error.response.data : error.message);
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
            image={`/storage${item.image_path}`}
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

            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: red[800] }}
                onClick={handleDeleteItem}
                disabled={loading}
              >
                Delete
              </Button>

              <Button
                variant="contained"
                sx={{ backgroundColor: blueGrey[800], marginLeft: '10px' }}
                onClick={() => openEditModal(item)}
                disabled={loading}
              >
                Edit Info
              </Button>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>

    </>
  );
}

SellerItemInfo.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SellerItemInfo;
