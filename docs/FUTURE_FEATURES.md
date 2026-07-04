# Future Features (Design Only — Not Implemented Yet)

This document tracks the extension points already scaffolded in
[`www/js/native-stubs.js`](../www/js/native-stubs.js) via
`window.NativeFeatures`. None of these do anything yet — every method
is a safe no-op. This is intentional: the structure exists so each
feature can be built independently later, without having to touch the
core countdown/alarm logic in `app.js`.

Each feature below will require an `ios/` and/or `android/` native
project, which is created by running `npx cap add ios` / `npx cap add
android` once Capacitor is installed (see the root `README.md`).

## `NativeFeatures.watch` — Apple Watch companion app

- **What**: A watchOS companion showing the same countdown (`3, 2, 1,
  Now!`) without needing to look at the phone.
- **Settings screen already shows**: "Apple Watch Support: Coming
  Soon" (see `I18N.watchTitle` / `I18N.watchDesc` in `i18n.js`).
- **Native pieces needed**: a WatchKit/SwiftUI watch app target, plus
  `WatchConnectivity` (or a Capacitor community plugin) to push
  `alarmDate` / `modeSelect.value` from the phone to the watch.
- **Planned call site**: inside `app.js`'s `startStandby()`, right
  after `alarmDate` is computed, call
  `NativeFeatures.watch.pushCountdown(alarmDate)`.

## `NativeFeatures.pushNotifications` — local notification at zero

- **What**: Schedule a local notification for the exact alarm moment,
  so the countdown still fires even if the app/screen is not in the
  foreground (today's notice text explicitly warns users this can lag
  — this feature is how we eventually remove that caveat).
- **Native pieces needed**: `@capacitor/local-notifications`, iOS
  notification permission prompt, and a scheduled notification built
  from `alarmDate` + the mode-specific zero text (`getZeroText()`).
- **Planned call site**: `startStandby()`, scheduling
  `NativeFeatures.pushNotifications.scheduleAlarmNotification(alarmDate, zeroText)`
  right before `enterFocusMode()`.

## `NativeFeatures.backgroundNotifications` — background execution

- **What**: Keep the countdown accurate when the app is backgrounded
  (iOS suspends timers in the background by default).
- **Native pieces needed**: a `BGTaskScheduler` background task (iOS)
  or a foreground service (Android), registered once at app launch.
- **Planned call site**: called once from `app.js` on load, e.g.
  `NativeFeatures.backgroundNotifications.register()`.

## `NativeFeatures.liveActivity` — Live Activity (Dynamic Island / Lock Screen)

- **What**: Show the live countdown on the Lock Screen and in the
  Dynamic Island while a timer is armed.
- **Native pieces needed**: an iOS 16+ `ActivityKit` widget extension
  target; started/ended from Swift, driven by data passed from the
  webview via a Capacitor plugin bridge.
- **Planned call sites**: `NativeFeatures.liveActivity.start(alarmDate, mode)`
  in `startStandby()`, `NativeFeatures.liveActivity.end()` in
  `backToSetup()` and once the alarm fires in `tick()`.

## `NativeFeatures.dynamicIsland` — Dynamic Island compact/expanded views

- Shares the same `ActivityKit` extension as Live Activity above;
  kept as a separate stub because the compact/expanded/minimal Dynamic
  Island layouts are designed and iterated on independently from the
  Lock Screen layout.

## `NativeFeatures.widgets` — Home Screen widgets

- **What**: A small/medium WidgetKit widget showing the next favorite
  time or a "start a quick timer" shortcut from the Home Screen.
- **Native pieces needed**: a WidgetKit extension target, a shared
  `App Group` container so the widget can read the same
  `localStorage`-equivalent data (favorites, last-used mode) that the
  web app writes.
- **Planned call site**: `NativeFeatures.widgets.refreshTimeline()`
  called whenever favorites are saved/deleted in `app.js`.

## Why stubs instead of nothing

Keeping `window.NativeFeatures` in place (even as no-ops) means:

- The web app (GitHub Pages) and the future native app share the same
  `www/` source without diverging.
- Each feature above can be implemented and PR'd independently — the
  call sites already exist as comments/TODOs, so nobody has to
  rediscover where to hook in.
- `isAvailable()` checks let `app.js` stay defensive: if a feature
  isn't built yet (or isn't supported on the current platform), the
  app silently skips it instead of throwing.
