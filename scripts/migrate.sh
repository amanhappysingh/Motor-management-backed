#!/usr/bin/env bash
set -euo pipefail

# Usage: POSTGRES_USER=postgres POSTGRES_DB=motor_ews psql ... or rely on .env variables
PSQL="psql -v ON_ERROR_STOP=1"

# If environment variables present, use them
: "${PGHOST:=localhost}"
: "${PGPORT:=5432}"
: "${PGUSER:=postgres}"
: "${PGDATABASE:=motor_ews}"

echo "Applying migrations to ${PGDATABASE}@${PGHOST}:${PGPORT} as ${PGUSER}"

for f in "$(dirname "$0")/../migrations/"*.sql; do
  echo "---- applying $f"
  PGPASSWORD="${PGPASSWORD:-}" psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" -f "$f"
done

echo "Migrations applied."
