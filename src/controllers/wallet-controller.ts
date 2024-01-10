import express, {NextFunction, Request, Response} from "express";
import createError from "http-errors";
import {RootService} from "../services";
import config from "../config";

export class WalletController {
    public readonly router = express.Router();


    constructor() {
        this.router.get('/getBalance', this.getBalance);
        this.router.get('/getLastAddress', this.getLastAddress);
    }

    public async getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const balance = await RootService.I.appWallet.getBalance()
            const formattedBalance = Number(balance) / 1000000000;

            res.status(201).send(formattedBalance.toString());
        } catch (e) {
            console.error(e);
            next(createError(500, 'Internal Server Error'));
        }
    }

    public async getLastAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const addr = RootService.I.appWallet.addr;
            const response: any = await fetch(`${config.tonApiUrl}/v2/blockchain/accounts/${addr}/transactions?&limit=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.tonApiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            res.status(200).json(data.transactions.length >= 1 ? data.transactions[0].account.address : 'u don\'t have last trans');
        } catch (e) {
            console.error(e);
            next(createError(500, 'Internal Server Error'));
        }
    }
}