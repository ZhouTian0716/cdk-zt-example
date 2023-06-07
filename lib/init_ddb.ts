import * as cdk from "aws-cdk-lib"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch"
import { IConfig } from "../src/config"
import { config } from "../src/config"

export function createDynamoDB(stack: cdk.Stack): dynamodb.Table {
  const table: dynamodb.Table = new dynamodb.Table(stack, "Property-Table", {
    tableName: config.ddbTableName,
    partitionKey: { name: "Project", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "ID", type: dynamodb.AttributeType.NUMBER },
    removalPolicy: cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
    stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  })

  // add metrics
  const metric: cloudwatch.IMetric = table.metricThrottledRequestsForOperations({
    operations: [dynamodb.Operation.GET_ITEM, dynamodb.Operation.PUT_ITEM, dynamodb.Operation.DELETE_ITEM, dynamodb.Operation.UPDATE_ITEM],
    period: cdk.Duration.minutes(10), // 10 minutes period
  })

  //add alarm for table
  const readCapacityAlarm: cloudwatch.Alarm = new cloudwatch.Alarm(stack, "ReadCapacityUnitsLimit", {
    metric: table.metricConsumedReadCapacityUnits(),
    threshold: 25, // thrshold * 4 KB/S
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
  })

  const writeCapacityAlarm: cloudwatch.Alarm = new cloudwatch.Alarm(stack, "WriteCapacityUnitsLimit", {
    metric: table.metricConsumedWriteCapacityUnits(),
    threshold: 50, // thrshold * 1 KB/S
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
  })

  new cdk.CfnOutput(stack, "Table", {
    value: table.tableName,
    description: "Table Name",
  })

  return table
}
