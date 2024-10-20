// News API key and base URL
const API_KEY = 'c1f1d1e5e474434cb9ae9a120207acfb'; // Replace with your actual API key
const API_URL = 'https://newsapi.org/v2';

// Global array to store fetched news articles
let articles = [];

// Event listener for search button click
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchBar').value;
    if (query) {
        searchNews(query);
    }
});

// Search for news using the News API
function searchNews(query) {
    console.log(`Searching for news: ${query}`);
    const url = `${API_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                articles = data.articles;
                displayNews(articles);
            } else {
                displayNoResultsFound();
            }
        })
        .catch(error => console.error('Error fetching news:', error));
}

// Function to handle no results found
function displayNoResultsFound() {
    const newsList = document.getElementById('newsContainer');
    newsList.innerHTML = '<p>No news articles found. Please try a different search.</p>';
}

// Function to display news articles on the page
function displayNews(articles) {
    const newsList = document.getElementById('newsContainer');
    newsList.innerHTML = ''; // Clear the previous results

    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-item';

        const articleImage = article.urlToImage
            ? article.urlToImage
            : 'https://via.placeholder.com/200x300';

        newsCard.innerHTML = `
            <img src="${articleImage}" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description ? article.description.substring(0, 100) + '...' : ''}</p>
            <button class="read-more">Read More</button>
        `;

        // Add event listener to open full article in a new tab
        newsCard.querySelector('.read-more').addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering other click events
            window.open(article.url, '_blank'); // Open full article in a new tab
        });

        newsList.appendChild(newsCard);
    });
}

// On DOM content loaded, you can fetch top headlines or specific category news if needed
document.addEventListener("DOMContentLoaded", () => {
    fetchTopHeadlines();
});

function fetchTopHeadlines() {
    const url = `${API_URL}/top-headlines?country=us&apiKey=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.articles) {
                articles = data.articles;
                displayNews(articles);
            } else {
                console.error('No headlines found.');
            }
        })
        .catch(error => console.error('Error fetching top headlines:', error));
}
