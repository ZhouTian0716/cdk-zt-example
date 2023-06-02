import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

export function createDynamoDB(stack: cdk.Stack): dynamodb.Table {
    const stream = new kinesis.Stream(stack, 'KinesisStream');

    const table:dynamodb.Table = new dynamodb.Table(stack, 'Property-Table', {
        tableName: 'Property-Table-20230601',
        partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
        sortKey: { name: 'Roomstype', type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
        stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        kinesisStream: stream
      });
      
      // add metrics
      const metric : cloudwatch.IMetric = table.metricThrottledRequestsForOperations({
          operations: [dynamodb.Operation.GET_ITEM, dynamodb.Operation.PUT_ITEM, dynamodb.Operation.DELETE_ITEM, dynamodb.Operation.UPDATE_ITEM],
          period: cdk.Duration.hours(1),
      });
  
      //add policy for table 
      table.addGlobalSecondaryIndex({
          indexName: 'All-index',
          partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
          sortKey: { name: 'Roomstype', type: dynamodb.AttributeType.STRING },
          projectionType: dynamodb.ProjectionType.ALL,
      });
  
      //add alarm for table
      const readCapacityAlarm : cloudwatch.Alarm = new cloudwatch.Alarm(stack, 'ReadCapacityUnitsLimit', {
        metric: table.metricConsumedReadCapacityUnits(),
        threshold: 5, //control the cost and performance, bigger number means more cost and better performance
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
  
      const writeCapacityAlarm : cloudwatch.Alarm = new cloudwatch.Alarm(stack, 'WriteCapacityUnitsLimit', {
        metric: table.metricConsumedWriteCapacityUnits(),
        threshold: 5,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
  
      new cdk.CfnOutput(stack, "Table", {
        value: table.tableName,
        description: "Table Name",
        });   

    return table;
}