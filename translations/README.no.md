<!-- markdownlint-disable MD033 MD041 -->
<p align="center">
  <a href="/README.md">English</a> ·
  <a href="/translations/README.zh-CN.md">简体中文</a> ·
  <a href="/translations/README.zh-TW.md">繁體中文</a> ·
  <a href="/translations/README.ja.md">日本語</a> ·
  <a href="/translations/README.ko.md">한국어</a> ·
  <a href="/translations/README.es.md">Español</a> ·
  <a href="/translations/README.fr.md">Français</a> ·
  <a href="/translations/README.de.md">Deutsch</a> ·
  <a href="/translations/README.pt.md">Português</a> ·
  <a href="/translations/README.it.md">Italiano</a> ·
  <a href="/translations/README.ru.md">Русский</a> ·
  <a href="/translations/README.hi.md">हिन्दी</a> ·
  <a href="/translations/README.nl.md">Nederlands</a> ·
  <a href="/translations/README.da.md">Dansk</a> ·
  <a href="/translations/README.sv.md">Svenska</a> ·
  <a href="/translations/README.no.md">Norsk</a>
</p>

<div align="center">
  <a href="https://latticeruntime.com">
    <img alt="Cast Operations-logo" width="55%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Common/UI/Images/logos/CastOperationsSVG/logo.svg"/>
  </a>

  <h3>Agentbasert observabilitet — én åpen kildekode-plattform for oppetid, hendelser, vaktordning, statussider, logger, spor, metrikker og APM.</h3>

  <p><b>Når noe går galt, vær den første som får vite det — og den raskeste til å fikse det.</b></p>

  <p>Cast Operations erstatter en hel hylle med SaaS-verktøy med én plattform du kan drifte selv, helt gratis. Den fanger opp nedetiden, tilkaller riktig person, oppdaterer statussiden din, finner grunnårsaken og åpner til og med rettelses-PR-en.</p>

  <p>
    <a href="https://github.com/autonomy-cloud/operations/blob/master/LICENSE"><img src="https://img.shields.io/github/license/autonomy-cloud/operations?color=1a73e8" alt="License"></a>
    <a href="https://github.com/autonomy-cloud/operations/releases"><img src="https://img.shields.io/github/v/release/autonomy-cloud/operations" alt="Release"></a>
    <a href="https://github.com/autonomy-cloud/operations/stargazers"><img src="https://img.shields.io/github/stars/autonomy-cloud/operations?style=flat" alt="Stars"></a>
    <a href="https://artifacthub.io/packages/helm/autonomy-cloud/operations"><img src="https://img.shields.io/badge/Helm-Chart-0f1689" alt="Helm Chart"></a>
    <a href="https://github.com/autonomy-cloud/operations/discussions"><img src="https://img.shields.io/badge/Slack-Community-4A154B" alt="Slack"></a>
  </p>

  <p>
    <a href="https://latticeruntime.com"><b>Nettsted</b></a> &nbsp;•&nbsp;
    <a href="https://latticeruntime.com/docs"><b>Dokumentasjon</b></a> &nbsp;•&nbsp;
    <a href="#quick-start"><b>Kom raskt i gang</b></a> &nbsp;•&nbsp;
    <a href="https://latticeruntime.com/pricing"><b>Priser</b></a> &nbsp;•&nbsp;
    <a href="#contributing"><b>Bidra</b></a>
  </p>

  <a href="https://latticeruntime.com"><b>🚀 Prøv Cast Operations Cloud — gratis for alltid-plan, uten kredittkort →</b></a>
</div>

<br/>

<div align="center">
  <img alt="Cast Operations-kommandosentral under en pågående hendelse" width="92%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Home/Static/img/readme/hero-command-center.png"/>
</div>

---

## Erstatt hele observabilitetsstakken din

Cast Operations samler overvåking, varsling, hendelseshåndtering og observabilitet i én åpen kildekode-app — slik at du slutter å betale for (og lappe sammen) et dusin separate verktøy.

| I stedet for … | Bruk Cast Operations til … |
|---|---|
| Pingdom / UptimeRobot | **Oppetidsovervåking** — nettsted-, API-, ping-, port-, SSL-, DNS- og syntetiske sjekker fra hele verden |
| StatusPage.io | **Statussider** — profilerte offentlige og private statussider med abonnenter |
| PagerDuty / Opsgenie | **Vaktordning og varsler** — vaktplaner, eskaleringspolicyer, SMS / anrop / push / Slack |
| Incident.io | **Hendelseshåndtering** — erklær, triager, kommuniser og gjennomfør evaluering |
| Datadog / New Relic | **APM og metrikker** — spor, dashbord og tjenesteytelse |
| Loggly | **Loggadministrasjon** — samle inn, søk i og varsle på logger |
| Sentry | **Feilsporing** — unntak med fullstendige stakksporinger og kontekst |

Alt sammen er **100 % åpen kildekode (Apache 2.0)** og gratis å drifte selv.

---

<details>
<summary><b>🌙 Én hendelse, håndtert fra ende til ende</b></summary>

<br/>

