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
  <a href="https://visca.ai">
    <img alt="Cast Operations-logotyp" width="55%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Common/UI/Images/logos/CastOperationsSVG/logo.svg"/>
  </a>

  <h3>Agentbaserad observerbarhet — en öppen källkodsplattform för drifttid, incidenter, jour, statussidor, loggar, spårningar, mätvärden och APM.</h3>

  <p><b>När något går fel, var först med att veta — och snabbast med att åtgärda.</b></p>

  <p>Cast Operations ersätter en hel hylla med SaaS-verktyg med en enda plattform som du kan drifta själv gratis. Den fångar avbrottet, larmar rätt person, uppdaterar din statussida, hittar grundorsaken och öppnar till och med en PR med åtgärden.</p>

  <p>
    <a href="https://github.com/autonomy-cloud/operations/blob/master/LICENSE"><img src="https://img.shields.io/github/license/autonomy-cloud/operations?color=1a73e8" alt="License"></a>
    <a href="https://github.com/autonomy-cloud/operations/releases"><img src="https://img.shields.io/github/v/release/autonomy-cloud/operations" alt="Release"></a>
    <a href="https://github.com/autonomy-cloud/operations/stargazers"><img src="https://img.shields.io/github/stars/autonomy-cloud/operations?style=flat" alt="Stars"></a>
    <a href="https://artifacthub.io/packages/helm/autonomy-cloud/operations"><img src="https://img.shields.io/badge/Helm-Chart-0f1689" alt="Helm Chart"></a>
    <a href="https://github.com/autonomy-cloud/operations/discussions"><img src="https://img.shields.io/badge/Slack-Community-4A154B" alt="Slack"></a>
  </p>

  <p>
    <a href="https://visca.ai"><b>Webbplats</b></a> &nbsp;•&nbsp;
    <a href="https://visca.ai/docs"><b>Dokumentation</b></a> &nbsp;•&nbsp;
    <a href="#quick-start"><b>Snabbstart</b></a> &nbsp;•&nbsp;
    <a href="https://visca.ai/pricing"><b>Priser</b></a> &nbsp;•&nbsp;
    <a href="#contributing"><b>Bidra</b></a>
  </p>

  <a href="https://visca.ai"><b>🚀 Prova Cast Operations Cloud — gratis för alltid-plan, inget kreditkort →</b></a>
</div>

<br/>

<div align="center">
  <img alt="Cast Operations-ledningscentral under en pågående incident" width="92%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Home/Static/img/readme/hero-command-center.png"/>
</div>

---

## Ersätt hela din observerbarhetsstack

Cast Operations samlar övervakning, larm, incidenthantering och observerbarhet i en enda öppen källkodsapp — så att du slutar betala för (och lappa ihop) ett dussin separata verktyg.

| Istället för… | Använd Cast Operations för… |
|---|---|
| Pingdom / UptimeRobot | **Drifttidsövervakning** — webbplats-, API-, ping-, port-, SSL-, DNS- och syntetiska kontroller från hela världen |
| StatusPage.io | **Statussidor** — profilerade publika och privata statussidor med prenumeranter |
| PagerDuty / Opsgenie | **Jour och larm** — scheman, eskaleringspolicyer, SMS / samtal / push / Slack |
| Incident.io | **Incidenthantering** — deklarera, triagera, kommunicera och gör post-mortem |
| Datadog / New Relic | **APM och mätvärden** — spårningar, instrumentpaneler och tjänsteprestanda |
| Loggly | **Logghantering** — samla in, sök och larma på loggar |
| Sentry | **Felspårning** — undantag med fullständiga stackspårningar och kontext |

Allt är **100 % öppen källkod (Apache 2.0)** och gratis att drifta själv.

---

<details>
<summary><b>🌙 En incident, hanterad från början till slut</b></summary>

<br/>

Klockan är 02:47. Kassan börjar få timeouter. Så här gör Cast Operations innan de flesta verktyg ens hunnit utlösa det första larmet — och det är precis vad skärmbilderna nedan faktiskt visar.

### 1 · Upptäck — *vet på några sekunder*

Prober i flera regioner fångar att kassans latens skjuter förbi din tröskel på 5 s och öppnar en incident automatiskt — innan dina kunder hinner trycka på uppdatera.

![Upptäck — global övervakning fångar att kassans API försämras](/Home/Static/img/readme/detect.png?raw=true)

### 2 · Reagera — *rätt person, larmad*

Jourhavande ingenjör för Payments-policyn blir uppringd, sms:ad och push-notifierad, och eskalering till backup sker automatiskt tills någon kvitterar.

