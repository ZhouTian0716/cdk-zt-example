import { PutCommandInput } from "@aws-sdk/lib-dynamodb"
import DynamoDB from "../db"

const tableName = "test-table"
const mockResponse = { $metadata: { httpStatusCode: 200 } }
const mockData = { Items: [{ id: 1 }, { id: 2 }] }

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const mockDynamoDBDocumentClient: any = {
    from: jest.fn().mockImplementation(() => mockDynamoDBDocumentClient),
    send: jest.fn().mockImplementation((receive) => {
      // if (receive.tableName != tableName) {
      //   return new Error("error")
      // }
      return mockResponse
    }),
  }
  return {
    DynamoDBDocumentClient: mockDynamoDBDocumentClient,
    PutCommand: jest.fn().mockImplementationOnce((input) => {
      return input
    }),
  }
})

describe("this is the dbPut test", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test("should return property data", async () => {
    const props: PutCommandInput = {
      TableName: tableName,
      Item: { id: 1 },
    }
    const dbPutResult = await new DynamoDB().dbPut(props)
    console.log(dbPutResult)
    const expected = {
      statusCode: 200,
    }
    expect(dbPutResult).toEqual(expected)
  })

  test("fail cases", async () => {
    const props_bad: PutCommandInput = {
      TableName: "bad",
      Item: { id: 1 },
    }
    const dbPutResult = await new DynamoDB().dbPut(props_bad)
    console.log(dbPutResult)
    const expectedStatusCode = 500
    expect(dbPutResult.statusCode).toEqual(expectedStatusCode)
  })
})
