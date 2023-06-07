import * as cdk from "aws-cdk-lib"
import { aws_s3 as s3 } from "aws-cdk-lib"
import * as Iam from "aws-cdk-lib/aws-iam"
import { IConfig } from "../src/config"

export function createImageS3Bucket(stack: cdk.Stack, image_bucketName : string): s3.Bucket {
  const image_bucket = new s3.Bucket(stack, "image-bucket", {
    bucketName: image_bucketName,
    versioned: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY, // Please use destroy only for testing purposes
    autoDeleteObjects: true,
    publicReadAccess: false,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS
  });
  // const devArn = `arn:aws:lambda:us-east-1:<account>:function:*:*`;
  const policy = new Iam.PolicyStatement({
    actions: ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"],
    effect: Iam.Effect.ALLOW,
    principals: [new Iam.AnyPrincipal()],
    resources: [image_bucket.bucketArn, image_bucket.arnForObjects("*")],
  });

  image_bucket.addToResourcePolicy(policy)

  new cdk.CfnOutput(stack, "image-Bucket", {
    value: image_bucket.bucketArn,
    description: "Bucket ARN",
  });

  return image_bucket;
}
