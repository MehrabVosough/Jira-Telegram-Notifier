import dotenv from "dotenv";
dotenv.config();

export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
export const JIRA_EMAIL = process.env.JIRA_EMAIL;
export const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;


export const users = {
    "mehrab@componey.com": 111111111,
    "ali@componey.com": 222222222
}
