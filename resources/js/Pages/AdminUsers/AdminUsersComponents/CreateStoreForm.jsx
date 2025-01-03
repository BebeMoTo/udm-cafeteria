import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { grey } from '@mui/material/colors';
import TextInput from '@/Components/TextInput';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900], // Set the primary color to white
    },
  },
});

export default function CreateStoreForm({addedSnackbar, addedSnackbarMessage}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stallNo, setStallNo] = useState('');
  const [additionalFee, setAdditionalFee] = useState(0);
  const [balance, setBalance] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {

    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post('/stores', { name, description, stallNo, additionalFee, balance});
      console.log(response.data); // Handle success (e.g., show a message or redirect)
      addedSnackbar();
      addedSnackbarMessage("Store was made successfully");
      setAdditionalFee(0);
      setBalance(0);
      setName("");
      setDescription("");
      setStallNo(0);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Set validation errors
        setErrors(error.response.data.errors);
        addedSnackbar();
        if (name === "" || description === "" || stallNo === "") {
          addedSnackbarMessage("Please fill up the form.");
        } else {
          addedSnackbarMessage(errors.name || errors.description || errors.stallNo || errors.additionalFee || errors.blance || "There is an error occured while saving. Please try again later");
        }
        
        console.log('Validation errors:', error.response.data.errors);
      } else {
        console.error('There was an error submitting the form!', error);
      }
    }
  };

  return (
    <Box sx={{ minWidth: 120, marginTop: "30px", maxWidth: "600px", marginX: "auto"  }}>
      <FormControl fullWidth id='addStoreForm'>
        <TextField id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} sx={{marginTop:"8px", color: "white"}}/>

        <TextField id="outlined-basic" label="Description" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} sx={{marginTop:"8px", color: "white"}}/>

        <TextField id="outlined-basic" label="Stall No." variant="outlined" value={stallNo} onChange={(e) => setStallNo(e.target.value)} sx={{marginTop:"8px", color: "white"}}/>

        <TextField id="outlined-basic" label="Additional Fee" variant="outlined" value={additionalFee} onChange={(e) => setAdditionalFee(e.target.value)}  sx={{marginTop:"8px", color: "white"}}/>

        <TextField id="outlined-basic" label="Balance" variant="outlined" value={balance} onChange={(e) => setBalance(e.target.value)} sx={{marginTop:"8px", color: "white"}}/>

        <Button onClick={handleSubmit} variant='contained' sx={{width: "100%", maxWidth: "300px", margin: "auto", marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>

    
  );
}
