terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "1.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.api_key
}

resource "random_id" "suffix" {
  byte_length = 4
}

# Comprehensive CRUD test for label resource
resource "cast_operations_label" "test" {
  name        = "TF CRUD Label ${random_id.suffix.hex}"
  description = var.label_description
  color       = var.label_color
}

output "label_id" {
  value = cast_operations_label.test.id
}

output "label_name" {
  value = cast_operations_label.test.name
}

output "label_description" {
  value = cast_operations_label.test.description
}

output "label_color" {
  value = cast_operations_label.test.color
}
