// Route file for kodi 
import { Router } from "express";
import { scanTag } from '../controllers/kodiController.js';
const router = Router();

// router.route('/').get(protect, getGoals).post(protect, setGoal);
// router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal)

// router.get('/db/load', updateDatabase);
router.get('/tag', scanTag);
// router.get('/me', protect, getMe);

export default router;