import express from "express";
import { sendTelegramMessage, sendGroupMessage } from "../services/telegram.js";
import users from "../config/users.json" assert { type: "json" };

const router = express.Router();

router.post("/jira-webhook", async (req, res) => {
  const data = req.body;
  const issueKey = data.issue?.key || "N/A";
  const issueSummary = data.issue?.fields?.summary || "No summary";
  const actor = data.user?.displayName || "Unknown";
  const event = data.webhookEvent || "Jira Event";
  const jiraBaseUrl = process.env.JIRA_BASE_URL;

  const emails = new Set();

  // جمع Assignee ها
  const assignees = Array.isArray(data.issue?.fields?.assignee)
    ? data.issue.fields.assignee
    : [data.issue?.fields?.assignee];
  assignees.forEach(a => { if(a?.emailAddress) emails.add(a.emailAddress); });

  // Reporter
  if (data.issue?.fields?.reporter?.emailAddress) emails.add(data.issue.fields.reporter.emailAddress);

  // Comment Author
  if (data.comment?.author?.emailAddress) emails.add(data.comment.author.emailAddress);

  // Mentionها در متن کامنت
  if (data.comment?.body) {
    const mentionRegex = /@([^\s]+)/g;
    let match;
    while ((match = mentionRegex.exec(data.comment.body)) !== null) {
      const mentionUsername = match[1];
      for (const [email] of Object.entries(users)) {
        if (email.toLowerCase().startsWith(mentionUsername.toLowerCase())) {
          emails.add(email);
        }
      }
    }
  }

  // جمع کردن تغییرات
  let details = "";
  if (event === "comment_created" && data.comment?.body) {
    details = `💬 *Comment:*\n${data.comment.body}`;
  } else if (event === "jira:issue_updated" && data.changelog?.items) {
    details = "📝 *Changes:* \n";
    data.changelog.items.forEach(item => {
      details += `- *${item.field}*: ${item.fromString || "None"} → ${item.toString || "None"}\n`;
    });
  }

  const issueLink = `${jiraBaseUrl}/browse/${issueKey}`;

  // پیام عمومی در گروه/کانال
  const groupId = process.env.TELEGRAM_GROUP_ID; // chat_id یا username کانال
  if (groupId) {
    const groupMessage =
      `📌 *Jira Update*\n` +
      `*Issue:* [${issueKey} - ${issueSummary}](${issueLink})\n` +
      `*By:* ${actor}\n` +
      `*Event:* ${event}`;
    sendGroupMessage(groupMessage, groupId);
  }

  // پیام خصوصی به هر کاربر
  emails.forEach(async (email) => {
    if (users[email]) {
      const chatId = users[email];
      const message =
        `📌 *Jira Update*\n` +
        `*Issue:* [${issueKey} - ${issueSummary}](${issueLink})\n` +
        `*By:* ${actor}\n` +
        `*Event:* ${event}\n` +
        `${details}`;
      await sendTelegramMessage(message, chatId);
    }
  });

  res.sendStatus(200);
});

export default router;
