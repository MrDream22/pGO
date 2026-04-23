/**
 * Google Maps + Leaflet.gridLayer.googleMutant
 * Google Maps API는 callback= 방식으로만 로드해야 google.maps가 확실히 준비됨
 * (async만 쓰고 callback이 없으면 GoogleMutant가 비어 있을 수 있음)
 */
(function (w) {
  "use strict";

  var d = w.document;
  w.PGO = w.PGO || {};

  w.PGO.addMapBaseLayer = function (map) {
    if (!w.L) return;
    if (w.google && w.google.maps && w.L.gridLayer && w.L.gridLayer.googleMutant) {
      try {
        w.L.gridLayer
          .googleMutant({ type: "roadmap" })
          .addTo(map);
        return;
      } catch (e) {
        console.warn("PGO: GoogleMutant add failed, using OSM", e);
      }
    }
    w.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);
  };

  w.PGO.whenMapBaseReady = function (cb) {
    if (w.__pgoMapBaseReady) {
      w.setTimeout(function () {
        try {
          cb();
        } catch (e) {
          console.error(e);
        }
      }, 0);
      return;
    }
    w.addEventListener(
      "pgoMapsReady",
      function () {
        try {
          cb();
        } catch (e) {
          console.error(e);
        }
      },
      { once: true }
    );
  };

  w.PGO.invalidateMapSizeSoon = function (map) {
    if (!map || !map.invalidateSize) return;
    w.requestAnimationFrame(function () {
      map.invalidateSize();
      w.setTimeout(function () {
        map.invalidateSize();
      }, 200);
    });
  };

  function fire() {
    w.__pgoMapBaseReady = true;
    w.dispatchEvent(new w.Event("pgoMapsReady"));
  }

  var key = w.PGO_GOOGLE_MAPS_KEY;
  if (!key || key === "REPLACE_ME") {
    if (d.readyState === "loading") {
      d.addEventListener("DOMContentLoaded", fire);
    } else {
      fire();
    }
    return;
  }

  var s1 = d.createElement("script");
  s1.onerror = function () {
    console.warn("PGO: Google Maps script failed to load, using OSM");
    try {
      delete w.__pgoGmapsInit;
    } catch (e2) {}
    fire();
  };

  w.__pgoGmapsInit = function () {
    try {
      delete w.__pgoGmapsInit;
    } catch (e) {
      w.__pgoGmapsInit = undefined;
    }
    if (!w.google || !w.google.maps) {
      console.warn("PGO: google.maps missing after callback, using OSM");
      fire();
      return;
    }
    var s2 = d.createElement("script");
    s2.src =
      "https://unpkg.com/leaflet.gridlayer.googlemutant@0.16.0/dist/Leaflet.GoogleMutant.js";
    s2.async = true;
    s2.onload = function () {
      if (!w.L || !w.L.gridLayer || !w.L.gridLayer.googleMutant) {
        console.warn("PGO: GoogleMutant not registered, using OSM");
      }
      fire();
    };
    s2.onerror = function () {
      console.warn("PGO: GoogleMutant script failed, using OSM");
      fire();
    };
    d.head.appendChild(s2);
  };

  s1.src =
    "https://maps.googleapis.com/maps/api/js?key=" +
    encodeURIComponent(key) +
    "&callback=__pgoGmapsInit";
  s1.async = true;
  s1.defer = true;
  d.head.appendChild(s1);
})(typeof window !== "undefined" ? window : globalThis);
