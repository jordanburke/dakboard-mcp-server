import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ApiKey } from "../../brands"
import { initializeDakboardClient } from "../../client/dakboard-client"
import { getBlock, listBlocks, updateBlock } from "../block-tools"

describe("block-tools", () => {
  beforeEach(() => {
    initializeDakboardClient(ApiKey("test-key"))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should list blocks", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: "b1",
            screen_id: "s1",
            name: "Weather",
            w: 400,
            h: 300,
            x: 0,
            y: 0,
            is_disabled: 0,
            z_index: 1,
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
          },
        ]),
        { status: 200 },
      ),
    )

    const result = await listBlocks({ screen_id: "s1" })
    expect(result).toContain("Blocks for Screen s1")
    expect(result).toContain("Weather")
  })

  it("should get block detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "b1",
          screen_id: "s1",
          name: "Weather",
          w: 400,
          h: 300,
          x: 0,
          y: 0,
          is_disabled: 0,
          z_index: 1,
          text: "Current temp: 72F",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        }),
        { status: 200 },
      ),
    )

    const result = await getBlock({ screen_id: "s1", block_id: "b1" })
    expect(result).toContain("Weather")
    expect(result).toContain("Current temp: 72F")
  })

  it("should update block", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "b1",
          screen_id: "s1",
          name: "Updated Weather",
          w: 500,
          h: 300,
          x: 0,
          y: 0,
          is_disabled: 0,
          z_index: 1,
          created_at: "2024-01-01",
          updated_at: "2024-01-02",
        }),
        { status: 200 },
      ),
    )

    const result = await updateBlock({ screen_id: "s1", block_id: "b1", name: "Updated Weather", w: 500 })
    expect(result).toContain("updated successfully")
    expect(result).toContain("Updated Weather")
  })

  it("should throw UserError on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Error", { status: 500, statusText: "Server Error" }))

    await expect(listBlocks({ screen_id: "s1" })).rejects.toThrow("Failed to list blocks")
  })
})
