#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { createImageS3Bucket } from "../src/initialize/init_image_bucket";
import { createDynamoDB } from "../src/initialize/init_ddb";
import { createWebS3Bucket } from "../src/initialize/init_web_bucket";
import { IConfig } from "../src/config"
import { logger } from "../Shared/Utils/logger"

const app = new cdk.App()
// const env = process.env.CRM_ENV ? process.env.CRM_ENV : "prod"
// logger.info("Env: ", env)

// TODO: we need to copy different dev config
// const config: IConfig = app.node.tryGetContext("config")
// const stackName = `JR-RealEstate-${config.environment}`



// initialize the three stacks for 2 buckets and 1 ddb table
const web_stackName = "web-stack-20230601"
const web_stack = new cdk.Stack(app, web_stackName);

const image_stackName = "image-stack-20230601";
const image_stack = new cdk.Stack(app, image_stackName);

const ddb_stackName = "ddb-stack-20230601";
const ddb_stack = new cdk.Stack(app, ddb_stackName);


// create the 3 resources
const web_bucket = createWebS3Bucket(web_stack);
const image_bucket = createImageS3Bucket(image_stack);
const ddb = createDynamoDB(ddb_stack);


