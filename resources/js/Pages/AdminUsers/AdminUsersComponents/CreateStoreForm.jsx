import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextInput from '@/Components/TextInput';
import axios from 'axios';


export default function CreateStoreForm({addedSnackbar}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stallNo, setStallNo] = useState('');
  const [additionalFee, setAdditionalFee] = useState(0);
  const [balance, setBalance] = useState(0);


  const handleSubmit = async (e) => {

    e.preventDefault();
  
    try {
      const response = await axios.post('/stores', { name, description, stallNo, additionalFee, balance});
      console.log(response.data); // Handle success (e.g., show a message or redirect)
      addedSnackbar();
      setAdditionalFee(0);
      setBalance(0);
      setName("");
      setDescription("");
      setStallNo(0);
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      // Handle error (e.g., show validation errors)
    }
  };

  return (
    <Box sx={{ minWidth: 120, marginTop: "30px" }}>
      <FormControl fullWidth id='addStoreForm'>
        <Typography sx={{marginTop:"8px"}}>Name: </Typography>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Description: </Typography>
        <TextInput value={description} onChange={(e) => setDescription(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Stall No: </Typography>
        <TextInput value={stallNo} onChange={(e) => setStallNo(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Additional Fee: </Typography>
        <TextInput value={additionalFee} onChange={(e) => setAdditionalFee(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Balance: </Typography>
        <TextInput value={balance} onChange={(e) => setBalance(e.target.value)} />


        <Button onClick={handleSubmit} variant='contained' sx={{marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>

    
  );
}
