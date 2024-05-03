export function convertToDate(dateString: string) {
    // Split the date string by '-'
    const parts = dateString.split('-');
    
    // Parse the parts into integers (month, day, year)
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Create a new Date object (months are 0-indexed in JavaScript)
    const dateObject = new Date(year, month - 1, day);
    
    return dateObject;
}