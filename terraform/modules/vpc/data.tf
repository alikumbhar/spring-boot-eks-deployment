locals { cluster_name = "spring-boot-eks" }

data "aws_availability_zones" "available" {
  state = "available"
}