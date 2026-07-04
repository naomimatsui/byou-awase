/*
 * Translation dictionary and DOM text application.
 * Depends on: window.AppConfig (config.js).
 * Emits a "secondsync:languagechange" document event after applying a
 * language so other modules (e.g. the favorites list in app.js) can
 * re-render anything they own without i18n.js needing to know about them.
 */

const I18N = {
  ja: {
    eyebrow: "SECOND-PRECISE ALARM",
    appName: window.AppConfig.name.ja,
    tagline: window.AppConfig.tagline.ja,
    usecase: "予約開始・LINE投稿・チケット発売・ライブ配信など、タイミングを合わせたい瞬間に。",
    presetLabel: "プリセット",
    preset_sleep20: "😴 あと20秒寝る",
    preset_call: "📞 予約電話",
    preset_line: "💬 LINE送信",
    preset_threads: "🧵 Threads投稿",
    preset_ticket: "🎫 チケット発売",
    preset_live: "🎥 ライブ開始",
    targetTimeLabel: "目標時刻",
    modeLabel: "モード",
    mode_normal: "⏱ 通常",
    mode_call: "📞 予約電話",
    mode_line: "💬 LINE送信",
    mode_threads: "🧵 Threads投稿",
    mode_ticket: "🎫 チケット",
    mode_live: "🎥 ライブ開始",
    notifyLabel: "通知方法",
    notify_soundVibrate: "音＋バイブ",
    notify_soundOnly: "音のみ",
    notify_vibrateOnly: "バイブのみ",
    notify_silent: "サイレント（画面表示のみ）",
    preNotifyLabel: "1秒前に予告する",
    preNotifyDesc: "予約電話・チケット・LINE送信・Threads投稿などで、1秒前に短い音とアナウンスでお知らせします。",
    quickStartHeader: "⚡ クイックスタート",
    quickStartFieldLabel: "あと○秒で開始",
    quick_1: "あと1秒",
    quick_3: "あと3秒",
    quick_5: "あと5秒",
    quick_10: "あと10秒",
    quick_20: "あと20秒",
    quick_30: "あと30秒",
    quick_45: "あと45秒",
    quick_60: "あと1分",
    jitterLabel: "自然送信アシスト",
    jitterDesc: "毎回ぴったり同じ時刻にならないように、数秒だけ自然にずらします。",
    jitter_just: "ジャスト",
    jitter_3: "人間っぽく ±3秒",
    jitter_5: "人間っぽく ±5秒",
    jitter_10: "人間っぽく ±10秒",
    jitter_15: "人間っぽく ±15秒",
    jitter_custom: "カスタム",
    jitterRangeLabel: "ずらし幅",
    jitterRangeUnit: "秒",
    startBtn: "秒合わせ開始",
    favoritesLabel: "お気に入り時刻",
    favLabelPlaceholder: "ラベル（任意）",
    saveBtn: "★ 保存",
    favoritesEmpty: "保存された時刻はまだありません",
    noticeText: "正確に使うには、この画面を開いたままにしてください。別アプリを開いている間は、音やカウントが遅れる場合があります。",
    baseTimeLabel: "基準時刻",
    jitterInfoLabel: "自然ずらし",
    actualTimeLabel: "通知時刻",
    countdownLabelText: "開始まで",
    standbyText: "待機中",
    focusModeBtn: "全画面モード",
    backBtn: "設定に戻る",
    closeBtn: "閉じる",
    endBtn: "終了",
    footer: window.AppConfig.footer.ja,
    settingsTitle: "設定",
    settingsFabLabel: "設定",
    settingsHintText: "右下の⚙から言語・通知音を変更できます",
    soundLabel: "通知音",
    sound_beep: "ピッ",
    sound_pon: "ポン",
    sound_click: "カチッ",
    sound_bell: "電話ベル",
    watchTitle: "⌚ Apple Watch対応：準備中",
    watchDesc: "腕だけ見て、3・2・1・今！が分かる機能を予定しています。",
    appInfoLabel: "アプリ情報",
    appInfoText: "アプリ名：秒合わせ<br />English name：Second Sync<br />キャッチコピー：その一秒を逃さない。",
    zero_normal: "今！",
    zero_call: "発信！",
    zero_line: "送信！",
    zero_threads: "投稿！",
    zero_ticket: "押す！",
    zero_live: "開始！",
    setAnnounce: "アラームをセットしました",
    nowSpeech: "今です",
    preNotifySpeech: "1秒前"
  },
  en: {
    eyebrow: "SECOND-PRECISE ALARM",
    appName: window.AppConfig.name.en,
    tagline: window.AppConfig.tagline.en,
    usecase: "For reservation openings, LINE posts, ticket sales, live streams — anything that needs perfect timing.",
    presetLabel: "Presets",
    preset_sleep20: "😴 Sleep 20 sec",
    preset_call: "📞 Call",
    preset_line: "💬 LINE",
    preset_threads: "🧵 Threads",
    preset_ticket: "🎫 Tickets",
    preset_live: "🎥 Live",
    targetTimeLabel: "Target Time",
    modeLabel: "Mode",
    mode_normal: "⏱ Normal",
    mode_call: "📞 Call",
    mode_line: "💬 LINE",
    mode_threads: "🧵 Threads",
    mode_ticket: "🎫 Tickets",
    mode_live: "🎥 Live",
    notifyLabel: "Notification",
    notify_soundVibrate: "Sound + Vibration",
    notify_soundOnly: "Sound Only",
    notify_vibrateOnly: "Vibration Only",
    notify_silent: "Silent (Display Only)",
    preNotifyLabel: "1-Second Warning",
    preNotifyDesc: "For calls, tickets, LINE, Threads and more — get a short sound and announcement 1 second before.",
    quickStartHeader: "⚡ Quick Start",
    quickStartFieldLabel: "Quick Start",
    quick_1: "1 sec",
    quick_3: "3 sec",
    quick_5: "5 sec",
    quick_10: "10 sec",
    quick_20: "20 sec",
    quick_30: "30 sec",
    quick_45: "45 sec",
    quick_60: "1 min",
    jitterLabel: "Natural Timing Assist",
    jitterDesc: "Slightly shifts the timing by a few seconds so it does not always happen at the exact same time.",
    jitter_just: "Exact",
    jitter_3: "Natural ±3 sec",
    jitter_5: "Natural ±5 sec",
    jitter_10: "Natural ±10 sec",
    jitter_15: "Natural ±15 sec",
    jitter_custom: "Custom",
    jitterRangeLabel: "Shift Range",
    jitterRangeUnit: "sec",
    startBtn: "Start Second Sync",
    favoritesLabel: "Favorites",
    favLabelPlaceholder: "Label (optional)",
    saveBtn: "★ Save",
    favoritesEmpty: "No saved times yet",
    noticeText: "Keep this screen open for accurate timing. Sound and countdown may lag while another app is in front.",
    baseTimeLabel: "Base Time",
    jitterInfoLabel: "Natural Shift",
    actualTimeLabel: "Notify Time",
    countdownLabelText: "Starting in",
    standbyText: "Standby",
    focusModeBtn: "Fullscreen Mode",
    backBtn: "Back to Setup",
    closeBtn: "Close",
    endBtn: "End",
    footer: window.AppConfig.footer.en,
    settingsTitle: "Settings",
    settingsFabLabel: "Settings",
    settingsHintText: "Tap ⚙ in the bottom right to change language and sound.",
    soundLabel: "Sound",
    sound_beep: "Beep",
    sound_pon: "Pon",
    sound_click: "Click",
    sound_bell: "Phone Bell",
    watchTitle: "⌚ Apple Watch Support: Coming Soon",
    watchDesc: "See 3, 2, 1, Now! right on your wrist.",
    appInfoLabel: "App Info",
    appInfoText: "App Name: Second Sync<br />Japanese Name: 秒合わせ<br />Tagline: Never Miss That Second.",
    zero_normal: "Now!",
    zero_call: "Call!",
    zero_line: "Send!",
    zero_threads: "Post!",
    zero_ticket: "Tap!",
    zero_live: "Start!",
    setAnnounce: "Alarm set",
    nowSpeech: "Now",
    preNotifySpeech: "1 second"
  }
};

let currentLang = "ja";

function t(key) {
  const dict = I18N[currentLang] || I18N.ja;
  if (dict[key] !== undefined) return dict[key];
  return I18N.ja[key] !== undefined ? I18N.ja[key] : key;
}

function applyLanguage(lang) {
  currentLang = I18N[lang] ? lang : "ja";

  const langSelect = document.getElementById("langSelect");
  if (langSelect) langSelect.value = currentLang;

  document.documentElement.lang = currentLang;
  document.title = t("appName") + " ー " + t("tagline");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  const splashEn = document.getElementById("splashEn");
  if (splashEn) splashEn.classList.toggle("hidden", currentLang !== "ja");

  document.dispatchEvent(new CustomEvent("secondsync:languagechange", { detail: { lang: currentLang } }));
}
