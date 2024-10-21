import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CreateSelect() {
  const [create, setCreate] = React.useState('Seller');

  const handleChange = (event) => {
    setCreate(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Create</InputLabel>
        <Select
          value={create}
          label="Create"
          onChange={handleChange}
          sx={{maxWidth: "200px"}}
        >
          <MenuItem value={"Seller"}>Seller</MenuItem>
          <MenuItem value={"Store"}>Store</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
