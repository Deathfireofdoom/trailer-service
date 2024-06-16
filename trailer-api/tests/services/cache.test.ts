// Mock the ioredis module
jest.mock('ioredis', () => {
    const mRedis = {
      get: jest.fn(),
      set: jest.fn(),
      on: jest.fn()
    };
    return jest.fn(() => mRedis);
  });
  
  import Redis from 'ioredis';
  import CacheService from '../../src/services/cache';
  
  describe('CacheService', () => {
    let redisClient: Redis;
    let cacheService: CacheService;
  
    beforeEach(() => {
      redisClient = new Redis();
      cacheService = new CacheService();
    });
  
    it('should retrieve the value for a given key', async () => {
      const mockValue = 'cachedData';
      (redisClient.get as jest.Mock).mockResolvedValue(mockValue);
  
      const result = await cacheService.get('someKey');
      expect(result).toEqual(mockValue);
      expect(redisClient.get).toHaveBeenCalledWith('someKey');
    });
  
    it('should return null when the key does not exist', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
  
      const result = await cacheService.get('unknownKey');
      expect(result).toBeNull();
      expect(redisClient.get).toHaveBeenCalledWith('unknownKey');
    });
  
    it('should set the value with a TTL', async () => {
      (redisClient.set as jest.Mock).mockResolvedValue('OK');
  
      await cacheService.set('key', 'value', 3600);
      expect(redisClient.set).toHaveBeenCalledWith('key', 'value', 'EX', 3600);
    });
  
    it('should handle errors during set operations', async () => {
      const error = new Error('Failed to set value');
      (redisClient.set as jest.Mock).mockRejectedValue(error);
  
      await expect(cacheService.set('key', 'value', 3600))
        .rejects.toThrow('Failed to set value');
    });
  });
  