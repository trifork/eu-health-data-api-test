#!/usr/bin/env bash
set -euo pipefail
ITB_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
cd "$ITB_DIR/.."
for command in node npm python3 docker openssl; do
  command -v "$command" >/dev/null || { echo "Required command missing: $command" >&2; exit 1; }
done
if [[ ! -f "$ITB_DIR/.env" ]]; then
  (umask 077; printf 'ITB_AUTOMATION_API_MASTER_KEY=%s\n' "$(openssl rand -hex 32)" > "$ITB_DIR/.env")
fi
npm ci --prefix "$ITB_DIR" --ignore-scripts --no-audit --no-fund
npm run --prefix "$ITB_DIR" compile
docker compose --env-file "$ITB_DIR/.env" up -d --build --wait --wait-timeout 360
node --env-file="$ITB_DIR/.env" "$ITB_DIR/setup.mjs"
node --env-file="$ITB_DIR/.env" "$ITB_DIR/users.mjs"
