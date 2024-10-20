const API_KEY = 'c1f1d1e5e474434cb9ae9a120207acfb'; // Replace with your actual API key
const API_URL = 'https://newsapi.org/v2/';
let currentPage = 1; // Track the current page for pagination
let currentCategory = 'general'; // Track the category



document.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentCategory);
    console.log (fetchNews)
});

// Infinite scrolling function
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        currentPage++;
        fetchNews(currentCategory, currentPage); // Fetch more news on scroll
    }
});

async function fetchNews(category, page = 1) {
    // Set the current category
    currentCategory = category; 
    console.log (`searching for: ${category, page = 1}`);
    const response = await fetch(`${API_URL}top-headlines?category=${category}&apiKey=${API_KEY}&country=us&page=${page}`);
    const data = await response.json();
    displayNews(data.articles, page);
}

async function searchNews() {
    currentPage = 1; // Reset the page
    const query = document.getElementById('searchBar').value;
    const response = await fetch(`${API_URL}everything?q=${query}&apiKey=${API_KEY}`);
    const data = await response.json();
    displayNews(data.articles);
}

// Function to filter news by date
async function searchNewsWithDate() {
    currentPage = 1; // Reset the page
    const query = document.getElementById('searchBar').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    const response = await fetch(`${API_URL}everything?q=${query}&from=${startDate}&to=${endDate}&apiKey=${API_KEY}`);
    const data = await response.json();
    displayNews(data.articles);
}

function displayNews(articles, page = 1) {
    const newsContainer = document.getElementById('newsContainer');
    
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

        // SweetAlert popup for full article display
        newsItem.addEventListener('click', () => {
            openFullArticle(article);
        });

        // "Read More" button to open full article in a new tab
        newsItem.querySelector('.read-more').addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the SweetAlert popup
            window.open(article.url, '_blank'); // Open full article in a new tab
        });

        newsContainer.appendChild(newsItem);
    });
}

// Function to open the full article using SweetAlert with full content displayed
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
        scrollbarPadding: false, // Allow scrolling
        heightAuto: false // In case of long content, modal remains scrollable
    });
}