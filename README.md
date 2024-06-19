# Secrets Manager with Cognito

This repository demonstrates how to use AWS Cognito Identity Pools to acquire temporary AWS credentials and interact with AWS Secrets Manager. The example includes:

1. Setting up a Cognito Identity Pool.
2. Acquiring temporary AWS credentials using the Cognito Identity client.
3. Using the temporary credentials to create and manage secrets in AWS Secrets Manager.

## Features

- **Cognito Identity Pool**: Configure and use Cognito Identity Pools to manage user identities.
- **Temporary AWS Credentials**: Obtain temporary AWS credentials using the Cognito Identity client.
- **Secrets Manager Integration**: Create and manage secrets in AWS Secrets Manager using the temporary credentials.

## Prerequisites

- AWS Account
- Node.js and npm installed
- AWS CDK installed

## Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Deploy the CDK stack using `cdk deploy`.

## Usage

Run the TypeScript script to acquire temporary AWS credentials and create a secret in AWS Secrets Manager.

```sh
ts-node cognito-script.ts
```

## License

This project is licensed under the MIT License.
