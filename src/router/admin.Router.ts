import express from 'express';
import { createAdmin, login, getAllAdmin, updateAdmin, deleteAdmin } from '../controller/admin.controller';

const router = express.Router();

router.route('/')
        .post(createAdmin);

router.route('/login')
        .post(login);

router.route('/AllAdmin')
        .get(getAllAdmin);

router.route('/:id')
        .patch(updateAdmin)
        .delete(deleteAdmin);

export default router;
