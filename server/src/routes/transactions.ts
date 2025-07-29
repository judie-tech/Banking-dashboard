import { Router } from 'express';
import { 
  getUserTransactions, 
  getAllTransactions, 
  transferMoney, 
  depositMoney, 
  getUserStats 
} from '../controllers/transactionController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();

const transferValidation = [
  body('recipient_id').isInt({ min: 1 }).withMessage('Valid recipient ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description too long'),
];

const depositValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('payment_method').isIn(['card', 'bank', 'mobile']).withMessage('Invalid payment method'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description too long'),
];

router.get('/user/:userId?', authenticateToken, getUserTransactions);
router.get('/all', authenticateToken, requireAdmin, getAllTransactions);
router.get('/stats', authenticateToken, getUserStats);
router.post('/transfer', authenticateToken, transferValidation, transferMoney);
router.post('/deposit', authenticateToken, depositValidation, depositMoney);

export default router;