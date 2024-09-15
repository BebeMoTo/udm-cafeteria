import React, { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Grid from '@mui/material/Grid';
import { Typography, Alert, AlertTitle } from '@mui/material';
import StoresAccordion from './StoresComponents/StoresAccordion';
import StoresSearchSort from './StoresComponents/StoresSearchSort';
import StoresSort from './StoresComponents/StoresSort';
import StoreItemLayout from './StoresComponents/StoreItemLayout';
import StoreItemInfo from './StoresComponents/StoreItemInfo';

const Show = ({ auth, store, items }) => {
    const [filteredItems, setFilteredItems] = useState([]);
    const [itemType, setItemType] = useState('');
    const itemRefs = useRef({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    // Initial sort and filter on mount
    useEffect(() => {
        const sortedItems = items
            .sort((a, b) => b.state - a.state); // Sort items by state, with 1 first
        setFilteredItems(sortedItems);
    }, [items]);

    const handleItemSelect = (item) => {
        const itemElement = itemRefs.current[item.id];

        if (itemElement) {
            itemElement.style.backgroundColor = '#f0f0f0'; // Greyish color
            setTimeout(() => {
                itemElement.style.backgroundColor = ''; // Revert to normal
            }, 2000);
        }

        if (item.state === 0) {
            setAlertOpen(true);
        } else {
            setSelectedItem(item);
            setAlertOpen(false);
        }
    };

    useEffect(() => {
        if (alertOpen) {
            const timer = setTimeout(() => {
                setAlertOpen(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertOpen]);

    const handleItemTypeChange = (type) => {
        setItemType(type);
        const sortedItems = (type === '' 
            ? items 
            : items.filter(item => item.type === type)
        ).sort((a, b) => b.state - a.state); // Sort items by state, with 1 first
        setFilteredItems(sortedItems);
    };

    const handleCloseDrawer = () => {
        setSelectedItem(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl text-green-900 leading-tight">Store: {store.name}</h2>}
            type={auth.user.type}
            balance={auth.user.balance}
        >
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

                    {alertOpen && (
                        <Alert
                            severity="error"
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 100,
                                width: '350px',
                            }}
                            onClose={() => setAlertOpen(false)}
                        >
                            <AlertTitle>Error</AlertTitle>
                            The item is not available right now.
                        </Alert>
                    )}

                    <Grid container spacing={2} mt={3}>
                        {filteredItems.map(item => (
                            <Grid
                                key={item.id}
                                item
                                xs={6}
                                sm={3}
                                md={2}
                                ref={el => (itemRefs.current[item.id] = el)}
                                className="item-container"
                                onClick={() => handleItemSelect(item)}
                            >
                                <StoreItemLayout
                                    name={item.name}
                                    price={item.price}
                                    image={item.image_path}
                                    state={item.state}
                                    type={item.type}
                                    className={selectedItem && selectedItem.id === item.id ? 'selected-item' : ''}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {selectedItem && (
                        <StoreItemInfo
                            item={selectedItem}
                            open={Boolean(selectedItem)}
                            onClose={handleCloseDrawer}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
