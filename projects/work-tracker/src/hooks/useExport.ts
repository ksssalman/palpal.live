
import type { TimeEntry } from '../types';
import { calculateDuration, calculateTotalHours, formatDate, formatTime } from '../utils/dateUtils';

export function useExport(sessions: TimeEntry[], timezone: string) {

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


        const exportToCSV = (selectedSessionIds: number[], filteredSessions: TimeEntry[]) => {
                const sessionsToExport = selectedSessionIds.length > 0
                    ? sessions.filter(s => selectedSessionIds.includes(s.id))
                    : filteredSessions;

                const csv = [
                    ['Date', 'Clock In', 'Clock Out', 'Duration (hours)', 'Tags'].join(','),
                    ...sessionsToExport.map(session => [
                        fmtDate(session.clockIn),
                        fmtTime(session.clockIn),
                        session.clockOut ? fmtTime(session.clockOut) : 'N/A',
                        calculateTotalHours(session.clockIn, session.clockOut).toFixed(2),
                        session.tags.join('; ')
                    ].join(','))
                ].join('\n');

                downloadFile(csv, 'work-tracker-export.csv', 'text/csv');
        };


    const exportToJSON = (selectedSessionIds: number[], filteredSessions: TimeEntry[]) => {
        const sessionsToExport = selectedSessionIds.length > 0
            ? sessions.filter(s => selectedSessionIds.includes(s.id))
            : filteredSessions;

        const json = JSON.stringify(sessionsToExport, null, 2);
        downloadFile(json, 'work-tracker-export.json', 'application/json');
    };


    const addRecentToCalendar = () => {
        const recentSessions = sessions.slice(0, 10);
        if (recentSessions.length === 0) {
            alert('No sessions to add to calendar');
            return;
        }
        const formatDateForICS = (date: Date): string => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        const events = recentSessions.map(session => {
            const startDate = new Date(session.clockIn);
            const endDate = session.clockOut ? new Date(session.clockOut) : new Date();

            const summary = session.tags.length > 0
                ? `Session ${session.tags.map(tag => '#' + tag).join(' ')}`
                : 'Session';

            return [
                'BEGIN:VEVENT',
                `UID:${session.id}@worktracker`,
                `DTSTAMP:${formatDateForICS(new Date())}`,
                `DTSTART:${formatDateForICS(startDate)}`,
                `DTEND:${formatDateForICS(endDate)}`,
                `SUMMARY:${summary}`,
                `DESCRIPTION:Tags: ${session.tags.join(', ') || 'None'}\\nDuration: ${calculateDuration(session.clockIn, session.clockOut)}`,
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
