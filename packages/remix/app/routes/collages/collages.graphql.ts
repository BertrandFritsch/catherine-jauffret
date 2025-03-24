import { graphql } from '#app/types/graphql'

export const getCollagesPage = graphql(`
  query collages($limit: Int, $skip: Int) {
    collageCollection(limit: $limit, skip: $skip, order: [date_DESC]) {
      total
      items {
        title
        slug
        date
        collage {
          ...Image
        }
      }
    }
  }
`)
