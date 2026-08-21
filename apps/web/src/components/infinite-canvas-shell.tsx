"use client";

import { App, ConfigProvider, theme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CanvasLibrary from "@/features/infinite-canvas/app/canvas/page";
import CanvasEditor from "@/features/infinite-canvas/app/canvas/[id]/canvas-client-page";

const canvasQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function CanvasRuntime({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App className="infinite-canvas-scope h-dvh overflow-hidden">
        <QueryClientProvider client={canvasQueryClient}>{children}</QueryClientProvider>
      </App>
    </ConfigProvider>
  );
}

export function InfiniteCanvasLibrary() {
  return (
    <CanvasRuntime>
      <CanvasLibrary />
    </CanvasRuntime>
  );
}

export function InfiniteCanvasEditor() {
  return (
    <CanvasRuntime>
      <CanvasEditor />
    </CanvasRuntime>
  );
}
