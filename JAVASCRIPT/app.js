const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Fetch API key from Vercel environment variables
const API_URL = 'https://newsapi.org/v2/';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy server URL
let currentPage = 1; // Track the current page for pagination
let currentCategory = 'general'; // Track the category

document.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentCategory);
});

// Infinite scrolling function
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        currentPage++;
        fetchNews(currentCategory, currentPage); // Fetch more news on scroll
    }
});

async function fetchNews(category, page = 1) {
    currentCategory = category; // Set the current category
    try {
        const response = await fetch(`${CORS_PROXY}${API_URL}top-headlines?category=${category}&apiKey=${API_KEY}&country=us&page=${page}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayNews(data.articles, page);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

async function searchNews() {
    currentPage = 1; // Reset the page
    const query = document.getElementById('searchBar').value;
    try {
        const response = await fetch(`${CORS_PROXY}${API_URL}everything?q=${query}&apiKey=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
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

    try {
        const response = await fetch(`${CORS_PROXY}${API_URL}everything?q=${query}&from=${startDate}&to=${endDate}&apiKey=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
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
