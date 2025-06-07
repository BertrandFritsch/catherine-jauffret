import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { ANNU, asserts } from '#app/shared/utils'
import { type Route } from './+types/home'
import { getHomePage } from './home/home.graphql'
import { isHomepage } from './home/home.types'
import { FadeInImage } from './shared/fadeInImage'
import { Title } from './shared/Title'

export async function loader() {
  const data = await graphQLQuery(getHomePage)

  ANNU(
    data.homepageCollection,
    'The data for the homepage has not been provided!',
  )

  asserts(
    data.homepageCollection.items.length > 0,
    'No homepage items were found in the API response!',
  )

  const homepageItem = data.homepageCollection.items[0]

  if (!homepageItem || !isHomepage(homepageItem)) {
    throw new Response(
      'The homepage data structure is invalid or incomplete!',
      { status: 500 },
    )
  }

  return { homepageItem }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { homepageItem } = loaderData

  return (
    <>
      <Title title="Accueil" />
      <section className="max-w-[680px] text-sm">
        <FadeInImage
          image={homepageItem.image}
          className="float-left mr-8 mb-4"
          breakpoints={[320]}
        />
        {documentToReactComponents(homepageItem.text.json)}
        <h5 className="text-right text-sm font-bold">{homepageItem.author}</h5>
      </section>
    </>
  )
}
