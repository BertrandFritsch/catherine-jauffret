import { APIGatewayProxyEvent } from 'aws-lambda';
import fetch from 'node-fetch';

export async function handler(event: APIGatewayProxyEvent) {
  try {
    if (!event.body) {
      throw new Error('No body has been provided!');
    }

    const body = JSON.parse(event.body);
    console.log(`Form submission function - id: ${ body.payload.id } - received a notification for the form '${ body.payload.form_name }'`);

    if (body.payload.form_name !== 'guestbook') {
      return {
        statusCode: 204
      };
    }

    const locale = 'fr-FR';
    const environment = 'master';
    const contentType = 'golden-book';
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const APIToken = process.env.CONTENTFUL_API_TOKEN;
    const URL = `https://api.contentful.com/spaces/${ spaceId }/environments/${ environment }/entries`;

    const postBody = {
      fields: {
        name: {
          [ locale ]: body.payload.data.name
        },
        date: {
          [ locale ]: new Date()
        },
        email: {
          [ locale ]: body.payload.data.email
        },
        website: {
          [ locale ]: body.payload.data.website || null
        },
        comment: {
          [ locale ]: {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: body.payload.data.comment,
                    marks: [],
                    data: {}
                  }
                ],
                data: {}
              }
            ]
          }
        }
      }
    };

    const response = await fetch(
      URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.contentful.management.v1+json; charset=utf-8',
          'X-Contentful-Content-Type': contentType,
          Authorization: `Bearer ${ APIToken }`
        },
        body: JSON.stringify(postBody)
      });

    if (response.status !== 201) {
      throw new Error(`Form submission function - id: ${ body.payload.id } - Unexpected response got from contentful. The response status was: ${ response.status }`);
    }

    return {
      statusCode: 201
    };
  }
  catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: e.message
    };
  }
}
