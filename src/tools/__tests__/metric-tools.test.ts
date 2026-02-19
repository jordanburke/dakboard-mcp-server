import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ApiKey } from "../../brands"
import { initializeDakboardClient } from "../../client/dakboard-client"
import { createMetricDataPoints, deleteMetric, deleteMetricDataPoints, getMetric, listMetrics } from "../metric-tools"

describe("metric-tools", () => {
  beforeEach(() => {
    initializeDakboardClient(ApiKey("test-key"))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should list metrics", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([{ metric_name: "temperature", created_at: "2024-01-01", updated_at: "2024-01-01" }]),
        { status: 200 },
      ),
    )

    const result = await listMetrics()
    expect(result).toContain("DAKboard Metrics")
    expect(result).toContain("temperature")
  })

  it("should get metric detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          metric_name: "temperature",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          data_points: [{ timestamp: "2024-06-15T12:00:00Z", value: 72 }],
        }),
        { status: 200 },
      ),
    )

    const result = await getMetric({ metric_name: "temperature" })
    expect(result).toContain("temperature")
    expect(result).toContain("72")
  })

  it("should create metric data points", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([{ value: 72 }]), { status: 200 }))

    const result = await createMetricDataPoints({
      metric_name: "temperature",
      data_points: [{ value: 72 }],
    })
    expect(result).toContain("Successfully created 1 data point(s)")
    expect(result).toContain("temperature")
  })

  it("should delete metric", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 200 }))

    const result = await deleteMetric({ metric_name: "temperature" })
    expect(result).toContain("deleted")
    expect(result).toContain("temperature")
  })

  it("should delete metric data points", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 200 }))

    const result = await deleteMetricDataPoints({
      metric_name: "temperature",
      timestamp: "2024-06-15T12:00:00Z",
    })
    expect(result).toContain("deleted")
    expect(result).toContain("temperature")
  })

  it("should throw UserError on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Error", { status: 500, statusText: "Server Error" }))

    await expect(listMetrics()).rejects.toThrow("Failed to list metrics")
  })
})
