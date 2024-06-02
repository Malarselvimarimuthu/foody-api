"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const mongoose_1 = require("mongoose");
const orderHistorySchema = new mongoose_1.Schema({
    orderId: { type: String, require: true },
    items: [
        {
            name: { type: String, required: true },
            count: { type: Number, required: true }
        }
    ],
    totalCost: { type: Number, required: true },
    orderDateTime: { type: Date, required: true }
}, { _id: false });
const schema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, default: '' },
    orders: { type: [orderHistorySchema], default: [] }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('user', schema);
