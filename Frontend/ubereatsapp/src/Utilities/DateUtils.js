export const parseDate = (isoString) => {
    const date = new Date(isoString);
    
    // Format options for a more readable output
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    };

    return date.toLocaleString('en-US', options) + ' (UTC)';
};