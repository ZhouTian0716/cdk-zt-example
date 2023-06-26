import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../../db/db"
import { BadRequestError, HttpError, Response, UnexpectedError } from "../../common/common"
import { PropertyBodyItem } from "../../../../Shared/Validation/propertyBodyItem"
import { JsonError, validateAsPropertyEntry } from "../../../../Shared/Validation/validator"

export const propertyUpdate = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  try {
    if (!event.pathParameters || !event.body) {
      throw new BadRequestError("pathParameters and body are required")
    }

    if (!("ID" in event.pathParameters)) {
      throw new BadRequestError("ID and PROJECT are required in pathParameters")
    }

    const propertySK = event.pathParameters["ID"]
    const propertyPK = "PROJECT"

    let updatedData
    try {
      updatedData = JSON.parse(event.body)
    } catch (error) {
      throw new JsonError("Invalid JSON format in the request body.")
    }

    validateAsPropertyEntry(updatedData)

    const bodyItem = PropertyBodyItem(updatedData)

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        ID: propertySK,
        PROJECT: propertyPK,
        ...bodyItem,
      },
    }

    const dbResponse = await dynamoDB.dbPut(params)

    if (dbResponse.statusCode !== 200) {
      throw new BadRequestError(dbResponse.errorMessage)
    }

    return Response(200, { message: "Item changed successfully" })
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
