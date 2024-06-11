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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios_1 = require("axios");
const uuid_helper_1 = require("../helpers/uuid.helper");
// Importing models
const user_model_1 = __importDefault(require("../models/user.model"));
// Importing constants
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
const response_message_constant_1 = __importDefault(require("../constants/response-message.constant"));
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userValidation = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            password: joi_1.default.string().required()
        });
        const { error } = userValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const checkIsUserExists = yield user_model_1.default
            .findOne({
            email
        })
            .select('email -_id');
        if (checkIsUserExists) {
            res.status(axios_1.HttpStatusCode.Conflict).json({
                status: http_message_constant_1.default.CONFLICT,
                code: axios_1.HttpStatusCode.Conflict,
                message: response_message_constant_1.default.USER_ALREADY_EXISTS
            });
        }
        else {
            const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
            const generatedUserId = (0, uuid_helper_1.generateUUID)();
            yield user_model_1.default.create({
                userId: generatedUserId,
                username: name,
                email,
                password: encryptedPassword
            });
            res.status(axios_1.HttpStatusCode.Created).json({ status: http_message_constant_1.default.CREATED, code: axios_1.HttpStatusCode.Created });
        }
    }
    catch (err) {
        res
            .status(axios_1.HttpStatusCode.InternalServerError)
            .json({ status: http_message_constant_1.default.ERROR, code: axios_1.HttpStatusCode.InternalServerError });
    }
});
/**
 * @createdBy Malarselvi
 * @createdAt 06/10/2024
 * @description This function is used to handle user login
 */
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userValidation = joi_1.default.object({
            email: joi_1.default.string().required(),
            password: joi_1.default.string().required()
        });
        const { error } = userValidation.validate(req.body);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const userResponse = yield user_model_1.default.findOne({
            email
        });
        if (!userResponse) {
            return res.status(axios_1.HttpStatusCode.NotFound).json({
                status: http_message_constant_1.default.NOT_FOUND,
                code: axios_1.HttpStatusCode.NotFound,
                message: response_message_constant_1.default.USER_NOT_FOUND
            });
        }
        else {
            const isValidPassword = yield bcryptjs_1.default.compare(password, userResponse.password || '');
            if (isValidPassword) {
                const { email, userId } = userResponse;
                res.status(axios_1.HttpStatusCode.Ok).json({
                    status: http_message_constant_1.default.OK,
                    code: axios_1.HttpStatusCode.Ok,
                    userId: userId,
                    email
                });
            }
            else {
                res.status(axios_1.HttpStatusCode.Unauthorized).json({
                    status: http_message_constant_1.default.UNAUTHORIZED,
                    code: axios_1.HttpStatusCode.Unauthorized,
                    message: response_message_constant_1.default.INVALID_CREDENTIALS
                });
            }
        }
    }
    catch (err) {
        res
            .status(axios_1.HttpStatusCode.InternalServerError)
            .json({ status: http_message_constant_1.default.ERROR, code: axios_1.HttpStatusCode.InternalServerError });
    }
});
exports.default = {
    handleRegister,
    handleLogin
};
