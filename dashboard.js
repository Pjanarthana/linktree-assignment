// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const linkList = document.getElementById('link-list');
    const addLinkForm = document.getElementById('add-link-form');
    const logoutButton = document.getElementById('logout');

    const API_BASE_URL = 'http://localhost:5000';  // Ensure this matches your backend's URL

    // Fetch and display user's links
    const fetchLinks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/links`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const links = await response.json();
                displayLinks(links);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch links:', errorData.message);
                alert('Failed to fetch links: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching links');
        }
    };

    // Display links in the DOM
    const displayLinks = (links) => {
        linkList.innerHTML = '';
        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.className = 'link-item';
            linkElement.innerHTML = `
                <h3>${link.title}</h3>
                <p>${link.url}</p>
                <button class="edit-link" data-id="${link._id}">Edit</button>
                <button class="delete-link" data-id="${link._id}">Delete</button>
            `;
            linkList.appendChild(linkElement);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-link').forEach(button => {
            button.addEventListener('click', handleEditLink);
        });
        document.querySelectorAll('.delete-link').forEach(button => {
            button.addEventListener('click', handleDeleteLink);
        });
    };

    // Handle adding a new link
    const handleAddLink = async (e) => {
        e.preventDefault();
        const title = document.getElementById('link-title').value;
        const url = document.getElementById('link-url').value;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/api/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, url })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Link added:', data);
                // Optionally, you can update the UI or clear the form fields
                document.getElementById('link-title').value = '';
                document.getElementById('link-url').value = '';
            } else {
                console.error('Failed to add link:', response.statusText);
                const text = await response.text();
                console.log("Response text:", text);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    };

    // Event listeners
    addLinkForm.addEventListener('submit', handleAddLink);
    logoutButton.addEventListener('click', handleLogout);
    document.getElementById('add-link-form').addEventListener('submit', handleAddLink);

    // Initial fetch of links
    fetchLinks();
});
