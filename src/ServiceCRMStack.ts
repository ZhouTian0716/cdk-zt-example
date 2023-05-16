import * as CDK from "aws-cdk-lib"
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"
import { IConfig } from "./config"
import { PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam"

export class ServiceCRMStack extends CDK.Stack {
  constructor(scope: Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props)

    const config: IConfig = scope.node.tryGetContext("config")

    const arn = process.env.CRM_DYNAMODB_ARN
    //const db = Dynamodb.Table.fromTableArn(this, "CRM_Table", arn ? arn : config.dynamodb_arn)

    // TODO: add your code
    // ...
  }
}
