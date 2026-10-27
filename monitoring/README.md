# Monitoring Stack for Spring Boot + EKS

This directory contains Prometheus alerting rules for monitoring the Spring Boot application running on Amazon EKS.

## Alert Rules

The following alert groups are defined:

### eks-cluster
- **HighNodeCPU**: Fires when node CPU utilization exceeds 100% over a 5-minute window
- **PodCrashLoop**: Fires when pods are in a crash loop (rate > 0 over 5 minutes)
- **KubeAPIHighLatency**: Fires when Kubernetes API 99th-percentile latency exceeds 1 second over 5 minutes

### application
- **AppLatencyHigh**: Fires when application health check latency exceeds acceptable thresholds
- **AppErrorRate**: Fires when application error rate exceeds threshold

## Usage

1. Deploy the Prometheus Operator to your EKS cluster
2. Create a `PrometheusRule` resource referencing these rules
3. Configure Alertmanager to handle notifications

## Alert Details

| Alert | Severity | Condition | Annotation |
|-------|----------|-----------|------------|
| HighNodeCPU | critical | node_cpu_seconds_total{mode!~"idle"} > 1 for 5m | Node CPU saturation may indicate resource exhaustion or node failure |
| PodCrashLoop | warning | rate(pod_container_status_restarts_total[5m]) > 0 | Pod restarting repeatedly - investigate application or infrastructure issues |
| KubeAPIHighLatency | warning | histogram_quantile(0.99, rate(kube_apiserver_response_seconds_bucket[5m])) > 1 | Kubernetes API latency impacting cluster operations |
| AppLatencyHigh | warning | avg(rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])) > 2 | Application responding slowly - may indicate performance degradation |
| AppErrorRate | warning | sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05 | Error rate above 5% - investigate recent deployments or infrastructure issues |