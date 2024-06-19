#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const backend_stack_1 = require("../lib/backend-stack");
const app = new aws_cdk_lib_1.App();
new backend_stack_1.BackendStack(app, "BackendStack");
