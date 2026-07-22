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
index.html            <- ENTRY POINT ONLY. Redirects to www/.
                          Do NOT add features here (see below).

www/                  <- THE SINGLE SOURCE OF TRUTH. Capacitor's webDir,
                          and what GitHub Pages ends up serving via the
                          redirect above. Edit the app here.
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

### ⚠️ One source of truth: `www/` (resolved 2026-07-22)

There used to be **two full copies of the app**: a 66 KB single-file
version at the repo root, and the split version under `www/`. Both
contained the same screen, so a change made in one silently left the
other stale — the web version and the app version could drift apart
without anyone noticing.

That is fixed. The root `index.html` is now a small redirect to
`www/`, so:

- **Capacitor (iOS/Android)** builds from `www/` (`webDir: "www"`).
- **GitHub Pages** still works at
  `https://<user>.github.io/byou-awase/` — it just forwards to
  `./www/`.

**Edit the app in `www/` only.**

| What to change | File |
|---|---|
| Screen markup | `www/index.html` |
| Styling | `www/css/style.css` |
| Behaviour (countdown, presets, favorites) | `www/js/app.js` |
| Japanese / English wording | `www/js/i18n.js` |

🚫 **Never add functionality back into the root `index.html`.** That
is what created the duplication in the first place. The previous
single-file version is preserved in git history (commit `538a938` and
earlier) if it is ever needed.

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
