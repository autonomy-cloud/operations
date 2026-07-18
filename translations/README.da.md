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
    <img alt="Cast Operations-logo" width="55%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Common/UI/Images/logos/CastOperationsSVG/logo.svg"/>
  </a>

  <h3>Agentbaseret observability — én open source-platform til oppetid, hændelser, vagt, statussider, logs, traces, metrics og APM.</h3>

  <p><b>Når noget går galt, så vær den første til at vide det — og den hurtigste til at rette det.</b></p>

  <p>Cast Operations erstatter en hel hylde af SaaS-værktøjer med én platform, du kan hoste selv gratis. Den fanger nedbruddet, tilkalder den rette person, opdaterer din statusside, finder årsagen og åbner endda rettelses-PR'en.</p>

  <p>
    <a href="https://github.com/autonomy-cloud/operations/blob/master/LICENSE"><img src="https://img.shields.io/github/license/autonomy-cloud/operations?color=1a73e8" alt="License"></a>
    <a href="https://github.com/autonomy-cloud/operations/releases"><img src="https://img.shields.io/github/v/release/autonomy-cloud/operations" alt="Release"></a>
    <a href="https://github.com/autonomy-cloud/operations/stargazers"><img src="https://img.shields.io/github/stars/autonomy-cloud/operations?style=flat" alt="Stars"></a>
    <a href="https://artifacthub.io/packages/helm/autonomy-cloud/operations"><img src="https://img.shields.io/badge/Helm-Chart-0f1689" alt="Helm Chart"></a>
    <a href="https://github.com/autonomy-cloud/operations/discussions"><img src="https://img.shields.io/badge/Slack-Community-4A154B" alt="Slack"></a>
  </p>

  <p>
    <a href="https://visca.ai"><b>Websted</b></a> &nbsp;•&nbsp;
    <a href="https://visca.ai/docs"><b>Dokumentation</b></a> &nbsp;•&nbsp;
    <a href="#quick-start"><b>Hurtig start</b></a> &nbsp;•&nbsp;
    <a href="https://visca.ai/pricing"><b>Priser</b></a> &nbsp;•&nbsp;
    <a href="#contributing"><b>Bidrag</b></a>
  </p>

  <a href="https://visca.ai"><b>🚀 Prøv Cast Operations Cloud — gratis for altid, intet kreditkort →</b></a>
</div>

<br/>

<div align="center">
  <img alt="Cast Operations-kommandocenter under en igangværende hændelse" width="92%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Home/Static/img/readme/hero-command-center.png"/>
</div>

---

## Erstat hele din observability-stak

Cast Operations samler overvågning, alarmering, hændelseshåndtering og observability i én open source-app — så du holder op med at betale for (og sammenflikke) et dusin separate værktøjer.

| I stedet for… | Brug Cast Operations til… |
|---|---|
| Pingdom / UptimeRobot | **Oppetidsovervågning** — website-, API-, ping-, port-, SSL-, DNS- og syntetiske tjek fra hele verden |
| StatusPage.io | **Statussider** — brandede offentlige og private statussider med abonnenter |
| PagerDuty / Opsgenie | **Vagt og alarmer** — vagtplaner, eskaleringspolitikker, SMS / opkald / push / Slack |
| Incident.io | **Hændelseshåndtering** — erklær, triager, kommunikér og lav post mortem |
| Datadog / New Relic | **APM og metrics** — traces, dashboards og serviceydeevne |
| Loggly | **Loghåndtering** — indsaml, søg og alarmér på logs |
| Sentry | **Fejlsporing** — undtagelser med fulde stack traces og kontekst |

Det hele er **100 % open source (Apache 2.0)** og gratis at hoste selv.

---

<details>
<summary><b>🌙 Én hændelse, håndteret fra start til slut</b></summary>

<br/>

Klokken er 2:47 om natten. Checkout begynder at få timeouts. Her er, hvad Cast Operations gør, før de fleste værktøjer overhovedet ville udløse den første alarm — og hvad skærmbillederne nedenfor faktisk viser.

### 1 · Registrér — *ved det på sekunder*

Prober i flere regioner fanger, at checkout-latensen skyder forbi din grænse på 5s, og åbner automatisk en hændelse — før dine kunder trykker opdater.

