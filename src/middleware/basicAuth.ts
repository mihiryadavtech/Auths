import base64 from 'base-64';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import { Basic } from '../entities/Basic.entitiy';
import bcrypt from 'bcrypt';

const basicRepository = AppDataSource.getRepository(Basic);

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decodeCredentials = (authHeader: string) => {
    const encodedCredentials = authHeader?.trim()?.replace(/Basic\s+/i, '');
    const decodeCredentials = base64.decode(encodedCredentials);
    return decodeCredentials.split(':');
  };

  const authorization = decodeCredentials(req?.headers?.authorization || '');
  const [email, password] = authorization;

  const authenticatedUser = await basicRepository
    .createQueryBuilder('basic')
    .where({
      email: email,
    })
    .getOne();
  const match = await bcrypt.compare(
    password,
    authenticatedUser?.password as string
  );
  if (match) {
    req.app.set('user', authenticatedUser);
  }
  next();
  res.set('WWW-Authenticate', 'Basic realm="user_pages"');
};

export { authorization as auth };
