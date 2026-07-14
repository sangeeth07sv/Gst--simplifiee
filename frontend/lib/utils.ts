import { clsx, type ClassValue } from 'clsx'

/**
 * Merge conditional class names. We intentionally skip tailwind-merge here
 * to avoid an extra dependency — keep utility class conflicts in mind when
 * composing components (last class in the string wins for same property).
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
