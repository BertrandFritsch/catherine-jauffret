import { type DeepNonNullable } from '#app/shared/types'
import { type ImageFragment } from '#app/types/graphql/graphql'

export type ImageAsset = DeepNonNullable<ImageFragment>

export function isImageAsset(
  item: ImageFragment,
): item is ImageAsset {
  return (
    item !== null &&
    item.url !== null &&
    item.width !== null &&
    item.height !== null &&
    item.title !== null
  )
}
