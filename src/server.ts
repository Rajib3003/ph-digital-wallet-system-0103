import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVar } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;


const serverStart = async () => {  
    try {
        await mongoose.connect(envVar.DB_URL as string);
        console.log("Database connected");
        server = app.listen(envVar.PORT, ()=>{
            console.log(`server started on port ${envVar.PORT}`)
        })        
    } catch (error) {
        console.log(error);
    }
}

(async()=> {
    await serverStart();
    await seedSuperAdmin();
})();

// serverStart();


process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection is detected, we are closing our server....",error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})

process.on("uncaughtException", (error) => {
    console.log("uncaught Exception is detected, we are closing our server....",error);
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})
process.on("SIGTERM", () => {
    console.log("SIGTERM singnal recieved, we are closing our server....");
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})
process.on("SIGINT", () => {
    console.log("SIGINT singnal recieved, we are closing our server....");
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        })}

        process.exit(1);

})

