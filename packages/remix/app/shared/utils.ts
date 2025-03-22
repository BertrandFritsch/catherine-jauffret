
export function asserts(expr: boolean, message: string): asserts expr {
  if (!expr) {
    console.error(message)
    throw new Error(message)
  }
}

export function isNotNU<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function ANNU<T>(value: T | null | undefined, message: string): asserts value is T {
  asserts(value !== null && value !== undefined, message);
}
