import fs from "node:fs/promises";
import path from "node:path";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import esbuild from "esbuild";
import isCI from "is-ci";
import pkg from "./package.json" with { type: "json" };

const externalDependencies = Object.values(pkg.externalDependencies);
const peerDependencies = Object.keys(pkg.peerDependencies);

/**
 * Extracts global augmentations from a file.
 *
 * Global augmentations must be prefixed with a `module augmentation:${dst}`
 * code comment.
 */
async function extractAugmentations(
    filename: string,
): Promise<Array<{ filename: string; content: string }>> {
    const content = await fs.readFile(filename, "utf8");
    const matches = content.matchAll(
        /^\/\*\* module augmentation:(\S+) \*\/\n(declare global \{[\s\S]+?^\})$/gm,
    );
    return Array.from(matches, (it) => {
        const [, filename = "", content = ""] = it;
        return { filename, content };
    });
}

/**
 * Monkey patches an existing dts-file with the global augmentations.
 */
async function patchAugmentations(
    filename: string,
    augmentations: Array<{ content: string }>,
): Promise<void> {
    const content = await fs.readFile(filename, "utf8");
    const patched = [content, ...augmentations.map((it) => it.content)].join(
        "\n\n",
    );
    await fs.writeFile(filename, patched, "utf8");
}

async function apiExtractor(filename: string): Promise<void> {
    const config = ExtractorConfig.loadFileAndPrepare(filename);
    const result = Extractor.invoke(config, {
        localBuild: !isCI,
        showVerboseMessages: true,
    });

    if (result.succeeded) {
        console.log(`API Extractor completed successfully`);
    } else {
        const { errorCount, warningCount } = result;
        console.error(
            [
                "API Extractor completed with",
                `${errorCount} error(s) and ${warningCount} warning(s)`,
            ].join("\n"),
        );
        process.exitCode = 1;
    }

    console.log();
    console.group("Patching module augmentations");
    const { publicTrimmedFilePath } = config;
    const target = path.basename(publicTrimmedFilePath);
    const pattern = path.join(import.meta.dirname, "temp/types/src/**/*.d.ts");
    try {
        const files = await Array.fromAsync(fs.glob(pattern));
        console.log("Searching", files.length, "declaration files");
        const results = await Promise.all(files.map(extractAugmentations));
        const found = results.flat();
        const matching = found.filter((it) => it.filename.includes(target));
        console.log(
            "Found",
            matching.length,
            "module augmentation(s) matching",
            target,
        );
        if (matching.length > 0) {
            console.log("Writing", publicTrimmedFilePath);
            await patchAugmentations(publicTrimmedFilePath, matching);
        } else {
            console.log("Skipping writing patched declaration");
        }
    } finally {
        console.groupEnd();
    }
}

await fs.rm("dist", { recursive: true, force: true });

const result = await esbuild.build({
    entryPoints: [
        { in: "src/index.ts", out: "index" },
        { in: "src/support/index.ts", out: "support" },
    ],
    outdir: "dist",
    bundle: true,
    metafile: true,
    platform: "node",
    logLevel: "info",
    target: "node22",
    format: "esm",
    outExtension: { ".js": ".mjs" },
    external: [...peerDependencies, ...externalDependencies],
});
console.log(await esbuild.analyzeMetafile(result.metafile));

await apiExtractor("api-extractor.index.json");
await apiExtractor("api-extractor.support.json");

/* monkey patch support file to include third-party plugins */
const content = await fs.readFile("dist/support.d.ts", "utf8");
const plugins = [
    `import "@forsakringskassan/cypress-axe/support";`,
    `import "cypress-html-validate/commands";`,
].join("\n");
await fs.writeFile("dist/support.d.ts", [plugins, content].join("\n\n"));
