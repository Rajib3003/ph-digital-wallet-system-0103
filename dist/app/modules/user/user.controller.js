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
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User Created Successfully !*!",
        statusCode: 200,
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.UserService.getAllUsers(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "All Users Retrieved Successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const UserId = req.params.userId;
    const result = yield user_service_1.UserService.getSingleUser(UserId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Single Users Retrieved Successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const UserId = req.params.userId;
    const result = yield user_service_1.UserService.deleteUser(UserId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User Delete Successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const updatedUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const UserId = req.params.userId;
    const payload = req.body;
    const result = yield user_service_1.UserService.updatedUser(UserId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User Updated Successfully !*!",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
// const query = req.query
// const result = await UserService.getAllUsers(query as Record<string, string>);
exports.UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updatedUser
};
