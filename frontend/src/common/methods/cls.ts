import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cls(...input: ClassValue[]) {
  return twMerge(clsx(input))
}