![Reagera — incidenten dirigeras till jouren och kvitteras](/Home/Static/img/readme/respond.png?raw=true)

### 3 · Kommunicera — *kunderna hålls informerade*

Din statussida uppdaterar sig själv och alla prenumeranter aviseras via e-post och SMS — ingen behöver skriva uppdateringen för hand.

![Kommunicera — den publika statussidan uppdateras och aviserar prenumeranter](/Home/Static/img/readme/communicate.png?raw=true)

### 4 · Diagnostisera — *grundorsaken, hittad*

Spårningar, loggar och mätvärden korreleras ner till exakt span: en långsam `SELECT … FOR UPDATE` på `orders`, fast på ett saknat index.

![Diagnostisera — spårningsvattenfallet pekar ut det långsamma databas-spanet](/Home/Static/img/readme/diagnose.png?raw=true)

### 5 · Auto-åtgärda — *åtgärden, utkast klart åt dig*

AI-agenten öppnar en pull request med åtgärden, länkad till incidenten och med gröna tester — du granskar och mergar. Som en SRE som aldrig sover.

![Auto-åtgärda — AI-agenten öppnar en pull request med åtgärden](/Home/Static/img/readme/autofix.png?raw=true)

</details>

---

<a name="quick-start"></a>

## ⚡ Snabbstart

### ☁️ Cast Operations Cloud — det enkla sättet

Ingen installation, alltid uppdaterat, och det finansierar projektet med öppen källkod.

