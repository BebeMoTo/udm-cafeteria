import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Grid from '@mui/material/Grid';
import { Button, Paper, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import { grey } from '@mui/material/colors';

const Index = ({auth, stores}) => {
    //Sort the stores by stall_no
    const sortedStores = [...stores].sort((a, b) => a.stall_no - b.stall_no);
  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Stores</h2>}
    type={auth.user.type}
    balance={auth.user.balance}
    >
    <Head title="Stores" />

    <div className="py-5">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
            <Grid container spacing={2}>
                {sortedStores.map(store => (
                    <Grid key={store.id} item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Paper style={{ backgroundColor: '#c5e1a5', 
                            padding: '10px 10px',
                            backgroundImage: 'url(/images/backgroundGreenCircle.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                         }}>
                            {store.state === 1 ? 
                            <Link href={`/stores/${store.id}`} style={{ textDecoration: 'none' }}>
                                <Typography fontSize={"10px"} sx={{backgroundColor: grey[500], color: "#000000", padding: "5px 8px", borderRadius: "5px", display: "inline"}}>Stall no: {store.stall_no}</Typography> 
                                <Typography noWrap style={{fontWeight: 700, fontSize: "1.3rem"}}
                                    gutterBottom>{store.name}</Typography>
                                <Typography gutterBottom>{store.description}</Typography>
                                <Typography style={{fontSize: "10px"}}>Additional Fee: {store.additional_fee}</Typography>
                            </Link> : 
                                
                            <div>
                                <Typography fontSize={"10px"} sx={{backgroundColor: grey[500], color: "#000000", padding: "5px 8px", borderRadius: "5px", display: "inline"}}>Stall no: {store.stall_no}</Typography> 
                                <Typography noWrap style={{fontWeight: 700, fontSize: "1.3rem"}}
                                    gutterBottom>{store.name}</Typography>
                                <Typography gutterBottom>{store.description}</Typography>
                                <Typography style={{fontSize: "10px"}}>Additional Fee: {store.additional_fee}</Typography>
                            </div>}
                        </Paper>
                        <div>
                            {store.state === 0 ? 
                            <Typography variant='button' sx={{marginTop: "5px"}} color='error' >Closed</Typography> :
                            <Typography variant='button' sx={{marginTop: "5px"}} color='success' >Open</Typography>}
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    </div>
    </AuthenticatedLayout>
  )
}

export default Index