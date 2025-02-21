import { Telegraf } from "telegraf";

const token = "8104716926:AAHm0WxoBy9BOrVk-S9xSWetjQgBrt34ftQ";
const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply("Welcome", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "web app lol",
            web_app: {
              url: "https://aa29-2401-4900-1c27-a6eb-400c-973-55c0-651f.ngrok-free.app",
            },
          },
        ],
      ],
    },
  })
);
bot.launch();
