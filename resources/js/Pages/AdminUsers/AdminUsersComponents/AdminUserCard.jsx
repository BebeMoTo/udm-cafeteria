import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';

import dayjs from 'dayjs';
import { useState } from 'react';

function userIcon(type) {
    if (type === "Admin") {
        return (<AdminPanelSettingsIcon color='primary'/>)
    } else if (type === "Seller") {
        return (<StoreIcon color='primary'/>)
    }
    else {
        return (<PersonIcon color='primary'/>)
    }
}

const AdminUserCard = ({user, sellerStore, children}) => {
    const [store, setStore] = useState(sellerStore);
    return (
      <>
          <Accordion sx={{marginBottom: "8px"}}>
              <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              >
  
                  <b>{userIcon(user.type)} {user.name}</b>
              </AccordionSummary>
              <AccordionDetails>
                  {/* Format the date as "March 27, 2024 (2:35 PM)" */}
                  <p style={{marginBottom: "8px"}}><b>Date Created: </b><br/>{dayjs(user.created_at).format('MMMM D, YYYY (h:mm A)')}</p>
                  <p style={{marginBottom: "8px"}}><b>Email: </b><br/>{user.email}</p>
                  <p style={{marginBottom: "8px"}}><b>Sex: </b><br/>{user.sex}</p>
                  <p style={{marginBottom: "8px"}}><b>Type: </b><br/>{user.type}</p>
                  {user.type !== "Seller" ? <p style={{marginBottom: "8px"}}><b>Balance: </b><br/>{'\u20B1'}{user.balance}</p> : ""}
                  {user.type !== "Seller" ? <p style={{marginBottom: "8px"}}><b>Expense: </b><br/>{'\u20B1'}{user.expense}</p> : ""}
                  {user.type !== "Seller" ? <p style={{marginBottom: "8px"}}><b>Department: </b><br/>{user.department}</p> : ""}

                  {/*FIIIIIIIX THIIIIIIIIIS*/}
                  {user.type === "Seller" ? <p style={{marginBottom: "8px"}}><b>Stall Name: </b><br/>{store.name || "Loading Store"}</p> : ""}

                  
                  <br />
                  <div>
                      {children}
                  </div>
              </AccordionDetails>
          </Accordion>
      </>
    )
  }
  
  export default AdminUserCard;
  