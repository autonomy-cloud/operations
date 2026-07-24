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

resource "cast_operations_incident_state" "test" {
  name        = "terraform-e2e-state-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  description = "Incident state created by Terraform E2E tests"
  color       = "#0000FF"
  order       = 99
}

output "incident_state_id" {
  value       = cast_operations_incident_state.test.id
  description = "ID of the created incident state"
}

output "incident_state_name" {
  value       = cast_operations_incident_state.test.name
  description = "Name of the created incident state"
}

output "incident_state_description" {
  value       = cast_operations_incident_state.test.description
  description = "Description of the created incident state"
}

output "incident_state_color" {
  value       = cast_operations_incident_state.test.color
  description = "Color of the created incident state"
}

output "incident_state_order" {
  value       = cast_operations_incident_state.test.order
  description = "Order of the created incident state"
}
