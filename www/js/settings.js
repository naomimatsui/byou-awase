/*
 * Settings screen: panel open/close, and persistence of every user
 * preference (notification method, notify sound, pre-notify, jitter
 * assist, language) to localStorage.
 * Depends on: i18n.js (applyLanguage, currentLang).
 */

const settingsFab = document.getElementById("settingsFab");
const settingsHint = document.getElementById("settingsHint");
const settingsOverlay = document.getElementById("settingsOverlay");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");
const notifySoundSelect = document.getElementById("notifySoundSelect");
const langSelect = document.getElementById("langSelect");
const modeSelect = document.getElementById("modeSelect");
const notifyModeSelect = document.getElementById("notifyModeSelect");
const preNotifyToggle = document.getElementById("preNotifyToggle");
const jitterPresetSelect = document.getElementById("jitterPresetSelect");
const jitterRangeRow = document.getElementById("jitterRangeRow");
const jitterRangeInput = document.getElementById("jitterRangeInput");
const phoneNumberInput = document.getElementById("phoneNumberInput");

const SETTINGS_HINT_KEY = "byouAwaseSettingsHintSeen";

if (!localStorage.getItem(SETTINGS_HINT_KEY)) {
  setTimeout(() => {
    settingsHint.classList.add("show");
    localStorage.setItem(SETTINGS_HINT_KEY, "1");
    setTimeout(() => settingsHint.classList.remove("show"), 6000);
  }, 2300);
}

settingsHint.addEventListener("click", () => {
  settingsHint.classList.remove("show");
});

settingsFab.addEventListener("click", () => {
  settingsOverlay.classList.add("show");
  settingsHint.classList.remove("show");
});

settingsCloseBtn.addEventListener("click", () => {
  settingsOverlay.classList.remove("show");
});

settingsOverlay.addEventListener("click", (e) => {
  if (e.target === settingsOverlay) {
    settingsOverlay.classList.remove("show");
  }
});

const SETTINGS_KEY = "byouAwaseSettings";

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    mode: modeSelect.value,
    notify: notifyModeSelect.value,
    preNotify: preNotifyToggle.checked,
    jitterPreset: jitterPresetSelect.value,
    jitterRange: Number(jitterRangeInput.value) || 15,
    notifySound: notifySoundSelect.value,
    lang: langSelect.value,
    phoneNumber: phoneNumberInput.value.trim()
  }));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    /* 2026-07-22：LINE送信 / Threads投稿 / ライブ開始 を「投稿・配信」に統合した。
       統合前の設定が端末に残っていると選択肢が見つからず空になるため、post に読み替える。 */
    if (s.mode) {
      const merged = { line: "post", threads: "post", live: "post" };
      modeSelect.value = merged[s.mode] || s.mode;
    }
    if (s.notify) notifyModeSelect.value = s.notify;
    if (typeof s.preNotify === "boolean") preNotifyToggle.checked = s.preNotify;
    if (s.jitterPreset) jitterPresetSelect.value = s.jitterPreset;
    if (s.jitterRange) jitterRangeInput.value = s.jitterRange;
    if (s.notifySound) notifySoundSelect.value = s.notifySound;
    if (s.lang) currentLang = s.lang;
    if (s.phoneNumber) phoneNumberInput.value = s.phoneNumber;
    jitterRangeRow.classList.toggle("hidden", jitterPresetSelect.value !== "custom");
  } catch (err) {
    // keep defaults
  }
}

notifySoundSelect.addEventListener("change", saveSettings);
phoneNumberInput.addEventListener("input", saveSettings);

langSelect.addEventListener("change", () => {
  applyLanguage(langSelect.value);
  saveSettings();
});

[modeSelect, notifyModeSelect, jitterPresetSelect, jitterRangeInput].forEach((el) => {
  el.addEventListener("change", saveSettings);
});
preNotifyToggle.addEventListener("change", saveSettings);

loadSettings();
applyLanguage(currentLang);
