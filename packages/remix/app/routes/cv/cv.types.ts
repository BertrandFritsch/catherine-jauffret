import { type DeepNonNullable } from '#app/shared/types'
import { type CvQuery } from '#app/types/graphql/graphql'

export type CVData = DeepNonNullable<
  NonNullable<
    NonNullable<
      NonNullable<CvQuery['cvCollection']>['items']
    >[number]
  >
>

export function isCV(
  item: NonNullable<
    NonNullable<CvQuery['cvCollection']>['items']
  >[number],
): item is CVData {
  return (
    item !== null &&
    item.author !== null &&
    item.title !== null &&
    item.text !== null &&
    item.text.json !== null &&
    item.image !== null &&
    item.image.url !== null &&
    item.image.width !== null &&
    item.image.height !== null &&
    item.image.title !== null
  )
}