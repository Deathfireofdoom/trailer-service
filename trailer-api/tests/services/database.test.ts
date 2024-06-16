import { Pool } from 'pg';
import DatabaseService from '../../src/services/database';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn()
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('DatabaseService', () => {
  let pool: Pool;
  let databaseService: DatabaseService;

  beforeEach(() => {
    pool = new Pool();
    databaseService = new DatabaseService(pool);
  });

  it('should return an array of trailer URLs if found', async () => {
    const mockTrailers = ['http://trailer1.com', 'http://trailer2.com'];
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ trailers: mockTrailers }] });

    const result = await databaseService.getTrailerUrlsByUrlHash('somehash');
    expect(result).toEqual(mockTrailers);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT trailers FROM trailers WHERE url_hash = $1',
      ['somehash']
    );
  });

  it('should return undefined if no trailers are found', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const result = await databaseService.getTrailerUrlsByUrlHash('somehash');
    expect(result).toBeUndefined();
  });

  it('should throw an error if the query fails', async () => {
    const error = new Error('Query failed');
    (pool.query as jest.Mock).mockRejectedValueOnce(error);

    await expect(databaseService.getTrailerUrlsByUrlHash('somehash'))
      .rejects.toThrow('Query failed');
  });
});
