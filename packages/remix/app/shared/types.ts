
export type DeepNonNullable<T extends object> = {
  [K in keyof T]: NonNullable<T[K]> extends object
    ? DeepNonNullable<NonNullable<T[K]>>
    : NonNullable<T[K]>
}
