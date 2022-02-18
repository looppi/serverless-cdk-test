import type {AWS} from '@serverless/typescript';

const resolveCliInput = require('serverless/lib/cli/resolve-input')
const input = resolveCliInput();
const stage = input.options.s ?? input.options.stage ?? 'dev';

import hello from '@functions/hello';
import {CdkAppStack} from '@resources/stack';
import {App} from "@aws-cdk/core";

console.log(stage);

export const app = new App();
export const stack = new CdkAppStack(
  app,
  "sls-test",
  {
    stackName: "sls-test-stack",
    stage
  }
)

const serverlessConfiguration: AWS = {
  service: 'sls-ts-test',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET: stack.resolve(stack.s3Bucket.bucketArn),
    },
  },
  // import the function via paths
  functions: {hello},
  package: {individually: true},
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: {'require.resolve': undefined},
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: app.synth().getStackByName(stack.stackName).template,
};

module.exports = serverlessConfiguration;
