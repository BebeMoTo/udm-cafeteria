import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

const AdminUpdateModal = ({ open, user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });

  // Populate the form with user data when the modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(formData); // Call the update function passed from the parent component
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User Info</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        
        {/* Department Select Field */}
        
        <FormControl fullWidth margin="dense">
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            name="department"
            value={formData.department}
            onChange={handleChange}
            label="Department"
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="CE">CE</MenuItem>
            <MenuItem value="CET">CET</MenuItem>
            <MenuItem value="CBA">CBA</MenuItem>
            <MenuItem value="CAS">CAS</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose} sx={{ backgroundColor: blueGrey[800] }}>Cancel</Button>
        <Button variant='contained' onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminUpdateModal;
