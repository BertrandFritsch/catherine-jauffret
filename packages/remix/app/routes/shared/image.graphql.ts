import { graphql } from '#app/types/graphql'

graphql(`
  fragment Image on Asset {
    title
    url
    width
    height
  }
`)
