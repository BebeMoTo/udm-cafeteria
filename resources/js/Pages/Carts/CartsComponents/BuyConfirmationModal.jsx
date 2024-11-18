import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';
import { blue } from '@mui/material/colors';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "90%",
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: '15px', // Border radius
  border: 'none', // Remove border
};

export default function BuyConfirmationModal({ open, onClose, onConfirm, onConfirmEWallet }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
    >
      <Box sx={style}>
        <h2 id="delete-confirmation-title" style={{fontSize: "20px", marginBottom: "5px"}}><b>Confirm Order</b></h2>
        <p id="delete-confirmation-description">
          Are you sure you want to buy this item from the cart? Select a Payment method below.
        </p><br/>
          <div className='modalButtonsBuying'>
            <Button variant='contained' onClick={onConfirm} sx={{ backgroundColor: blue[800], marginBottom: "4px" }}>Balance</Button>
            <Button variant='contained' onClick={onConfirmEWallet} sx={{ backgroundColor: blue[800], marginBottom: "4px" }}>E-Wallet</Button>
            <Button variant='contained' onClick={onClose}  sx={{ backgroundColor: blueGrey[500] }}>Cancel</Button>
          </div>
      </Box>
    </Modal>
  );
}
