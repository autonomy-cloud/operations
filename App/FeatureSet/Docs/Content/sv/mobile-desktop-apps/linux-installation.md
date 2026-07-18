# Installationsguide för Linux

Installera Cast Operations som en skrivbordsapplikation på Linux-distributioner för heltäckande övervakning och incidenthantering.

## Installationsmetoder

### Metod 1: Google Chrome/Chromium (rekommenderas)

Chrome och Chromium ger den bästa Linux PWA-upplevelsen med inbyggd skrivbordsintegration.

#### PWA-installationssteg:

1. **Öppna Cast Operations i Chrome/Chromium**

   - Starta din webbläsare
   - Navigera till URL:en för din Cast Operations-instans
   - Logga in på ditt Cast Operations-konto
   - Vänta tills sidan laddas helt

2. **Installera PWA**

   - Leta efter **installationsikonen** (⊞) i adressfältet
   - Klicka på **"Installera Cast Operations"**
   - Eller använd **Chrome-menyn** (⋮) → **Fler verktyg** → **Skapa genväg**

3. **Installationsalternativ**

   - Markera **"Öppna som fönster"** för inbyggd appupplevelse
   - Anpassa appnamnet om du vill
   - Välj att skapa skrivbordsgenväg
   - Klicka på **"Installera"** eller **"Skapa"**

4. **Starta appen**
   - Hitta Cast Operations i programstartaren
   - Eller använd skrivbordsgenvägen
   - Appen öppnas i ett dedikerat fönster

### Metod 2: Firefox

Firefox stöder PWA-installation på Linux med grundläggande skrivbordsintegration.

1. **PWA-installation**:
   - Öppna Cast Operations i Firefox
   - Leta efter installationsbanners eller prompt
   - Klicka på **"Installera"** när det är tillgängligt
   - Observera: Begränsad skrivbordsintegration jämfört med Chrome

### Metod 3: Microsoft Edge

Edge är tillgänglig på Linux och ger bra PWA-stöd.

1. **Installera PWA**: Följ samma steg som Chrome-metoden

## Uppdateringar och underhåll

### Automatiska uppdateringar

Cast Operations PWA uppdateras automatiskt:

- Uppdateringar tillämpas när webbläsaren uppdaterar appen
- Kritiska säkerhetsuppdateringar driftsätts omedelbart
- Ingen manuell åtgärd krävs

## Avinstallation

### Webbläsarspecifik borttagning

```bash
# Chrome PWA-hantering
google-chrome chrome://apps/

# Ta bort all Cast Operations-relaterad webbläsardata
rm -rf ~/.config/google-chrome/Default/Local\ Storage/leveldb/
rm -rf ~/.cache/google-chrome/Default/
```

## Uppdateringar och underhåll

### Automatiska uppdateringar

Cast Operations PWA uppdateras automatiskt:

- Uppdateringar tillämpas när webbläsaren uppdaterar appen
- Kritiska säkerhetsuppdateringar driftsätts omedelbart
- Ingen manuell åtgärd krävs
