/*
 * Main app: splash timer, presets, quick timers, favorites, jitter
 * assist, focus/fullscreen mode, and the countdown/alarm engine.
 *
 * Depends on globals declared in earlier <script> files:
 *   i18n.js     -> t(), currentLang, applyLanguage()
 *   settings.js -> modeSelect, notifyModeSelect, preNotifyToggle,
 *                  jitterPresetSelect, jitterRangeRow, jitterRangeInput
 * (Those elements are shared, not redeclared here, since classic
 * <script> tags on one page share a single top-level scope.)
 */

const hourSelect = document.getElementById("hourSelect");
const minuteSelect = document.getElementById("minuteSelect");
const secondSelect = document.getElementById("secondSelect");
const startBtn = document.getElementById("startBtn");
const cancelBtn = document.getElementById("cancelBtn");
const setupCard = document.getElementById("setupCard");
const statusCard = document.getElementById("statusCard");
const targetDisplay = document.getElementById("targetDisplay");
const countdownEl = document.getElementById("countdown");
const nowOverlay = document.getElementById("nowOverlay");
const closeOverlayBtn = document.getElementById("closeOverlayBtn");
const nowClockEl = document.getElementById("nowClock");
const favLabelInput = document.getElementById("favLabelInput");
const saveFavBtn = document.getElementById("saveFavBtn");
const favoritesListEl = document.getElementById("favoritesList");
const focusBtn = document.getElementById("focusBtn");
const focusView = document.getElementById("focusView");
const focusTarget = document.getElementById("focusTarget");
const focusCountdownEl = document.getElementById("focusCountdown");
const exitFocusBtn = document.getElementById("exitFocusBtn");
const quickButtons = document.querySelectorAll(".quick-btn");
const jitterInfoRow = document.getElementById("jitterInfoRow");
const jitterDiffDisplay = document.getElementById("jitterDiffDisplay");
const actualTimeDisplay = document.getElementById("actualTimeDisplay");
const countdownLabel = document.getElementById("countdownLabel");
const focusCountdownLabel = document.getElementById("focusCountdownLabel");
const nowOverlayText = document.getElementById("nowOverlayText");
const presetButtons = document.querySelectorAll(".preset-btn");
const splashScreen = document.getElementById("splashScreen");

function fillSelect(select, max) {
  for (let i = 0; i < max; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = String(i).padStart(2, "0");
    select.appendChild(opt);
  }
}

fillSelect(hourSelect, 24);
fillSelect(minuteSelect, 60);
fillSelect(secondSelect, 60);

(function setDefaultTime() {
  const now = new Date();
  hourSelect.value = now.getHours();
  minuteSelect.value = now.getMinutes();
  secondSelect.value = 0;
})();

/* ---------- 起動スプラッシュ ---------- */

setTimeout(() => {
  splashScreen.classList.add("hide");
}, 2000);

splashScreen.addEventListener("transitionend", () => {
  if (splashScreen.classList.contains("hide")) {
    splashScreen.style.display = "none";
  }
});

/* ---------- プリセット ---------- */

const PRESETS = {
  sleep20: { mode: "normal", notify: "soundVibrate", preNotify: false, jitter: "just", quickSeconds: 20 },
  call: { mode: "call", notify: "soundVibrate", preNotify: true, jitter: "just" },
  line: { mode: "line", notify: "soundVibrate", preNotify: true, jitter: "5" },
  threads: { mode: "threads", notify: "soundVibrate", preNotify: true, jitter: "5" },
  ticket: { mode: "ticket", notify: "soundVibrate", preNotify: true, jitter: "just" },
  live: { mode: "live", notify: "soundVibrate", preNotify: true, jitter: "just" }
};

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = PRESETS[btn.dataset.preset];
    if (!preset) return;

    modeSelect.value = preset.mode;
    notifyModeSelect.value = preset.notify;
    preNotifyToggle.checked = preset.preNotify;
    jitterPresetSelect.value = preset.jitter;
    jitterRangeRow.classList.toggle("hidden", preset.jitter !== "custom");
    saveSettings();

    if (preset.quickSeconds) {
      startQuickTimer(preset.quickSeconds);
    }
  });
});

/* ---------- お気に入り時刻（localStorage） ---------- */

const FAV_KEY = "byouAwaseFavorites";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveFavoritesList(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

function renderFavorites() {
  const list = loadFavorites();
  favoritesListEl.innerHTML = "";

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "favorites-empty";
    empty.textContent = t("favoritesEmpty");
    favoritesListEl.appendChild(empty);
    return;
  }

  list.forEach((fav) => {
    const chip = document.createElement("div");
    chip.className = "favorite-chip";

    const timeStr =
      String(fav.hour).padStart(2, "0") + ":" +
      String(fav.minute).padStart(2, "0") + ":" +
      String(fav.second).padStart(2, "0");

    const label = document.createElement("span");
    label.textContent = fav.label ? fav.label + "　" + timeStr : timeStr;
    chip.appendChild(label);

    const del = document.createElement("span");
    del.className = "favorite-delete";
    del.textContent = "×";
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      saveFavoritesList(loadFavorites().filter((f) => f.id !== fav.id));
      renderFavorites();
    });
    chip.appendChild(del);

    chip.addEventListener("click", () => {
      hourSelect.value = fav.hour;
      minuteSelect.value = fav.minute;
      secondSelect.value = fav.second;
    });

    favoritesListEl.appendChild(chip);
  });
}

