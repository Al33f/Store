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

// Format error messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    return error.errors.map((err: { message: string }) => err.message).join('. ');
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    // Handle Prisma errors
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else {
    // Handle other errors
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
}