import { Router } from 'express';
import { getAllUsers, getUserById, updateUserBalance, getDashboardStats } from '../controllers/userController';
import { authenticateToken, requireAdmin, requireOwnerOrAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/stats', authenticateToken, requireAdmin, getDashboardStats);
router.get('/:id', authenticateToken, requireOwnerOrAdmin, getUserById);
router.put('/:id/balance', authenticateToken, requireAdmin, updateUserBalance);

export default router;