import { type DeepNonNullable } from '#app/shared/types'
import { type HomepageQuery } from '#app/types/graphql/graphql'

export type HomepageData = DeepNonNullable<
  NonNullable<
    NonNullable<
      NonNullable<HomepageQuery['homepageCollection']>['items']
    >[number]
  >
>

export function isHomepage(
  item: NonNullable<
    NonNullable<HomepageQuery['homepageCollection']>['items']
  >[number],
): item is HomepageData {
  return (
    item !== null &&
    item.author !== null &&
    item.text !== null &&
    item.text.json !== null &&
    item.image !== null &&
    item.image.url !== null &&
    item.image.width !== null &&
    item.image.height !== null &&
    item.image.title !== null
  )
}