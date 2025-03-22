import { type DeepNonNullable } from '#app/shared/types'
import { type PresentationQuery } from '#app/types/graphql/graphql'

export type PresentationData = DeepNonNullable<
  NonNullable<
    NonNullable<
      NonNullable<PresentationQuery['presentationCollection']>['items']
    >[number]
  >
>

export function isPresentation(
  item: NonNullable<
    NonNullable<PresentationQuery['presentationCollection']>['items']
  >[number],
): item is PresentationData {
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