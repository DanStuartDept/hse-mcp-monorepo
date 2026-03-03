# @danstuartdept/eslint-config

Shared ESLint flat config for the `@danstuartdept` monorepo.

## What it provides

- ESLint recommended rules
- typescript-eslint recommended rules
- Ignores `build/` and `node_modules/` directories

## Usage

In your package's `eslint.config.js`:

```js
import baseConfig from "@danstuartdept/eslint-config";

export default baseConfig;
```

Add `@danstuartdept/eslint-config` to your package's `devDependencies`:

```json
{
  "devDependencies": {
    "@danstuartdept/eslint-config": "workspace:*"
  }
}
```
