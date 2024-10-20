NEWS-WEBSITE
A modern news website that fetches live news articles from an external API. The website allows users to search for news articles, filter them by date, and view news in various categories such as business, sports, technology, entertainment, and more. The application is designed with a clean UI and supports features like dynamic news fetching.

Table of Contents
Features
Technologies Used
Installation
Usage
APIs
License
Features
Search Functionality: Users can search for news articles based on keywords.
Date Filter: Users can filter news articles based on a specific date range.
Category-Based News: Browse news based on different categories such as Business, Sports, Technology, etc.

Responsive Design: Fully responsive design that works on mobile, tablet, and desktop devices.
Popup for Full Article: View full news article content in a popup window.
Duplicate Prevention: Filters out duplicate news articles based on the title.
Error Handling: Graceful handling of errors such as rate limits and fetch failures.
Technologies Used
HTML5/CSS3: Structure and styling of the webpage.
JavaScript (ES6): Client-side logic for fetching and displaying news articles.
SweetAlert2: For displaying news articles in a stylish popup.
NewsData.io API: External API used to fetch live news data.
Responsive Web Design: CSS media queries to ensure the site looks good on all screen sizes.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/Kibet-g/NEWS-WEBSITE.git
Navigate to the project directory:

bash
Copy code
cd NEWS-WEBSITE
Open the index.html file in your browser:

bash
Copy code
open index.html
(Optional) If you want to run the project on a local server, use any local development server like Live Server for VSCode.

Usage
Search News
Use the search bar at the top to enter keywords and search for related news articles.
Filter News by Date
Select a start date and an end date to filter news within a specific date range.
Browse Categories
Click on the category buttons such as Business, Sports, or Technology to view news articles from those categories.
View Full Article
Click on any article to view its details in a popup. For full content, you can click on the "Read full article" link which opens the original article in a new tab.
APIs
The application fetches live news articles using the NewsData.io API. To use this API:

Get your API key from the NewsData.io website.
Replace the API_KEY variable in app.js with your own API key.
javascript
Copy code
const API_KEY = 'your-api-key-here'; // Replace with your actual API key
Troubleshooting
Common Issues
429 Too Many Requests Error: This happens when you've exceeded the API's rate limit. You can resolve this by upgrading your API plan or adding a delay between requests to throttle them.
No Articles Found: If no news articles are fetched, ensure your query is valid and your API key is active.
License
This project is licensed under the MIT License - see the LICENSE file for details.
