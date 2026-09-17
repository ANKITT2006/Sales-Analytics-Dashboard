import { EventEmitter } from "events";

// Global EventEmitter singleton to broadcast live webhook transactions to SSE streams
declare global {
  var globalLiveEventEmitter: EventEmitter | undefined;
}

export const liveEvents: EventEmitter =
  globalThis.globalLiveEventEmitter || new EventEmitter();

liveEvents.setMaxListeners(100);

if (!globalThis.globalLiveEventEmitter) {
  globalThis.globalLiveEventEmitter = liveEvents;
}
