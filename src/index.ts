import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import httpStatusText from "./utils/httpStatusText";
import Connectdb from "./connection/connectdb";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
Connectdb();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
});

app.use('/api/', apiLimiter);

import Admin from './router/admin.Router'
import Word from './router/word.router'

app.use('/api/admin',Admin);
app.use('/api/word',Word);

const port = process.env.PORT || 8000;

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ status: httpStatusText.ERROR, msg: "Cannot find data" });
});


app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
