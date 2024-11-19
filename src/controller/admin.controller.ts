import { Request, Response, NextFunction } from 'express';
import admindb from '../model/admin.model';
import httpStatusText from '../utils/httpStatusText';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullname, email, password, avatar } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const addNewAdmin = new admindb({ fullname, email, password: hashedPassword, avatar });
        await addNewAdmin.save();
        logger.info('Admin created successfully', { adminId: addNewAdmin._id });
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { addNewAdmin } });
    } catch (error) {
        logger.error("error   == ",error);
        res.status(500).json({status:httpStatusText.ERROR,msg:"server thing"})
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const admin = await admindb.findOne({ email: email });
        if (!admin) {
            logger.warn('Login attempt with non-existing email', { email });
            return res.status(404).json({ status: httpStatusText.FAIL, message: "Email doesn't exist" });
        }
        const passwordCompare = await bcrypt.compare(password, admin.password);
        if (!passwordCompare) {
        logger.warn('Login attempt with incorrect password', { email });
        return res.status(404).json({ status: httpStatusText.FAIL, message: "Incorrect password" });
        }
        logger.info('Admin logged in successfully', { adminId: admin._id });
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: {
                fullname: admin.fullname,
                email: email,
                avatar: admin.avatar,
            },
        });
    } catch (error) {
        logger.error("error   == ",error);
        res.status(500).json({status:httpStatusText.ERROR,msg:`server thing ${error}`})
    }
};

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admins = await admindb.find();
        logger.info('Retrieved all admins', { count: admins.length });
        res.status(200).json(admins);
    } catch (error) {
        logger.error("error   == ",error);
        res.status(500).json({status:httpStatusText.ERROR,msg:"server thing"})
    }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.params.id;
        const admin = await admindb.findById(adminId);
        if (!admin) {
            logger.warn('Attempt to delete non-existing admin', { adminId });
            return res.status(404).json({ success: httpStatusText.FAIL, message: "Admin doesn't exist" });
        }
        await admindb.findByIdAndDelete(adminId);
        logger.info('Admin deleted successfully', { adminId });
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'Admin deleted successfully' });
    } catch (error) {
        logger.error("error   == ",error);
        res.status(500).json({status:httpStatusText.ERROR,msg:"server thing"})
    }
};

const updateAdmin = async (req: Request, res: Response) => {
    try {
        const adminId = req.params.id;
        const updates = req.body;
        const admin = await admindb.findByIdAndUpdate(adminId, updates, { new: true });
        if (!admin) {
            logger.warn('Attempt to update non-existing admin', { adminId });
            return res.status(404).json({ success: httpStatusText.FAIL, message: 'Admin not found' });
        }
        logger.info('Admin updated successfully', { adminId });
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'Admin updated successfully', data: { admin } });
    } catch (error) {
        logger.error('Error updating admin', { error });
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
};

export{
    createAdmin,
    login,
    getAllAdmin,
    deleteAdmin,
    updateAdmin,
};
