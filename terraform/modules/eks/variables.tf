variable "cluster_name" {
  type    = string
  default = "spring-boot-eks"
}

variable "subnet_ids" {
  type = list(string)
}