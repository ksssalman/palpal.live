/**
 * Timezone utilities for global access
 * All timestamps are stored in UTC (ISO 8601) format for consistency
 */

/**
 * Get current UTC timestamp
 * @returns ISO 8601 string (e.g., "2024-12-11T15:30:45.123Z")
 */
export function getCurrentUTCTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Format UTC timestamp for display in user's local timezone
 * @param isoString ISO 8601 timestamp (UTC)
 * @param locale Locale string (default: 'en-US')
 * @returns Formatted date/time string in user's timezone
 */
export function formatLocalTime(
  isoString: string,
  locale: string = 'en-US'
): string {
  const date = new Date(isoString)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

/**
 * Format UTC timestamp for display (date only) in user's local timezone
 * @param isoString ISO 8601 timestamp (UTC)
 * @param locale Locale string (default: 'en-US')
 * @returns Formatted date string in user's timezone
 */
export function formatLocalDate(
  isoString: string,
  locale: string = 'en-US'
): string {
  const date = new Date(isoString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get user's timezone offset from UTC
 * @returns Offset in minutes (e.g., -300 for EST)
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset()
}

/**
 * Get user's timezone name
 * @returns Timezone abbreviation (e.g., "EST", "PST")
 */
export function getTimezoneName(): string {
  return new Date()
    .toLocaleString('en-US', { timeZoneName: 'short' })
    .split(' ')
    .pop() || 'UTC'
}

/**
 * Convert UTC timestamp to specific timezone
 * @param isoString ISO 8601 timestamp (UTC)
 * @param timeZone IANA timezone (e.g., 'America/New_York', 'Europe/London')
 * @returns Formatted string in specified timezone
 */
export function formatInTimezone(
  isoString: string,
  timeZone: string = 'UTC'
): string {
  const date = new Date(isoString)
  try {
    return date.toLocaleString('en-US', {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    console.warn(`Invalid timezone: ${timeZone}`, error)
    return formatLocalTime(isoString)
  }
}

/**
 * Calculate duration between two UTC timestamps
 * @param startISO Start timestamp (ISO 8601)
 * @param endISO End timestamp (ISO 8601)
 * @returns Duration in milliseconds
 */
export function calculateDuration(startISO: string, endISO: string): number {
  const start = new Date(startISO).getTime()
  const end = new Date(endISO).getTime()
  return Math.max(0, end - start)
}

/**
 * Format duration in human-readable format
 * @param milliseconds Duration in milliseconds
 * @returns Formatted string (e.g., "2h 30m 45s")
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

/**
 * Check if date is today in user's local timezone
 * @param isoString ISO 8601 timestamp
 * @returns Boolean
 */
export function isToday(isoString: string): boolean {
  const date = new Date(isoString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/**
 * Check if date is yesterday in user's local timezone
 * @param isoString ISO 8601 timestamp
 * @returns Boolean
 */
export function isYesterday(isoString: string): boolean {
  const date = new Date(isoString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  )
}

/**
 * Get start of day in UTC
 * @param isoString ISO 8601 timestamp (default: now)
 * @returns ISO 8601 string for start of day (00:00:00 UTC)
 */
export function getStartOfDay(isoString: string = getCurrentUTCTimestamp()): string {
  const date = new Date(isoString)
  date.setUTCHours(0, 0, 0, 0)
  return date.toISOString()
}

/**
 * Get end of day in UTC
 * @param isoString ISO 8601 timestamp (default: now)
 * @returns ISO 8601 string for end of day (23:59:59 UTC)
 */
export function getEndOfDay(isoString: string = getCurrentUTCTimestamp()): string {
  const date = new Date(isoString)
  date.setUTCHours(23, 59, 59, 999)
  return date.toISOString()
}

/**
 * Store timezone-aware metadata with items
 * Use this when adding items to capture user's timezone context
 */
export interface TimezoneMetadata {
  utcTimestamp: string // ISO 8601 UTC time
  userTimezone: string // IANA timezone or user's local name
  timezoneOffset: number // Minutes from UTC
}

/**
 * Create timezone metadata for an item
 * @returns TimezoneMetadata object
 */
export function createTimezoneMetadata(): TimezoneMetadata {
  return {
    utcTimestamp: getCurrentUTCTimestamp(),
    userTimezone: getTimezoneName(),
    timezoneOffset: getTimezoneOffset()
  }
}
