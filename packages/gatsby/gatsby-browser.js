
export function shouldUpdateScroll({ routerProps: { location } }) {
  if (location.pathname.match('^/collages') !== null) {
    return true;
  }
  else if (location.pathname.match('^/collage/') !== null) {
    return false;
  }

  return [ 0, 0 ];
}
