/**
 * Utility validation functions for input fields
 */

/**
 * Checks if email belongs to @stud.noroff.no
 * @param email
 * @returns {boolean}
 */

export function isValidNoroffEmail(email: string): boolean {
  const pattern = /^[\w.-]+@stud\.noroff\.no$/i;
  return pattern.test(email.trim());
}

/**
 * Checks if a password meets basic strength requirements.
 * At least 8 characters.
 */
export function isValidPassword(password: string): boolean {
  return password.trim().length >= 8;
}

/**
 * Checks if a field is not empty or just whitespace.
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
