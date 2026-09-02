# `@forsakringskassan/cypress-config`

Sharable Cypress configuration building blocks for Försäkringskassan.

## Install

```bash
npm install --save-dev @forsakringskassan/cypress-config
```

If you previously had these packages installed, they can be uninstalled:

```bash
npm rm mocha-multi-reporter
```

## Usage

In `cypress.config.ts`, replace the vanilla `defineConfig()` helper from `cypress` with `@forsakringskassan/cypress-config` and pass in `import.meta.dirname` as the first parameter:

```diff
-import { defineConfig } from "cypress";
+import { defineConfig } from "@forsakringskassan/cypress-config";

-export default defineConfig({
+export default defineConfig(import.meta.dirname, {
   /* ... */
 });
```

It works the same but is preconfigured with new defaults.

> [!TIP]
> The `defineConfig()` helper does not require the configuration object as the second parameter.
> Unless you are explicitly overwriting the default configuration it is recommended to call `defineConfig()` without it.
>
> ```ts
> export default defineConfig(import.meta.dirname);
> ```
>
> This ensures maximum compatibility with future releases.

A configuration function is available for usage in `cypress/support/e2e.ts` and/or `cypress/support/component.ts`:

```ts
import { configure } from "@forsakringskassan/cypress-config/support";

configure({
    afterEach: {
        htmlvalidate: true,
    },
});
```

> [!NOTE]  
> The `configure()` function is expected to be called exactly once.
> If the call is omitted some functionality will not work as expected.
> Calling it multiple times is undefined behaviour.

See the various components for details.

### HTML-Validate

A preconfigured [HTML-validate](https://html-validate.org/) plugin ([cypress-html-validate](https://gitlab.com/html-validate/cypress-html-validate/)) is exported as `htmlValidatePlugin`:

```ts
import {
    defineConfig,
    htmlValidatePlugin,
} from "@forsakringskassan/cypress-config";

export default defineConfig(import.meta.dirname, {
    component: {
        async setupNodeEvents(on, config) {
            config = await htmlValidatePlugin(on, config);
        },
    },
});
```

To automatically run validation after each test configure it using the configuration function:

```ts
import { configure } from "@forsakringskassan/cypress-config/support";

configure({
    afterEach: {
        htmlvalidate: true,
    },
});
```
