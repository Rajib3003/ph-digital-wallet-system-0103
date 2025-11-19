import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;


const serverStart = async () => {
    const port = 5000;

    try {

        await mongoose.connect("mongodb+srv://mongodb:mongodb@cluster0.qgah9aq.mongodb.net/digital-wallet-db?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Database connected");
        server = app.listen(port, ()=>{
            console.log(`server started on port ${port}`)
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

