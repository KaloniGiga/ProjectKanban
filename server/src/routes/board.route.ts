import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware';
import * as BoardCtrl from '../controllers/board.controller';


const router = express.Router();
router.route('/boards').post(isLoggedIn, BoardCtrl.createBoard);

router.route('/recentboard').get(isLoggedIn, BoardCtrl.getRecentlyVisitedBoards)

router.route('/board/:id').get(isLoggedIn,BoardCtrl.getBoardDetail);


export default router;