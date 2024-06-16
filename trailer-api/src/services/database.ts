import { Pool } from "pg";
import { IDatabaseService } from "../interfaces/IDatabaseService";

class DatabaseService implements IDatabaseService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    public async getTrailerUrlsByUrlHash(urlHash: string): Promise<string[] | undefined> {
        const query = 'SELECT trailers FROM trailers WHERE url_hash = $1';
        try {
            const { rows } = await this.pool.query(query, [urlHash]);
            if (rows.length > 0) {
                return rows[0].trailers; 
            }
            return undefined;
        } catch (err) {
            console.error('Database query error:', err);
            throw err;
        }
    }


    public async migrate() {
        const client = await this.pool.connect();
    
        try {
            await client.query(`CREATE TABLE IF NOT EXISTS trailers (
                id SERIAL PRIMARY KEY,
                url_hash VARCHAR(255) NOT NULL UNIQUE,
                trailers TEXT[],
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );`);
    
            console.log('Migration completed successfully.');
        } catch (err) {
            console.error('Error during migration:', err);
            throw err;
        } finally {
            client.release();
        }
    }
}

export default DatabaseService;