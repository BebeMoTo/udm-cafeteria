import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import OrderSelectSort from '../Orders/OrdersComponents/OrderSelectSort';
import SellerOrdersCardPending from './SellerOrdersComponents/SellerOrdersCardPending';
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import { blueGrey, grey } from '@mui/material/colors';

const Index = ({ auth, orders: initialOrders }) => {
    const { csrfToken } = usePage().props;
    const [orders, setOrders] = useState(initialOrders);
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const handleStatusChange = (newStatus) => setSelectedStatus(newStatus);
    const [loadingOrderId, setLoadingOrderId] = useState(null); // Track loading state for cancellation

    // Sorting function for orders by user_id and timestamp
    const sortOrdersByUserAndTime = (orders, timeKey) => {
        return orders
            .sort((a, b) => {
                if (a.user_id === b.user_id) {
                    return new Date(b[timeKey]) - new Date(a[timeKey]);
                }
                return a.user_id - b.user_id;
            });
    };

    // Sorting the orders based on status and user
    const pendingOrders = useMemo(() => 
        sortOrdersByUserAndTime(
            orders.filter(order => order.status === 'Pending'),
            'pending_time'
        ),
        [orders]
    );

    const acceptedOrders = useMemo(() => 
        sortOrdersByUserAndTime(
            orders.filter(order => order.status === 'Accepted'),
            'accepted_time'
        ),
        [orders]
    );

    const readyOrders = useMemo(() => 
        sortOrdersByUserAndTime(
            orders.filter(order => order.status === 'Ready'),
            'ready_time'
        ),
        [orders]
    );

    const claimedOrders = useMemo(() => 
        sortOrdersByUserAndTime(
            orders.filter(order => order.status === 'Claimed'),
            'claimed_time'
        ),
        [orders]
    );

    const cancelledOrders = useMemo(() => 
        sortOrdersByUserAndTime(
            orders.filter(order => order.status === 'Cancelled'),
            'cancelled_time'
        ),
        [orders]
    );

    // Cancel order function
    const cancelOrder = (orderId) => {
        setLoadingOrderId(orderId);
        axios.post(`/orders/${orderId}/cancel`, {}, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            }
        })
        .then(response => {
            console.log('Order cancelled:', response.data);
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'Cancelled' } : order
                )
            );
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error('Error cancelling order:', error);
        })
        .finally(() => {
            setLoadingOrderId(null);
        });
    };

    // Accept order function
    const acceptOrder = (orderId) => {
        setLoadingOrderId(orderId);
        axios.post(`/orders/${orderId}/accept`, {}, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            }
        })
        .then(response => {
            console.log('Order accepted:', response.data);
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
            setLoadingOrderId(null);
        });
    };

    // Ready order function
    const readyOrder = (orderId) => {
        setLoadingOrderId(orderId);
        axios.post(`/orders/${orderId}/ready`, {}, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            }
        })
        .then(response => {
            console.log('Order Ready:', response.data);
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'Ready' } : order
                )
            );
        })
        .catch(error => {
            console.error('Error making order ready:', error);
        })
        .finally(() => {
            setLoadingOrderId(null);
        });
    };

    const groupedOrders = useMemo(() => {
      return orders.reduce((groups, order) => {
          const userId = order.user?.id || 'unknown';
          const userName = order.user?.name || 'Unknown';
          if (!groups[userId]) {
              groups[userId] = { userName, orders: [] };
          }
          groups[userId].orders.push(order);
          return groups;
      }, {});
  }, [orders]);
  
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Orders</h2>}
            type={auth.user.type}
            balance={auth.user.balance}
            storeBalance={auth.user.store.balance}
        >
            <Head title="Orders"/>
            <OrderSelectSort selectedStatus={selectedStatus} onStatusChange={handleStatusChange} /><br />

            <div>
            {Object.entries(groupedOrders)
    .filter(([_, { orders }]) =>
        orders.some(order => order.status === selectedStatus) // Check if any order matches the selected status
    )
    .map(([userId, { userName, orders }]) => (
    <div key={userId} style={{ marginBottom: "16px" }}>
        <Typography variant="h6" color="primary" sx={{marginLeft: "16px", color: grey[800]}}>
            {userName}'s Orders
        </Typography>
        {orders
            .filter(order => order.status === selectedStatus).map(order => (
                <div key={order.id} style={{ marginBottom: "8px" }}>
                    <SellerOrdersCardPending order={order}>
                        {selectedStatus === "Pending" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => cancelOrder(order.id)}
                                    disabled={loadingOrderId === order.id}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: blueGrey[800] }}
                                    onClick={() => acceptOrder(order.id)}
                                    disabled={loadingOrderId === order.id}
                                >
                                    Accept
                                </Button>
                            </>
                        )}
                        {selectedStatus === "Accepted" && (
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: blueGrey[800] }}
                                onClick={() => readyOrder(order.id)}
                                disabled={loadingOrderId === order.id}
                            >
                                Make Ready
                            </Button>
                        )}
                    </SellerOrdersCardPending>
                </div>
            ))}
    </div>
))}

            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
