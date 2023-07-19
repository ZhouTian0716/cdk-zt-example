module.exports = {
  tables: [
    {
      TableName: "TEST_TABLE",
      KeySchema: [
        { AttributeName: "PROJECT", KeyType: "HASH" },
        { AttributeName: "ID", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "PROJECT", AttributeType: "S" },
        { AttributeName: "ID", AttributeType: "S" },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
}
