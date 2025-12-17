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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
let server;
const serverStart = () => __awaiter(void 0, void 0, void 0, function* () {
    // const port = 5000;
    try {
        yield mongoose_1.default.connect(env_1.envVar.DB_URL);
        console.log("Database connected");
        server = app_1.default.listen(env_1.envVar.PORT, () => {
            console.log(`server started on port ${env_1.envVar.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield serverStart();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
// serverStart();
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection is detected, we are closing our server....", error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    }
    process.exit(1);
});
