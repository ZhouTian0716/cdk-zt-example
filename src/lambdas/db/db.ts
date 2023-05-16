import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommandInput,
  GetCommandInput,
  PutCommandInput,
  DeleteCommandInput,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb"
import { logger } from "../../../Shared/Utils/logger"

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)

// TODO: Recommendation: Avoid using any
// TODO: investigate do we need sort key
// TODO: pagination for list

interface DbOutput {
  statusCode: number
  data?: object
  errorMessage?: string
}

export default class DynamoDB {
  async dbPut(props: PutCommandInput): Promise<DbOutput> {
    try {
      const response = await dynamo.send(new PutCommand(props))
      logger.info("[DB] dbPut: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbDelete(props: DeleteCommandInput): Promise<DbOutput> {
    try {
      const response = await dynamo.send(new DeleteCommand(props))
      logger.info("[DB] dbDelete: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbGet(props: GetCommandInput): Promise<DbOutput> {
    try {
      const response = await dynamo.send(new GetCommand(props))
      logger.info("[DB] dbGet: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: [response.Item],
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  // TODO: pagination
  async dbScan(props: ScanCommandInput) {
    try {
      const response = await dynamo.send(new ScanCommand(props))
      logger.info("[DB] dbScan: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: response.Items,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }

  async dbQuery(props: QueryCommandInput) {
    logger.info("Query params: " + JSON.stringify(props))
    try {
      const response = await dynamo.send(new QueryCommand(props))
      logger.info("[DB] dbQuery: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: response.Items,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error as Error).stack,
      }
    }
  }
}