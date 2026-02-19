import { UserError } from "fastmcp"

import { ScreenId } from "../brands"
import { getDakboardClient } from "../client/dakboard-client"
import type { UpdateScreenParams } from "../types"
import { formatScreenDetail, formatScreenList } from "../utils/formatters"

export const listScreens = async (): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.listScreens()
  return result.fold(
    (error) => {
      throw new UserError(`Failed to list screens: ${error.message}`)
    },
    (screens) => formatScreenList(screens),
  )
}

export const getScreen = async (params: { screen_id: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.getScreen(ScreenId(params.screen_id))
  return result.fold(
    (error) => {
      throw new UserError(`Failed to get screen ${params.screen_id}: ${error.message}`)
    },
    (screen) => formatScreenDetail(screen),
  )
}

export const updateScreen = async (params: { screen_id: string } & UpdateScreenParams): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const { screen_id, ...updateParams } = params
  const result = await client.updateScreen(ScreenId(screen_id), updateParams)
  return result.fold(
    (error) => {
      throw new UserError(`Failed to update screen ${screen_id}: ${error.message}`)
    },
    (screen) => `Screen updated successfully.\n\n${formatScreenDetail(screen)}`,
  )
}
