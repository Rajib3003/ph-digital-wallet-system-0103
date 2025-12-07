"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["TOPUP"] = "TOPUP";
    TransactionType["WITHDRAW"] = "WITHDRAW";
    TransactionType["SEND"] = "SEND";
    TransactionType["CASHIN"] = "CASHIN";
    TransactionType["CASHOUT"] = "CASHOUT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
