# Timezone Handling Guide

## Overview

Work Tracker is designed for global access with proper timezone handling. All timestamps are stored in **UTC (ISO 8601 format)** for consistency, while display times automatically adjust to the user's local timezone.

## Key Principles

### 1. **Storage: Always UTC**

- All timestamps in database/localStorage use ISO 8601 format (e.g., `2024-12-11T15:30:45.123Z`)
- The `Z` suffix indicates UTC time
- No timezone information is stored (timezone is derived from system)

### 2. **Display: Always Local**

- Timestamps are displayed in user's local timezone
- Time automatically adjusts when user opens app in different timezone
- Users see times relative to their local clock

### 3. **Calculation: Timezone-Independent**

- Duration calculations work across timezones (UTC is universal)
- Reports and analytics are consistent regardless of user location

## API Usage

### Getting Current Time

```typescript
import { getCurrentUTCTimestamp } from "./utils/timezone";

// Get current UTC timestamp
const now = getCurrentUTCTimestamp();
// Returns: "2024-12-11T15:30:45.123Z"
```

### Displaying Time to User

```typescript
import { formatLocalTime, formatLocalDate } from './utils/timezone'

// Full date and time in user's timezone
<span>{formatLocalTime(item.createdAt)}</span>
// Shows: "Dec 11, 2024, 10:30:45 AM EST"

// Date only
<span>{formatLocalDate(item.createdAt)}</span>
// Shows: "Dec 11, 2024"
```

### Duration Calculations

```typescript
import { calculateDuration, formatDuration } from "./utils/timezone";

const durationMs = calculateDuration(item.startTime, item.endTime);
const formatted = formatDuration(durationMs);
// Shows: "2h 30m 45s"
```

### Timezone-Specific Display

```typescript
import { formatInTimezone } from './utils/timezone'

// Show time in specific timezone
<span>{formatInTimezone(item.createdAt, 'America/New_York')}</span>
// Shows: "Dec 11, 2024, 10:30:45 AM"

<span>{formatInTimezone(item.createdAt, 'Europe/London')}</span>
// Shows: "Dec 11, 2024, 3:30:45 PM"
```

### Date Comparisons

```typescript
import { isToday, isYesterday } from "./utils/timezone";

if (isToday(item.createdAt)) {
  // Show "Today"
}

if (isYesterday(item.createdAt)) {
  // Show "Yesterday"
}
```

### Getting Day Boundaries

```typescript
import { getStartOfDay, getEndOfDay } from "./utils/timezone";

// Get all items from today
const startOfDay = getStartOfDay();
const endOfDay = getEndOfDay();

const todayItems = items.filter((item) => {
  return item.createdAt >= startOfDay && item.createdAt <= endOfDay;
});
```

### User's Timezone Info

```typescript
import { getTimezoneName, getTimezoneOffset } from "./utils/timezone";

console.log(getTimezoneName()); // "EST"
console.log(getTimezoneOffset()); // -300 (minutes from UTC)
```

## Real-World Example

### Scenario: User travels from NYC to London

**User creates item in NYC (EST):**

```
Local time: Dec 11, 2024, 10:00 AM EST
UTC stored: 2024-12-11T15:00:00.000Z
```

**Same user views item in London (GMT):**

```
formatLocalTime(item.createdAt)
→ "Dec 11, 2024, 3:00:00 PM GMT" (automatically adjusted)
```

**Duration calculations remain correct:**

```
If item lasted 2 hours in NYC, it's still 2 hours in London
(UTC-based calculations are independent of timezone)
```

## Database Schema

Items automatically include timezone-aware timestamps:

```typescript
interface WorkItem {
  id: string;
  title: string;
  description?: string;
  status: "active" | "completed" | "paused";
  createdAt: string; // ISO 8601 UTC (e.g., "2024-12-11T15:30:45.123Z")
  updatedAt: string; // ISO 8601 UTC
  tags?: string[];
  [key: string]: any;
}
```

## Best Practices

### ✅ DO

- Store all timestamps with `getCurrentUTCTimestamp()`
- Use `formatLocalTime()` when displaying to users
- Calculate durations using UTC timestamps
- Store `getTimezoneOffset()` if you need to know user's timezone
- Test with multiple timezones using browser dev tools

### ❌ DON'T

- Never convert timestamps to local timezone for storage
- Don't use `new Date().toString()` (includes local timezone, not portable)
- Don't assume user's timezone won't change
- Don't hardcode timezone calculations
- Don't store timezone names (they change with DST)

## Testing Across Timezones

To test timezone functionality locally:

1. **Change system timezone** (Windows/Mac Settings)
2. **Or use Chrome DevTools:**

   - DevTools → ... → More tools → Sensors
   - Set Location to different city
   - Check if times adjust correctly

3. **Or test in browser console:**
   ```javascript
   const testTime = "2024-12-11T12:00:00.000Z";
   new Date(testTime).toLocaleString("en-US", { timeZone: "America/New_York" });
   // "12/11/2024, 7:00:00 AM"
   new Date(testTime).toLocaleString("en-US", { timeZone: "Europe/London" });
   // "12/11/2024, 12:00:00 PM"
   ```

## Common IANA Timezones

- `America/New_York` - Eastern Time (EST/EDT)
- `America/Chicago` - Central Time (CST/CDT)
- `America/Los_Angeles` - Pacific Time (PST/PDT)
- `Europe/London` - GMT/BST
- `Europe/Paris` - CET/CEST
- `Asia/Tokyo` - JST
- `Asia/Shanghai` - CST
- `Australia/Sydney` - AEDT/AEST
- `UTC` - Coordinated Universal Time

## Migration from Local Timestamps

If you have existing items with local timestamps:

```typescript
// OLD (local time stored) - DON'T USE
const oldTime = "Dec 11, 2024, 10:00 AM";

// NEW (UTC stored) - USE THIS
const newTime = new Date("2024-12-11T15:00:00Z").toISOString();
```

## Troubleshooting

### Time shows incorrectly

- Check that timestamps are in ISO 8601 format ending with `Z`
- Verify `formatLocalTime()` is used for display
- Check browser console for any timezone parsing errors

### Duration calculations off

- Ensure both start and end times are ISO 8601 UTC format
- Use `calculateDuration()` utility function
- Don't subtract local times manually

### Different times on different devices

- This is **correct behavior** - timezone should be device-dependent
- Use `formatLocalTime()` to show device-specific time
- Use `formatInTimezone()` if you need to show specific timezone

## Support

For timezone-related issues:

- Check browser timezone settings
- Verify system clock is correct
- Clear localStorage and refresh
- Test with `getCurrentUTCTimestamp()` in console
