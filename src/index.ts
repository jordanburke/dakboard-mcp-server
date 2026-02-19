import dotenv from "dotenv"
import { FastMCP } from "fastmcp"
import { z } from "zod"

import { ApiKey } from "./brands"
import { getDakboardClient, initializeDakboardClient } from "./client/dakboard-client"
import {
  createMetricDataPoints,
  deleteMetric,
  deleteMetricDataPoints,
  getBlock,
  getDevice,
  getLoop,
  getMetric,
  getScreen,
  listBlocks,
  listDevices,
  listLoops,
  listMetrics,
  listScreens,
  updateBlock,
  updateDevice,
  updateScreen,
} from "./tools"

dotenv.config()

declare const __VERSION__: string
const VERSION = (typeof __VERSION__ !== "undefined" ? __VERSION__ : "0.0.0-dev") as `${number}.${number}.${number}`

const setupDakboardClient = () => {
  const apiKey = process.env.DAKBOARD_API_KEY
  if (!apiKey) {
    console.error("[Error] DAKBOARD_API_KEY is required")
    console.error("[Error] Set the DAKBOARD_API_KEY environment variable with your DAKboard API key")
    process.exit(1)
  }

  initializeDakboardClient(ApiKey(apiKey))
  console.error("[Setup] DAKboard client initialized")
}

const server = new FastMCP({
  name: "dakboard-mcp-server",
  version: VERSION,
  instructions: `A DAKboard MCP server for managing digital dashboard screens, blocks, devices, loops, and metrics.

Available capabilities:
- List, view, and update screens
- List, view, and update blocks within screens
- List and view screen loops
- List, view, and update devices
- List, view, create, and delete metrics and data points`,
})

// Connection test
server.addTool({
  name: "test_dakboard_connection",
  description: "Test the DAKboard MCP Server connection and configuration",
  parameters: z.object({}),
  execute: async () => {
    const client = getDakboardClient()
    const hasClient = client ? "Yes" : "No"

    return `DAKboard MCP Server Status:
- Server: Running
- Client Initialized: ${hasClient}
- Version: ${VERSION}

Ready to handle DAKboard API requests!`
  },
})

// Screen tools
server.addTool({
  name: "list_screens",
  description: "List all DAKboard screens",
  parameters: z.object({}),
  execute: async () => listScreens(),
})

server.addTool({
  name: "get_screen",
  description: "Get detailed information about a specific DAKboard screen including settings",
  parameters: z.object({
    screen_id: z.string().describe("The DAKboard screen ID"),
  }),
  execute: async (args) => getScreen(args),
})

server.addTool({
  name: "update_screen",
  description: "Update a DAKboard screen's settings (name, orientation, dimensions, refresh rate)",
  parameters: z.object({
    screen_id: z.string().describe("The DAKboard screen ID"),
    name: z.string().optional().describe("New screen name"),
    orientation: z.string().optional().describe("Screen orientation"),
    width: z.number().optional().describe("Screen width in pixels"),
    height: z.number().optional().describe("Screen height in pixels"),
    is_default: z.number().min(0).max(1).optional().describe("Set as default screen (0 or 1)"),
    refresh: z.number().optional().describe("Refresh interval in seconds"),
  }),
  execute: async (args) => updateScreen(args),
})

// Block tools
server.addTool({
  name: "list_blocks",
  description: "List all blocks on a DAKboard screen",
  parameters: z.object({
    screen_id: z.string().describe("The DAKboard screen ID"),
  }),
  execute: async (args) => listBlocks(args),
})

server.addTool({
  name: "get_block",
  description: "Get detailed information about a specific block on a DAKboard screen",
  parameters: z.object({
    screen_id: z.string().describe("The DAKboard screen ID"),
    block_id: z.string().describe("The block ID"),
  }),
  execute: async (args) => getBlock(args),
})

server.addTool({
  name: "update_block",
  description: "Update a block on a DAKboard screen (position, size, content, visibility)",
  parameters: z.object({
    screen_id: z.string().describe("The DAKboard screen ID"),
    block_id: z.string().describe("The block ID"),
    name: z.string().optional().describe("Block name"),
    w: z.number().optional().describe("Width"),
    h: z.number().optional().describe("Height"),
    x: z.number().optional().describe("X position"),
    y: z.number().optional().describe("Y position"),
    is_disabled: z.number().min(0).max(1).optional().describe("Disable block (0 or 1)"),
    z_index: z.number().optional().describe("Z-index for layering"),
    text: z.string().optional().describe("Text content"),
    url: z.string().optional().describe("URL content"),
  }),
  execute: async (args) => updateBlock(args),
})

