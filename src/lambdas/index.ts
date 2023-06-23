import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { BadRequestError, ForbiddenError, UnexpectedError } from "./common/common"
import { propertyPost } from "./property/postProperty"
import { JsonError } from "./share/validator"

export const helloHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("request:", JSON.stringify(event, undefined, 2))
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, CDK! You've hit ${event.path}\n`,
  }
}

export const propertyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult = {
    statusCode: 500,
    body: "An error occurred.",
  }

  try {
    switch (event.httpMethod) {
      case "POST": {
        const postResponse = await propertyPost(event)
        response = postResponse
        break
      }
    }
  } catch (error) {
    if (error instanceof BadRequestError) {
      response = {
        statusCode: 400,
        body: error.message,
      }
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: error.message,
      }
    } else if (error instanceof UnexpectedError) {
      response = {
        statusCode: 500,
        body: error.message,
      }
    }
  }
  return response
}
