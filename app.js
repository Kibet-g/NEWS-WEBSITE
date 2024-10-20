const API_KEY = 'pub_567009403dda65bc0470d6956b8b5d6eb901e'; // Your actual API key
const API_URL = 'https://newsdata.io/api/1/news'; // Correct API URL for searching news
let currentQuery = 'pizza'; // Track the search term (e.g., pizza)

// Initialize fetching news on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentQuery);
});

function fetchNews(query) {
    currentQuery = query;

    // Ensure the API fetches only English news
    const url = `${API_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}&language=en`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.results) || data.results.length === 0) {
                throw new Error("No articles found");
            }
            // Filter out duplicate news by title
            const uniqueArticles = removeDuplicates(data.results, 'title');
            displayNews(uniqueArticles);
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
        `;

        newsItem.addEventListener('click', () => {
            openFullArticle(article);
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

function searchNews() {
    const query = document.getElementById('searchBar').value;
    fetchNews(query);
}

function searchNewsWithDate() {
    const query = document.getElementById('searchBar').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let url = `${API_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}&language=en`; // Fetch only English news
    if (startDate) {
        url += `&from_date=${startDate}`;
    }
    if (endDate) {
        url += `&to_date=${endDate}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data.results) || data.results.length === 0) {
                throw new Error("No articles found for the given date range");
            }
            // Filter out duplicates
            const uniqueArticles = removeDuplicates(data.results, 'title');
            displayNews(uniqueArticles);
        })
        .catch(error => {
            console.error("Error fetching news with date filter:", error.message);
            alert(`Failed to fetch news: ${error.message}`);
        });
}

function fetchTopHeadlines() {
    fetchNews('top headlines');
}

// Function to remove duplicates by a specific key (e.g., title)
function removeDuplicates(arr, key) {
    if (!Array.isArray(arr)) return arr; // Make sure it's an array
    const seen = new Set();
    return arr.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}
