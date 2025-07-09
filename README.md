# gtag-push-queue

📦 A lightweight JavaScript utility to safely queue `gtag_push()` calls until Google Tag Manager is fully initialized and target event (for example a privacy consent) is fired.

## ✅ Features

- Queues events until both GTM and target event (for example `iubenda_gtm_consent_event`) are available
- Does not overwrite `dataLayer.push`
- Fully compatible with legacy browsers (ES5)
- Includes emoji-based debug logs
- No dependencies

## 🔧 Usage

Include the script early on the page:

```html
<script src="gtag-push-queue.js"></script>
<script>
  gtagConsentInit({
    gtmId: 'GTM-XXXXXXX',
    waitForEvent: 'iubenda_gtm_consent_event',
    dataLayerName: 'dataLayer'
  });

  gtag_push({ event: 'my_event', category: 'example' });
</script>
```

## 📄 License

MIT
