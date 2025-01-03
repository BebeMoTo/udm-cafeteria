import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function HorizontalCard({cartQuantity, total_price, name, price, image_path, additional_fee, children}) {
  return (
    <Card sx={{ display: 'flex', width: '100%', height: '170px' }}>
      {/* Left side with image */}
      <CardMedia
        component="img"
        sx={{ width: '30%', height: '100%' }} 
        image={`/storage${image_path}`}
        alt={name}
      />
      {/* Right side with content */}
      <Grid container sx={{ width: '80%', padding: 0 }} direction="row" justifyContent="space-between">
        <CardContent sx={{ padding: '8px 16px', '&:last-child': { marginBottom: '100px' },
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        width: "80%" }}>
          <Typography variant="h6"
          noWrap >
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Per Item Price: {price}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Quantity: {cartQuantity}
          </Typography>
          <Typography gutterBottom variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Reservation Fee: {additional_fee}
          </Typography>
          <Typography gutterBottom variant="body2"  sx={{ fontSize: '0.8rem' }}>
           <b> Total Price: {'\u20B1'}{total_price} </b>
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', padding: '0 16px 8px' }}>

          {children}

        </CardActions>
      </Grid>
    </Card>
  );
}
