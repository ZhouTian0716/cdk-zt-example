import * as aws from "aws-sdk"
import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb"
import { send } from "process"

export const handler = async (event: any, docClient: DynamoDBClient) => {
  // const docClient = new DynamoDBClient({ region: "us-east-1" })

  console.log("request:", JSON.stringify(event, undefined, 2))
  const params: GetItemCommandInput = {
    // eslint-disable-next-line no-undef
    TableName: process.env.TABLE_NAME,
    Key: {
      id: { S: event.queryStringParameters["id"] },
    },
  }
  try {
    const command = new GetItemCommand(params)
    const data = await docClient.send(command)
    console.log("data:", JSON.stringify(data, undefined, 2))
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.Item),
    }
  } catch (error) {
    console.log("error:", error)
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: "Unable to get property data",
    }
  }
}
