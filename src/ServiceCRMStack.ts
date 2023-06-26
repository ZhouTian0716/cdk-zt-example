import * as Cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import { createImageS3Bucket } from "./ImageBucketStack"
import { createDynamoDB } from "./DynamodbStack"
import { createWebS3Bucket } from "./WebBucketStack"
import { createCdkCloudFrontStack } from "./CloudfrontStack"
import { createApiGatewayStack } from "./ApiGatewayStack"

export class ServiceCRMStack extends Cdk.Stack {
  constructor(scope: Construct, id: string, props?: Cdk.StackProps) {
    super(scope, id, props)

    const env = process.env.CRM_ENV
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`../src/constants.${env}`)
    const propertyTable = config.PROPERTY_DDB_TABLE_NAME
    const webBucketName = config.WEB_BUCKET_NAME
    const imageBucketName = config.IAMGE_BUCKET_NAME
    const domainName = config.DOMAIN_NAME
    const certificateArn = config.CERTIFICATE_ARN
    const apiDomainName = config.API_CUSTOM_DOMAIN
    const filesTable = config.FILE_DDB_TABLE_NAME
    const propertyDbArn = config.PROPERTY_DB_ARN

    // const arn = process.env.CRM_DYNAMODB_ARN
    //const db = Dynamodb.Table.fromTableArn(this, "CRM_Table", arn ? arn : config.dynamodb_arn)
    // TODO: add your code
    // ...
    const api = createApiGatewayStack(this, propertyTable, filesTable, propertyDbArn)

    // create ddb
    createDynamoDB(this, propertyTable, filesTable)
    // create webBucket
    createWebS3Bucket(this, webBucketName)
    // create imageBucket
    createImageS3Bucket(this, imageBucketName)
    // create cdkfrontstack
    createCdkCloudFrontStack(this, webBucketName, domainName, api, certificateArn, apiDomainName)
  }
}
