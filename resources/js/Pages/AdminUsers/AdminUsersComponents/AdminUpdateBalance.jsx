import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

const AdminUpdateBalance = ({ open, user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    balance: '',
  });

  // Populate the form with user data when the modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        balance: user.balance || '',
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
      <DialogTitle>Edit User Balance</DialogTitle>
      <DialogContent>
        <TextField
          label="Balance"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose} sx={{ backgroundColor: blueGrey[800], color: "white" }}>Cancel</Button>
        <Button variant='contained' onClick={handleSubmit} sx={{backgroundColor: "green", color:"white"}}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminUpdateBalance;
