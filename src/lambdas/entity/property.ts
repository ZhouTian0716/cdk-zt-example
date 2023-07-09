import DynamoDB from "../db/db"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb"
import { BadRequestError, Response, UnexpectedError } from "../common/common"
import { propertyRequestBody } from "../../../Shared/Interface/property"
import { JsonError } from "../../../Shared/Validation/validator"
import { v4 as uuidv4 } from "uuid"
import { propertySchema } from "../../../Shared/Validation/validator"
import { Validator } from "jsonschema"

const dynamoDB = new DynamoDB()

export const PROPERTY_PK = "PROJECT"

export const propertyPost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let body: propertyRequestBody

  try {
    body = event.body ? JSON.parse(event.body) : {}
  } catch (error) {
    throw new JsonError("Invalid JSON format in the request body.")
  }
  const v = new Validator()
  const validation = v.validate(body, propertySchema)

  if (!validation.valid) {
    throw new BadRequestError("Validation Failed")
  }

  const item = body
  const project = PROPERTY_PK
  const uuid = uuidv4()

  const params: PutCommandInput = {
    TableName: process.env.TABLE_NAME,
    Item: { PROJECT: project, ID: uuid, ...item },
  }

  const dbResponse = await dynamoDB.dbPut(params)

  if (dbResponse.statusCode === 200) {
    return Response(201, { message: "Item created successfully" })
  } else {
    throw new BadRequestError(dbResponse.errorMessage)
  }
}

export const propertyGetAll = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.TABLE_NAME,
  }

  const dbResponse = await dynamoDB.dbScan(params)

  if (dbResponse.statusCode !== 200) {
    throw new UnexpectedError(dbResponse.errorMessage)
  }

  return Response(200, dbResponse.data)
}

export const propertyGetSingle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !("ID" in event.pathParameters)) {
    throw new BadRequestError("ID is required in pathParameters")
  }

  const propertySK = event.pathParameters["ID"]
  const propertyPK = PROPERTY_PK

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      ID: propertySK,
      PROJECT: propertyPK,
    },
  }

  const dbResponse = await dynamoDB.dbGet(params)

  if (dbResponse.statusCode !== 200) {
    throw new UnexpectedError(dbResponse.errorMessage)
  }

  return Response(200, dbResponse.data)
}

export const propertyDelete = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !("ID" in event.pathParameters)) {
    throw new BadRequestError("ID is required in pathParameters")
  }

  const propertySK = event.pathParameters["ID"]
  const propertyPK = PROPERTY_PK

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      ID: propertySK,
      PROJECT: propertyPK,
    },
  }

  const dbResponse = await dynamoDB.dbDelete(params)

  if (dbResponse.statusCode !== 200) {
    throw new UnexpectedError(dbResponse.errorMessage)
  }

  return Response(200, { message: "Item deleted successfully" })
}

export const propertyUpdate = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !event.body || !("ID" in event.pathParameters)) {
    throw new BadRequestError("ID is required in pathParameters and body is required")
  }

  const propertySK = event.pathParameters["ID"]
  const propertyPK = PROPERTY_PK

  let updatedData: propertyRequestBody
  try {
    updatedData = JSON.parse(event.body)
  } catch (error) {
    throw new JsonError("Invalid JSON format in the request body.")
  }

  const updateValidator = new Validator()
  const validation = updateValidator.validate(updatedData, propertySchema)

  if (!validation.valid) {
    throw new BadRequestError("Validation Failed")
  }

  const bodyItem = updatedData

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      ID: propertySK,
      PROJECT: propertyPK,
      ...bodyItem,
    },
  }

  const dbResponse = await dynamoDB.dbPut(params)

  if (dbResponse.statusCode !== 200) {
    throw new UnexpectedError(dbResponse.errorMessage)
  }

  return Response(200, { message: "Item changed successfully" })
}

//search
export const propertySearch = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters) {
    throw new BadRequestError("Missing query string parameters")
  }

  const keyword = event.queryStringParameters.keyword

  const filter = []
  filter.push("contains(#address, :address)")
  filter.push("contains(#suburb, :suburb)")
  filter.push("contains(#description, :description)")
  filter.push("contains(#postcode, :postcode)")
  filter.push("contains(#agent, :agent)")

  const queryInput: QueryCommandInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#pk = :pk",
    FilterExpression: filter.join(" OR "),
    ExpressionAttributeNames: {
      "#pk": "PROJECT",
      "#description": "description",
      "#address": "address",
      "#suburb": "suburb",
      "#postcode": "postcode",
      "#agent": "agent",
    },
    ExpressionAttributeValues: {
      ":pk": PROPERTY_PK,
      ":address": keyword,
      ":description": keyword,
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
