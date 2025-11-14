"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const env_1 = __importDefault(require("./config/env"));
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const allowedOrigins = env_1.default.ALLOWED_ORIGIN.split(",") || [];
const corsOptions = {
    origin: (requestOrigin, callback) => {
        if (!requestOrigin)
            return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(requestOrigin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`Not allowed by CORS: ${requestOrigin}`));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
// app.use(cors({
//   origin: ["http://localhost:1209", "http://192.168.1.5:1209", "*"],
//   credentials: true,
//   optionsSuccessStatus: 204
// }));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ limit: 1000, extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "src", "uploads")));
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy", status: "Ok" });
});
app.use("/v1", routes_1.apiRouter);
exports.default = app;
//# sourceMappingURL=app.js.map