# CI/CD to VPS (Frontend + Backend)

This project now deploys from GitHub Actions to your VPS on every push to `main`.

## What deploy does

- Backend: runs `scripts/deploy-backend.sh`
  - Uses `backend/docker-compose.yml`
  - Runs `docker compose up -d --build --remove-orphans`
- Frontend: runs `scripts/deploy-frontend.sh`
  - Runs `npm ci && npm run build` in `frontend/`
  - Syncs `frontend/dist/` to your VPS web root with `rsync`

## Required GitHub Secrets

Add these in: `GitHub repo -> Settings -> Secrets and variables -> Actions`

- `VPS_HOST`: VPS IP or domain
- `VPS_USER`: SSH user
- `VPS_SSH_KEY`: private key (for `VPS_USER`)
- `VPS_PORT`: usually `22`
- `VPS_PROJECT_PATH`: full path to project on VPS (example: `/home/ubuntu/loanMangement`)
- `FRONTEND_DEPLOY_DIR`: web root for built frontend (example: `/var/www/loan-management`)
- `FRONTEND_RELOAD_SERVICE`: optional, usually `nginx` (leave empty if not needed)

## VPS one-time setup

1. Clone this repo in `VPS_PROJECT_PATH`.
2. Install required tools on VPS:
   - `git`
   - `docker` + `docker compose`
   - `node` + `npm`
   - `rsync`
3. Ensure your web server serves `FRONTEND_DEPLOY_DIR`.
4. If you set `FRONTEND_RELOAD_SERVICE`, allow the deploy user to reload it.

Example sudoers entry (if needed):

```bash
# allow deploy user to reload nginx without password
<your-user> ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
```

## Notes

- Deploy runs only for `push` on `main`.
- PRs and other branches run CI only.
- If frontend build needs env vars (like `VITE_API_URL`), keep them in `frontend/.env` on VPS.
