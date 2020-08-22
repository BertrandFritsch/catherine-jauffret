export const noop = () => undefined;

export function ANNU<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    const message = 'Assertion error! Expected not null or undefined!';

    console.error(message);
    throw new Error(message);
  }
}

export function NNU<T>(value: T | null | undefined): T {
  ANNU(value);
  return value;
}

const EmailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function isEmailValid(value: string) {
  return EmailRE.test(value.toLowerCase());
}
