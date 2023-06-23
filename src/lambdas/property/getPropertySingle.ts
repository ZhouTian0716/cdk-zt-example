import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../db/db"
import { Response } from "../common/common"

export const propertyGetSingle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  if (event.queryStringParameters) {
    if ("ID" in event.queryStringParameters) {
      const propertyId = event.queryStringParameters["ID"]

      const params = {
        TableName: "Property-Table-2023060171",
        Key: {
          id: propertyId,
        },
      }

      try {
        const dbResponse = await dynamoDB.dbGet(params)

        if (dbResponse.statusCode === 200) {
          return Response(200, dbResponse.data)
        } else {
          return Response(dbResponse.statusCode, { errorMessage: dbResponse.errorMessage })
        }
      } catch (error) {
        return Response(500, { errorMessage: "An error occurred while processing your request." })
      }
    } else {
      return Response(400, { errorMessage: "ID is required in queryStringParameters" })
    }
  } else {
    return Response(400, { errorMessage: "queryStringParameters is required" })
  }
}
