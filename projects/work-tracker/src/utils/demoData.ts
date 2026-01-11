import type { TimeEntry } from '../types';

export const generateDemoData = (): TimeEntry[] => {
  const entries: TimeEntry[] = [];
  const now = new Date();
  const tagsList = [
    ['Development', 'Work Tracker'],
    ['Meeting', 'Client'],
    ['Design', 'UI/UX'],
    ['Research', 'Planning'],
    ['Bug Fix', 'Critical'],
    ['Writing', 'Documentation']
  ];

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Skip weekends mostly
    const day = date.getDay();
    if (day === 0 || day === 6) {
      if (Math.random() > 0.2) continue; // 20% chance to work on weekends
    }

    // 1-4 sessions per day
    const sessionsCount = Math.floor(Math.random() * 4) + 1;

    let currentHour = 9; // Start day around 9 AM

    for (let j = 0; j < sessionsCount; j++) {
      // Random duration between 30 mins and 4 hours
      const durationHours = (Math.random() * 3.5) + 0.5;
      const durationMs = durationHours * 60 * 60 * 1000;

      // Start time
      const start = new Date(date);
      start.setHours(currentHour, Math.floor(Math.random() * 60), 0, 0);

      // End time
      const end = new Date(start.getTime() + durationMs);

      entries.push({
        id: start.getTime(),
        clockIn: start.toISOString(),
        clockOut: end.toISOString(),
        tags: tagsList[Math.floor(Math.random() * tagsList.length)],
        isManual: true,
        isDemo: true
      });

      // Advance time for next session (plus break)
      currentHour += durationHours + (Math.random() * 1); // +0-1 hour break
    }
  }

  return entries;
};
