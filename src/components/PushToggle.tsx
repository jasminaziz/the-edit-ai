import { useEffect, useState } from "react";

/**
 * Opt in and out of a notification when a new AI News batch lands.
 * Plan and rulings: reports/2026-10-08-push-notifications-plan.md.
 *
 * Declarative Web Push: the subscription is made on `window.pushManager` and
 * iOS shows the notification itself, so NO service worker is registered here.
 * The self-destroying /sw.js ruling in vite.config.ts is untouched. Do not
 * "upgrade" this to `navigator.serviceWorker.ready.pushManager`: a worker at
 * scope / is replaced and unregistered by /sw.js on the next page load, and
 * its subscription goes with it.
 *
 * Shown only where `window.pushManager` exists: iPhone and iPad home-screen
 * apps on iOS 18.4 and later, and Safari 18.5 on a Mac (ruling A: Apple only;
 * ruling C: older iOS sees nothing). State is read from the browser's own
 * subscription, so nothing is kept in localStorage or a cookie.
 */

// Placeholder strings. Jasmin writes these (plan section 5). Replace only
// with approved copy.
const COPY = {
  optIn: "[PUSH_OPTIN]",
  optOut: "[PUSH_OPTOUT]",
  denied: "[PUSH_DENIED]",
  installHint: "[PUSH_INSTALL_HINT]",
  error: "[PUSH_ERROR]",
};

const VAPID_PUBLIC_KEY = import.meta.env.VITE_PUSH_VAPID_PUBLIC_KEY as string | undefined;

type WindowPushManager = {
  subscribe(options: { userVisibleOnly: boolean; applicationServerKey: Uint8Array }): Promise<PushSubscription>;
  getSubscription(): Promise<PushSubscription | null>;
};

type State = "hidden" | "install" | "off" | "on" | "busy" | "denied" | "error";

function windowPushManager(): WindowPushManager | null {
  return (window as unknown as { pushManager?: WindowPushManager }).pushManager ?? null;
}

/** iOS version from an iPhone or iPad user agent, or null. Exported for tests. */
export function iosVersion(userAgent: string): number | null {
  const match = userAgent.match(/\((?:iPhone|iPad|iPod);.*? OS (\d+)_(\d+)/);
  return match ? Number(match[1]) + Number(match[2]) / 100 : null;
}

// The hint to install only makes sense where installing would work: an
// iPhone in a Safari tab on 18.4 or later. iPads report a Mac user agent, so
// they get no hint, only the control once installed.
function shouldHintInstall(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  const version = iosVersion(navigator.userAgent);
  return nav.standalone === false && version !== null && version >= 18.04;
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function permissionDenied(): boolean {
  return typeof Notification !== "undefined" && Notification.permission === "denied";
}

export function PushToggle() {
  const [state, setState] = useState<State>("hidden");

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY) return;
    const pushManager = windowPushManager();
    if (!pushManager) {
      if (shouldHintInstall()) setState("install");
      return;
    }
    if (permissionDenied()) {
      setState("denied");
      return;
    }
    pushManager
      .getSubscription()
      .then((subscription) => setState(subscription ? "on" : "off"))
      .catch(() => setState("off"));
  }, []);

  async function turnOn() {
    const pushManager = windowPushManager();
    if (!pushManager || !VAPID_PUBLIC_KEY) return;
    setState("busy");
    try {
      // Called straight from the tap: iOS only shows its prompt in response to one.
      const subscription = await pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToBytes(VAPID_PUBLIC_KEY),
      });
      const response = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      if (!response.ok) {
        await subscription.unsubscribe();
        throw new Error(`opt in refused: ${response.status}`);
      }
      setState("on");
    } catch {
      setState(permissionDenied() ? "denied" : "error");
    }
  }

  async function turnOff() {
    const pushManager = windowPushManager();
    if (!pushManager) return;
    setState("busy");
    try {
      const subscription = await pushManager.getSubscription();
      if (subscription) {
        // Unsubscribe on the device first. If the server call then fails, the
        // row is removed anyway on the next send, when Apple reports it gone.
        await subscription.unsubscribe();
        await fetch("/api/push", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => undefined);
      }
      setState("off");
    } catch {
      setState("error");
    }
  }

  if (state === "hidden") return null;

  if (state === "install" || state === "denied") {
    return (
      <p className="font-body text-[15px] leading-relaxed text-[hsl(var(--text-secondary))] mb-8">
        {state === "install" ? COPY.installHint : COPY.denied}
      </p>
    );
  }

  const on = state === "on";
  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={on ? turnOff : turnOn}
        disabled={state === "busy"}
        aria-pressed={on}
        className="push-toggle font-body"
      >
        {on ? COPY.optOut : COPY.optIn}
      </button>
      {state === "error" && (
        <p role="alert" className="font-body text-[13px] leading-relaxed text-[hsl(var(--text-secondary))] mt-3 mb-0">
          {COPY.error}
        </p>
      )}
    </div>
  );
}
