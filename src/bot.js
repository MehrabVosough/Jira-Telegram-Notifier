import { Telegraf } from "telegraf";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { TELEGRAM_TOKEN, JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN } from "./config.js";

const bot = new Telegraf(TELEGRAM_TOKEN);
const usersFile = path.resolve("src/config/users.json");
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({}, null, 2));

async function isValidJiraEmail(email) {
    try {
        const url = `${JIRA_BASE_URL}/rest/api/3/user/search?query=${email}`;
        const res = await fetch(url, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")}`,
                "Accept": "application/json"
            }
        });
        const data = await res.json();
        return data.length > 0;
    } catch (err) {
        console.error(err);
        return false;
    }
}

bot.start((ctx) => {
    ctx.reply("سلام! 👋 لطفاً ایمیل Jira خودتو وارد کن تا نوتیف برای خودت بیاد.");
});

bot.on("text", async (ctx) => {
    const email = ctx.message.text.trim();
    const chatId = ctx.chat.id;

    const valid = await isValidJiraEmail(email);
    if (!valid) {
        ctx.reply("❌ ایمیل پیدا نشد یا اشتباهه. لطفاً دوباره امتحان کن.");
        return;
    }

    const users = JSON.parse(fs.readFileSync(usersFile));

    users[email] = chatId;
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    ctx.reply(`✅ ایمیل *${email}* ثبت شد! از این به بعد نوتیف‌های Jira به این چت میاد.`, { parse_mode: "Markdown" });
});

export function launchBot() {
    bot.launch();
    console.log("🤖 Telegram Bot started...");
}
