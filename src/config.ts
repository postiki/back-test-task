import * as dotenv from 'dotenv';

dotenv.config();
if (process.env.NODE_ENV === 'development') {
    dotenv.config({path: '.env.development'});
} else {
    dotenv.config({path: '.env.production'});
}
export default {
    port: parseInt(process.env.PORT || '4000', 10),
    mongoUr: process.env.MONGO_URL || '',
    secretKey: process.env.SECRET_KEY || '',
    telegramApiKey: process.env.TELEGRAM_API_KEY || '',
    tonApiKey: process.env.TON_API_KEY || '',
    tonApiUrl: process.env.TON_API_URL || '',
    rpcUrl: process.env.TON_RPC_URL || '',
}