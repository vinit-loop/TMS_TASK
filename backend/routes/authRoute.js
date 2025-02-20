// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/LoginController.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register',registerUser);  
router.post('/login', loginUser);       

export default router;
