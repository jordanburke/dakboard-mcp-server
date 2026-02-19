import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ApiKey } from "../../brands"
import { initializeDakboardClient } from "../../client/dakboard-client"
import { getDevice, listDevices, updateDevice } from "../device-tools"

describe("device-tools", () => {
  beforeEach(() => {
    initializeDakboardClient(ApiKey("test-key"))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should list devices", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: "d1",
            name: "Kitchen Pi",
            ip_addr: "192.168.1.100",
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
          },
        ]),
        { status: 200 },
      ),
    )

    const result = await listDevices()
    expect(result).toContain("DAKboard Devices")
    expect(result).toContain("Kitchen Pi")
  })

  it("should get device detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "d1",
          name: "Kitchen Pi",
          ip_addr: "192.168.1.100",
          screen_id: "s1",
          model: "Raspberry Pi 4",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        }),
        { status: 200 },
      ),
    )

    const result = await getDevice({ device_id: "d1" })
    expect(result).toContain("Kitchen Pi")
    expect(result).toContain("192.168.1.100")
    expect(result).toContain("Raspberry Pi 4")
  })

  it("should update device", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "d1",
          name: "Updated Pi",
          ip_addr: "192.168.1.200",
          created_at: "2024-01-01",
          updated_at: "2024-01-02",
        }),
        { status: 200 },
      ),
    )

    const result = await updateDevice({ device_id: "d1", name: "Updated Pi" })
    expect(result).toContain("updated successfully")
    expect(result).toContain("Updated Pi")
  })

  it("should throw UserError on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Error", { status: 403, statusText: "Forbidden" }))

    await expect(listDevices()).rejects.toThrow("Failed to list devices")
  })
})
