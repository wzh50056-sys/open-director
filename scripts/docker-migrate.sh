#!/bin/sh
set -eu

SCHEMA=/app/prisma/schema.prisma
INITIAL_MIGRATION=20260503000000_init
LOG_FILE=$(mktemp)
trap 'rm -f "$LOG_FILE"' EXIT

if pnpm -C /app exec prisma migrate deploy --schema "$SCHEMA" >"$LOG_FILE" 2>&1; then
  cat "$LOG_FILE"
  exit 0
fi

cat "$LOG_FILE"

if ! grep -q 'P3005' "$LOG_FILE"; then
  echo "Database migration failed; refusing to modify migration history." >&2
  exit 1
fi

echo "Existing pre-migration database detected; baselining $INITIAL_MIGRATION."
pnpm -C /app exec prisma migrate resolve \
  --applied "$INITIAL_MIGRATION" \
  --schema "$SCHEMA"
pnpm -C /app exec prisma migrate deploy --schema "$SCHEMA"
