import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../db/db"
import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import { Response } from "../common/common"

export const propertyGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  const params = {
    TableName: "Property-Table-2023060171",
  }

  try {
    const dbResponse = await dynamoDB.dbScan(params)

    if (dbResponse.statusCode === 200) {
      return Response(200, dbResponse.data)
    } else {
      return Response(dbResponse.statusCode, { errorMessage: dbResponse.errorMessage })
    }
  } catch (error) {
    return Response(500, { errorMessage: "An error occurred while processing your request." })
  }
}
