# Terraform Provider Installation and Usage Guide

## Installation from Terraform Registry

The Cast Operations Terraform Provider is available on the official [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

### For Cast Operations Cloud Users

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Use latest compatible version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### For Self-Hosted Cast Operations Users

⚠️ **Critical**: Self-hosted customers must pin the provider version to match their Cast Operations installation exactly.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Replace with your exact Cast Operations version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # Your self-hosted URL
  api_key       = var.cast_operations_api_key
}
```

## Why Version Pinning for Self-Hosted?

The Cast Operations Terraform provider is automatically generated from the Cast Operations API specification. Each Cast Operations version may have:

- Different API endpoints
- Updated resource schemas
- New or removed features
- Changed validation rules

Using a provider version that doesn't match your Cast Operations installation can result in:

- API compatibility errors
- Failed resource creation/updates
- Unexpected behavior
- Resource state drift

## Finding Your Cast Operations Version

### Method 1: Dashboard

1. Log into your Cast Operations dashboard
2. Go to **Settings** → **About**
3. Note the version number (e.g., "7.0.123")

### Method 2: API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### Method 3: Docker

```bash
docker images | grep cast-operations
# Look for the tag, e.g., cast-operations/dashboard:7.0.123
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

## Quick Start Example

```hcl
# Configure the provider
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Adjust for self-hosted
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Adjust for self-hosted
  api_key       = var.cast_operations_api_key
}

# Create a project
resource "cast_operations_project" "example" {
  name        = "Terraform Example"
  description = "Created with Terraform"
}

# Create a website monitor
resource "cast_operations_monitor" "website" {
  name       = "Website Monitor"
  project_id = cast_operations_project.example.id

  monitor_type = "website"
  url          = "https://example.com"
  interval     = "5m"

  tags = {
    managed_by = "terraform"
  }
}
```

## Installation Steps

1. **Create your Terraform configuration** with the provider block
2. **Initialize Terraform**: `terraform init`
3. **Set your API key**: Create `terraform.tfvars` with your API key
4. **Plan your deployment**: `terraform plan`
5. **Apply your configuration**: `terraform apply`

## Getting Help

- **Full Documentation**: See the [complete Terraform documentation](./README.md)
- **Self-Hosted Guide**: Check the [self-hosted configuration guide](./self-hosted.md)
- **Examples**: Browse [configuration examples](./examples.md)
- **Quick Start**: Follow the [quick start guide](./quick-start.md)

## Registry Updates

The provider is automatically published to the Terraform Registry when new Cast Operations versions are released. Cloud users can use semantic versioning (`~> 7.0`) to automatically get compatible updates, while self-hosted users should pin to exact versions.
