// auth.controller.ts
// Importing packges
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { generateUUID } from '../helpers/uuid.helper';

// Importing models
import userModel from '../models/user.model';

// Importing constants
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';


const handleRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userValidation = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required()
    });

    const { error } = userValidation.validate(req.body);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const checkIsUserExists = await userModel
      .findOne({
        email
      })
      .select('email -_id');

    if (checkIsUserExists) {
      res.status(HttpStatusCode.Conflict).json({
        status: httpStatusConstant.CONFLICT,
        code: HttpStatusCode.Conflict,
        message: responseMessageConstant.USER_ALREADY_EXISTS
      });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const generatedUserId = generateUUID();
      await userModel.create({
        userId: generatedUserId,
        name,
        email,
        isManualAuth: true,
        profilePicture: '',
        password: encryptedPassword
      });
      res.status(HttpStatusCode.Created).json({ status: httpStatusConstant.CREATED, code: HttpStatusCode.Created });
    }
  } catch (err: any) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};

/**
 * @createdBy Kavin Nishanthan
 * @createdAt 2023-11-09
 * @description This function is used to handle user login
 */

const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userValidation = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    });

    const { error } = userValidation.validate(req.body);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const userResponse = await userModel.findOne({
      email
    });

    if (!userResponse) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    } else {
      if (!userResponse.isManualAuth) {
        return res.status(HttpStatusCode.BadRequest).json({
          status: httpStatusConstant.BAD_REQUEST,
          code: HttpStatusCode.BadRequest,
          message: responseMessageConstant.ACCOUNT_ASSOCIATED_WITH_GOOGLE
        });
      }

      const isValidPassword = await bcrypt.compare(password, userResponse.password || '');

      if (isValidPassword) {
        const { email, name, userId, profilePicture } = userResponse;
        res.status(HttpStatusCode.Ok).json({
          status: httpStatusConstant.OK,
          code: HttpStatusCode.Ok,
          userId: userId,
          email,
          name,
          profilePicture
        });
      } else {
        res.status(HttpStatusCode.Unauthorized).json({
          status: httpStatusConstant.UNAUTHORIZED,
          code: HttpStatusCode.Unauthorized,
          message: responseMessageConstant.INVALID_CREDENTIALS
        });
      }
    }
  } catch (err: any) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ status: httpStatusConstant.ERROR, code: HttpStatusCode.InternalServerError });
  }
};

/**
 * @createdBy Kavin Nishanthan
 * @createdAt 2023-11-09
 * @description This function is used Google Signin
 */

const handleGoogleSignIn = async (req: Request, res: Response) => {
  try {
    const { email, name, profilePicture } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(HttpStatusCode.Ok).json({
        status: httpStatusConstant.OK,
        code: HttpStatusCode.Ok,
        message: responseMessageConstant.ACCOUNT_ASSOCIATED_WITH_GOOGLE,
        userId: existingUser.userId,
        email: existingUser.email,
        name: existingUser.name,
        profilePicture: existingUser.profilePicture
      });
    }
    const generatedUserId = generateUUID();

    const newUser = new userModel({
      userId: generatedUserId,
      email,
      name,
      profilePicture,
      isManualAuth: false
    });

    await newUser.save();

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created,
      message: responseMessageConstant.USER_CREATED,
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      profilePicture: newUser.profilePicture
    });
  } catch (err: any) {
    res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError,
      message: responseMessageConstant.INVALID_CREDENTIALS
    });
  }
};

export default {
  handleRegister,
  handleLogin,
  handleGoogleSignIn
};
