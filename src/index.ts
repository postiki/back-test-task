import {createServer} from "http";
import {db} from "./db/db";
import config from "./config";
import api from "./api";
import bot from "./bot/bot";


class Index {
    private static server = createServer(api);

    public static async start(): Promise<void> {
        await db
        await this.listen()
        await console.log(`listening at :${config.port}`);
        await bot.launch()
    }

    private static listen(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.on('listening', resolve);
            this.server.on('error', (err: any) => {
                console.error(err);
                reject(err);
            });
            this.server.listen(config.port);
        });
    }
}

Index.start().catch((err) => {
    console.error(err);
});