import { CognitoIdentityClient, GetOpenIdTokenForDeveloperIdentityCommand, GetCredentialsForIdentityCommand } from "@aws-sdk/client-cognito-identity";
import { SecretsManagerClient, CreateSecretCommand } from "@aws-sdk/client-secrets-manager";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    REGION: z.string(),
    IDENTITY_POOL_ID: z.string(),
    DEVELOPER_PROVIDER_NAME: z.string(),
    DEVELOPER_USER_IDENTIFIER: z.string()
});

const env = envSchema.parse(process.env);

const REGION = env.REGION;
const IDENTITY_POOL_ID = env.IDENTITY_POOL_ID;
const DEVELOPER_PROVIDER_NAME = env.DEVELOPER_PROVIDER_NAME;
const DEVELOPER_USER_IDENTIFIER = env.DEVELOPER_USER_IDENTIFIER;

const cognitoClient = new CognitoIdentityClient({ region: REGION });

async function getTemporaryCredentials() {
    try {
        // Step 1: Get OpenID token for developer identity
        const getOpenIdTokenCommand = new GetOpenIdTokenForDeveloperIdentityCommand({
            IdentityPoolId: IDENTITY_POOL_ID,
            Logins: {
                [DEVELOPER_PROVIDER_NAME]: DEVELOPER_USER_IDENTIFIER
            }
        });

        console.log("Sending GetOpenIdTokenForDeveloperIdentityCommand...");
        const openIdTokenResponse = await cognitoClient.send(getOpenIdTokenCommand);
        console.log("Received OpenID token response:", openIdTokenResponse);
        const identityId = openIdTokenResponse.IdentityId;
        const token = openIdTokenResponse.Token;

        if (!identityId || !token) {
            throw new Error("Failed to get OpenID token for developer identity");
        }


        // Step 2: Get AWS credentials for the identity
        const getCredentialsCommand = new GetCredentialsForIdentityCommand({
            IdentityId: identityId,
            Logins: {
                'cognito-identity.amazonaws.com': token
            }
        });

        console.log("Sending GetCredentialsForIdentityCommand...");
        const credentialsResponse = await cognitoClient.send(getCredentialsCommand);
        console.log("Received AWS credentials response:", credentialsResponse);
        const credentials = credentialsResponse.Credentials;

        if (!credentials) {
            throw new Error("Failed to get AWS credentials for identity");
        }

        console.log("Temporary AWS Credentials:", credentials);
        const { AccessKeyId, SecretKey, SessionToken } = credentials;
        // Decode the JWT token to extract the sub claim
        const tokenPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const subClaim = tokenPayload.sub;

        if (!subClaim) {
            throw new Error("Failed to extract sub claim from token");
        }

        // Step 3: Use the temporary credentials to create a secret
        const secretsManagerClient = new SecretsManagerClient({
            credentials: {
                accessKeyId: AccessKeyId!,
                secretAccessKey: SecretKey!,
                sessionToken: SessionToken
            }
        })

        const createSecretCommand = new CreateSecretCommand({
            Name: `projectpulse/dev/${DEVELOPER_USER_IDENTIFIER}/new-test-secret3`,
            SecretString: JSON.stringify({ key: "hello" }),
            Tags: [
                {
                    Key: "Owner",
                    Value: subClaim
                }
            ]
        });

        console.log("Sending CreateSecretCommand...");
        const createSecretResponse = await secretsManagerClient.send(createSecretCommand);
        console.log("Received Create Secret response:", createSecretResponse);
        console.log("Create Secret Response:", createSecretResponse);
    } catch (error) {
        console.error("Error getting temporary credentials:", error);
    }
}

getTemporaryCredentials();
