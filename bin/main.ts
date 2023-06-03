#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { App, Stack } from "aws-cdk-lib";
import { createImageS3Bucket } from "../src/initialize/init_image_bucket";
import { createDynamoDB } from "../src/initialize/init_ddb";
import { createWebS3Bucket } from "../src/initialize/init_web_bucket";
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { IConfig } from "../src/config"
import { logger } from "../Shared/Utils/logger"


// const env = process.env.CRM_ENV ? process.env.CRM_ENV : "prod"
// logger.info("Env: ", env)

// TODO: we need to copy different dev config
// const config: IConfig = app.node.tryGetContext("config")
// const stackName = `JR-RealEstate-${config.environment}`



// initialize the three stacks for 2 buckets and 1 ddb table

// stack of DynamoDB
export class ServiceCRMStack extends Stack {
    constructor(app: App, id: string) {
        super(app, id);
        // create ddb
        const ddb = createDynamoDB(this);
        // create webBucket
        const webBucket = createWebS3Bucket(this);
        // create imageBucket
        const imageBucket = createImageS3Bucket(this);
    };
};

const app = new cdk.App();
new ServiceCRMStack(app, 'ServiceCRMStack');
app.synth();

