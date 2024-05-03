import express from 'express'
import type { NextFunction, Request, Response } from 'express';
import mongoConnect from './database';
import routes from './routes/v1';
import get404 from './controllers/error';
import bodyParser from 'body-parser';
import User from './models/user';
import { UserRole } from './utils/enums';

const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

//TODO replace by authentication
app.use((req, _res, next) => {
    
    User.findOne({role : UserRole.RECIPIENT})
        .then(user => {
            //@ts-ignore
            req.user= user;
            next();
        })
        .catch(err => console.log(err));
})


// v1 api routes
app.use("/v1", routes);
app.use(get404);

mongoConnect().then(() => {
    app.listen(3000, () => {
        console.log("server is listening on port 3000")
    })
})
.catch(err => console.log("error in connecting to mongodb" + err));