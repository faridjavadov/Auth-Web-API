import express from "express"
import mongoose from "mongoose"
import { userRoutes } from "./routes/userRoute.js";
import { ConnectMongo } from "./config/db.js";

const app = express();
app.use(express.json());
ConnectMongo();

app.use('/api/auth',userRoutes)


app.listen(8080,()=>{
    console.log("Server is Running");
})