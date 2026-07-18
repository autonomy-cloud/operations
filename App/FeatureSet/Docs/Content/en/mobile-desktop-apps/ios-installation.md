# iOS Installation Guide

Install the **Cast Operations On-Call** native iOS app from the Apple App Store on your iPhone or iPad.

## Requirements

- iPhone or iPad running **iOS 15.0 or later**
- An active Cast Operations account (or the URL of your self-hosted Cast Operations instance)
- Internet connection for sign-in and to receive push notifications

## Install from the App Store

1. **Open the App Store** on your iPhone or iPad.
2. Tap the **Search** tab and search for **"Cast Operations On-Call"**, or open this link on your device:
   [https://github.com/autonomy-cloud/operations/releases](https://github.com/autonomy-cloud/operations/releases)
3. Tap **Get**, then authenticate with Face ID, Touch ID, or your Apple ID password.
4. Once installed, tap **Open** or launch **Cast Operations On-Call** from your home screen.

## First Launch and Sign-in

1. **Server URL**
   - If you use Cast Operations Cloud, leave the default `https://visca.ai`.
   - If you are self-hosting, enter the URL of your Cast Operations instance (e.g. `https://operations.example.com`).
   - The app verifies the server is reachable before continuing.
2. **Sign In**
   - Enter the email and password for your Cast Operations account.
   - Optionally enable **Face ID** or **Touch ID** for faster unlocks on later launches.
3. **Allow Notifications**
   - When prompted, tap **Allow** so the app can deliver on-call pages, incident alerts, and acknowledgements.

## Push Notifications

Push notifications are delivered through the Apple Push Notification service (APNs) via Expo Push. To make sure pages reach you reliably:

1. Go to **Settings → Notifications → Cast Operations On-Call**.
2. Enable **Allow Notifications**, **Sounds**, **Badges**, and **Lock Screen / Banner / Notification Centre** delivery.
3. Set **Notification Grouping** to **Automatic**.
4. If you are on-call, disable **Low Power Mode** during your shift and avoid Force-Quitting the app — iOS may delay background delivery if the app is force-closed.
5. Add **Cast Operations On-Call** to any **Focus** modes where you still want to receive pages.

## Updates

The app is updated through the App Store:

- Open the **App Store**, tap your profile picture, scroll to **Cast Operations On-Call**, and tap **Update**.
- Or enable **Settings → App Store → App Updates** to install updates automatically.

## Uninstall

1. **Long-press** the **Cast Operations On-Call** icon on your home screen.
2. Tap **Remove App → Delete App**.
3. Confirm by tapping **Delete**.

Your Cast Operations account and on-call schedules are stored server-side and are not removed when you uninstall the app.

## Troubleshooting

**App Store says the app is "Not Available in Your Region":**

- The app is published on the global App Store. If it does not appear in your region, contact [support](mailto:support@visca.ai).

**"Network Error" when signing in:**

- Verify that the **Server URL** is correct and reachable from your device.
- If you are on a corporate network or VPN, make sure the Cast Operations instance is accessible.
- Confirm the server is served over HTTPS with a valid certificate.

**Not receiving push notifications:**

- Open **Settings → Notifications → Cast Operations On-Call** and confirm notifications are allowed.
- Disable **Do Not Disturb** or add Cast Operations On-Call to your active Focus mode's allow list.
- Sign out and sign back in to refresh the push token registered with the server.
- Self-hosted users: confirm push notifications are configured on your Cast Operations instance (see the self-hosted [Push Notifications](/docs/self-hosted/push-notifications) guide).

**Face ID / Touch ID not working:**

- Make sure biometrics are enrolled in **Settings → Face ID & Passcode** or **Settings → Touch ID & Passcode**.
- Re-enable biometric unlock from the **Settings** screen inside the Cast Operations On-Call app.

**App crashes on launch:**

- Update to the latest version from the App Store.
- Restart your device.
- If the issue persists, delete and reinstall the app, then sign in again.

## Support

If you still need help, reach out through your Cast Operations dashboard or open an issue on our [GitHub repository](https://github.com/autonomy-cloud/operations).
