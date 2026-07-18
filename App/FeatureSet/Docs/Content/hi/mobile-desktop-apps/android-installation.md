# Android Installation Guide

Google Play Store से **Cast Operations On-Call** native Android app install करें, या Google Play के बिना devices पर सीधे APK sideload करें।

## आवश्यकताएं

- **Android 8.0 (Oreo) या बाद का version** चलाने वाला Android phone या tablet
- एक active Cast Operations account (या आपके self-hosted Cast Operations instance का URL)
- sign-in के लिए और push notifications प्राप्त करने के लिए Internet connection

## Option 1: Google Play से Install करें (अनुशंसित)

1. अपने device पर **Google Play Store** open करें।
2. **"Cast Operations On-Call"** search करें, या अपने device पर यह link open करें:
   [https://github.com/autonomy-cloud/operations/releases](https://github.com/autonomy-cloud/operations/releases)
3. **Install** पर tap करें।
4. एक बार install हो जाने पर, **Open** पर tap करें या अपने app drawer से **Cast Operations On-Call** launch करें।

## Option 2: APK को सीधे Install करें

Google Play के बिना devices के लिए (उदाहरण के लिए, GrapheneOS, /e/OS, या Huawei devices), GitHub Releases से official APK install करें:

1. अपने Android device पर, यह link open करें:
   [https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk](https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk)
2. प्रॉम्प्ट होने पर, अपने browser को unknown apps install करने की अनुमति दें:
   **Settings → Apps → \[आपका browser\] → Install unknown apps → Allow from this source**।
3. downloaded APK को open करें और **Install** पर tap करें।
4. अपने app drawer से **Cast Operations On-Call** launch करें।

APK को Cast Operations द्वारा Play Store release के समान source से built और signed किया गया है। sideload करते समय app updates automatic नहीं होते — जब कोई नया version release हो तो ऊपर दिए गए link से latest APK download करें।

## पहला Launch और Sign-in

1. **Server URL**
   - यदि आप Cast Operations Cloud का उपयोग कर रहे हैं, तो default `https://visca.ai` को छोड़ दें।
   - यदि आप self-hosting कर रहे हैं, तो अपने Cast Operations instance का URL enter करें (उदाहरण के लिए, `https://operations.example.com`)।
   - app आगे बढ़ने से पहले verify करता है कि server reachable है।
2. **Sign In**
   - अपने Cast Operations account के लिए email और password enter करें।
   - बाद के launches पर तेज़ unlock के लिए वैकल्पिक रूप से **biometric unlock** (fingerprint) enable करें।
3. **Notifications Allow करें**
   - prompt होने पर, **Allow** पर tap करें ताकि app on-call pages, incident alerts, और acknowledgements deliver कर सके।

## Push Notifications

Push notifications, Expo Push के माध्यम से Firebase Cloud Messaging (FCM) के द्वारा deliver होते हैं। यह सुनिश्चित करने के लिए कि on-call रहते हुए pages आपको reliably पहुंचें:

1. **Settings → Apps → Cast Operations On-Call → Notifications** open करें और पुष्टि करें कि सभी categories enabled हैं।
2. **Settings → Apps → Cast Operations On-Call → Battery** open करें और **Unrestricted** चुनें (या battery optimization disable करें) ताकि OS background pushes में delay न करे।
3. app को background में run करने की अनुमति दें और इसके लिए किसी भी "Data Saver" restrictions को disable करें।
4. यदि आप Samsung devices का उपयोग करते हैं, तो Cast Operations On-Call के लिए **Settings → Device care → Battery → Background usage limits** भी बंद कर दें।
5. किसी भी **Do Not Disturb** exception lists में Cast Operations On-Call add करें ताकि आपकी on-call shift के दौरान भी pages ring करते रहें।

## Updates

**Google Play:**

- Updates automatically install होते हैं। manually trigger करने के लिए, **Play Store → Profile → Manage apps & device → Updates available → Cast Operations On-Call → Update** open करें।

**APK sideload:**

- ऊपर दिए गए GitHub Releases link से latest APK फिर से download करें और existing app के ऊपर install करें — आपका data, server URL, और login सुरक्षित रहता है।

## Uninstall

1. **Cast Operations On-Call** icon को **Long-press** करें, फिर **Uninstall** पर tap करें।
2. या **Settings → Apps → Cast Operations On-Call → Uninstall** open करें।
3. app को हटाने की पुष्टि करें।

आपका Cast Operations account और on-call schedules server-side stored होते हैं और जब आप app uninstall करते हैं तो हटाए नहीं जाते।

## Troubleshooting

**Sign in करते समय "Network Error":**

- verify करें कि **Server URL** सही है और आपके device से reachable है।
- यदि आप corporate network या VPN पर हैं, तो सुनिश्चित करें कि Cast Operations instance accessible है।
- पुष्टि करें कि server HTTPS पर valid certificate के साथ serve हो रहा है।

**Push notifications प्राप्त नहीं हो रहे:**

- पुष्टि करें कि notifications **Settings → Apps → Cast Operations On-Call → Notifications** पर enabled हैं।
- Cast Operations On-Call के लिए battery optimization disable करें (ऊपर Push Notifications देखें)।
- सुनिश्चित करें कि Do Not Disturb बंद है, या Cast Operations On-Call exception list पर है।
- server के साथ registered push token refresh करने के लिए sign out करें और फिर से sign in करें।
- Self-hosted users: पुष्टि करें कि push notifications आपके Cast Operations instance पर configure हैं (self-hosted [Push Notifications](/docs/self-hosted/push-notifications) guide देखें)।

**Biometric unlock काम नहीं कर रहा:**

- **Settings → Security → Fingerprint** में एक fingerprint enrol करें।
- Cast Operations On-Call app के अंदर **Settings** screen से biometric unlock को फिर से enable करें।

**APK install block हो रहा है:**

- आपको unknown apps install करने के लिए browser को permission देनी होगी (ऊपर Option 2 देखें)।
- कुछ carriers या enterprise device profiles sideloading को पूरी तरह से block करते हैं; उस स्थिति में, Google Play version का उपयोग करें।

**App launch पर crash होता है:**

- Google Play से या latest APK से latest version पर update करें।
- अपना device restart करें।
- यदि समस्या बनी रहती है, तो uninstall करके फिर से install करें, फिर sign in करें।

## Support

यदि आपको अभी भी सहायता चाहिए, तो अपने Cast Operations dashboard के माध्यम से संपर्क करें या हमारे [GitHub repository](https://github.com/autonomy-cloud/operations) पर एक issue open करें।
