import axios from 'axios';

class HttpService {
    public async fetchUrl(url: string, headers?: Record<string, string>): Promise<any> {
        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error('HTTP fetch error:', error);
            throw error;
        }
    }
}

export default HttpService;