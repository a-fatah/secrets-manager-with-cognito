#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';

const app = new App();

new BackendStack(app, "BackendStack");
