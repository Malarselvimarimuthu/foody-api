"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
// Importing packages
const express_1 = require("express");
// Importing routes
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const orders_route_1 = __importDefault(require("./orders.route"));
// Defining router
const router = (0, express_1.Router)();
// Non authorization routes
router.use('/auth', auth_route_1.default);
// Authorization routes
router.use('/user', user_route_1.default);
router.use('/orders', orders_route_1.default);
exports.default = router;
