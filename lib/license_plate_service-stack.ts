import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sam from 'aws-cdk-lib/aws-sam';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as fs from 'fs';
import { Arn, ArnFormat } from 'aws-cdk-lib';

const IMAGE = process.env.IMAGE;
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;

export class LicensePlateServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (!IMAGE) {
      throw new Error("IMAGE environment variable not set");
    }

    if (!GOOGLE_MAPS_KEY) {
      throw new Error("GOOGLE_MAPS_KEY environment variable not set");
    }

    const serviceRoleArn = Arn.format({
      service: 'iam',
      resource: 'role',
      resourceName: 'service-role/AmazonSageMakerServiceCatalogProductsUseRole',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      region: '',
    }, this);

    const model = new sagemaker.CfnModel(this, 'Model', {
      executionRoleArn: serviceRoleArn,
      containers: [
        {
          image: IMAGE,
          mode: "SingleModel",
        }
      ]
    });

    const endpointconfig = new sagemaker.CfnEndpointConfig(this, 'EndpointConfig', {
      productionVariants: [
        {
          variantName: 'variant1',
          modelName: model.attrModelName,
          initialVariantWeight: 1,
          serverlessConfig: {
            maxConcurrency: 20,
            memorySizeInMb: 4096,
          },
        },
      ],
    });

    const endpoint = new sagemaker.CfnEndpoint(this, 'SMEndpoint', {
      endpointConfigName: endpointconfig.attrEndpointConfigName,
    });

    let swagger = fs.readFileSync('LicensePlateDemo-oas30.json').toString('utf8');
    swagger = swagger.replace("${EndpointName}", endpoint.attrEndpointName);
    swagger = swagger.replace("${GoogleMapsKey}", GOOGLE_MAPS_KEY);

    new sam.CfnApi(this, 'Api', {
      stageName: 'alpha',
      auth: {
        defaultAuthorizer: 'NONE',
      },
      definitionBody: JSON.parse(swagger),
      openApiVersion: '3.0.0',
      endpointConfiguration: {
        type: 'REGIONAL',
      },
    });
  }
}
