import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVar } from "./app/config/env";

let server: Server;


const serverStart = async () => {
    // const port = 5000;

    try {

        await mongoose.connect(envVar.DB_URL);
        console.log("Database connected");
        server = app.listen(envVar.PORT, ()=>{
            console.log(`server started on port ${envVar.PORT}`)
        })
        
    } catch (error) {
        console.log(error);
    }


}

serverStart();


process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection is detected, we are closing our server....",error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})

