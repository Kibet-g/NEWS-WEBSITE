const API_KEY = 'c1f1d1e5e474434cb9ae9a120207acfb'; // Replace with your actual API key
const API_URL = 'https://newsapi.org/v2/';

document.addEventListener('DOMContentLoaded', () => {
    fetchNews('general');
});

async function fetchNews(category) {
    const response = await fetch(`${API_URL}top-headlines?category=${category}&apiKey=${API_KEY}&country=us`);
    const data = await response.json();
    displayNews(data.articles);
}

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
// This function populates a popup with the full article content when a user clicks on the "Read More" button in a news item.
function openFullArticle(article) {
    const popup = document.getElementById('fullArticlePopup');
    const fullArticleTitle = document.getElementById('fullArticleTitle');
    const fullArticleImage = document.getElementById('fullArticleImage');
    const fullArticleDescription = document.getElementById('fullArticleDescription');

    // Populate full article with data
    fullArticleTitle.innerText = article.title;
    fullArticleImage.src = article.urlToImage || 'https://via.placeholder.com/300';
    fullArticleDescription.innerText = article.content || article.description || 'No content available';

    // Show the popup
    popup.style.display = 'flex';
}

// Close Popup Functionality
const closePopupBtn = document.querySelector('.close-popup');
closePopupBtn.addEventListener('click', closeFullArticle);

function closeFullArticle() {
    const popup = document.getElementById('fullArticlePopup');
    popup.style.display = 'none';
}

// Close the popup when clicking outside of the content
const popup = document.getElementById('fullArticlePopup');
popup.addEventListener('click', (event) => {
    if (event.target === popup) {
        closeFullArticle();
    }
});
