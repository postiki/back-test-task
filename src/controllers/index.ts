import express from 'express';
import AuthMiddleware from "../middlewares/AuthMiddleware";
import {WalletController} from "./wallet-controller";

export class RootController {
    public readonly router = express.Router();

    constructor() {
        this.router.use('/', new WalletController().router)
    }
}