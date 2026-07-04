# 秒合わせ / Second Sync

A second-precise alarm/timer for reservation calls, LINE/Threads
posts, ticket sales, and live starts — anything where hitting the
exact second matters.

- **App name (JA)**: 秒合わせ
- **App name (EN)**: Second Sync
- **Tagline (JA)**: その一秒を逃さない。
- **Tagline (EN)**: Never Miss That Second.
- **Bundle ID (candidate)**: `com.adonis.secondsync`

This project is being developed toward an App Store release as a
native iPhone app (via Capacitor), while keeping the existing web
version live and unchanged.

## Project structure

```
index.html            <- the original single-file web app (GitHub Pages).
                          Untouched by the Capacitor work below; this stays
                          live at https://<user>.github.io/byou-awase/.

www/                  <- Capacitor's webDir. Same app, split into
                          maintainable files. This is the version that
                          gets wrapped into the iOS/Android app.
  index.html
  css/
    style.css
  js/
    config.js          <- brand constants (name/tagline/bundle id)
    i18n.js             <- ja/en dictionary + applyLanguage()
    settings.js         <- settings screen + localStorage persistence
    native-stubs.js      <- Phase 5 placeholders, see docs/FUTURE_FEATURES.md
    app.js               <- countdown/alarm engine, presets, favorites, etc.

resources/              <- source images for icon/splash generation
  icon.png               <- 1024x1024 placeholder app icon (replace this)
  splash.png             <- 2732x2732 placeholder splash source (replace this)

docs/
  FUTURE_FEATURES.md    <- Phase 5 native feature design notes

capacitor.config.json    <- appId / appName / webDir
package.json             <- Capacitor CLI + platform dependencies
```

### Why two copies of the app?

`index.html` at the repo root is the currently-published web app and
is left exactly as-is so the live GitHub Pages URL keeps working.
`www/` is the same functionality, reorganized into separate
CSS/JS/data files so it can be:

1. Maintained more easily (one concern per file), and
2. Wrapped as a native iOS/Android app via Capacitor, whose `webDir`
   config points at `www/`.

Going forward, new features should be built in `www/`. If/when it's
worth retiring the duplicate, the root `index.html` can be replaced
with a redirect to `www/`, or GitHub Pages can be pointed at `www/`
directly — that's a later decision, not made here.

## Getting the native app running (next steps, needs Node + Xcode)

This environment doesn't have Node.js installed, so the Capacitor CLI
commands below have **not** been run or verified yet. On a machine
with Node and (for iOS) Xcode installed:

```bash
npm install
npx cap add ios
npx cap sync
npx cap open ios
```

Before submitting to the App Store:

- Replace `resources/icon.png` and `resources/splash.png` with real
  artwork, then run `npm run assets` (wraps
  `npx @capacitor/assets generate`) to generate every required iOS
  icon size and splash variant.
- Confirm `com.adonis.secondsync` is the Bundle ID you want to
  register in App Store Connect (this is currently a candidate, not
  finalized).
- Fill in App Store Connect metadata using the app name / tagline
  above (also shown in-app under Settings → App Info).

## Localization

The app supports Japanese and English today (`www/js/i18n.js`).
Switch languages from the in-app Settings screen (⚙️ button, bottom
right) — the choice is saved and restored on next launch. Adding a
third language means adding one more object to `I18N` in `i18n.js`
and an `<option>` in the `#langSelect` dropdown; no other file needs
to change.

## Planned native features (not implemented yet)

See [`docs/FUTURE_FEATURES.md`](docs/FUTURE_FEATURES.md) for the
design of: Apple Watch companion, iPhone push notifications,
background execution, Live Activity, Dynamic Island, and Home Screen
widgets. The extension points for all of these already exist as
no-op stubs in `www/js/native-stubs.js`.
