import * as Cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import { createImageS3Bucket } from "../lib/InitImageBucket"
import { createDynamoDB } from "../lib/InitDdb"
import { createWebS3Bucket } from "../lib/InitWebBucket"
import { createCdkCloudFrontStack } from "../lib/cdkCloudfront"

export class ServiceCRMStack extends Cdk.Stack {
  constructor(scope: Construct, id: string, props?: Cdk.StackProps) {
    super(scope, id, props)

    const env = process.env.CRM_ENV
    const config = require(`../src/constants.${env}`)// eslint-disable-line
    const ddbTableName = config.DDB_TABLE_NAME
    const webBucketName = config.WEB_BUCKET_NAME
    const imageBucketName = config.IAMGE_BUCKET_NAME
    const domainName = config.DOMAIN_NAME

    // const arn = process.env.CRM_DYNAMODB_ARN
    //const db = Dynamodb.Table.fromTableArn(this, "CRM_Table", arn ? arn : config.dynamodb_arn)

    // TODO: add your code
    // ...
    // create ddb
    createDynamoDB(this, ddbTableName)
    // create webBucket
    createWebS3Bucket(this, webBucketName)
    // create imageBucket
    createImageS3Bucket(this, imageBucketName)
    // create cdkfrontstack
    createCdkCloudFrontStack(this, webBucketName, domainName)
  }
}
