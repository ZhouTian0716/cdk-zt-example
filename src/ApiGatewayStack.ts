import * as Cdk from "aws-cdk-lib"
import * as Cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as Iam from "aws-cdk-lib/aws-iam"
import * as Cloudwatch from "aws-cdk-lib/aws-cloudwatch"
import * as Route53 from "aws-cdk-lib/aws-route53"
import * as Targets from "aws-cdk-lib/aws-route53-targets"
import * as Certmgr from "aws-cdk-lib/aws-certificatemanager"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"
import * as lambda from "aws-cdk-lib/aws-lambda"

export function createApiGatewayStack(stack: Cdk.Stack): Apigateway.RestApi {
  // defines an AWS Lambda resource
  const hello = new lambda.Function(stack, "HelloHandler", {
    runtime: lambda.Runtime.NODEJS_14_X, // execution environment
    code: lambda.Code.fromAsset("./HelloLambda"), // code loaded from the directory
    handler: "hello.handler", // file is "hello", function is "handler"
  })

  // defines an API Gateway REST API resource backed by our "hello" function.
  return new Apigateway.LambdaRestApi(stack, "Endpoint", {
    handler: hello,
  })
}
