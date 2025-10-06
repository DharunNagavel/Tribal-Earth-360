import express from 'express';
import {PORT} from './config/env.js'
import authRouter from './routes/auth.route.js';
import cors from 'cors';
import cokkiesParser from 'cookie-parser';
import pool from './db.js';
import pattaRouter from './routes/patta.route.js';
import { inject } from '@vercel/analytics';


const app = express();
app.use(cors());
app.use(cokkiesParser());
app.use(express.json());
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/patta',pattaRouter);

pool.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database:', err);
    });

inject();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});