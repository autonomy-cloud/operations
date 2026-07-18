# Windows-Installationsanleitung

Installieren Sie Cast Operations als Desktop-Anwendung unter Windows für umfassendes Monitoring und Incident-Management.

## Installationsmethoden

### Methode 1: Microsoft Edge (Empfohlen)

Edge bietet die beste Windows-PWA-Integration mit nativen Funktionen.

1. **Cast Operations in Edge öffnen**

   - Microsoft Edge-Browser starten
   - Zur URL Ihrer Cast Operations-Instanz navigieren
   - Bei Ihrem Cast Operations-Konto anmelden
   - Auf vollständiges Laden der Seite warten

2. **App installieren**

   - Nach dem **Installations-Symbol** (⊞) in der Adressleiste suchen
   - Auf die Schaltfläche **„Cast Operations installieren"** klicken
   - Oder auf **Drei-Punkte-Menü** → **Apps** → **Diese Website als App installieren** klicken

3. **Installation anpassen**

   - **App-Name**: Bei Wunsch ändern (Standard: Cast Operations)
   - **Startmenü**: Wählen, ob zum Startmenü hinzufügen
   - **Taskleiste**: Option zum Anheften an die Taskleiste
   - **Desktop**: Desktop-Verknüpfung erstellen

4. **Installation abschließen**
   - Auf **„Installieren"** klicken, um abzuschließen
   - Cast Operations öffnet sich in einem eigenen Fenster
   - Im Startmenü unter installierten Apps zu finden

### Methode 2: Google Chrome

Chrome bietet exzellente PWA-Unterstützung mit umfangreicher Desktop-Integration.

1. **Cast Operations in Chrome öffnen**

   - Google Chrome starten
   - Zur Cast Operations-Instanz gehen
   - Angemeldet sein
   - Vollständiges Laden der Seite abwarten

2. **Über Adressleiste installieren**

   - Nach **Installations-Symbol** (⊞) in der Adressleiste suchen
   - Auf **„Cast Operations installieren"** klicken
   - Oder Menü: **Drei Punkte** → **Weitere Tools** → **Verknüpfung erstellen** verwenden

3. **Installationsoptionen**

   - **„Als Fenster öffnen"** für app-ähnliches Erlebnis aktivieren
   - App-Namen nach Wunsch anpassen
   - Auf **„Installieren"** oder **„Erstellen"** klicken

4. **App starten**
   - Cast Operations im Windows-Startmenü finden
   - Oder über Desktop-Verknüpfung starten
   - App öffnet sich in einem eigenen Fenster

### Methode 3: Firefox

Firefox unterstützt die PWA-Installation mit grundlegender Desktop-Integration.

1. **Cast Operations in Firefox öffnen**

   - Firefox-Browser starten
   - Zur Cast Operations-URL navigieren
   - Anmeldeprozess abschließen

2. **PWA installieren**
   - Nach **Installationsaufforderung** oder -Banner suchen
   - Oder auf **Menü** → **Installieren** klicken
   - Falls verfügbar, auf entsprechendes „Zum Home-Bildschirm hinzufügen" klicken

### Startkonfiguration

1. **Autostart**: Cast Operations so konfigurieren, dass es mit Windows startet
   - Rechtsklick auf Taskleiste → Task-Manager → Start
   - Cast Operations bei Bedarf aktivieren
2. **Standardgröße**: Bevorzugte Fenstergröße und -position einstellen

### Benachrichtigungseinstellungen

1. **Windows-Benachrichtigungen**

   - Einstellungen → System → Benachrichtigungen & Aktionen
   - Cast Operations finden und Benachrichtigungspräferenzen konfigurieren
   - Banner-Benachrichtigungen für Incidents aktivieren

2. **Fokus-Assistent**
   - „Nicht stören"-Einstellungen konfigurieren
   - Kritische Cast Operations-Benachrichtigungen erlauben
   - Prioritätsstufen für verschiedene Benachrichtigungstypen festlegen

## Fehlerbehebung

### Installationsprobleme

**Installationsschaltfläche erscheint nicht:**

```
Lösungen:
1. Sicherstellen, dass Edge oder Chrome verwendet wird (empfohlene Browser)
2. HTTPS-Verbindung zur Cast Operations-Instanz überprüfen
3. Browser-Cache und -Cookies leeren
4. Browser auf neueste Version aktualisieren
5. Prüfen, ob PWA-Anforderungen auf dem Server erfüllt sind
6. Browser-Erweiterungen vorübergehend deaktivieren
```

**Installation schlägt fehl oder stürzt ab:**

```
Lösungen:
1. Browser als Administrator ausführen
2. Windows-Benutzerkontensteuerung (UAC) prüfen
3. Ausreichend Speicherplatz sicherstellen (mindestens 100 MB)
4. Antivirensoftware vorübergehend deaktivieren
5. Browser-Daten vollständig löschen
6. Windows neu starten und erneut versuchen
```

**App erscheint nicht im Startmenü:**

```
Lösungen:
1. In der Windows-Suche nach „Cast Operations" suchen
2. Prüfen, ob unter anderem Namen installiert
3. Im Bereich „Zuletzt hinzugefügt" suchen
4. Neu installieren und sicherstellen, dass „Zum Startmenü hinzufügen" aktiviert ist
5. Falls nötig manuell Verknüpfung erstellen
```

### Benachrichtigungsprobleme

**Windows-Benachrichtigungen funktionieren nicht:**

```
Lösungen:
1. Windows-Einstellungen → System → Benachrichtigungen & Aktionen
2. Benachrichtigungen für Cast Operations aktivieren
3. Fokus-Assistent-Einstellungen prüfen
4. Benachrichtigungsberechtigungen in Cast Operations sicherstellen
5. Zunächst einfache Benachrichtigung testen
```

## Deinstallation

### Vollständige Entfernung

1. **Methode über Windows-Einstellungen**

   - Einstellungen → Apps → Apps & Features
   - Nach „Cast Operations" suchen
   - Klicken und „Deinstallieren" auswählen

2. **Browser-Methode**

   - Edge/Chrome öffnen
   - Zu edge://apps/ oder chrome://apps/ gehen
   - Cast Operations finden
   - Optionen → Deinstallieren klicken

3. **Startmenü-Methode**
   - Rechtsklick auf Cast Operations im Startmenü
   - „Deinstallieren" auswählen
   - Entfernung bestätigen

## Updates und Wartung

### Automatische Updates

- Cast Operations PWA aktualisiert sich automatisch bei Online-Verbindung
- Kein manueller Eingriff erforderlich
- Updates werden sofort nach dem Neustart angewendet
- Kritische Patches werden sofort bereitgestellt
