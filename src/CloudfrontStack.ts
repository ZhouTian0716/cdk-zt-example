import * as Cdk from "aws-cdk-lib"
import * as Cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as Iam from "aws-cdk-lib/aws-iam"
import * as Cloudwatch from "aws-cdk-lib/aws-cloudwatch"
import * as Route53 from "aws-cdk-lib/aws-route53"
import * as Targets from "aws-cdk-lib/aws-route53-targets"
import * as Certmgr from "aws-cdk-lib/aws-certificatemanager"

export function createCdkCloudFrontStack(stack: Cdk.Stack, web_bucketName: string, domainName: string, certificateArn: string) {
  const staticWebsiteBucket = Cdk.aws_s3.Bucket.fromBucketName(stack, "ExistingS3Bucket", web_bucketName)

  const zone = Route53.HostedZone.fromLookup(stack, "Zone", { domainName })

  const cert = Certmgr.Certificate.fromCertificateArn(stack, "Certificate", certificateArn)

  const cloudfrontOAI = new Cloudfront.OriginAccessIdentity(stack, "CloudfrontOAI", {
    comment: `Cloudfront OAI for ${domainName}`,
  })

  staticWebsiteBucket.addToResourcePolicy(
    new Cdk.aws_iam.PolicyStatement({
      sid: "s3BucketPublicRead",
      effect: Cdk.aws_iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [new Iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
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
      aliases: [domainName, `www.${domainName}`],
      sslMethod: Cloudfront.SSLMethod.SNI,
      securityPolicy: Cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    }
  )

  const distribution = new Cloudfront.CloudFrontWebDistribution(stack, "react-app-distro", {
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
          },
        ],
      },
    ],
  })
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

  new Cdk.CfnOutput(stack, "BucketWebsiteURL", {
    value: staticWebsiteBucket.bucketWebsiteUrl,
    description: "The URL of the website",
  })

  new Cdk.CfnOutput(stack, "DomainName", {
    value: domainName,
    description: "The domain name of the website",
  })
}
