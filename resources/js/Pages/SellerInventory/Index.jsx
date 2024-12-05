import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import SellerItemSort from './SellerComponents/SellerItemSort';
import SellerSearchSort from './SellerComponents/SellerSearchSort';
import StoreItemLayout from '../Stores/StoresComponents/StoreItemLayout';
import SellerItemInfo from './SellerComponents/SellerItemInfo';
//import SellerUpdateItem from './SellerComponents/SellerUpdateItem';
import SellerUpdateItemCopy from './SellerComponents/SellerUpdateItemCopy';
import SellerAddItem from './SellerComponents/SellerAddItem';
import { Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

export default function Index({ auth, items: initialItems, stores }) {

    const { props } = usePage(); // Access all the props provided by Inertia
    console.log(props); // Logs all the props to the console

    const [items, setItems] = useState(initialItems);
    const [sortType, setSortType] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const itemRefs = useRef({});

    //for deleting the item
    const handleItemDelete = (deletedItemId) => {
        // Remove the deleted item from the state
        setItems(items.filter((item) => item.id !== deletedItemId));
    };

    // Initial sort and filter on mount
    useEffect(() => {
        const sortedItems = items.sort((a, b) => b.state - a.state); // Sort items by state, with 1 first
        setFilteredItems(sortedItems);
    }, [items]);

    //for foodtype sort
    const handleItemTypeChange = (type) => {
        setSortType(type);
        const sortedItems = (type === '' 
            ? items 
            : items.filter(item => item.type === type)
        ).sort((a, b) => b.state - a.state); // Sort items by state, with 1 first
        setFilteredItems(sortedItems);
    };
    
    //forItemsearchSort
    const handleItemSelect = (item) => {
        const itemElement = itemRefs.current[item.id];

        if (itemElement) {
            itemElement.style.backgroundColor = '#f0f0f0'; // Greyish color
            setTimeout(() => {
                itemElement.style.backgroundColor = ''; // Revert to normal
            }, 2000);
        }

        //show the slider for itemInfo
        setSelectedItem(item);

        console.log(item); 
    };

    //for selectedItem
    const handleCloseDrawer = () => {
        setSelectedItem(null);
    };

    //for editing the item
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null); // Store the user data to be edited

    // Open modal and set selected user for editing
    const handleEditClick = (item) => {
        setItemToEdit(item); // Pass user data to the form
        setOpenEditModal(true); // Open the edit modal
    };
    const handleAddClick = (item) => {
        setOpenAddModal(true); // Open the edit modal
    };

    // Close the edit modal
    const handleEditClose = () => {
      setOpenEditModal(false);
      setItemToEdit(null); // Clear the selected user
    };
    const handleAddClose = () => {
        setOpenAddModal(false);
      };

      const checkIfSeller = () => {
        if (auth.user.type !== "Seller") {
            return 0;
        }
        else {
            return auth.user.store.balance;
        }
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Inventory</h2>}
            type={auth.user.type}
            balance={auth.user.balance}
            storeBalance={checkIfSeller()}
        >
            <Head title="Inventory" />


            <div className="py-4 px-4">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8} sm={8}>
                        <SellerSearchSort items={filteredItems} onItemSelect={handleItemSelect} />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <SellerItemSort itemType={sortType} onItemTypeChange={handleItemTypeChange}/>
                    </Grid>
                </Grid>
                <Button
                variant='contained'
                onClick={handleAddClick}
                sx={{backgroundColor: blueGrey[800], marginTop: "8px",}}>Add Item</Button>
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
                                    quantity={item.quantity}
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
                        <SellerItemInfo
                            item={selectedItem}
                            open={Boolean(selectedItem)}
                            onClose={handleCloseDrawer}
                            openEditModal={handleEditClick}
                            onItemDelete={handleItemDelete} 
                        />
                )}
            </div>

            <SellerUpdateItemCopy 
                open={openEditModal}
                item={itemToEdit}
                onClose={handleEditClose}
                //onSubmit={handleUpdateItem}
            />
            <SellerAddItem
                open={openAddModal}
                onClose={handleAddClose}
                stores={stores}
                authUser={auth}
            />

        </AuthenticatedLayout>
    );
}
