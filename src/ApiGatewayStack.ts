import * as Cdk from "aws-cdk-lib"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"
import * as Lambda from "aws-cdk-lib/aws-lambda"
import { Tracing } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { join } from "path"
import { Duration } from "aws-cdk-lib"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"

export function createApiGatewayStack(stack: Cdk.Stack, propertyTable: string, filesDbName: string, propertyDbArn: string): Apigateway.RestApi {
  // defines an AWS Lambda resource

  const helloLambda = new NodejsFunction(stack, "HelloLambda", {
    runtime: Lambda.Runtime.NODEJS_16_X,
    handler: "helloHandler",
    entry: join(__dirname, "/lambdas/index.js"),
    tracing: Tracing.ACTIVE,
    timeout: Duration.minutes(1),
  })

  const propertyLambda = new NodejsFunction(stack, "PropertyLambda", {
    runtime: Lambda.Runtime.NODEJS_16_X,
    handler: "propertyHandler",
    entry: join(__dirname, "/lambdas/index.js"),
    environment: {
      TABLE_NAME: propertyTable,
    },
    tracing: Tracing.ACTIVE,
    timeout: Duration.minutes(1),
  })

  propertyLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [propertyDbArn],
      actions: ["dynamodb:PutItem", "dynamodb:Scan", "dynamodb:GetItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
    })
  )

  // defines an API Gateway REST API resource
  const api = new Apigateway.RestApi(stack, "PropertyApi", {
    restApiName: "Hello Service",
  })

  // define the /hello resource
  const helloLambdaResource = api.root.addResource("hello")
  helloLambdaResource.addMethod("GET", new Apigateway.LambdaIntegration(helloLambda))

  //define the /property and /property/{ID} resource
  const propertyResource = api.root.addResource("property")
  const propertyIdResource = propertyResource.addResource("{ID}")
  const propertyResourceMethods = ["POST", "GET"]
  const propertyIdResourceMethods = ["GET", "PUT", "DELETE"]

  for (const method of propertyResourceMethods) {
    propertyResource.addMethod(method, new Apigateway.LambdaIntegration(propertyLambda))
  }

  for (const method of propertyIdResourceMethods) {
    propertyIdResource.addMethod(method, new Apigateway.LambdaIntegration(propertyLambda))
  }

  return api
}
