const apiKey = 'c1f1d1e5e474434cb9ae9a120207acfb'; // Replace with your actual News API key
const baseUrl = 'https://newsapi.org/v2';

// Global array to store fetched articles
let articles = [];

// Search functionality: When the user clicks the search button, we fetch news articles based on the search term
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchBar').value;
    if (query) {
        searchArticles(query);
    }
});

// Search for news articles using the News API
function searchArticles(query) {
    console.log(`Searching for: ${query}`);
    const url = `${baseUrl}/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                articles = data.articles;
                displayArticles(articles);
            } else {
                displayNoResultsFound();
            }
        })
        .catch(error => console.error('Error fetching articles:', error));

    function displayNoResultsFound() {
        const articleList = document.getElementById('article-list');
        articleList.innerHTML = '<p>No articles found. Please try a different search.</p>';
    }
}

// Fetch top headlines when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchTopHeadlines();
});

function fetchTopHeadlines() {
    const url = `${baseUrl}/top-headlines?country=us&apiKey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.articles) {
                articles = data.articles;
                displayArticles(articles);
            } else {
                console.error('No articles found.');
            }
        })
        .catch(error => console.error('Error fetching top headlines:', error));
}

// Display news articles on the page
function displayArticles(articles) {
    const articleList = document.getElementById('article-list');
    articleList.innerHTML = ''; // Clear existing articles

    articles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';

        const articleImage = article.urlToImage
            ? article.urlToImage
            : 'https://placehold.co/200x300';  // Placeholder image if no image is available

        articleCard.innerHTML = `
            <img src="${articleImage}" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description ? article.description.substring(0, 100) + '...' : ''}</p>
        `;
        articleCard.addEventListener('click', () => showArticleDetails(article));
        articleList.appendChild(articleCard);
    });
}

// Show details of a selected article
function showArticleDetails(article) {
    const articleDetails = document.getElementById('article-details');
    const articleImage = article.urlToImage
        ? article.urlToImage
        : 'https://placehold.co/300x450';

    articleDetails.innerHTML = `
        <h2>${article.title}</h2>
        <img src="${articleImage}" alt="${article.title}">
        <p>${article.content || article.description || 'No full content available.'}</p>
        <a href="${article.url}" target="_blank">Read the full article</a>
    `;
}

// Search bar functionality to filter articles
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm)
    );
    displayArticles(filteredArticles);
});

// Toggle between light and dark mode
const toggleSwitch = document.getElementById('theme-switch');
toggleSwitch.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');  // Toggle dark mode class on body
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    toggleSwitch.textContent = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleSwitch.textContent = 'Light Mode';
    }
    fetchTopHeadlines();
});
