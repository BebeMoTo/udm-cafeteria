import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BentoIcon from '@mui/icons-material/Bento';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500], // Set the primary color to green
    },
  },
});

export default function StoresSort({ itemType, onItemTypeChange }) {
  const handleChange = (event) => {
    onItemTypeChange(event.target.value); // Pass selected type to parent
  };

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ minWidth: "100%", }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={itemType} // Controlled component
          label="Item Type"
          onChange={handleChange}
        >
          <MenuItem value={""}><RestaurantIcon sx={{marginRight: "8px"}}/> All</MenuItem>
          <MenuItem value={"Meal"}><SoupKitchenIcon sx={{marginRight: "8px"}}/> Meals</MenuItem>
          <MenuItem value={"Drink"}><LocalCafeIcon sx={{marginRight: "8px"}}/> Drinks</MenuItem>
          <MenuItem value={"Snack"}><KebabDiningIcon sx={{marginRight: "8px"}}/> Snacks</MenuItem>
          <MenuItem value={"Others"}><BentoIcon sx={{marginRight: "8px"}}/> Others</MenuItem>
        </Select>
      </FormControl>
    </Box>
    </ThemeProvider>
  );
}
