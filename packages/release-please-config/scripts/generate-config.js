#!/usr/bin/env node

/**
 * Reads pnpm-workspace.yaml and release-please-config.json from the repo root
 * and prints a merged release-please config JSON to stdout.
 *
 * Usage: node packages/release-please-config/scripts/generate-config.js
 */

import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";

const rootDir = resolve(import.meta.dirname, "..", "..", "..");

// Parse pnpm-workspace.yaml to extract package globs
const workspaceYaml = readFileSync(join(rootDir, "pnpm-workspace.yaml"), "utf8");
const packageGlobs = [];
for (const line of workspaceYaml.split("\n")) {
  const match = line.match(/^\s*-\s*["']?([^"'\s]+)["']?\s*$/);
  if (match) {
    packageGlobs.push(match[1]);
  }
}

// Read existing release-please-config.json
const configPath = join(rootDir, "release-please-config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

const merged = {
  workspace_packages: packageGlobs,
  release_please_config: config,
};

console.log(JSON.stringify(merged, null, 2));