**→ [Registrera dig gratis på visca.ai](https://visca.ai)**

### 🐳 Drifta själv med Docker Compose

Allt du behöver på en enda server (Debian / Ubuntu / RHEL, Docker + Docker Compose). Perfekt för hemmalabb och små team — en Raspberry Pi fungerar till och med.

```bash
# 1. Clone the release branch
git clone --depth 1 --single-branch --branch release https://github.com/autonomy-cloud/operations.git
cd cast-operations

# 2. Create your config (then edit it — set strong, random secrets!)
cp config.example.env config.env

# 3. Start everything
npm start
```

Cast Operations körs nu på **http://localhost** — öppna det och skapa ditt första konto.

📖 Fullständig guide: [Installation med Docker Compose](/App/FeatureSet/Docs/Content/en/installation/docker-compose.md) · [Dimensionering och krav](/App/FeatureSet/Docs/Content/en/installation/sizing.md)

### ☸️ Kubernetes med Helm — för produktion

```bash
helm repo add cast-operations https://helm-chart.visca.ai
helm install cast-operations autonomy-cloud/operations
```

📖 Fullständiga installationsinstruktioner och värden på [Artifact Hub →](https://artifacthub.io/packages/helm/autonomy-cloud/operations)

> **Uppgraderar du en befintlig installation?** Se [uppgraderingsguiden](/App/FeatureSet/Docs/Content/en/installation/upgrading.md).

---

## ✨ Allt i lådan

| | Funktion | Vad den gör |
|---|---|---|
| 📊 | **Drifttidsövervakning** | Webbplats-, API-, IP-, port-, SSL-, DNS- och syntetiska monitorer från flera globala regioner. |
| 📋 | **Statussidor** | Vackra profilerade statussidor, incidenthistorik, schemalagt underhåll och prenumerantaviseringar. |
| 🚨 | **Incidenthantering** | Komplett incidentflöde: deklarera, tilldela, kommunicera, lösa och genomföra post-mortem. |
| 📞 | **Jour och larm** | Jourscheman och eskaleringspolicyer med SMS, telefonsamtal, push, e-post och Slack-larm. |
| 📝 | **Logghantering** | Ta in, lagra, sök och larma på loggar via OpenTelemetry. |
| 🔍 | **APM och spårningar** | Distribuerade spårningar, span och prestandapaneler för att hitta långsamma vägar och flaskhalsar. |
| 📈 | **Mätvärden och instrumentpaneler** | Anpassade instrumentpaneler över din telemetri — bygg de vyer ditt team behöver. |
| 🐛 | **Felspårning** | Fånga undantag med fullständiga stackspårningar, kontext och versionsspårning. |
| ⚡ | **Arbetsflöden** | Automatisera och integrera med Slack, Jira, GitHub, Microsoft Teams och 5 000+ appar. |
| 🤖 | **AI-copilot** | En ständigt aktiv agent som hittar avvikelser i loggar, spårningar och mätvärden, upptäcker grundorsaker och öppnar PR:er med åtgärder. |

<details>
<summary><b>⚡ Automatisera rutinarbetet</b></summary>

<br/>

Koppla ihop eskaleringar, ärendehantering och aviseringar på en visuell canvas utan kod — eller lägg in egen kod. Incidenten ovan larmade jouren, öppnade ett Jira-ärende och postade till Slack utan att någon lyfte ett finger.

![Arbetsflöden — en automationscanvas utan kod för incidenteskalering](/Home/Static/img/readme/workflows.png?raw=true)

</details>

### 🖥️ Infrastrukturövervakning

Lägg in kopiera-och-klistra-agenter **baserade på OpenTelemetry** för att bevaka allt dina tjänster kör på — med färdiga larmmallar inkluderade:

- **Servrar och VM:er** — CPU, minne, disk, nätverk, processer och loggar från Linux, macOS och Windows. [Dokumentation →](/App/FeatureSet/Docs/Content/en/telemetry/host-otel-collector.md)
- **Kubernetes** — ett enda `helm install` levererar nod-/pod-/container-/klustermätvärden, händelser, loggar samt eBPF-spårningar och tjänstekartor. [Dokumentation →](/App/FeatureSet/Docs/Content/en/telemetry/kubernetes-agent.md)
- **Docker** — en enda agent upptäcker automatiskt varje container och levererar mätvärden och loggar. [Dokumentation →](/App/FeatureSet/Docs/Content/en/telemetry/docker-host.md)
- **Podman** — samma automatiska upptäckt med en agent via Podmans Docker-kompatibla socket. [Dokumentation →](/App/FeatureSet/Docs/Content/en/telemetry/podman-host.md)
- **Proxmox** — noder, VM:er, containrar, lagring, HA-status, backuptäckning och replikeringshälsa. [Dokumentation →](/App/FeatureSet/Docs/Content/en/telemetry/proxmox.md)
- **Ceph** — klusterhälsa, kapacitetsprognoser och insyn i OSD/pool/PG/monitor. [Dokumentation →](/App/FeatureSet/Docs/Content/en/telemetry/ceph.md)

---

## 💼 Community kontra Enterprise

| | **Community** | **Enterprise** |
|---|---|---|
| **Bäst för** | Självdriftare och små team | Reglerade team som behöver premiumsupport |
| **Kostnad** | Gratis och öppen källkod | [Kontakta försäljning](mailto:sales@visca.ai) |
| **Funktioner** | Fullständig funktionsuppsättning | Fullständig funktionsuppsättning + härdade images, prioriterad support, anpassade funktioner och dataresidens |

---

## 💡 Varför Cast Operations?

Vårt uppdrag är enkelt: **minska driftstopp och hjälpa fler produkter att lyckas.** Istället för att tejpa ihop sju leverantörer får du en enda plattform som hjälper dig förstå *varför* saker går sönder, svara på incidenter snabbt och minska operativt slit — helt öppen källkod, så att du äger dina data och din stack.

---

<a name="contributing"></a>

## 🤝 Bidra

Vi välkomnar bidrag av alla storlekar. Börja här:

- 🐛 **[Öppna issues](https://github.com/autonomy-cloud/operations/issues)** — plocka upp en, eller [skapa en ny](https://github.com/autonomy-cloud/operations/issues/new)
- ✅ **[Hjälp till att skriva tester](https://github.com/autonomy-cloud/operations/issues?q=is%3Aopen+is%3Aissue+label%3A%22write+tests%22)** för kodbasen
- 🧑‍💻 **[Guide för lokal utveckling](/App/FeatureSet/Docs/Content/en/installation/local-development.md)** för att komma igång
- 📖 Läs **[riktlinjerna för bidrag](/CONTRIBUTING.md)**
- 💬 Chatta med oss i **[Developer Slack](https://github.com/autonomy-cloud/operations/discussions)** eller **[Community Slack](https://github.com/autonomy-cloud/operations/discussions)**

## ❤️ Stöd projektet

Om Cast Operations är användbart för dig:

- ⭐ **Stjärnmärk detta repo** — det hjälper verkligen andra att hitta oss
- 💵 **[Sponsra oss](https://github.com/autonomy-cloud/operations)** — varje krona levererar nya funktioner
- 🛍️ **[Skaffa lite merch](https://shop.visca.ai)** — all vinst finansierar utveckling med öppen källkod

---

## 📄 Licens

Cast Operations är licensierat under [Apache License 2.0](/LICENSE).

<div align="center">
  <sub>Skapat med ❤️ av <a href="https://visca.ai">Cast Operations</a>-teamet och <a href="https://github.com/autonomy-cloud/operations/graphs/contributors">bidragsgivare</a>.</sub>
</div>
