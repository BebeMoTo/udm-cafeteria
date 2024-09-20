//React
import React, { useMemo } from 'react';
//My Components
import Authenticated from "@/Layouts/AuthenticatedLayout";
import OrdersRadioSort from './OrdersComponents/OrdersRadioSort';
import CardPending from './OrdersComponents/CardPending';
//MaterialUI
import { Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
//inertia
import { Head } from '@inertiajs/react';

const Index = ({ auth, orders: initialOrders }) => {
    // Filter orders based on their status
    const pendingOrders = useMemo(() => initialOrders.filter(order => order.status === 'Pending').sort((a, b) => new Date(b.pending_time) - new Date(a.pending_time)), [initialOrders]);
    const acceptedOrders = useMemo(() => initialOrders.filter(order => order.status === 'Accepted').sort((a, b) => new Date(b.accepted_time) - new Date(a.accepted_time)), [initialOrders]);
    const claimedOrders = useMemo(() => initialOrders.filter(order => order.status === 'Claimed').sort((a, b) => new Date(b.claimed_time) - new Date(a.claimed_time)), [initialOrders]);
    const cancelledOrders = useMemo(() => initialOrders.filter(order => order.status === 'Cancelled').sort((a, b) => new Date(b.cancelled_time) - new Date(a.cancelled_time)), [initialOrders]);

    console.log({ pendingOrders, acceptedOrders, claimedOrders, cancelledOrders });

    //Status of radio buttons
    const [selectedStatus, setSelectedStatus] = React.useState('Pending');
    // Function to handle status change
    const handleStatusChange = (newStatus) => {
        setSelectedStatus(newStatus);
        // You can do additional things here when the status changes (like filtering orders)
        //console.log("Selected Status:", newStatus);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Orders <Typography sx={{color: grey[500], display: "inline"}}></Typography></h2>}
            type={auth.user.type}
            balance={auth.user.balance}
        >
            <Head title="Orders"/>
            {/* You can now render the filtered orders here */}

            <OrdersRadioSort selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />

            {/*Put the tiles here!!!*/}

            <div>
                {selectedStatus === "Pending" ? 
                pendingOrders.map(order => (
                    <div key={order.id}>
                        <CardPending order={order}>
                            <Button variant='contained' color='error'>Cancel Order</Button>
                        </CardPending>
                    </div>
                    
                )) : ""}

                {selectedStatus === "Accepted" ? acceptedOrders.map(order => (
                    <div key={order.id}>
                        <CardPending order={order}></CardPending>
                    </div>
                )) : ""}

                {selectedStatus === "Claimed" ? claimedOrders.map(order => (
                    <div key={order.id}>
                        <CardPending order={order}></CardPending>
                    </div>
                )) : ""}

                {selectedStatus === "Cancelled" ? cancelledOrders.map(order => (
                    <div key={order.id}>
                        <CardPending order={order}></CardPending>
                    </div>
                )) : ""}
            </div>
        </Authenticated>
    );
};

export default Index;
