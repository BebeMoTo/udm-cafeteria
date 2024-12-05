import React, { useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { styled } from '@mui/material/styles';
import { blueGrey, red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, IconButton } from '@mui/material';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BentoIcon from '@mui/icons-material/Bento';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

function SellerItemInfo({ item, open, onClose, openEditModal, onItemDelete }) {
  const { auth } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showItemTypeIcon = (type) => {
    switch (type) {
      case "Meal": return <SoupKitchenIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Drink": return <LocalCafeIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      case "Snack": return <KebabDiningIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
      default: return <BentoIcon sx={{ marginLeft: "1px", paddingBottom: "5px", color: "grey" }} />;
    }
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(route('items.destroy', item.id), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      setSnackbarMessage(response.data.message || 'Item deleted successfully');
      setSnackbarOpen(true);

      // Notify the parent component about the deletion
      onItemDelete(item.id);
      setTimeout(() => {
        onClose(false);
      }, 1000);

    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to delete item');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
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
            {item.name} {showItemTypeIcon(item.type)} <i style={{ fontSize: "12px" }}>{auth.user.type === "Admin" ? `(${item.store.name})` : ""}</i>
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
                onClick={() => setDeleteDialogOpen(true)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteItem} color="error" autoFocus disabled={loading}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

SellerItemInfo.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
};

export default SellerItemInfo;
