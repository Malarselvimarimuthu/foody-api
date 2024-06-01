// Importing packages
import { Router } from 'express';

// Importing controllers
import userController from '../controllers/user.controller';

// Defining routers
const router = Router();

// orders routes
router.post('/fetch/userDetails', userController.fetchUserDetails);

export default router;
