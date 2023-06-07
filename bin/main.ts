#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { App, Stack } from "aws-cdk-lib"
import { ServiceCRMStack } from "../src/ServiceCRMStack"
import { IConfig } from "../src/config"
import { config } from "../src/config"

// const app = new cdk.App()
// // TODO: we need to copy different dev config

// // const stackName = `JR-RealEstate-${config.environment}`
// // initialize the three stacks for 2 buckets and 1 ddb table

// // stack of DynamoDB

// const stackID = config.stackID
// new ServiceCRMStack(app, stackID)
// app.synth()

const app = new cdk.App()

new ServiceCRMStack(app, config.stackID, {
  env: {
    account: config.aws_account_name,
    region: config.aws_region,
  },
})

app.synth()
