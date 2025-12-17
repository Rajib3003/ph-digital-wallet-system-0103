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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const passport_1 = __importDefault(require("passport"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const userToken_1 = require("../../utils/userToken");
const setCookie_1 = require("../../utils/setCookie");
const auth_service_1 = require("./auth.service");
const env_1 = require("../../config/env");
const credentialsLogin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('local', (error, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return next(error);
        }
        if (!user) {
            return next(new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, info.message));
        }
        const _a = user.toObject(), { password: _password } = _a, userWithoutPassword = __rest(_a, ["password"]);
        if (!_password) {
            return next(new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password is required !*!"));
        }
        const userTokens = (0, userToken_1.createUserToken)(user);
        (0, setCookie_1.setAuthCookie)(res, userTokens);
        (0, sendResponse_1.default)(res, {
            success: true,
            message: "User Login Successfully !*!",
            statusCode: http_status_codes_1.default.OK,
            data: {
                userToken: userTokens,
                user: userWithoutPassword,
            }
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Refresh Token do not recieved !*!");
    }
    const tokenInfo = yield auth_service_1.AuthService.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Access Token create successfully",
        statusCode: http_status_codes_1.default.OK,
        data: tokenInfo
    });
}));
const logout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User logged out successfully !*!",
        statusCode: http_status_codes_1.default.OK,
        data: null
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    if (!decodedToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Decoded token is not recieved");
    }
    yield auth_service_1.AuthService.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password changed successfully !*!",
        statusCode: http_status_codes_1.default.OK,
        data: null
    });
}));
const setPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { password } = req.body;
    if (!decodedToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Decoded token is not recieved !*!");
    }
    yield auth_service_1.AuthService.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password Changed successfully !*!",
        statusCode: http_status_codes_1.default.OK,
        data: null
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Email sent successfully !*!",
        statusCode: http_status_codes_1.default.OK,
        data: null
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    if (!decodedToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Decoded token is not recieved !*!");
    }
    yield auth_service_1.AuthService.resetPassword(req.body, decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password reset successfully !*!",
        statusCode: http_status_codes_1.default.OK,
        data: null
    });
}));
const googleCallBackController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User Not Found !*!");
    }
    const tokenInfo = (0, userToken_1.createUserToken)(user);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVar.FRONTEND_URL}/${redirectTo}`);
}));
exports.AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    googleCallBackController
};
