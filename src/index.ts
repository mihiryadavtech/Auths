import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { AppDataSource } from './dataBaseConnection';
import { jwtRouter } from './routes/jwt.routes';
const app = express();
const PORT = process.env.PORT || 2000;
const main = async () => {
  try {
    await AppDataSource.initialize();

    app.use(express.json());

    app.use('/api/v1/jwt', jwtRouter);

    app.use('/', (req: Request, res: Response) => {
      res.json('I am the main file');
    });

    app.listen(PORT, () => {
      console.log(`I am listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
