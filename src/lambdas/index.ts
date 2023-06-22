import DynamoDB from "./db/db"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { BadRequestError, ForbiddenError, Response, UnauthorizedError } from "./common/common"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export const helloHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("request:", JSON.stringify(event, undefined, 2))
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, CDK! You've hit ${event.path}\n`,
  }
}

export const propertyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const ddbClient = new DynamoDBClient({ region: "ap-southeast-2" })
  // Extract the body of the POST request
  const body = event.body ? JSON.parse(event.body) : {}

  if (!body.PROJECT || !body.ID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing 'PROJECT' or 'ID' in the request body" }),
    }
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

  // Use the DynamoDB client to put the item
  const command = new PutCommand(params)
  const response = await ddbClient.send(command)

  console.log("DynamoDB response: ", response)

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Item created successfully" }),
  }
}
