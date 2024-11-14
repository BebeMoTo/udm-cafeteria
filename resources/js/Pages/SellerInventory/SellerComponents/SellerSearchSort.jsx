import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500], // Set the primary color to green
    },
  },
});

export default function SellerSearchSort({ items, onItemSelect }) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div>
      <ThemeProvider theme={theme}>
      <Autocomplete
        value={value}
        
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue) onItemSelect(newValue); // Trigger the item selection
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={items} // Filtered items passed from parent
        getOptionLabel={(option) => option.name} // Use item names
        sx={{ width: "100%",  
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'green', // Change border focus color
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: 'green', // Change label focus color
            },
          },
        }}
        renderInput={(params) => <TextField {...params} label="Search Items" />}
        
      />
      </ThemeProvider>
    </div>
  );
}
