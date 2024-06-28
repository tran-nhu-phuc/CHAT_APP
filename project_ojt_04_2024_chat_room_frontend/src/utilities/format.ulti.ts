/**
 * Format Name
 *
 * @param firstName - Name of the first
 * @param lastName - Name of the last
 *
 * @return Full Name
 */
export const formatName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

/**
 * Format Date
 * @param date - String
 *
 * @returns Date
 */
export const formatDate = (date: string): string => {
  return date.split('T')[0];
};

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
};
