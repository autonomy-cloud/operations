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

resource "cast_operations_label" "test" {
  name        = "terraform-e2e-label-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  description = "Label created by Terraform E2E tests"
  color       = "#FF5733"
}

output "label_id" {
  value       = cast_operations_label.test.id
  description = "ID of the created label"
}

output "label_name" {
  value       = cast_operations_label.test.name
  description = "Name of the created label"
}

output "label_description" {
  value       = cast_operations_label.test.description
  description = "Description of the created label"
}

output "label_color" {
  value       = cast_operations_label.test.color
  description = "Color of the created label"
}
