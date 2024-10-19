//We have declared our API Key for the project to fetch data for the news
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

document.addEventListener('DOMContentLoaded', () => {
    fetchNews('general');
});
// This function fetches news articles based on the provided category and displays them on the page
async function fetchNews(category){
    const response = await fetch(`${API_URL}top-headlines?category=${category}&apiKey=${API_KEY}&country=ke`);
    const data = await response.json();
    displayNews(data.articles);
    // This function displays the news articles on the page and displays them on the page itself if the category is by seach
}

// This function opens a new tab to display the full article when the read more button is clicked
async function searchNews() {
    const query = document.getElementById('searchBar').value;
    const response = await fetch(`${API_URL}everything?q=${query}&apiKey=${API_KEY}`);
    const data = await response.json();
    displayNews(data.articles);
}
function displayNews(articles) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        newsItem.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description ? article.description.substring(0, 100) + '...' : ''}</p>
            <button class="read-more">Read More</button>
        `;

        // Attach the click event to the read more button
        newsItem.querySelector('.read-more').addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the news item click event
            openFullArticle(article);
        });

        newsContainer.appendChild(newsItem);
    });
}
