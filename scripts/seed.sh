#!/usr/bin/env bash
set -euo pipefail

: "${PGHOST:=localhost}"
: "${PGPORT:=5432}"
: "${PGUSER:=postgres}"
: "${PGDATABASE:=motor_ews}"

echo "Applying seeds to ${PGDATABASE}"

for f in "$(dirname "$0")/../seeds/"*.sql; do
  echo "---- seeding $f"
  PGPASSWORD="${PGPASSWORD:-}" psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" -f "$f"
done

echo "Seeding complete."
