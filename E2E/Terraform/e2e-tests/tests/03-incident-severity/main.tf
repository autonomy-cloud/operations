terraform {
  required_providers {
    cast = {
      source  = "autonomy-cloud/operations"
      version = "1.0.0"
    }
  }
}

provider "cast" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.api_key
}

resource "cast_operations_incident_severity" "test" {
  name        = "terraform-e2e-severity-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  description = "Incident severity created by Terraform E2E tests"
  color       = "#FFA500"
  order       = 99
}

output "incident_severity_id" {
  value       = cast_operations_incident_severity.test.id
  description = "ID of the created incident severity"
}

output "incident_severity_name" {
  value       = cast_operations_incident_severity.test.name
  description = "Name of the created incident severity"
}

output "incident_severity_description" {
  value       = cast_operations_incident_severity.test.description
  description = "Description of the created incident severity"
}

output "incident_severity_color" {
  value       = cast_operations_incident_severity.test.color
  description = "Color of the created incident severity"
}

output "incident_severity_order" {
  value       = cast_operations_incident_severity.test.order
  description = "Order of the created incident severity"
}
