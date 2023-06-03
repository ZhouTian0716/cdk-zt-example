import * as cdk from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export function createImageS3Bucket(stack: cdk.Stack): s3.Bucket {
    const image_bucket = new s3.Bucket(stack, "image-bucket", {
        bucketName: "images-saving-bucket-2023060100",
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY, // Please use destroy only for testing purposes
        autoDeleteObjects: true, 
        publicReadAccess: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS
    });
    // const devArn = `arn:aws:lambda:us-east-1:<account>:function:*:*`;
    const policy = new iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:DeleteObject', 's3:PutObject'],
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        resources: [image_bucket.bucketArn, image_bucket.arnForObjects('*')],
      });
    
    image_bucket.addToResourcePolicy(policy);

    new cdk.CfnOutput(stack, "image-Bucket", {
        value: image_bucket.bucketWebsiteUrl,
        description: "Bucket URL",
        });

    return image_bucket;
}