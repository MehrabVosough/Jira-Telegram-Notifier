# Jira → Telegram Notifier

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![Telegram](https://img.shields.io/badge/Telegram-Bot-blueviolet)
![License](https://img.shields.io/badge/License-MIT-yellow)

An advanced notification system for **Jira** that sends task updates and comments directly to **Telegram**.

## Features

- **Personal messages** for each user (Assignee or Mention)  
- **Group/Channel notifications** for general updates  
- Professional Markdown with direct links to issues  
- Dynamic: new users can register themselves via `/start`  
- Tracks issue changes (`from → to`) and comment content  
- Supports multiple Assignees and Mentions simultaneously



## Create a .env file and add your environment variables
    
TELEGRAM_TOKEN=YOUR_TELEGRAM_BOT_TOKEN

JIRA_BASE_URL=https://yourdomain.atlassian.net

JIRA_EMAIL=admin@company.com

JIRA_API_TOKEN=YOUR_JIRA_API_TOKEN

TELEGRAM_GROUP_ID=@yourchannelusername   # Optional for group notifications




### Personal Message (Assignee or Mention) example

📌 Jira Update
*Issue:* [PROJ-123 - Fix login bug](https://yourdomain.atlassian.net/browse/PROJ-123)
*By:* Ali Reza
*Event:* jira:issue_updated
📝 Changes: 
- Status: To Do → In Progress
- Priority: Medium → High
💬 Comment:
Please check the login flow @Maryam




### Group/Channel Message example

📌 Jira Update
*Issue:* [PROJ-123 - Fix login bug](https://yourdomain.atlassian.net/browse/PROJ-123)
*By:* Ali Reza
*Event:* jira:issue_updated

