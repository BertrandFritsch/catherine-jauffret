/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query collage($slug: String!) {\n    collageCollection(where: { slug: $slug }, limit: 1) {\n      items {\n        slug\n        title\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n": typeof types.CollageDocument,
    "\n  query collages($limit: Int, $skip: Int) {\n    collageCollection(limit: $limit, skip: $skip, order: [date_DESC]) {\n      total\n      items {\n        title\n        slug\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n": typeof types.CollagesDocument,
    "\n  query cv {\n    cvCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n": typeof types.CvDocument,
    "\n  query guestbook {\n    goldenBookCollection(limit: 1000, order: date_DESC) {\n      total\n      items {\n        name\n        date\n        website\n        comment {\n          json\n        }\n      }\n    }\n  }\n": typeof types.GuestbookDocument,
    "\n  query homepage {\n    homepageCollection(limit: 1) {\n      items {\n        author\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n": typeof types.HomepageDocument,
    "\n  query presentation {\n    presentationCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n": typeof types.PresentationDocument,
    "\n  fragment Image on Asset {\n    title\n    url\n    width\n    height\n  }\n": typeof types.ImageFragmentDoc,
};
const documents: Documents = {
    "\n  query collage($slug: String!) {\n    collageCollection(where: { slug: $slug }, limit: 1) {\n      items {\n        slug\n        title\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n": types.CollageDocument,
    "\n  query collages($limit: Int, $skip: Int) {\n    collageCollection(limit: $limit, skip: $skip, order: [date_DESC]) {\n      total\n      items {\n        title\n        slug\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n": types.CollagesDocument,
    "\n  query cv {\n    cvCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n": types.CvDocument,
    "\n  query guestbook {\n    goldenBookCollection(limit: 1000, order: date_DESC) {\n      total\n      items {\n        name\n        date\n        website\n        comment {\n          json\n        }\n      }\n    }\n  }\n": types.GuestbookDocument,
    "\n  query homepage {\n    homepageCollection(limit: 1) {\n      items {\n        author\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n": types.HomepageDocument,
    "\n  query presentation {\n    presentationCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n": types.PresentationDocument,
    "\n  fragment Image on Asset {\n    title\n    url\n    width\n    height\n  }\n": types.ImageFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query collage($slug: String!) {\n    collageCollection(where: { slug: $slug }, limit: 1) {\n      items {\n        slug\n        title\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query collage($slug: String!) {\n    collageCollection(where: { slug: $slug }, limit: 1) {\n      items {\n        slug\n        title\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query collages($limit: Int, $skip: Int) {\n    collageCollection(limit: $limit, skip: $skip, order: [date_DESC]) {\n      total\n      items {\n        title\n        slug\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query collages($limit: Int, $skip: Int) {\n    collageCollection(limit: $limit, skip: $skip, order: [date_DESC]) {\n      total\n      items {\n        title\n        slug\n        date\n        collage {\n          ...Image\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query cv {\n    cvCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query cv {\n    cvCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query guestbook {\n    goldenBookCollection(limit: 1000, order: date_DESC) {\n      total\n      items {\n        name\n        date\n        website\n        comment {\n          json\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query guestbook {\n    goldenBookCollection(limit: 1000, order: date_DESC) {\n      total\n      items {\n        name\n        date\n        website\n        comment {\n          json\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query homepage {\n    homepageCollection(limit: 1) {\n      items {\n        author\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query homepage {\n    homepageCollection(limit: 1) {\n      items {\n        author\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query presentation {\n    presentationCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query presentation {\n    presentationCollection(limit: 1) {\n      items {\n        author\n        title\n        text {\n          json\n        }\n        image {\n          ...Image\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Image on Asset {\n    title\n    url\n    width\n    height\n  }\n"): (typeof documents)["\n  fragment Image on Asset {\n    title\n    url\n    width\n    height\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;