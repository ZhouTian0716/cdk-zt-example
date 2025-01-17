import * as Cdk from "aws-cdk-lib"
import * as Cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as Cloudwatch from "aws-cdk-lib/aws-cloudwatch"
import * as Route53 from "aws-cdk-lib/aws-route53"
import * as Targets from "aws-cdk-lib/aws-route53-targets"
import * as Certmgr from "aws-cdk-lib/aws-certificatemanager"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"

export function createCdkCloudFrontStack(
  this: any,
  stack: Cdk.Stack,
  web_bucketName: string,
  domainName: string,
  api: Apigateway.RestApi,
  certificateArn: string,
  apiDomainName: string
) {
  const staticWebsiteBucket = Cdk.aws_s3.Bucket.fromBucketName(stack, "ExistingS3Bucket", web_bucketName)

  const zone = Route53.HostedZone.fromLookup(stack, "Zone", { domainName })

  const cert = Certmgr.Certificate.fromCertificateArn(stack, "Certificate", certificateArn)

  const cloudfrontOAI = new Cloudfront.OriginAccessIdentity(stack, "CloudfrontOAI", {
    comment: `Cloudfront OAI for ${staticWebsiteBucket}`,
  })

  staticWebsiteBucket.addToResourcePolicy(
    new Cdk.aws_iam.PolicyStatement({
      sid: "PublicReadGetObject",
      effect: Cdk.aws_iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [new Cdk.aws_iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      resources: [`${staticWebsiteBucket.bucketArn}/*`],
    })
  )

  const viewerCert = Cloudfront.ViewerCertificate.fromAcmCertificate(
    {
      certificateArn: cert.certificateArn,
      env: {
        region: stack.region,
        account: stack.account,
      },
      applyRemovalPolicy: cert.applyRemovalPolicy,
      node: stack.node,
      stack: stack,
      metricDaysToExpiry: () =>
        new Cloudwatch.Metric({
          namespace: "TLS viewer certificate validity",
          metricName: "TLS Viewer Certificate expired",
        }),
    },
    {
      aliases: [domainName, `www.${domainName}`, apiDomainName],
      sslMethod: Cloudfront.SSLMethod.SNI,
      securityPolicy: Cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    }
  )

  const distribution = new Cloudfront.CloudFrontWebDistribution(stack, "reactAppDistro", {
    viewerCertificate: viewerCert,
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: staticWebsiteBucket,
          originAccessIdentity: cloudfrontOAI,
        },
        behaviors: [
          {
            isDefaultBehavior: true,
            compress: true,
            allowedMethods: Cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
            viewerProtocolPolicy: Cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // Ensure redirect from HTTP to HTTPS
          },
        ],
      },
      {
        customOriginSource: {
          domainName: `${api.restApiId}.execute-api.${stack.region}.${stack.urlSuffix}`,
          httpPort: 80,
          httpsPort: 443,
          originProtocolPolicy: Cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        },
        behaviors: [
          {
            pathPattern: "/api/*",
            compress: true,
            allowedMethods: Cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
            viewerProtocolPolicy: Cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // Ensure redirect from HTTP to HTTPS
          },
        ],
      },
    ],
  })

  const APIGatewayCertificate = new Certmgr.Certificate(stack, "APIGatewayCertificate", {
    domainName: apiDomainName,
    validation: Certmgr.CertificateValidation.fromDns(zone),
  })

  const customDomain = new Apigateway.DomainName(stack, "CustomDomain", {
    domainName: apiDomainName,
    certificate: APIGatewayCertificate,
    endpointType: Apigateway.EndpointType.REGIONAL,
  })

  new Apigateway.BasePathMapping(stack, "ApiBasePathMapping", {
    domainName: customDomain,
    restApi: api,
    basePath: "unique-base-path",
  })
  customDomain.addBasePathMapping(api)

  new Route53.ARecord(stack, "AliasRecord", {
    zone: zone,
    recordName: domainName,
    target: Route53.RecordTarget.fromAlias(new Targets.CloudFrontTarget(distribution)),
  })

  new Route53.ARecord(stack, "wwwAliasRecord", {
    zone: zone,
    recordName: `www.${domainName}`,
    target: Route53.RecordTarget.fromAlias(new Targets.CloudFrontTarget(distribution)),
  })

  new Route53.ARecord(stack, "ApiAliasRecord", {
    zone: zone,
    recordName: apiDomainName,
    target: Route53.RecordTarget.fromAlias(new Targets.ApiGatewayDomain(customDomain)),
  })

  new Cdk.CfnOutput(stack, "BucketWebsiteURL", {
    value: staticWebsiteBucket.bucketWebsiteUrl,
    description: "The URL of the website",
  })

  new Cdk.CfnOutput(stack, "DomainName", {
    value: domainName,
    description: "The domain name of the website",
  })

  new Cdk.CfnOutput(stack, "ApiUrl", {
    value: `https://${customDomain.domainName}`,
    description: "The Custom domain for the API",
  })
}
