import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ArrowForwardIosTwoToneIcon from '@mui/icons-material/ArrowForwardIosTwoTone';
import HorizontalCard from './CartsComponents/HorizontalCard';
import DeleteConfirmationModal from './CartsComponents/DeleteConfirmationModal';
import BuyConfirmationModal from './CartsComponents/BuyConfirmationModal';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { red, blue, grey } from '@mui/material/colors';
import Alert from '@mui/material/Alert';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Index = ({auth, carts: initialCarts }) => {

    //if no items
    function noItems(count) {

        if (count === 0) {
            return (
                <Alert variant="outlined" severity="info" sx={{width: "90%", margin: "auto"}}>
                    There is no item in your cart. Go add something!
                    Happy Eating!
                </Alert>
                );
        }
    }

    //Modal Confirmation
    const [carts, setCarts] = useState(initialCarts);
    const [modalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [modalOpenBuy, setModalOpenBuy] = useState(false);
    const [itemToBuy, setItemToBuy] = useState(null);

    //SnackBar
    const [open, setOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const handleOpenModal = (itemId) => {
        setItemToDelete(itemId);
        setModalOpen(true);
      };

      //buy
    const handleOpenModalBuy = (cart) => {
        setItemToBuy(cart);
        setModalOpenBuy(true);
      };
    
      

      const handleCloseModal = () => {
        setItemToDelete(null);
        setModalOpen(false);
      };

      const handleCloseModalBuy = () => {
        setItemToBuy(null);
        setModalOpenBuy(false);
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

    const handleConfirmBuy = async () => {
        if (itemToBuy) {
            try {
                // Place the order
                await axios.post('/orders', {
                    user_id: auth.user.id,
                    item_id: itemToBuy.item.id,
                    store_id: itemToBuy.store.id,
                    quantity: itemToBuy.quantity,
                    total_price: itemToBuy.total_price
                });
    
                // Remove item from cart
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                await fetch(`/carts/${itemToBuy.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                });
    
                // Update local state
                setCarts(carts.filter(cart => cart.id !== itemToBuy.id));
    
                // Close the modal and show success message
                handleCloseModalBuy();
                setOpen(true);
                setSnackbarMessage("Order placed successfully!");

                //refresh page
                const timer = setTimeout(() => {
                    window.location.reload();  // Refresh the page
                  }, 2000);  // 3000 milliseconds = 3 seconds
    
            } catch (error) {
                console.error('Error placing order:', error);
    
                // Handle specific errors
                if (error.response && error.response.status === 400) {
                    const errorMessage = error.response.data.message;
                    setSnackbarMessage(errorMessage);
                } else if (error.response && error.response.status === 500) {
                    const errorMessage = error.response.data.message;
                    setSnackbarMessage('The store is currently closed.');
                } else {
                    setSnackbarMessage('Placing order failed. Please try again.');
                }
                setOpen(true);
                handleCloseModalBuy();
            }
        }
    };


    const handleConfirmEWallet = async () => {
        console.log((itemToBuy.item.price)); 
        if (itemToBuy) {
            try {
                // Send the order data to the backend
                const response = await axios.post('/orders/paymongo', {
                    user_id: auth.user.id,
                    item_id: itemToBuy.item.id,
                    item_name: itemToBuy.item.name,
                    store_id: itemToBuy.store.id,
                    quantity: itemToBuy.quantity,
                    total_price: itemToBuy.total_price.toFixed(2) * 100,
                });
    
                // Redirect the user to the PayMongo checkout page
                if (response.data && response.data.checkout_url) {
                    window.location.href = response.data.checkout_url;
                }

                // Remove item from cart
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                await fetch(`/carts/${itemToBuy.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                });
    
                // Update local state
                setCarts(carts.filter(cart => cart.id !== itemToBuy.id));
                
            } catch (error) {
                console.error('Error initiating PayMongo payment:', error);
    
                // Display error message
                if (error.response && error.response.data.message) {
                    setSnackbarMessage(error.response.data.message);
                } else {
                    setSnackbarMessage('Failed to initiate payment. Please try again.');
                }
                setOpen(true);
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
                    

                        
                        <div>
                            {noItems(initialCarts.length)}
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
                                                <Button variant='contained' size="small" sx={{ backgroundColor: blue[500] }}
                                                onClick={() => handleOpenModalBuy(cart)}>Buy</Button>
                                            </HorizontalCard>

                                        ))}
                                        <br/>
                                </div>
                            ))}
                        </div>

                    
                </div>
                <DeleteConfirmationModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                />

                <BuyConfirmationModal
                    open={modalOpenBuy}
                    onClose={handleCloseModalBuy}
                    onConfirm={handleConfirmBuy}
                    onConfirmEWallet={handleConfirmEWallet}
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
