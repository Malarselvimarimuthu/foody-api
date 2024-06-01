// index.ts
// Importing packages
import { Router } from 'express';
 
// Importing routes
import authRoute from './auth.route';
import userRoute from './user.route';
import ordersRoute from './orders.route';

// Defining router
const router = Router();

// Non authorization routes
router.use('/auth', authRoute);

// Authorization routes
router.use('/user', userRoute);
router.use('/orders', ordersRoute);

export default router;