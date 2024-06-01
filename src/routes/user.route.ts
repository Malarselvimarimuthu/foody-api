// Importing packages
import { Router } from 'express';

// Importing controllers
import userController from '../controllers/user.controller';

// Defining routers
const router = Router();

// user routes
router.get('/userDetails/:userId', userController.fetchUserDetails);

export default router;
