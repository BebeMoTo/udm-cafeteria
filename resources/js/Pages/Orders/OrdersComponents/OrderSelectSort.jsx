import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { green } from '@mui/material/colors';

export default function OrdersSelectSort({ selectedStatus, onStatusChange }) {
    // Function to handle Select change
    const handleChange = (event) => {
        const newStatus = event.target.value;
        onStatusChange(newStatus); // Call the parent's handler to update the status
    };

    return (
        <Box sx={{ minWidth: 120, padding: "1rem 1rem", backgroundColor: "white", marginTop: ".5rem", width: "100%" }}>
            <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: green[600],
                    },
                    '&:hover fieldset': {
                        borderColor: green[600],
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: green[600],
                    },
                },
            }}>
                <InputLabel id="order-status-select-label" sx={{ color: green[600], '&.Mui-focused': { color: green[600] } }}>Order Status</InputLabel>
                <Select
                    labelId="order-status-select-label"
                    id="order-status-select"
                    value={selectedStatus}  // Bind value to the state
                    label="Order Status"
                    onChange={handleChange}  // Handle changes
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Accepted">Accepted</MenuItem>
                    <MenuItem value="Ready">Ready</MenuItem>
                    <MenuItem value="Claimed">Claimed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
