import "reflect-metadata"; // required for class-transformer library

import express from 'express'
import mongoConnect from './database';
import routes from './routes/v1';
import get404 from './controllers/error';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import { errorConverter, errorHandler } from './middlewares/error';
import logger from './logger';
import mongoose from 'mongoose'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// v1 api routes
app.use("/v1", routes);
app.use(get404);

app.use(errorConverter)
app.use(errorHandler)

mongoConnect().then(() => {
    process.env.NODE_ENV != 'test' && app.listen(process.env.PORT, () => {
        logger.info("server is listening on port " + process.env.PORT)
    })
})
    .catch(err => logger.error("error in connecting to mongodb" + err));

export default app
