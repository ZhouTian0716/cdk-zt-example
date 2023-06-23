import DynamoDB from "../db/db"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { BadRequestError, ForbiddenError, Response, UnexpectedError } from "../common/common"
import { RequestBody } from "../model/propertyModel"

export const propertyPost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  // Extract the body of the POST request
  const body: RequestBody = event.body ? JSON.parse(event.body) : {}

  if (!body.PROJECT || !body.ID) {
    throw new BadRequestError("Missing 'PROJECT' or 'ID' in the request body")
  }

  const params: PutCommandInput = {
    TableName: "Property-Table-2023060171",
    Item: {
      PROJECT: body.PROJECT,
      ID: body.ID,
      name: body.name,
      age: body.age,
    },
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
