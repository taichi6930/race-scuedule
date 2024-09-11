import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dotenv from 'dotenv';
import {
  aws_lambda_nodejs,
  aws_apigateway,
  aws_s3,
  Stack,
  Duration,
  CfnOutput,
  StackProps,
} from 'aws-cdk-lib';
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as cdk from "aws-cdk-lib";

dotenv.config({ path: './app.env' });

export class CdkRaceScheduleAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3バケットの参照
    const bucket = aws_s3.Bucket.fromBucketName(
      this,
      'RaceScheduleBucket',
      'race-schedule-bucket',
    );

    // Lambda実行に必要なIAMロールを作成
    const role = new Role(this, "LambdaExecutionRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    // Lambda が S3 バケットにアクセスできるようにするポリシーステートメントを追加
    role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject'],
        resources: [bucket.bucketArn + '/*'],
      })
    );

    // Lambdaのログ出力権限を追加
    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        effect: Effect.ALLOW,
        resources: ["*"],
      })
    );

    // Lambda関数を作成
    const lambdaFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'RaceScheduleAppLambda',
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: 'lib/src/index.ts',
        role: role,
        environment: {
          ENV: process.env.ENV || 'local',
          NAR_CALENDAR_ID: process.env.NAR_CALENDAR_ID || '',
          GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL || '',
          GOOGLE_PRIVATE_KEY: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        },
        timeout: Duration.seconds(60),
        memorySize: 1024,
      },
    );

    // API Gatewayの設定
    const api = new apigateway.LambdaRestApi(this, 'RaceScheduleAppApi', {
      handler: lambdaFunction,
      defaultCorsPreflightOptions: {
        // すべてのオリジンを許可
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,

        // すべてのHTTPメソッドを許可
        allowMethods: ['GET', 'POST'],

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

    // API Gateway エンドポイントの出力
    new CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
      value: api.deploymentStage.urlForPath(),
    });

    // EventBridgeの設定
    // narRaceControllerのupdateRacesToCalendarメソッドを毎日実行する
    new events.Rule(
      this,
      'UpdateRaceDataListRule',
      {
        schedule: cdk.aws_events.Schedule.cron({
          minute: '00',
          hour: '4',
        }),
        targets: [
          new targets.ApiGateway(
            api,
            {
              path: '/nar/calendar',
              method: 'POST',
              stage: 'v1',
              // post Body に EventBridge のイベントを設定
              postBody: events.RuleTargetInput.fromObject({
                startDate: '2024-09-01',
                finishDate: '2024-09-03',
              }),
            }
          )
        ],
      }
    )
  }
}
