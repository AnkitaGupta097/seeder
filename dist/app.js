"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const v1_1 = __importDefault(require("./routes/v1"));
const error_1 = __importDefault(require("./controllers/error"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_2 = require("./middlewares/error");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded());
app.use(body_parser_1.default.json());
// v1 api routes
app.use("/v1", v1_1.default);
app.use(error_1.default);
app.use(error_2.errorConverter);
app.use(error_2.errorHandler);
(0, database_1.default)().then(() => {
    app.listen(3000, () => {
        console.log("server is listening on port 3000");
    });
})
    .catch(err => console.log("error in connecting to mongodb" + err));
