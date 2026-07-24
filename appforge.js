import { App } from "octokit";

// Securely read credentials from Render environment variables
const app = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
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
        run: echo "AppForge AI successfully generated and pushed this workflow file via Render!"
`;

    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: owner,
      repo: repo,
      path: path,
      message: "feat: Add build.yml automatically via AppForge AI GitHub App",
      content: Buffer.from(buildYmlContent).toString("base64"),
    });

    console.log(`Success! File created/updated: ${response.data.commit.html_url}`);
  } catch (error) {
    console.error("Error pushing file via GitHub App:", error);
  }
}

run();
