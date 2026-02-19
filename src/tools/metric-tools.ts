import { UserError } from "fastmcp"

import { MetricName } from "../brands"
import { getDakboardClient } from "../client/dakboard-client"
import type { CreateDataPointParams, DeleteDataPointsParams } from "../types"
import { formatMetricDetail, formatMetricList } from "../utils/formatters"

export const listMetrics = async (): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.listMetrics()
  return result.fold(
    (error) => {
      throw new UserError(`Failed to list metrics: ${error.message}`)
    },
    (metrics) => formatMetricList(metrics),
  )
}

export const getMetric = async (params: { metric_name: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.getMetric(MetricName(params.metric_name))
  return result.fold(
    (error) => {
      throw new UserError(`Failed to get metric ${params.metric_name}: ${error.message}`)
    },
    (metric) => formatMetricDetail(metric),
  )
}

export const createMetricDataPoints = async (params: {
  metric_name: string
  data_points: CreateDataPointParams[]
}): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.createMetricDataPoints(MetricName(params.metric_name), params.data_points)
  return result.fold(
    (error) => {
      throw new UserError(`Failed to create data points for metric ${params.metric_name}: ${error.message}`)
    },
    () => `Successfully created ${params.data_points.length} data point(s) for metric "${params.metric_name}".`,
  )
}

export const deleteMetric = async (params: { metric_name: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.deleteMetric(MetricName(params.metric_name))
  return result.fold(
    (error) => {
      throw new UserError(`Failed to delete metric ${params.metric_name}: ${error.message}`)
    },
    () => `Metric "${params.metric_name}" has been deleted.`,
  )
}

export const deleteMetricDataPoints = async (params: { metric_name: string; timestamp: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const deleteParams: DeleteDataPointsParams = { timestamp: params.timestamp }
  const result = await client.deleteMetricDataPoints(MetricName(params.metric_name), deleteParams)
  return result.fold(
    (error) => {
      throw new UserError(`Failed to delete data points for metric ${params.metric_name}: ${error.message}`)
    },
    () => `Data points at timestamp "${params.timestamp}" deleted from metric "${params.metric_name}".`,
  )
}
