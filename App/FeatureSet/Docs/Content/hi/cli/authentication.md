# Authentication

Cast Operations CLI आपके Cast Operations instance के साथ authenticate करने के कई तरीकों का समर्थन करता है। आप named contexts, environment variables का उपयोग कर सकते हैं, या credentials को सीधे flags के रूप में pass कर सकते हैं।

## Login

API key का उपयोग करके अपने Cast Operations instance के साथ authenticate करें:

```bash
oneuptime login <api-key> <instance-url>
```

**Arguments:**

| Argument         | विवरण                                                         |
| ---------------- | ------------------------------------------------------------- |
| `<api-key>`      | आपकी Cast Operations API key (जैसे `sk-your-api-key`)               |
| `<instance-url>` | आपके Cast Operations instance का URL (जैसे `https://visca.ai`) |

**Options:**

| Option                  | विवरण                                         |
| ----------------------- | --------------------------------------------- |
| `--context-name <name>` | इस context के लिए नाम (डिफ़ॉल्ट: `"default"`) |

**उदाहरण:**

```bash
# डिफ़ॉल्ट context के साथ login करें
oneuptime login sk-abc123 https://visca.ai

# named context के साथ login करें
oneuptime login sk-abc123 https://visca.ai --context-name production

# अनेक environments सेट अप करें
oneuptime login sk-prod-key https://visca.ai --context-name production
oneuptime login sk-staging-key https://staging.visca.ai --context-name staging
```

## Contexts

Contexts आपको कई Cast Operations environments (जैसे production, staging, development) को सहेजने और उनके बीच switch करने की अनुमति देते हैं।

### Contexts सूचीबद्ध करें

```bash
oneuptime context list
```

सभी configured contexts प्रदर्शित करता है। वर्तमान context `*` से चिह्नित होता है।

### Context Switch करें

```bash
oneuptime context use <name>
```

सभी subsequent commands के लिए एक अलग named context पर switch करें।

```bash
# staging पर switch करें
oneuptime context use staging

# production पर switch करें
oneuptime context use production
```

### वर्तमान Context देखें

```bash
oneuptime context current
```

वर्तमान active context प्रदर्शित करता है, जिसमें instance URL और masked API key शामिल है।

### एक Context हटाएं

```bash
oneuptime context delete <name>
```

एक named context हटाएं। यदि deleted context वर्तमान है, तो CLI स्वचालित रूप से पहले शेष context पर switch करती है।

## Credential Resolution

Credentials को निम्नलिखित प्राथमिकता क्रम में resolve किया जाता है:

1. **CLI flags** (`--api-key` और `--url`)
2. **Environment variables** (`ONEUPTIME_API_KEY` और `ONEUPTIME_URL`)
3. **Named context** (`--context` flag के माध्यम से)
4. **Current context** (saved configuration से)

आप sources को mix कर सकते हैं -- उदाहरण के लिए, API key के लिए environment variable और URL के लिए saved context का उपयोग करें।

### CLI Flags का उपयोग

```bash
oneuptime --api-key sk-abc123 --url https://visca.ai incident list
```

### Environment Variables का उपयोग

```bash
export ONEUPTIME_API_KEY=sk-abc123
export ONEUPTIME_URL=https://visca.ai

oneuptime incident list
```

### एक Specific Context का उपयोग

```bash
oneuptime --context production incident list
```

## Authentication सत्यापित करें

अपनी वर्तमान authentication status जांचें:

```bash
oneuptime whoami
```

यह प्रदर्शित करता है:

- Instance URL
- Masked API key
- वर्तमान context नाम (केवल तभी दिखाया जाता है जब कोई saved context active हो)

यदि authenticated नहीं है, तो command एक सहायक संदेश दिखाता है जो `oneuptime login` चलाने का सुझाव देता है।

## Configuration फ़ाइल

Credentials प्रतिबंधित permissions (`0600`) के साथ `~/.oneuptime/config.json` में संग्रहीत होते हैं।

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://visca.ai",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.visca.ai",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```
