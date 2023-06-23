import DynamoDB from "../db/db"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { Response } from "../common/common"
import { propertyRequestBody } from "../model/propertyModel"
import { PropertyItem } from "../entity/proprtyEntity"
import { JsonError, MissingFieldError, validateAsPropertyEntry } from "../share/validator"

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
      return Response(400, { errorMessage: error.message })
    } else {
      throw error
    }
  }

  const item = PropertyItem(body)

  const params: PutCommandInput = {
    TableName: "Property-Table-2023060171",
    Item: item,
  }

  try {
    const dbResponse = await dynamoDB.dbPut(params)

    if (dbResponse.statusCode === 200) {
      return Response(200, { message: "Item created successfully" })
    } else {
      return Response(dbResponse.statusCode, { errorMessage: dbResponse.errorMessage })
    }
  } catch (error) {
    return Response(500, { errorMessage: "An error occurred while processing your request." })
  }
}
