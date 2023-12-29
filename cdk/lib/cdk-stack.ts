import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaWebApi = new LambdaDockerWebApp(this, "LambdaDockerWebApp");
  }
}

class LambdaDockerWebApp extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new lambda.DockerImageFunction(this, "Handler", {
      code: lambda.DockerImageCode.fromImageAsset("../app"),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      role: new iam.Role(this, "DockerImageFunctionRole", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole",
          ),
        ],
      }),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ["secretsmanager:GetSecretValue"],
          resources: ["arn:aws:secretsmanager:ap-northeast-1:*:*"],
        }),
      ],
    });

    const api = new HttpApi(this, "HttpApi", {
      apiName: "HttpApi",
      defaultIntegration: new HttpLambdaIntegration("Integration", handler),
    });
  }
}
