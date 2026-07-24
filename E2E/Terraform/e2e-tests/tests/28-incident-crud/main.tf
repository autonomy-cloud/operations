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

# Test: Incident CRUD Operations
#
# This test validates:
# 1. Creating incidents with various configurations
# 2. Server defaults for incident states and severities
# 3. Complex fields like custom_fields
# 4. Idempotency

# First, create incident severity and state for testing
resource "cast_operations_incident_severity" "test_severity" {
  name        = "TF Test Severity ${random_id.suffix.hex}"
  description = "Test severity for incident CRUD"
  color       = "#e74c3c"
  order       = 100
}

resource "cast_operations_incident_state" "test_state" {
  name        = "TF Test State ${random_id.suffix.hex}"
  description = "Test state for incident CRUD"
  color       = "#3498db"
  order       = 100
}

# Test Case 1: Basic Incident
resource "cast_operations_incident" "basic" {
  title                       = "TF Basic Incident ${random_id.suffix.hex}"
  description                 = "Basic incident created by Terraform E2E tests"
  current_incident_state_id   = cast_operations_incident_state.test_state.id
  incident_severity_id        = cast_operations_incident_severity.test_severity.id
}

# Test Case 2: Incident with root cause
resource "cast_operations_incident" "with_root_cause" {
  title                       = "TF Incident With Root Cause ${random_id.suffix.hex}"
  description                 = "Incident with detailed root cause analysis"
  current_incident_state_id   = cast_operations_incident_state.test_state.id
  incident_severity_id        = cast_operations_incident_severity.test_severity.id
  root_cause                  = "Database connection pool exhausted due to high traffic"
}

# Test Case 3: Incident with visibility settings
resource "cast_operations_incident" "visibility_settings" {
  title                               = "TF Visibility Incident ${random_id.suffix.hex}"
  description                         = "Incident with custom visibility"
  current_incident_state_id           = cast_operations_incident_state.test_state.id
  incident_severity_id                = cast_operations_incident_severity.test_severity.id
  is_visible_on_status_page                                      = true
  should_status_page_subscribers_be_notified_on_incident_created = false
}

# Test Case 4: Incident with labels
resource "cast_operations_label" "incident_label" {
  name        = "TF Incident Label ${random_id.suffix.hex}"
  description = "Label for incident testing"
  color       = "#9b59b6"
}

resource "cast_operations_incident" "with_labels" {
  title                       = "TF Labeled Incident ${random_id.suffix.hex}"
  description                 = "Incident with labels attached"
  current_incident_state_id   = cast_operations_incident_state.test_state.id
  incident_severity_id        = cast_operations_incident_severity.test_severity.id
  labels                      = [cast_operations_label.incident_label.id]
}

# Outputs
output "basic_incident_id" {
  value       = cast_operations_incident.basic.id
  description = "Basic incident ID"
}

output "basic_incident_title" {
  value       = cast_operations_incident.basic.title
  description = "Basic incident title"
}

output "with_root_cause_id" {
  value       = cast_operations_incident.with_root_cause.id
  description = "Incident with root cause ID"
}

output "with_root_cause_root_cause" {
  value       = cast_operations_incident.with_root_cause.root_cause
  description = "Root cause value"
}

output "visibility_settings_id" {
  value       = cast_operations_incident.visibility_settings.id
  description = "Visibility settings incident ID"
}

output "with_labels_id" {
  value       = cast_operations_incident.with_labels.id
  description = "Labeled incident ID"
}

output "severity_id" {
  value       = cast_operations_incident_severity.test_severity.id
  description = "Test severity ID"
}

output "state_id" {
  value       = cast_operations_incident_state.test_state.id
  description = "Test state ID"
}

output "label_id" {
  value       = cast_operations_label.incident_label.id
  description = "Incident label ID"
}

# Server-computed fields
output "basic_incident_slug" {
  value       = cast_operations_incident.basic.slug
  description = "Server-generated slug"
}

output "basic_incident_created_at" {
  value       = cast_operations_incident.basic.created_at
  description = "Server-generated creation timestamp"
}
