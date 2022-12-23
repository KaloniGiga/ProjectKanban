import express from 'express';
import * as CardCtrl from '../controllers/card.controller';

const router = express.Router();

router.route('/card/create').post(CardCtrl.createCard);

export default router;