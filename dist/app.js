"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importStar(require("./routes/user.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const content_route_1 = __importDefault(require("./routes/content.route"));
//import for oauth
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./controllers/googleAuth.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)()); // Middleware to parse cookies
app.use(express_1.default.json()); // Middleware to parse JSON requests
app.use(express_1.default.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
const allowedOrigins = [
    "http://localhost:5173",
    "https://app-brainly-peach.vercel.app"
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true // if you use cookies/sessions
}));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// app.get("/", (_, res) => {
//     res.send(`<h2>Home</h2><a href="/oauth/google">Login with Google</a><br/><a href="/oauth/github">Login with GitHub</a>`);
// });
app.use("/oauth", user_route_1.router);
// middlewares and routes
app.use("/api/v1", user_route_1.default);
app.use("/api/v1/content", content_route_1.default);
exports.default = app; // Export the app instance for use in other modules
