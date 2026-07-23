# Terraform Provider Quick Start Guide

This guide will help you get started with the Cast Operations Terraform Provider in just a few minutes.

## Prerequisites

- Terraform >= 1.0 installed
- Cast Operations account (Cloud or Self-Hosted)
- Cast Operations API key

## Step 1: Create API Key

### For Cast Operations Cloud

1. Go to [Cast Operations Cloud](https://latticeruntime.com) and log in
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it "Terraform Provider"
5. Select required permissions
6. Copy the generated API key

### For Self-Hosted Cast Operations

1. Access your Cast Operations instance
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name it "Terraform Provider"
5. Select required permissions
6. Copy the generated API key

## Step 2: Create Terraform Configuration

Create a new directory and `main.tf` file:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # For Cloud customers
      version = "~> 7.0"

      # For Self-Hosted customers - pin to your exact version
      # version = "= 7.0.123"  # Replace with your Cast Operations version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # For Cloud customers
  cast_operations_url = "https://latticeruntime.com"

  # For Self-Hosted customers - use your instance URL
  # cast_operations_url = "https://operations.yourcompany.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "Cast Operations API Key"
  type        = string
  sensitive   = true
}

# Note: Projects must be created manually in the Cast Operations dashboard
# Use your existing project ID here
variable "project_id" {
  description = "Cast Operations project ID"
  type        = string
}

# Create a simple website monitor
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Monitor for website uptime"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Output the monitor ID
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## Step 3: Create Variables File

Create `terraform.tfvars`:

```hcl
# terraform.tfvars
cast_operations_api_key = "your-api-key-here"
project_id        = "your-project-id-here"  # Get this from Cast Operations dashboard
```

**Important**: Add `terraform.tfvars` to your `.gitignore` to keep API keys secret!

## Step 4: Initialize and Apply

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

## Step 5: Verify Resources

1. Check your Cast Operations dashboard
2. Go to your existing project
3. Verify the "Website Monitor" is created and running

## Next Steps

1. **Explore More Resources**: Check the [full documentation](./README.md) for all available resources
2. **Set Up Alerting**: Add alert policies and notification channels
3. **Create Status Pages**: Set up public status pages for your services
4. **Organize with Teams**: Create teams and assign permissions

## Version-Specific Examples

### Cloud Customers (Latest Version)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Always gets latest compatible 7.x version
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### Self-Hosted Customers (Version Pinned)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Must match your Cast Operations version exactly
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # Your self-hosted URL
  api_key       = var.cast_operations_api_key
}
```

## Troubleshooting Quick Start

### Issue: Provider not found

```
Error: Failed to query available provider packages
```

**Solution**: Run `terraform init` to download the provider

### Issue: Authentication failed

```
Error: Invalid API key
```

**Solution**:

1. Verify your API key in Cast Operations dashboard
2. Check the API key has sufficient permissions
3. Ensure `cast_operations_url` is correct for your instance

### Issue: Version mismatch (Self-Hosted)

```
Error: API version incompatible
```

**Solution**:

1. Check your Cast Operations version in the dashboard
2. Update the provider version to match exactly
3. Run `terraform init -upgrade`

## Clean Up

To remove all resources created in this quick start:

```bash
terraform destroy
```

This will delete the monitor and project created during the quick start.
