import * as cdk from "aws-cdk-lib"
import { aws_s3 as s3 } from "aws-cdk-lib"
import * as Iam from "aws-cdk-lib/aws-iam"

export function createImageS3Bucket(stack: cdk.Stack, image_bucketName: string): s3.Bucket {
  const imageBucket = new s3.Bucket(stack, "image-bucket", {
    bucketName: image_bucketName,
    versioned: false,
    removalPolicy: cdk.RemovalPolicy.DESTROY, // Please use destroy only for testing purposes
    autoDeleteObjects: true,
    publicReadAccess: false,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
  })
  // const devArn = `arn:aws:lambda:us-east-1:<account>:function:*:*`;
  const policy = new Iam.PolicyStatement({
    actions: ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"],
    effect: Iam.Effect.ALLOW,
    principals: [new Iam.AnyPrincipal()],
    resources: [imageBucket.bucketArn, imageBucket.arnForObjects("*")],
  })

  imageBucket.addToResourcePolicy(policy)

  new cdk.CfnOutput(stack, "image-Bucket", {
    value: imageBucket.bucketArn,
    description: "image Bucket ARN",
  })

  return imageBucket
}
