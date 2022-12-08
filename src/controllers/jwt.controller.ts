import express, { Request, Response } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import { User } from '../entities/UserJwt.entitiy';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

const signUp = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, email, password } = req.body;

    if (!(firstName && middleName && lastName && email && password)) {
      return res.status(400).json('All the input are required');
    }
    const userExist = await userRepository
      .createQueryBuilder('user')
      .select()
      .where({
        email: email.toLowerCase(),
      })
      .getOne();

    if (userExist) {
      return res.status(400).json('User already exist');
    }
    // const saltRounds = 10;
    // console.log(password);
    // console.log(typeof password);

    const salt = await bcrypt.genSalt(12);
    // console.log(salt);
    const hashPassword = await bcrypt.hash(password, salt);
    // console.log(hashPassword);

    const newUser = await userRepository
      .createQueryBuilder('user')
      .insert()
      .into(User)
      .values({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email.toLowerCase(),
        password: hashPassword,
      })
      .returning('id,firstname,middlename,lastname,email')
      .execute();
    // console.log(newUser?.raw?.[0]?.id);

    const token = jwt.sign(
      { user_id: newUser?.raw?.[0]?.id, email },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );

    console.log(token);
    return res.status(200).json({
      data: newUser?.raw?.[0],
      JWT: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

//
//
//
//
//
//

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json('All the input are required');
    }

    const UserExist = await userRepository
      .createQueryBuilder('user')
      .select()
      .where({ email: email })
      //   .andWhere({ password: password })
      .getRawOne();
    console.log(UserExist);

    if (!UserExist) {
      return res.status(400).json("User doesn't already exist");
    }
    const hashPassword = UserExist.user_password;
    // console.log(hashPassword);
    const correctPassword = await bcrypt.compare(password, hashPassword);

    if (!correctPassword) {
      return res.status(400).json('User enter the proper password');
    }
    const token = jwt.sign(
      { user_id: UserExist?.user_id, email },
      process.env.TOKEN_KEY as string,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      data: 'User is logged in',
      JWT: token,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

export { login, signUp };
