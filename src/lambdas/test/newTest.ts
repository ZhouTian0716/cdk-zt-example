import * as aws from "aws-sdk"
import { handler } from "../getProperty"
import { GetItemInput } from "aws-sdk/clients/dynamodb"

jest.mock("aws-sdk", () => {
  const mDocumentClient = { get: jest.fn() }
  const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) }
  return { DynamoDB: mDynamoDB }
})
const mDynamoDB = new aws.DynamoDB.DocumentClient()

describe("lambdafunctions", () => {
  afterAll(() => {
    jest.resetAllMocks()
  })
  it("should return property data", async () => {
    const result = { Item: { id: "1", name: "test" } }
    // mDynamoDB.get.mockImplementationOnce((_, callback) => callback(null, result))
    const mockGet = jest.spyOn(mDynamoDB, "get")
    mockGet.mockImplementationOnce((_, callback: (err: aws.AWSError | null, data: aws.DynamoDB.DocumentClient.GetItemOutput) => void) => {
      callback(null, result)
    })
    mockGet.mockResolvedValueOnce(Promise.resolve(result))
    const actual = await handler({ pathParameters: { id: "1" } })
    expect(actual).toEqual({ Item: { id: "1", name: "test" } })
    expect(mDynamoDB.get).toBeCalledWith(
      {
        TableName: "mockTable",
        Key: { PK: "1", SK: "1" },
      },
      expect.anything()
    )
  })
})
