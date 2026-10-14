import { describe, expect, it } from "vitest";
import { iosVersion, isAppleTouchTab } from "./PushToggle";

// Ruling C: phones older than iOS 18.4 see nothing, so the install hint
// must only ever show on 18.4 and later.
describe("iosVersion", () => {
  it("reads the version from an iPhone user agent", () => {
    const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1";
    expect(iosVersion(ua)).toBe(18.06);
  });

  it("orders 18.4 below 18.10 and above 17.7", () => {
    const at = (v: string) => iosVersion(`Mozilla/5.0 (iPhone; CPU iPhone OS ${v} like Mac OS X)`)!;
    expect(at("18_4")).toBeGreaterThanOrEqual(18.04);
    expect(at("18_3")).toBeLessThan(18.04);
    expect(at("17_7")).toBeLessThan(18.04);
    expect(at("18_10")).toBeGreaterThan(at("18_4"));
  });

  it("returns null for a Mac, which is also what an iPad reports", () => {
    const mac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";
    expect(iosVersion(mac)).toBeNull();
  });
});

// The bug found on Jasmin's iPhone on 14 Oct 2026: iOS exposes
// window.pushManager in an ordinary Safari tab, so the button showed there and
// tapping it crashed the page. iPhone and iPad only deliver push to a
// home-screen app, so a tab must be recognised and given the install hint.
describe("isAppleTouchTab", () => {
  const iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1";
  const macOrIpad = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";

  it("an iPhone in a Safari tab is a tab: no button", () => {
    expect(isAppleTouchTab(iphone, 5, false)).toBe(true);
  });

  it("an iPad in a tab is a tab, though it reports a Mac user agent", () => {
    expect(isAppleTouchTab(macOrIpad, 5, false)).toBe(true);
  });

  it("an iPhone or iPad home-screen app is not a tab: button shown", () => {
    expect(isAppleTouchTab(iphone, 5, true)).toBe(false);
    expect(isAppleTouchTab(macOrIpad, 5, true)).toBe(false);
  });

  it("Safari on a Mac has no touch points, so keeps the button (ruling A)", () => {
    expect(isAppleTouchTab(macOrIpad, 0, false)).toBe(false);
  });
});
