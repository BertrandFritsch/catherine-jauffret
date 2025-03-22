import { graphql } from '#app/types/graphql'

export const getCollagePage = graphql(`
  query collage($slug: String!) {
    collageCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        date
        collage {
          ...Image
        }
      }
    }
  }
`)
