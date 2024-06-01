// Importing packages
import { Router } from 'express';

// Importing controllers
import orderController from '../controllers/orders.controller';

// Defining routers
const router = Router();

// orders routes
router.delete('/:userId/:orderId', orderController.deleteOrder);
router.post('/placeOrder', orderController.handlePlaceOrder);
router.get('/fetchOrders/:userId', orderController.fetchUserOrders);

export default router;
