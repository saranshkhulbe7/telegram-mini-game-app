import { Telegraf } from "telegraf";

const token = "8104716926:AAHm0WxoBy9BOrVk-S9xSWetjQgBrt34ftQ";
const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply("Welcome", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "web app lol",
            web_app: {
              url: "http://localhost:5173",
            },
          },
        ],
      ],
    },
  })
);
bot.launch();
