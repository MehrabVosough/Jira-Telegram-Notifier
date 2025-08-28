import fetch from "node-fetch";
import { TELEGRAM_TOKEN } from "../config.js";

// ارسال پیام به کاربر یا گروه
export async function sendTelegramMessage(message, chatId) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: false
      }),
    });
  } catch (err) {
    console.error("❌ Error sending Telegram message:", err.message);
  }
}

// ارسال پیام به کانال/گروه عمومی
export async function sendGroupMessage(message, groupIdOrUsername) {
  try {
    await sendTelegramMessage(message, groupIdOrUsername);
  } catch (err) {
    console.error("❌ Error sending group message:", err.message);
  }
}
