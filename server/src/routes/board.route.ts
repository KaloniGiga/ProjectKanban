import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware';
import * as BoardCtrl from '../controllers/board.controller';


const router = express.Router();

router.route('/board/create').post(isLoggedIn, BoardCtrl.createBoard);

router.route('/recentboard').get(isLoggedIn, BoardCtrl.getRecentlyVisitedBoards)

router.route('/board/:boardId').get(isLoggedIn, BoardCtrl.getBoardDetail);


export default router;