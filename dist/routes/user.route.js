"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const express_1 = require("express");
// Importing controllers
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
// Defining routers
const router = (0, express_1.Router)();
// user routes
router.get('/userDetails/:userId', user_controller_1.default.fetchUserDetails);
exports.default = router;
