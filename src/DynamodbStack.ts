import * as Cdk from "aws-cdk-lib"
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as Cloudwatch from "aws-cdk-lib/aws-cloudwatch"

export function createDynamoDB(stack: Cdk.Stack, propertyDbName: string, filesDbName: string): { propertyTable: Dynamodb.Table; filesTable: Dynamodb.Table } {
  const propertyTable: Dynamodb.Table = new Dynamodb.Table(stack, "Properties-Table", {
    tableName: propertyDbName,
    partitionKey: { name: "PROJECT", type: Dynamodb.AttributeType.STRING },
    sortKey: { name: "ID", type: Dynamodb.AttributeType.STRING },
    removalPolicy: Cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
    stream: Dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST,
  })

  const filesTable: Dynamodb.Table = new Dynamodb.Table(stack, "Files-Table", {
    tableName: filesDbName,
    partitionKey: { name: "FILE", type: Dynamodb.AttributeType.STRING },
    sortKey: { name: "ID", type: Dynamodb.AttributeType.STRING },
    removalPolicy: Cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
    stream: Dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST,
  })

  const tables = [propertyTable, filesTable]

  // add metrics and alarms for both tables
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i]
    const tableName = i === 0 ? "Property-Table" : "Files-Table"

    // add metrics
    table.metricThrottledRequestsForOperations({
      operations: [Dynamodb.Operation.GET_ITEM, Dynamodb.Operation.PUT_ITEM, Dynamodb.Operation.DELETE_ITEM, Dynamodb.Operation.UPDATE_ITEM],
      period: Cdk.Duration.minutes(10), // 10 minutes period
    })

    //add alarms
    new Cloudwatch.Alarm(stack, `${tableName}ReadCapacityUnitsLimit`, {
      metric: table.metricConsumedReadCapacityUnits(),
      threshold: 25, // threshold * 4 KB/S
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      comparisonOperator: Cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: Cloudwatch.TreatMissingData.NOT_BREACHING,
    })

    new Cloudwatch.Alarm(stack, `${tableName}WriteCapacityUnitsLimit`, {
      metric: table.metricConsumedWriteCapacityUnits(),
      threshold: 50, // threshold * 1 KB/S
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      comparisonOperator: Cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: Cloudwatch.TreatMissingData.NOT_BREACHING,
    })

    new Cdk.CfnOutput(stack, `${tableName}ARN`, {
      value: table.tableArn,
      description: `${tableName} ARN`,
    })
  }

  return { propertyTable, filesTable }
}
