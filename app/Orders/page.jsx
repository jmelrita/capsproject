import OrderHistory from '../components/OrderHistory';
import getCurrentUser from '../actions/getCurrentUser';

const Order = async () => {
   
     const currentUser = await getCurrentUser();
    
    return (
        <OrderHistory currentUser={currentUser}/>
    );
};

export default Order;
