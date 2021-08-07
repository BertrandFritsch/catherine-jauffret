export const noop = () => undefined;

export function asserts(expr: boolean, message = 'Assertion failed!'): asserts expr {
  if (!expr) {
    console.error(message);
    throw new Error(message);
  }
}

/**
 * Asserts that value is neither null, nor undefined
 * @returns value or an exception
 */
export function ANNU<T>(value: T | null | undefined, message = 'Assertion error! Expected not null or undefined!'): asserts value is T {
  asserts(value !== null && value !== undefined, message);
}

export function NNU<T>(value: T | null | undefined, message?: string): T {
  ANNU(value, message);
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

const CollagesRE = /^\/collages/;
export function isCollagesPage(pathname: string) {
  return CollagesRE.test(pathname);
}

const CollageRE = /^\/collage\//;
export function isCollagePage(pathname: string) {
  return CollageRE.test(pathname);
}
