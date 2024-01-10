import {Telegraf} from "telegraf";
import config from "../config";
import commands from "./Command";

const bot = new Telegraf(config.telegramApiKey);

bot.use(commands.middleware())

export default bot;