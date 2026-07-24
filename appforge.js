import { App } from "octokit";
import fs from "fs";

// Render mounts secret files to /etc/secrets/private-key.pem
const privateKeyPath = process.env.RENDER ? "/etc/secrets/private-key.pem" : "./private-key.pem";

const app = new App({
  appId: process.env.APP_ID,
  privateKey: fs.readFileSync(privateKeyPath, "utf8"),
});

async function run() {
  try {
    const octokit = await app.getInstallationOctokit(process.env.INSTALLATION_ID);

    const owner = "Tvman4";
    const repo = "appforge-ai";
    const path = ".github/workflows/build.yml";

    const buildYmlContent = `
name: AppForge CI Build
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: AppForge Automation
        run: echo "AppForge AI successfully deployed via Render secret files!"
`;

    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: owner,
      repo: repo,
      path: path,
      message: "feat: Add build.yml via AppForge AI GitHub App",
      content: Buffer.from(buildYmlContent).toString("base64"),
    });

    console.log(`Success! File created/updated: ${response.data.commit.html_url}`);
  } catch (error) {
    console.error("Error pushing file via GitHub App:", error);
  }
}

run();
