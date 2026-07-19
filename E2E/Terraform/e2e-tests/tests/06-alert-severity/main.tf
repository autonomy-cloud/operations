terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "1.0.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.api_key
}

resource "cast_operations_alert_severity" "test" {
  name        = "terraform-e2e-alert-sev-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  description = "Alert severity created by Terraform E2E tests"
  color       = "#FF0000"
  order       = 99
}

output "alert_severity_id" {
  value       = cast_operations_alert_severity.test.id
  description = "ID of the created alert severity"
}

output "alert_severity_name" {
  value       = cast_operations_alert_severity.test.name
  description = "Name of the created alert severity"
}

output "alert_severity_description" {
  value       = cast_operations_alert_severity.test.description
  description = "Description of the created alert severity"
}

output "alert_severity_color" {
  value       = cast_operations_alert_severity.test.color
  description = "Color of the created alert severity"
}

output "alert_severity_order" {
  value       = cast_operations_alert_severity.test.order
  description = "Order of the created alert severity"
}
