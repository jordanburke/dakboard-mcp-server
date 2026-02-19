import { UserError } from "fastmcp"

import { DeviceId } from "../brands"
import { getDakboardClient } from "../client/dakboard-client"
import type { UpdateDeviceParams } from "../types"
import { formatDeviceDetail, formatDeviceList } from "../utils/formatters"

export const listDevices = async (): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.listDevices()
  return result.fold(
    (error) => {
      throw new UserError(`Failed to list devices: ${error.message}`)
    },
    (devices) => formatDeviceList(devices),
  )
}

export const getDevice = async (params: { device_id: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.getDevice(DeviceId(params.device_id))
  return result.fold(
    (error) => {
      throw new UserError(`Failed to get device ${params.device_id}: ${error.message}`)
    },
    (device) => formatDeviceDetail(device),
  )
}

export const updateDevice = async (params: { device_id: string } & UpdateDeviceParams): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const { device_id, ...updateParams } = params
  const result = await client.updateDevice(DeviceId(device_id), updateParams)
  return result.fold(
    (error) => {
      throw new UserError(`Failed to update device ${device_id}: ${error.message}`)
    },
    (device) => `Device updated successfully.\n\n${formatDeviceDetail(device)}`,
  )
}
