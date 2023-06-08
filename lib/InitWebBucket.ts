import * as Cdk from "aws-cdk-lib"
import { aws_s3 as s3 } from "aws-cdk-lib"

export function createWebS3Bucket(stack: Cdk.Stack, web_bucketName: string): s3.Bucket {
  const webBucket = new s3.Bucket(stack, "web-bucket", {
    bucketName: web_bucketName,
    versioned: false,
    removalPolicy: Cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
    autoDeleteObjects: true,

    websiteIndexDocument: "index.html",
    websiteErrorDocument: "error.html",
    publicReadAccess: true,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
  })

  new Cdk.CfnOutput(stack, "web-Bucket", {
    value: webBucket.bucketWebsiteUrl,
    description: "web Bucket URL",
  })

  return webBucket
}
