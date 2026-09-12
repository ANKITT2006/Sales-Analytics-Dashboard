import { NextRequest } from "next/server";
import { liveEvents } from "@/lib/live-events";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: "streaming_active", time: new Date().toISOString() })}\n\n`)
      );

      // Listener for live transactions
      const onTransaction = (tx: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: transaction\ndata: ${JSON.stringify(tx)}\n\n`)
          );
        } catch {
          // Stream might be closed
        }
      };

      liveEvents.on("transaction", onTransaction);

      // Heartbeat ping every 15 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingInterval);
        }
      }, 15000);

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        liveEvents.off("transaction", onTransaction);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
