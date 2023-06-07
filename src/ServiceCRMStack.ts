import * as CDK from "aws-cdk-lib"
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"
import { IConfig } from "./config"
import { createImageS3Bucket } from "../lib/init_image_bucket"
import { createDynamoDB } from "../lib/init_ddb"
import { createWebS3Bucket } from "../lib/init_web_bucket"
import { createCdkCloudFrontStack } from "../lib/cdk_cloudfront"

export class ServiceCRMStack extends CDK.Stack {
  constructor(scope: Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props)

    const config: IConfig = scope.node.tryGetContext("config")

    // const arn = process.env.CRM_DYNAMODB_ARN
    //const db = Dynamodb.Table.fromTableArn(this, "CRM_Table", arn ? arn : config.dynamodb_arn)

    // TODO: add your code
    // ...
    // create ddb
    const ddb = createDynamoDB(this)
    // create webBucket
    const webBucket = createWebS3Bucket(this)
    // create imageBucket
    const imageBucket = createImageS3Bucket(this)

    createCdkCloudFrontStack(this)
  }
}
