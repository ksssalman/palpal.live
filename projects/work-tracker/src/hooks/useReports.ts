import { useState, useMemo } from 'react';
// Hook for reports and stats

import type { TimeEntry, ReportPeriod } from '../types';

export function useReports(sessions: TimeEntry[]) {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('week');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Filtering state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<number[]>([]);

  const filteredSessions = useMemo(() => {
    const now = new Date();
    let filtered = sessions.filter(session => {
      // 1. Period Filter
      const sessionDate = new Date(session.clockIn);
      let matchPeriod = true;

      if (reportPeriod === 'day') {
        matchPeriod = sessionDate.toDateString() === now.toDateString();
      } else if (reportPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchPeriod = sessionDate >= weekAgo;
      } else if (reportPeriod === 'month') {
        matchPeriod = sessionDate.getMonth() === now.getMonth() &&
          sessionDate.getFullYear() === now.getFullYear();
      } else if (reportPeriod === 'custom' && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        matchPeriod = sessionDate >= start && sessionDate <= end;
      }

      return matchPeriod;
    });

    // 2. Search/Tag Filter
    if (searchTerm || selectedTags.length > 0) {
      filtered = filtered.filter(session => {
        const searchRaw = searchTerm.trim().toLowerCase();
        const matchesSearch = !searchRaw || session.tags.some(t => t.toLowerCase().includes(searchRaw));

        // Complex tag logic if needed, for now simplistic "if selectedTags, must have ALL of them"
        const matchesTags = selectedTags.length === 0 || selectedTags.every(t => session.tags.includes(t));

        return matchesSearch && matchesTags;
      });
    }

    return filtered;
  }, [sessions, reportPeriod, customStartDate, customEndDate, searchTerm, selectedTags]);

  const tagStats = useMemo(() => {
    const tagMap: Record<string, number> = {};
    let untaggedDuration = 0;

    filteredSessions.forEach(session => {
      const start = new Date(session.clockIn);
      const end = session.clockOut ? new Date(session.clockOut) : new Date();
      const duration = end.getTime() - start.getTime();

      if (session.tags.length === 0) {
        untaggedDuration += duration;
      } else {
        session.tags.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + duration;
        });
      }
    });

    const stats = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, duration]) => ({ tag, duration }));

    if (untaggedDuration > 0) {
      stats.push({ tag: '(Not Tagged)', duration: untaggedDuration });
    }

    return stats;
  }, [filteredSessions]);

  const totalDuration = useMemo(() => {
    return filteredSessions.reduce((total, session) => {
      const start = new Date(session.clockIn);
      const end = session.clockOut ? new Date(session.clockOut) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);
  }, [filteredSessions]);

  return {
    reportPeriod, setReportPeriod,
    customStartDate, setCustomStartDate,
    customEndDate, setCustomEndDate,

    searchTerm, setSearchTerm,
    selectedTags, setSelectedTags,
    selectedSessionIds, setSelectedSessionIds,

    filteredSessions,
    tagStats,
    totalDuration
  };
}
