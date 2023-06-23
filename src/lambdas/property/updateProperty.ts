import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import DynamoDB from "../db/db"
import { Response } from "../common/common"
import { PropertyItem } from "../entity/proprtyEntity"

export const propertyUpdate = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  if (event.queryStringParameters && event.body) {
    if ("ID" in event.queryStringParameters && "PROJECT" in event.queryStringParameters) {
      const propertySK = event.queryStringParameters["ID"]
      const propertyPK = event.queryStringParameters["PROJECT"]

      const updatedData = JSON.parse(event.body)

      const item = PropertyItem(updatedData)

      const params = {
        TableName: "Property-Table-2023060171",
        Item: {
          ID: propertySK,
          PROJECT: propertyPK,
          ...item,
        },
      }

      try {
        const dbResponse = await dynamoDB.dbPut(params)

        if (dbResponse.statusCode === 200) {
          return Response(200, { message: "Item change successfully" })
        } else {
          return Response(dbResponse.statusCode, { errorMessage: dbResponse.errorMessage })
        }
      } catch (error) {
        return Response(500, { errorMessage: "An error occurred while processing your request." })
      }
    } else {
      return Response(400, { errorMessage: "ID and PROJECT are required in queryStringParameters" })
    }
  } else {
    return Response(400, { errorMessage: "queryStringParameters and body are required" })
  }
}
