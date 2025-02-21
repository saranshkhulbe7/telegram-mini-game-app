import { Telegraf } from "telegraf";

const token = "8104716926:AAHm0WxoBy9BOrVk-S9xSWetjQgBrt34ftQ";
const bot = new Telegraf(token);

const app_url = "https://telegram-mini-game-app-98vx.vercel.app/";
bot.start((ctx) =>
  ctx.reply("Welcome", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "web app lol",
            web_app: {
              url: app_url,
            },
          },
        ],
      ],
    },
  })
);
bot.launch();
