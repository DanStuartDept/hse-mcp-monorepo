# @danstuartdept/tsconfig

Shared TypeScript configuration for the monorepo.

## Usage

Add the package as a dev dependency:

```json
{
  "devDependencies": {
    "@danstuartdept/tsconfig": "workspace:*"
  }
}
```

Then extend from it in your `tsconfig.json`:

```json
{
  "extends": "@danstuartdept/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./build",
    "rootDir": "./src"
  }
}
```

## Configs

- **base.json** — Base compiler options shared across all packages
- **node.json** — Extends base.json for Node.js packages
