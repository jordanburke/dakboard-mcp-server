import { UserError } from "fastmcp"
import type { Either } from "functype/either"
import { Left } from "functype/either"

import { BlockId, ScreenId } from "../brands"
import { getDakboardClient } from "../client/dakboard-client"
import type { UpdateBlockParams } from "../types"
import { formatBlockDetail, formatBlockList } from "../utils/formatters"

export const listBlocks = async (params: { screen_id: string }): Promise<Either<UserError, string>> => {
  const client = getDakboardClient()
  if (client.isNone()) return Left(new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY."))

  const result = await client.orThrow().listBlocks(ScreenId(params.screen_id))
  return result
    .mapLeft((error) => new UserError(`Failed to list blocks for screen ${params.screen_id}: ${error.message}`))
    .map((blocks) => formatBlockList(blocks, params.screen_id))
}

export const getBlock = async (params: { screen_id: string; block_id: string }): Promise<Either<UserError, string>> => {
  const client = getDakboardClient()
  if (client.isNone()) return Left(new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY."))

  const result = await client.orThrow().getBlock(ScreenId(params.screen_id), BlockId(params.block_id))
  return result
    .mapLeft((error) => new UserError(`Failed to get block ${params.block_id}: ${error.message}`))
    .map((block) => formatBlockDetail(block))
}

export const updateBlock = async (
  params: { screen_id: string; block_id: string } & UpdateBlockParams,
): Promise<Either<UserError, string>> => {
  const client = getDakboardClient()
  if (client.isNone()) return Left(new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY."))

  const { screen_id, block_id, ...updateParams } = params
  const result = await client.orThrow().updateBlock(ScreenId(screen_id), BlockId(block_id), updateParams)
  return result
    .mapLeft((error) => new UserError(`Failed to update block ${block_id}: ${error.message}`))
    .map((block) => `Block updated successfully.\n\n${formatBlockDetail(block)}`)
}
