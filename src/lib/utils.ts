import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 * This is the standard pattern used by shadcn/ui components
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
