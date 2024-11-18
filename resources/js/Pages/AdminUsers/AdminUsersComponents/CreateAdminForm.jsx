import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button, FormControl } from '@mui/material';
import TextInput from '@/Components/TextInput';
import axios from 'axios';

export default function CreateAdminForm({addedSnackbar, addedSnackbarMessage}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState('');
  const [storeNum, setStore] = useState(null);
  const type = "Admin";
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {

    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post('/users', { name, email, password, sex, storeNum: storeNum || null, type });
      console.log(response.data); // Handle success (e.g., show a message or redirect)
      addedSnackbar();
      addedSnackbarMessage("Admin Successfully Added!");
      setStore(null);
      setSex("");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Set validation errors
        setErrors(error.response.data.errors);
        addedSnackbar();
        if (name === "" || email === "" || password === "" || sex === "") {
          addedSnackbarMessage("Please fill up the form.");
        }
        else {
          addedSnackbarMessage(errors.name || errors.email || errors.password || errors.sex || "There is an error occured while saving. Please try again later");
        }

        console.log('Validation errors:', error.response.data.errors);
      } else {
        console.error('There was an error submitting the form!', error);
      }
    }
  };


  return (
    <Box sx={{ minWidth: 120, marginTop: "30px", maxWidth: "600px", marginX: "auto" }}>
      <FormControl fullWidth onSubmit={handleSubmit} id='addAdminForm'>
        <Typography sx={{marginTop:"8px", color: "white"}}>Name: </Typography>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />

        <Typography sx={{marginTop:"8px", color: "white"}}>Email: </Typography>
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />

        <Typography sx={{marginTop:"8px", color: "white"}}>Password: </Typography>
        <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Typography sx={{marginTop:"8px", color: "white"}}>Sex: </Typography>
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

        <Button onClick={handleSubmit} variant='contained' sx={{width: "100%", maxWidth: "300px", margin: "auto", marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>
  );
}
