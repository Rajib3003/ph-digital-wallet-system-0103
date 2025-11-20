import express from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import "./app/config/passport";


const app = express();
app.use(express.json());


// app.use(cors())

app.use("/api/v1", router)

app.use(globalErrorHandler);

export default app;