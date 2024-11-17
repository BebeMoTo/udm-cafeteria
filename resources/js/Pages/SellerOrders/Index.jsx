import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import OrderSelectSort from '../Orders/OrdersComponents/OrderSelectSort';
import SellerOrdersCardPending from './SellerOrdersComponents/SellerOrdersCardPending';
import { Button, Typography, Snackbar, Alert } from "@mui/material";

const Index = ({auth, orders: initialOrders}) => {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const handleStatusChange = (newStatus) => setSelectedStatus(newStatus);
    const [loadingOrderId, setLoadingOrderId] = useState(null); // Track loading state for cancellation

    //Sorting the items
    const pendingOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Pending')
            .sort((a, b) => new Date(a.pending_time) - new Date(b.pending_time)), 
        [orders]
    );
    const acceptedOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Accepted')
            .sort((a, b) => new Date(a.accepted_time) - new Date(b.accepted_time)), 
        [orders]
    );
    const claimedOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Claimed')
            .sort((a, b) => new Date(a.claimed_time) - new Date(b.claimed_time)), 
        [orders]
    );
    const cancelledOrders = useMemo(() => 
        orders
            .filter(order => order.status === 'Cancelled')
            .sort((a, b) => new Date(a.cancelled_time) - new Date(b.cancelled_time)), 
        [orders]
    );
    //End of sorting the items

    console.log(selectedStatus);
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
                            Cancel Order
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
                          <p style={{fontSize: "12px"}}>Time Accepted: {order.accepted_time}</p>
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