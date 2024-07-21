import mongoose from 'mongoose';
import logger from '../utils/logger';

const Connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        logger.info("MongoDb Connected")
    } catch (err) {
        logger.error("error while connecting to Db")
        process.exit(1);
    }
};

export default Connectdb;
