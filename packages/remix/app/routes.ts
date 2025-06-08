import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  layout('./components/layout.tsx', [
    index('./routes/home.tsx'),
    route('/presentation', './routes/presentation.tsx'),
    route('/cv', './routes/cv.tsx'),
    route('/collages', './routes/collages.tsx'),
    route('/collage/:slug', './routes/collage.tsx'),
    route('/contact', './routes/contact.tsx'),
    route('/guestbook', './routes/guestbook.tsx'),
  ]),
] as const satisfies RouteConfig
