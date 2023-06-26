import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../../db/db"
import { BadRequestError, HttpError, Response, UnexpectedError } from "../../common/common"

export const propertyGetSingle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  try {
    if (!event.pathParameters || !("ID" in event.pathParameters)) {
      throw new BadRequestError("ID is required in pathParameters")
    }

    const propertySK = event.pathParameters["ID"]
    const propertyPK = "PROJECT"

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        ID: propertySK,
        PROJECT: propertyPK,
      },
    }

    const dbResponse = await dynamoDB.dbGet(params)

    if (dbResponse.statusCode !== 200) {
      throw new BadRequestError(dbResponse.errorMessage)
    }

    return Response(200, dbResponse.data)
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
