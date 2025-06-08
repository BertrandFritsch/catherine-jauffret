import { graphql } from '#app/types/graphql'

export const getCollagePage = graphql(`
  query collage($slug: String!) {
    collageCollection(where: { slug: $slug }, limit: 1) {
      items {
        slug
        title
        date
        collage {
          ...Image
        }
      }
    }
  }
`)
