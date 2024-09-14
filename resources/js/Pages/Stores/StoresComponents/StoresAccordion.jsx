import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StoreMallDirectoryTwoToneIcon from '@mui/icons-material/StoreMallDirectoryTwoTone';
import ToggleOnTwoToneIcon from '@mui/icons-material/ToggleOnTwoTone';
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import FastfoodTwoToneIcon from '@mui/icons-material/FastfoodTwoTone';

export default function StoresAccordion({stall_no, store_description, store_state, additional_fee, store_items_count}) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography variant='h6'>Store Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <StoreMallDirectoryTwoToneIcon sx={{marginRight: "4px"}}/> <b>Stall No:</b> {stall_no}<br/>
            <ToggleOnTwoToneIcon sx={{marginRight: "4px"}}/> <b>State:</b> {store_state}<br/>
            <FastfoodTwoToneIcon sx={{marginRight: "4px"}}/> <b>Total Items:</b> {store_items_count}<br/>
            <AddShoppingCartTwoToneIcon sx={{marginRight: "4px"}}/> <b>Additional Fee:</b> {'\u20B1'}{additional_fee}<br/>
            <DescriptionTwoToneIcon sx={{marginRight: "4px"}}/> <b>Description:</b> {store_description}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
