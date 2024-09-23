import React, { useMemo, useState } from 'react';
// My Components
import Authenticated from "@/Layouts/AuthenticatedLayout";
import OrderSelectSort from './OrdersComponents/OrderSelectSort';
import CardPending from './OrdersComponents/CardPending';
// MaterialUI
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import { grey } from "@mui/material/colors";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// Inertia
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

const Index = ({ auth, orders: initialOrders }) => {
    const { csrfToken } = usePage().props; // Get CSRF token for axios requests

    // Use state to manage orders
    const [orders, setOrders] = useState(initialOrders);
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [loadingOrderId, setLoadingOrderId] = useState(null); // Track loading state for cancellation

    // State for Snackbar
    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    // Closing the Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };
    // Action snackBar
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

    // Filter orders based on their status
    const pendingOrders = useMemo(() => orders.filter(order => order.status === 'Pending').sort((a, b) => new Date(b.pending_time) - new Date(a.pending_time)), [orders]);
    const acceptedOrders = useMemo(() => orders.filter(order => order.status === 'Accepted').sort((a, b) => new Date(b.accepted_time) - new Date(a.accepted_time)), [orders]);
    const claimedOrders = useMemo(() => orders.filter(order => order.status === 'Claimed').sort((a, b) => new Date(b.claimed_time) - new Date(a.claimed_time)), [orders]);
    const cancelledOrders = useMemo(() => orders.filter(order => order.status === 'Cancelled').sort((a, b) => new Date(b.cancelled_time) - new Date(a.cancelled_time)), [orders]);

    const handleStatusChange = (newStatus) => setSelectedStatus(newStatus);

    // Function to handle the cancellation of an order
    const cancelOrder = (orderId) => {
        setLoadingOrderId(orderId); // Set loading state
        axios.post(`/orders/${orderId}/cancel`, {}, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            }
        })
        .then(response => {
            console.log('Order cancelled:', response.data);
            // Update the state to move the order
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'Cancelled' } : order
                )
            );
            setOpenSnack(true);
            setSnackbarMessage("Order cancelled successfully");
            const timer = setTimeout(() => {
              window.location.reload();  // Refresh the page
            }, 2000); 
        })
        .catch(error => {
            console.error('Error cancelling order:', error);
            setOpenSnack(true);
            setSnackbarMessage("Cancelling order failed.");
        })
        .finally(() => {
            setLoadingOrderId(null); // Reset loading state
        });
    };

    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Orders <Typography sx={{color: grey[500], display: "inline"}}></Typography></h2>}
            type={auth.user.type}
            balance={auth.user.balance}
        >
            <Head title="Orders"/>
            <OrderSelectSort selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />

            <div>
                {selectedStatus === "Pending" ? 
                (  pendingOrders.length !== 0 ? (
                    pendingOrders.map(order => (
                      <div key={order.id} style={{ marginBottom: "2px" }}>
                        <CardPending order={order}>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => cancelOrder(order.id)} 
                            disabled={loadingOrderId === order.id} // Disable button if loading
                          >
                            Cancel Order
                          </Button>
                        </CardPending>
                      </div>
                    ))) : 
                    (
                        <Alert
                          variant="outlined"
                          severity="info"
                          sx={{ width: "90%", margin: "auto", marginTop: "16px"  }}
                        >
                          You don't have any pending orders. Go buy something! Happy Eating!
                        </Alert>
                      )
                    ) : null}

                {selectedStatus === "Accepted" ? 
                (  acceptedOrders.length !== 0 ? (
                    acceptedOrders.map(order => (
                    <div key={order.id} style={{marginBottom: "2px"}}>
                        <CardPending order={order}></CardPending>
                    </div>
                    ))) : 
                    (
                        <Alert
                          variant="outlined"
                          severity="info"
                          sx={{ width: "90%", margin: "auto", marginTop: "16px"   }}
                        >
                          Nothing to show here.
                        </Alert>
                      )
                    ) : null}

                {selectedStatus === "Claimed" ? 
                (  claimedOrders.length !== 0 ? (
                    claimedOrders.map(order => (
                    <div key={order.id} style={{marginBottom: "2px"}}>
                        <CardPending order={order}></CardPending>
                    </div>
                    ))) : 
                    (
                        <Alert
                          variant="outlined"
                          severity="info"
                          sx={{ width: "90%", margin: "auto", marginTop: "16px"   }}
                        >
                          Nothing to show here.
                        </Alert>
                      )
                    ) : null}

                {selectedStatus === "Cancelled" ? 
                (  cancelledOrders.length !== 0 ? (
                    cancelledOrders.map(order => (
                        <div key={order.id} style={{marginBottom: "2px"}}>
                        <CardPending order={order}></CardPending>
                    </div>
                    ))) : 
                    (
                        <Alert
                          variant="outlined"
                          severity="info"
                          sx={{ width: "90%", margin: "auto", marginTop: "16px" }}
                        >
                          Nothing to show here.
                        </Alert>
                      )
                    ) : null}
            </div>

            <Snackbar
                open={openSnack}
                autoHideDuration={3000}
                onClose={handleClose}
                message={snackbarMessage}
                action={action}
            />
        </Authenticated>
    );
};

export default Index;
