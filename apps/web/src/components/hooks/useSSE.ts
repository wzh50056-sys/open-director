import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useRef, useCallback, useState } from "react";

interface SSEEvent {
  event: string;
  data: string;
}

interface UseSSEOptions {
  url: string;
  onEvent: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
}

export function useSSE({ url, onEvent, onError }: UseSSEOptions) {
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const abortRef = useRef<AbortController | null>(null);

  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const start = useCallback(async (body: string) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStatus("streaming");

    try {
      await fetchEventSource(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: ctrl.signal,
        // A visibility change must not restart an expensive agent workflow.
        openWhenHidden: true,
        onmessage(event) {
          if (event.event === "done") {
            setStatus("done");
            ctrl.abort();
            return;
          }
          onEventRef.current({ event: event.event, data: event.data });
        },
        onerror(error) {
          // Retrying a POST starts the whole agent graph again. Surface the
          // failure instead so one user action always maps to one workflow.
          throw error;
        },
        onclose() {
          setStatus("done");
        },
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus("error");
      onErrorRef.current?.(err as Error);
    }
  }, [url]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, []);

  return { start, abort, status };
}
