/*
 * Native feature integration points — NOT YET IMPLEMENTED.
 *
 * Each entry here is where a real Capacitor plugin will eventually be
 * wired in once the iOS/Android shells exist. They are safe no-ops so
 * the web app's behavior is completely unchanged until each one is
 * actually built out. See docs/FUTURE_FEATURES.md for what each is
 * planned to do and which native APIs/plugins it will need.
 *
 * Usage pattern once a feature is implemented:
 *   if (window.NativeFeatures.watch.isAvailable()) {
 *     window.NativeFeatures.watch.pushCountdown(alarmDate);
 *   }
 */
window.NativeFeatures = {
  watch: {
    isAvailable: () => false,
    pushCountdown: () => {}
  },
  pushNotifications: {
    isAvailable: () => false,
    scheduleAlarmNotification: () => {}
  },
  backgroundNotifications: {
    isAvailable: () => false,
    register: () => {}
  },
  liveActivity: {
    isAvailable: () => false,
    start: () => {},
    end: () => {}
  },
  dynamicIsland: {
    isAvailable: () => false,
    update: () => {}
  },
  widgets: {
    isAvailable: () => false,
    refreshTimeline: () => {}
  }
};
