import * as cdk from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export function createWebS3Bucket(stack: cdk.Stack): s3.Bucket {
    const web_bucket = new s3.Bucket(stack, "web-bucket", {
        bucketName: 'web-bucket-2023060100',
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
        autoDeleteObjects: true,
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "error.html",
        publicReadAccess: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS
    });

    new cdk.CfnOutput(stack, "web-Bucket", {
        value: web_bucket.bucketWebsiteUrl,
        description: "Bucket URL",
        });

    return web_bucket;
}
