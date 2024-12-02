import React from 'react';
import TopSellingItemLayout from './TopSellingItemLayout';
import TopSellingRecommendationInfo from './TopSellingRecommendationInfo';
import Grid from '@mui/material/Grid';
import { useRef, useState } from 'react';
import { Box } from '@mui/material';

const TopSellingRecommendations = ({topSelling, chapterTitle}) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const itemRefs = useRef({});

    const handleItemSelect = (item) => {
        const itemElement = itemRefs.current[item.id];

        if (itemElement) {
            itemElement.style.backgroundColor = '#f0f0f0'; // Greyish color
            setTimeout(() => {
                itemElement.style.backgroundColor = ''; // Revert to normal
            }, 2000);
        }

        if (item.state === 0 || item.store.state === 0) {
            return;
        } else {
            setSelectedItem(item);
        }
    };

    const handleCloseDrawer = () => {
        setSelectedItem(null);
    };



  return (
    <div className='topSellingContainer' style={{marginBottom: "16px"}}>
      <h2 style={{fontSize: "20px"}}>{chapterTitle}</h2>
      <Grid container spacing={2} mt={0}>
      <Box
        sx={{
            width: "100%",
            display: 'flex',
            overflowX: 'auto', // Enable horizontal scrolling
            whiteSpace: 'nowrap', // Prevent items from wrapping
            padding: '16px', // Optional: Add padding for better visuals
            gap: {
                xs: '50px', // For small devices (phones)
                sm: '10px', // For medium devices and up
              },
        }}
        >
        {topSelling && topSelling.map((item) => (
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
                <TopSellingItemLayout
                name={item.name} 
                price={item.price}
                image={item.image_path}
                state={item.state}
                type={item.type}
                store={item.store.state}
                quantity={item.quantity}
                className="item-container"/>
          </Grid>
        ))}
        </Box>
      </Grid>


        {selectedItem && (
            <TopSellingRecommendationInfo
                item={selectedItem}
                additional_fee={selectedItem.store.additional_fee}
                open={Boolean(selectedItem)}
                onClose={handleCloseDrawer}
            />
        )}
    </div>
  );
};

export default TopSellingRecommendations;