// Loop tools
server.addTool({
  name: "list_loops",
  description: "List all DAKboard screen loops",
  parameters: z.object({}),
  execute: async () => listLoops(),
})

server.addTool({
  name: "get_loop",
  description: "Get detailed information about a DAKboard screen loop including its screen rotation",
  parameters: z.object({
    loop_id: z.string().describe("The loop ID"),
  }),
  execute: async (args) => getLoop(args),
})

// Device tools
server.addTool({
  name: "list_devices",
  description: "List all DAKboard devices",
  parameters: z.object({}),
  execute: async () => listDevices(),
})

server.addTool({
  name: "get_device",
  description: "Get detailed information about a specific DAKboard device",
  parameters: z.object({
    device_id: z.string().describe("The device ID"),
  }),
  execute: async (args) => getDevice(args),
})

server.addTool({
  name: "update_device",
  description: "Update a DAKboard device's settings (name, IP address, assigned screen)",
  parameters: z.object({
    device_id: z.string().describe("The device ID"),
    name: z.string().optional().describe("Device name"),
    ip_addr: z.string().optional().describe("Device IP address"),
    screen_id: z.string().optional().describe("Assign device to a screen ID"),
  }),
  execute: async (args) => updateDevice(args),
})

// Metric tools
server.addTool({
  name: "list_metrics",
  description: "List all DAKboard custom metrics",
  parameters: z.object({}),
  execute: async () => listMetrics(),
})

server.addTool({
  name: "get_metric",
  description: "Get a DAKboard metric with its data points",
  parameters: z.object({
    metric_name: z.string().describe("The metric name"),
  }),
  execute: async (args) => getMetric(args),
})

server.addTool({
  name: "create_metric_data_points",
  description: "Create data points for a DAKboard metric. Send an array of values with optional timestamps.",
  parameters: z.object({
    metric_name: z.string().describe("The metric name"),
    data_points: z
      .array(
        z.object({
          value: z.union([z.string(), z.number()]).describe("Data point value"),
          timestamp: z.string().optional().describe("ISO timestamp (defaults to now)"),
          expires: z.string().optional().describe("ISO timestamp when this data point expires"),
        }),
      )
      .describe("Array of data points to create"),
  }),
  execute: async (args) => createMetricDataPoints(args),
})

server.addTool({
  name: "delete_metric",
  description: "Delete a DAKboard metric and all its data points. WARNING: This cannot be undone.",
  parameters: z.object({
    metric_name: z.string().describe("The metric name to delete"),
  }),
  execute: async (args) => deleteMetric(args),
})

server.addTool({
  name: "delete_metric_data_points",
  description: "Delete data points from a DAKboard metric at a specific timestamp",
  parameters: z.object({
    metric_name: z.string().describe("The metric name"),
    timestamp: z.string().describe("ISO timestamp of data points to delete"),
  }),
  execute: async (args) => deleteMetricDataPoints(args),
})

// Initialize and start
async function main() {
  try {
    setupDakboardClient()

    const useHttp = process.env.TRANSPORT_TYPE === "httpStream" || process.env.TRANSPORT_TYPE === "http"
    const port = parseInt(process.env.PORT || "3000")
    const host = process.env.HOST || "127.0.0.1"

    if (useHttp) {
      console.error(`[Setup] Starting HTTP server on ${host}:${port}`)
      await server.start({
        transportType: "httpStream",
        httpStream: { port, host, endpoint: "/mcp" },
      })
      console.error(`[Setup] HTTP server ready at http://${host}:${port}/mcp`)
    } else {
      console.error("[Setup] Starting in stdio mode")
      await server.start({ transportType: "stdio" })
    }
  } catch (error) {
    console.error("[Error] Failed to start server:", error)
    process.exit(1)
  }
}

process.on("SIGINT", async () => {
  console.error("[Shutdown] Shutting down DAKboard MCP Server...")
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.error("[Shutdown] Shutting down DAKboard MCP Server...")
  process.exit(0)
})

main().catch(console.error)
