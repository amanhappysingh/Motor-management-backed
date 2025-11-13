import * as express from "express";
import { Roles } from "./core/types";


global{
    namespace Express {
        interface Request {
            user?: {
                userId: string,
                role: Roles
            }
        }
    }
}