import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {
  aws_lambda_nodejs,
  aws_apigateway,
  Stack,
  Duration,
  CfnOutput,
  StackProps,
} from 'aws-cdk-lib';

export class CdkRaceScheduleAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda関数を作成
    const lambdaFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'RaceScheduleAppLambda',
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: 'lib/src/index.ts',
        environment: {
          NODE_ENV: 'production',
        },
      }
    );

    // API Gatewayの設定
    const api = new apigateway.LambdaRestApi(this, 'RaceScheduleAppApi', {
      handler: lambdaFunction,
      defaultCorsPreflightOptions: {
        // すべてのオリジンを許可
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,

        // すべてのHTTPメソッドを許可
        allowMethods: ['GET', 'POST', 'DELETE'],

        // すべてのヘッダーを許可
        allowHeaders: [
          'Content-Type',
          'Authorization',
        ],
        maxAge: Duration.minutes(1),
      },
      deployOptions: {
        stageName: 'v1',
      },
    });

    /**
     * API Gateway エンドポイントの出力
     */
    new CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
      value: api.deploymentStage.urlForPath(),
    });
  }
}
