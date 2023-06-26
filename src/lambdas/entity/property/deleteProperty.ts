import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../../db/db"
import { BadRequestError, HttpError, Response, UnexpectedError } from "../../common/common"

export const propertyDelete = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  if (event.pathParameters && "ID" in event.pathParameters) {
    const propertySK = event.pathParameters["ID"]
    const propertyPK = "PROJECT"

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        ID: propertySK,
        PROJECT: propertyPK,
      },
    }

    try {
      const dbResponse = await dynamoDB.dbDelete(params)

      if (dbResponse.statusCode !== 200) {
        throw new BadRequestError(dbResponse.errorMessage)
      }

      return Response(200, { message: "Item deleted successfully" })
    } catch (error) {
      if (error instanceof HttpError) {
        return error.response()
      } else {
        console.error(error)
        const unexpectedError = new UnexpectedError("An error occurred while processing your request.")
        return unexpectedError.response()
      }
    }
  } else {
    const badRequestError = new BadRequestError("ID is required in pathParameters")
    return badRequestError.response()
  }
}
