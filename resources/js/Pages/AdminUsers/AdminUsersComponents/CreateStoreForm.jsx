import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextInput from '@/Components/TextInput';

export default function CreateStoreForm() {

  return (
    <Box sx={{ minWidth: 120, marginTop: "30px" }}>
      <FormControl fullWidth>
        <Typography sx={{marginTop:"8px"}}>Name: </Typography>
        <TextInput/>

        <Typography sx={{marginTop:"8px"}}>Description: </Typography>
        <TextInput/>

        <Typography sx={{marginTop:"8px"}}>Stall No: </Typography>
        <TextInput/>

        <Typography sx={{marginTop:"8px"}}>Additional Fee: </Typography>
        <TextInput/>


        <Button variant='contained' sx={{marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>
  );
}
