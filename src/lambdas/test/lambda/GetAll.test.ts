const tableName = "test-table"
const mockData = {
  Items: [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ],
}

jest.mock("@aws-sdk", () => {
  return {
    DynamoDB: jest.fn().mockImplementation(() => {
      return {
        dbscan: jest.fn().mockImplementation((mockTableName) => {
          if (mockTableName === tableName) {
            return mockData
          }
        }),
      }
    }),
  }
})

describe("this is the getAll test", () => {})
