//We have declared our API Key for the project to fetch data for the news
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

document.addEventListener('DOMContentLoaded', () => {
    fetchNews('general');
});
