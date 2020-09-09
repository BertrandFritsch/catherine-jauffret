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

const URLRE = /^(http|https):\/\/(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-/]))?$/;

export function isURLValid(value: string) {
  return URLRE.test(value.toLowerCase());
}

const textareaHTMLEscaper = ((): (content: string) => string => {
  const textarea = typeof window !== 'undefined' ? window.document.createElement('textarea') : null;

  return textarea
    ? content => {
      textarea.textContent = content;
      return textarea.innerHTML;
    }
    : content => content;
})();

export function makeURLEncodedData(record: Record<string, string | null>) {
  return Object.keys(record).reduce(
    (data, key) => {
      const value = record[ key ];
      if (value !== null) {
        data.append(key, textareaHTMLEscaper(value));
      }
      return data;
    },
    new URLSearchParams());
}
