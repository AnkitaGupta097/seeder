import mongoose from "mongoose";
// import { server } from "./src/app";


export default async () => {
    // Drop the database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    // await server.close()
}