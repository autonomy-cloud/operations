# Implementeer Cast Operations volledig gratis met Docker Compose

Als u er de voorkeur aan geeft Cast Operations op uw eigen server te hosten, kunt u Docker Compose gebruiken om een enkele server-instantie van Cast Operations te implementeren op Debian, Ubuntu of RHEL. Deze optie geeft u meer controle en aanpassingsmogelijkheden over uw instantie, maar vereist ook meer technische vaardigheden en resources om te implementeren en te onderhouden.

#### Kies uw systeemvereisten

Afhankelijk van uw gebruik en budget kunt u kiezen uit verschillende systeemvereisten voor uw server. Voor optimale prestaties raden wij aan Cast Operations te gebruiken met:

- **Aanbevolen systeemvereisten**
  - 16 GB RAM
  - 8 Cores
  - 400 GB Schijfruimte
  - Ubuntu 22.04
  - Docker en Docker Compose geïnstalleerd
- **Homelab / Minimale vereisten**
  - Als u Cast Operations wilt uitvoeren voor persoonlijk of experimenteel gebruik in een thuisomgeving (sommige van onze gebruikers hebben het zelfs geïnstalleerd op een RaspberryPi), kunt u de homelab-vereisten gebruiken:
    - 8 GB RAM
    - 4 Cores
    - 20 GB Schijfruimte
    - Docker en Docker Compose geïnstalleerd

#### Vereisten voor implementatie op één server

Installatietutorial: [https://youtu.be/j1SWmMW2oL4](https://youtu.be/j1SWmMW2oL4)

Voordat u begint met het implementatieproces, zorg ervoor dat u beschikt over:

- Een server met Debian, Ubuntu of een RHEL-afgeleid systeem
- Docker en Docker Compose geïnstalleerd op uw server

Om Cast Operations te installeren:

```
# Kloon deze repository met alleen de release-branch en ga er naartoe.
git clone --depth 1 --single-branch --branch release https://github.com/autonomy-cloud/operations.git
cd cast-operations

# Kopieer config.example.env naar config.env
cp config.example.env config.env

# BELANGRIJK: Bewerk het config.env-bestand. Zorg dat u willekeurige geheimen heeft.

npm start
```

Als u npm liever niet gebruikt of dit niet geïnstalleerd heeft, voer dan dit uit:

```
# Omgevingsvariabelen lezen uit config.env-bestand en docker compose up uitvoeren.
(set -a && . ./config.env && set +a && docker compose up --remove-orphans -d)

# Gebruik sudo als u problemen heeft met machtigingen bij het binden van poorten.
sudo bash -c "(set -a && . ./config.env && set +a && docker compose up --remove-orphans -d)"
```

### Cast Operations openen

Cast Operations zou moeten draaien op: http://localhost. U moet een nieuw account registreren voor uw instantie om te beginnen met gebruik.

### TLS/SSL-certificaten instellen

Cast Operations **ondersteunt niet** het instellen van SSL/TLS-certificaten. U moet SSL/TLS-certificaten zelf instellen.

Als u SSL/TLS-certificaten wilt gebruiken, volg dan deze stappen:

1. Gebruik een reverse proxy zoals Nginx of Caddy.
2. Gebruik Let's Encrypt om de certificaten te provisionen.
3. Wijs de reverse proxy naar de Cast Operations-server.
4. Werk de volgende instellingen bij:
   - Stel de omgevingsvariabele `HTTP_PROTOCOL` in op `https`.
   - Wijzig de omgevingsvariabele `HOST` naar de domeinnaam van de server waar de reverse proxy wordt gehost.

## Controlelijst voor productiebereidheid

Implementeer Cast Operations bij voorkeur niet in productie met docker-compose. Wij raden sterk aan Kubernetes te gebruiken. Er is een helm-chart beschikbaar voor Cast Operations [hier](https://artifacthub.io/packages/helm/autonomy-cloud/operations).

Als u toch Cast Operations in productie wilt implementeren met docker-compose, overweeg dan het volgende:

- **SSL/TLS**: Stel SSL/TLS-certificaten in. Cast Operations ondersteunt niet het instellen van SSL/TLS-certificaten. U moet SSL/TLS-certificaten zelf instellen. Zie hierboven.
- **Geheimen**: Zorg dat u willekeurige geheimen heeft in uw `config.env`-bestand. Er staan standaardgeheimen in dat bestand. Vervang ze door willekeurige lange tekenreeksen.
- **Back-ups**: Maak regelmatig back-ups van uw databases (Clickhouse, Postgres). Redis wordt gebruikt als cache en is stateloos en kan veilig worden genegeerd.
- **Updates**: Update Cast Operations regelmatig. Wij brengen dagelijks updates uit. Wij raden u aan de software minstens eenmaal per week bij te werken als u in productie werkt.

### Cast Operations bijwerken

Om bij te werken:

```
git checkout release # Zorg dat u op de release-branch zit.
git pull
npm run update
```

### Aandachtspunten

- In onze Docker-configuratie gebruiken we een lokaal logstuurprogramma. Cast Operations, met name in de probe- en ingest-containers, genereert een aanzienlijke hoeveelheid logs. Om te voorkomen dat uw opslag vol raakt, is het cruciaal de logopslag in Docker te beperken. Raadpleeg voor gedetailleerde instructies de officiële Docker-documentatie [hier](https://docs.docker.com/config/containers/logging/local/).

### Cast Operations verwijderen

Om Cast Operations te verwijderen, voer de volgende opdracht uit:

```
npm run down
```

Dit stopt en verwijdert alle containers, netwerken en volumes die door Cast Operations zijn aangemaakt. Het verwijdert niet het `config.env`-bestand of de gekloonde repository.
