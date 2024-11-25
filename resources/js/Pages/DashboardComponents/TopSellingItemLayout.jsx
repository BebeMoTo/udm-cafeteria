// In StoreItemLayout.jsx

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
import { green, grey } from '@mui/material/colors';

export default function TopSellingItemLayout({ name, price, image, state, type, className }) {
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
        <Card className={`store-item-card ${className}`} sx={{ width: '200px', position: 'relative' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={`/storage${image}`}
                    alt={name}
                    sx={{ minHeight: "200px", maxHeight: "200px", padding: 0 }}
                />
                <CardContent>
                    <Typography noWrap gutterBottom variant="h6" component="div" sx={{ fontSize: "1rem" }}>
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {'\u20B1'} {price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {showItemTypeIcon(type)} {getItemTypeLabel(type)}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
            {state === 1 ?
            <Typography variant='button' sx={{color: green[800]}}>Available</Typography> :
            <Typography variant='button' sx={{color: grey[800]}}>Unavailable</Typography>}
            </CardActions>

        </Card>
    );
}
