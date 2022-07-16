import { Router } from "express";
import { updateLocalDatabase, updateAlbum } from '../controllers/dbController.js';
const router = Router();

// router.route('/').get(protect, getGoals).post(protect, setGoal);
// router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal)

// router.get('/db/load', updateDatabase);
router.get('/update', updateLocalDatabase);
router.put('/album/:label', updateAlbum);
// router.get('/me', protect, getMe);

export default router;