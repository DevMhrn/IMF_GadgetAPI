import express from 'express';
import { 
  getAllGadgets, 
  createGadget, 
  updateGadget, 
  deleteGadget, 
  selfDestruct 
} from '../controllers/gadget.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Public route
router.get('/',authenticateToken , getAllGadgets);

// Protected routes 
router.post('/', authenticateToken, createGadget);

router.patch('/:id', authenticateToken, updateGadget);
router.delete('/:id', authenticateToken, deleteGadget);
router.post('/:id/self-destruct', authenticateToken, selfDestruct);

export default router;
