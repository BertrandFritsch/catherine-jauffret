import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

export async function graphQLQuery<TResult, TVariables>(
    query: TypedDocumentNode<TResult, TVariables>,
    variables?: TVariables,
  ): Promise<TResult> {

    const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: print(query),
            variables,
        }),
    });
    if (!response.ok) {
        throw new Error(`'${response.statusText}' while querying: ${response.url}`);
    }

    const json = await response.json();
    if (json.errors) {
        throw new Error(`GraphQL error: ${json.errors.map((error: any) => error.message).join(', ')}`);
    }

    return json.data;
  }
