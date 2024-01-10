import {AppWalletService} from "./app-wallet-service";
import {UserWalletService} from "./user-wallet-service";

export class RootService {
    public readonly appWallet = new AppWalletService();
    public readonly userWallet = new UserWalletService();

    public static readonly I = new RootService();
}