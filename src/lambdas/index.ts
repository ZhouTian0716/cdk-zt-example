import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { BadRequestError, HttpError, UnexpectedError } from "./common/common"
import { propertyDelete, propertyGetAll, propertyGetSingle, propertyPost, propertyUpdate } from "./entity/property"
import { propertySearch } from "./entity/searchProperty"

export const propertyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case "POST": {
        return await propertyPost(event)
      }
      case "GET": {
        if (event.queryStringParameters && event.queryStringParameters.keyword) {
          return await propertySearch(event)
        } else if (event.pathParameters && event.pathParameters.ID) {
          return await propertyGetSingle(event)
        } else {
          return await propertyGetAll(event)
        }
      }
      case "PUT": {
        return await propertyUpdate(event)
      }
      case "DELETE": {
        return await propertyDelete(event)
      }
      default: {
        throw new BadRequestError(`Unsupported method "${event.httpMethod}"`)
      }
    }
  } catch (error) {
    console.error(error)
    if (error instanceof HttpError) {
      return error.response()
    } else {
      const unexpectedError = new UnexpectedError("An error occurred while processing your request.")
      return unexpectedError.response()
    }
  }
}
