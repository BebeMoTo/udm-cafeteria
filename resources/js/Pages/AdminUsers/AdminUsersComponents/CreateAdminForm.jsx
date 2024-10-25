import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextInput from '@/Components/TextInput';

export default function CreateAdminForm() {

  return (
    <Box sx={{ minWidth: 120, marginTop: "30px" }}>
      <FormControl fullWidth>
        <Typography sx={{marginTop:"8px"}}>Name: </Typography>
        <TextInput/>

        <Typography sx={{marginTop:"8px"}}>Email: </Typography>
        <TextInput/>

        <Typography sx={{marginTop:"8px"}}>Password: </Typography>
        <TextInput/>

        <Typography sx={{marginTop:"8px"}}>Sex: </Typography>
        <select
        style={{border: "1px solid lightgrey", borderRadius: "5px"}}
            id="sex"
            name="sex"
            className="mt-1 block w-full"
            required
        >
            <option value="" style={{color: "grey"}}>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>

        <Button variant='contained' sx={{marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>
  );
}
