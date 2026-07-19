# Terraform Provider Documentation

Cast Operations Terraform Provider आपको Terraform के माध्यम से Infrastructure as Code (IaC) management करने की अनुमति देता है — monitoring, alerting और observability resources के लिए।

## Documentation Sections

### [Getting Started](./quick-start.md)

Cast Operations Terraform Provider के साथ मिनटों में शुरू करने के लिए Quick setup guide।

### [Complete Provider Guide](./README.md)

Installation, configuration, resources और best practices को cover करने वाली व्यापक documentation।

### [Self-Hosted Configuration](./self-hosted.md)

**Self-hosted customers के लिए Critical**: Version pinning, compatibility और deployment strategies।

### [Examples](./examples.md)

सामान्य Cast Operations Terraform configurations के लिए real-world examples और patterns।

## Quick Links

### Cast Operations Cloud Customers के लिए

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
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### Self-Hosted Customers के लिए

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # अपने Cast Operations version से match होना चाहिए
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## Self-Hosted Users के लिए महत्वपूर्ण

**Version Compatibility Critical है**: Terraform provider version को हमेशा exactly अपने Cast Operations installation version से match करने के लिए pin करें। Mismatched versions API compatibility issues पैदा कर सकते हैं।

## External Resources

- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Repository**: [Cast Operations Source Code](https://github.com/autonomy-cloud/operations)
- **Community Support**: [Cast Operations Community](https://community.visca.ai)

## उपलब्ध Resources

Provider, Cast Operations resource management का व्यापक समर्थन करता है:

- **Projects & Teams**: अपनी monitoring structure organize करें
- **Monitors**: Website, API, port, heartbeat और custom monitors
- **Incident Management**: Alert policies, on-call schedules, escalations
- **Status Pages**: custom branding के साथ Public और private status pages
- **Service Catalog**: Service definitions और dependency mapping
- **Workflows**: Automated response और remediation workflows

## Support

Issues, questions, या contributions के लिए:

1. **Documentation Issues**: [Cast Operations repository](https://github.com/autonomy-cloud/operations/issues) में issue बनाएं
2. **Provider Bugs**: main Cast Operations repository में report करें
3. **Feature Requests**: Cast Operations community में discuss करें
4. **General Questions**: community forums उपयोग करें

## Next Steps

1. **New Users**: [Quick Start Guide](./quick-start.md) से शुरू करें
2. **Self-Hosted**: [Self-Hosted Configuration](./self-hosted.md) review करें
3. **Advanced Users**: complex setups के लिए [Examples](./examples.md) explore करें
4. **Full Reference**: सभी features के लिए [Complete Guide](./README.md) जांचें
