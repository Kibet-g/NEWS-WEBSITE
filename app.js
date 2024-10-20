const API_KEY = 'c1f1d1e5e474434cb9ae9a120207acfb'; // Replace with your actual API key
const API_URL = 'https://newsapi.org/v2/';
let currentPage = 1; // Track the current page for pagination
let currentCategory = 'general'; // Track the category

document.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentCategory);
});

window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        currentPage++;
        fetchNews(currentCategory, currentPage);
    }
});

function fetchNews(category, page = 1) {
    currentCategory = category;
    const url = `${API_URL}top-headlines?category=${encodeURIComponent(category)}&apiKey=${API_KEY}&country=us&page=${page}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.articles || data.articles.length === 0) {
                throw new Error("No articles found");
            }
            displayNews(data.articles, page);
        })
        .catch(error => {
            console.error("Error fetching news:", error.message);
            alert(`Failed to fetch news: ${error.message}`);
        });
}

function searchNews() {
    currentPage = 1;
    const query = document.getElementById('searchBar').value;
    const url = `${API_URL}everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.articles || data.articles.length === 0) {
                throw new Error("No articles found");
            }
            displayNews(data.articles);
        })
        .catch(error => {
            console.error("Error searching news:", error.message);
            alert(`Failed to search news: ${error.message}`);
        });
}

function searchNewsWithDate() {
    currentPage = 1;
    const query = document.getElementById('searchBar').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    const url = `${API_URL}everything?q=${encodeURIComponent(query)}&from=${startDate}&to=${endDate}&apiKey=${API_KEY}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.articles || data.articles.length === 0) {
                throw new Error("No articles found");
            }
            displayNews(data.articles);
        })
        .catch(error => {
            console.error("Error filtering news by date:", error.message);
            alert(`Failed to filter news by date: ${error.message}`);
        });
}

function displayNews(articles, page = 1) {
    const newsContainer = document.getElementById('article-list');

    if (!newsContainer) {
        console.error('newsContainer element not found');
        return;
    }

    if (page === 1) {
        newsContainer.innerHTML = ''; // Clear news if it's a new search or category change
    }

    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        newsItem.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description ? article.description.substring(0, 100) + '...' : ''}</p>
            <button class="read-more">Read More</button>
        `;

        newsItem.addEventListener('click', () => {
            openFullArticle(article);
        });

        newsItem.querySelector('.read-more').addEventListener('click', (event) => {
            event.stopPropagation();
            window.open(article.url, '_blank');
        });

        newsContainer.appendChild(newsItem);
    });
}

function openFullArticle(article) {
    const fullContent = article.content || article.description || 'No content available';

    Swal.fire({
        title: article.title || 'No title available',
        html: `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="Article Image" style="width:100%; max-height:300px; object-fit:cover; border-radius:5px;">
            <p style="text-align: left;">${fullContent.replace(/\[\+\d+ chars\]/, '')}</p>
            <a href="${article.url}" target="_blank" style="color: #007bff; text-decoration: none;">Read full article</a>
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