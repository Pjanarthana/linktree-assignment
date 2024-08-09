document.addEventListener('DOMContentLoaded', () => {
    const linkList = document.getElementById('link-list');
    const addLinkForm = document.getElementById('add-link-form');
    const logoutButton = document.getElementById('logout');

    // Fetch and display user's links
    const fetchLinks = async () => {
        try {
            const response = await fetch('/api/links', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const links = await response.json();
                displayLinks(links);
            } else {
                console.error('Failed to fetch links');
            }
        } catch (error) {
            console.error('Error:', error);
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
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, url })
            });

            if (response.ok) {
                addLinkForm.reset();
                fetchLinks();
            } else {
                console.error('Failed to add link');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle editing a link
    const handleEditLink = async (e) => {
        const linkId = e.target.getAttribute('data-id');
        const linkElement = e.target.closest('.link-item');
        const currentTitle = linkElement.querySelector('h3').textContent;
        const currentUrl = linkElement.querySelector('p').textContent;

        const newTitle = prompt('Enter new title:', currentTitle);
        const newUrl = prompt('Enter new URL:', currentUrl);

        if (newTitle && newUrl) {
            try {
                const response = await fetch(`/api/links/${linkId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ title: newTitle, url: newUrl })
                });

                if (response.ok) {
                    fetchLinks();
                } else {
                    console.error('Failed to update link');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // Handle deleting a link
    const handleDeleteLink = async (e) => {
        const linkId = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this link?')) {
            try {
                const response = await fetch(`/api/links/${linkId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    fetchLinks();
                } else {
                    console.error('Failed to delete link');
                }
            } catch (error) {
                console.error('Error:', error);
            }
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

    // Initial fetch of links
    fetchLinks();
});