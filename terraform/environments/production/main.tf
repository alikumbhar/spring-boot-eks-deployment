terraform {
  backend "s3" {
    bucket = "spring-boot-eks-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

module "vpc" {
  source = "../modules/vpc"
}

module "eks" {
  source     = "../modules/eks"
  subnet_ids = module.vpc.private_subnet_ids
}

module "ecr" {
  source = "../modules/ecr"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "cluster_id" {
  value = module.eks.cluster_id
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}