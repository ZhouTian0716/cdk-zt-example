import { handler } from "../../getProperty"
import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import * as aws from "aws-sdk"
import { stat } from "fs"

const mDynamoDB = new aws.DynamoDB.DocumentClient()
const testData = { Item: [{ id: 123, name: "testP" }] }
const event = { queryStringParameters: { id: 123 } }

jest.mock("@aws-sdk/client-dynamodb", () => {
  return {
    DynamoDBClient: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn().mockImplementation(() => {
          return {
            Items: testData,
          }
        }),
      }
    }),
    ScanCommand: jest.fn(),
    GetItemCommand: jest.fn(() => GetItemCommand),
  }
})

describe("this is the get test", () => {
  const ddbMock = {
    send: jest.fn(),
  }
  afterEach(() => {
    jest.resetAllMocks()
  })
  test("should return property data", async () => {
    ddbMock.send.mockResolvedValueOnce(testData)
    const getresult = await handler(event as any, ddbMock as any)
    const expected = {
      statusCode: 200,
      body: JSON.stringify([
        {
          id: 123,
          name: "testP",
        },
      ]),
      headers: Object({ "Content-Type": "application/json" }),
    }
    expect(getresult).toEqual(expected)
    expect(GetItemCommand).toHaveBeenCalledTimes(1)
  })

  test("fail cases", async () => {
    ddbMock.send.mockRejectedValueOnce("error")
    const getresult = await handler(event as any, ddbMock as any)
    const expected = {
      statusCode: 400,
      body: "Unable to get property data",
      headers: Object({ "Content-Type": "application/json" }),
    }
    expect(getresult).toEqual(expected)
  })
})
