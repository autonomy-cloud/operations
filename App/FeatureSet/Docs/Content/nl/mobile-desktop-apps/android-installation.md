# Android Installatiehandleiding

Installeer de **Cast Operations On-Call** native Android app vanuit de Google Play Store, of laad de APK rechtstreeks (sideload) op apparaten zonder Google Play.

## Vereisten

- Android telefoon of tablet met **Android 8.0 (Oreo) of later**
- Een actief Cast Operations account (of de URL van uw zelf-gehoste Cast Operations instantie)
- Internetverbinding voor het inloggen en het ontvangen van pushmeldingen

## Optie 1: Installeren vanuit Google Play (Aanbevolen)

1. Open de **Google Play Store** op uw apparaat.
2. Zoek naar **"Cast Operations On-Call"**, of open deze link op uw apparaat:
   [https://github.com/autonomy-cloud/operations/releases](https://github.com/autonomy-cloud/operations/releases)
3. Tik op **Installeren**.
4. Zodra de app is geïnstalleerd, tikt u op **Openen** of start u **Cast Operations On-Call** vanuit uw app-lade.

## Optie 2: Installeer de APK Rechtstreeks

Voor apparaten zonder Google Play (bijvoorbeeld GrapheneOS, /e/OS of Huawei apparaten), installeert u de officiële APK vanuit GitHub Releases:

1. Open op uw Android apparaat deze link:
   [https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk](https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk)
2. Wanneer daarom wordt gevraagd, sta uw browser toe om onbekende apps te installeren:
   **Instellingen → Apps → \[Uw browser\] → Onbekende apps installeren → Toestaan vanuit deze bron**.
3. Open de gedownloade APK en tik op **Installeren**.
4. Start **Cast Operations On-Call** vanuit uw app-lade.

De APK is gebouwd en ondertekend door Cast Operations vanuit dezelfde bron als de Play Store-release. App-updates zijn niet automatisch bij sideloading — download de nieuwste APK via de bovenstaande link wanneer er een nieuwe versie is uitgebracht.

## Eerste Start en Inloggen

1. **Server URL**
   - Als u Cast Operations Cloud gebruikt, laat dan de standaardwaarde `https://latticeruntime.com` staan.
   - Als u zelf host, voer dan de URL van uw Cast Operations instantie in (bijv. `https://operations.example.com`).
   - De app controleert of de server bereikbaar is voordat u doorgaat.
2. **Inloggen**
   - Voer het e-mailadres en wachtwoord van uw Cast Operations account in.
   - Schakel optioneel **biometrische ontgrendeling** (vingerafdruk) in voor snellere ontgrendelingen bij latere starts.
3. **Meldingen Toestaan**
   - Tik op **Toestaan** wanneer daarom wordt gevraagd, zodat de app oproepen voor wachtdiensten, incidentmeldingen en bevestigingen kan afleveren.

## Pushmeldingen

Pushmeldingen worden afgeleverd via Firebase Cloud Messaging (FCM) via Expo Push. Om ervoor te zorgen dat oproepen u betrouwbaar bereiken tijdens een wachtdienst:

1. Open **Instellingen → Apps → Cast Operations On-Call → Meldingen** en bevestig dat alle categorieën zijn ingeschakeld.
2. Open **Instellingen → Apps → Cast Operations On-Call → Batterij** en kies **Onbeperkt** (of schakel batterijoptimalisatie uit) zodat het besturingssysteem achtergrond-pushes niet vertraagt.
3. Sta toe dat de app op de achtergrond draait en schakel eventuele "Databesparing" beperkingen ervoor uit.
4. Als u Samsung apparaten gebruikt, schakel dan ook **Instellingen → Apparaatonderhoud → Batterij → Limieten voor achtergrondgebruik** uit voor Cast Operations On-Call.
5. Voeg Cast Operations On-Call toe aan eventuele uitzonderingslijsten voor **Niet storen** zodat oproepen blijven overgaan tijdens uw wachtdienst.

## Updates

**Google Play:**

- Updates worden automatisch geïnstalleerd. Om er handmatig een te activeren, opent u **Play Store → Profiel → Apps en apparaat beheren → Updates beschikbaar → Cast Operations On-Call → Bijwerken**.

**APK sideload:**

- Download de nieuwste APK opnieuw via de bovenstaande GitHub Releases-link en installeer deze over de bestaande app heen — uw gegevens, server-URL en login worden behouden.

## Verwijderen

1. **Houd ingedrukt** op het **Cast Operations On-Call** pictogram en tik vervolgens op **Verwijderen**.
2. Of open **Instellingen → Apps → Cast Operations On-Call → Verwijderen**.
3. Bevestig om de app te verwijderen.

Uw Cast Operations account en wachtdienstroosters worden aan de serverkant opgeslagen en worden niet verwijderd wanneer u de app verwijdert.

## Probleemoplossing

**"Netwerkfout" bij het inloggen:**

- Controleer of de **Server URL** correct is en bereikbaar is vanaf uw apparaat.
- Als u zich op een bedrijfsnetwerk of VPN bevindt, zorg er dan voor dat de Cast Operations instantie toegankelijk is.
- Bevestig dat de server via HTTPS met een geldig certificaat wordt aangeboden.

**Geen pushmeldingen ontvangen:**

- Bevestig dat meldingen zijn ingeschakeld bij **Instellingen → Apps → Cast Operations On-Call → Meldingen**.
- Schakel batterijoptimalisatie uit voor Cast Operations On-Call (zie Pushmeldingen hierboven).
- Zorg ervoor dat Niet storen is uitgeschakeld, of dat Cast Operations On-Call op de uitzonderingslijst staat.
- Log uit en log opnieuw in om het push-token dat bij de server is geregistreerd te vernieuwen.
- Zelf-gehoste gebruikers: bevestig dat pushmeldingen zijn geconfigureerd op uw Cast Operations instantie (zie de zelf-gehoste handleiding [Pushmeldingen](/docs/self-hosted/push-notifications)).

**Biometrische ontgrendeling werkt niet:**

- Schrijf een vingerafdruk in bij **Instellingen → Beveiliging → Vingerafdruk**.
- Schakel biometrische ontgrendeling opnieuw in vanuit het scherm **Instellingen** binnen de Cast Operations On-Call app.

**APK-installatie geblokkeerd:**

- U moet de browser toestemming geven om onbekende apps te installeren (zie Optie 2 hierboven).
- Sommige providers of bedrijfsapparaatprofielen blokkeren sideloading volledig; gebruik in dat geval in plaats daarvan de Google Play versie.

**App crasht bij het opstarten:**

- Werk bij naar de nieuwste versie via Google Play of de nieuwste APK.
- Start uw apparaat opnieuw op.
- Als het probleem aanhoudt, verwijder en herinstalleer de app, en log dan opnieuw in.

## Ondersteuning

Als u nog hulp nodig hebt, neem dan contact op via uw Cast Operations dashboard of open een issue op onze [GitHub repository](https://github.com/autonomy-cloud/operations).
