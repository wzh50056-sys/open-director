import type { NextConfig } from "next";

export default function nextConfig(): NextConfig {
    return {
        output: "standalone",
        allowedDevOrigins: ["localhost", "127.0.0.1"],
        typescript: {
            ignoreBuildErrors: true,
        },
        env: {
            NEXT_PUBLIC_APP_VERSION: "open-director",
            NEXT_PUBLIC_APP_RELEASES: "[]",
        },
    };
}