saveFavBtn.addEventListener("click", () => {
  const list = loadFavorites();
  list.push({
    id: Date.now(),
    label: favLabelInput.value.trim(),
    hour: Number(hourSelect.value),
    minute: Number(minuteSelect.value),
    second: Number(secondSelect.value)
  });
  saveFavoritesList(list);
  favLabelInput.value = "";
  renderFavorites();
});

document.addEventListener("secondsync:languagechange", renderFavorites);

/* ---------- あと○秒クイックタイマー ---------- */

function startQuickTimer(seconds) {
  const target = new Date(Date.now() + seconds * 1000);
  hourSelect.value = target.getHours();
  minuteSelect.value = target.getMinutes();
  secondSelect.value = target.getSeconds();
  startStandby();
}

quickButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    startQuickTimer(Number(btn.dataset.seconds));
  });
});

/* ---------- 自然送信アシスト ---------- */

jitterPresetSelect.addEventListener("change", () => {
  jitterRangeRow.classList.toggle("hidden", jitterPresetSelect.value !== "custom");
});

function getJitterRangeSeconds() {
  const preset = jitterPresetSelect.value;
  if (preset === "just") return 0;
  if (preset === "custom") return Math.max(1, Number(jitterRangeInput.value) || 15);
  return Number(preset);
}

function formatHms(date) {
  return (
    String(date.getHours()).padStart(2, "0") + ":" +
    String(date.getMinutes()).padStart(2, "0") + ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
}

/* ---------- 現在時刻の常時表示 ---------- */

function renderClock() {
  const now = new Date();
  nowClockEl.textContent =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");
}

setInterval(renderClock, 200);
renderClock();

/* ---------- 全画面（疑似全画面）モード ---------- */

function enterFocusMode() {
  focusView.classList.add("show");
  const el = document.documentElement;
  const request = el.requestFullscreen || el.webkitRequestFullscreen;
  if (request) {
    request.call(el).catch(() => {});
  }
}

function exitFocusMode() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (exit) exit.call(document).catch(() => {});
  }
  focusView.classList.remove("show");
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    focusView.classList.remove("show");
  }
});

focusBtn.addEventListener("click", enterFocusMode);
exitFocusBtn.addEventListener("click", exitFocusMode);

/* ---------- アラーム本体 ---------- */

let alarmDate = null;
let timer = null;
let lastSpokenCount = null;
let alarmLoopId = null;
let audioContext = null;

function unlockAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = currentLang === "en" ? "en-US" : "ja-JP";
  voice.rate = 1.0;
  speechSynthesis.speak(voice);
}

function playTone(freq, duration, gainVal, delay) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.frequency.value = freq;
  gain.gain.value = gainVal;
  const start = audioContext.currentTime + delay;
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function playNotifySound(style) {
  unlockAudio();
  if (style === "pon") {
    playTone(600, 0.35, 0.25, 0);
  } else if (style === "click") {
    playTone(2200, 0.03, 0.35, 0);
  } else if (style === "bell") {
    playTone(440, 0.15, 0.25, 0);
    playTone(480, 0.15, 0.25, 0.18);
    playTone(440, 0.15, 0.25, 0.36);
    playTone(480, 0.15, 0.25, 0.54);
  } else {
    for (let i = 0; i < 4; i++) {
      playTone(880, 0.16, 0.25, i * 0.3);
    }
  }
}

function startAlarmSound() {
  const style = notifySoundSelect.value;
  playNotifySound(style);
  alarmLoopId = setInterval(() => playNotifySound(style), 1400);
}

function stopAlarmSound() {
  if (alarmLoopId) {
    clearInterval(alarmLoopId);
    alarmLoopId = null;
  }
}

