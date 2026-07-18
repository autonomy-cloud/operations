# Distribuer Cast Operations helt gratis med Docker Compose

Hvis du foretrekker å hoste Cast Operations på din egen server, kan du bruke Docker Compose til å distribuere en enkeltserverinstans av Cast Operations på Debian, Ubuntu eller RHEL. Dette alternativet gir deg mer kontroll og tilpasning over instansen din, men krever også mer tekniske ferdigheter og ressurser for å distribuere og vedlikeholde det.

#### Velg systemkrav

Avhengig av bruk og budsjett kan du velge mellom ulike systemkrav for serveren din. For optimal ytelse anbefaler vi å bruke Cast Operations med:

- **Anbefalte systemkrav**
  - 16 GB RAM
  - 8 kjerner
  - 400 GB disk
  - Ubuntu 22.04
  - Docker og Docker Compose installert
- **Hjemmelab / minimumskrav**
  - Hvis du vil kjøre Cast Operations til personlig eller eksperimentell bruk i et hjemmemiljø (noen av brukerne våre har til og med installert det på RaspberyPi), kan du bruke hjemmelabkravene:
    - 8 GB RAM
    - 4 kjerner
    - 20 GB disk
    - Docker og Docker Compose installert

#### Forutsetninger for enkeltserverdistribusjon

Installasjonsveiledning: [https://youtu.be/j1SWmMW2oL4](https://youtu.be/j1SWmMW2oL4)

Før du starter distribusjonsprosessen, sørg for at du har:

- En server som kjører Debian, Ubuntu eller RHEL-avledet distribusjon
- Docker og Docker Compose installert på serveren din

For å installere Cast Operations:

```
# Klone dette repoet med bare release-grenen og cd inn i det.
git clone --depth 1 --single-branch --branch release https://github.com/autonomy-cloud/operations.git
cd oneuptime

# Kopier config.example.env til config.env
cp config.example.env config.env

# VIKTIG: Rediger config.env-filen. Sørg for at du har tilfeldige hemmeligheter.

npm start
```

Hvis du ikke vil bruke npm eller ikke har det installert, kjør dette i stedet:

```
# Les miljøvariabler fra config.env-filen og kjør docker compose up.
(export $(grep -v '^#' config.env | xargs) && docker compose up --remove-orphans -d)

# Bruk sudo hvis du har tillatelsesproblemer med bindingsporter.
sudo bash -c "(export $(grep -v '^#' config.env | xargs) && docker compose up --remove-orphans -d)"
```

### Tilgang til Cast Operations

Cast Operations skal kjøre på: http://localhost. Du må registrere en ny konto for instansen din for å begynne å bruke den.

### Konfigurere TLS/SSL-sertifikater

Cast Operations støtter **ikke** oppsett av SSL/TLS-sertifikater. Du må konfigurere SSL/TLS-sertifikater på egen hånd.

Hvis du trenger å bruke SSL/TLS-sertifikater, følg disse trinnene:

1. Bruk en omvendt proxy som Nginx eller Caddy.
2. Bruk Let's Encrypt for å klargjøre sertifikatene.
3. Pek den omvendte proxyen mot Cast Operations-serveren.
4. Oppdater følgende innstillinger:
   - Sett miljøvariabelen `HTTP_PROTOCOL` til `https`.
   - Endre miljøvariabelen `HOST` til domenenavnet til serveren der den omvendte proxyen er hostet.

## Sjekkliste for produksjonsberedskap

Unngå ideelt sett å distribuere Cast Operations i produksjon med docker-compose. Vi anbefaler sterkt å bruke Kubernetes. Det finnes et Helm-diagram tilgjengelig for Cast Operations [her](https://artifacthub.io/packages/helm/autonomy-cloud/operations).

Hvis du likevel ønsker å distribuere Cast Operations i produksjon med docker-compose, vurder følgende:

- **SSL/TLS**: Konfigurer SSL/TLS-sertifikater. Cast Operations støtter ikke oppsett av SSL/TLS-sertifikater. Du må konfigurere SSL/TLS-sertifikater på egen hånd. Se ovenfor.
- **Hemmeligheter**: Sørg for at du har tilfeldige hemmeligheter i `config.env`-filen din. Det finnes noen standardhemmeligheter i den filen. Erstatt dem med tilfeldige lange strenger.
- **Sikkerhetskopier**: Sikkerhetskopier databasene dine (Clickhouse, Postgres) regelmessig. Redis brukes som cache og er tilstandsløs og kan trygt ignoreres.
- **Oppdateringer**: Vennligst oppdater Cast Operations regelmessig. Vi slipper oppdateringer hver dag. Vi anbefaler deg å oppdatere programvaren minst én gang i uken hvis du kjører i produksjon.

### Oppdatere Cast Operations

For å oppdatere:

```
git checkout release # Sørg for at du er på release-grenen.
git pull
npm run update
```

### Ting å vurdere

- I Docker-oppsettet vårt bruker vi en lokal loggdriver. Cast Operations, spesielt innen probe- og ingest-containerne, genererer en betydelig mengde logger. For å hindre at lagringen fylles opp, er det avgjørende å begrense logglagerplassen i Docker. For detaljerte instruksjoner om hvordan du gjør dette, se den offisielle Docker-dokumentasjonen [her](https://docs.docker.com/config/containers/logging/local/).

### Avinstallere Cast Operations

For å avinstallere Cast Operations, kjør følgende kommando:

```
npm run down
```

Dette vil stoppe og fjerne alle containere, nettverk og volumer opprettet av Cast Operations. Det vil ikke fjerne `config.env`-filen eller det klonede repositoriet.
