import * as Cdk from "aws-cdk-lib"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"
import * as Lambda from "aws-cdk-lib/aws-lambda"

export function createApiGatewayStack(stack: Cdk.Stack): Apigateway.RestApi {
  // defines an AWS Lambda resource
  const hello = new Lambda.Function(stack, "HelloHandler", {
    runtime: Lambda.Runtime.NODEJS_14_X, // execution environment
    code: Lambda.Code.fromAsset("./src/lambdas"), // code loaded from the directory
    handler: "hello.handler", // file is "hello", function is "handler"
  })

  // defines an API Gateway REST API resource backed by our "hello" function.
  return new Apigateway.LambdaRestApi(stack, "Endpoint", {
    handler: hello,
  })
}