![Registrér — global overvågning fanger checkout-API'et i forringelse](/Home/Static/img/readme/detect.png?raw=true)

### 2 · Reagér — *den rette person, tilkaldt*

Vagt-ingeniøren for Payments-politikken bliver ringet op, sendt sms til og push-notificeret, og der eskaleres automatisk til backup, indtil nogen kvitterer.

![Reagér — hændelsen dirigeres til vagt og kvitteres](/Home/Static/img/readme/respond.png?raw=true)

### 3 · Kommunikér — *kunderne holdes orienteret*

Din statusside opdaterer sig selv, og hver abonnent får besked via e-mail og SMS — ingen behøver at skrive opdateringen i hånden.

![Kommunikér — den offentlige statusside opdateres og notificerer abonnenter](/Home/Static/img/readme/communicate.png?raw=true)

### 4 · Diagnosticér — *årsagen, fundet*

Traces, logs og metrics korreleres helt ned til det præcise span: en langsom `SELECT … FOR UPDATE` på `orders`, der hænger på et manglende indeks.

![Diagnosticér — trace-vandfaldet udpeger det langsomme databasespan](/Home/Static/img/readme/diagnose.png?raw=true)

### 5 · Auto-rettelse — *rettelsen, udkastet til dig*

AI-agenten åbner en pull request med rettelsen, koblet til hændelsen, med grønne tests — du gennemgår og merger. Som en SRE, der aldrig sover.

![Auto-rettelse — AI-agenten åbner en pull request med rettelsen](/Home/Static/img/readme/autofix.png?raw=true)

</details>

---

<a name="quick-start"></a>

## ⚡ Hurtig start

### ☁️ Cast Operations Cloud — den nemme måde

Ingen opsætning, altid opdateret, og det finansierer open source-projektet.

**→ [Tilmeld dig gratis på visca.ai](https://visca.ai)**

### 🐳 Host selv med Docker Compose

Alt hvad du behøver på en enkelt server (Debian / Ubuntu / RHEL, Docker + Docker Compose). Fremragende til homelabs og små teams — en Raspberry Pi virker endda.

```bash
# 1. Clone the release branch
git clone --depth 1 --single-branch --branch release https://github.com/autonomy-cloud/operations.git
cd oneuptime

# 2. Create your config (then edit it — set strong, random secrets!)
cp config.example.env config.env

# 3. Start everything
npm start
```

Cast Operations kører nu på **http://localhost** — åbn det og opret din første konto.

📖 Fuld guide: [Docker Compose-installation](/App/FeatureSet/Docs/Content/en/installation/docker-compose.md) · [Dimensionering og krav](/App/FeatureSet/Docs/Content/en/installation/sizing.md)

### ☸️ Kubernetes med Helm — til produktion

```bash
helm repo add oneuptime https://helm-chart.visca.ai
helm install oneuptime autonomy-cloud/operations
```

📖 Fulde installationsvejledninger og values på [Artifact Hub →](https://artifacthub.io/packages/helm/autonomy-cloud/operations)

> **Opgraderer du en eksisterende installation?** Se [opgraderingsguiden](/App/FeatureSet/Docs/Content/en/installation/upgrading.md).

---

## ✨ Alt i pakken

| | Funktion | Hvad den gør |
|---|---|---|
| 📊 | **Oppetidsovervågning** | Website-, API-, IP-, port-, SSL-, DNS- og syntetiske monitorer fra flere globale regioner. |
| 📋 | **Statussider** | Smukke brandede statussider, hændelseshistorik, planlagt vedligeholdelse og abonnentnotifikationer. |
| 🚨 | **Hændelseshåndtering** | End-to-end-hændelsesforløb: erklær, tildel, kommunikér, løs og kør post mortems. |
| 📞 | **Vagt og alarmer** | Vagtplaner og eskaleringspolitikker med SMS, telefonopkald, push, e-mail og Slack-alarmer. |
| 📝 | **Loghåndtering** | Indtag, gem, søg og alarmér på logs via OpenTelemetry. |
| 🔍 | **APM og traces** | Distribuerede traces, spans og ydeevne-dashboards til at finde langsomme stier og flaskehalse. |
| 📈 | **Metrics og dashboards** | Brugerdefinerede dashboards over din telemetri — byg de visninger, dit team har brug for. |
| 🐛 | **Fejlsporing** | Fang undtagelser med fulde stack traces, kontekst og release-sporing. |
| ⚡ | **Workflows** | Automatisér og integrér med Slack, Jira, GitHub, Microsoft Teams og 5.000+ apps. |
| 🤖 | **AI Copilot** | En altid-tændt agent, der finder anomalier på tværs af logs, traces og metrics, spotter årsager og åbner PR'er med rettelser. |

<details>
<summary><b>⚡ Automatisér rutinearbejdet</b></summary>

<br/>

Sæt eskaleringer, ticketing og notifikationer sammen på et visuelt, no-code-lærred — eller indsæt din egen kode. Hændelsen ovenfor tilkaldte vagten, oprettede en Jira-ticket og postede til Slack, uden at nogen løftede en finger.

![Workflows — et no-code-automatiseringslærred til hændelseseskalering](/Home/Static/img/readme/workflows.png?raw=true)

</details>

### 🖥️ Infrastrukturovervågning

Indsæt copy-paste, **OpenTelemetry-baserede** agenter til at holde øje med alt, dine services kører på — med færdige alarmskabeloner inkluderet:

- **Servere og VM'er** — CPU, hukommelse, disk, netværk, processer og logs fra Linux, macOS og Windows. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/host-otel-collector.md)
- **Kubernetes** — én `helm install` leverer node-/pod-/container-/klyngemetrics, events, logs og eBPF-traces og service-maps. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/kubernetes-agent.md)
- **Docker** — en enkelt agent finder automatisk hver container og leverer metrics og logs. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/docker-host.md)
- **Podman** — samme ét-agent-autoregistrering via Podmans Docker-kompatible socket. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/podman-host.md)
- **Proxmox** — noder, VM'er, containere, lager, HA-tilstand, backup-dækning og replikeringssundhed. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/proxmox.md)
- **Ceph** — klyngesundhed, kapacitetsprognoser og OSD-/pool-/PG-/monitor-indsigt. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/ceph.md)

