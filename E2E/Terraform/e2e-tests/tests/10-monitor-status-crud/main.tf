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

# Comprehensive CRUD test for monitor_status resource
resource "cast_operations_monitor_status" "test" {
  name        = var.status_name
  description = var.status_description
  color       = var.status_color
  priority    = var.status_priority
}

output "monitor_status_id" {
  value       = cast_operations_monitor_status.test.id
  description = "ID of the created monitor status"
}

output "monitor_status_name" {
  value       = cast_operations_monitor_status.test.name
  description = "Name of the created monitor status"
}

output "monitor_status_description" {
  value       = cast_operations_monitor_status.test.description
  description = "Description of the created monitor status"
}

output "monitor_status_color" {
  value       = cast_operations_monitor_status.test.color
  description = "Color of the created monitor status"
}

output "monitor_status_priority" {
  value       = cast_operations_monitor_status.test.priority
  description = "Priority of the created monitor status"
}
