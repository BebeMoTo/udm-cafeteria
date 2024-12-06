import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import OrderSelectSort from '../Orders/OrdersComponents/OrderSelectSort';
import SellerOrdersCardPending from './SellerOrdersComponents/SellerOrdersCardPending';
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import { blueGrey } from '@mui/material/colors';

const Index = ({auth, orders: initialOrders}) => {
    const { csrfToken } = usePage().props; 
    const [orders, setOrders] = useState(initialOrders);
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const handleStatusChange = (newStatus) => setSelectedStatus(newStatus);
    const [loadingOrderId, setLoadingOrderId] = useState(null); // Track loading state for cancellation

    console.log(initialOrders)
    //Sorting the items
    const pendingOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Pending')
            .sort((a, b) => new Date(b.pending_time) - new Date(a.pending_time)), 
        [orders]
    );
    const acceptedOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Accepted')
            .sort((a, b) => new Date(b.accepted_time) - new Date(a.accepted_time)), 
        [orders]
    );
    //Just added
    const readyOrders = useMemo(() => orders.filter(order => order.status === 'Ready').sort((a, b) => new Date(b.ready_time) - new Date(a.ready_time)), [orders]);
    
    const claimedOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Claimed')
            .sort((a, b) => new Date(b.claimed_time) - new Date(a.claimed_time)), 
        [orders]
    );
    const cancelledOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Cancelled')
            .sort((a, b) => new Date(b.cancelled_time) - new Date(a.cancelled_time)), 
        [orders]
    );
    //End of sorting the items


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
          const timer = setTimeout(() => {
            window.location.reload();  // Refresh the page
          }, 2000); 
      })
      .catch(error => {
          console.error('Error cancelling order:', error);
      })
      .finally(() => {
          setLoadingOrderId(null); // Reset loading state
      });
  };

  //Accept order
  const acceptOrder = (orderId) => {
    setLoadingOrderId(orderId); // Set loading state
    axios.post(`/orders/${orderId}/accept`, {}, {
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        }
    })
    .then(response => {
        console.log('Order accepted:', response.data);
        // Update the state to reflect the order's new status
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: 'Accepted' } : order
            )
        );
    })
    .catch(error => {
        console.error('Error accepting order:', error);
    })
    .finally(() => {
        setLoadingOrderId(null); // Reset loading state
    });
};


  //Ready order
  const readyOrder = (orderId) => {
    setLoadingOrderId(orderId); // Set loading state
    axios.post(`/orders/${orderId}/ready`, {}, {
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        }
    })
    .then(response => {
        console.log('Order Ready:', response.data);
        // Update the state to reflect the order's new status
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: 'Ready' } : order
            )
        );
        const timer = setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 2000); 
    })
    .catch(error => {
        console.error('Error making order ready:', error);
    })
    .finally(() => {
        setLoadingOrderId(null); // Reset loading state
    });
};


  return (
    <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Orders</h2>}
    type={auth.user.type}
    balance={auth.user.balance}
    storeBalance={auth.user.store.balance}
    >
        <Head title="Orders"/>
        <OrderSelectSort selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />




        <div style={{padding: ""}}>
                {selectedStatus === "Pending" ? 
                (  pendingOrders.length !== 0 ? (
                    pendingOrders.map(order => (
                      <div key={order.id} style={{ marginBottom: "2px", position: "relative" }}>
                        <SellerOrdersCardPending order={order}>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => cancelOrder(order.id)} 
                            disabled={loadingOrderId === order.id} // Disable button if loading
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="contained"
                            sx={{backgroundColor: blueGrey[800]}}
                            onClick={() => acceptOrder(order.id)} 
                            disabled={loadingOrderId === order.id} // Disable button if loading
                          >
                            Accept
                          </Button>
                        </SellerOrdersCardPending>
                      </div>
                    ))) : 
                    (
                        <Alert
                          variant="outlined"
                          severity="info"
                          sx={{ width: "90%", margin: "auto", marginTop: "16px"  }}
                        >
                          You don't have any pending orders right now
                        </Alert>
                      )
                    ) : null}

                {selectedStatus === "Accepted" ? 
                (  acceptedOrders.length !== 0 ? (
                    acceptedOrders.map(order => (
                    <div key={order.id} style={{marginBottom: "2px"}}>
                        <SellerOrdersCardPending order={order}>
                          {/*<p style={{fontSize: "12px"}}>Time Accepted: {order.accepted_time}</p>*/}
                          <Button
                            variant="contained"
                            sx={{backgroundColor: blueGrey[800]}}
                            onClick={() => readyOrder(order.id)} 
                            disabled={loadingOrderId === order.id} // Disable button if loading
                          >
                            Make Ready
                          </Button>
                        </SellerOrdersCardPending>
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

                {selectedStatus === "Ready" ? 
                (  readyOrders.length !== 0 ? (
                    readyOrders.map(order => (
                    <div key={order.id} style={{marginBottom: "2px"}}>
                        <SellerOrdersCardPending order={order}>
                          <p style={{fontSize: "12px"}}>Time Ready: {order.ready_time}</p>
                        </SellerOrdersCardPending>
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
                        <SellerOrdersCardPending order={order}>
                          <p style={{fontSize: "12px"}}>Time Claimed: {order.claimed_time}</p>
                        </SellerOrdersCardPending>
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
                        <SellerOrdersCardPending order={order}>
                        <p style={{fontSize: "12px"}}>Time Cancelled: {order.cancelled_time}</p>
                        </SellerOrdersCardPending>
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
    </AuthenticatedLayout>
  )
}

export default Index