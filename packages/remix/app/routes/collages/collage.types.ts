import { type DeepNonNullable } from '#app/shared/types'
import { type CollagesQuery } from '#app/types/graphql/graphql'

export type Collage = DeepNonNullable<
  NonNullable<
    NonNullable<
      NonNullable<CollagesQuery['collageCollection']>['items']
    >[number]
  >
>

export function isCollage(
  item: NonNullable<
    NonNullable<CollagesQuery['collageCollection']>['items']
  >[number],
): item is Collage {
  return (
    item !== null &&
    item.date !== null &&
    item.slug !== null &&
    item.title !== null &&
    item.collage !== null &&
    item.collage.url !== null &&
    item.collage.width !== null &&
    item.collage.height !== null &&
    item.collage.title !== null
  )
}
