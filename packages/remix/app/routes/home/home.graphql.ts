import { graphql } from '#app/types/graphql'

export const getHomePage = graphql(`
  query homepage {
    homepageCollection(limit: 1) {
      items {
        author
        text {
          json
        }
        image {
          ...Image
        }
      }
    }
  }
`)
