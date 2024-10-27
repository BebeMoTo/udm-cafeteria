import * as React from 'react';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Box from '@mui/material/Box';
import { Typography, Button, FormControl } from '@mui/material';
import TextInput from '@/Components/TextInput';

export default function CreateAdminForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState('');
  const [storeNum, setStore] = useState(null);
  const type = "Admin";

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    console.log('Form submitted', { name, email, password, sex, storeNum, type });
    
    // Submit form data to the Inertia controller route
    Inertia.post('/users', { name, email, password, sex, storeNum, type });
  };

  return (
    <Box sx={{ minWidth: 120, marginTop: "30px" }}>
      <FormControl fullWidth onSubmit={handleSubmit} id='addAdminForm'>
        <Typography sx={{marginTop:"8px"}}>Name: </Typography>
        <TextInput value={name} onChange={(e) => setName(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Email: </Typography>
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Password: </Typography>
        <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Typography sx={{marginTop:"8px"}}>Sex: </Typography>
        <select
        style={{border: "1px solid lightgrey", borderRadius: "5px"}}
            id="sex"
            name="sex"
            className="mt-1 block w-full"
            required
            value={sex}
            onChange={(e) => setSex(e.target.value)}
        >
            <option value="" style={{color: "grey"}}>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>

        <Button onClick={handleSubmit} variant='contained' sx={{marginTop: "2rem"}}>Submit</Button>
      </FormControl>
    </Box>
  );
}
