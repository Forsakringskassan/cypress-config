import deepmerge from "deepmerge";

function overwriteMerge<T>(_a: T[], b: T[]): T[] {
    return b;
}

/**
 * @internal
 */
export function mergeConfig<T>(a: T, b: T | undefined): T {
    return deepmerge<T>(a, b ?? {}, { arrayMerge: overwriteMerge });
}
