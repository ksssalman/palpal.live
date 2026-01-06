import { useState, useMemo } from 'react';
// Hook for reports and stats
import type { TimeEntry, ReportPeriod } from '../types';

export function useReports(entries: TimeEntry[]) {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('week');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Filtering state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    let filtered = entries.filter(entry => {
      // 1. Period Filter
      const entryDate = new Date(entry.clockIn);
      let matchPeriod = true;

      if (reportPeriod === 'day') {
        matchPeriod = entryDate.toDateString() === now.toDateString();
      } else if (reportPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchPeriod = entryDate >= weekAgo;
      } else if (reportPeriod === 'month') {
        matchPeriod = entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear();
      } else if (reportPeriod === 'custom' && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        matchPeriod = entryDate >= start && entryDate <= end;
      }

      return matchPeriod;
    });

    // 2. Search/Tag Filter
    if (searchTerm || selectedTags.length > 0) {
      filtered = filtered.filter(entry => {
        const searchRaw = searchTerm.trim().toLowerCase();
        const matchesSearch = !searchRaw || entry.tags.some(t => t.toLowerCase().includes(searchRaw));

        // Complex tag logic if needed, for now simplistic "if selectedTags, must have ALL of them"
        const matchesTags = selectedTags.length === 0 || selectedTags.every(t => entry.tags.includes(t));

        return matchesSearch && matchesTags;
      });
    }

    return filtered;
  }, [entries, reportPeriod, customStartDate, customEndDate, searchTerm, selectedTags]);

  const tagStats = useMemo(() => {
    const tagMap: Record<string, number> = {};
    let untaggedDuration = 0;

    filteredEntries.forEach(entry => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      const duration = end.getTime() - start.getTime();

      if (entry.tags.length === 0) {
        untaggedDuration += duration;
      } else {
        entry.tags.forEach(tag => {
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
  }, [filteredEntries]);

  const totalDuration = useMemo(() => {
    return filteredEntries.reduce((total, entry) => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);
  }, [filteredEntries]);

  return {
    reportPeriod, setReportPeriod,
    customStartDate, setCustomStartDate,
    customEndDate, setCustomEndDate,

    searchTerm, setSearchTerm,
    selectedTags, setSelectedTags,
    selectedEntries, setSelectedEntries,

    filteredEntries,
    tagStats,
    totalDuration
  };
}
