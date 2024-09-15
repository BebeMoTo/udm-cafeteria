import React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey, green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { CardMedia } from '@mui/material';
import { useState } from 'react';

import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BentoIcon from '@mui/icons-material/Bento';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const DrawerContent = styled('div')(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out',
  transform: 'translateY(0)',
  '&.slide-up': {
    transform: 'translateY(-100%)',
  },
}));

function StoreItemInfo({ item, open, onClose }) {
    const [itemQuantity, setItemQuantity] = useState(0);

      // Handler for the "+" button
  const handleIncrease = () => {
    setItemQuantity(prevQuantity => Math.min(prevQuantity + 1, item.quantity));
  };

  // Handler for the "-" button
  const handleDecrease = () => {
    setItemQuantity(prevQuantity => Math.max(prevQuantity - 1, 0));
  };

  // Handler for the input change
  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= item.quantity) {
      setItemQuantity(value);
    }
  };

    const showItemTypeIcon = (type) => {
        switch (type) {
            case "Meal":
                return <SoupKitchenIcon sx={{marginLeft: "1px", paddingBottom: "5px", color: "grey"}} />;
            case "Drink":
                return <LocalCafeIcon sx={{marginLeft: "1px", paddingBottom: "5px", color: "grey"}} />;
            case "Snack":
                return <KebabDiningIcon sx={{marginLeft: "1px", paddingBottom: "5px", color: "grey"}} />;
            default:
                return <BentoIcon sx={{marginLeft: "1px", paddingBottom: "5px", color: "grey"}} />;
        }
    };

  return (
    <Root>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(80% - ${drawerBleeding}px)`,
            overflow: 'visible',
            transition: 'height 0.3s ease-in-out',
          },
        }}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          transition: 'transform 0.3s ease-in-out',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 4, color: 'text.primary' }}>

          </Typography>
        </StyledBox>

        <StyledBox sx={{ px: 2, pb: 2 }}>
            <CardMedia
                sx={{ height: 140, borderRadius: "10px", marginBottom: "1rem" }}
                image={item.image_path}
                title="green iguana"
            />
          <Typography variant='h5' sx={{pt: 1, color: 'text.primary', fontWeight: "bold" }}>
            {item.name} {showItemTypeIcon(item.type)}
          </Typography>
          
          <Typography variant="body1" color='text-secondary' gutterBottom sx={{textIndent: "1rem"}}>
            {item.description}
          </Typography> <br/>
          <Typography variant="h6" color="text-primary" sx={{fontSize: "16px"}}>
            Price: {'\u20B1'}{item.price}
          </Typography>
          <Typography variant="body2">Stock: {item.quantity}</Typography>

          <Box mt={2}>
            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                <Button onClick={handleDecrease} sx={{color: "black", fontWeight: "bold"}}>-</Button>
                <input
                    type="number"
                    value={itemQuantity}
                    onChange={handleInputChange}
                    style={{ width: "50px", textAlign: "center", borderRadius: "8px" }}
                    min="0"
                    max={item.quantity}
                />
                <Button onClick={handleIncrease} sx={{color: "black", fontWeight: "bold"}}>+</Button>
            </Box>
            <Box mt={2} sx={{display: "flex", justifyContent: "flex-end"}}>
                <Button variant="contained" sx={{backgroundColor: green[800]}}>
                Add to Cart
                </Button>
                <Button variant="contained" color="secondary" sx={{ ml: 2, backgroundColor: green[800]}}>
                Buy
                </Button>
            </Box>
          </Box>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

StoreItemInfo.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StoreItemInfo;
