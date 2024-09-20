import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { green } from '@mui/material/colors';

export default function OrdersRadioSort({ selectedStatus, onStatusChange }) {
    // Function to handle radio button change
    const handleChange = (event) => {
      const newStatus = event.target.value;
      onStatusChange(newStatus); // Call the parent's handler to update the status
    };
    

  return (
    <FormControl sx={{padding: "1rem 1rem", backgroundColor: "white", marginTop: ".5rem", width: "100%"}}>
      {/* Change label color based on the selected value */}
      <FormLabel
        id="demo-row-radio-buttons-group-label"
        sx={{
          color: selectedStatus ? green[600] : 'inherit',
          '&.Mui-focused': {
            color: green[600],
          },
        }}
      >
        Order Status
      </FormLabel>

      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedStatus}  // Bind value to the state
        onChange={handleChange}  // Handle changes
      >
        <FormControlLabel
          value="Pending"
          control={
            <Radio
              sx={{
                color: green[600],
                '&.Mui-checked': {
                  color: green[600],
                },
              }}
            />
          }
          label="Pending"
        />
        <FormControlLabel
          value="Accepted"
          control={
            <Radio
              sx={{
                color: green[600],
                '&.Mui-checked': {
                  color: green[600],
                },
              }}
            />
          }
          label="Accepted"
        />
        <FormControlLabel
          value="Claimed"
          control={
            <Radio
              sx={{
                color: green[600],
                '&.Mui-checked': {
                  color: green[600],
                },
              }}
            />
          }
          label="Claimed"
        />
        <FormControlLabel
          value="Cancelled"
          control={
            <Radio
              sx={{
                color: green[600],
                '&.Mui-checked': {
                  color: green[600],
                },
              }}
            />
          }
          label="Cancelled"
        />
      </RadioGroup>
    </FormControl>
  );
}
