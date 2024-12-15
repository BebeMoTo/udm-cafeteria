import * as React from 'react';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
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

export default function CreateSellerForm({stores, addedSnackbar, addedSnackbarMessage}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState('');
  const [storeNum, setStore] = useState(0);
  const type = "Seller";
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Submit form data to the Inertia controller route
        try {
      const response = await axios.post('/users', { name, email, password, sex, storeNum: storeNum || null, type });
      console.log(response.data); // Handle success (e.g., show a message or redirect)
      addedSnackbar();
      addedSnackbarMessage("Seller Successfully Added!");
      setStore(0);
      setSex("");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Set validation errors
        setErrors(error.response.data.errors);
        addedSnackbar();
        if (name === "" || email === "" || password === "" || sex === "" || storeNum === 0) {
          addedSnackbarMessage("Please fill up the form.");
        }
        else {
          addedSnackbarMessage(errors.name || errors.email || errors.password || errors.sex || errors.storeNum || "There is an error occured while saving. Please try again later");
        }

        console.log('Validation errors:', error.response.data.errors);
      } else {
        console.error('There was an error submitting the form!', error);
      }
    }
  };

  return (
    <Box sx={{ minWidth: 120, marginTop: "30px", maxWidth: "600px", marginX: "auto" }}>
      <FormControl fullWidth component="form" onSubmit={handleSubmit} id='addSellerForm'>

        <TextField id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} sx={{marginTop:"8px", color: "white"}}/>

        <TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{marginTop:"8px", color: "white"}}/>

        <TextField id="outlined-basic" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} sx={{marginTop:"8px", color: "white"}}/>

        <FormControl fullWidth sx={{ marginTop: '16px', color: 'white' }}>
        <InputLabel id="demo-simple-select-label">Sex</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginTop: '16px', color: 'white' }}>
        <InputLabel id="demo-simple-select-label">Store</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Store"
            value={storeNum}
            onChange={(e) => setStore(e.target.value)}
          >
            <MenuItem value={"0"}>Select Store</MenuItem>
            {stores.map(store => (
              <MenuItem key={store.id} value={store.id}>{store.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={handleSubmit} variant='contained' sx={{width: "100%", maxWidth: "300px", margin: "auto", marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>
  );
}
