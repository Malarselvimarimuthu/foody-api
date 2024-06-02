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
// Importing models
const user_model_1 = __importDefault(require("../models/user.model"));
// Importing constants
const http_message_constant_1 = __importDefault(require("../constants/http-message.constant"));
/**
 * @createdBy Malar Selvi
 * @createdAt 2024-5-31
 * @description This function is used to handle Fetch User Details
 */
const fetchUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userValidation = joi_1.default.object({
            userId: joi_1.default.string().required()
        });
        const { error } = userValidation.validate(req.params);
        if (error) {
            return res.status(axios_1.HttpStatusCode.BadRequest).json({
                status: http_message_constant_1.default.BAD_REQUEST,
                code: axios_1.HttpStatusCode.BadRequest,
                message: error.details[0].message.replace(/"/g, '')
            });
        }
        const user = yield user_model_1.default.findOne({ userId: userId });
        return res.status(axios_1.HttpStatusCode.Ok).json(user);
    }
    catch (err) {
        console.error('Error in Fetching User Details:', err);
        res.status(axios_1.HttpStatusCode.InternalServerError).json({
            status: http_message_constant_1.default.ERROR,
            code: axios_1.HttpStatusCode.InternalServerError
        });
    }
});
exports.default = {
    fetchUserDetails
};