Klokken er 02.47. Utsjekk begynner å få tidsavbrudd. Her er hva Cast Operations gjør før de fleste verktøy i det hele tatt ville utløst det første varselet — og hva skjermbildene nedenfor faktisk viser.

### 1 · Oppdag — *vit det på sekunder*

Sonder i flere regioner fanger opp at utsjekk-latensen sprenger 5-sekundersterskelen din og åpner en hendelse automatisk — før kundene dine rekker å trykke oppdater.

![Oppdag — global overvåking fanger opp at utsjekk-API-et forringes](/Home/Static/img/readme/detect.png?raw=true)

### 2 · Respons — *riktig person, tilkalt*

Vakthavende ingeniør for Payments-policyen blir ringt, tekstet og push-varslet, og eskalerer automatisk til reserven til noen bekrefter.

![Respons — hendelsen rutes til vakthavende og bekreftes](/Home/Static/img/readme/respond.png?raw=true)

### 3 · Kommuniser — *kundene holdes oppdatert*

Statussiden din oppdaterer seg selv, og hver abonnent varsles via e-post og SMS — ingen trenger å skrive oppdateringen for hånd.

![Kommuniser — den offentlige statussiden oppdateres og varsler abonnenter](/Home/Static/img/readme/communicate.png?raw=true)

### 4 · Diagnostiser — *grunnårsaken, funnet*

Spor, logger og metrikker korreleres ned til nøyaktig span: en treg `SELECT … FOR UPDATE` på `orders`, fast på en manglende indeks.

![Diagnostiser — sporfossen peker ut det trege databasespannet](/Home/Static/img/readme/diagnose.png?raw=true)

### 5 · Auto-rett — *rettelsen, utformet for deg*

AI-agenten åpner en pull request med rettelsen, koblet til hendelsen, med grønne tester — du gjennomgår og fletter inn. Som en SRE som aldri sover.

![Auto-rett — AI-agenten åpner en pull request med rettelsen](/Home/Static/img/readme/autofix.png?raw=true)

</details>

---

<a name="quick-start"></a>

## ⚡ Kom raskt i gang

### ☁️ Cast Operations Cloud — den enkle måten

Null oppsett, alltid oppdatert, og det finansierer åpen kildekode-prosjektet.

