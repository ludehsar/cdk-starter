import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

export class CdkStarterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myFunction = new NodejsFunction(this, 'my-function', {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, `/../src/lambda/handlers/index.ts`),
      bundling: {
        minify: true,
        externalModules: ['aws-sdk']
      }
    });

    const api = new RestApi(this, "starter-api", {
      restApiName: 'Starter Service',
      description: 'This is a starter service'
    });

    const myFunctionIntegration = new LambdaIntegration(myFunction);

    api.root.addMethod("GET", myFunctionIntegration);
  }
}
