import express from 'express';
import { getIssues, issueBook, returnBook } from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getIssues);
router.post('/issue', protect, issueBook);
router.post('/return/:id', protect, returnBook);

export default router;
