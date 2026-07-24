#!/usr/bin/env python3
"""
AppForge AI - GitHub-native AI for building cross-platform apps
"""

import os
import base64
import requests
import sys
from pathlib import Path
from typing import Optional

class AppForgeAI:
    def __init__(self, github_token: str, owner: str, repo: str):
        self.token = github_token
        self.owner = owner
        self.repo = repo
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
        self.api_base = f"https://api.github.com/repos/{owner}/{repo}"

    def create_or_update_file(self, file_path: str, content: str, commit_message: str) -> dict:
        """Create or update a file in the GitHub repository"""
        url = f"{self.api_base}/contents/{file_path}"
        
        # Get current file SHA if exists
        resp = requests.get(url, headers=self.headers)
        data = {
            "message": commit_message,
            "content": base64.b64encode(content.encode('utf-8')).decode('utf-8'),
            "branch": "main"
        }
        
        if resp.status_code == 200:
            data["sha"] = resp.json()["sha"]
        
        response = requests.put(url, headers=self.headers, json=data)
        
        if response.status_code in (200, 201):
            print(f"✅ Created/Updated: {file_path}")
            return response.json()
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
            return None

    def generate_build_yml(self, platform: str, framework: str, app_name: str) -> str:
        """Generate optimized GitHub Actions workflow"""
        if framework.lower() == "flutter":
            return f'''name: Build {app_name} (Flutter)

on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  build:
    strategy:
      matrix:
        platform: [android, ios]
    runs-on: ${{ matrix.platform == 'android' && 'ubuntu-latest' || 'macos-latest' }}
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
      - run: flutter pub get
      - run: flutter build ${{ matrix.platform }} --release
      - uses: actions/upload-artifact@v4
'''
        # Add more frameworks as needed...
        return f"# Basic workflow for {framework} on {platform}"

    def ask_ai(self, prompt: str, model: str = "grok-beta") -> str:
        """Call LLM (Grok or others)"""
        # Replace with your preferred API
        print("🤖 Thinking with AI...")
        # Placeholder - implement actual API call
        return f"# AI Generated Response for: {prompt}\\n\\nAdd your implementation here."

def main():
    if len(sys.argv) < 2:
        print("Usage: python appforge_ai.py \"your request here\"")
        return

    request = " ".join(sys.argv[1:])
    
    token = os.getenv("GITHUB_TOKEN")
    owner = os.getenv("REPO_OWNER")
    repo = os.getenv("REPO_NAME")
    
    if not token or not owner or not repo:
        print("❌ Missing environment variables. Check README.")
        return

    ai = AppForgeAI(token, owner, repo)
    
    # Example: Generate build workflow
    workflow = ai.generate_build_yml("mobile", "flutter", "MyApp")
    ai.create_or_update_file(".github/workflows/build.yml", workflow, f"AppForge AI: Add build workflow")
    
    print("🚀 AppForge AI completed your request!")

if __name__ == "__main__":
    main()
