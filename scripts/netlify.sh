#!/bin/bash
set -xeuo pipefail
test "$CI" = true || exit 1
pnpm install --frozen-lockfile --store-dir=node_modules/.pnpm-store
pnpm run -C ./packages/gatsby build:incremental
pnpm run -C ./packages/functions functions:build
