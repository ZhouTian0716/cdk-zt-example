import DynamoDB from "../db/db"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb"
import { BadRequestError, Response, UnexpectedError } from "../common/common"

export const PROPERTY_PK = "PROJECT"

const dynamoDB = new DynamoDB()

export const propertySearch = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters) {
    throw new BadRequestError("Missing query string parameters")
  }

  const keyword = event.queryStringParameters.keyword

  const filter = []
  filter.push("contains(#address, :address)")
  filter.push("contains(#suburb, :suburb)")
  filter.push("contains(#postcode, :postcode)")
  filter.push("contains(#agent, :agent)")

  const queryInput: QueryCommandInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#pk = :pk",
    FilterExpression: filter.join(" OR "),
    ExpressionAttributeNames: {
      "#pk": "PROJECT",
      "#address": "address",
      "#suburb": "suburb",
      "#postcode": "postcode",
      "#agent": "agent",
    },
    ExpressionAttributeValues: {
      ":pk": PROPERTY_PK,
      ":address": keyword,
      ":suburb": keyword,
      ":postcode": keyword,
      ":agent": keyword,
    },
  }

  const dbResponse = await dynamoDB.dbQuery(queryInput)
  console.log("[Logic] Search: " + JSON.stringify(dbResponse))

  if (dbResponse.statusCode !== 200) {
    throw new UnexpectedError(dbResponse.errorMessage)
  }

  return Response(200, dbResponse.data)
}
