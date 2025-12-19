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
    const port = Number(process.env.PORT) || 5000;
    app_1.default.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