**→ [Registrer deg gratis på latticeruntime.com](https://latticeruntime.com)**

### 🐳 Drift selv med Docker Compose

Alt du trenger på én enkelt server (Debian / Ubuntu / RHEL, Docker + Docker Compose). Ypperlig for hjemmelaber og små team — en Raspberry Pi fungerer til og med.

```bash
# 1. Clone the release branch
git clone --depth 1 --single-branch --branch release https://github.com/autonomy-cloud/operations.git
cd cast-operations

# 2. Create your config (then edit it — set strong, random secrets!)
cp config.example.env config.env

# 3. Start everything
npm start
```

Cast Operations kjører nå på **http://localhost** — åpne det og opprett din første konto.

📖 Fullstendig veiledning: [Docker Compose-installasjon](/App/FeatureSet/Docs/Content/en/installation/docker-compose.md) · [Dimensjonering og krav](/App/FeatureSet/Docs/Content/en/installation/sizing.md)

### ☸️ Kubernetes med Helm — for produksjon

```bash
helm repo add cast-operations https://helm-chart.latticeruntime.com
helm install cast-operations autonomy-cloud/operations
```

📖 Fullstendige installasjonsinstruksjoner og verdier på [Artifact Hub →](https://artifacthub.io/packages/helm/autonomy-cloud/operations)

> **Oppgraderer du en eksisterende installasjon?** Se [oppgraderingsveiledningen](/App/FeatureSet/Docs/Content/en/installation/upgrading.md).

---

## ✨ Alt i esken

| | Funksjon | Hva den gjør |
|---|---|---|
| 📊 | **Oppetidsovervåking** | Nettsted-, API-, IP-, port-, SSL-, DNS- og syntetiske overvåkere fra flere globale regioner. |
| 📋 | **Statussider** | Vakre, profilerte statussider, hendelseshistorikk, planlagt vedlikehold og abonnentvarsler. |
| 🚨 | **Hendelseshåndtering** | Hendelsesarbeidsflyt fra ende til ende: erklær, tildel, kommuniser, løs og gjennomfør evalueringer. |
| 📞 | **Vaktordning og varsler** | Vaktplaner og eskaleringspolicyer med varsler via SMS, telefonanrop, push, e-post og Slack. |
| 📝 | **Loggadministrasjon** | Innhent, lagre, søk i og varsle på logger via OpenTelemetry. |
| 🔍 | **APM og spor** | Distribuerte spor, span og ytelsesdashbord for å finne trege stier og flaskehalser. |
| 📈 | **Metrikker og dashbord** | Egendefinerte dashbord over telemetrien din — bygg visningene teamet ditt trenger. |
| 🐛 | **Feilsporing** | Fang opp unntak med fullstendige stakksporinger, kontekst og utgivelsessporing. |
| ⚡ | **Arbeidsflyter** | Automatiser og integrer med Slack, Jira, GitHub, Microsoft Teams og 5 000+ apper. |
| 🤖 | **AI-copilot** | En alltid-på-agent som finner avvik på tvers av logger, spor og metrikker, oppdager grunnårsaker og åpner PR-er med rettelser. |

<details>
<summary><b>⚡ Automatiser rutinearbeidet</b></summary>

<br/>

Koble sammen eskaleringer, saksbehandling og varsler på et visuelt kodefritt lerret — eller slipp inn egendefinert kode. Hendelsen ovenfor tilkalte vakthavende, åpnet en Jira-sak og postet til Slack uten at noen løftet en finger.

![Arbeidsflyter — et kodefritt automatiseringslerret for hendelseseskalering](/Home/Static/img/readme/workflows.png?raw=true)

</details>

### 🖥️ Infrastrukturovervåking

Slipp inn kopier-og-lim-inn-agenter basert på **OpenTelemetry** for å følge med på alt tjenestene dine kjører på — med ferdiglagde varselmaler inkludert:

- **Servere og VM-er** — CPU, minne, disk, nettverk, prosesser og logger fra Linux, macOS og Windows. [Dokumentasjon →](/App/FeatureSet/Docs/Content/en/telemetry/host-otel-collector.md)
- **Kubernetes** — én `helm install` leverer node-/pod-/container-/klyngemetrikker, hendelser, logger og eBPF-spor og tjenestekart. [Dokumentasjon →](/App/FeatureSet/Docs/Content/en/telemetry/kubernetes-agent.md)
- **Docker** — én enkelt agent oppdager automatisk hver container og leverer metrikker og logger. [Dokumentasjon →](/App/FeatureSet/Docs/Content/en/telemetry/docker-host.md)
- **Podman** — samme automatiske oppdagelse med én agent via Podmans Docker-kompatible socket. [Dokumentasjon →](/App/FeatureSet/Docs/Content/en/telemetry/podman-host.md)
- **Proxmox** — noder, VM-er, containere, lagring, HA-tilstand, sikkerhetskopidekning og replikeringshelse. [Dokumentasjon →](/App/FeatureSet/Docs/Content/en/telemetry/proxmox.md)
- **Ceph** — klyngehelse, kapasitetsprognoser og innsyn i OSD/pool/PG/monitor. [Dokumentasjon →](/App/FeatureSet/Docs/Content/en/telemetry/ceph.md)

---

## 💼 Community vs. Enterprise

| | **Community** | **Enterprise** |
|---|---|---|
| **Best egnet for** | Selvdriftere og små team | Regulerte team som trenger premiumsupport |
| **Kostnad** | Gratis og åpen kildekode | [Kontakt salg](mailto:sales@latticeruntime.com) |
| **Funksjoner** | Fullt funksjonssett | Fullt funksjonssett + herdede images, prioritert support, egendefinerte funksjoner og datalokasjon |

---

## 💡 Hvorfor Cast Operations?

Oppdraget vårt er enkelt: **redusere nedetid og hjelpe flere produkter med å lykkes.** I stedet for å teipe sammen syv leverandører, får du én plattform som hjelper deg å forstå *hvorfor* ting går i stykker, respondere raskt på hendelser og redusere driftsslit — helt åpen kildekode, så du eier dine egne data og din egen stakk.

---

<a name="contributing"></a>

## 🤝 Bidra

Vi ønsker bidrag av alle størrelser velkommen. Start her:

- 🐛 **[Åpne saker](https://github.com/autonomy-cloud/operations/issues)** — plukk opp en, eller [meld inn en ny](https://github.com/autonomy-cloud/operations/issues/new)
- ✅ **[Hjelp til med å skrive tester](https://github.com/autonomy-cloud/operations/issues?q=is%3Aopen+is%3Aissue+label%3A%22write+tests%22)** for kodebasen
- 🧑‍💻 **[Veiledning for lokal utvikling](/App/FeatureSet/Docs/Content/en/installation/local-development.md)** for å komme i gang
- 📖 Les **[retningslinjene for bidrag](/CONTRIBUTING.md)**
- 💬 Prat med oss i **[utvikler-Slacken](https://github.com/autonomy-cloud/operations/discussions)** eller **[community-Slacken](https://github.com/autonomy-cloud/operations/discussions)**

## ❤️ Støtt prosjektet

Hvis Cast Operations er nyttig for deg:

- ⭐ **Gi dette repoet en stjerne** — det hjelper virkelig andre med å finne oss
- 💵 **[Sponsor oss](https://github.com/autonomy-cloud/operations)** — hver krone leverer nye funksjoner
- 🛍️ **[Skaff deg litt merch](https://shop.latticeruntime.com)** — alt overskudd finansierer åpen kildekode-utvikling

---

## 📄 Lisens

Cast Operations er lisensiert under [Apache License 2.0](/LICENSE).

<div align="center">
  <sub>Laget med ❤️ av <a href="https://latticeruntime.com">Cast Operations</a>-teamet og <a href="https://github.com/autonomy-cloud/operations/graphs/contributors">bidragsytere</a>.</sub>
</div>
