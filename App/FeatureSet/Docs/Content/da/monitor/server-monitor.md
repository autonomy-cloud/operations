# Server / VM Monitor

Server- og VM-overvågning giver dig mulighed for at overvåge sundheden og ydeevnen af dine servere, virtuelle maskiner og anden infrastruktur ved at installere en letvægtsagent, der rapporterer systemmetrikker til Cast Operations.

## Oversigt

Servermonitorer bruger en infrastrukturagent installeret på dine servere til at indsamle og rapportere systemmetrikker. Dette giver dig mulighed for at:

- Overvåge server-oppetid og -tilgængelighed
- Spore CPU-, hukommelses- og diskforbrug
- Overvåge kørende processer
- Sætte advarsler baseret på ressourceudnyttelsesgrænseværdier
- Opdage infrastrukturproblemer, inden de påvirker dine tjenester

## Oprettelse af en Servermonitor

1. Gå til **Monitorer** i Cast Operations-dashboardet
2. Klik på **Opret monitor**
3. Vælg **Server / VM** som monitortype
4. En **Hemmelig nøgle** genereres til denne monitor – du skal bruge den til at konfigurere agenten
5. Følg installationsinstruktionerne for at opsætte agenten på din server

## Installation af infrastrukturagenten

Cast Operations infrastrukturagenten er en letvægts Go-baseret dæmon, der indsamler systemmetrikker og sender dem til Cast Operations hvert 30. sekund. Den understøtter Linux, macOS og Windows.

### Linux / macOS

```bash
# Installer agenten
curl -sSL https://latticeruntime.com/docs/static/scripts/infrastructure-agent/install.sh | sudo bash

# Konfigurer agenten
sudo cast-operations-infrastructure-agent configure --secret-key=YOUR_SECRET_KEY --cast-operations-url=https://latticeruntime.com

# Start agenten
sudo cast-operations-infrastructure-agent start
```

Erstat `YOUR_SECRET_KEY` med den hemmelige nøgle vist i din monitors indstillinger, og `https://latticeruntime.com` med din Cast Operations-instans-URL, hvis du selvhoster.

### Windows

