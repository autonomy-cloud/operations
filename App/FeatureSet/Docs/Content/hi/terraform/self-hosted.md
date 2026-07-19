# Self-Hosted Cast Operations Terraform Configuration Guide

यह guide specifically उन customers के लिए है जो self-hosted Cast Operations instances चला रहे हैं। यह अपने Cast Operations deployment के साथ Terraform provider उपयोग करने के लिए version management, configuration और best practices cover करता है।

## महत्वपूर्ण नोट्स

⚠️ **Projects को Terraform के माध्यम से नहीं बनाया जा सकता** - Projects पहले Cast Operations dashboard में manually बनाने होंगे। अपनी Terraform configurations में project ID उपयोग करें।

⚠️ **Self-hosted customers के लिए सबसे महत्वपूर्ण नियम**: अपने Terraform provider version को हमेशा exactly अपने Cast Operations installation version से match करने के लिए pin करें।

## Resource Structure

सभी Cast Operations Terraform resources एक simplified structure follow करते हैं:

- `name` (आवश्यक) - Resource नाम
- `description` (वैकल्पिक) - Resource विवरण
- `data` (वैकल्पिक) - JSON के रूप में Complex configuration

## Critical: Version Compatibility

⚠️ **Self-hosted customers के लिए सबसे महत्वपूर्ण नियम**: अपने Terraform provider version को हमेशा exactly अपने Cast Operations installation version से match करने के लिए pin करें।

### Version Pinning Critical क्यों है

- Terraform provider Cast Operations API से auto-generate होता है
- प्रत्येक Cast Operations version में अलग API endpoints और schemas हो सकते हैं
- Mismatched provider version उपयोग करने से errors या unexpected behavior हो सकता है
- Version pinning compatibility और predictable behavior सुनिश्चित करता है

## अपना Cast Operations Version खोजना

### Method 1: Dashboard

1. अपने Cast Operations dashboard में login करें
2. **Settings** → **About** पर जाएं
3. version number देखें (जैसे "7.0.123")

### Method 2: API Endpoint

```bash
curl https://your-operations-instance.com/api/status
```

### Method 3: Docker Images

यदि आप Docker के साथ Cast Operations चला रहे हैं:

```bash
docker images | grep cast-operations
# tag देखें, जैसे cast-operations/dashboard:7.0.123
```

### Method 4: Helm Chart

यदि आप Helm उपयोग कर रहे हैं:

```bash
helm list -n cast-operations
# chart version जांचें
```

## Provider Configuration Templates

### Version 7.0.x के लिए Template

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # 123 को अपने exact build number से बदलें
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # आपका self-hosted URL
  api_key       = var.cast_operations_api_key
}
```

## Complete Self-Hosted Configuration Example

यहाँ एक self-hosted Cast Operations instance के लिए complete उदाहरण है:

```hcl
# versions.tf
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # आपके Cast Operations version से match होना चाहिए
    }
  }
  required_version = ">= 1.0"

  # वैकल्पिक: team collaboration के लिए remote state उपयोग करें
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}

# variables.tf
variable "cast_operations_url" {
  description = "Cast Operations instance URL"
  type        = string
  default     = "https://operations.yourcompany.com"
}

variable "cast_operations_api_key" {
  description = "Cast Operations API Key"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# providers.tf
provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.cast_operations_api_key
}

# main.tf
# teams बनाएं
resource "cast_operations_team" "infrastructure" {
  name        = "Infrastructure Team"
  description = "Infrastructure और operations team"
}

# Infrastructure monitors
resource "cast_operations_monitor" "database" {
  name        = "${var.environment}-database"
  description = "Database connectivity monitor"
  data        = jsonencode({
    hostname = "db.internal.yourcompany.com"
    port     = 5432
  })
}

resource "cast_operations_monitor" "application" {
  name        = "${var.environment}-application"
  description = "Application health monitor"
  data        = jsonencode({
    url = "https://app.yourcompany.com/health"
  })
}

# Status page
resource "cast_operations_status_page" "internal" {
  name        = "Internal Services Status"
  description = "Internal services के लिए status page"
}
```

## Self-Hosted के लिए Upgrade Process

अपना Cast Operations instance upgrade करते समय:

### 1. Pre-Upgrade Checklist

```bash
# current Terraform state backup करें
terraform state pull > backup-$(date +%Y%m%d).tfstate

# current Cast Operations version नोट करें
curl https://operations.yourcompany.com/api/status | jq '.version'

# current provider version नोट करें
terraform providers | grep cast-operations
```

### 2. Cast Operations Instance Upgrade करें

अपना standard Cast Operations upgrade process follow करें (Docker, Helm, आदि)

### 3. Terraform Provider Update करें

```hcl
# terraform block में version update करें
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.124"  # upgrade के बाद नया version
    }
  }
}
```

### 4. Test और Apply करें

```bash
# provider update करें
terraform init -upgrade

# कोई changes देखने के लिए plan करें
terraform plan

# यदि सब ठीक लगे तो apply करें
terraform apply
```

## Security Best Practices

### 1. API Key Management

```bash
# environment variables उपयोग करें
export CAST_OPERATIONS_API_KEY="your-api-key"

# या secret management system उपयोग करें
export CAST_OPERATIONS_API_KEY=$(vault kv get -field=api_key secret/cast-operations)
```

### 2. Least Privilege API Keys

Minimal required permissions के साथ API keys बनाएं:

- Monitor management
- Alert policy management
- Team management (यदि आवश्यक हो)

## Troubleshooting Self-Hosted Issues

### समस्या: Connection Refused

```
Error: connection refused
```

**Solutions**:

1. जांचें कि Cast Operations instance चल रहा है
2. API URL correct है verify करें
3. firewall/network connectivity जांचें
4. TLS certificates valid हैं verify करें

### समस्या: API Version Mismatch

```
Error: API version incompatible
```

**Solutions**:

1. Cast Operations version जांचें: `curl https://your-instance/api/status`
2. provider version को match करने के लिए update करें
3. `terraform init -upgrade` चलाएं
