import express from 'express';
import {deleteWord,updateWord,addImageToWord} from '../controller/word.controller';
import {createWords,getAllWords,getAllWordsFrench} from '../controller/words.fb.controller';


const router = express.Router();

router.route('/')
        .post(createWords)
        .get(getAllWordsFrench);

router.route('/arbic')
        .get(getAllWords)

router.route('/image/:id')
        .patch(addImageToWord)

router.route('/:id')
        .patch(updateWord)
        .delete(deleteWord);

export default router;
