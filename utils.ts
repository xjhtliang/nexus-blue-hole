import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Formatting ---

export function formatCurrency(amount: number, currency = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

export function formatRelativeTime(date: string | Date): string {
  const now = dayjs();
  const diffInDays = now.diff(date, 'day');
  if (diffInDays < 7) {
    // Note: for real RelativeTime, need dayjs/plugin/relativeTime
    // This is a simplified fallback
    return `${diffInDays} days ago`;
  }
  return formatDate(date);
}

// --- Generators ---

export function generateId(): string {
  return window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
}

// --- Performance ---

export const measurePerformance = (label: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.debug(`[Perf] ${label}: ${(end - start).toFixed(2)}ms`);
};

// --- Delay / Simulation ---

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Validation Helpers ---

export const isEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const hasValue = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined && value !== '';
};