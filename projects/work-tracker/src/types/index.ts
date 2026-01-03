export interface TimeEntry {
  id: number;
  clockIn: string;
  clockOut: string | null;
  tags: string[];
  parentId?: number;
  isManual?: boolean;
}

export interface TagStat {
  tag: string;
  duration: number;
}

export type View = 'tracker' | 'report';
export type ReportPeriod = 'day' | 'week' | 'month' | 'custom';
