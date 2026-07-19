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

resource "cast_operations_alert_state" "test" {
  name        = "terraform-e2e-alert-state-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  description = "Alert state created by Terraform E2E tests"
  color       = "#800080"
  order       = 99
}

output "alert_state_id" {
  value       = cast_operations_alert_state.test.id
  description = "ID of the created alert state"
}

output "alert_state_name" {
  value       = cast_operations_alert_state.test.name
  description = "Name of the created alert state"
}

output "alert_state_description" {
  value       = cast_operations_alert_state.test.description
  description = "Description of the created alert state"
}

output "alert_state_color" {
  value       = cast_operations_alert_state.test.color
  description = "Color of the created alert state"
}

output "alert_state_order" {
  value       = cast_operations_alert_state.test.order
  description = "Order of the created alert state"
}
