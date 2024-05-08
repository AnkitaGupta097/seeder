"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // required for class-transformer library
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const v1_1 = __importDefault(require("./routes/v1"));
const error_1 = __importDefault(require("./controllers/error"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_2 = require("./middlewares/error");
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded());
app.use(body_parser_1.default.json());
// v1 api routes
app.use("/v1", v1_1.default);
app.use(error_1.default);
app.use(error_2.errorConverter);
app.use(error_2.errorHandler);
(0, database_1.default)().then(() => {
    process.env.NODE_ENV != 'test' && app.listen(process.env.PORT, () => {
        logger_1.default.info("server is listening on port " + process.env.PORT);
    });
})
    .catch(err => logger_1.default.error("error in connecting to mongodb" + err));
exports.default = app;
