terraform {
  required_providers {
    cast = {
      source  = "autonomy-cloud/operations"
      version = "1.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "cast" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.api_key
}

resource "random_id" "suffix" {
  byte_length = 4
}

# Test: Label order idempotency
# This test ensures labels are treated as order-independent and do not cause drift.

resource "cast_operations_label" "first" {
  name        = "TF E2E Label First ${random_id.suffix.hex}"
  description = "First label for order idempotency"
  color       = "#3498db"
}

resource "cast_operations_label" "second" {
  name        = "TF E2E Label Second ${random_id.suffix.hex}"
  description = "Second label for order idempotency"
  color       = "#e74c3c"
}

resource "cast_operations_probe" "with_labels" {
  key           = "tf-e2e-probe-label-order-${random_id.suffix.hex}"
  name          = "TF E2E Probe Label Order ${random_id.suffix.hex}"
  description   = "Probe with labels in non-sorted order"
  probe_version = "1.0.0"

  # Intentionally non-sorted to verify order does not cause drift
  labels = [
    cast_operations_label.second.id,
    cast_operations_label.first.id,
  ]
}

output "probe_id" {
  value       = cast_operations_probe.with_labels.id
  description = "ID of the probe with labels"
}

output "label_first_id" {
  value       = cast_operations_label.first.id
  description = "ID of the first label"
}

output "label_second_id" {
  value       = cast_operations_label.second.id
  description = "ID of the second label"
}

output "probe_labels" {
  value       = cast_operations_probe.with_labels.labels
  description = "Labels attached to the probe"
}
