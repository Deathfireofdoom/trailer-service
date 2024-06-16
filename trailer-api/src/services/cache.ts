import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config/config';
import { ICacheService } from '../interfaces/ICacheService';

class CacheService implements ICacheService {
    private redisClient: Redis;

    constructor() {
        this.redisClient = new Redis(
            {
            host: REDIS_HOST,
            port: parseInt(REDIS_PORT),
            password: REDIS_PASSWORD
        });

        // adding basic basic logging - more for debug
        this.redisClient.on('error', (err) => {
            console.log('redis error: ', err);
        })
    }

    public async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    public async set(key: string, value: string, ttl: number = 3600): Promise<void> {
        await this.redisClient.set(key, value, 'EX', ttl);
    }
}

export default CacheService;