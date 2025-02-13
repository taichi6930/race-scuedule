import {
    aws_ec2,
    aws_efs,
    aws_lambda_nodejs,
    aws_s3,
    CfnOutput,
    Duration,
    Stack,
    type StackProps,
} from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {
    Effect,
    PolicyStatement,
    Role,
    ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';
import * as dotenv from 'dotenv';

import { allowedEnvs, ENV } from './src/utility/env';

dotenv.config({ path: './.env' });

export class CdkRaceScheduleAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // VPCの作成
        const vpc = new aws_ec2.Vpc(this, 'RaceScheduleVpc', {
            maxAzs: 2,
        });

        // Lambdaのセキュリティグループの作成
        const lambdaSecurityGroup = new aws_ec2.SecurityGroup(
            this,
            'LambdaSG',
            {
                vpc: vpc,
                description: 'Lambda function security group',
                allowAllOutbound: true,
            },
        );

        // EFSのセキュリティグループの作成
        const efsSecurityGroup = new aws_ec2.SecurityGroup(this, 'EfsSG', {
            vpc: vpc,
            description: 'EFS security group',
        });

        // EFSの作成
        const fileSystem = new aws_efs.FileSystem(
            this,
            'RaceScheduleFileSystem',
            {
                vpc: vpc,
                lifecyclePolicy: aws_efs.LifecyclePolicy.AFTER_7_DAYS,
                securityGroup: efsSecurityGroup,
            },
        );

        // EFS アクセスポイントの作成
        const accessPoint = fileSystem.addAccessPoint('AccessPoint', {
            path: '/lambda',
            posixUser: {
                uid: '1001',
                gid: '1001',
            },
            createAcl: {
                ownerUid: '1001',
                ownerGid: '1001',
                permissions: '755',
            },
        });

        // 各サブネットにEFSのマウントターゲットを作成
        vpc.publicSubnets.forEach((subnet, index) => {
            new aws_efs.CfnMountTarget(this, `MountTarget${index.toString()}`, {
                fileSystemId: fileSystem.fileSystemId,
                subnetId: subnet.subnetId,
                securityGroups: [efsSecurityGroup.securityGroupId],
            });
        });

        // S3バケットの参照
        const bucket = aws_s3.Bucket.fromBucketName(
            this,
            'RaceScheduleBucket',
            'race-schedule-bucket',
        );

        // Lambda実行に必要なIAMロールを作成
        const lambdaRole = createLambdaExecutionRole(this, bucket, fileSystem);

        // Lambda関数を作成
        const lambdaFunction = new aws_lambda_nodejs.NodejsFunction(
            this,
            'RaceScheduleAppLambda',
            {
                architecture: lambda.Architecture.ARM_64,
                runtime: lambda.Runtime.NODEJS_20_X,
                entry: 'lib/src/index.ts',
                role: lambdaRole,
                vpc: vpc,
                environment: {
                    ENV: ENV ?? allowedEnvs.local,
                    JRA_CALENDAR_ID: process.env.JRA_CALENDAR_ID ?? '',
                    NAR_CALENDAR_ID: process.env.NAR_CALENDAR_ID ?? '',
                    KEIRIN_CALENDAR_ID: process.env.KEIRIN_CALENDAR_ID ?? '',
                    WORLD_CALENDAR_ID: process.env.WORLD_CALENDAR_ID ?? '',
                    AUTORACE_CALENDAR_ID:
                        process.env.AUTORACE_CALENDAR_ID ?? '',
                    BOATRACE_CALENDAR_ID:
                        process.env.BOATRACE_CALENDAR_ID ?? '',
                    TEST_CALENDAR_ID: process.env.TEST_CALENDAR_ID ?? '',
                    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL ?? '',
                    GOOGLE_PRIVATE_KEY: (
                        process.env.GOOGLE_PRIVATE_KEY ?? ''
                    ).replace(/\\n/g, '\n'),
                    MOUNT_PATH: '/mnt/efs',
                },
                timeout: Duration.seconds(90),
                memorySize: 1024,
                securityGroups: [lambdaSecurityGroup],
                filesystem: lambda.FileSystem.fromEfsAccessPoint(
                    accessPoint,
                    '/mnt/efs',
                ),
            },
        );

        // API Gatewayの設定
        const api = createApiGateway(this, lambdaFunction);

        // API Gateway エンドポイントの出力
        new CfnOutput(this, 'RaceScheduleAppApiGatewayEndpoint', {
            value: api.deploymentStage.urlForPath(),
        });
    }
}

function createApiGateway(
    scope: Construct,
    lambdaFunction: NodejsFunction,
): apigateway.LambdaRestApi {
    return new apigateway.LambdaRestApi(scope, 'RaceScheduleAppApi', {
        handler: lambdaFunction,
        defaultCorsPreflightOptions: {
            // すべてのオリジンを許可
            allowOrigins: apigateway.Cors.ALL_ORIGINS,

            // すべてのHTTPメソッドを許可
            allowMethods: ['GET', 'POST'],

            // すべてのヘッダーを許可
            allowHeaders: ['Content-Type', 'Authorization'],
            maxAge: Duration.minutes(1),
        },
        deployOptions: {
            stageName: 'v1',
        },
    });
}

function createLambdaExecutionRole(
    scope: Construct,
    bucket: aws_s3.IBucket,
    fileSystem: aws_efs.IFileSystem,
): Role {
    // Lambda 実行に必要な IAM ロールを作成
    const role = new Role(scope, 'LambdaExecutionRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    // Lambda が S3 バケットにアクセスできるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['s3:GetObject', 's3:PutObject'],
            resources: [bucket.bucketArn + '/*'],
        }),
    );

    // Lambdaのログ出力権限を追加
    role.addToPolicy(
        new PolicyStatement({
            actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
            ],
            effect: Effect.ALLOW,
            resources: ['*'],
        }),
    );

    // Lambda が EC2 の CreateNetworkInterface アクションを実行できるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['ec2:CreateNetworkInterface'],
            effect: Effect.ALLOW,
            resources: ['*'], // リソースを特定のサブネットに制限する場合は、適切なリソース ARN を指定します
        }),
    );

    // Lambda が EC2 の DescribeNetworkInterfaces アクションを実行できるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['ec2:DescribeNetworkInterfaces'],
            effect: Effect.ALLOW,
            resources: ['*'], // リソースを特定のネットワークインターフェースに制限する場合は、適切なリソース ARN を指定します
        }),
    );

    // Lambda が EC2 の DeleteNetworkInterface アクションを実行できるようにするポリシーステートメントを追加
    role.addToPolicy(
        new PolicyStatement({
            actions: ['ec2:DeleteNetworkInterface'],
            effect: Effect.ALLOW,
            resources: ['*'], // リソースを特定のネットワークインターフェースに制限する場合は、適切なリソース ARN を指定します
        }),
    );

    // EFSアクセス権限をLambdaに追加
    role.addToPolicy(
        new PolicyStatement({
            actions: [
                'elasticfilesystem:ClientMount',
                'elasticfilesystem:ClientWrite',
            ],
            resources: [fileSystem.fileSystemArn],
        }),
    );

    return role;
}
