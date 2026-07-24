# AppForge AI 🤖

**Your personal AI app builder for GitHub** — specialized in creating production-ready apps for **iOS, Android, Windows, macOS** and **automatically committing everything** to your repo.

## Features
- Generates perfect `build.yml` GitHub Actions workflows
- Creates full project structures (Flutter, React Native, Tauri, Electron, etc.)
- Cross-platform support: iOS • Android • macOS • Windows
- AI-powered code generation (connect Grok, Claude, GPT, etc.)
- Auto-commits files directly to your repository
- Works from Issues, PR comments, or CLI

## Quick Start

1. **Create a GitHub Personal Access Token** (see below)
2. Clone this repo or install as GitHub App
3. Set environment variables
4. Run or trigger the AI

## Setup API Key (GitHub Token)

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Generate new token with these scopes:
   - `repo` (Full control of private repositories)
   - `workflow`
3. Copy the token and store it securely.

**Never commit your token!** Use GitHub Secrets or `.env`.

## Environment Variables

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
GROK_API_KEY=xai-...          # optional - for Grok
OPENAI_API_KEY=sk-...         # optional
REPO_OWNER=yourusername
REPO_NAME=your-app
```

## Usage Examples

**CLI:**
```bash
python appforge.py "Create a Flutter app called MyAwesomeApp with CI/CD for iOS and Android"
```

**From GitHub Issue:**
Comment: `@appforge-ai build tauri desktop app`

## Supported Platforms & Frameworks
- **Mobile**: Flutter, React Native
- **Desktop**: Tauri (recommended), Electron
- **Native**: SwiftUI + Kotlin
- **Web**: Next.js / Vite

## Contributing
PRs welcome! Especially more workflow templates.

---

**Made with ❤️ by Grok + You**

Star this repo if it helps you ship faster! 🚀
