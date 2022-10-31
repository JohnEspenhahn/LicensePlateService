
# Deploy the model image to get value https://github.com/JohnEspenhahn/PyLicensePlateModel
# Ex: 991122334455.dkr.ecr.us-east-1.amazonaws.com/sagemaker-studio-d-dddcccbbbaaa:default-1666329559676
export IMAGE=''

# https://developers.google.com/maps/documentation/javascript/get-api-key
export GOOGLE_MAPS_KEY=''

cdk deploy
