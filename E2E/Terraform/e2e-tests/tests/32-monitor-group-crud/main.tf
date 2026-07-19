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

# Test: Monitor Group CRUD Operations

# Test Case 1: Basic Monitor Group
resource "cast_operations_monitor_group" "basic" {
  name        = "TF Basic Monitor Group ${random_id.suffix.hex}"
  description = "Basic monitor group for testing"
}

# Test Case 2: Monitor Group with labels
resource "cast_operations_label" "group_label" {
  name        = "TF Group Label ${random_id.suffix.hex}"
  description = "Label for monitor group testing"
  color       = "#27ae60"
}

resource "cast_operations_monitor_group" "with_labels" {
  name        = "TF Labeled Monitor Group ${random_id.suffix.hex}"
  description = "Monitor group with labels"
  labels      = [cast_operations_label.group_label.id]
}

# Test Case 3: Multiple monitor groups
resource "cast_operations_monitor_group" "secondary" {
  name        = "TF Secondary Monitor Group ${random_id.suffix.hex}"
  description = "Secondary monitor group"
}

# Outputs
output "basic_group_id" {
  value       = cast_operations_monitor_group.basic.id
  description = "Basic group ID"
}

output "labeled_group_id" {
  value       = cast_operations_monitor_group.with_labels.id
  description = "Labeled group ID"
}

output "secondary_group_id" {
  value       = cast_operations_monitor_group.secondary.id
  description = "Secondary group ID"
}

output "label_id" {
  value       = cast_operations_label.group_label.id
  description = "Group label ID"
}

output "basic_group_slug" {
  value       = cast_operations_monitor_group.basic.slug
  description = "Server-generated slug"
}