---

## 💼 Community vs. Enterprise

| | **Community** | **Enterprise** |
|---|---|---|
| **Bedst til** | Selv-hostere og små teams | Regulerede teams med behov for premium-support |
| **Pris** | Gratis og open source | [Kontakt salg](mailto:sales@visca.ai) |
| **Funktioner** | Fuldt funktionssæt | Fuldt funktionssæt + hærdede images, prioriteret support, brugerdefinerede funktioner og dataophold |

---

## 💡 Hvorfor Cast Operations?

Vores mission er enkel: **reducér nedetid og hjælp flere produkter med at få succes.** I stedet for at tape syv leverandører sammen får du én platform, der hjælper dig med at forstå, *hvorfor* ting går i stykker, reagere hurtigt på hændelser og skære ned på driftsslid — fuldt open source, så du ejer dine data og din stak.

---

<a name="contributing"></a>

## 🤝 Bidrag

Vi byder bidrag af enhver størrelse velkommen. Begynd her:

- 🐛 **[Åbne issues](https://github.com/autonomy-cloud/operations/issues)** — tag et op, eller [opret et nyt](https://github.com/autonomy-cloud/operations/issues/new)
- ✅ **[Hjælp med at skrive tests](https://github.com/autonomy-cloud/operations/issues?q=is%3Aopen+is%3Aissue+label%3A%22write+tests%22)** til kodebasen
- 🧑‍💻 **[Guide til lokal udvikling](/App/FeatureSet/Docs/Content/en/installation/local-development.md)** for at komme i gang
- 📖 Læs **[retningslinjerne for bidrag](/CONTRIBUTING.md)**
- 💬 Chat med os i **[Developer Slack](https://github.com/autonomy-cloud/operations/discussions)** eller **[Community Slack](https://github.com/autonomy-cloud/operations/discussions)**

## ❤️ Støt projektet

Hvis Cast Operations er nyttigt for dig:

- ⭐ **Giv denne repo en stjerne** — det hjælper virkelig andre med at finde os
- 💵 **[Sponsorér os](https://github.com/autonomy-cloud/operations)** — hver krone leverer nye funktioner
- 🛍️ **[Køb noget merch](https://shop.visca.ai)** — alt overskud finansierer open source-udvikling

---

## 📄 Licens

Cast Operations er licenseret under [Apache License 2.0](/LICENSE).

<div align="center">
  <sub>Lavet med ❤️ af <a href="https://visca.ai">Cast Operations</a>-teamet og <a href="https://github.com/autonomy-cloud/operations/graphs/contributors">bidragydere</a>.</sub>
</div>
