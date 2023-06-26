import DynamoDB from "../db/db"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { BadRequest, BadRequestError, HttpError, Response, UnexpectedError } from "../common/common"
import { propertyRequestBody } from "../../../Shared/Interface/property"
import { PropertyBodyItem } from "../../../Shared/validation/propertyBodyItem"
import { JsonError } from "../../../Shared/validation/validator"
import { v4 as uuidv4 } from "uuid"
import { propertySchema } from "../../../Shared/validation/validator"
import { Validator } from "jsonschema"

export const propertyPost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()
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

  const bodyItem = PropertyBodyItem(body)
  const project = "PROJECT"
  const uuid = uuidv4()

  const params: PutCommandInput = {
    TableName: process.env.TABLE_NAME,
    Item: { PROJECT: project, ID: uuid, ...bodyItem },
  }

  try {
    const dbResponse = await dynamoDB.dbPut(params)

    if (dbResponse.statusCode === 200) {
      return Response(201, { message: "Item created successfully" })
    } else {
      throw new BadRequestError(dbResponse.errorMessage)
    }
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

export const propertyGetSingle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  try {
    if (!event.pathParameters || !("ID" in event.pathParameters)) {
      throw new BadRequestError("ID is required in pathParameters")
    }

    const propertySK = event.pathParameters["ID"]
    const propertyPK = "PROJECT"

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        ID: propertySK,
        PROJECT: propertyPK,
      },
    }

    const dbResponse = await dynamoDB.dbGet(params)

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

export const propertyDelete = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  if (event.pathParameters && "ID" in event.pathParameters) {
    const propertySK = event.pathParameters["ID"]
    const propertyPK = "PROJECT"

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        ID: propertySK,
        PROJECT: propertyPK,
      },
    }

    try {
      const dbResponse = await dynamoDB.dbDelete(params)

      if (dbResponse.statusCode !== 200) {
        throw new BadRequestError(dbResponse.errorMessage)
      }

      return Response(200, { message: "Item deleted successfully" })
    } catch (error) {
      if (error instanceof HttpError) {
        return error.response()
      } else {
        console.error(error)
        const unexpectedError = new UnexpectedError("An error occurred while processing your request.")
        return unexpectedError.response()
      }
    }
  } else {
    const badRequestError = new BadRequestError("ID is required in pathParameters")
    return badRequestError.response()
  }
}

export const propertyUpdate = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dynamoDB = new DynamoDB()

  try {
    if (!event.pathParameters || !event.body) {
      throw new BadRequestError("pathParameters and body are required")
    }

    if (!("ID" in event.pathParameters)) {
      throw new BadRequestError("ID and PROJECT are required in pathParameters")
    }

    const propertySK = event.pathParameters["ID"]
    const propertyPK = "PROJECT"

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

    const bodyItem = PropertyBodyItem(updatedData)

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        ID: propertySK,
        PROJECT: propertyPK,
        ...bodyItem,
      },
    }

    const dbResponse = await dynamoDB.dbPut(params)

    if (dbResponse.statusCode === 200) {
      return Response(200, { message: "Item changed successfully" })
    } else {
      throw new BadRequestError(dbResponse.errorMessage)
    }
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
