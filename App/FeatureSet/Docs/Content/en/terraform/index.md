# Terraform Provider Documentation

The Cast Operations Terraform Provider enables Infrastructure as Code (IaC) management of your Cast Operations monitoring, alerting, and observability resources.

## 📚 Documentation Sections

### [Getting Started](./quick-start.md)

Quick setup guide to get you started with the Cast Operations Terraform Provider in minutes.

### [Complete Provider Guide](./README.md)

Comprehensive documentation covering installation, configuration, resources, and best practices.

### [Self-Hosted Configuration](./self-hosted.md)

**Critical for self-hosted customers**: Version pinning, compatibility, and deployment strategies.

### [Examples](./examples.md)

Real-world examples and patterns for common Cast Operations Terraform configurations.

## 🚀 Quick Links

### For Cast Operations Cloud Customers

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### For Self-Hosted Customers

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Must match your Cast Operations version
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## ⚠️ Important for Self-Hosted Users

**Version Compatibility is Critical**: Always pin the Terraform provider version to exactly match your Cast Operations installation version. Mismatched versions can cause API compatibility issues.

## 🔗 External Resources

- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Repository**: [Cast Operations Source Code](https://github.com/autonomy-cloud/operations)
- **Community Support**: [Cast Operations Community](https://community.latticeruntime.com)

## 📋 Available Resources

The provider supports comprehensive Cast Operations resource management:

- **Projects & Teams**: Organize your monitoring structure
- **Monitors**: Website, API, port, heartbeat, and custom monitors
- **Incident Management**: Alert policies, on-call schedules, escalations
- **Status Pages**: Public and private status pages with custom branding
- **Service Catalog**: Service definitions and dependency mapping
- **Workflows**: Automated response and remediation workflows

## 🛠️ Support

For issues, questions, or contributions:

1. **Documentation Issues**: Create an issue in the [Cast Operations repository](https://github.com/autonomy-cloud/operations/issues)
2. **Provider Bugs**: Report in the main Cast Operations repository
3. **Feature Requests**: Discuss in the Cast Operations community
4. **General Questions**: Use the community forums

## 🎯 Next Steps

1. **New Users**: Start with the [Quick Start Guide](./quick-start.md)
2. **Self-Hosted**: Review the [Self-Hosted Configuration](./self-hosted.md)
3. **Advanced Users**: Explore [Examples](./examples.md) for complex setups
4. **Full Reference**: Check the [Complete Guide](./README.md) for all features
