import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CreateSelect({createFunction}) {
  const [create, setCreate] = React.useState('Store');

  useEffect(() => {
    // Notify parent component of the new value whenever it changes
    createFunction(create);
  }, [create, createFunction]);


  const handleChange = (event) => {
    setCreate(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth >
        <InputLabel sx={{color: "white"}} id="demo-simple-select-label">Create</InputLabel>
        <Select
          value={create}
          label="Create"
          onChange={handleChange}
          sx={{maxWidth: "200px", color: "white", border: "1px solid grey"}}
        >
          <MenuItem value={"Seller"}>Seller</MenuItem>
          <MenuItem value={"Admin"}>Admin</MenuItem>
          <MenuItem value={"Store"}>Store</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
