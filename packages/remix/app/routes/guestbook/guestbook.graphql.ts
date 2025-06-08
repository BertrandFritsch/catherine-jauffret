import { graphql } from '#app/types/graphql'

export const getGuestbookPage = graphql(`
  query guestbook {
    goldenBookCollection(limit: 1000, order: date_DESC) {
      total
      items {
        name
        date
        website
        comment {
          json
        }
      }
    }
  }
`)
