import { Request, Response } from 'express';
import { getTrailerUrls } from '../../src/controllers/trailer';
import TrailerService from '../../src/services/trailer';
import CacheService from "../../src/services/cache";
import DatabaseService from "../../src/services/database";
import { Pool } from 'pg';

jest.mock("../../src/services/cache");
jest.mock("../../src/services/database");

describe('getTrailerUrls', () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let cacheService: jest.Mocked<CacheService>;
    let databaseService: jest.Mocked<DatabaseService>;
    let pool: Pool;
    let mockTrailerService: TrailerService;
    let controller: (req: Request, res: Response) => Promise<void>;

    beforeEach(() => {
        mockRequest = { query: {} } as any;
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as any;
        cacheService = new CacheService() as jest.Mocked<CacheService>;
        pool = new Pool() as jest.Mocked<Pool>;
        databaseService = new DatabaseService(pool) as jest.Mocked<DatabaseService>;
        mockTrailerService = new TrailerService(cacheService, databaseService);
        controller = getTrailerUrls(mockTrailerService);
    });
    
    it('should first hit cache and return result if hit', async () => {
        // cache hit
        const cachedData = JSON.stringify(['link1.com', 'link2.com']);
        (cacheService.get as jest.Mock).mockResolvedValueOnce(cachedData);

        mockRequest.query.url = 'https://content.viaplay.se/pc-se/film/cache-hit-2022';

        await controller(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(['link1.com', 'link2.com']);
    });

    it('should go to postgres if cache miss and return result', async () => {
        // cache miss
        (cacheService.get as jest.Mock).mockResolvedValueOnce(null);
        
        // db hit
        (databaseService.getTrailerUrlsByUrlHash as jest.Mock).mockResolvedValue(['link1.com', 'link2.com']);
        
        mockRequest.query.url = 'https://content.viaplay.se/pc-se/film/cache-miss-2022';

        await controller(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(['link1.com', 'link2.com']);

    })

    it('it should return 404 if no trailers were found', async () => {
        // cache miss
        (cacheService.get as jest.Mock).mockResolvedValueOnce(null);
        
        // db miss
        (databaseService.getTrailerUrlsByUrlHash as jest.Mock).mockResolvedValue(null);

        mockRequest.query.url = 'https://content.viaplay.se/pc-se/film/super-miss-2022'; 
        
        await controller(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
    })

    it('should respond with 400 if url parameter is missing', async () => {
        await controller(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith("Missing 'url' parameter");
    });

    it('should respond with 400 if url parameter is invalid', async () => {
        mockRequest.query.url = 'http://invalid.com';

        await controller(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith("Invalid 'url' parameter");
    });

    it('should response with 500 on service error', async () => {
        mockRequest.query.url = 'https://content.viaplay.se/pc-se/film/arrival-2016';
        mockTrailerService.getTrailerUrls = jest.fn().mockRejectedValue(new Error('Service failure'));

        await controller(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith('Internal server error');
    })
});
