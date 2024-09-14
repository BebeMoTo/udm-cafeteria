import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import StoresAccordion from './StoresComponents/StoresAccordion';
import StoresSearchSort from './StoresComponents/StoresSearchSort';
import StoresSort from './StoresComponents/StoresSort';

const Show = ({ auth, store, items }) => {
    const [filteredItems, setFilteredItems] = useState(items); // State for filtered items
    const [itemType, setItemType] = useState(''); // State for selected item type
    const itemRefs = useRef({});

    // Function to scroll to a selected item and apply blinking outline
    const handleItemSelect = (selectedItem) => {
        const itemElement = itemRefs.current[selectedItem.id];

        if (itemElement) {
            // Scroll to the item
            itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add blinking effect
            itemElement.classList.add('blink-outline');
            setTimeout(() => {
                itemElement.classList.remove('blink-outline');
            }, 2000); // Remove class after 2 seconds
        }
    };

    // Function to handle item type selection
    const handleItemTypeChange = (type) => {
        setItemType(type);
        if (type === '') {
            setFilteredItems(items); // If 'All' is selected, show all items
        } else {
            setFilteredItems(items.filter(item => item.type === type)); // Filter items by type
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Store: {store.name}</h2>} type={auth.user.type} balance={auth.user.balance}>
            <Head title={store.name} />

            <div className="py-5">
                <div className="mx-auto px-3 sm:px-6 lg:px-8">
                    <StoresAccordion
                        stall_no={store.stall_no}
                        store_description={store.description}
                        store_state={store.state === 0 ? 'Closed' : 'Open'}
                        additional_fee={store.additional_fee}
                        store_items_count={filteredItems.length}
                    />
                    <br />
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={8} sm={8}>
                          <StoresSearchSort items={filteredItems} onItemSelect={handleItemSelect} />
                      </Grid>
                      <Grid item xs={4} sm={4}>
                          <StoresSort itemType={itemType} onItemTypeChange={handleItemTypeChange} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={3}>
                        {filteredItems.map(item => (
                            <Grid
                                key={item.id}
                                item
                                xs={6}
                                sm={2}
                                ref={el => (itemRefs.current[item.id] = el)} // Assign each item its ref
                                className="item-container"
                            >
                                <Typography>{item.name}</Typography>
                                <Typography>{item.description}</Typography>
                                <Typography>Price: {item.price}</Typography>
                                <Typography>Quantity: {item.quantity}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Show;
