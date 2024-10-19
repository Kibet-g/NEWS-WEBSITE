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
}
// This function fetches news articles based on a user's search query and displays them on the webpage.
async function searchNews(){
    const query= document.getElementById('searchBar').value;
    const response = await fetch(`${API_URL}everything?q=${query}&apiKey=${API_KEY}&language=en`);
    const data = await response.json();
    displayNews(data.articles);
}

function displayNews(articles){
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('newsItem');
        const newsTitle = document.createElement('h2');
        newsTitle.textContent = article.title;
        const newsAuthor = document.createElement('p');

        if(article.author){
            newsAuthor.textContent = `Author: ${article.author}`;
        } else {
            newsAuthor.textContent = 'Author: Unknown';
        }
        const newsDescription = document.createElement('p');
        if(article.description){
            newsDescription.textContent = article.description;
        } else {
            newsDescription.textContent = 'No description available';
        }
        const newsImage = document.createElement('img');
        if(article.urlToImage){
            newsImage.src = article.urlToImage;
        } else {
            newsImage.src = 'https://via.placeholder.com/150';
        }
        const newsLink = document.createElement('a');
        newsLink.href = article.url;
        newsLink.textContent = 'Read More';
        newsItem.appendChild(newsTitle);
        newsItem.appendChild(newsAuthor);
        newsItem.appendChild(newsDescription);
        newsItem.appendChild(newsImage);

    }
)}

// Event listener for the search button click

document.getElementById('searchBtn').addEventListener('click', searchNews);

// Event listener for the category dropdown change

document.getElementById('categorySelect').addEventListener('change', (e) => {
    fetchNews(e.target.value);
});

// Event listener for the clear search button click

document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('searchBar').value = '';
});

// Event listener for the news item click

document.getElementById('newsContainer').addEventListener('click', (e) => {
    if(e.target.tagName === 'A'){
        window.open(e.target.href, '_blank');
    }
});

// Event listener for the news item hover

document.getElementById('newsContainer').addEventListener('mouseenter', (e) => {
    if(e.target.tagName === 'DIV'){
        e.target.classList.add('hover');
    }
});

document.getElementById('newsContainer').addEventListener('mouseleave', (e) => {
    if(e.target.tagName === 'DIV'){
        e.target.classList.remove('hover');
    }
});

// Event listener for the news item double click

document.getElementById('newsContainer').addEventListener('dblclick', (e) => {
    if(e.target.tagName === 'DIV'){
        const link = document.createElement('a');
        link.href = e.target.querySelector('a').href;
        link.textContent = 'Save to Bookmarks';
        link.target = '_blank';
        e.target.appendChild(link);
    }
});

// Event listener for the news item right click

document.getElementById('newsContainer').addEventListener('contextmenu', (e) => {
    if(e.target.tagName === 'DIV'){
        e.preventDefault();
        const menu = document.createElement('ul');
        const shareOption = document.createElement('li');
        shareOption.textContent = 'Share';
        menu.appendChild(shareOption);
        shareOption.addEventListener('click', () => {
            const shareLink = e.target.querySelector('a').href;
            navigator.clipboard.writeText(shareLink);
            alert('Link copied to clipboard');
        });
        const deleteOption = document.createElement('li');
        deleteOption.textContent = 'Delete';
        menu.appendChild(deleteOption);
        deleteOption.addEventListener('click', () => {
            e.target.parentNode.removeChild(e.target);
        });
        menu.style.position = 'absolute';
        menu.style.top = `${e.clientY}px`;
        menu.style.left = `${e.clientX}px`;
        document.body.appendChild(menu);
        setTimeout(() => {
            menu.remove();
        }, 2000);
        return false;
    }});

