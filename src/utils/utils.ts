export function formatTime(input: string): string {
    const date = new Date(input);
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function getCurrentAndNextDayUtcTime(): { startTimeUTC: string; endTimeUTC: string } {
    const now = new Date();

    const fiveHoursBeforeNow = new Date(now.getTime() - (5 * 60 * 60 * 1000));
    const currentHourNextDay = new Date(now.getTime() + (24 * 60 * 60 * 1000));

    let startTimeUTC = fiveHoursBeforeNow.toISOString();
    let endTimeUTC = currentHourNextDay.toISOString();

    startTimeUTC = startTimeUTC.split('.')[0] + 'Z';
    endTimeUTC = endTimeUTC.split('.')[0] + 'Z';

    return {
        startTimeUTC: startTimeUTC,
        endTimeUTC: endTimeUTC,
    };
}