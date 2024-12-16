import { Dialog, Divider, DialogActions, DialogContent, DialogTitle,} from '@mui/material';
import dayjs from 'dayjs';

const AdminUserOrdersModal = ({ open, user, onClose }) => { 
   
    
    const showRecords = (user) => {
        return(
            user.orders.map(order => (
                <div key={order.id}>
                    <p>{"\u22C5"}{order.quantity} {order.item.name} - <b>{order.status}</b></p>
                    <p><b>{"\u20B1"}{order.total_price}</b></p>
                    <p>{"\u22C5"}{dayjs(order.pending_time).format('MMMM D, YYYY (h:mm A)')}</p>
                    <Divider/>
                </div>
            ))
        )
    }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Orders</DialogTitle>
      <DialogContent>
        {user ? showRecords(user) : ""}
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserOrdersModal;
