// Importing packges
import Joi from 'joi';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

// Importing models
import userModel from '../models/user.model';

// Importing constants
import httpStatusConstant from '../constants/http-message.constant';

/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to handle Fetch User Details
 */

const fetchUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userValidation = Joi.object({
      userId: Joi.string().required()
    });

    const { error } = userValidation.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const user = await userModel.findOne({ userId: userId });

    return res.status(HttpStatusCode.Ok).json(user);
  } catch (err: any) {
    console.error('Error in Fetching User Details:', err);
    res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

export default {
  fetchUserDetails
};
