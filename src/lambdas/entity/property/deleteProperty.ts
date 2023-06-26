import { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../../db/db"
import { Response } from "../../common/common"

export const propertyDelete = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  if (event.pathParameters && "ID" in event.pathParameters) {
    const propertySK = event.pathParameters["ID"]
    const propertyPK = "PROJECT"

    const params = {
      TableName: "Property-Table-2023060171",
      Key: {
        ID: propertySK,
        PROJECT: propertyPK,
      },
    }

    try {
      const dbResponse = await dynamoDB.dbDelete(params)

      if (dbResponse.statusCode === 200) {
        return Response(200, { message: "Item delete successfully" })
      } else {
        return Response(dbResponse.statusCode, { errorMessage: dbResponse.errorMessage })
      }
    } catch (error) {
      return Response(500, { errorMessage: "An error occurred while processing your request." })
    }
  } else {
    return Response(400, { errorMessage: "ID is required in queryStringParameters" })
  }
}
