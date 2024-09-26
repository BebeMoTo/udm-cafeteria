import { Typography } from '@mui/material';
import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

const AdminUserCard = ({user, children}) => {
  return (
    <>
        <Accordion sx={{marginBottom: "8px"}}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
                <b>{user.name}</b>
            </AccordionSummary>
            <AccordionDetails>
                <p><b>Date Created: </b>{user.created_at}</p>
                <p><b>Email: </b>{user.email}</p>
                <p><b>Sex: </b>{user.sex}</p>
                <p><b>Type: </b>{user.type}</p>
                {user.type !== "Seller" ? <p><b>Balance: </b>{user.balance}</p> : ""}
                {user.type !== "Seller" ? <p><b>Expense: </b>{user.expense}</p> : ""}
                {user.type !== "Seller" ? <p><b>Department: </b>{user.department}</p> : ""}
                {user.type === "Seller" ? <p><b>Stall Name: </b>{user.store.name}</p> : ""}
                <div>
                    {children}
                </div>
            </AccordionDetails>
        </Accordion>
    </>
  )
}

export default AdminUserCard