import * as React from 'react';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextInput from '@/Components/TextInput';
import axios from 'axios';

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
    <Box sx={{ minWidth: 120, marginTop: "30px" }}>
      <FormControl fullWidth component="form" onSubmit={handleSubmit} id='addSellerForm'>
        <Typography sx={{marginTop:"8px"}}>Name: </Typography>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Email: </Typography>
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Password: </Typography>
        <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Sex: </Typography>
        <select
        style={{border: "1px solid lightgrey", borderRadius: "5px"}}
            id="sex"
            name="sex"
            className="mt-1 block w-full"
            required
            value={sex}
            onChange={(e) => setSex(e.target.value)}
        >
            <option value="" style={{color: "grey"}}>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>

        <Typography sx={{marginTop:"8px"}}>Store: </Typography>
        <select
        style={{border: "1px solid lightgrey", borderRadius: "5px"}}
            id="store"
            name="store"
            className="mt-1 block w-full"
            required
            value={storeNum}
            onChange={(e) => setStore(e.target.value)}
        >
            <option value="0" style={{color: "grey"}}>Select Store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
        </select>

        <Button onClick={handleSubmit} variant='contained' sx={{marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>
  );
}
