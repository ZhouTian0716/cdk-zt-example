import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../../db/db"
import { BadRequestError, HttpError, Response, UnexpectedError } from "../../common/common"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const propertyGetAll = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  try {
    const params = {
      TableName: process.env.TABLE_NAME,
    }

    const dbResponse = await dynamoDB.dbScan(params)

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
