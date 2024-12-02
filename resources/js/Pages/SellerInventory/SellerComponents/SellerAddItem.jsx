import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import axios from 'axios';

const SellerAddItem = ({authUser, open, item, onClose, stores }) => {
    const [image, setImage] = useState("");
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [type, setType] = useState("");
    const [state, setState] = useState("");
    const [store_id, setStore_id] = useState(0);

    const [previewImage, setPreviewImage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImage(file); // Update form data with the new image file
    
          // Show preview of the new image
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };
      const isAdmin = () => {
        return (
          <FormControl fullWidth margin="dense">
            <InputLabel id="store-label">Store</InputLabel>
            <Select
              labelId="store-label"
              name="store"
              value={store_id} onChange={(e) => setStore_id(e.target.value)}
              label="Store"
            >
              {stores.map(store => (
                <MenuItem key={store.id} value={store.id}>{store.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
//handle submission
const handleSubmit = async () => {
    
    try {
      await axios.post('/items/store', {image, name, description, price, quantity, type, state, store_id}, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onClose(); // Close the modal after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Failed to add item:', error);
      // Handle errors as needed
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent>
        {/* Image Preview and Upload */}
        <Box mt={2} mb={2} textAlign="center">
          {previewImage ? (
            <img src={previewImage} alt="Item Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
          ) : (
            <p>Select an Image</p>
          )}
          <Button variant="contained" component="label" sx={{ backgroundColor: blueGrey[800] }}>
            Choose
            <input
              type="file"
              hidden
              accept="image/*"
              name="image"
              onChange={handleImageChange}
            />
          </Button>
        </Box>

        {authUser.user.type === "Admin" ? isAdmin() : ""}

        <TextField
          label="Name"
          name="name"
          value={name} onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Description"
          name="description"
          value={description} onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Price"
          name="price"
          value={price} onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Quantity"
          name="quantity"
          value={quantity} onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          margin="dense"
        />

        {/* Item Type Select Field */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            name="type"
            value={type} onChange={(e) => setType(e.target.value)}
            label="Type"
          >
            <MenuItem value="Meal">Meal</MenuItem>
            <MenuItem value="Drink">Drink</MenuItem>
            <MenuItem value="Snack">Snack</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>

        {/* Item State Select Field */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            name="state"
            value={state} onChange={(e) => setState(e.target.value)}
            label="State"
          >
            <MenuItem value={1}>Available</MenuItem>
            <MenuItem value={0}>Unavailable</MenuItem>
          </Select>
        </FormControl>

      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose} sx={{ backgroundColor: blueGrey[800] }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellerAddItem;
