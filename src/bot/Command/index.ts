import {Composer, Context} from "telegraf";
import {User, UserInterface} from "../../db/models/User";
import {RootService} from "../../services";
import {bufferToArray} from "../../utils";
import {spoiler} from "telegraf/format";

const commands = new Composer<Context>();

commands.start(async (ctx: Context): Promise<void> => {
    if (ctx.chat) {
        let chatUsername = '';
        if (ctx.chat.type === 'private') {
            chatUsername = ctx.chat.username || '';
        }

        const existingUser: UserInterface | null = await User.findOne({chatId: ctx.chat.id});

        if (!existingUser) {
            const creds = await RootService.I.userWallet.generateCredentials()
            await User.create({
                username: chatUsername,
                chatId: ctx.chat.id,
                walletAddress: creds.address.toString(),
                mnemonics: creds.mnemonics,
                publicKey: {
                    type: 'Buffer',
                    data: bufferToArray(creds.keyPair.publicKey)
                },
                secretKey: {
                    type: 'Buffer',
                    data: bufferToArray(creds.keyPair.secretKey)
                }
            });

            await ctx.replyWithMarkdownV2(
                `Nice to meet you ${chatUsername}`
            );
        } else {
            await ctx.replyWithMarkdownV2(
                `Hello ${chatUsername}`,
            );
        }
    }
});

commands.command('wallet', async (ctx: Context) => {
    if (ctx.chat) {
        const existingUser: UserInterface | null = await User.findOne({chatId: ctx.chat.id});

        if (existingUser) {
            await ctx.reply(existingUser.walletAddress);
        }
    }
});

commands.command('word', async (ctx: Context) => {
    if (ctx.chat) {
        const existingUser: UserInterface | null = await User.findOne({chatId: ctx.chat.id});

        if (existingUser && existingUser.mnemonics) {

            const mnemonicsStr = existingUser.mnemonics.join(' ').replace(/([_~[\](){}>#+-=|\\.`!])/g, "\\$1");
            await ctx.replyWithMarkdownV2(`Ваши мнемонические слова: ${spoiler(mnemonicsStr).text}`);
        } else {
            await ctx.replyWithMarkdownV2(`Мнемонические слова не найдены.`);
        }
    }
});

commands.command('getbalance', async (ctx: Context) => {
    if (ctx.chat) {
        const existingUser: UserInterface | null = await User.findOne({chatId: ctx.chat.id});

        if (existingUser) {
            const balance = await RootService.I.userWallet.getWalletBalance(existingUser.publicKey)
            await ctx.replyWithMarkdownV2(`Ваши balance: ${balance.toString()}`);
        }
    }
});

commands.command('gethostaddress', async (ctx: Context) => {
    if (ctx.chat) {
        const existingUser: UserInterface | null = await User.findOne({chatId: ctx.chat.id});

        if (existingUser) {
            const lastAddr = await RootService.I.userWallet.getLastAddress(existingUser.walletAddress) ?? ''

            if (lastAddr === '') {
                await ctx.replyWithMarkdownV2(`История пуста`);
            } else {
                await ctx.replyWithMarkdownV2(`Ваша последняя тр: ${lastAddr}`);
            }

        }
    }
});

export default commands;