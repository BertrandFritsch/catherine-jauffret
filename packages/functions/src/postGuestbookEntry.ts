import { APIGatewayProxyEvent } from 'aws-lambda';
// import fetch from "node-fetch";

export async function handler(event: APIGatewayProxyEvent) {
  try {

    console.log(`postGuestbookEntry - received: ${ event.body }`);
    console.log(`postGuestbookEntry - do I have the contentful API token? ${ process.env.CONTENTFUL_API_TOKEN }`);

    return {
      statusCode: 201
    };
  }
  catch (e) {
    console.log(`postGuestbookEntry - error: ${ e }`);
    return {
      statusCode: 500,
      body: e.message
    };
  }
}
