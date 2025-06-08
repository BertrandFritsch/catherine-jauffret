export function asserts(expr: boolean, message: string): asserts expr {
  if (!expr) {
    console.error(message)
    throw new Error(message)
  }
}

export function isNotNU<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function ANNU<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  asserts(value !== null && value !== undefined, message)
}

const EmailRE =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function isEmailValid(value: string) {
  return EmailRE.test(value.toLowerCase())
}

const URLRE = /^(http|https):\/\/(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-/]))?$/

export function isURLValid(value: string) {
  return URLRE.test(value.toLowerCase())
}
