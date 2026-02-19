import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ApiKey } from "../../brands"
import { initializeDakboardClient } from "../../client/dakboard-client"
import { getLoop, listLoops } from "../loop-tools"

describe("loop-tools", () => {
  beforeEach(() => {
    initializeDakboardClient(ApiKey("test-key"))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should list loops", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([{ id: "l1", name: "Daily", created_at: "2024-01-01", updated_at: "2024-01-01" }]), {
        status: 200,
      }),
    )

    const result = await listLoops()
    expect(result).toContain("DAKboard Loops")
    expect(result).toContain("Daily")
  })

  it("should get loop detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "l1",
          name: "Daily",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          screens: [{ screen_id: "s1", duration: 30, order: 1 }],
        }),
        { status: 200 },
      ),
    )

    const result = await getLoop({ loop_id: "l1" })
    expect(result).toContain("Daily")
    expect(result).toContain("Screen s1")
    expect(result).toContain("30s")
  })

  it("should throw UserError on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Error", { status: 500, statusText: "Server Error" }))

    await expect(listLoops()).rejects.toThrow("Failed to list loops")
  })
})
