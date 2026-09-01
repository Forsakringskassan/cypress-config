import fs from "node:fs/promises";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import esbuild from "esbuild";
import isCI from "is-ci";
import pkg from "./package.json" with { type: "json" };

const externalDependencies = Object.values(pkg.externalDependencies);
const peerDependencies = Object.keys(pkg.peerDependencies);

function apiExtractor(filename: string): void {
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
}

await fs.rm("dist", { recursive: true, force: true });

const result = await esbuild.build({
    entryPoints: ["src/index.ts"],
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

apiExtractor("api-extractor.json");
