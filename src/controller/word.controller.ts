import { Request, Response, NextFunction } from 'express';
import wordsdb from '../model/word.model';
import httpStatusText from '../utils/httpStatusText';
import logger from '../utils/logger';
import { db } from "../connection/firebase";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";


const deleteWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wordId = req.params.id;
        const word = await wordsdb.findById(wordId);
        if (!word) {
            const wordDoc = doc(db, "word", wordId);
            if(!wordDoc){
                logger.warn('Attempt to delete non-existing admin', { wordId });
                return res.status(404).json({ success: httpStatusText.FAIL, message: "word doesn't exist" });
            }
            await deleteDoc(wordDoc);
            logger.info('word deleted successfully from firebase', { wordId });
            res.status(200).json({ success: httpStatusText.SUCCESS, message: 'word deleted successfully' });
        }
        await wordsdb.findByIdAndDelete(wordId);
        logger.info('word deleted successfully from m', { wordId });
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'word deleted successfully' });
    } catch (error) {
        logger.error("error   == ",error);
        res.status(500).json({status:httpStatusText.ERROR,msg:"server thing"})
    }
};

const updateWord = async (req: Request, res: Response) => {
    try {
        const wordId = req.params.id;
        const updates = req.body;
        const word = await wordsdb.findByIdAndUpdate(wordId, updates, { new: true });
        if (!word) {
            const data = req.body;
            const wordDoc = doc(db, "word", wordId);
            if(!wordDoc){
                logger.warn('Attempt to delete non-existing admin', { wordId });
                return res.status(404).json({ success: httpStatusText.FAIL, message: "word doesn't exist" });
            }
            await updateDoc(wordDoc, data);
            logger.info('word deleted successfully', { wordId });
            res.status(200).json({ success: httpStatusText.SUCCESS, message: 'word deleted successfully' });
        }
        logger.info('word updated successfully', { wordId });
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'word updated successfully', data: { word } });
    } catch (error) {
        logger.error('Error updating word', { error });
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
};

export{
    deleteWord,
    updateWord
};
