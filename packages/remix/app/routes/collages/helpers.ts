export const noop = () => undefined;

const CollagesRE = /^\/collages$/;
export function isCollagesPage(pathname: string) {
  return CollagesRE.test(pathname);
}
