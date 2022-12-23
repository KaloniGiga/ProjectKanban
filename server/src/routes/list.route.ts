import express from 'express'
import { isLoggedIn } from '../middlewares/auth.middleware';
import * as ListController from '../controllers/list.controller'

const router = express.Router();

router.route("/list/create").post(isLoggedIn, ListController.createList)
router.route(":boardId/lists").post(isLoggedIn, ListController.getLists)

export default router;