import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import axios from 'axios';

const SellerUpdateItemCopy = ({ open, item, onClose }) => {
  const [image, setImage] = useState("");
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState("");
  const [state, setState] = useState("");
  const [store_id, setStore_id] = useState(0);
  const [previewImage, setPreviewImage] = useState('');

  // Populate the form with item data when the modal opens
  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price);
      setQuantity(item.quantity);
      setState(item.state);
      setType(item.type);
      setImage(null);
      setPreviewImage(`/storage${item.image_path}` || ''); // Set initial preview image
    }
  }, [item]);

  // Handle image upload and preview update
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 

      // Show preview of the new image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //handle submission
  const handleSubmit = async () => {
    try {
      // Create FormData for handling file uploads and other form data
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }  
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('type', type);
      formData.append('state', state);
      formData.append('store_id', store_id);
  
      // Make PUT request using Axios
      await axios.post(`/items/${item.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT', // Spoof the PUT method
        },
      });
  
      // Close the modal and reload the page after successful update
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Failed to edit item:', error.response?.data);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Item Info</DialogTitle>
      <DialogContent>
        {/* Image Preview and Upload */}
        <Box mt={2} mb={2} textAlign="center">
          {previewImage ? (
            <img src={previewImage} alt="Item Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
          ) : (
            <p>No image available</p>
          )}
          <Button variant="contained" component="label" sx={{ backgroundColor: blueGrey[800] }}>
            Change Image
            <input
              type="file"
              hidden
              accept="image/*"
              name="image"
              onChange={handleImageChange}
            />
          </Button>
        </Box>

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

export default SellerUpdateItemCopy;
