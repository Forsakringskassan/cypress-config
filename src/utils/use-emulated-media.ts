interface MediaFeature {
    name: string;
    value: string;
}

const state = {
    prefersColorScheme: "none",
    forcedColors: "none",
};

function* getFeatures(): Generator<MediaFeature, void> {
    if (state.prefersColorScheme !== "none") {
        yield {
            name: "prefers-color-scheme",
            value: state.prefersColorScheme,
        };
    }
    if (state.forcedColors !== "none") {
        yield {
            name: "forced-colors",
            value: state.forcedColors,
        };
    }
}

/** @internal */
export interface UseEmulatedMedia {
    forcedColors(value: "none" | "active"): void;
    prefersColorScheme(value: "none" | "light" | "dark"): void;
    cdp(): { command: string; params: Record<string, unknown> };
    isEnabled(): boolean;
    reset(): void;
}

/** @internal */
export function useEmulatedMedia(): UseEmulatedMedia {
    return {
        forcedColors(value) {
            state.forcedColors = value;
        },
        prefersColorScheme(value) {
            state.prefersColorScheme = value;
        },
        cdp() {
            const features = Array.from(getFeatures());
            return {
                command: "Emulation.setEmulatedMedia",
                params: {
                    media: "screen",
                    features,
                },
            };
        },
        isEnabled() {
            return (
                state.prefersColorScheme !== "none" ||
                state.forcedColors !== "none"
            );
        },
        reset() {
            state.prefersColorScheme = "none";
            state.forcedColors = "none";
        },
    };
}
