# Resource Operations

Cast Operations CLI सभी समर्थित resources के लिए पूर्ण CRUD (Create, Read, Update, Delete) operations प्रदान करती है। Resources आपके Cast Operations instance से auto-discover होते हैं।

## उपलब्ध Resources

सभी उपलब्ध resource types देखने के लिए निम्नलिखित command चलाएं:

```bash
cast-operations resources
```

आप type के अनुसार filter कर सकते हैं:

```bash
# केवल database resources दिखाएं
cast-operations resources --type database

# केवल analytics resources दिखाएं
cast-operations resources --type analytics
```

सामान्य resources में शामिल हैं:

| Resource                    | Command                                 |
| --------------------------- | --------------------------------------- |
| Incident                    | `cast-operations incident`                    |
| Alert                       | `cast-operations alert`                       |
| Monitor                     | `cast-operations monitor`                     |
| Monitor Status              | `cast-operations monitor-status`              |
| Incident State              | `cast-operations incident-state`              |
| Status Page                 | `cast-operations status-page`                 |
| On-Call Policy              | `cast-operations on-call-policy`              |
| Team                        | `cast-operations team`                        |
| Scheduled Maintenance Event | `cast-operations scheduled-maintenance-event` |

## Resources सूचीबद्ध करें

वैकल्पिक filtering, pagination और sorting के साथ resources की सूची प्राप्त करें।

```bash
cast-operations <resource> list [options]
```

**Options:**

| Option                  | विवरण                              | Default |
| ----------------------- | ---------------------------------- | ------- |
| `--query <json>`        | JSON के रूप में filter criteria    | None    |
| `--limit <n>`           | results की अधिकतम संख्या           | `10`    |
| `--skip <n>`            | skip करने के लिए results की संख्या | `0`     |
| `--sort <json>`         | JSON के रूप में sort order         | None    |
| `-o, --output <format>` | Output format                      | `table` |

**उदाहरण:**

```bash
# 10 सबसे हाल के incidents सूचीबद्ध करें
cast-operations incident list

# state ID से incidents filter करें
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# pagination के साथ सूचीबद्ध करें
cast-operations incident list --limit 20 --skip 40

# creation date (descending) के अनुसार sort करें
cast-operations incident list --sort '{"createdAt":-1}'

# JSON के रूप में output करें
cast-operations incident list -o json
```

## एक Resource प्राप्त करें

अपनी ID से एक single resource प्राप्त करें।

```bash
cast-operations <resource> get <id>
```

**Arguments:**

| Argument | विवरण              |
| -------- | ------------------ |
| `<id>`   | Resource ID (UUID) |

**उदाहरण:**

```bash
# एक specific incident प्राप्त करें
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# एक monitor को JSON के रूप में प्राप्त करें
cast-operations monitor get abc-123 -o json
```

## एक Resource बनाएं

inline JSON या फ़ाइल से एक नया resource बनाएं।

```bash
cast-operations <resource> create [options]
```

**Options:**

| Option                  | विवरण                                  |
| ----------------------- | -------------------------------------- |
| `--data <json>`         | JSON object के रूप में Resource data   |
| `--file <path>`         | Resource data युक्त JSON फ़ाइल का path |
| `-o, --output <format>` | Output format                          |

आपको `--data` या `--file` में से एक प्रदान करना होगा।

**उदाहरण:**

```bash
# inline JSON के साथ incident बनाएं
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# JSON फ़ाइल से बनाएं
cast-operations incident create --file incident.json

# ID capture करने के लिए JSON के रूप में output करते हुए बनाएं
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## एक Resource अपडेट करें

ID से एक मौजूदा resource अपडेट करें।

```bash
cast-operations <resource> update <id> [options]
```

**Arguments:**

| Argument | विवरण       |
| -------- | ----------- |
| `<id>`   | Resource ID |

**Options:**

| Option                  | विवरण                                              |
| ----------------------- | -------------------------------------------------- |
| `--data <json>`         | JSON के रूप में update करने के लिए fields (आवश्यक) |
| `-o, --output <format>` | Output format                                      |

**उदाहरण:**

```bash
# incident state बदलें (जैसे resolved पर)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# एक monitor का नाम बदलें
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## एक Resource हटाएं

ID से एक resource हटाएं।

```bash
cast-operations <resource> delete <id> [--force]
```

**Arguments:**

| Argument | विवरण       |
| -------- | ----------- |
| `<id>`   | Resource ID |

**Options:**

| Option    | विवरण                      |
| --------- | -------------------------- |
| `--force` | confirmation prompt छोड़ें |

**उदाहरण:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# confirmation छोड़ें
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Resources गिनें

वैकल्पिक filter criteria से मेल खाने वाले resources गिनें।

```bash
cast-operations <resource> count [options]
```

**Options:**

| Option           | विवरण                           |
| ---------------- | ------------------------------- |
| `--query <json>` | JSON के रूप में filter criteria |

**उदाहरण:**

```bash
# सभी incidents गिनें
cast-operations incident count

# state के अनुसार incidents गिनें
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# monitors गिनें
cast-operations monitor count
```

## Analytics Resources

Analytics resources, database resources की तुलना में सीमित operations का समर्थन करते हैं:

| Operation | समर्थित |
| --------- | ------- |
| `list`    | हाँ     |
| `create`  | हाँ     |
| `count`   | हाँ     |
| `get`     | नहीं    |
| `update`  | नहीं    |
| `delete`  | नहीं    |

अपने instance पर कौन से analytics resources उपलब्ध हैं, यह देखने के लिए `cast-operations resources --type analytics` उपयोग करें।
