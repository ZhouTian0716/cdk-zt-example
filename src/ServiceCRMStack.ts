import * as CDK from "aws-cdk-lib"
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"
import { IConfig } from "./config"
import { createImageS3Bucket } from "../lib/init_image_bucket"
import { createDynamoDB } from "../lib/init_ddb"
import { createWebS3Bucket } from "../lib/init_web_bucket"

export class ServiceCRMStack extends CDK.Stack {
  constructor(scope: Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props)

    const config: IConfig = scope.node.tryGetContext("config");
    
    let ddbTableName;
    let webBucketName;
    let imageBucketName;
    
    if ([ "douglas", "Olivia", "Libby", "prod"].includes(config.environment)) {
        console.log(`you are using environment - ${config.environment}`)
        ddbTableName = require(`../src/constants.${config.environment}`).DDB_TABLE_NAME;
        webBucketName = require(`../src/constants.${config.environment}`).WEB_BUCKET_NAME;
        imageBucketName = require(`../src/constants.${config.environment}`).IAMGE_BUCKET_NAME;
    }else {
        throw new Error("Please provide a valid environment name");
    }

    // const arn = process.env.CRM_DYNAMODB_ARN
    //const db = Dynamodb.Table.fromTableArn(this, "CRM_Table", arn ? arn : config.dynamodb_arn)

    // TODO: add your code
    // ...
    // create ddb
    const ddb = createDynamoDB(this, ddbTableName);
    // create webBucket
    const webBucket = createWebS3Bucket(this, webBucketName);
    // create imageBucket
    const imageBucket = createImageS3Bucket(this, imageBucketName);
  };
};
