/*
 * App-wide brand constants.
 * Single source of truth for anything that also has to match native
 * app metadata (Xcode target name, Info.plist display name, App Store
 * listing, capacitor.config.json). i18n.js reads from this instead of
 * repeating the same strings in its dictionary.
 */
window.AppConfig = {
  bundleId: "com.adonis.secondsync",
  name: {
    ja: "秒合わせ",
    en: "Second Sync"
  },
  tagline: {
    ja: "その一秒を逃さない。",
    en: "Never Miss That Second."
  },
  footer: {
    ja: "BYOU AWASE",
    en: "SECOND SYNC"
  }
};
