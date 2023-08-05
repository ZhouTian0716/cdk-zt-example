import * as Cdk from "aws-cdk-lib"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"
import * as Lambda from "aws-cdk-lib/aws-lambda"
import { Tracing } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { dirname, join } from "path"
import { Duration } from "aws-cdk-lib"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"

export function createApiGatewayStack(stack: Cdk.Stack, propertyTable: string, filesTable: string, propertyDbArn: string): Apigateway.RestApi {
  // defines an AWS Lambda resource

  const propertyLambda = new NodejsFunction(stack, "PropertyLambda", {
    runtime: Lambda.Runtime.NODEJS_16_X,
    handler: "propertyHandler",
    // entry: join(__dirname, "/lambdas/index.js"),
    entry: join("./build/lambdas/index/index.js"),
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
      actions: ["dynamodb:*"],
    })
  )

  // defines an API Gateway REST API resource
  const api = new Apigateway.RestApi(stack, "PropertyApi", {
    restApiName: "Property Service",
  })

  //define the /property and /property/{ID} resource
  const propertyResource = api.root.addResource("property")
  const propertyIdResource = propertyResource.addResource("{ID}")
  const propertySearchResource = propertyResource.addResource("search")

  const propertyMethods = ["POST", "GET", "PUT"]
  const propertyIdMethods = ["POST", "GET", "PUT", "DELETE"]

  for (const method of propertyMethods) {
    propertyResource.addMethod(method, new Apigateway.LambdaIntegration(propertyLambda))
  }

  for (const method of propertyIdMethods) {
    propertyIdResource.addMethod(method, new Apigateway.LambdaIntegration(propertyLambda))
  }

  propertySearchResource.addMethod("GET", new Apigateway.LambdaIntegration(propertyLambda))

  return api
}