1. Download den seneste agent fra [GitHub Releases](https://github.com/autonomy-cloud/operations/releases/latest)
   - `cast-operations-infrastructure-agent_windows_amd64.zip` til x64-systemer
   - `cast-operations-infrastructure-agent_windows_arm64.zip` til ARM64-systemer
2. Udpak zip-filen
3. Åbn Kommandoprompt som administrator og kør:

```bash
# Konfigurer agenten
cast-operations-infrastructure-agent configure --secret-key=YOUR_SECRET_KEY --cast-operations-url=https://latticeruntime.com

# Start agenten
cast-operations-infrastructure-agent start
```

### Proxyunderstøttelse

Hvis din server opretter forbindelse til internettet via en proxy, kan du konfigurere agenten til at bruge den:

```bash
sudo cast-operations-infrastructure-agent configure --secret-key=YOUR_SECRET_KEY --cast-operations-url=https://latticeruntime.com --proxy-url=http://proxy.example.com:8080
```

## Agentkommandoer

Infrastrukturagenten understøtter følgende kommandoer:

| Kommando    | Beskrivelse                                                 |
| ----------- | ----------------------------------------------------------- |
| `configure` | Konfigurer agenten med din hemmelige nøgle og Cast Operations-URL |
| `start`     | Start agentservicen                                         |
| `stop`      | Stop agentservicen                                          |
| `restart`   | Genstart agentservicen                                      |
| `status`    | Vis den aktuelle servicestatus                              |
| `logs`      | Se agentlogs (brug `-n` til linjeantal, `-f` til at følge)  |
| `uninstall` | Afinstaller agentservicen                                   |

## Indsamlede metrikker

Agenten indsamler følgende metrikker fra din server:

### CPU

- **CPU-udnyttelsesprocent** – Samlet CPU-udnyttelse som en procentdel
- **CPU-kerner** – Antal CPU-kerner

### Hukommelse

- **Samlet hukommelse** – Samlet tilgængelig hukommelse
- **Brugt hukommelse** – Hukommelse i øjeblikket i brug
- **Ledig hukommelse** – Tilgængelig ledig hukommelse
- **Hukommelsesudnyttelsesprocent** – Hukommelsesudnyttelse som en procentdel

### Disk

For hvert monteret disk/volume:

- **Samlet diskplads** – Samlet kapacitet af disken
- **Brugt diskplads** – Plads i øjeblikket i brug
- **Ledig diskplads** – Tilgængelig ledig plads
- **Diskudnyttelsesprocent** – Diskudnyttelse som en procentdel
- **Disksti** – Monteringssti for disken

### Processer

- **Procesnavn** – Navn på den kørende proces
- **Proces-ID (PID)** – Procesidentifikator
- **Proceskommando** – Fuld kommando brugt til at starte processen

## Overvågningskriterier

Du kan konfigurere kriterier til at afgøre, hvornår din server betragtes som online, forringet eller offline.

### Tilgængelige kontroltyper

| Kontroltype                   | Beskrivelse                                             |
| ----------------------------- | ------------------------------------------------------- |
| Er online                     | Om serveragenten rapporterer (baseret på hjerteslag)    |
| CPU-udnyttelsesprocent        | Aktuel CPU-udnyttelsesprocent                           |
| Hukommelsesudnyttelsesprocent | Aktuel hukommelsesudnyttelsesprocent                    |
| Diskudnyttelsesprocent        | Aktuel diskudnyttelsesprocent (for en specifik disksti) |
| Serverprocesnavn              | Kontroller, om en proces med et specifikt navn kører    |
| Serverproceskommando          | Kontroller, om en proces med en specifik kommando kører |
| Serverprocespid               | Kontroller, om en proces med et specifikt PID kører     |

### Filtertyper

For numeriske metrikker (CPU, hukommelse, disk):

- **Større end** – Værdien overskrider en grænseværdi
- **Mindre end** – Værdien er under en grænseværdi
- **Større end eller lig med** – Værdien er ved eller over en grænseværdi
- **Mindre end eller lig med** – Værdien er ved eller under en grænseværdi
- **Evaluer over tid** – Evaluer ved hjælp af aggregering (Gennemsnit, Sum, Maksimum, Minimum, Alle værdier, Enhver værdi) over et tidsvindue

For procestjek:

- **Eksekveres** – Processen kører i øjeblikket
- **Eksekveres ikke** – Processen kører ikke

### Eksempelkriterier

#### Markér server som offline, hvis agent holder op med at rapportere

- **Kontroller på**: Er online
- **Filtertype**: Falsk

#### Advarsel, når CPU-forbrug overskrider 90%

- **Kontroller på**: CPU-udnyttelsesprocent
- **Filtertype**: Større end
- **Værdi**: 90

#### Advarsel, når diskforbrug overskrider 85%

- **Kontroller på**: Diskudnyttelsesprocent
- **Disksti**: `/`
- **Filtertype**: Større end
- **Værdi**: 85

#### Advarsel, når hukommelsesforbrug overskrider 80%

- **Kontroller på**: Hukommelsesudnyttelsesprocent
- **Filtertype**: Større end
- **Værdi**: 80

#### Advarsel, hvis en kritisk proces stopper med at køre

- **Kontroller på**: Serverprocesnavn
- **Filtertype**: Eksekveres ikke
- **Værdi**: `nginx`

## Fejlfinding

### Agent rapporterer ikke

- Bekræft, at agenten kører: `sudo cast-operations-infrastructure-agent status`
- Kontroller agentlogs: `sudo cast-operations-infrastructure-agent logs -n 50`
- Bekræft, at den hemmelige nøgle er korrekt
- Sørg for, at serveren kan nå din Cast Operations-instans-URL
- Kontroller firewallregler, der tillader udgående HTTPS-forbindelser

### Høj ressourceforbrug af agent

Agenten er designet til at være letvægt. Hvis du bemærker høj ressourceforbrug:

- Genstart agenten: `sudo cast-operations-infrastructure-agent restart`
- Kontroller agentlogs for fejl

### Proxyproblemer

- Bekræft, at proxy-URL og port er korrekte
- Sørg for, at proxyen tillader forbindelser til din Cast Operations-instans
- Rekonfigurer med: `sudo cast-operations-infrastructure-agent configure --proxy-url=http://proxy:port --secret-key=YOUR_KEY --cast-operations-url=YOUR_URL`

## Bedste praksis

1. **Sæt meningsfulde grænseværdier** – Konfigurer forringede og offline kriterier, der matcher din servers normale driftsomfang
2. **Overvåg kritiske processer** – Brug procesovervågning til at sikre, at essentielle tjenester som webservere og databaser altid kører
3. **Overvåg diskforbrug proaktivt** – Diskpladsproblemer kan medføre applikationsfejl; sæt advarsler, inden diskene er fulde
4. **Brug "Evaluer over tid"** – For metrikker som CPU, der kan have kortvarige spidser, brug tidsbaseret aggregering for at undgå falske advarsler
5. **Hold agenten opdateret** – Opdater periodisk infrastrukturagenten for at få de seneste forbedringer og rettelser
