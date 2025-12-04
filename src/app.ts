import express from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import "./app/config/passport";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVar } from "./app/config/env";
import cors from "cors";


const app = express();

const allowedOrigins = [
    envVar.FRONTEND_URL,    
    envVar.BACKEND_URL,    
];

app.use(expressSession({
    secret: envVar.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());

app.use(cors({    
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use("/api/v1", router)

app.use(globalErrorHandler);

export default app;