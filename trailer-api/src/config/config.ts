import dotenv from 'dotenv';
dotenv.config()

export const PORT = process.env.PORT || 3000;

// PostgreSQL
export const POSTGRES_USER = process.env.POSTGRES_USER || 'defaultUser';
export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
export const POSTGRES_DB = process.env.POSTGRES_DB || 'defaultDB';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'defaultPassword';
export const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';

// Redis
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT || '6379';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// AWS
export const AWS_REGION = process.env.AWS_REGION || 'eu-central-1';
export const AWS_ENDPOINT = process.env.AWS_ENDPOINT || 'http://localhost:4566';
export const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || '000000000000';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'test';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'test';

// AWS - SQS
export const SQS_QUEUE_NAME = process.env.SQS_QUEUE_NAME || 'new-content';
export const SQS_QUEUE_URL = `${AWS_ENDPOINT}/${AWS_ACCOUNT_ID}/${SQS_QUEUE_NAME}`;