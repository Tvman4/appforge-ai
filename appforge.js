import { App } from "octokit";
import fs from "fs";
import express from "express";

const privateKeyPath = process.env.RENDER ? "/etc/secrets/appforge-ai-official.2026-07-24.private-key.pem" : "./private-key.pem";

const app = new App({
  appId: process.env.APP_ID,
  privateKey: fs.readFileSync(privateKeyPath, "utf8"),
});

const server = express();
server.use(express.json());

// Pure API endpoint - no static website hosting
server.post("/api/deploy", async (req, res) => {
  try {
    const { owner, repo, path: filePath, content } = req.body;
    
    if (!owner || !repo || !content) {
      return res.status(400).json({ success: false, error: "Missing owner, repo, or content in request." });
    }

    const octokit = await app.getInstallationOctokit(process.env.INSTALLATION_ID);

    let sha;
    try {
      const existingFile = await octokit.rest.repos.getContent({ owner, repo, path: filePath || ".github/workflows/build.yml" });
      sha = existingFile.data.sha;
    } catch (e) {
      // File doesn't exist yet, which is fine
    }

    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath || ".github/workflows/build.yml",
      message: "feat: Automated CI/CD workflow generation via AppForge AI",
      content: Buffer.from(content).toString("base64"),
      sha,
    });

    res.json({ success: true, url: response.data.commit.html_url });
  } catch (error) {
    console.error("Error pushing file via GitHub App:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AppForge AI backend API running on port ${PORT}`);
});
