(function () {
  function gtagConsentInit(config) {
    var gtmId = config.gtmId;
    var waitForEvent = config.waitForEvent || 'iubenda_gtm_consent_event';
    var dataLayerName = config.dataLayerName || 'dataLayer';

    var gtagQueue = [];
    var consentGiven = false;
    var gtmReady = false;
    var originalPush = null;

    // Inject GTM script
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0];
      var j = d.createElement(s);
      var dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', dataLayerName, gtmId);

    function initPolling() {
      var dl = window[dataLayerName];
      if (!Array.isArray(dl)) {
        setTimeout(initPolling, 100);
        return;
      }

      for (var i = 0; i < dl.length; i++) {
        var e = dl[i];
        if (e && e.event === waitForEvent) {
          consentGiven = true;
          console.log("☑️ Consent event already present:", waitForEvent);
          break;
        }
      }

      if (typeof dl.push === 'function') {
        originalPush = dl.push.bind(dl);
        gtmReady = true;
        console.log("✅ GTM is ready");

        if (consentGiven) flushQueue();
      } else {
        setTimeout(initPolling, 100);
        return;
      }

      observerLoop();
    }

    function observerLoop() {
      if (gtmReady && !consentGiven) {
        for (var i = 0; i < window[dataLayerName].length; i++) {
          var e = window[dataLayerName][i];
          if (e && e.event === waitForEvent) {
            consentGiven = true;
            console.log("✔️ Consent event detected via polling:", waitForEvent);
            flushQueue();
            break;
          }
        }
      }
      setTimeout(observerLoop, 100);
    }

    function flushQueue() {
      console.log("🚀 Flushing " + gtagQueue.length + " queued event(s)");
      while (gtagQueue.length > 0) {
        var ev = gtagQueue.shift();
        originalPush(ev);
      }
    }

    window.gtag_push = function (data) {
      console.log("📤 gtag_push called:", data);
      if (gtmReady && consentGiven) {
        originalPush(data);
      } else {
        console.log("🕓 Queued until GTM is ready and consent is given");
        gtagQueue.push(data);
      }
    };

    setTimeout(initPolling, 0);
  }

  window.gtagConsentInit = gtagConsentInit;
})();