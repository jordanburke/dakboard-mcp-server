import { Option } from "functype"

import type {
  DakboardBlock,
  DakboardBlockDetail,
  DakboardDataPoint,
  DakboardDevice,
  DakboardDeviceDetail,
  DakboardLoop,
  DakboardLoopDetail,
  DakboardMetric,
  DakboardMetricDetail,
  DakboardScreen,
  DakboardScreenDetail,
} from "../types"

export const formatScreenSummary = (screen: DakboardScreen): string =>
  `- **${screen.name}** (ID: ${screen.id})${screen.is_default ? " [Default]" : ""}`

export const formatScreenDetail = (screen: DakboardScreenDetail): string => {
  const customCss = Option(screen.custom_css)
    .map((css) => `\n- Custom CSS: \`${css.substring(0, 100)}${css.length > 100 ? "..." : ""}\``)
    .fold(
      () => "",
      (v) => v,
    )

  return `# Screen: ${screen.name}

## Details
- ID: ${screen.id}
- Name: ${screen.name}
- Orientation: ${screen.orientation}
- Dimensions: ${screen.width}x${screen.height}
- Refresh: ${screen.refresh}s
- Default: ${screen.is_default ? "Yes" : "No"}
- Background Color: ${screen.background_color}${customCss}
- Created: ${screen.created_at}
- Updated: ${screen.updated_at}`
}

export const formatScreenList = (screens: DakboardScreen[]): string => {
  if (screens.length === 0) return "No screens found."
  return `# DAKboard Screens (${screens.length})

${screens.map(formatScreenSummary).join("\n")}`
}

export const formatBlockSummary = (block: DakboardBlock): string =>
  `- **${block.name}** (ID: ${block.id}) — ${block.w}x${block.h} at (${block.x},${block.y})${block.is_disabled ? " [Disabled]" : ""}`

export const formatBlockDetail = (block: DakboardBlockDetail): string => {
  const text = Option(block.text)
    .map((t) => `\n\n## Content\n\`\`\`\n${t}\n\`\`\``)
    .fold(
      () => "",
      (v) => v,
    )

  const url = Option(block.url)
    .map((u) => `\n- URL: ${u}`)
    .fold(
      () => "",
      (v) => v,
    )

  const blockType = Option(block.block_type)
    .map((bt) => `\n- Type: ${bt}`)
    .fold(
      () => "",
      (v) => v,
    )

  const photoUrls = Option(block.photo_urls)
    .filter((urls) => urls.length > 0)
    .map((urls) => `\n- Photos: ${urls.length} image(s)`)
    .fold(
      () => "",
      (v) => v,
    )

  return `# Block: ${block.name}

## Details
- ID: ${block.id}
- Screen ID: ${block.screen_id}
- Position: (${block.x}, ${block.y})
- Size: ${block.w}x${block.h}
- Z-Index: ${block.z_index}
- Disabled: ${block.is_disabled ? "Yes" : "No"}${blockType}${url}${photoUrls}
- Created: ${block.created_at}
- Updated: ${block.updated_at}${text}`
}

export const formatBlockList = (blocks: DakboardBlock[], screenId: string): string => {
  if (blocks.length === 0) return `No blocks found for screen ${screenId}.`
  return `# Blocks for Screen ${screenId} (${blocks.length})

${blocks.map(formatBlockSummary).join("\n")}`
}

export const formatLoopSummary = (loop: DakboardLoop): string => `- **${loop.name}** (ID: ${loop.id})`

export const formatLoopDetail = (loop: DakboardLoopDetail): string => {
  const screens =
    loop.screens.length > 0
      ? loop.screens.map((s) => `  - Screen ${s.screen_id}: ${s.duration}s (order: ${s.order})`).join("\n")
      : "  No screens configured"

  return `# Loop: ${loop.name}

## Details
- ID: ${loop.id}
- Created: ${loop.created_at}
- Updated: ${loop.updated_at}

## Screens
${screens}`
}

export const formatLoopList = (loops: DakboardLoop[]): string => {
  if (loops.length === 0) return "No loops found."
  return `# DAKboard Loops (${loops.length})

${loops.map(formatLoopSummary).join("\n")}`
}

export const formatDeviceSummary = (device: DakboardDevice): string => {
  const ip = Option(device.ip_addr)
    .map((ip) => ` — ${ip}`)
    .fold(
      () => "",
      (v) => v,
    )

  return `- **${device.name}** (ID: ${device.id})${ip}`
}

export const formatDeviceDetail = (device: DakboardDeviceDetail): string => {
  const ip = Option(device.ip_addr)
    .map((v) => `\n- IP Address: ${v}`)
    .fold(
      () => "",
      (v) => v,
    )

  const screenId = Option(device.screen_id)
    .map((v) => `\n- Screen ID: ${v}`)
    .fold(
      () => "",
      (v) => v,
    )

  const lastSeen = Option(device.last_seen_at)
    .map((v) => `\n- Last Seen: ${v}`)
    .fold(
      () => "",
      (v) => v,
    )

  const model = Option(device.model)
    .map((v) => `\n- Model: ${v}`)
    .fold(
      () => "",
      (v) => v,
    )

  const firmware = Option(device.firmware_version)
    .map((v) => `\n- Firmware: ${v}`)
    .fold(
      () => "",
      (v) => v,
    )

  const resolution = Option(device.resolution)
    .map((v) => `\n- Resolution: ${v}`)
    .fold(
      () => "",
      (v) => v,
    )

  return `# Device: ${device.name}

## Details
- ID: ${device.id}
- Name: ${device.name}${ip}${screenId}${lastSeen}${model}${firmware}${resolution}
- Created: ${device.created_at}
- Updated: ${device.updated_at}`
}

export const formatDeviceList = (devices: DakboardDevice[]): string => {
  if (devices.length === 0) return "No devices found."
  return `# DAKboard Devices (${devices.length})

${devices.map(formatDeviceSummary).join("\n")}`
}

export const formatMetricSummary = (metric: DakboardMetric): string =>
  `- **${metric.metric_name}** (updated: ${metric.updated_at})`

export const formatDataPoint = (dp: DakboardDataPoint): string => {
  const ts = Option(dp.timestamp)
    .map((t) => `${t}: `)
    .fold(
      () => "",
      (v) => v,
    )

  const expires = Option(dp.expires)
    .map((e) => ` (expires: ${e})`)
    .fold(
      () => "",
      (v) => v,
    )

  return `  - ${ts}${dp.value}${expires}`
}

export const formatMetricDetail = (metric: DakboardMetricDetail): string => {
  const dataPoints =
    metric.data_points.length > 0 ? metric.data_points.map(formatDataPoint).join("\n") : "  No data points"

  return `# Metric: ${metric.metric_name}

## Details
- Name: ${metric.metric_name}
- Created: ${metric.created_at}
- Updated: ${metric.updated_at}

## Data Points (${metric.data_points.length})
${dataPoints}`
}

export const formatMetricList = (metrics: DakboardMetric[]): string => {
  if (metrics.length === 0) return "No metrics found."
  return `# DAKboard Metrics (${metrics.length})

${metrics.map(formatMetricSummary).join("\n")}`
}
