# Android Installation Guide

Install the **Cast Operations On-Call** native Android app from the Google Play Store, or sideload the APK directly on devices without Google Play.

## Requirements

- Android phone or tablet running **Android 8.0 (Oreo) or later**
- An active Cast Operations account (or the URL of your self-hosted Cast Operations instance)
- Internet connection for sign-in and to receive push notifications

## Option 1: Install from Google Play (Recommended)

1. Open the **Google Play Store** on your device.
2. Search for **"Cast Operations On-Call"**, or open this link on your device:
   [https://github.com/autonomy-cloud/operations/releases](https://github.com/autonomy-cloud/operations/releases)
3. Tap **Install**.
4. Once installed, tap **Open** or launch **Cast Operations On-Call** from your app drawer.

## Option 2: Install the APK Directly

For devices without Google Play (for example, GrapheneOS, /e/OS, or Huawei devices), install the official APK from GitHub Releases:

1. On your Android device, open this link:
   [https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk](https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk)
2. When prompted, allow your browser to install unknown apps:
   **Settings → Apps → \[Your browser\] → Install unknown apps → Allow from this source**.
3. Open the downloaded APK and tap **Install**.
4. Launch **Cast Operations On-Call** from your app drawer.

The APK is built and signed by Cast Operations from the same source as the Play Store release. App updates are not automatic when sideloading — download the latest APK from the link above when a new version is released.

## First Launch and Sign-in

1. **Server URL**
   - If you use Cast Operations Cloud, leave the default `https://latticeruntime.com`.
   - If you are self-hosting, enter the URL of your Cast Operations instance (e.g. `https://operations.example.com`).
   - The app verifies the server is reachable before continuing.
2. **Sign In**
   - Enter the email and password for your Cast Operations account.
   - Optionally enable **biometric unlock** (fingerprint) for faster unlocks on later launches.
3. **Allow Notifications**
   - When prompted, tap **Allow** so the app can deliver on-call pages, incident alerts, and acknowledgements.

## Push Notifications

Push notifications are delivered through Firebase Cloud Messaging (FCM) via Expo Push. To make sure pages reach you reliably while on-call:

1. Open **Settings → Apps → Cast Operations On-Call → Notifications** and confirm all categories are enabled.
2. Open **Settings → Apps → Cast Operations On-Call → Battery** and choose **Unrestricted** (or disable battery optimization) so the OS does not delay background pushes.
3. Allow the app to run in the background and disable any "Data Saver" restrictions for it.
4. If you use Samsung devices, also turn off **Settings → Device care → Battery → Background usage limits** for Cast Operations On-Call.
5. Add Cast Operations On-Call to any **Do Not Disturb** exception lists so pages still ring during your on-call shift.

## Updates

**Google Play:**

- Updates install automatically. To trigger one manually, open **Play Store → Profile → Manage apps & device → Updates available → Cast Operations On-Call → Update**.

**APK sideload:**

- Re-download the latest APK from the GitHub Releases link above and install over the existing app — your data, server URL, and login are preserved.

## Uninstall

1. **Long-press** the **Cast Operations On-Call** icon, then tap **Uninstall**.
2. Or open **Settings → Apps → Cast Operations On-Call → Uninstall**.
3. Confirm to remove the app.

Your Cast Operations account and on-call schedules are stored server-side and are not removed when you uninstall the app.

## Troubleshooting

**"Network Error" when signing in:**

- Verify that the **Server URL** is correct and reachable from your device.
- If you are on a corporate network or VPN, make sure the Cast Operations instance is accessible.
- Confirm the server is served over HTTPS with a valid certificate.

**Not receiving push notifications:**

- Confirm notifications are enabled at **Settings → Apps → Cast Operations On-Call → Notifications**.
- Disable battery optimization for Cast Operations On-Call (see Push Notifications above).
- Make sure Do Not Disturb is off, or that Cast Operations On-Call is on the exception list.
- Sign out and sign back in to refresh the push token registered with the server.
- Self-hosted users: confirm push notifications are configured on your Cast Operations instance (see the self-hosted [Push Notifications](/docs/self-hosted/push-notifications) guide).

**Biometric unlock not working:**

- Enrol a fingerprint in **Settings → Security → Fingerprint**.
- Re-enable biometric unlock from the **Settings** screen inside the Cast Operations On-Call app.

**APK install blocked:**

- You must grant the browser permission to install unknown apps (see Option 2 above).
- Some carriers or enterprise device profiles block sideloading entirely; in that case, use the Google Play version instead.

**App crashes on launch:**

- Update to the latest version from Google Play or the latest APK.
- Restart your device.
- If the issue persists, uninstall and reinstall, then sign in again.

## Support

If you still need help, reach out through your Cast Operations dashboard or open an issue on our [GitHub repository](https://github.com/autonomy-cloud/operations).
