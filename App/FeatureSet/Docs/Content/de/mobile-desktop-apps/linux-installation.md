# Linux-Installationsanleitung

Installieren Sie Cast Operations als Desktop-Anwendung auf Linux-Distributionen für umfassendes Monitoring und Incident-Management.

## Installationsmethoden

### Methode 1: Google Chrome/Chromium (Empfohlen)

Chrome und Chromium bieten das beste Linux-PWA-Erlebnis mit nativer Desktop-Integration.

#### PWA-Installationsschritte:

1. **Cast Operations in Chrome/Chromium öffnen**

   - Browser starten
   - Zur URL Ihrer Cast Operations-Instanz navigieren
   - Bei Ihrem Cast Operations-Konto anmelden
   - Auf vollständiges Laden der Seite warten

2. **PWA installieren**

   - Nach dem **Installations-Symbol** (⊞) in der Adressleiste suchen
   - Auf **„Cast Operations installieren"** klicken
   - Oder **Chrome-Menü** (⋮) → **Weitere Tools** → **Verknüpfung erstellen** verwenden

3. **Installationsoptionen**

   - **„Als Fenster öffnen"** für natives App-Erlebnis aktivieren
   - App-Namen nach Wunsch anpassen
   - Desktop-Verknüpfungserstellung wählen
   - Auf **„Installieren"** oder **„Erstellen"** klicken

4. **App starten**
   - Cast Operations im Anwendungsstarter finden
   - Oder Desktop-Verknüpfung verwenden
   - App öffnet sich in einem eigenen Fenster

### Methode 2: Firefox

Firefox unterstützt die PWA-Installation unter Linux mit grundlegender Desktop-Integration.

1. **PWA-Installation**:
   - Cast Operations in Firefox öffnen
   - Nach Installations-Banner oder -Aufforderung suchen
   - Falls verfügbar auf **„Installieren"** klicken
   - Hinweis: Begrenzte Desktop-Integration im Vergleich zu Chrome

### Methode 3: Microsoft Edge

Edge ist unter Linux verfügbar und bietet gute PWA-Unterstützung.

1. **PWA installieren**: Gleiche Schritte wie bei Chrome-Methode befolgen

## Updates und Wartung

### Automatische Updates

Cast Operations PWA aktualisiert sich automatisch:

- Updates werden angewendet, wenn der Browser die App aktualisiert
- Kritische Sicherheitsupdates werden sofort bereitgestellt
- Kein manueller Eingriff erforderlich

## Deinstallation

### Browser-spezifische Entfernung

```bash
# Chrome PWA-Verwaltung
google-chrome chrome://apps/

# Alle Cast Operations-bezogenen Browser-Daten entfernen
rm -rf ~/.config/google-chrome/Default/Local\ Storage/leveldb/
rm -rf ~/.cache/google-chrome/Default/
```

## Updates und Wartung

### Automatische Updates

Cast Operations PWA aktualisiert sich automatisch:

- Updates werden angewendet, wenn der Browser die App aktualisiert
- Kritische Sicherheitsupdates werden sofort bereitgestellt
- Kein manueller Eingriff erforderlich
