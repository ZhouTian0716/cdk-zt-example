import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import { CanonicalUserPrincipal } from "aws-cdk-lib/aws-iam"
import { Metric } from "aws-cdk-lib/aws-cloudwatch"
import * as route53 from "aws-cdk-lib/aws-route53"
import * as targets from "aws-cdk-lib/aws-route53-targets"
import * as certmgr from "aws-cdk-lib/aws-certificatemanager"

export function createCdkCloudFrontStack(stack: cdk.Stack) {
  const domainName = "oliviacai.com"

  const staticWebsiteBucket = cdk.aws_s3.Bucket.fromBucketName(stack, "ExistingS3Bucket", "web-host-s3bucket-20230602")

  const zone = route53.HostedZone.fromLookup(stack, "Zone", { domainName })

  const cert = new certmgr.Certificate(stack, "Certificate", {
    domainName,
    validation: certmgr.CertificateValidation.fromDns(zone),
  })

  const cloudfrontOAI = new cloudfront.OriginAccessIdentity(stack, "CloudfrontOAI", {
    comment: `Cloudfront OAI for ${domainName}`,
  })

  staticWebsiteBucket.addToResourcePolicy(
    new cdk.aws_iam.PolicyStatement({
      sid: "s3BucketPublicRead",
      effect: cdk.aws_iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      resources: [`${staticWebsiteBucket.bucketArn}/*`],
    })
  )

  const viewerCert = cloudfront.ViewerCertificate.fromAcmCertificate(
    {
      certificateArn: cert.certificateArn,
      env: {
        region: domainName,
        account: stack.account,
      },
      applyRemovalPolicy: cert.applyRemovalPolicy,
      node: stack.node,
      stack: stack,
      metricDaysToExpiry: () =>
        new Metric({
          namespace: "TLS viewer certificate validity",
          metricName: "TLS Viewer Certificate expired",
        }),
    },
    {
      sslMethod: cloudfront.SSLMethod.SNI,
      securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      aliases: [domainName],
    }
  )

  const distribution = new cloudfront.CloudFrontWebDistribution(stack, "react-app-v2-distro", {
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
            allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          },
        ],
      },
    ],
  })

  //   new cdk.aws_s3_deployment.BucketDeployment(stack, "react-app-deployment-v2", {
  //     destinationBucket: staticWebsiteBucket,
  //     sources: [cdk.aws_s3_deployment.Source.asset("./my-app/build")],
  //     cacheControl: [cdk.aws_s3_deployment.CacheControl.maxAge(cdk.Duration.days(1))],
  //     distribution,
  //   })

  new route53.ARecord(stack, "AliasRecord", {
    zone: zone,
    recordName: domainName,
    target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
  })

  new cdk.CfnOutput(stack, "BucketWebsiteURL", {
    value: staticWebsiteBucket.bucketWebsiteUrl,
    description: "The URL of the website",
  })

  new cdk.CfnOutput(stack, "DomainName", {
    value: domainName,
    description: "The domain name of the website",
  })
}
