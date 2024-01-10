import { mnemonicNew, mnemonicToPrivateKey, KeyPair } from 'ton-crypto';
import { Address, TonClient, WalletContractV4 } from "ton";
import {NextFunction, Request, Response} from "express";
import config from "../config";
import createError from "http-errors";

export class UserWalletService {
    private client: TonClient;

    constructor() {
        this.client = new TonClient({
            endpoint: `${config.rpcUrl}`
        });
    }

    public async generateCredentials(): Promise<{ mnemonics: string[], keyPair: KeyPair, address: Address }> {
        const mnemonics = await mnemonicNew();
        const keyPair: KeyPair = await mnemonicToPrivateKey(mnemonics);

        const wallet = WalletContractV4.create({
            workchain: 0,
            publicKey: keyPair.publicKey
        });

        const address = wallet.address;

        return { mnemonics, keyPair, address };
    }

    public async getWalletBalance(publicKey: any): Promise<bigint> { //todo correct type
        const publicKeyBuffer = Buffer.from(publicKey, 'hex');
        const wallet = WalletContractV4.create({
            workchain: 0,
            publicKey: publicKeyBuffer
        });

        const contract = this.client.open(wallet);
        const balace =  await contract.getBalance();
        return balace
    }

    public async getLastAddress(addr: string): Promise<void | null> {
        try {
            const response = await fetch(`${config.tonApiUrl}/v2/blockchain/accounts/${addr}/transactions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.tonApiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(await response.json())

            const data = await response.json();

            return data.transactions.length >= 1 ? data.transactions[0].account.address : null
        } catch (e) {
            console.error(e);
        }
    }
}
