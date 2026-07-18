# Installatiegids voor Windows

Installeer Cast Operations als desktopapplicatie op Windows voor uitgebreide monitoring en incidentbeheer.

## Installatiemethoden

### Methode 1: Microsoft Edge (aanbevolen)

Edge biedt de beste Windows PWA-integratie met native functies.

1. **Cast Operations openen in Edge**

   - Start de Microsoft Edge-browser
   - Navigeer naar de URL van uw Cast Operations-instantie
   - Meld u aan bij uw Cast Operations-account
   - Wacht tot de pagina volledig is geladen

2. **App installeren**

   - Zoek het **installatiepictogram** (⊞) in de adresbalk
   - Klik op de knop **"Cast Operations installeren"**
   - Of klik op het **menu met drie puntjes** → **Apps** → **Deze site installeren als app**

3. **Installatie aanpassen**

   - **App-naam**: Pas aan indien gewenst (standaard: Cast Operations)
   - **Startmenu**: Kies of u wilt toevoegen aan Startmenu
   - **Taakbalk**: Optie om vast te zetten aan taakbalk
   - **Bureaublad**: Bureaubladsnelkoppeling aanmaken

4. **Installatie voltooien**
   - Klik op **"Installeren"** om te voltooien
   - Cast Operations opent in een eigen venster
   - Terug te vinden in het Startmenu onder geïnstalleerde apps

### Methode 2: Google Chrome

Chrome biedt uitstekende PWA-ondersteuning met uitgebreide desktopintegratie.

1. **Cast Operations openen in Chrome**

   - Start Google Chrome
   - Ga naar uw Cast Operations-instantie
   - Zorg dat u bent aangemeld
   - Laat de pagina volledig laden

2. **Installeren via adresbalk**

   - Zoek het **installatiepictogram** (⊞) in de adresbalk
   - Klik op **"Cast Operations installeren"**
   - Of gebruik het menu: **drie puntjes** → **Meer hulpmiddelen** → **Snelkoppeling maken**

3. **Installatieopties**

   - Vink **"Als venster openen"** aan voor een app-achtige ervaring
   - Pas de app-naam aan indien gewenst
   - Klik op **"Installeren"** of **"Maken"**

4. **App starten**
   - Zoek Cast Operations in het Windows Startmenu
   - Of start via bureaubladsnelkoppeling
   - App opent in een eigen venster

### Methode 3: Firefox

Firefox ondersteunt PWA-installatie met basisdesktopintegratie.

1. **Cast Operations openen in Firefox**

   - Start de Firefox-browser
   - Navigeer naar de Cast Operations-URL
   - Voltooi het aanmeldproces

2. **PWA installeren**
   - Zoek de **installatieprompt** of banner
   - Of klik op **menu** → **Installeren**
   - Klik indien beschikbaar op het equivalent van **"Aan startscherm toevoegen"**

### Opstarticonfiguratie

1. **Automatisch starten**: Configureer Cast Operations om te starten met Windows
   - Klik met rechtermuisknop op taakbalk → Taakbeheer → Opstarten
   - Schakel Cast Operations in indien gewenst
2. **Standaardgrootte**: Stel de gewenste venstergrootte en -positie in

### Meldingsinstellingen

1. **Windows-meldingen**

   - Instellingen → Systeem → Meldingen en acties
   - Zoek Cast Operations en configureer meldingsvoorkeuren
   - Schakel bannermeldingen in voor incidenten

2. **Focus-assistent**
   - Configureer de instellingen voor Niet storen
   - Sta kritieke meldingen van Cast Operations toe
   - Stel prioriteitsniveaus in voor verschillende meldingstypes

## Probleemoplossing

### Installatieproblemen

**Installatieknop verschijnt niet:**

```
Oplossingen:
1. Zorg dat u Edge of Chrome gebruikt (aanbevolen browsers)
2. Verifieer HTTPS-verbinding naar Cast Operations-instantie
3. Browsercache en cookies wissen
4. Browser bijwerken naar de nieuwste versie
5. Controleer of aan de PWA-vereisten op de server is voldaan
6. Browserextensies tijdelijk uitschakelen
```

**Installatie mislukt of crasht:**

```
Oplossingen:
1. Browser uitvoeren als administrator
2. Controleer de instellingen voor Gebruikersaccountbeheer (UAC) van Windows
3. Zorg voor voldoende schijfruimte (minimaal 100 MB)
4. Antivirussoftware tijdelijk uitschakelen
5. Browsergegevens volledig wissen
6. Windows herstarten en opnieuw proberen
```

**App verschijnt niet in Startmenu:**

```
Oplossingen:
1. Zoek naar "Cast Operations" in Windows-zoekfunctie
2. Controleer of er onder een andere naam is geïnstalleerd
3. Zoek in de sectie "Onlangs toegevoegd" apps
4. Herinstalleer en zorg dat "Toevoegen aan Startmenu" is aangevinkt
5. Maak handmatig een snelkoppeling aan indien nodig
```

### Meldingsproblemen

**Windows-meldingen werken niet:**

```
Oplossingen:
1. Windows Instellingen → Systeem → Meldingen en acties
2. Schakel meldingen in voor Cast Operations
3. Controleer de instellingen voor Focus-assistent
4. Zorg voor meldingsmachtigingen in Cast Operations
5. Test eerst met een eenvoudige melding
```

## Verwijderen

### Volledig verwijderen

1. **Via Windows Instellingen**

   - Instellingen → Apps → Apps en functies
   - Zoek naar "Cast Operations"
   - Klik en selecteer "Verwijderen"

2. **Via browser**

   - Open Edge/Chrome
   - Ga naar edge://apps/ of chrome://apps/
   - Zoek Cast Operations
   - Klik op opties → Verwijderen

3. **Via Startmenu**
   - Klik met rechtermuisknop op Cast Operations in Startmenu
   - Selecteer "Verwijderen"
   - Bevestig verwijdering

## Updates en onderhoud

### Automatische updates

- Cast Operations PWA wordt automatisch bijgewerkt wanneer online
- Geen handmatige tussenkomst vereist
- Updates worden direct toegepast na herstart
- Kritieke patches worden onmiddellijk geïmplementeerd
