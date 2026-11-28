/** Tiny class-name helper. Keeps reusable components free of a CSS-in-JS dependency. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
