#!/bin/bash
set -xeuo pipefail
test "$CI" = true || exit 1
pnpm install --frozen-lockfile --store-dir=node_modules/.pnpm-store
pnpm run -sC ./packages/remix build
pnpm run -sC ./packages/functions functions:build
