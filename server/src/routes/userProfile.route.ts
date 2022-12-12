
import express from 'express';
import * as userCtrl from '../controllers/userProfile.controller'
import { isLoggedIn } from '../middlewares/auth.middleware';


const router = express.Router();


router.route('/password/forget').post(userCtrl.forgotPassword);
router.route('/password/reset/:token').post(userCtrl.resetPassword);
router.route('/profile/update').post(isLoggedIn, userCtrl.updateProfile);
router.route('profile/delete').delete(isLoggedIn, userCtrl.deleteProfile);
router.route('/password/update').put(isLoggedIn, userCtrl.updatePassword);

export default router;