import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert a Prisma object to a regular JS object
export function convertToPlainObject<T>(prismaObject: T): T {
  return JSON.parse(JSON.stringify(prismaObject));
}

// Format numbers with decimal places
export function formatNumberWithDecimal(value: number): string {
  const [integerPart, decimalPart] = value.toString().split('.');
  return decimalPart ? `${integerPart}.${decimalPart.padEnd(2, '0')}` : `${integerPart}.00`;
}