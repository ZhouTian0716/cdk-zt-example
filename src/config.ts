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
