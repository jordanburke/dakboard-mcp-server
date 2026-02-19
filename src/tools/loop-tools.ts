import { UserError } from "fastmcp"

import { LoopId } from "../brands"
import { getDakboardClient } from "../client/dakboard-client"
import { formatLoopDetail, formatLoopList } from "../utils/formatters"

export const listLoops = async (): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.listLoops()
  return result.fold(
    (error) => {
      throw new UserError(`Failed to list loops: ${error.message}`)
    },
    (loops) => formatLoopList(loops),
  )
}

export const getLoop = async (params: { loop_id: string }): Promise<string> => {
  const client = getDakboardClient()
  if (!client) throw new UserError("DAKboard client not initialized. Check DAKBOARD_API_KEY.")

  const result = await client.getLoop(LoopId(params.loop_id))
  return result.fold(
    (error) => {
      throw new UserError(`Failed to get loop ${params.loop_id}: ${error.message}`)
    },
    (loop) => formatLoopDetail(loop),
  )
}
