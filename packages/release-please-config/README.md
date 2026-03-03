# @danstuartdept/release-please-config

Shared release-please configuration defaults for the `@danstuartdept` monorepo.

## What it provides

- Default release-please settings (`release-type: "node"`, `changelog-path: "CHANGELOG.md"`)
- A `generate-config.js` script that reads `pnpm-workspace.yaml` and `release-please-config.json` and outputs a merged config

## Usage

Import the default config:

```js
import defaults from "@danstuartdept/release-please-config";

console.log(defaults);
// { "release-type": "node", "changelog-path": "CHANGELOG.md" }
```

Run the generate script to see the merged workspace + release-please config:

```bash
node packages/release-please-config/scripts/generate-config.js
```
