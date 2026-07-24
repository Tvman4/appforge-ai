import { App } from "octokit";
import fs from "fs";
import express from "express";
import OpenAI from "openai";

const privateKeyPath = process.env.RENDER ? "/etc/secrets/appforge-ai-official.2026-07-24.private-key.pem" : "./private-key.pem";

// Initialize GitHub App
const app = new App({
  appId: process.env.APP_ID,
  privateKey: fs.readFileSync(privateKeyPath, "utf8"),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = express();
server.use(express.json());

// API Endpoint to dynamically generate code via AI and deploy it to a target repo
server.post("/api/deploy", async (req, res) => {
  try {
    const { owner, repo, prompt, filePath } = req.body;
    
    if (!owner || !repo || !prompt) {
      return res.status(400).json({ success: false, error: "Missing owner, repo, or prompt in request." });
    }

    // 1. Call OpenAI to dynamically generate the workflow/code based on user instructions
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert CI/CD and DevOps engineer. Return ONLY valid raw code or YAML content based on the user's prompt, without conversational filler or markdown code blocks unless requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
    });

    const generatedContent = aiResponse.choices[0].message.content.trim();
    const targetPath = filePath || ".github/workflows/build.yml";

    // 2. Use GitHub App to authenticate and push to the specified repository
    const octokit = await app.getInstallationOctokit(process.env.INSTALLATION_ID);

    let sha;
    try {
      const existingFile = await octokit.rest.repos.getContent({ owner, repo, path: targetPath });
      sha = existingFile.data.sha;
    } catch (e) {
      // File doesn't exist yet, which is fine
    }

    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: targetPath,
      message: "feat: AI-generated custom workflow via AppForge AI Hub",
      content: Buffer.from(generatedContent).toString("base64"),
      sha,
    });

    res.json({ 
      success: true, 
      url: response.data.commit.html_url,
      generatedCode: generatedContent 
    });

  } catch (error) {
    console.error("Error during AI generation or GitHub push:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AppForge AI backend API running on port ${PORT}`);
});
