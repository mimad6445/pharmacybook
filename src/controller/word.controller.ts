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
        
        interface Iindex{
            word:string,
            at:number
        }
        let index: Iindex[] = [
            { word: 'أ', at: -1 },
            { word: 'ب', at: -1 },
            { word: 'ت', at: -1 },
            { word: 'ث', at: -1 },
            { word: 'ج', at: -1 },
            { word: 'ح', at: -1 },
            { word: 'خ', at: -1 },
            { word: 'د', at: -1 },
            { word: 'ذ', at: -1 },
            { word: 'ر', at: -1 },
            { word: 'ز', at: -1 },
            { word: 'س', at: -1 },
            { word: 'ش', at: -1 },
            { word: 'ص', at: -1 },
            { word: 'ض', at: -1 },
            { word: 'ط', at: -1 },
            { word: 'ظ', at: -1 },
            { word: 'ع', at: -1 },
            { word: 'غ', at: -1 },
            { word: 'ف', at: -1 },
            { word: 'ق', at: -1 },
            { word: 'ك', at: -1 },
            { word: 'ل', at: -1 },
            { word: 'م', at: -1 },
            { word: 'ن', at: -1 },
            { word: 'ه', at: -1 },
            { word: 'و', at: -1 },
            { word: 'ي', at: -1 }
        ];
        const words = await wordsdb.find().sort({ wordArabic: 1 });
        logger.info('Retrieved all admins', { count: words.length });
        for (let i = 0; i < words.length; i++) {
            const firstLetter = words[i].wordArabic.charAt(0);
            const indexItem = index.find(item => item.word === firstLetter);
            if (indexItem && indexItem.at === -1) {
                indexItem.at = i;
            }
        }
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { words }, index});
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
