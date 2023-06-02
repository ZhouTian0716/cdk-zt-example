import { createDynamoDB } from "./init_ddb";
import { createImageS3Bucket } from "./init_image_bucket";
import { createWebS3Bucket } from "./init_web_bucket";
import { start } from "repl";
import * as cdk from "aws-cdk-lib";


export function init_main(stack : cdk.Stack): void {
    const ddb = createDynamoDB(stack);
    const image_bucket = createImageS3Bucket(stack);
    const web_bucket = createWebS3Bucket(stack);
}

