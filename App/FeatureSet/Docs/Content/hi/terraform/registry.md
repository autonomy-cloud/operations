# Terraform Provider Installation और Usage Guide

## Terraform Registry से Installation

Cast Operations Terraform Provider official [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations) पर उपलब्ध है।

### Cast Operations Cloud Users के लिए

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # latest compatible version उपयोग करें
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### Self-Hosted Cast Operations Users के लिए

⚠️ **Critical**: Self-hosted customers को provider version को exactly अपने Cast Operations installation से match करने के लिए pin करना होगा।

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # अपने exact Cast Operations version से बदलें
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # आपका self-hosted URL
  api_key       = var.cast_operations_api_key
}
```

## Self-Hosted के लिए Version Pinning क्यों?

Cast Operations Terraform provider Cast Operations API specification से automatically generated है। प्रत्येक Cast Operations version में हो सकते हैं:

- अलग API endpoints
- Updated resource schemas
- नई या removed features
- Changed validation rules

आपके Cast Operations installation से match न करने वाले provider version का उपयोग करने पर हो सकता है:

- API compatibility errors
- Failed resource creation/updates
- Unexpected behavior
- Resource state drift

## अपना Cast Operations Version खोजना

### Method 1: Dashboard

1. अपने Cast Operations dashboard में login करें
2. **Settings** → **About** पर जाएं
3. version number नोट करें (जैसे "7.0.123")

### Method 2: API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### Method 3: Docker

```bash
docker images | grep cast-operations
# tag देखें, जैसे cast-operations/dashboard:7.0.123
```

## Provider Registry Information

- **Registry URL**: https://registry.terraform.io/providers/autonomy-cloud/operations
- **Source Repository**: https://github.com/autonomy-cloud/operations
- **Documentation**: https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs
- **Releases**: https://github.com/autonomy-cloud/operations

## Version Compatibility Matrix

| Cast Operations Version | Provider Version | Terraform Config       |
| ----------------- | ---------------- | ---------------------- |
| 7.0.x             | 7.0.x            | `version = "~> 7.0.0"` |
| 7.1.x             | 7.1.x            | `version = "~> 7.1.0"` |
| Latest Cloud      | Latest Provider  | `version = "~> 7.0"`   |

## Installation Steps

1. **अपनी Terraform configuration** provider block के साथ बनाएं
2. **Terraform Initialize करें**: `terraform init`
3. **अपनी API key सेट करें**: अपनी API key के साथ `terraform.tfvars` बनाएं
4. **अपना deployment plan करें**: `terraform plan`
5. **अपनी configuration apply करें**: `terraform apply`

## Registry Updates

Provider automatically Terraform Registry पर publish होता है जब नए Cast Operations versions release होते हैं। Cloud users semantic versioning (`~> 7.0`) उपयोग करके automatically compatible updates प्राप्त कर सकते हैं, जबकि self-hosted users को exact versions पर pin करना चाहिए।
