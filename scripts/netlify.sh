#!/bin/bash
set -xeuo pipefail
test "$CI" = true || exit 1
npx pnpm install -r --store-dir=node_modules/.pnpm-store
npx pnpm run -C ./packages/gatsby build:incremental
npx pnpm run -C ./packages/functions functions:build
