export const calculateTotalHours = (clockIn: string, clockOut: string | null): number => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

export const formatDurationMs = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (hours > 0 || minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
};

export const formatTime = (isoString: string, timezone: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

export const formatDate = (isoString: string, timezone: string): string => {
    return new Date(isoString).toLocaleDateString('en-US', {
        timeZone: timezone,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const calculateDuration = (clockIn: string, clockOut: string | null): string => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diff = end.getTime() - start.getTime();

    // Handle negative duration (e.g. clock drift)
    if (diff < 0) return '0s';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (hours > 0 || minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
};
