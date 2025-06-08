import { graphql } from '#app/types/graphql'

export const getPresentationPage = graphql(`
  query presentation {
    presentationCollection(limit: 1) {
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
