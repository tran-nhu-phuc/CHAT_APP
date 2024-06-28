/**
 * Validate name of Room
 *
 * @rule
 * - No new words whether capitalized or not, any characters
 * - No leading or trailing spaces
 * - No special characters except - and _
 * - Length must be between 1 and 255 characters
 * - No line breaks
 * @param value string
 * @returns boolean
 */
export const validateRoomName = (value: string) => {
  const regex = /^(?!.*[^\w\s-])(?!.*\n).{1,255}$/;
  return regex.test(value);
};
