import express from "express";
import jiraRoutes from "./routes/jira.js";
import { launchBot } from "./bot.js";

const app = express();
app.use(express.json());

app.use("/", jiraRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

launchBot();
