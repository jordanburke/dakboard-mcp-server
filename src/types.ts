export type DakboardApiError = {
  type: "network" | "parse" | "api" | "unknown"
  message: string
  status?: number
}

// Screen types
export type DakboardScreen = {
  id: string
  name: string
  is_default: number
  created_at: string
  updated_at: string
}

export type DakboardScreenDetail = DakboardScreen & {
  orientation: string
  width: number
  height: number
  refresh: number
  background_color: string
  custom_css?: string
}

export type UpdateScreenParams = {
  name?: string
  orientation?: string
  width?: number
  height?: number
  is_default?: number
  refresh?: number
}

// Block types
export type DakboardBlock = {
  id: string
  screen_id: string
  name: string
  type: string
  w: number
  h: number
  x: number
  y: number
  is_disabled: number
  z_index: number
  created_at: string
  updated_at: string
}

export type DakboardBlockDetail = DakboardBlock & {
  text?: string
  photo_urls?: string[]
  url?: string
  source?: string
  location?: string
  lat?: string
  lon?: string
  timezone?: string
  clock_type?: string
}

export type UpdateBlockParams = {
  name?: string
  w?: number
  h?: number
  x?: number
  y?: number
  is_disabled?: number
  z_index?: number
  text?: string
  photo_urls?: string[]
  url?: string
}

// Loop types
export type DakboardLoop = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export type DakboardLoopDetail = DakboardLoop & {
  screens: Array<{
    screen_id: string
    duration: number
    order: number
  }>
}

// Device types
export type DakboardDevice = {
  id: string
  name: string
  ip_addr?: string
  screen_id?: string
  last_seen_at?: string
  created_at: string
  updated_at: string
}

export type DakboardDeviceDetail = DakboardDevice & {
  model?: string
  firmware_version?: string
  resolution?: string
}

export type UpdateDeviceParams = {
  name?: string
  ip_addr?: string
  screen_id?: string
}

// Metric types
export type DakboardMetric = {
  metric_name: string
  created_at: string
  updated_at: string
}

export type DakboardMetricDetail = DakboardMetric & {
  data_points: DakboardDataPoint[]
}

export type DakboardDataPoint = {
  timestamp?: string
  value: string | number
  expires?: string
}

export type CreateDataPointParams = {
  timestamp?: string
  value: string | number
  expires?: string
}

export type DeleteDataPointsParams = {
  timestamp: string
}
