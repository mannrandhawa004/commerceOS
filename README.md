# CommerceOS

CommerceOS is organized into two top-level applications:

- `client/` — Next.js frontend starter.
- `server/` — backend workspace containing the Express API, worker placeholder, shared packages, infrastructure, scripts, and documentation.

## Start the API

Requirements: Node.js and pnpm.

```powershell
cd server
Copy-Item .env.example .env
pnpm install
pnpm dev
```

The starter health endpoint is `http://localhost:4000/api/v1/health`.

## Push to GitHub

Create an empty repository on GitHub, then from the project root:

```powershell
git add .
git commit -m "Initial CommerceOS backend setup"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```
