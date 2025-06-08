import { type Config } from '@react-router/dev/config'
import { getCollagesPage } from './app/routes/collages/collages.graphql'
import { graphQLQuery } from './app/shared/graphQLQuery'
import { ANNU, asserts } from './app/shared/utils'

export default {
  ssr: false,

  /**
   * As of today, netlify don't support prerendering
   * The netlify plugin -- @netlify/vite-plugin-react-router -- cannot be used.
   * Prefender all the routes in the app and deploy the app to a static host.
   */
  async prerender({ getStaticPaths }) {
    const data = await graphQLQuery(getCollagesPage, { limit: 1000, skip: 0 })

    ANNU(
      data.collageCollection,
      'The data for the collages page has not been provided!',
    )

    asserts(
      data.collageCollection.items.length === data.collageCollection.total,
      'The data for the collages page is not complete! There are more collages than the ones downloaded. Time to paginate the query!',
    )

    const collagePaths =
      data.collageCollection?.items
        .filter((collage) => collage !== null)
        .map((collage) => `/collage/${collage.slug}`) ?? []

    return [...getStaticPaths(), ...collagePaths]
  },
} satisfies Config
