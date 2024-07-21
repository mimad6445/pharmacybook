import mongoose, { Document, Schema, Model, model } from "mongoose";

interface IAdmin extends Document {
    fullname: string;
    email: string;
    password: string;
    avatar: string;
}

const adminSchema: Schema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
}, { timestamps: true });

// Export the Admin model
const Admin: Model<IAdmin> = model<IAdmin>('Admin', adminSchema);

export default Admin;
