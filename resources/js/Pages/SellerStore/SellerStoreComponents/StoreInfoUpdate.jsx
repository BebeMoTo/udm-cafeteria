import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;
import { Inertia } from '@inertiajs/inertia';


export default function StoreInfoUpdate({auth, store}) {
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
            state: storeState, // Ensure the key matches backend validation
            additional_fee,
        });
        console.log(response.data); // Handle success (e.g., show a message or refresh data)
    } catch (error) {
        console.error('There was an error updating the store!', error);
    }
};


  return (

    <Box sx={{ minWidth: 120, marginTop: "30px", maxWidth: "600px", marginX: "auto" }}>
      <FormControl fullWidth component="form" onSubmit={handleSubmit} id='addSellerForm'>
        <Typography sx={{marginTop:"16px", color: "white"}}>Name: </Typography>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />

        <Typography sx={{marginTop:"16px", color: "white"}}>Description: </Typography>
        <TextInput value={description} onChange={(e) => setDescription(e.target.value)} />

        <Typography sx={{marginTop:"16px", color: "white"}}>Additional Fee: </Typography>
        <TextInput value={additional_fee} onChange={(e) => setAdditional_fee(e.target.value)} />

        <Typography sx={{marginTop:"16px", color: "white"}}>Sex: </Typography>
        <select
        style={{border: "1px solid lightgrey", borderRadius: "5px"}}
            id="state"
            name="state"
            className="mt-1 block w-full"
            required
            value={storeState}
            onChange={(e) => setStoreState(e.target.value)}
        >
            <option value={1}>Open</option>
            <option value={0}>Close</option>
        </select>

        <Button onClick={handleSubmit} variant='contained' sx={{width: "100%", maxWidth: "150px", margin: "auto", marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>
  );
}
