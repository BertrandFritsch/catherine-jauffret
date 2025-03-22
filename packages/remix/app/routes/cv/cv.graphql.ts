import { graphql } from '#app/types/graphql'

export const getCVPage = graphql(`
  query cv {
    cvCollection(limit: 1) {
      items {
        author
        title
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
