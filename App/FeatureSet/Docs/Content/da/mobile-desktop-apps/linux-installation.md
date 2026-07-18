# Linux-installationsvejledning

Installer Cast Operations som en desktop-applikation på Linux-distributioner til omfattende overvågning og incident management.

## Installationsmetoder

### Metode 1: Google Chrome/Chromium (anbefalet)

Chrome og Chromium leverer den bedste Linux PWA-oplevelse med native desktop-integration.

#### PWA-installationstrin:

1. **Åbn Cast Operations i Chrome/Chromium**

   - Start din browser
   - Naviger til din Cast Operations-instans-URL
   - Log ind på din Cast Operations-konto
   - Vent på fuldstændig sideindlæsning

2. **Installer PWA**

   - Se efter **installer-ikonet** (⊞) i adresselinjen
   - Klik på **"Installer Cast Operations"**
   - Eller brug **Chrome-menuen** (⋮) → **Flere værktøjer** → **Opret genvej**

3. **Installationsindstillinger**

   - Marker **"Åbn som vindue"** for native app-oplevelse
   - Tilpas app-navn, hvis ønsket
   - Vælg oprettelse af skrivebordsgenvej
   - Klik på **"Installer"** eller **"Opret"**

4. **Start app**
   - Find Cast Operations i applikationsstarter
   - Eller brug skrivebordsgenvej
   - App åbnes i dedikeret vindue

### Metode 2: Firefox

Firefox understøtter PWA-installation på Linux med grundlæggende desktop-integration.

1. **PWA-installation**:
   - Åbn Cast Operations i Firefox
   - Se efter installationsbanner eller -prompt
   - Klik på **"Installer"**, når det er tilgængeligt
   - Bemærk: Begrænset desktop-integration sammenlignet med Chrome

### Metode 3: Microsoft Edge

Edge er tilgængeligt på Linux og leverer god PWA-understøttelse.

1. **Installer PWA**: Følg samme trin som Chrome-metoden

## Opdateringer og vedligeholdelse

### Automatiske opdateringer

Cast Operations PWA opdateres automatisk:

- Opdateringer anventes, når browseren opdaterer appen
- Kritiske sikkerhedsopdateringer deployeres øjeblikkeligt
- Ingen manuel indgriben kræves

## Afinstallation

### Browserspecifik fjernelse

```bash
# Chrome PWA-administration
google-chrome chrome://apps/

# Fjern alle Cast Operations-relaterede browserdata
rm -rf ~/.config/google-chrome/Default/Local\ Storage/leveldb/
rm -rf ~/.cache/google-chrome/Default/
```

## Opdateringer og vedligeholdelse

### Automatiske opdateringer

Cast Operations PWA opdateres automatisk:

- Opdateringer anventes, når browseren opdaterer appen
- Kritiske sikkerhedsopdateringer deployeres øjeblikkeligt
- Ingen manuel indgriben kræves
