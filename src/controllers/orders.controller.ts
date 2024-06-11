// Importing packges
import Joi from 'joi';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { generateUUID } from '../helpers/uuid.helper';

// Importing models
import userModel from '../models/user.model';

// Importing constants
import httpStatusConstant from '../constants/http-message.constant';
import responseMessageConstant from '../constants/response-message.constant';

/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to place Order
 */

const handlePlaceOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, totalCost } = req.body;

    const userValidation = Joi.object({
      userId: Joi.string().required(),
      items: Joi.array().required(),
      totalCost: Joi.number().required()
    });

    const { error } = userValidation.validate(req.body);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const user = await userModel.findOne({ userId: userId });

    const orderId = generateUUID();

    const orderHistory = {
      orderId,
      items,
      totalCost,
      orderDateTime: new Date()
    };

    user?.orders?.push(orderHistory);

    await user?.save();

    res.status(HttpStatusCode.Created).json({
      status: httpStatusConstant.CREATED,
      code: HttpStatusCode.Created,
      message: responseMessageConstant.YOUR_ORDER_HAS_BEEN_PLACED_SUCCESSFULLY
    });
  } catch (err: any) {
    console.error('Error in Ordering:', err);
    res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to Fetch Orders
 */

const fetchUserOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const validationSchema = Joi.object({
      userId: Joi.string().required()
    });

    const { error } = validationSchema.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    if (!user.orders || user.orders.length === 0) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.NO_ORDERS_FOUND
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      message: responseMessageConstant.ORDERS_FETCHED_SUCCESSFULLY,
      data: user.orders
    });
  } catch (err: any) {
    console.error('Error in Fetching Orders:', err);
    res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to Delete Order
 */

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { userId, orderId } = req.params;

    const validationSchema = Joi.object({
      userId: Joi.string().required(),
      orderId: Joi.string().required()
    });

    const { error } = validationSchema.validate(req.params);

    if (error) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: httpStatusConstant.BAD_REQUEST,
        code: HttpStatusCode.BadRequest,
        message: error.details[0].message.replace(/"/g, '')
      });
    }

    const user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.USER_NOT_FOUND
      });
    }

    if (!user.orders || user.orders.length === 0) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.ORDER_NOT_FOUND
      });
    }

    const orderIndex = user.orders.findIndex((order) => order.orderId === orderId);

    if (orderIndex === -1) {
      return res.status(HttpStatusCode.NotFound).json({
        status: httpStatusConstant.NOT_FOUND,
        code: HttpStatusCode.NotFound,
        message: responseMessageConstant.ORDER_NOT_FOUND
      });
    }

    user.orders.splice(orderIndex, 1);
    await user.save();

    res.status(HttpStatusCode.Ok).json({
      status: httpStatusConstant.OK,
      code: HttpStatusCode.Ok,
      message: responseMessageConstant.ORDER_DELETED_SUCCESSFULLY
    });
  } catch (err: any) {
    console.error('Error in Deleting Order:', err);
    res.status(HttpStatusCode.InternalServerError).json({
      status: httpStatusConstant.ERROR,
      code: HttpStatusCode.InternalServerError
    });
  }
};

export default {
  handlePlaceOrder,
  deleteOrder,
  fetchUserOrders
};
