# Service

API Gateway fronting serverless inference and map image generation APIs

![](https://johnespe-open-lpr-plate-detection-site.s3.amazonaws.com/diagram.png)

# Model

The license plate detection and OCR model

https://github.com/JohnEspenhahn/PyLicensePlateModel

# Deploying

Setup CDK: https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html

Deploy the model image. Then populate build.sh from build.template.sh. Finally execute `./build.sh` to deploy

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
