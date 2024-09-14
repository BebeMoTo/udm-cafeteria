import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function StoresSearchSort({ items, onItemSelect }) {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div>
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
        sx={{ width: "100%",  }}
        renderInput={(params) => <TextField {...params} label="Search Items" />}
        
      />
    </div>
  );
}