function vibrateIfSupported(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function shouldPlaySound() {
  return notifyModeSelect.value === "soundVibrate" || notifyModeSelect.value === "soundOnly";
}

function shouldVibrate() {
  return notifyModeSelect.value === "soundVibrate" || notifyModeSelect.value === "vibrateOnly";
}

function getZeroText(mode) {
  return t("zero_" + mode) || t("zero_normal");
}

function getModeIcon(mode) {
  if (mode === "call") return "📞";
  if (mode === "line") return "💬";
  if (mode === "threads") return "🧵";
  if (mode === "ticket") return "🎫";
  if (mode === "live") return "🎥";
  return "⏱";
}

function playPreNotifyBeep() {
  unlockAudio();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.frequency.value = 1400;
  gain.gain.value = 0.3;
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function setCountdownDisplay(text, warn) {
  countdownEl.textContent = text;
  focusCountdownEl.textContent = text;
  countdownEl.classList.toggle("warn", warn);
  focusCountdownEl.classList.toggle("warn", warn);
}

function setCountdownLabelVisible(visible) {
  countdownLabel.classList.toggle("hidden", !visible);
  focusCountdownLabel.classList.toggle("hidden", !visible);
}

function startStandby() {
  unlockAudio();

  const hour = Number(hourSelect.value);
  const minute = Number(minuteSelect.value);
  const second = Number(secondSelect.value);

  const now = new Date();
  let baseAlarmDate = new Date(now.getTime());
  baseAlarmDate.setHours(hour, minute, second, 0);

  if (baseAlarmDate <= now) {
    baseAlarmDate.setDate(baseAlarmDate.getDate() + 1);
  }

  alarmDate = baseAlarmDate;
  let shiftSeconds = 0;
  const jitterRange = getJitterRangeSeconds();

  if (jitterRange > 0) {
    shiftSeconds = Math.round((Math.random() * 2 - 1) * jitterRange);
    let shiftedDate = new Date(baseAlarmDate.getTime() + shiftSeconds * 1000);

    if (shiftedDate <= now) {
      shiftedDate = new Date(now.getTime() + 1000);
      shiftSeconds = Math.round((shiftedDate - baseAlarmDate) / 1000);
    }

    alarmDate = shiftedDate;
  }

  lastSpokenCount = null;
  stopAlarmSound();

  const targetStr =
    String(hour).padStart(2, "0") + ":" +
    String(minute).padStart(2, "0") + ":" +
    String(second).padStart(2, "0");

  targetDisplay.textContent = targetStr;
  focusTarget.textContent = t("targetTimeLabel") + "　" + targetStr;

  const modeIcon = getModeIcon(modeSelect.value);
  countdownLabel.textContent = modeIcon + " " + t("countdownLabelText");
  focusCountdownLabel.textContent = modeIcon + " " + t("countdownLabelText");

  if (jitterRange > 0) {
    const sign = shiftSeconds >= 0 ? "+" : "-";
    jitterDiffDisplay.textContent = sign + Math.abs(shiftSeconds) + t("jitterRangeUnit");
    actualTimeDisplay.textContent = formatHms(alarmDate);
    jitterInfoRow.classList.remove("hidden");
  } else {
    jitterInfoRow.classList.add("hidden");
  }

  setCountdownDisplay(t("standbyText"), false);
  setCountdownLabelVisible(false);
  nowOverlay.classList.remove("show");

  setupCard.classList.add("hidden");
  statusCard.classList.remove("hidden");

  if (shouldPlaySound()) speak(t("setAnnounce"));

  enterFocusMode();

  if (timer) clearInterval(timer);
  timer = setInterval(tick, 100);
}

function backToSetup() {
  if (timer) clearInterval(timer);
  stopAlarmSound();
  speechSynthesis.cancel();
  nowOverlay.classList.remove("show");
  exitFocusMode();
  setCountdownDisplay("--", false);
  setCountdownLabelVisible(false);
  jitterInfoRow.classList.add("hidden");
  statusCard.classList.add("hidden");
  setupCard.classList.remove("hidden");
}

function tick() {
  const now = new Date();
  const diff = alarmDate - now;

  if (diff <= 0) {
    clearInterval(timer);
    const zeroText = getModeIcon(modeSelect.value) + " " + getZeroText(modeSelect.value);
    setCountdownDisplay(zeroText, false);
    setCountdownLabelVisible(false);
    nowOverlayText.textContent = zeroText;
    nowOverlay.classList.add("show");
    if (shouldPlaySound()) {
      startAlarmSound();
      speak(t("nowSpeech"));
    }
    if (shouldVibrate()) vibrateIfSupported(700);
    return;
  }

  const secondsLeft = Math.ceil(diff / 1000);
  setCountdownLabelVisible(true);

  if (secondsLeft <= 10) {
    setCountdownDisplay(String(secondsLeft), true);
  } else {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    setCountdownDisplay(
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0"),
      false
    );
  }

  if (secondsLeft <= 5 && secondsLeft > 0 && lastSpokenCount !== secondsLeft) {
    lastSpokenCount = secondsLeft;

    if (secondsLeft === 1 && preNotifyToggle.checked) {
      if (shouldPlaySound()) {
        playPreNotifyBeep();
        speak(t("preNotifySpeech"));
      }
    } else if (shouldPlaySound()) {
      speak(String(secondsLeft));
    }

    if (shouldVibrate() && secondsLeft <= 3) vibrateIfSupported(80);
  }
}

closeOverlayBtn.addEventListener("click", () => {
  stopAlarmSound();
  nowOverlay.classList.remove("show");
  backToSetup();
});

startBtn.addEventListener("click", startStandby);
cancelBtn.addEventListener("click", backToSetup);

renderFavorites();
