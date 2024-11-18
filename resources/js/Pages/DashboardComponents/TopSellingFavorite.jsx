import React from 'react';
import TopSellingItemLayout from './TopSellingItemLayout';
import TopSellingItemInfo from './TopSellingItemInfo';
import Grid from '@mui/material/Grid';
import { useRef, useState } from 'react';
import { Box } from '@mui/material';

const TopSellingFavorite = ({topFavorite, chapterTitle}) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const itemRefs = useRef({});

    const handleItemSelect = (item) => {
        const itemElement = itemRefs.current[item.item.id];

        if (itemElement) {
            itemElement.style.backgroundColor = '#f0f0f0'; // Greyish color
            setTimeout(() => {
                itemElement.style.backgroundColor = ''; // Revert to normal
            }, 2000);
        }

        if (item.item.state === 0) {
            return;
        } else {
            setSelectedItem(item);
        }
    };

    const handleCloseDrawer = () => {
        setSelectedItem(null);
    };



  return (
    <div className='topSellingContainer'>
      <h2 style={{fontSize: "20px"}}>{chapterTitle}</h2>
      <Grid container spacing={2} mt={0}>
      <Box
        sx={{
            display: 'flex',
            overflowX: 'auto', // Enable horizontal scrolling
            whiteSpace: 'nowrap', // Prevent items from wrapping
            padding: '16px', // Optional: Add padding for better visuals
            gap: {
                xs: '50px', // For small devices (phones)
                sm: '25px', // For medium devices and up
              },
        }}
        >
        {topFavorite && topFavorite.map((item) => (
            <Grid
            key={item.item_id}
            item
            xs={6}
            sm={3}
            md={2}
            ref={el => (itemRefs.current[item.item.id] = el)}
            className="item-container"
            onClick={() => handleItemSelect(item)}
            >
                <TopSellingItemLayout
                name={item.item.name} 
                price={item.item.price}
                image={item.item.image_path}
                state={item.item.state}
                type={item.item.type}
                className="item-container"/>
          </Grid>
        ))}
        </Box>
      </Grid>


        {selectedItem && (
            <TopSellingItemInfo
                item={selectedItem}
                additional_fee={selectedItem.item.store.additional_fee}
                open={Boolean(selectedItem)}
                onClose={handleCloseDrawer}
            />
        )}
    </div>
  );
};

export default TopSellingFavorite;
