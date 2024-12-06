import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import KebabDiningIcon from '@mui/icons-material/KebabDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BentoIcon from '@mui/icons-material/Bento';
import { blueGrey, green, grey, orange, red } from '@mui/material/colors';
import { useState } from 'react';
import { Button } from '@mui/material';
import dayjs from 'dayjs';

export default function SellerItemLayout({quantity: initialQuantity, name, price, image, state, type, className, auth, itemID, item, setSnackbarMessage, setSnackbarOpen}) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const [userId, setUserId] = useState(0);
    const [item_id, setItem_id] = useState(itemID);
    const [store_id, setStore_id] = useState(item.store_id);
    const [buyAmount, setBuyAmount] = useState(1);
    const [totalPrice, setTotalPrice] = useState(price);
    const [created_at, setCreated_at] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));

    const addSubtractItem = () => {
        return (
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", flexGrow: 0, gap: "5px", width: "100%", position: "absolute", left: 0, top: "50%", padding: "0 5%"}}>
            <Button onClick={(event) => subButtonClicked(event)} variant='contained' sx={{background: blueGrey[500]}}>-</Button>
            </div>
        )
    }

    const subButtonClicked = async (event) => {
        event.stopPropagation();
        
        if (!store_id || !item_id || !quantity || !totalPrice || !created_at) {
            setSnackbarMessage('Please fill in all fields.');
            setSnackbarOpen(true);
            return;
          }
        
          const payload = {
            user_id: userId, // If user_id is optional, handle accordingly
            item_id: item_id,
            store_id: store_id,
            quantity: buyAmount,
            total_price: totalPrice,
            created_at,
          };
        
          try {
            const response = await axios.post(route('orders.physicalPayment'), payload, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
              },
            });
        
            setSnackbarMessage(response.data.message || 'Order submitted successfully!');
            setSnackbarOpen(true);
        
            // Optionally, reset form fields after submission
          } catch (error) {
            console.error("Error details:", error);
            const errorMessage =
              error.response?.data?.message || 'Failed to submit the order. Please try again.';
            setSnackbarMessage(errorMessage);
            setSnackbarOpen(true);
          }
          setQuantity(quantity - 1);

    }
    const getItemTypeLabel = (type) => {
        switch (type) {
            case "Meal":
                return "Meals";
            case "Drink":
                return "Drinks";
            case "Snack":
                return "Snacks";
            default:
                return "Others";
        }
    };

    const itemAvailable = () => {
        if (quantity > 0 && quantity <= 10) {
            return (<Typography variant='button' sx={{color: orange[800]}}>Available</Typography>)
        }
        else if (quantity == 0) {
            return (<Typography variant='button' sx={{color: red[800]}}>Out of Stock</Typography>)
        }
        else {
            return (<Typography variant='button' sx={{color: green[800]}}>Available</Typography>)
        }
    }

    const showItemTypeIcon = (type) => {
        switch (type) {
            case "Meal":
                return <SoupKitchenIcon sx={{fontSize: "12px"}} />;
            case "Drink":
                return <LocalCafeIcon sx={{fontSize: "12px"}} />;
            case "Snack":
                return <KebabDiningIcon sx={{fontSize: "12px"}} />;
            default:
                return <BentoIcon sx={{fontSize: "12px"}} />;
        }
    };

    return (
        <Card className={`store-item-card ${className}`} sx={{ maxWidth: '100%', position: 'relative' }}>
            {auth.user.type !== "User" ? <p className='inventoryQuantity'>{quantity}</p> : ""}
            <CardActionArea sx={{position: "relative"}}>
                <CardMedia
                    component="img"
                    height="140"
                    image={`/storage${image}`}
                    alt={name}
                    sx={{ minHeight: "200px", maxHeight: "200px", padding: 0 }}
                />
                <CardContent>
                    {auth.user.type !== "User" ? addSubtractItem() : ""}
                    <Typography noWrap gutterBottom variant="h6" component="div" sx={{ fontSize: "1rem" }}>
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {'\u20B1'} {price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {showItemTypeIcon(type)} {getItemTypeLabel(type)}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
            {state === 1 ?
            itemAvailable() :
            <Typography variant='button' sx={{color: grey[800]}}>Unavailable</Typography>}
            </CardActions>
        </Card>
    );
}
