import { Request, Response, NextFunction } from 'express';
import wordsdb from '../model/word.model';
import httpStatusText from '../utils/httpStatusText';
import logger from '../utils/logger';
import { db } from "../connection/firebase";
import { doc, updateDoc, deleteDoc,getDoc } from "firebase/firestore";


const deleteWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wordId = req.params.id;
        const wordDoc = doc(db, "word", wordId);
        if(!wordDoc){
            logger.warn('Attempt to delete non-existing admin', { wordId });
            return res.status(404).json({ success: httpStatusText.FAIL, message: "word doesn't exist" });
        }
        await deleteDoc(wordDoc);
        logger.info('word deleted successfully from firebase', { wordId });
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'word deleted successfully' });
    } catch (error) {
        res.status(500).json({status:httpStatusText.ERROR,msg:"error in delete ,try again"})
    }
};

const updateWord = async (req: Request, res: Response) => {
    try {
        const wordId = req.params.id;
        const data = req.body;
        const wordDoc = doc(db, "word", wordId);
        if(!wordDoc){
            logger.warn('Attempt to delete non-existing admin', { wordId });
            return res.status(404).json({ success: httpStatusText.FAIL, message: "word doesn't exist" });
        }
        await updateDoc(wordDoc, data);
        logger.info('word updated successfully', { wordId });
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'word updated successfully' });
    } catch (error) {
        logger.error('Error updating word', { error });
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
};
const addImageToWord = async (req: Request, res: Response) => {
    try {
        const wordId = req.params.id;
        const image = req.body;
        const wordDoc = doc(db, "word", wordId);
        const wordDocSnap = await getDoc(wordDoc);
        if(!image){
            res.status(404).json({ success: httpStatusText.FAIL, message: "Image null" });
        }
        if (!wordDocSnap.exists()) {
            logger.warn('Attempt to add image to non-existing word', { wordId });
            return res.status(404).json({ success: httpStatusText.FAIL, message: "Word doesn't exist" });
        }

        const wordData = wordDocSnap.data();
        let updatedImages = wordData.image ? [...wordData.image, image] : [image];
        if(updatedImages.length>3 ){
            return res.status(400).json({ success: httpStatusText.FAIL, message: "3 image maxiumun" });
        }
        
        await updateDoc(wordDoc, { image: updatedImages });
        
        
        

        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'word added image successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
};
export{
    deleteWord,
    updateWord,
    addImageToWord
};
