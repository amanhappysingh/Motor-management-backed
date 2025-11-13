import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import compression from "compression";
import env from "./config/env";
import { apiRouter } from "./routes";
import path from "path";

const app: Application = express();

const allowedOrigins: string[] = env.ALLOWED_ORIGIN.split(",") || [];

// const corsOptions: CorsOptions = {
//   origin: (requestOrigin, callback) => {
//     if (!requestOrigin) return callback(null, true);

//     if (allowedOrigins.length === 0 || allowedOrigins.includes(requestOrigin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`Not allowed by CORS: ${requestOrigin}`));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
app.use(cors({
  origin: ["http://localhost:1209", "http://192.168.1.5:1209", "*"],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: 1000, extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is healthy", status: "Ok" });
});

app.use("/v1", apiRouter);

export default app;
