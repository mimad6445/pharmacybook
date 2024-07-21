import { Request, Response, NextFunction } from 'express';
import wordsdb from '../model/word.model';
import httpStatusText from '../utils/httpStatusText';
import logger from '../utils/logger';

const createWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { wordArabic,wordEnglish,wordFrench,etat,description,image } = req.body;
        const addNewWord = new wordsdb({ wordArabic,wordEnglish,wordFrench,etat,description,image });
        await addNewWord.save();
        logger.info('Admin created successfully', { adminId: addNewWord._id });
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { addNewWord } });
    } catch (error) {
        logger.error("error   == ",error);
        res.status(500).json({status:httpStatusText.ERROR,msg:"server thing"})
    }
};

const getAllWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const words = await wordsdb.find();
        logger.info('Retrieved all admins', { count: words.length });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { words }});
    } catch (error) {
        logger.error("error   == ",error);
        res.status(500).json({status:httpStatusText.ERROR,msg:"server thing"})
    }
};

const deleteWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wordId = req.params.id;
        const word = await wordsdb.findById(wordId);
        if (!word) {
            logger.warn('Attempt to delete non-existing admin', { wordId });
            return res.status(404).json({ success: httpStatusText.FAIL, message: "word doesn't exist" });
        }
        await wordsdb.findByIdAndDelete(wordId);
        logger.info('word deleted successfully', { wordId });
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
            logger.warn('Attempt to update non-existing word', { wordId });
            return res.status(404).json({ success: httpStatusText.FAIL, message: 'word not found' });
        }
        logger.info('word updated successfully', { wordId });
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'Admin updated successfully', data: { word } });
    } catch (error) {
        logger.error('Error updating word', { error });
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
};

export{
    createWord,
    getAllWord,
    deleteWord,
    updateWord
};
