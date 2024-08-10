// Replace with your own credentials
const clientId = '906e4548faee4124a30d7ca0bed4ffb2';
const clientSecret = '2d759550b75340aeaf7be621c2ab5248';

// Get access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}

// Search for music tracks
async function searchTracks(query) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    return data.tracks.items;
}

// Display search results
function displayResults(tracks) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (tracks.length === 0) {
        searchResults.setAttribute("hidden", "");
    } else {
        searchResults.removeAttribute("hidden");

        tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.classList.add('track');
            trackElement.innerHTML = `
                <img src="${track.album.images[0].url}" alt="${track.name}" width="25">
                <i>${track.name}</i> by ${track.artists.map(artist => artist.name).join(', ')}
                <hr>
                <br>
            `;
            searchResults.appendChild(trackElement);
        });
    }
}

// Event listener for search
document.getElementById('searchInput').addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            const tracks = await searchTracks(query);
            displayResults(tracks);
        } else {
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '';
            searchResults.setAttribute("hidden", "");
        }
    }
});
