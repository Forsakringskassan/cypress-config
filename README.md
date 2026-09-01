# `@forsakringskassan/cypress-config`

Sharable Cypress configuration building blocks for Försäkringskassan.

## Usage

In `cypress.config.ts`, replace the vanilla `defineConfig()` helper from `cypress` with `@forsakringskassan/cypress-config`:

```diff
-import { defineConfig } from "cypress";
+import { defineConfig } from "@forsakringskassan/cypress-config";

 export default defineConfig({
   /* ... */
 });
```

It works the same but is preconfigured with new defaults.

> [!TIP]
> The `defineConfig()` helper does not require any parameters.
> Unless you are explicitly overwriting the default configuration it is recommended to call `defineConfig()` without parameters.
>
> ```ts
> export default defineConfig();
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

export default defineConfig({
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
