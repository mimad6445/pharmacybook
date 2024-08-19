import { Document, Schema, Model, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

interface Iword extends Document {
    wordArabic: string;
    wordEnglish: string;
    wordFrench: string;
    etat: string;
    description: string;
    type : String;
    image: [{
        title: String;
        image : String
    }];
}

const wordSchema: Schema = new Schema({
    wordArabic: { type: String, required: true },
    wordEnglish: { type: String},
    wordFrench: { type: String, required: true },
    description: { type: String, required: true },
    etat: { type: String },
    type : {type : String},
    image: [{
        title: {type : String},
        image : {type : String},
    }]
}, { timestamps: true });

// Export the Admin model
const word: Model<Iword> = model<Iword>('word', wordSchema);

export default word;
