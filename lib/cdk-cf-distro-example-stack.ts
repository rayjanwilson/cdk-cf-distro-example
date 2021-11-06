import * as cdk from '@aws-cdk/core';
import { WebDistro } from './webdistro';

export class CdkCfDistroExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webdistro = new WebDistro(this, 'Old');
    this.exportValue(webdistro.distribution.distributionDomainName);
  }
}
