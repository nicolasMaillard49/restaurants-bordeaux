<template>
  <ul class="space-y-2 sm:space-y-3">
    <li
      v-for="(hours, index) in openingHours"
      :key="index"
      :class="[
        'flex justify-between items-center py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm',
        isCurrentDay(hours) ? 'bg-bordeaux-700/5 font-medium' : ''
      ]"
    >
      <span class="text-[#1A1A1A]">{{ getDayFromHours(hours) }}</span>
      <span :class="isClosedDay(hours) ? 'text-red-500' : 'text-[#666]'">{{ getTimeFromHours(hours) }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{
  openingHours: string[]
}>()

const { locale } = useLocale()

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const dayTranslations: Record<string, Record<string, string>> = {
  en: {
    Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday',
    Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday'
  },
  fr: {
    Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi',
    Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi', Sunday: 'Dimanche'
  },
  es: {
    Monday: 'Lunes', Tuesday: 'Martes', Wednesday: 'Miércoles',
    Thursday: 'Jueves', Friday: 'Viernes', Saturday: 'Sábado', Sunday: 'Domingo'
  }
}

function getDayFromHours(hours: string): string {
  const [rawDay] = hours.split(':')
  const dayKey = rawDay.trim()
  const targetDayMap = dayTranslations[locale.value] || dayTranslations.fr
  return targetDayMap[dayKey] || dayKey
}

function getTimeFromHours(hours: string): string {
  const closedWord = locale.value === 'es' ? 'Cerrado' : locale.value === 'en' ? 'Closed' : 'Fermé'
  const timeParts = hours.split(':').slice(1).join(':').trim()

  if (/(Closed|Fermé|Cerrado)/i.test(timeParts)) {
    return closedWord
  }

  if (locale.value === 'en') {
    return timeParts
  }

  // Convert to 24h format for FR/ES
  const timeRanges = timeParts.split(',').map(range => range.trim())
  const convertRange = (range: string): string => {
    const periodMatch = range.match(/(AM|PM)/gi)
    const rangePeriod = periodMatch && periodMatch.length === 1 ? periodMatch[0].toUpperCase() : null
    const times = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)
    if (!times) return range

    let result = range
    times.forEach((timeStr) => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
      if (!match) return

      let hoursVal = parseInt(match[1])
      const minutes = match[2]
      let period = match[3]?.toUpperCase()

      if (!period && rangePeriod) period = rangePeriod
      if (period === 'PM' && hoursVal !== 12) hoursVal += 12
      if (period === 'AM' && hoursVal === 12) hoursVal = 0

      const converted = `${hoursVal}h${minutes}`
      result = result.replace(timeStr, converted)
    })

    return result.replace(/\s*(AM|PM)/gi, '')
  }

  return timeRanges.map(convertRange).join(', ')
}

function isCurrentDay(hours: string): boolean {
  const currentDay = DAY_NAMES[new Date().getDay()]
  return hours.startsWith(currentDay)
}

function isClosedDay(hours: string): boolean {
  return /(Closed|Fermé|Cerrado)/i.test(hours)
}
</script>
