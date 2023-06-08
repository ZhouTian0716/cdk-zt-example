import * as Cdk from "aws-cdk-lib"
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as Cloudwatch from "aws-cdk-lib/aws-cloudwatch"
import { IConfig } from "../src/config"

if (process.env.NODE_ENV == "production" ) {

}

export function createDynamoDB(stack : Cdk.Stack, ddbName : string): Dynamodb.Table {

  const table: Dynamodb.Table = new Dynamodb.Table(stack, "Property-Table", {
    tableName: ddbName,
    partitionKey: { name: "PK", type: Dynamodb.AttributeType.STRING },
    sortKey: { name: "ID", type: Dynamodb.AttributeType.NUMBER },
    removalPolicy: Cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
    stream: Dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST,
  })

  // add metrics
  const metric: Cloudwatch.IMetric = table.metricThrottledRequestsForOperations({
    operations: [Dynamodb.Operation.GET_ITEM, Dynamodb.Operation.PUT_ITEM, Dynamodb.Operation.DELETE_ITEM, Dynamodb.Operation.UPDATE_ITEM],
    period: Cdk.Duration.minutes(10) // 10 minutes period
  })

  //add alarm for table
  const readCapacityAlarm: Cloudwatch.Alarm = new Cloudwatch.Alarm(stack, "ReadCapacityUnitsLimit", {
    metric: table.metricConsumedReadCapacityUnits(),
    threshold: 25, // thrshold * 4 KB/S
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    comparisonOperator: Cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: Cloudwatch.TreatMissingData.NOT_BREACHING,
  });

  const writeCapacityAlarm: Cloudwatch.Alarm = new Cloudwatch.Alarm(stack, "WriteCapacityUnitsLimit", {
    metric: table.metricConsumedWriteCapacityUnits(),
    threshold: 50, // thrshold * 1 KB/S
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    comparisonOperator: Cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: Cloudwatch.TreatMissingData.NOT_BREACHING,
  });

  new Cdk.CfnOutput(stack, "Table", {
    value: table.tableArn,
    description: "Table ARN",
  });

  return table;
}
