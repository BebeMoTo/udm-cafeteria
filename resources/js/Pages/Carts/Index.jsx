import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ArrowForwardIosTwoToneIcon from '@mui/icons-material/ArrowForwardIosTwoTone';
import HorizontalCard from './CartsComponents/HorizontalCard';
import DeleteConfirmationModal from './CartsComponents/DeleteConfirmationModal';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { red, blue, grey } from '@mui/material/colors';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Index = ({auth, carts: initialCarts }) => {

    //Modal Confirmation
    const [carts, setCarts] = useState(initialCarts);
    const [modalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    //SnackBar
    const [open, setOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const handleOpenModal = (itemId) => {
        setItemToDelete(itemId);
        setModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setItemToDelete(null);
        setModalOpen(false);
      };

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

      //Action snackBar
      const action = (
        <React.Fragment>

          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );
    
      const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                await fetch(`/carts/${itemToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                });
                setCarts(carts.filter(cart => cart.id !== itemToDelete)); // Remove deleted item from the local state

                handleCloseModal(); // Close the modal after deletion

                //open the snackBar
                setOpen(true);
                setSnackbarMessage("Item deleted successfully");
            } catch (error) {
                console.error('Error deleting item:', error);
                setOpen(true);
                setSnackbarMessage("There is an error deleting the item");
            }
        }
    };
    

    const groupedByStore = carts.reduce((acc, cart) => {
        const storeName = cart.store.name;
        if (!acc[storeName]) {
            acc[storeName] = [];
        }
        acc[storeName].push(cart);
        return acc;
    }, {});



    return (
        <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Cart <Typography sx={{color: grey[500], display: "inline"}}>({initialCarts.length})</Typography></h2>}
        type={auth.user.type}
        balance={auth.user.balance}
        >
        <Head title="Cart" />

            <div className="py-5">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2">

                        
                        <div>
                            {Object.entries(groupedByStore).map(([storeName, storeCarts]) => (
                                <div key={storeName}>
                                    

                                    <Link href={`/stores/${storeCarts[0].store_id}`} style={{ textDecoration: 'none' }}>
                                    <Typography 
                                    variant='h5' fontWeight={400} fontSize={"24px"} sx={{marginBottom: "8px", fontVariant: "small-caps", fontWeight: "bold"}}
                                    ><StorefrontOutlinedIcon fontSize='big' sx={{paddingBottom: "2px"}}/> {storeName}<ArrowForwardIosTwoToneIcon fontSize='big' sx={{paddingBottom: "2px", color: "grey"}}/></Typography> {/* Store Name */}
                                    </Link>

                                        {storeCarts.map((cart) => (


                                            <HorizontalCard
                                            key = {cart.id}
                                            cartQuantity = {cart.quantity}
                                            total_price = {cart.total_price}
                                            name = {cart.item.name}
                                            price = {cart.item.price}
                                            image_path = {cart.item.image_path}
                                            additional_fee = {cart.store.additional_fee}
                                            >
                                                <Button variant='contained' sx={{ backgroundColor: red[400] }} size="small" onClick={() => handleOpenModal(cart.id)} >Delete</Button>
                                                <Button variant='contained' size="small" sx={{ backgroundColor: blue[500] }}>Buy</Button>
                                            </HorizontalCard>

                                        ))}
                                        <br/>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                <DeleteConfirmationModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                />

                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    message={snackbarMessage}
                    action={action}
                    />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
