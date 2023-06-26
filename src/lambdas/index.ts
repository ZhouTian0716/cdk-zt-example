import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { BadRequestError, ForbiddenError, UnexpectedError } from "./common/common"
import { propertyDelete, propertyGetAll, propertyGetSingle, propertyPost, propertyUpdate } from "./entity/property"
import { JsonError } from "../../Shared/validation/validator"

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
      case "GET": {
        if (event.pathParameters && event.pathParameters.ID) {
          const getSingleResponse = await propertyGetSingle(event)
          response = getSingleResponse
        } else {
          const getResponse = await propertyGetAll(event)
          response = getResponse
        }
        break
      }
      case "PUT": {
        const putResponse = await propertyUpdate(event)
        response = putResponse
        break
      }
      case "DELETE": {
        const deleteResponse = await propertyDelete(event)
        response = deleteResponse
        break
      }
    }
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof JsonError) {
      response = {
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
