import express from 'express';
import {deleteWord,updateWord} from '../controller/word.controller';
import {createWords,getAllWords} from '../controller/words.fb.controller';


const router = express.Router();

router.route('/')
        .post(createWords)
        .get(getAllWords);


router.route('/:id')
        .patch(updateWord)
        .delete(deleteWord);

export default router;
