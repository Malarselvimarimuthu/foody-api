"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const orders_controller_1 = __importDefault(require("../controllers/orders.controller"));
// Defining routers
const router = (0, express_1.Router)();
// orders routes
router.delete('/:userId/:orderId', orders_controller_1.default.deleteOrder);
router.post('/placeOrder', orders_controller_1.default.handlePlaceOrder);
router.get('/fetchOrders/:userId', orders_controller_1.default.fetchUserOrders);
exports.default = router;
