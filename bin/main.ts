#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { ServiceCRMStack } from "../src/ServiceCRMStack"
import { IConfig } from "../src/config"
import { logger } from "../Shared/Utils/logger"

const app = new cdk.App()
const env = process.env.CRM_ENV ? process.env.CRM_ENV : "prod"
logger.info("Env: ", env)

// TODO: we need to copy different dev config
const config: IConfig = app.node.tryGetContext("config")

const stackName = `JR-RealEstate-${config.environment}`

new ServiceCRMStack(app, `${stackName}`, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  tags: {
    Env: env,
    StackName: stackName,
  },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
})
