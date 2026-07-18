variable "oneuptime_url" {
  type        = string
  description = "Cast Operations API URL"
}

variable "api_key" {
  type        = string
  description = "Cast Operations API Key"
  sensitive   = true
}


variable "label_name" {
  type        = string
  description = "Label name"
  default     = "terraform-crud-test-label"
}

variable "label_description" {
  type        = string
  description = "Label description"
  default     = "Initial description for CRUD test"
}

variable "label_color" {
  type        = string
  description = "Label color"
  default     = "#FF0000"
}
