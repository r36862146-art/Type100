import test from "node:test";
import assert from "node:assert";
import { trackAnalyticsEvent } from "../hooks/usePracticeAnalytics";

test("usePracticeAnalytics: dispatches custom event", () => {
  let eventDispatched = false;
  let receivedPayload: any = null;

  const mockWindow = {
    dispatchEvent: (event: any) => {
      eventDispatched = true;
      receivedPayload = event.detail;
    }
  };

  (global as any).window = mockWindow;
  (global as any).CustomEvent = class CustomEvent {
    detail: any;
    constructor(name: string, options: any) {
      this.detail = options.detail;
    }
  };

  try {
    trackAnalyticsEvent("practice_started", { mode: "words" });
    assert.strictEqual(eventDispatched, true);
    assert.strictEqual(receivedPayload.event, "practice_started");
    assert.strictEqual(receivedPayload.mode, "words");
    assert.ok(receivedPayload.timestamp > 0);
  } finally {
    delete (global as any).window;
    delete (global as any).CustomEvent;
  }
});
