import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import FormControl from '@mui/material/FormControl';
import TextInput from '@/Components/TextInput';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900], // Set the primary color to white
    },
  },
});

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;

export default function StoreInfoUpdate({ store, onStoreUpdate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [storeState, setStoreState] = useState('');
  const [additional_fee, setAdditional_fee] = useState('');

  useEffect(() => {
    if (store) {
      setName(store.name);
      setDescription(store.description);
      setStoreState(store.state);
      setAdditional_fee(store.additional_fee);
    }
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/stores/${store.id}`, {
        name,
        description,
        state: storeState,
        additional_fee,
      });
      console.log(response.data);
      onStoreUpdate(true); // Notify parent of success
    } catch (error) {
      console.error('There was an error updating the store!', error);
      onStoreUpdate(false); // Notify parent of failure
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ minWidth: 120, marginTop: '30px', maxWidth: '600px', marginX: 'auto' }}>
      <FormControl fullWidth component="form" onSubmit={handleSubmit} id="addSellerForm">
        <TextField id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} sx={{ marginTop: '16px', color: 'white' }}/>

        <TextField id="outlined-basic" label="Description" variant="outlined"  value={description} onChange={(e) => setDescription(e.target.value)} sx={{ marginTop: '16px', color: 'white' }}/>

        <TextField id="outlined-basic" label="Additional Fee" variant="outlined"  value={additional_fee} onChange={(e) => setAdditional_fee(e.target.value)} sx={{ marginTop: '16px', color: 'white' }}/>

        <FormControl fullWidth sx={{ marginTop: '16px', color: 'white' }}>
        <InputLabel id="demo-simple-select-label">State</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="State"
            value={storeState}
            onChange={(e) => setStoreState(e.target.value)}
          >
            <MenuItem value={0}>Close</MenuItem>
            <MenuItem value={1}>Open</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          sx={{ width: '100%', maxWidth: '150px', margin: 'auto', marginTop: '2rem' }}
        >
          Submit
        </Button>
      </FormControl>
    </Box></ThemeProvider>
  );
}
