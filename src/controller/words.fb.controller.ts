import { Request, Response, NextFunction } from 'express';
import httpStatusText from '../utils/httpStatusText';
import logger from '../utils/logger';
import { db as firebaseDb } from "../connection/firebase"; // Assume you have initialized Firebase
import { collection, addDoc , getDocs} from "firebase/firestore";


const createWords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { wordArabic, wordEnglish, wordFrench, etat, description, image } = req.body;
        
        const createdAt = new Date().toISOString();
        if (!wordArabic || !wordFrench || !description) {
            return res.status(400).json({ status: httpStatusText.ERROR, message: 'Invalid input data' });
        }
        const wordData: any = {
            wordArabic,
            wordEnglish,
            wordFrench,
            etat,
            description,
            createdAt
        };
        if (image) {
            wordData.image = image;
        }
        const docRef = await addDoc(collection(firebaseDb, "word"), wordData);
        
        logger.info('Word added successfully to Firebase', { firebaseDocId: docRef.id });
        return res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: { id: docRef.id, wordArabic, wordEnglish, wordFrench, etat, description, image, createdAt }
        });
    } catch (error) {
        logger.error('Error adding word to Firebase', { error });
        return res.status(500).json({ status: httpStatusText.ERROR, message: error});
    }
};

const getAllWords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        interface IIndex {
            word: string;
            at: number;
        }
        let index: IIndex[] = [
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
            { word: 'ي', at: -1 },
        ];
        let word2Snapshot = await getDocs(collection(firebaseDb, "word"));
        let words = word2Snapshot.docs.map(doc => ({ id: doc.id,
            wordArabic: doc.data().wordArabic,
            wordEnglish: doc.data().wordEnglish,
            wordFrench: doc.data().wordFrench,
            etat: doc.data().etat,
            description: doc.data().description,
            image: doc.data().image, }));
        words.sort((a, b) => {
            return a.wordArabic.localeCompare(b.wordArabic);
        });
        logger.info('Retrieved all words', { count: words.length });
        for (let i = 0; i < words.length; i++) {
            const firstLetter = words[i].wordArabic.charAt(0);
            const indexItem = index.find(item => item.word === firstLetter);
            if (indexItem && indexItem.at === -1) {
                indexItem.at = i;
            }
        }
        res.status(200).json({ status: "SUCCESS", data: { words }, index });
    } catch (error) {
        logger.error("Error fetching words", { error });
        res.status(500).json({ status: "ERROR", msg: "Server error" });
    }
};

const getAllWordsFrench = async (req: Request, res: Response, next: NextFunction) => {
    try {
        interface IIndex {
            word: string;
            at: number;
        }
        let index: IIndex[] = [
            { word: 'a', at: -1 },
            { word: 'b', at: -1 },
            { word: 'c', at: -1 },
            { word: 'd', at: -1 },
            { word: 'e', at: -1 },
            { word: 'f', at: -1 },
            { word: 'g', at: -1 },
            { word: 'h', at: -1 },
            { word: 'i', at: -1 },
            { word: 'j', at: -1 },
            { word: 'k', at: -1 },
            { word: 'l', at: -1 },
            { word: 'm', at: -1 },
            { word: 'n', at: -1 },
            { word: 'o', at: -1 },
            { word: 'p', at: -1 },
            { word: 'q', at: -1 },
            { word: 'r', at: -1 },
            { word: 's', at: -1 },
            { word: 't', at: -1 },
            { word: 'u', at: -1 },
            { word: 'v', at: -1 },
            { word: 'w', at: -1 },
            { word: 'x', at: -1 },
            { word: 'y', at: -1 },
            { word: 'z', at: -1 },
        ];
        let word2Snapshot = await getDocs(collection(firebaseDb, "word"));
        let words = word2Snapshot.docs.map(doc => ({ id: doc.id,
            wordArabic: doc.data().wordArabic,
            wordEnglish: doc.data().wordEnglish,
            wordFrench: doc.data().wordFrench,
            etat: doc.data().etat,
            description: doc.data().description,
            image: doc.data().image, }));
        words.sort((a, b) => {
            return a.wordFrench.localeCompare(b.wordFrench);
        });
        logger.info('Retrieved all words', { count: words.length });
        for (let i = 0; i < words.length; i++) {
            const firstLetter = words[i].wordFrench.charAt(0).toLowerCase();
            const indexItem = index.find(item => item.word === firstLetter);
            if (indexItem && indexItem.at === -1) {
                indexItem.at = i;
            }
        }
        res.status(200).json({ status: "SUCCESS", data: { words }, index });
    } catch (error) {
        logger.error("Error fetching words", { error });
        res.status(500).json({ status: "ERROR", msg: "Server error" });
    }
};

export{
    createWords,
    getAllWords,
    getAllWordsFrench
};
