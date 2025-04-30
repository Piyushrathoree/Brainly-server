"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const content_route_1 = __importDefault(require("./routes/content.route"));
const tag_route_1 = __importDefault(require("./routes/tag.route"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)()); // Middleware to parse cookies
app.use(express_1.default.json()); // Middleware to parse JSON requests
app.use(express_1.default.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to the Brainly API" });
});
// middlewares and routes
app.use("/api/v1", user_route_1.default);
app.use("/api/v1/content", content_route_1.default);
app.use("/api/v1/tags", tag_route_1.default); // Assuming you have a tag router
exports.default = app; // Export the app instance for use in other modules
