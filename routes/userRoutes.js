import express from 'express';
import { registerAdmin,loginAdmin } from '../controllers/userController.js';

const router = express.Router();

// Route to register a new admin user
router.post('/register', registerAdmin);

// Route to Login an admin user
router.post('/login', loginAdmin);

export default router;
