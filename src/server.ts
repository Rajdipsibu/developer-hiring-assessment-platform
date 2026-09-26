import express, {type Request,type Response } from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, TypeScript + Express!' });
});


const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server is running at http://localhost:${PORT}`
    );
  });
};

startServer();