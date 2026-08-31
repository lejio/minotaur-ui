#!/usr/bin/env bash
set -euo pipefail

# Deploy Minotaur UI product app (demo) to an Exebox sandbox with a public HTTPS link.
#
# Requires: exebox CLI, exebox init config with Pangolin credentials.
#
# Public URL: https://${SANDBOX_NAME}.exebox.dev/

SANDBOX_NAME="${SANDBOX_NAME:-minotaur-ui}"
MEMORY="${MEMORY:-4}"
REPO="${REPO:-https://github.com/lejio/minotaur-ui.git}"
APP_DIR="${APP_DIR:-/home/ubuntu/minotaur-ui}"
PORT="${PORT:-3000}"

EXEbox="${EXEbox:-exebox}"

echo "==> Creating sandbox: ${SANDBOX_NAME} (${MEMORY}GiB RAM for build)..."
if ! $EXEbox ls 2>/dev/null | grep -q "^${SANDBOX_NAME}\b"; then
  $EXEbox up "${SANDBOX_NAME}" --memory "${MEMORY}"
else
  echo "    Sandbox already exists, reusing."
fi

echo "==> Installing dependencies and building inside sandbox..."
$EXEbox execute -n "${SANDBOX_NAME}" -- bash -lc "
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
APP_DIR='${APP_DIR}'
REPO='${REPO}'
PORT='${PORT}'

if ! command -v node >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo apt-get install -y -qq git curl ca-certificates nginx
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
  sudo corepack enable
  sudo corepack prepare pnpm@9.15.0 --activate
fi

if [ ! -d \"\${APP_DIR}/.git\" ]; then
  git clone \"\${REPO}\" \"\${APP_DIR}\"
else
  cd \"\${APP_DIR}\"
  git fetch origin main
  git reset --hard origin/main
fi

cd \"\${APP_DIR}\"
pnpm install --frozen-lockfile
pnpm build

sudo tee /etc/nginx/sites-available/minotaur-ui >/dev/null <<NGINX
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name _;

  location / {
    proxy_pass http://127.0.0.1:\${PORT};
    proxy_http_version 1.1;
    proxy_set_header Host \\\$host;
    proxy_set_header X-Real-IP \\\$remote_addr;
    proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \\\$scheme;
    proxy_set_header Upgrade \\\$http_upgrade;
    proxy_set_header Connection \"upgrade\";
  }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/minotaur-ui /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

pkill -f "next-server" 2>/dev/null || pkill -f "next start" 2>/dev/null || true
sleep 1

cd \"\${APP_DIR}/demo\"
PORT=\${PORT} HOSTNAME=127.0.0.1 nohup pnpm start >/tmp/minotaur-web.log 2>&1 &
echo \$! >/tmp/minotaur-web.pid

sleep 12
curl -sf \"http://127.0.0.1:\${PORT}/\" >/dev/null
curl -sf http://127.0.0.1/ >/dev/null
echo \"Web app ready on port 80 (nginx -> \${PORT})\"
"

echo "==> Ensuring public HTTPS route..."
$EXEbox https "${SANDBOX_NAME}"

echo ""
echo "Deployed. Share this link:"
echo "  https://${SANDBOX_NAME}.exebox.dev/"
echo ""
echo "SSH:  exebox ssh ${SANDBOX_NAME}"
echo "Logs: exebox execute -n ${SANDBOX_NAME} -- tail -50 /tmp/minotaur-web.log"
echo "Teardown: exebox down ${SANDBOX_NAME}"
