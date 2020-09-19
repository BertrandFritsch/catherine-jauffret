import { isCollagePage, isCollagesPage } from "./src/helpers"

export function shouldUpdateScroll({ routerProps: { location } }) {
  if (isCollagesPage(location.pathname)) {
    return true;
  }
  else if (isCollagePage(location.pathname)) {
    return false;
  }

  return [ 0, 0 ];
}
