import DynamoDB from "../../db/db"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { BadRequestError, HttpError, Response, UnexpectedError } from "../../common/common"
import { propertyRequestBody } from "../../../../Shared/Interface/property"
import { PropertyBodyItem } from "../../../../Shared/Validation/propertyBodyItem"
import { JsonError, MissingFieldError, validateAsPropertyEntry } from "../../../../Shared/Validation/validator"
import { v4 as uuidv4 } from "uuid"

export const propertyPost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()
  let body: propertyRequestBody

  try {
    body = event.body ? JSON.parse(event.body) : {}
  } catch (error) {
    throw new JsonError("Invalid JSON format in the request body.")
  }

  try {
    validateAsPropertyEntry(body)
  } catch (error) {
    if (error instanceof MissingFieldError) {
      throw new BadRequestError("Invalid JSON format in the request body.")
    } else {
      throw error
    }
  }

  const bodyItem = PropertyBodyItem(body)
  const project = "PROJECT"
  const uuid = uuidv4()

  const params: PutCommandInput = {
    TableName: process.env.TABLE_NAME,
    Item: { PROJECT: project, ID: uuid, ...bodyItem },
  }

  try {
    const dbResponse = await dynamoDB.dbPut(params)

    if (dbResponse.statusCode === 200) {
      return Response(201, { message: "Item created successfully" })
    } else {
      throw new BadRequestError(dbResponse.errorMessage)
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return error.response()
    } else {
      console.error(error)
      const unexpectedError = new UnexpectedError("An error occurred while processing your request.")
      return unexpectedError.response()
    }
  }
}
