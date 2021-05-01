import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/user';

// Config
const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

//Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected');
}).catch(() => {
    console.log('DB is not connect');
});

mongoose.connection.on('Error', err => {
    console.log(`Data connect failed, ${err.message}`);
});

// Routes
app.use("/api", authRouter);
app.use("/api", userRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Server is running on port ', port)
})