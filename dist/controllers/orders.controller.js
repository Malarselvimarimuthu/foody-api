"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packges
const joi_1 = __importDefault(require("joi"));
const axios_1 = require("axios");
const uuid_helper_1 = require("../helpers/uuid.helper");
// Importing models
const user_model_1 = __importDefault(require("../models/user.model"));
// Importing constants
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to place Order
 */
const handlePlaceOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId, items, totalCost } = req.body;
        const userValidation = joi_1.default.object({
            userId: joi_1.default.string().required(),
            items: joi_1.default.array().required(),
            totalCost: joi_1.default.number().required()
        });
        const { error } = userValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const user = yield user_model_1.default.findOne({ userId: userId });
        const orderId = (0, uuid_helper_1.generateUUID)();
        const orderHistory = {
            orderId,
            items,
            totalCost,
            orderDateTime: new Date()
        };
        (_a = user === null || user === void 0 ? void 0 : user.orders) === null || _a === void 0 ? void 0 : _a.push(orderHistory);
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(axios_1.HttpStatusCode.Created).json({
            status: http_message_constant_1.default.CREATED,
            code: axios_1.HttpStatusCode.Created,
            message: response_message_constant_1.default.YOUR_ORDER_HAS_BEEN_PLACED_SUCCESSFULLY
        });
    }
    catch (err) {
        console.error('Error in Ordering:', err);
        res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to Fetch Orders
 */
const fetchUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const validationSchema = joi_1.default.object({
            userId: joi_1.default.string().required()
        });
        const { error } = validationSchema.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const user = yield user_model_1.default.findOne({ userId: userId });
        if (!user) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        if (!user.orders || user.orders.length === 0) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.NO_ORDERS_FOUND
            });
        }
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            message: response_message_constant_1.default.ORDERS_FETCHED_SUCCESSFULLY,
            data: user.orders
        });
    }
    catch (err) {
        console.error('Error in Fetching Orders:', err);
        res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to Delete Order
 */
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, orderId } = req.params;
        const validationSchema = joi_1.default.object({
            userId: joi_1.default.string().required(),
            orderId: joi_1.default.string().required()
        });
        const { error } = validationSchema.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const user = yield user_model_1.default.findOne({ userId: userId });
        if (!user) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        if (!user.orders || user.orders.length === 0) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.ORDER_NOT_FOUND
            });
        }
        const orderIndex = user.orders.findIndex((order) => order.orderId === orderId);
        if (orderIndex === -1) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.ORDER_NOT_FOUND
            });
        }
        user.orders.splice(orderIndex, 1);
        yield user.save();
        res.status(axios_1.HttpStatusCode.Ok).json({
            status: http_message_constant_1.default.OK,
            code: axios_1.HttpStatusCode.Ok,
            message: response_message_constant_1.default.ORDER_DELETED_SUCCESSFULLY
        });
    }
    catch (err) {
        console.error('Error in Deleting Order:', err);
        res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
exports.default = {
    handlePlaceOrder,
    deleteOrder,
    fetchUserOrders
};
