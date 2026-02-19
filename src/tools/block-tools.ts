import { UserError } from "fastmcp"

import { BlockId, ScreenId } from "../brands"
import { getDakboardClient } from "../client/dakboard-client"
import type { UpdateBlockParams } from "../types"
import { formatBlockDetail, formatBlockList } from "../utils/formatters"

export const listBlocks = async (params: { screen_id: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.listBlocks(ScreenId(params.screen_id))
  return result.fold(
    (error) => {
      throw new UserError(`Failed to list blocks for screen ${params.screen_id}: ${error.message}`)
    },
    (blocks) => formatBlockList(blocks, params.screen_id),
  )
}

export const getBlock = async (params: { screen_id: string; block_id: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.getBlock(ScreenId(params.screen_id), BlockId(params.block_id))
  return result.fold(
    (error) => {
      throw new UserError(`Failed to get block ${params.block_id}: ${error.message}`)
    },
    (block) => formatBlockDetail(block),
  )
}

export const updateBlock = async (
  params: { screen_id: string; block_id: string } & UpdateBlockParams,
): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const { screen_id, block_id, ...updateParams } = params
  const result = await client.updateBlock(ScreenId(screen_id), BlockId(block_id), updateParams)
  return result.fold(
    (error) => {
      throw new UserError(`Failed to update block ${block_id}: ${error.message}`)
    },
    (block) => `Block updated successfully.\n\n${formatBlockDetail(block)}`,
  )
}
