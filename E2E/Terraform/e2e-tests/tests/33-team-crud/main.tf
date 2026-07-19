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

# Test: Team CRUD Operations

# Test Case 1: Basic Team
resource "cast_operations_team" "basic" {
  name        = "TF Basic Team ${random_id.suffix.hex}"
  description = "Basic team for testing"
}

# Test Case 2: Team with description
resource "cast_operations_team" "detailed" {
  name        = "TF Detailed Team ${random_id.suffix.hex}"
  description = "A detailed team with comprehensive description for testing various scenarios"
}

# Test Case 3: Multiple teams (uniqueness)
resource "cast_operations_team" "engineering" {
  name        = "TF Engineering Team ${random_id.suffix.hex}"
  description = "Engineering team"
}

resource "cast_operations_team" "operations" {
  name        = "TF Operations Team ${random_id.suffix.hex}"
  description = "Operations team"
}

# Outputs
output "basic_team_id" {
  value       = cast_operations_team.basic.id
  description = "Basic team ID"
}

output "detailed_team_id" {
  value       = cast_operations_team.detailed.id
  description = "Detailed team ID"
}

output "engineering_team_id" {
  value       = cast_operations_team.engineering.id
  description = "Engineering team ID"
}

output "operations_team_id" {
  value       = cast_operations_team.operations.id
  description = "Operations team ID"
}

output "basic_team_slug" {
  value       = cast_operations_team.basic.slug
  description = "Server-generated slug"
}
