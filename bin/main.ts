#!/usr/bin/env node
import "source-map-support/register"
import * as Cdk from "aws-cdk-lib"
import { ServiceCRMStack } from "../src/ServiceCRMStack"

const app = new Cdk.App()

const env = process.env.CRM_ENV // set the local environment variable before running the script

const config = require(`../src/constants${env}`)// eslint-disable-line

const REGION = config.REGION
const stackName = `JR-RealEstate-${env}`
console.log(`stackName: ${stackName}`)

// create stack
new ServiceCRMStack(app, stackName, {
  env: {
    region: REGION,
  },
})
app.synth()
