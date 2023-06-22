import * as Cdk from "aws-cdk-lib"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"
import * as Lambda from "aws-cdk-lib/aws-lambda"
import { Tracing } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { join } from "path"
import { Duration, Stack, StackProps } from "aws-cdk-lib"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"

export function createApiGatewayStack(stack: Cdk.Stack): Apigateway.RestApi {
  // defines an AWS Lambda resource
  // const helloLambda = new Lambda.Function(stack, "IndexHandler", {
  //   runtime: Lambda.Runtime.NODEJS_16_X, // execution environment
  //   code: Lambda.Code.fromAsset("./src/lambdas"), // code loaded from the directory
  //   handler: "index.handler", // file is "hello", function is "handler"
  // })

  // const propertyLambda = new Lambda.Function(stack, "PropertyIndexHandler", {
  //   runtime: Lambda.Runtime.NODEJS_16_X,
  //   code: Lambda.Code.fromAsset("./src/lambdas"),
  //   handler: "index.propertyHandler",
  // })

  const propertyLambda = new NodejsFunction(stack, "PropertyLambda", {
    runtime: Lambda.Runtime.NODEJS_16_X,
    handler: "propertyHandler",
    entry: join(__dirname, "/lambdas/index.js"),
    environment: {
      TABLE_NAME: "Property-Table-2023060171",
    },
    tracing: Tracing.ACTIVE,
    timeout: Duration.minutes(1),
  })

  propertyLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ["arn:aws:dynamodb:ap-southeast-2:117089941413:table/Property-Table-2023060171"],
      actions: ["dynamodb:PutItem", "dynamodb:Scan", "dynamodb:GetItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
    })
  )

  // defines an API Gateway REST API resource
  const api = new Apigateway.RestApi(stack, "HelloApi", {
    restApiName: "Hello Service",
  })

  // // define the /hello resource
  // const helloLambdaResource = api.root.addResource("hello")
  // helloLambdaResource.addMethod("GET", new Apigateway.LambdaIntegration(helloLambda))

  const createPropertyResource = api.root.addResource("property")
  createPropertyResource.addMethod("POST", new Apigateway.LambdaIntegration(propertyLambda))

  return api
}
