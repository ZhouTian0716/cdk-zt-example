import { logger } from "../../../Shared/Utils/logger"

const allowOrigins = ["https://crm.cyberlark.com.au", "http://localhost:5173", "https://jr.cyberlark.com.au", "https://www.jr.cyberlark.com.au"]
const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Origin": allowOrigins,
}

export function BadRequest(code: number, message: string, internalLogMessage: any) {
  logger.info(`${message} - ${JSON.stringify(internalLogMessage)}`)
  return Response(code)
}

export class HttpError extends Error {
  response = () => BadRequest(this.status_code, this.status_message, this.message)
  protected constructor(public readonly status_code: number, public readonly status_message: string, message?: string | undefined) {
    super(message)
  }
}

export class UnexpectedError extends HttpError {
  constructor(message?: string | undefined) {
    super(500, "UNEXPECTED ERROR", message)
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string | undefined) {
    super(400, "BAD REQUEST", message)
  }
}

export class NotImplementedError extends HttpError {
  constructor(message?: string | undefined) {
    super(501, "NOT IMPLEMENTED", message)
  }
}

export class ConflictError extends HttpError {
  constructor(message?: string | undefined) {
    super(409, "CONFLICT", message)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string | undefined) {
    super(401, "UNAUTHORIZED", message)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string | undefined) {
    super(403, "FORBIDDEN", message)
  }
}

export function Response(code: number, body?: object, extraHeaders?: { [key: string]: string }) {
  return {
    statusCode: code,
    body: body ? JSON.stringify(body) : "{}",
    isBase64Encoded: false,
    headers: {
      ...extraHeaders,
      ...corsHeaders,
      "content-type": "application/json",
    },
  }
}

export interface LambdaEvent {
  resource: string
  path: string
  httpMethod: string
  headers?: any
  queryStringParameters?: any
  multiValueQueryStringParameters?: any
  pathParameters?: any
  stageVariables?: any
  body?: any
  isBase64Encoded: boolean
  test?: {
    tableName: string
  }
}
