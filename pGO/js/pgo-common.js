(function (global) {
  "use strict";

  var R_EARTH_M = 6371000;

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function haversineMeters(lat1, lon1, lat2, lon2) {
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R_EARTH_M * c;
  }

  function ensureFirebase() {
    if (!global.firebase || !global.PGO_FIREBASE_CONFIG) {
      throw new Error("Firebase SDK or PGO_FIREBASE_CONFIG missing");
    }
    var cfg = global.PGO_FIREBASE_CONFIG;
    if (!cfg.apiKey || cfg.apiKey === "REPLACE_ME") {
      throw new Error("Configure pGO/js/firebase-config.js");
    }
    if (!global.__pgoApp) {
      global.__pgoApp = global.firebase.initializeApp(cfg);
    }
    return global.__pgoApp;
  }

  function getAuth() {
    return global.firebase.auth(ensureFirebase());
  }

  function getDb() {
    return global.firebase.firestore(ensureFirebase());
  }

  function getStorage() {
    return global.firebase.storage(ensureFirebase());
  }

  function signInAnonymous() {
    return getAuth().signInAnonymously();
  }

  global.PGO = {
    haversineMeters: haversineMeters,
    ensureFirebase: ensureFirebase,
    getAuth: getAuth,
    getDb: getDb,
    getStorage: getStorage,
    signInAnonymous: signInAnonymous
  };
})(typeof window !== "undefined" ? window : globalThis);
