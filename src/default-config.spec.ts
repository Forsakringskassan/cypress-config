import assert from "node:assert";
import { it } from "node:test";
import { defaultConfig } from "./default-config.ts";

await it("should disable allowCypressEnv on cypress v15", () => {
    const result = defaultConfig("15");
    assert.ok(
        Object.hasOwn(result, "allowCypressEnv"),
        "allowCypressEnv should be defined",
    );
    assert.strictEqual<boolean>(result.allowCypressEnv, false);
});

await it("should not set allowCypressEnv on cypress v16 and later", () => {
    const result = defaultConfig("16");
    assert.ok(
        !Object.hasOwn(result, "allowCypressEnv"),
        "allowCypressEnv should not be defined",
    );
    assert.strictEqual<unknown>(result.allowCypressEnv, undefined);
});
