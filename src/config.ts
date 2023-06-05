export interface IConfig {
  // readonly aws_region: string
  // readonly aws_account_name: string
  readonly environment: string
  readonly domainName: string
  readonly dynamodb_arn: string
  readonly service_api_url: string
  readonly certificateArnGlobal: string
  readonly certificateArnSydney: string
  readonly zoneId: string
  readonly zoneDomain: string
  readonly webBucketName: string
  readonly imageBucketName: string
  readonly ddbTableName: string
  readonly stackID: string
}

export const config: IConfig = {
  // aws_region: "us-east-1",
  // aws_account_name: "123456789012",
  environment: "dev",
  domainName: "",
  dynamodb_arn: "",
  service_api_url: "",
  certificateArnGlobal: "",
  certificateArnSydney: "",
  zoneId: "",
  zoneDomain: "",
  webBucketName: "web-host-S3bucket-20230602",
  imageBucketName: "images-saving-bucket-2023060100",
  ddbTableName: "Property-Table-2023060100",
  stackID: "ServiceCRMStack",
}