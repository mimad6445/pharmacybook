import { Request, Response, NextFunction } from 'express';
import wordsdb from '../model/word.model';
import httpStatusText from '../utils/httpStatusText';
import logger from '../utils/logger';
import { db as firebaseDb } from "../connection/firebase"; // Assume you have initialized Firebase
import { collection, addDoc , getDocs} from "firebase/firestore";
import { FirebaseError } from 'firebase/app';

const createWords = async (req: Request, res: Response, next: NextFunction) => {
    const { wordArabic, wordEnglish, wordFrench, etat, description, image } = req.body;
    try {
            const docRef = await addDoc(collection(firebaseDb, "word"), {
                wordArabic,
                wordEnglish,
                wordFrench,
                etat,
                description,
                image,
            });
            logger.info('Word added successfully to Firebase', { firebaseDocId: docRef.id });
            return res.status(201).json({ status: "SUCCESS", data: { id: docRef.id, wordArabic, wordEnglish, wordFrench, etat, description, image } });
    } catch (error) {
        if(error instanceof FirebaseError){
            const addNewWord = new wordsdb({wordArabic,wordEnglish,wordFrench,etat,description,image });
            await addNewWord.save();
            logger.info('word created successfully', { adminId: addNewWord._id });
            res.status(201).json({ status: httpStatusText.SUCCESS, data: { addNewWord } });
        }
        else{
            logger.error('Error adding word', { error });
            return res.status(500).json({ status: "ERROR", message: error });
        }
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
        let word1 = await wordsdb.find();
        let word2Snapshot = await getDocs(collection(firebaseDb, "word"));
        let word2 = word2Snapshot.docs.map(doc => ({ id: doc.id,
            wordArabic: doc.data().wordArabic,
            wordEnglish: doc.data().wordEnglish,
            wordFrench: doc.data().wordFrench,
            etat: doc.data().etat,
            description: doc.data().description,
            image: doc.data().image, }));
        const words = [...word1,...word2]
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



export{
    createWords,
    getAllWords,
};
