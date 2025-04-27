"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = require("dotenv");
const db_1 = __importDefault(require("./db/db"));
(0, dotenv_1.config)();
(0, db_1.default)()
    .then(() => {
    app_1.default.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
