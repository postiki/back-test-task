import {Address, TonClient, WalletContractV4} from 'ton';
import {mnemonicNew, mnemonicToPrivateKey} from 'ton-crypto';
import fs from 'fs';
import path from 'path';
import config from "../config";

export class AppWalletService {
    private client: TonClient;
    private wallet: WalletContractV4 | null = null;
    private workchain: number = 0;
    private credentialsFilePath: string;
    private contract: any;
    public addr: Address | undefined;

    constructor() {
        this.client = new TonClient({
            endpoint: `${config.rpcUrl}`
        });
        this.credentialsFilePath = path.join(__dirname, '../', 'wallet_credentials.json');
        this.initializeWallet();
    }

    private async initializeWallet() {
        if (fs.existsSync(this.credentialsFilePath)) {
            const data = fs.readFileSync(this.credentialsFilePath, 'utf8');
            const credentials = JSON.parse(data);
            const publicKeyBuffer = Buffer.from(credentials.publicKey, 'hex');

            this.wallet = WalletContractV4.create({
                workchain: this.workchain,
                publicKey: publicKeyBuffer
            });

            this.contract = this.client.open(this.wallet);
            this.addr = this.wallet.address
        } else {
            await this.generateNewKey();

        }
    }

    private async generateNewKey() {
        const mnemonics = await mnemonicNew();
        const keyPair = await mnemonicToPrivateKey(mnemonics);

        this.wallet = WalletContractV4.create({
            workchain: this.workchain,
            publicKey: keyPair.publicKey
        });

        fs.writeFileSync(this.credentialsFilePath, JSON.stringify({
            mnemonics: mnemonics,
            publicKey: keyPair.publicKey,
        }));

        this.contract = this.client.open(this.wallet);
        this.addr = this.wallet.address
    }

    public async getBalance(): Promise<bigint> {
        if (!this.wallet) {
            throw new Error('Wallet is not initialized');
        }
        return this.contract.getBalance()
    }
}