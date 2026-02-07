import type { Restaurant } from './useRestaurants'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Parse a time string like "11:30 AM", "2:00 PM", or "14:30" into minutes since midnight.
 * When a time string lacks its own AM/PM suffix, `fallbackPeriod` is used instead.
 */
function parseTimeToMinutes(timeStr: string, fallbackPeriod: string | null = null): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!match) return 0

  let hours = parseInt(match[1])
  const minutes = parseInt(match[2])
  const period = (match[3]?.toUpperCase() ?? fallbackPeriod)

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return hours * 60 + minutes
}

/**
 * Check whether `currentTime` (minutes since midnight) falls within [open, close).
 * Handles overnight ranges where close <= open (e.g. 22:00 - 02:00).
 */
function isTimeInRange(currentTime: number, openTime: number, closeTime: number): boolean {
  if (closeTime <= openTime) {
    return currentTime >= openTime || currentTime < closeTime
  }
  return currentTime >= openTime && currentTime < closeTime
}

/**
 * Determine whether a restaurant is currently open based on its opening_hours strings.
 *
 * Supports formats like:
 *   "Monday: 11:30 AM \u2013 2:30 PM, 6:00 \u2013 10:00 PM"
 *   "Monday: 12:00\u201314:30, 19:00\u201322:30"
 *   "Monday: Closed"
 */
export function isRestaurantOpenNow(restaurant: Restaurant): boolean {
  if (!restaurant.opening_hours || restaurant.opening_hours.length === 0) return false

  const now = new Date()
  const currentDay = DAY_NAMES[now.getDay()]
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayHours = restaurant.opening_hours.find(h => h.startsWith(currentDay))
  if (!todayHours) return false

  if (todayHours.includes('Closed') || todayHours.includes('Ferm\u00e9')) return false

  // Extract everything after "DayName:" and split on commas for multiple ranges
  const timeRanges = todayHours.split(':').slice(1).join(':').split(',')

  for (const range of timeRanges) {
    const hasAmPm = /AM|PM/i.test(range)
    const times = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)
    if (!times || times.length < 2) continue

    // When AM/PM format is used but only one period marker exists for the whole range,
    // use it as a fallback for the time that lacks its own marker.
    let fallbackPeriod: string | null = null
    if (hasAmPm) {
      const periodMatches = range.match(/(AM|PM)/gi)
      if (periodMatches && periodMatches.length === 1) {
        fallbackPeriod = periodMatches[0].toUpperCase()
      }
    }

    const openTime = parseTimeToMinutes(times[0], fallbackPeriod)
    const closeTime = parseTimeToMinutes(times[1], fallbackPeriod)

    if (isTimeInRange(currentTime, openTime, closeTime)) return true
  }

  return false
}

export function useOpeningHours() {
  return { isRestaurantOpenNow }
}
