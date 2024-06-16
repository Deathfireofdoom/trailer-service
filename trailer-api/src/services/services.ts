
import CacheService from './cache';
import DatabaseService from './database';
import TrailerService from './trailer';
import { Pool } from 'pg';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '../config/config';

// pooling the db connections 
const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: parseInt(POSTGRES_PORT),
});

const cacheService = new CacheService();
const databaseService = new DatabaseService(pool);
const trailerService = new TrailerService(cacheService, databaseService);

export { cacheService, databaseService, trailerService };
