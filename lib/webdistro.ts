import * as cdk from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';

// Note: To ensure CDKv2 compatibility, keep the import statement for Construct separate
import { Construct } from '@aws-cdk/core';

export class WebDistro extends Construct {
  public readonly distribution: cloudfront.CloudFrontWebDistribution;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI', {});

    const siteBucket = new s3.Bucket(this, 'Bucket', {
      //   bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [s3.HttpMethods.GET],
          maxAge: 3000,
        },
      ],
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
    });
    siteBucket.grantRead(oai);

    this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distro', {
      // viewerCertificate,
      defaultRootObject: 'index.html',
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity: oai,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              // forwardedValues: {
              //   queryString: true,
              //   headers: ['Authorization'], // By default CloudFront will not forward any headers through so if your API needs authentication make sure you forward auth headers across
              // },
            },
          ],
        },
      ],
    });

    new s3Deployment.BucketDeployment(this, 'Deploy', {
      sources: [s3Deployment.Source.asset(`${__dirname}/webcontent`)],
      destinationBucket: siteBucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
    });
  }
}
