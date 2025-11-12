import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number | string): string {
  const totalSeconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
  
  if (isNaN(totalSeconds)) return '';
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}u ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}
