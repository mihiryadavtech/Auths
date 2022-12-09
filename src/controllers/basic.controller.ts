import express, { Request, Response } from 'express';
import { AppDataSource } from '../dataBaseConnection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Basic } from '../entities/Basic.entitiy';
import { User } from 'src/entities/UserJwt.entitiy';

const basicRepository = AppDataSource.getRepository(Basic);

const basicSignUp = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      return res.status(400).json('All the input are required');
    }
    const userExist = await basicRepository
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
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await basicRepository
      .createQueryBuilder('basic')
      .insert()
      .into(Basic)
      .values({
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        password: hashPassword,
      })
      .returning('id,firstname,lastname,email')
      .execute();

    return res.status(200).json({ data: newUser?.raw?.[0] });
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

const basicLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json('All the input are required');
    }

    const UserExist = await basicRepository
      .createQueryBuilder('user')
      .select()
      .where({ email: email })
      .getRawOne();
    console.log(UserExist);

    if (!UserExist) {
      return res.status(400).json("User doesn't  exist");
    }

    return res.status(200).json({ data: 'User is logged in' });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body;
    const user = req.app.get('user');
    if (!user) {
      return res.status(400).json(' Forbidden to make Changes');
    }
    // console.log('>>>>>>>>', user);
    // const UserExist = req.authenticatedUser
    if (!(firstName || lastName)) {
      return res.status(400).json(' Enter the thing input are required');
    }

    const userUpdated = await basicRepository
      .createQueryBuilder('basic')
      .update(Basic)
      .set({
        firstName: firstName,
        lastName: lastName,
      })
      .where({
        id: user.id,
      })
      .returning('id,firstname,lastname,email')
      .execute();

    // console.log(userUpdated);
    return res.status(200).json({ data: userUpdated?.raw?.[0] });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export { basicLogin, basicSignUp, updateUser };
