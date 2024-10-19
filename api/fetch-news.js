// /api/fetch-news.js

export default async function handler(req, res) {
    const { category, page } = req.query;
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Securely access API key from environment variables
    const API_URL = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&page=${page}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch news, status: ${response.status}`);
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
