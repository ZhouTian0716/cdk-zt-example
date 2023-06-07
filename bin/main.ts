#!/usr/bin/env node
import "source-map-support/register"
import * as Cdk from "aws-cdk-lib"
import { App, Stack } from "aws-cdk-lib"
import { ServiceCRMStack } from "../src/ServiceCRMStack"
import { IConfig } from "../src/config"

const app = new Cdk.App()

const config: IConfig = app.node.tryGetContext("config");

let REGION;
if ([ "douglas", "Olivia", "Libby", "prod"].includes(config.environment)) {
    console.log(`you are using environment - ${config.environment}`)
    REGION = require(`../src/constants.${config.environment}`).REGION;
}else {
    throw new Error("Please provide a valid environment name");
}

const stackName = `JR-RealEstate-${config.environment}`
console.log(`stackName: ${stackName}`)

// create stack
new ServiceCRMStack(app, stackName,{
    env: {
        region: REGION,
    }
})
app.synth()
