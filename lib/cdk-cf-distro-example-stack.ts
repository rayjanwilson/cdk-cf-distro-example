import * as cdk from '@aws-cdk/core';
import { WebDistro } from './webdistro';
import { Distro } from './distro';

export class CdkCfDistroExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webdistro = new WebDistro(this, 'Old');
    this.exportValue(webdistro.distribution.distributionDomainName, { name: 'WebDistro' });

    const distro = new Distro(this, 'New');
    this.exportValue(distro.distribution.distributionDomainName, { name: 'Distribution' });
  }
}
