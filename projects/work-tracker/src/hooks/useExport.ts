import type { TimeEntry } from '../types';
import { calculateDuration, calculateTotalHours, formatDate, formatTime } from '../utils/dateUtils';

export function useExport(entries: TimeEntry[], timezone: string) {

    // Helpers bound to timezone
    const fmtDate = (d: string) => formatDate(d, timezone);
    const fmtTime = (d: string) => formatTime(d, timezone);

    const downloadFile = (content: string, filename: string, type: string): void => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportToCSV = (selectedEntriesIds: number[], filteredEntries: TimeEntry[]) => {
        const entriesToExport = selectedEntriesIds.length > 0
          ? entries.filter(e => selectedEntriesIds.includes(e.id))
          : filteredEntries;

        const csv = [
          ['Date', 'Clock In', 'Clock Out', 'Duration (hours)', 'Tags'].join(','),
          ...entriesToExport.map(entry => [
            fmtDate(entry.clockIn),
            fmtTime(entry.clockIn),
            entry.clockOut ? fmtTime(entry.clockOut) : 'N/A',
            calculateTotalHours(entry.clockIn, entry.clockOut).toFixed(2),
            entry.tags.join('; ')
          ].join(','))
        ].join('\n');

        downloadFile(csv, 'work-tracker-export.csv', 'text/csv');
    };

    const exportToJSON = (selectedEntriesIds: number[], filteredEntries: TimeEntry[]) => {
        const entriesToExport = selectedEntriesIds.length > 0
            ? entries.filter(e => selectedEntriesIds.includes(e.id))
            : filteredEntries;

        const json = JSON.stringify(entriesToExport, null, 2);
        downloadFile(json, 'work-tracker-export.json', 'application/json');
    };

    const addRecentToCalendar = () => {
        const recentEntries = entries.slice(0, 10);
        if (recentEntries.length === 0) {
            alert('No entries to add to calendar');
            return;
        }
        const formatDateForICS = (date: Date): string => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        const events = recentEntries.map(entry => {
            const startDate = new Date(entry.clockIn);
            const endDate = entry.clockOut ? new Date(entry.clockOut) : new Date();

            const summary = entry.tags.length > 0
                ? `Session ${entry.tags.map(tag => '#' + tag).join(' ')}`
                : 'Session';

            return [
                'BEGIN:VEVENT',
                `UID:${entry.id}@timetracker`,
                `DTSTAMP:${formatDateForICS(new Date())}`,
                `DTSTART:${formatDateForICS(startDate)}`,
                `DTEND:${formatDateForICS(endDate)}`,
                `SUMMARY:${summary}`,
                `DESCRIPTION:Tags: ${entry.tags.join(', ') || 'None'}\\nDuration: ${calculateDuration(entry.clockIn, entry.clockOut)}`,
                'END:VEVENT'
            ].join('\r\n');
        }).join('\r\n');
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Work Tracker//EN',
            events,
            'END:VCALENDAR'
        ].join('\r\n');
        downloadFile(icsContent, 'recent-work-sessions.ics', 'text/calendar');
    };

    return { exportToCSV, exportToJSON, addRecentToCalendar };
}
