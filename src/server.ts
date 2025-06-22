import dotenv from "dotenv";
import { Server } from 'http';
import app from "./app";
import mongoose from "mongoose";

dotenv.config();

let server: Server;

const PORT = 3000;

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string);

        console.log("Library Management Database is connected successfully!");

        server = app.listen(PORT, () => {
            console.log(`Library Management server is running on port ${PORT}!`);
        })
    } catch (error) {
        console.log("Not able to connect in MongoDB!", error);
    }

};


main();