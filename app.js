const API_KEY = 'pub_567009403dda65bc0470d6956b8b5d6eb901e'; // Your actual API key
const API_URL = 'https://newsdata.io/api/1/news'; // Correct API URL for searching news
let currentQuery = 'pizza'; // Track the search term (e.g., pizza)

// Initialize fetching news on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentQuery);
});

function fetchNews(query) {
    currentQuery = query;

    // Construct URL with only essential parameters
    const url = `${API_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.results || data.results.length === 0) {
                throw new Error("No articles found");
            }
            displayNews(data.results);
        })
        .catch(error => {
            console.error("Error fetching news:", error.message);
            alert(`Failed to fetch news: ${error.message}`);
        });
}

function displayNews(articles) {
    const newsContainer = document.getElementById('article-list');

    if (!newsContainer) {
        console.error('newsContainer element not found');
        return;
    }

    newsContainer.innerHTML = ''; // Clear news for new search

    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        newsItem.innerHTML = `
            <img src="${article.image_url || 'https://via.placeholder.com/300'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description ? article.description.substring(0, 100) + '...' : ''}</p>
            <button class="read-more">Read More</button>
        `;

        newsItem.addEventListener('click', () => {
            openFullArticle(article);
        });

        newsItem.querySelector('.read-more').addEventListener('click', (event) => {
            event.stopPropagation();
            window.open(article.link, '_blank');
        });

        newsContainer.appendChild(newsItem);
    });
}

function openFullArticle(article) {
    const fullContent = article.content || article.description || 'No content available';

    Swal.fire({
        title: article.title || 'No title available',
        html: `
            <img src="${article.image_url || 'https://via.placeholder.com/300'}" alt="Article Image" style="width:100%; max-height:300px; object-fit:cover; border-radius:5px;">
            <p style="text-align: left;">${fullContent}</p>
            <a href="${article.link}" target="_blank" style="color: #007bff; text-decoration: none;">Read full article</a>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        width: 600,
        padding: '3em',
        background: '#fff',
        scrollbarPadding: false,
        heightAuto: false
    });
}
