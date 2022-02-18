import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';

export interface SlsTestStackProps extends StackProps {
  stage: string;
}


export class CdkAppStack extends Stack {
  s3Bucket: Bucket = null;

  constructor(scope: Construct, id: string, props?: SlsTestStackProps) {
    super(scope, id, props);

    this.s3Bucket = new Bucket(
      this,
      `sls-test-bucket-${props.stage}`,
      {
        bucketName: `teppos-sls-test-bucket-${props.stage}`,
      }
    )
  }
}
