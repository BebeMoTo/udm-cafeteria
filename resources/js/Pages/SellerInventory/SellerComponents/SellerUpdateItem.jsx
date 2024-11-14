import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import axios from 'axios';

const SellerUpdateItem = ({ open, item, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    state: 0,
    image: null, // Set image to null initially
    type: '',
  });
  const [previewImage, setPreviewImage] = useState('');

  // Populate the form with item data when the modal opens
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        quantity: item.quantity || '',
        state: item.state || 0, // Ensure it's either 0 or 1
        image: null, // Do not pre-load the image in the formData, handle via preview
        type: item.type || '',
      });
      setPreviewImage(item.image_path || ''); // Set initial preview image
    }
  }, [item]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload and preview update
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file }); // Update form data with the new image file

      // Show preview of the new image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("type", formData.type);
    //formDataToSend.append("image", formData.image);

    // If no image is selected, keep the existing image path
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    } else if (item.image_path) {
      formDataToSend.append("image_path", item.image_path); // Existing image path if no new file
    }

    // Debugging: log formData content
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await axios.put(route('items.update', item.id),  Object.fromEntries(formDataToSend), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
      });
      
      console.log('Response data:', response.data);
      console.log('Request data:', response.data.request);
      // Handle response and success messages
      if (response.status === 200) {
        console.log('Item updated successfully');
        onClose(); // Close the modal after successful update
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      // Error handling logic
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
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />

        {/* Item Type Select Field */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            name="type"
            value={formData.type}
            onChange={handleChange}
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
            value={formData.state}
            onChange={handleChange}
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

export default SellerUpdateItem;
