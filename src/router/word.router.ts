import express from 'express';
import {createWord,getAllWord,deleteWord,updateWord} from '../controller/word.controller';

const router = express.Router();

router.route('/')
        .post(createWord)
        .get(getAllWord);


router.route('/:id')
        .patch(updateWord)
        .delete(deleteWord);

export default router;
